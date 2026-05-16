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

async function askDeepseek(systemPrompt, userMessage, apiKey, maxTokens = 500) {
  const resp = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
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

      default:
        return json({ error: 'Unknown endpoint' }, 404);
    }
  } catch (e) {
    console.error('API error:', e.message);
    return json({ error: e.message }, 500);
  }
}
