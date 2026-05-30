/**
 * 乐乐小岛 Cloudflare Pages Function
 *
 * 全功能 API 处理器：
 *   - 认证/用户 → D1 数据库（表: users, sessions, game_data）
 *   - AI 功能 → 代理到 Deepseek API
 *   - 无 D1 绑定 → 自动降级为离线模式
 */

const DEEPSEEK_BASE = 'https://api.deepseek.com/v1';

// ===== 工具函数 =====

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** 使用 Web Crypto 做密码哈希（兼容 Workers 运行时） */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'lele-island-salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** 从 Authorization header 提取 token */
function extractToken(request) {
  const auth = request.headers.get('Authorization') || '';
  return auth.replace('Bearer ', '').trim();
}

/** 根据 token 查找用户（返回 username + display_name + grade） */
async function getUserFromToken(db, token) {
  if (!db || !token) return null;
  const session = await db.prepare('SELECT username FROM sessions WHERE token = ?').bind(token).first();
  if (!session) return null;
  const user = await db.prepare('SELECT username, display_name, grade FROM users WHERE username = ?').bind(session.username).first();
  return user || null;
}

// ===== AI 代理 =====

/** DeepSeek 调用（支持多模态：userMessage 可以是 string 或 { text, image, mimeType }） */
async function askDeepseek(systemPrompt, userMessage, apiKey, maxTokens = 500, visionModel) {
  const hasImage = typeof userMessage === 'object' && userMessage !== null && userMessage.image;
  // 多模态内容构建
  let content;
  if (hasImage) {
    const mime = userMessage.mimeType || 'image/png';
    content = [
      { type: 'text', text: userMessage.text || '' },
      { type: 'image_url', image_url: { url: `data:${mime};base64,${userMessage.image}` } },
    ];
  } else {
    content = typeof userMessage === 'string' ? userMessage : (userMessage?.text || JSON.stringify(userMessage));
  }

  // 有图片时使用视觉模型（可通过 env 配置），否则用默认 deepseek-chat
  // deepseek-chat 不支持看图，如需请设置 AI_VISION_MODEL=deepseek-vl2
  const textModel = 'deepseek-chat';
  const model = hasImage ? (visionModel || textModel) : textModel;

  const resp = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content },
      ],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`Deepseek API ${resp.status}: ${err}`);
    return null;
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || null;
}

// ===== 主入口 =====

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  const method = request.method;
  const apiKey = env.DEEPSEEK_API_KEY || 'sk-d99be362daee4f828717e1d182ae7973';
  const visionModel = env.AI_VISION_MODEL || 'deepseek-chat'; // deepseek-chat 不支持看图，如需请设 deepseek-vl2
  const db = env.DB; // D1 binding，没有则降级

  // 健康检查
  if (path === 'health') {
    return json({ status: 'ok', ai: !!apiKey, provider: 'deepseek', db: !!db });
  }

  // ===== 认证路由 =====

  if (path === 'auth/register' && method === 'POST') {
    if (!db) return json({ error: '离线模式，无需注册' }, 503);
    try {
      const { username, password, displayName, grade } = await request.json();
      if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);

      const existing = await db.prepare('SELECT username FROM users WHERE username = ?').bind(username).first();
      if (existing) return json({ error: '用户名已被使用' }, 409);

      const hash = await hashPassword(password);
      await db.prepare('INSERT INTO users (username, password_hash, display_name, grade) VALUES (?, ?, ?, ?)')
        .bind(username, hash, displayName || username, grade || 'p3').run();

      const token = crypto.randomUUID();
      await db.prepare('INSERT INTO sessions (token, username) VALUES (?, ?)').bind(token, username).run();

      return json({ token, user: { username, displayName: displayName || username, grade: grade || 'p3', tier: 'free' } });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  if (path === 'auth/login' && method === 'POST') {
    if (!db) return json({ error: '离线模式，无需登录' }, 503);
    try {
      const { username, password } = await request.json();
      if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);

      const user = await db.prepare('SELECT username, password_hash, display_name, grade FROM users WHERE username = ?').bind(username).first();
      if (!user) return json({ error: '用户名或密码错误' }, 401);

      const hash = await hashPassword(password);
      if (hash !== user.password_hash) return json({ error: '用户名或密码错误' }, 401);

      const token = crypto.randomUUID();
      await db.prepare('INSERT INTO sessions (token, username) VALUES (?, ?)').bind(token, user.username).run();

      return json({
        token,
        user: { username: user.username, displayName: user.display_name, grade: user.grade, tier: 'free' },
      });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  if (path === 'auth/me' && method === 'GET') {
    if (!db) return json({ error: '离线模式' }, 503);
    const token = extractToken(request);
    const user = await getUserFromToken(db, token);
    if (!user) return json({ error: '未登录' }, 401);
    return json({ user: { username: user.username, displayName: user.display_name, grade: user.grade, tier: 'free' } });
  }

  // ===== 用户数据路由 =====

  if (path === 'user/save' && method === 'POST') {
    if (!db) return json({ error: '离线模式' }, 503);
    const token = extractToken(request);
    const user = await getUserFromToken(db, token);
    if (!user) return json({ error: '未登录' }, 401);

    const { gameData } = await request.json();
    const dataStr = typeof gameData === 'string' ? gameData : JSON.stringify(gameData);
    await db.prepare(
      'INSERT INTO game_data (username, data, updated_at) VALUES (?, ?, datetime(\'now\')) ON CONFLICT(username) DO UPDATE SET data = ?, updated_at = datetime(\'now\')'
    ).bind(user.username, dataStr, dataStr).run();
    return json({ ok: true });
  }

  if (path === 'user/load' && method === 'GET') {
    if (!db) return json({ error: '离线模式' }, 503);
    const token = extractToken(request);
    const user = await getUserFromToken(db, token);
    if (!user) return json({ error: '未登录' }, 401);

    const row = await db.prepare('SELECT data FROM game_data WHERE username = ?').bind(user.username).first();
    return json({ gameData: row ? JSON.parse(row.data) : null });
  }

  // ===== 活动日志 =====
  if (path === 'activity/log' && method === 'POST') {
    if (!db) return json({ ok: true }); // 离线时静默跳过
    try {
      const body = await request.json();
      const token = extractToken(request);
      let username = null;
      if (token) {
        const user = await getUserFromToken(db, token);
        if (user) username = user.username;
      }
      // 如果带 token 就用 token 的用户，否则用 body 中的 username（允许后端直接用）
      const finalUsername = username || body.username;
      if (!finalUsername) return json({ ok: true });

      await db.prepare(
        `INSERT INTO activity_logs (username, activity_type, subject, game_type, score, total_count, correct_count, duration_seconds, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        finalUsername,
        body.activityType || 'visit',
        body.subject || null,
        body.gameType || null,
        body.score ?? null,
        body.totalCount ?? null,
        body.correctCount ?? null,
        body.durationSeconds ?? null,
        body.metadata || null,
      ).run();
      return json({ ok: true });
    } catch (e) {
      console.error('Activity log error:', e.message);
      return json({ ok: true }); // 静默失败
    }
  }

  // ===== 父母管理路由 =====

  if (path === 'parent/register' && method === 'POST') {
    if (!db) return json({ error: '离线模式' }, 503);
    try {
      const { username, password, displayName } = await request.json();
      if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);

      const parentPrefix = 'parent_';
      const parentUsername = username.startsWith(parentPrefix) ? username : `${parentPrefix}${username}`;

      const existing = await db.prepare('SELECT username FROM users WHERE username = ?').bind(parentUsername).first();
      if (existing) return json({ error: '家长账号已存在' }, 409);

      const hash = await hashPassword(password);
      await db.prepare('INSERT INTO users (username, password_hash, display_name, grade) VALUES (?, ?, ?, ?)')
        .bind(parentUsername, hash, displayName || username, 'parent').run();

      const token = crypto.randomUUID();
      await db.prepare('INSERT INTO sessions (token, username) VALUES (?, ?)').bind(token, parentUsername).run();

      return json({ token, user: { username: parentUsername, displayName: displayName || username, grade: 'parent', tier: 'free', isParent: true } });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  if (path === 'parent/bind' && method === 'POST') {
    if (!db) return json({ error: '离线模式' }, 503);
    try {
      const token = extractToken(request);
      const parent = await getUserFromToken(db, token);
      if (!parent) return json({ error: '请先登录家长账号' }, 401);

      const { inviteCode } = await request.json();
      if (!inviteCode) return json({ error: '邀请码不能为空' }, 400);

      // 邀请码 = 孩子的用户名
      const child = await db.prepare('SELECT username, display_name FROM users WHERE username = ?').bind(inviteCode).first();
      if (!child) return json({ error: '邀请码无效，请确认孩子已注册' }, 404);

      // 检查是否已绑定
      const existing = await db.prepare('SELECT 1 FROM family_bindings WHERE parent_username = ? AND child_username = ?')
        .bind(parent.username, child.username).first();
      if (existing) return json({ error: '这个孩子已经绑定过了' }, 409);

      await db.prepare('INSERT INTO family_bindings (parent_username, child_username) VALUES (?, ?)')
        .bind(parent.username, child.username).run();

      return json({ ok: true, child: { username: child.username, displayName: child.display_name } });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  if (path === 'parent/children' && method === 'GET') {
    if (!db) return json({ children: [] });
    try {
      const token = extractToken(request);
      const parent = await getUserFromToken(db, token);
      if (!parent) return json({ error: '请先登录家长账号' }, 401);

      const rows = await db.prepare(
        'SELECT c.username, c.display_name FROM family_bindings b JOIN users c ON b.child_username = c.username WHERE b.parent_username = ?'
      ).bind(parent.username).all();

      return json({ children: (rows.results || []).map(r => ({ username: r.username, displayName: r.display_name })) });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  if (path === 'parent/activity' && method === 'GET') {
    if (!db) return json({ activities: [] });
    try {
      const token = extractToken(request);
      const parent = await getUserFromToken(db, token);
      if (!parent) return json({ error: '请先登录家长账号' }, 401);

      const child = url.searchParams.get('child');
      const days = parseInt(url.searchParams.get('days')) || 7;
      if (!child) return json({ error: '请指定孩子用户名' }, 400);

      // 验证亲子关系
      const bound = await db.prepare('SELECT 1 FROM family_bindings WHERE parent_username = ? AND child_username = ?')
        .bind(parent.username, child).first();
      if (!bound) return json({ error: '未绑定该孩子' }, 403);

      const rows = await db.prepare(
        `SELECT * FROM activity_logs WHERE username = ? AND created_at >= datetime('now', ? || ' days') ORDER BY created_at DESC LIMIT 500`
      ).bind(child, `-${days}`).all();

      return json({ activities: rows.results || [] });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  if (path === 'parent/analysis' && method === 'GET') {
    if (!db) return json({ error: '离线模式' }, 503);
    try {
      const token = extractToken(request);
      const parent = await getUserFromToken(db, token);
      if (!parent) return json({ error: '请先登录家长账号' }, 401);

      const child = url.searchParams.get('child');
      if (!child) return json({ error: '请指定孩子用户名' }, 400);

      // 验证亲子关系
      const bound = await db.prepare('SELECT 1 FROM family_bindings WHERE parent_username = ? AND child_username = ?')
        .bind(parent.username, child).first();
      if (!bound) return json({ error: '未绑定该孩子' }, 403);

      // 按科目汇总
      const bySubject = await db.prepare(
        `SELECT subject,
                COUNT(*) as count,
                SUM(COALESCE(score, 0)) as total_score,
                SUM(COALESCE(correct_count, 0)) as total_correct,
                SUM(COALESCE(total_count, 0)) as total_questions,
                SUM(COALESCE(duration_seconds, 0)) as total_duration
         FROM activity_logs
         WHERE username = ? AND created_at >= datetime('now', '-14 days')
         GROUP BY subject`
      ).bind(child).all();

      // 每日汇总
      const byDay = await db.prepare(
        `SELECT DATE(created_at) as day,
                COUNT(*) as count,
                SUM(COALESCE(duration_seconds, 0)) as total_duration
         FROM activity_logs
         WHERE username = ? AND created_at >= datetime('now', '-14 days')
         GROUP BY DATE(created_at)
         ORDER BY day DESC`
      ).bind(child).all();

      // 游戏偏好
      const byGame = await db.prepare(
        `SELECT activity_type, game_type, COUNT(*) as count
         FROM activity_logs
         WHERE username = ? AND created_at >= datetime('now', '-14 days')
         GROUP BY activity_type, game_type
         ORDER BY count DESC`
      ).bind(child).all();

      return json({
        bySubject: bySubject.results || [],
        byDay: byDay.results || [],
        byGame: byGame.results || [],
      });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  // 其他 /user/ 和 /auth/ 路径统一返回离线
  if (path.startsWith('auth/') || path.startsWith('user/')) {
    return json({ error: '离线模式' }, 503);
  }

  // ===== AI 功能路由 =====

  try {
    const body = await request.json();

    switch (path) {
      case 'chat': {
        const { messages, level = 1 } = body;
        const systemPrompt = `你是一个在香港读小学三年级的小朋友，名叫"晴晴"，性格活泼开朗。

你的任务是和新来的同学用粤语聊天，帮助她练习粤语。

规则：
1. 用粤语回复（汉字+粤拼），每句话后面加括号写普通话翻译
2. 用词简单，适合小学生
3. 语气要友善、鼓励
4. 如果她说错了，温柔地纠正
5. 当她表现好时，要表扬她
6. 话题围绕：学校生活、兴趣爱好、日常活动
7. 根据她的粤语水平（level ${level}，1=初级 2=中级 3=高级）调整难度

示例回复格式：
你今日食咗飯未呀？（你今天吃饭了没有呀？）`;

        const userMsg = messages?.map?.(m => m.content).join('\n') || '你好！我们一起玩吧！';
        const reply = await askDeepseek(systemPrompt, userMsg, apiKey, 300);
        return json({ reply });
      }

      case 'generate-math': {
        const { level = 1, count = 5, wrongTopics = [] } = body;
        const topicGuide = { 1: '万以内加减法', 2: '乘法表(2-9)、简单除法', 3: '分数初步、混合运算' };
        const wrongHint = wrongTopics.length > 0
          ? `\n她最近容易错的知识点：${wrongTopics.join('、')}，请多出这些类型的题目。`
          : '';

        const systemPrompt = `你是一位香港小学数学老师，为三年级学生出数学题。

要求：
1. 出${count}道选择题（4个选项）
2. 难度适合level ${level}（${topicGuide[level] || '基础'}）
3. 把题目放在有趣的故事场景中（比如宠物、零食、学校生活）${wrongHint}
4. 返回纯JSON数组，不要其他文字

返回格式：
[
  {
    "id": 1,
    "question": "题目文字",
    "answer": "正确答案",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "story": "故事场景（50字以内）"
  }
]`;

        const reply = await askDeepseek(systemPrompt, `请出${count}道level ${level}的数学选择题`, apiKey, 1000);
        if (!reply) return json({ problems: null });
        const jsonMatch = reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) return json({ problems: JSON.parse(jsonMatch[0]) });
        return json({ problems: null });
      }

      case 'encourage': {
        const { stats } = body;
        const systemPrompt = `你是一个温柔鼓励小朋友的AI助手。根据她的学习数据写一段鼓励的话。
要求：
1. 用温暖、朋友般的语气
2. 提到她具体的进步
3. 鼓励她继续努力
4. 用简单中文，偶尔加一点粤语
5. 50字以内，可加表情符号`;
        const reply = await askDeepseek(systemPrompt, `这是她的学习数据：${JSON.stringify(stats)}，请给她写一段鼓励的话。`, apiKey, 200);
        return json({ message: reply || '继续加油哦！团子为你骄傲！🎉' });
      }

      case 'advice': {
        const { history } = body;
        const systemPrompt = `你是一位教育专家，根据学生的学习数据分析她的薄弱环节并给出建议。
分析维度：
1. 粤语：发音、词汇量、理解能力
2. 繁体字：认读、书写
3. 数学：计算速度、理解能力
用简单语言给出3条建议，每条一行。`;
        const reply = await askDeepseek(systemPrompt, `这是学习记录：${JSON.stringify(history)}，请给出建议。`, apiKey, 300);
        return json({ advice: reply });
      }

      case 'analyze-mistakes': {
        const { subject, wrongRecords, level = 1 } = body;
        const subjectNames = { math: '数学', cantonese: '粤语', chinese: '汉字' };
        const subjectName = subjectNames[subject] || subject;
        const systemPrompt = `你是一位友善的香港小学补习老师，正在为一位三年级学生分析${subjectName}的错题。
要求：
1. 用温柔、鼓励的语气
2. 分析她主要的薄弱环节
3. 给出3条具体可操作的学习建议
4. 推荐她应该重点练习的题目类型
返回纯JSON格式：
{
  "analysis": "总体分析（30字以内）",
  "weaknesses": ["薄弱点1", "薄弱点2"],
  "suggestions": ["建议1", "建议2", "建议3"],
  "recommendedTopics": ["推荐练习类型1", "推荐练习类型2"]
}`;
        const reply = await askDeepseek(
          systemPrompt,
          `这位学生最近在${subjectName}上做错了以下题目：${JSON.stringify((wrongRecords || []).slice(0, 20))}。请分析她的薄弱环节。`,
          apiKey, 500,
        );
        if (!reply) return json(null);
        const m = reply.match(/\{[\s\S]*\}/);
        return json(m ? JSON.parse(m[0]) : null);
      }

      case 'vary-question': {
        const { question, count = 3, grade = 'p3', subject = 'math' } = body;
        const systemPrompt = `你是香港中小学的学科老师，负责根据种子题目生成变体题。
要求：保持知识点和难度，变化数值或场景，生成${count}道选择题，返回纯JSON数组。
格式：[{"id":"VAR-1","question":"...","answer":"...","options":[...],"variationType":"数值变体|场景变体"}]`;
        const reply = await askDeepseek(systemPrompt, `年级：${grade}，科目：${subject}\n种子题目：${JSON.stringify(question)}\n请生成${count}道变体题。`, apiKey, 1000);
        if (!reply) return json({ variations: [] });
        const m = reply.match(/\[[\s\S]*\]/);
        return json({ variations: m ? JSON.parse(m[0]) : [] });
      }

      case 'generate-template': {
        const { grade, topic, genre = 'computation', count = 3 } = body;
        const gradeNames = { p1: '小一', p2: '小二', p3: '小三', p4: '小四', p5: '小五', p6: '小六', f1: '中一', f2: '中二', f3: '中三' };
        const systemPrompt = `你是香港中小学数学课程专家，为${gradeNames[grade] || grade}设计数学题目模板。每个模板包含 pattern/variables/answer/distractors。返回纯JSON数组。`;
        const reply = await askDeepseek(systemPrompt, `请为${gradeNames[grade] || grade}设计${count}个关于"${topic}"的${genre === 'word-problem' ? '应用题' : '计算题'}模板。`, apiKey, 1200);
        if (!reply) return json({ templates: [] });
        const m = reply.match(/\[[\s\S]*\]/s);
        return json({ templates: m ? JSON.parse(m[0]) : [] });
      }

      case 'tutor/homework-diagnose': {
        const { textContent, imageData, mimeType, subject, grade, wrongRecords, masteryData } = body;
        if (!textContent && !imageData) return json({ error: '缺少作业内容或图片' }, 400);
        const sn = { math: '数学', chinese: '汉字', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

        const systemPrompt = `你是香港一位专门培养小学生"自检习惯"和"数感逻辑"的资深高级${sn}助教。

核心教学原则：
1. 反馈非具体化：发现错误时，绝不指明具体是哪道题，只告诉学生错误总数
2. 逻辑前置：引导学生在计算前先估算，在解题前先提取关键词
3. 验证闭环：每道题答完后鼓励用反向验算检查
4. 视觉化引导：鼓励用线段图或分块草稿理清多步运算
5. 语言亲切有趣：多用"侦探"、"挑战"、"发现"等词汇

根据作业内容输出 JSON（不要其他文字）：
{
  "errorCount": 数字,
  "errorTypes": ["careless","keyword","logic","geometry"],
  "firstMessage": "侦探口吻的错误总数提示",
  "guidanceSteps": [
    { "type": "careless", "detectiveHint": "估算防御策略提示", "strategy": "estimation-defense" }
  ],
  "errorDetails": { "careless": "描述", "keyword": "描述", "logic": "描述" },
  "habitChallenge": { "type": "reverse-check", "title": "反向验算", "description": "请用加法检查减法题的答案" }
}`;

        const userMsgText = `年级：${grade}\n薄弱：${(wrongRecords||[]).map(r=>r.category).filter(Boolean).join('、')||'暂无'}\n掌握度：${JSON.stringify(masteryData||[])}\n作业内容：${textContent||'（见上传图片）'}\n请直接分析图片中的作业，输出诊断 JSON。`;
        const msg = imageData ? { text: userMsgText, image: imageData, mimeType: mimeType || 'image/png' } : userMsgText;
        const reply = await askDeepseek(systemPrompt, msg, apiKey, 1200, visionModel);
        if (!reply) return json(null);
        const m = reply.match(/\{[\s\S]*\}/);
        return json(m ? JSON.parse(m[0]) : null);
      }

      case 'generate-review': {
        const { subject, grade, textbookContent, imageData, mimeType, wrongTopics, masteryData, count = 5 } = body;
        if (!textbookContent && !imageData) return json({ error: '缺少课本内容或图片' }, 400);
        const sn = { math: '数学', chinese: '汉字', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

        const weakPoints = (masteryData || [])
          .filter(m => m.level < 0.6).sort((a, b) => a.level - b.level).map(m => m.topic);
        const allFocus = [...new Set([...(wrongTopics || []), ...weakPoints])];

        const systemPrompt = `你是香港一位专门培养小学生"自检习惯"和"数感逻辑"的资深高级${sn}助教。

根据课本内容和掌握度数据出复习题：
1. 基于课本内容，紧贴所学知识
2. 优先考察薄弱知识点（level<0.6），掌握度越低出题越多
3. 难度适合${grade}年级，用繁体中文
4. 每道题附带 commonMistake（常见错误提醒）和 estimationTip（估算提示）
5. 题型：选择题(4选1)、填空题、判断题混合
6. 薄弱点70%，新内容30%

输出 JSON：{"questions":[{"id":"REV-1","question":"...","answer":"...","options":[...],"story":"解题思路","category":"知识点","commonMistake":"常见错误","estimationTip":"估算提示"}]}`;

        const userMsgText = `课本内容：${textbookContent||'（见上传图片）'}\n年级：${grade}\n薄弱点：${allFocus.join('、')||'暂无'}\n掌握度：${JSON.stringify(masteryData||[])}\n出${count}道${sn}复习题，直接分析图片中的课本内容。`;
        const msg = imageData ? { text: userMsgText, image: imageData, mimeType: mimeType || 'image/png' } : userMsgText;
        const reply = await askDeepseek(systemPrompt, msg, apiKey, 1500, visionModel);
        if (!reply) return json({ questions: null });
        const m = reply.match(/\{[\s\S]*\}/);
        return json(m ? JSON.parse(m[0]) : { questions: null });
      }

      case 'ocr': {
        const { image } = body;
        if (!image) return json({ error: '缺少图片数据' }, 400);
        const systemPrompt = `请提取这张图片中的所有文字内容。这是香港小学的课本或练习册页面，
可能包含繁体中文、英文或数字。请完整、准确地提取所有文字，保持原有段落格式和顺序。
如果图片中有算式，请保持数学符号的准确性。只输出文字内容，不要添加其他说明。`;
        const text = await askDeepseek(systemPrompt, { text: '请提取这张图片中的所有文字内容。', image, mimeType: 'image/png' }, apiKey, 800, visionModel);
        return json({ text: text || null });
      }

      case 'tutor/classify': {
        const { items, subject, grade } = body;
        if (!items?.length) return json({ error: '缺少上传内容' }, 400);
        const sn = { math: '数学', chinese: '中文', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

        const systemPrompt = `你是香港一位资深${sn}教师，擅长分析学生的学习材料。
你的任务：将学生上传的多份内容自动分类分组，并分析每组的难度和涉及的知识点。
分类标准：
- "homework" = 日常练习、课后作业
- "exam" = 测验、考试、小测
- "textbook" = 课本内容、讲义、笔记
- "mistakes" = 错题、做错的题目
- "concept" = 概念定义、公式、定理
输出严格 JSON 格式（不要包含其他文字）：
{
  "groups": [
    {
      "id": "G1",
      "type": "homework|exam|textbook|mistakes|concept",
      "label": "分组名称（简短中文）",
      "itemIndices": [0, 2],
      "topics": ["涉及的知识点1", "知识点2"],
      "difficulty": "基础|中等|偏难",
      "questionCount": 5,
      "summary": "一句话总结这组内容"
    }
  ],
  "overallAnalysis": {
    "weakTopics": ["薄弱知识点1", "薄弱知识点2"],
    "difficulty": "整体难度评估",
    "suggestion": "学习建议"
  }
}`;

        const itemsText = items.map((item, i) => {
          if (item.text) return `[${i + 1}] 文本：${item.text.slice(0, 300)}`;
          if (item.imageData) return `[${i + 1}] 图片：`;
          return `[${i + 1}] （空）`;
        }).join('\n');

        const userMsgText = `科目：${sn}
年级：${grade}
共 ${items.length} 份内容：

${itemsText}

请自动分析图片中的内容进行分组。直接看图片，不要依赖 OCR 文本。`;

        const hasImages = items.some(i => i.imageData);
        const firstImg = items.find(i => i.imageData);
        const msg = hasImages && firstImg
          ? { text: userMsgText, image: firstImg.imageData, mimeType: firstImg.mimeType || 'image/png' }
          : userMsgText;

        const reply = await askDeepseek(systemPrompt, msg, apiKey, 1200, visionModel);
        if (!reply) return json({ groups: null });
        const jm = reply.match(/\{[\s\S]*\}/);
        return json(jm ? JSON.parse(jm[0]) : { groups: null });
      }

      case 'tutor/generate-exam': {
        const { subject, grade, groups, weakTopics, masteryData, count = 10 } = body;
        if (!groups?.length) return json({ error: '缺少分组内容' }, 400);
        const sn = { math: '数学', chinese: '中文', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

        const groupsText = groups.map((g, i) => {
          const content = g.items?.map(item => item.text || '（图片）').join('；') || g.summary || '';
          return `分组${i + 1}：${g.label}（${g.type}，${g.difficulty}）\n涉及：${(g.topics || []).join('、')}\n内容摘要：${content.slice(0, 500)}`;
        }).join('\n\n');

        const weakPoints = (masteryData || [])
          .filter(m => m.level < 0.6).sort((a, b) => a.level - b.level).map(m => m.topic);
        const allFocus = [...new Set([...(weakTopics || []), ...weakPoints])];

        const systemPrompt = `你是香港一位资深${sn}教师，擅长根据学生的学习情况出针对性的模拟试卷。
要求：
1. 题目必须紧密围绕选中分组的知识点
2. 薄弱知识点占 60% 题量，巩固内容占 40%
3. 难度梯度：基础 40% + 中等 40% + 挑战 20%
4. 使用繁体中文，适合 ${grade} 年级
5. 每题附带知识点标签和难度标签
输出严格 JSON 格式：
{
  "examTitle": "模拟试卷名称",
  "questions": [
    {
      "id": "EX-1",
      "question": "题目文字",
      "answer": "正确答案",
      "options": ["A", "B", "C", "D"],
      "category": "知识点",
      "difficulty": 1-3,
      "hint": "解题提示"
    }
  ],
  "summary": {
    "topics": ["覆盖的知识点"],
    "weakFocus": ["重点考察的薄弱点"],
    "tip": "考试建议"
  }
}`;

        const userMsgText = `科目：${sn}
年级：${grade}
选中分组内容：
${groupsText}

学生薄弱知识点：${allFocus.join('、') || '暂无'}
掌握度数据：${JSON.stringify(masteryData || [])}

请生成 ${count} 道模拟试卷题目。请直接分析图片中的原始内容出题，不要依赖 OCR 文本。`;

        const allItems = groups.flatMap(g => g.items || []).filter(Boolean);
        const firstImageItem = allItems.find(item => item.imageData);
        const msg = firstImageItem
          ? { text: userMsgText, image: firstImageItem.imageData, mimeType: firstImageItem.mimeType || 'image/png' }
          : userMsgText;

        const reply = await askDeepseek(systemPrompt, msg, apiKey, 2000, visionModel);
        if (!reply) return json({ questions: null });
        const jm = reply.match(/\{[\s\S]*\}/);
        return json(jm ? JSON.parse(jm[0]) : { questions: null });
      }

      default:
        return json({ error: 'Unknown endpoint' }, 404);
    }
  } catch (e) {
    console.error('API error:', e.message);
    return json({ error: e.message }, 500);
  }
}
