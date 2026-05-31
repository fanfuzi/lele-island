/**
 * 乐乐小岛 - AI后端服务
 * 支持 Claude (Anthropic)、Deepseek、SiliconFlow (硅基流动) 等AI提供商
 *
 * 配置方式 (环境变量):
 *   AI_PROVIDER=claude|deepseek|siliconflow   (默认 auto 根据API key前缀判断)
 *   ANTHROPIC_API_KEY=sk-ant-xxx      Claude API Key
 *   DEEPSEEK_API_KEY=sk-xxx          Deepseek API Key
 *   SILICONFLOW_API_KEY=sk-xxx       硅基流动 API Key (推荐，支持看图模型 deepseek-vl2)
 *   AI_MODEL=deepseek-vl2            (模型名称，硅基流动推荐 deepseek-vl2)
 *   AI_VISION_MODEL=deepseek-vl2     (视觉模型，处理图片时使用)
 *
 * 启动:
 *   AI_PROVIDER=siliconflow SILICONFLOW_API_KEY=sk-xxx node server/index.js
 *   或
 *   DEEPSEEK_API_KEY=sk-xxx node server/index.js
 *   或
 *   ANTHROPIC_API_KEY=sk-ant-xxx node server/index.js
 */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { authRouter, JWT_SECRET } from './auth.js';
import { userRouter } from './user.js';
import { getDb, createUser } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ===== 认证与用户路由 =====
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// ===== 活动日志 =====
app.post('/api/activity/log', (req, res) => {
  const { activityType, subject, gameType, score, totalCount, correctCount, durationSeconds, metadata, username } = req.body;
  try {
    const db = getDb();
    const finalUsername = username || 'anonymous';
    db.prepare(
      `INSERT INTO activity_logs (username, activity_type, subject, game_type, score, total_count, correct_count, duration_seconds, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(finalUsername, activityType || 'visit', subject || null, gameType || null, score ?? null, totalCount ?? null, correctCount ?? null, durationSeconds ?? null, metadata || null);
  } catch (e) {
    console.error('Activity log error:', e.message);
  }
  res.json({ ok: true });
});

// ===== 父母管理 =====

// 注册家长账号
app.post('/api/parent/register', (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });
  try {
    const db = getDb();
    const parentPrefix = 'parent_';
    const parentUsername = username.startsWith(parentPrefix) ? username : `${parentPrefix}${username}`;

    const user = createUser(parentUsername, password, displayName || username, { userGrade: 'parent' });
    if (!user) return res.status(409).json({ error: '家长账号已存在' });

    const token = jwt.sign({ id: user.id, username: user.username, tier: 'free' }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { username: user.username, displayName: displayName || username, grade: 'parent', tier: 'free', isParent: true } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 绑定孩子（通过邀请码 = 孩子用户名）
app.post('/api/parent/bind', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: '请先登录' });
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    const db = getDb();
    const { inviteCode } = req.body;
    if (!inviteCode) return res.status(400).json({ error: '邀请码不能为空' });

    const child = db.prepare('SELECT username, display_name FROM users WHERE username = ?').get(inviteCode);
    if (!child) return res.status(404).json({ error: '邀请码无效' });

    const existing = db.prepare('SELECT 1 FROM family_bindings WHERE parent_username = ? AND child_username = ?').get(decoded.username, child.username);
    if (existing) return res.status(409).json({ error: '已经绑定过了' });

    db.prepare('INSERT INTO family_bindings (parent_username, child_username) VALUES (?, ?)').run(decoded.username, child.username);
    res.json({ ok: true, child: { username: child.username, displayName: child.display_name } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 获取绑定孩子列表
app.get('/api/parent/children', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: '请先登录' });
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    const db = getDb();
    const rows = db.prepare(
      'SELECT c.username, c.display_name FROM family_bindings b JOIN users c ON b.child_username = c.username WHERE b.parent_username = ?'
    ).all(decoded.username);
    res.json({ children: rows.map(r => ({ username: r.username, displayName: r.display_name })) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 获取孩子活动
app.get('/api/parent/activity', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: '请先登录' });
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    const db = getDb();
    const child = req.query.child;
    const days = parseInt(req.query.days) || 7;
    if (!child) return res.status(400).json({ error: '请指定孩子用户名' });

    const bound = db.prepare('SELECT 1 FROM family_bindings WHERE parent_username = ? AND child_username = ?').get(decoded.username, child);
    if (!bound) return res.status(403).json({ error: '未绑定该孩子' });

    const rows = db.prepare(
      `SELECT * FROM activity_logs WHERE username = ? AND created_at >= datetime('now', ? || ' days') ORDER BY created_at DESC LIMIT 500`
    ).all(child, `-${days}`);
    res.json({ activities: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 获取孩子掌握度数据（从 game_data 提取）
app.get('/api/parent/mastery', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: '请先登录' });
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    const db = getDb();
    const child = req.query.child;
    if (!child) return res.status(400).json({ error: '请指定孩子用户名' });

    const bound = db.prepare('SELECT 1 FROM family_bindings WHERE parent_username = ? AND child_username = ?').get(decoded.username, child);
    if (!bound) return res.status(403).json({ error: '未绑定该孩子' });

    const row = db.prepare('SELECT data FROM game_data WHERE username = ?').get(child);
    if (!row) return res.json({ mastery: null });

    const gameData = JSON.parse(row.data);
    res.json({ mastery: gameData.mastery || {}, diagnosisHistory: (gameData.diagnosisHistory || []).slice(-20), habitLog: (gameData.habitLog || []).slice(-20) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 获取孩子分析报告
app.get('/api/parent/analysis', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: '请先登录' });
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    const db = getDb();
    const child = req.query.child;
    if (!child) return res.status(400).json({ error: '请指定孩子用户名' });

    const bound = db.prepare('SELECT 1 FROM family_bindings WHERE parent_username = ? AND child_username = ?').get(decoded.username, child);
    if (!bound) return res.status(403).json({ error: '未绑定该孩子' });

    const bySubject = db.prepare(
      `SELECT subject, COUNT(*) as count, SUM(COALESCE(score, 0)) as total_score,
              SUM(COALESCE(correct_count, 0)) as total_correct,
              SUM(COALESCE(total_count, 0)) as total_questions,
              SUM(COALESCE(duration_seconds, 0)) as total_duration
       FROM activity_logs WHERE username = ? AND created_at >= datetime('now', '-14 days')
       GROUP BY subject`
    ).all(child);

    const byDay = db.prepare(
      `SELECT DATE(created_at) as day, COUNT(*) as count, SUM(COALESCE(duration_seconds, 0)) as total_duration
       FROM activity_logs WHERE username = ? AND created_at >= datetime('now', '-14 days')
       GROUP BY DATE(created_at) ORDER BY day DESC`
    ).all(child);

    const byGame = db.prepare(
      `SELECT activity_type, game_type, COUNT(*) as count
       FROM activity_logs WHERE username = ? AND created_at >= datetime('now', '-14 days')
       GROUP BY activity_type, game_type ORDER BY count DESC`
    ).all(child);

    // 诊断记录（近30天）
    const diagnosisLogs = db.prepare(
      `SELECT metadata, created_at FROM activity_logs
       WHERE username = ? AND activity_type = 'diagnosis' AND created_at >= datetime('now', '-30 days')
       ORDER BY created_at DESC LIMIT 30`
    ).all(child);

    // 习惯养成记录（近30天）
    const habitLogs = db.prepare(
      `SELECT metadata, created_at FROM activity_logs
       WHERE username = ? AND activity_type = 'practice' AND game_type = 'habit' AND created_at >= datetime('now', '-30 days')
       ORDER BY created_at DESC LIMIT 50`
    ).all(child);

    res.json({ bySubject, byDay, byGame, diagnosisLogs, habitLogs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== AI 提供商配置 =====
const CONFIG = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-sonnet-4-20250514',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    }),
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: process.env.AI_MODEL || 'deepseek-chat',
    visionModel: process.env.AI_VISION_MODEL || 'deepseek-chat', // deepseek-chat 不支持看图，如需请设为 deepseek-vl2
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
  },
  siliconflow: {
    apiKey: process.env.SILICONFLOW_API_KEY,
    baseUrl: 'https://api.siliconflow.cn/v1',
    defaultModel: process.env.AI_MODEL || 'Qwen/Qwen3-VL-8B-Instruct', // 支持看图的视觉模型
    visionModel: process.env.AI_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
  },
};

// 自动检测提供商
function detectProvider() {
  const envProvider = process.env.AI_PROVIDER;
  if (envProvider === 'claude' || envProvider === 'deepseek' || envProvider === 'siliconflow') {
    return envProvider;
  }

  const anthKey = process.env.ANTHROPIC_API_KEY;
  const dsKey = process.env.DEEPSEEK_API_KEY;
  const sfKey = process.env.SILICONFLOW_API_KEY;

  if (sfKey && sfKey.startsWith('sk-')) return 'siliconflow';
  if (anthKey && anthKey.startsWith('sk-ant-')) return 'anthropic';
  if (dsKey && dsKey.startsWith('sk-')) return 'deepseek';
  if (anthKey) return 'anthropic';
  if (dsKey) return 'deepseek';
  if (sfKey) return 'siliconflow';
  return null;
}

const provider = detectProvider();
const config = provider ? CONFIG[provider] : null;

const PROVIDER_LABELS = { anthropic: 'Claude', deepseek: 'Deepseek', siliconflow: '硅基流动' };
console.log(`\n🌟 乐乐小岛 AI 服务器`);
if (provider && config?.apiKey) {
  console.log(`   使用 ${PROVIDER_LABELS[provider] || provider} AI (模型: ${config.defaultModel})`);
} else {
  console.log(`   AI功能未启用`);
  console.log(`   设置 ANTHROPIC_API_KEY / DEEPSEEK_API_KEY / SILICONFLOW_API_KEY 环境变量来开启`);
}

// ===== 通用 AI 请求函数 =====
async function askAI(systemPrompt, userMessage, maxTokens = 500) {
  if (!provider || !config?.apiKey) return null;

  try {
    if (provider === 'anthropic') {
      return await askClaude(systemPrompt, userMessage, maxTokens);
    } else {
      return await askDeepseek(systemPrompt, userMessage, maxTokens);
    }
  } catch (e) {
    console.error(`${provider} API error:`, e.message);
    return null;
  }
}

async function askClaude(systemPrompt, userMessage, maxTokens) {
  // 支持多模态：userMessage 可以是字符串或 { text, image } 对象
  let content;
  if (typeof userMessage === 'object' && userMessage !== null && userMessage.image) {
    content = [
      { type: 'text', text: userMessage.text || '' },
      { type: 'image', source: { type: 'base64', media_type: userMessage.mimeType || 'image/png', data: userMessage.image } },
    ];
  } else {
    content = typeof userMessage === 'string' ? userMessage : (userMessage?.text || JSON.stringify(userMessage));
  }

  const resp = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: config.headers(config.apiKey),
    body: JSON.stringify({
      model: config.defaultModel,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Claude API ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  return data.content?.[0]?.text || null;
}

async function askDeepseek(systemPrompt, userMessage, maxTokens) {
  // 支持多模态：userMessage 可以是字符串或 { text, image, mimeType } 对象
  const hasImage = typeof userMessage === 'object' && userMessage !== null && userMessage.image;
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

  // 有图片时使用视觉模型（如 deepseek-vl2），否则用默认模型
  const model = hasImage && config.visionModel ? config.visionModel : config.defaultModel;

  const resp = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: config.headers(config.apiKey),
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
    throw new Error(`Deepseek API ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || null;
}

/**
 * 健壮 JSON 提取 — 处理 AI 输出的各种常见格式问题
 * 支持：Markdown 代码块、JS 注释、尾部逗号、单引号、无引号键名、前后多余文字
 */
function extractJSON(text) {
  if (!text || typeof text !== 'string') return null;
  let s = text.trim().replace(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/g, '$1').replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  const findRoot = (str, sC, eC) => {
    const start = str.indexOf(sC);
    if (start < 0) return null;
    let d = 0, inStr = false, esc = false;
    for (let i = start; i < str.length; i++) {
      const ch = str[i];
      if (esc) { esc = false; continue; }
      if (ch === '\\' && inStr) { esc = true; continue; }
      if (ch === '"' && !esc) inStr = !inStr;
      if (inStr) continue;
      if (ch === sC) d++;
      if (ch === eC) { d--; if (d === 0) return str.slice(start, i + 1); }
    }
    return null;
  };

  let js = findRoot(s, '{', '}') || findRoot(s, '[', ']');
  if (!js) return null;
  
  const attempts = [
    s => JSON.parse(s),
    s => JSON.parse(s.replace(/\b(True|False|NULL|Undefined)\b/g, m => m.toLowerCase())),
    s => JSON.parse(s.replace(/,(\s*[}\]])/g, '$1')),
    s => JSON.parse(s.replace(/'/g, '"')),
    s => JSON.parse(s.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')),
    s => { s = s.replace(/\b(True|False|NULL|Undefined)\b/g, m => m.toLowerCase()).replace(/,(\s*[}\]])/g, '$1').replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3'); const p = s.split('"'); for (let i = 0; i < p.length; i += 2) p[i] = p[i].replace(/'/g, '"'); return JSON.parse(p.join('"')); },
    s => { const st = s.search(/[\[{]/); if (st > 0) s = s.slice(st); return JSON.parse(s); },
  ];
  
  js = js.replace(/\\(?!["\\\/bfnrtu])/g, '\\\\');
  for (const fn of attempts) { try { return fn(js); } catch {} }
  return null;
}

// ===== 健康检查 =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ai: !!provider && !!config?.apiKey,
    provider: provider,
    db: true,
  });
});

// ===== 粤语对话 =====
app.post('/api/chat', async (req, res) => {
  const { messages, level = 1 } = req.body;
  if (!provider || !config?.apiKey) return res.json({ reply: null });

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
  const reply = await askAI(systemPrompt, userMsg, 300);
  res.json({ reply });
});

// ===== 生成数学题 =====
app.post('/api/generate-math', async (req, res) => {
  const { level = 1, count = 5, wrongTopics = [] } = req.body;
  if (!provider || !config?.apiKey) return res.json({ problems: null });

  const topicGuide = {
    1: '万以内加减法',
    2: '乘法表(2-9)、简单除法',
    3: '分数初步、混合运算',
  };

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

  const reply = await askAI(systemPrompt, `请出${count}道level ${level}的数学选择题`, 1000);
  if (!reply) return res.json({ problems: null });
  try {
    const parsed = extractJSON(reply);
    if (parsed && Array.isArray(parsed)) return res.json({ problems: parsed });
  } catch (e) {
    console.error('Parse error:', e.message);
  }
  res.json({ problems: null });
});

// ===== 鼓励语生成 =====
app.post('/api/encourage', async (req, res) => {
  const { stats } = req.body;
  if (!provider || !config?.apiKey) {
    return res.json({ message: '继续加油哦！团子为你骄傲！🎉' });
  }

  const systemPrompt = `你是一个温柔鼓励小朋友的AI助手。根据她的学习数据写一段鼓励的话。

要求：
1. 用温暖、朋友般的语气
2. 提到她具体的进步
3. 鼓励她继续努力
4. 用简单中文，偶尔加一点粤语
5. 50字以内，可加表情符号`;

  const reply = await askAI(systemPrompt, `这是她的学习数据：${JSON.stringify(stats)}，请给她写一段鼓励的话。`, 200);
  res.json({ message: reply || '继续加油哦！团子为你骄傲！🎉' });
});

// ===== 学习建议 =====
app.post('/api/advice', async (req, res) => {
  const { history } = req.body;
  if (!provider || !config?.apiKey) return res.json({ advice: null });

  const systemPrompt = `你是一位教育专家，根据学生的学习数据分析她的薄弱环节并给出建议。

分析维度：
1. 粤语：发音、词汇量、理解能力
2. 繁体字：认读、书写
3. 数学：计算速度、理解能力

用简单语言给出3条建议，每条一行。`;

  const reply = await askAI(systemPrompt, `这是学习记录：${JSON.stringify(history)}，请给出建议。`, 300);
  res.json({ advice: reply });
});

// ===== 错题分析 =====
app.post('/api/analyze-mistakes', async (req, res) => {
  const { subject, wrongRecords, level = 1 } = req.body;
  if (!provider || !config?.apiKey) return res.json(null);

  const subjectNames = { math: '数学', cantonese: '粤语', chinese: '汉字' };
  const subjectName = subjectNames[subject] || subject;

  const systemPrompt = `你是一位友善的香港小学补习老师，正在为一位三年级学生分析${subjectName}的错题。

要求：
1. 用温柔、鼓励的语气
2. 分析她主要的薄弱环节
3. 给出3条具体可操作的学习建议
4. 推荐她应该重点练习的题目类型

返回纯JSON格式，不要其他文字：

{
  "analysis": "总体分析（30字以内，像朋友聊天一样自然）",
  "weaknesses": ["薄弱点1（10字以内）", "薄弱点2"],
  "suggestions": ["建议1（15字以内）", "建议2", "建议3"],
  "recommendedTopics": ["推荐练习类型1", "推荐练习类型2"]
}`;

  const reply = await askAI(systemPrompt, `这位学生最近在${subjectName}上做错了以下题目（按类别统计）：${JSON.stringify(wrongRecords.slice(0, 20))}。请分析她的薄弱环节。`, 500);
  if (!reply) return res.json(null);

  try {
    const parsed = extractJSON(reply); if (parsed) return res.json(parsed);
  } catch (e) {
    console.error('Parse error:', e.message);
  }
  res.json(null);
});

// ===== AI 题目变体 =====
app.post('/api/vary-question', async (req, res) => {
  const { question, count = 3, grade = 'p3', subject = 'math' } = req.body;
  if (!provider || !config?.apiKey) return res.json({ variations: [] });

  const systemPrompt = `你是香港中小学的学科老师，负责根据一道种子题目生成变体题目。

要求：
1. 保持相同的知识点和难度
2. 变化以下维度：
   - 数值变体：改数字（保持难度一致）
   - 场景变体：改故事背景
   - 题型不变（仍是选择题4选1）
3. 生成${count}道变体题
4. 返回纯JSON数组，不要其他文字

返回格式：
[
  {
    "id": "VAR-1",
    "question": "题目文字",
    "answer": "正确答案",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "variationType": "数值变体|场景变体|难度变体"
  }
]`;

  const reply = await askAI(systemPrompt, `年级：${grade}，科目：${subject}\n种子题目：${JSON.stringify(question)}\n请生成${count}道变体题。`, 1000);
  if (!reply) return res.json({ variations: [] });

  try {
    const parsed = extractJSON(reply); if (parsed && Array.isArray(parsed)) return res.json({ variations: parsed });
  } catch (e) {
    console.error('Parse error:', e.message);
  }
  res.json({ variations: [] });
});

// ===== AI 生成新模板 =====
app.post('/api/generate-template', async (req, res) => {
  const { grade, topic, genre = 'computation', count = 3 } = req.body;
  if (!provider || !config?.apiKey) return res.json({ templates: [] });

  const gradeNames = { p1: '小一', p2: '小二', p3: '小三', p4: '小四', p5: '小五', p6: '小六', f1: '中一', f2: '中二', f3: '中三' };

  const systemPrompt = [
    '你是香港中小学数学课程专家，负责为' + (gradeNames[grade] || grade) + '设计数学题目模板。',
    '',
    '每个模板包含：',
    '1. pattern：题目模式，用 {var} 表示变量',
    '2. variables：变量定义（数值范围、可选词语列表）',
    '3. answer：答案计算公式',
    '4. distractors：3个错误选项计算公式',
    '5. distractorLabels：每个错误选项对应的错误原因',
    '',
    '返回纯JSON数组，每个对象包含: id, pattern, variables, answer, distractors, distractorLabels, genre, edbCodes, difficulty',
    '',
    '注意：变量的range用数字范围，数组用字符串列表。答案和干扰项用表达式，支持 + - * / abs()',
  ].join('\n');

  const promptText = '请为' + (gradeNames[grade] || grade) + '设计' + count + '个关于"' + topic + '"的' + (genre === 'word-problem' ? '应用题' : '计算题') + '模板。';
  const reply = await askAI(systemPrompt, promptText, 1200);
  if (!reply) return res.json({ templates: [] });

  try {
    const parsed = extractJSON(reply); if (parsed && Array.isArray(parsed)) {
      const enriched = parsed.map((t, i) => ({
        ...t,
        grade,
        genre: genre || 'computation',
        id: t.id || `AI-${grade.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      }));
      return res.json({ templates: enriched });
    }
  } catch (e) {
    console.error('Parse error:', e.message);
  }
  res.json({ templates: [] });
});

// ===== AI 助教：OCR 文字识别（支持 Claude 和 DeepSeek 双模态） =====
app.post('/api/ocr', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: '缺少图片数据' });
  if (!provider || !config?.apiKey) return res.json({ text: null });

  const systemPrompt = `请提取这张图片中的所有文字内容。这是香港小学的课本或练习册页面，
可能包含繁体中文、英文或数字。请完整、准确地提取所有文字，保持原有段落格式和顺序。
如果图片中有算式，请保持数学符号的准确性。只输出文字内容，不要添加其他说明。`;

  const text = await askAI(systemPrompt, { text: '请提取这张图片中的所有文字内容。', image, mimeType: 'image/png' }, 800);
  res.json({ text: text || null });
});

// ===== AI 助教：作业诊断（核心引导式教学） =====
app.post('/api/tutor/homework-diagnose', async (req, res) => {
  const { textContent, imageData, mimeType, subject, grade, wrongRecords, masteryData } = req.body;
  if (!provider || !config?.apiKey) return res.json(null);
  if (!textContent && !imageData) return res.json({ error: '缺少作业内容或图片' });

  const subjectName = { math: '数学', chinese: '汉字', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

  const systemPrompt = `你是香港一位专门培养小学生"自检习惯"和"数感逻辑"的资深高级${subjectName}助教。

你的核心教学原则：
1. 反馈非具体化：发现错误时，绝不指明具体是哪道题或哪个算式，只告诉学生错误总数
2. 逻辑前置：引导学生在计算前先估算，在解题前先提取关键词
3. 验证闭环：每道题答完后鼓励用反向验算检查
4. 视觉化引导：鼓励用线段图或分块草稿理清多步运算逻辑
5. 语言亲切有趣：多用"侦探"、"挑战"、"发现"等词汇，将订正过程趣味化

根据提供的作业内容，分析所有错误并按类型归类。输出严格的 JSON 格式（不要包含其他文字）：

{
  "errorCount": 数字,
  "errorTypes": ["careless"|"keyword"|"logic"|"geometry"],
  "firstMessage": "用侦探口吻告诉学生错误总数，鼓励他自己找出问题",
  "guidanceSteps": [
    {
      "type": "careless",
      "detectiveHint": "针对计算粗心的非具体引导提示，使用估算防御策略",
      "strategy": "estimation-defense"
    }
  ],
  "errorDetails": {
    "careless": "分析计算粗心类错误的模式描述（不指明具体位置）",
    "keyword": "分析关键词遗漏类错误的模式描述",
    "logic": "分析多步逻辑断层类错误的模式描述",
    "geometry": "分析几何观察遗漏类错误的模式描述"
  },
  "habitChallenge": {
    "type": "reverse-check|neat-draft|common-sense",
    "title": "挑战标题",
    "description": "挑战描述"
  }
}

错误类型说明：
- careless: 计算粗心（进位/退位/口诀错误）→ 策略：估算防御，先估后算
- keyword: 关键词遗漏（"半打"、"比...贵"等）→ 策略：圈出数量关系词
- logic: 多步逻辑断层（漏掉中间步骤）→ 策略：画线段图辅助
- geometry: 几何观察遗漏（漏数图形）→ 策略：有序搜索，从小到大

习惯挑战 3 种类型：
- reverse-check: "请用加法检查减法题的答案"
- neat-draft: "把竖式重新写在草稿区，确保个位十位对齐"
- common-sense: "算出的结果比题目给的数值还大/小？这合理吗？"`;

  const userMsgText = `学生年级：${grade}
掌握的薄弱环节：${(wrongRecords || []).slice(0, 10).map(r => r.category).filter(Boolean).join('、') || '暂无记录'}
掌握度数据：${JSON.stringify(masteryData || [])}

作业内容：
${textContent || '（见上传图片）'}

请分析这份作业中的错误，输出诊断 JSON。`;

  // 有图片 → 直接视觉分析，不依赖 OCR
  const msg = imageData
    ? { text: userMsgText, image: imageData, mimeType: mimeType || 'image/png' }
    : userMsgText;
  const reply = await askAI(systemPrompt, msg, 1200);
  if (!reply) return res.json(null);

  try {
    const parsed = extractJSON(reply); if (parsed) return res.json(parsed);
  } catch (e) {
    console.error('Diagnose parse error:', e.message);
  }
  res.json(null);
});

// ===== AI 助教：自适应复习出题 =====
app.post('/api/generate-review', async (req, res) => {
  const { subject, grade, textbookContent, imageData, mimeType, wrongTopics, masteryData, count = 5 } = req.body;
  if (!provider || !config?.apiKey) return res.json({ questions: null });
  if (!textbookContent && !imageData) return res.json({ error: '缺少课本内容或图片' });

  const subjectName = { math: '数学', chinese: '汉字', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

  // 按掌握度排序的薄弱知识点（level < 0.6 的优先出题）
  const weakPoints = (masteryData || [])
    .filter(m => m.level < 0.6)
    .sort((a, b) => a.level - b.level)
    .map(m => m.topic);

  const allFocus = [...new Set([...(wrongTopics || []), ...weakPoints])];

  const systemPrompt = `你是香港一位专门培养小学生"自检习惯"和"数感逻辑"的资深高级${subjectName}助教。

你的任务是根据学生提供的课本内容和掌握度数据，出针对性的复习题。

核心要求：
1. 题目必须基于提供的课本内容，确保与所学知识紧密相关
2. 优先考察薄弱知识点（wrongTopics 中 level < 0.6 的），掌握度越低出题越多
3. 题目难度适合 ${grade} 年级，使用繁体中文
4. 每道题附带"常见错误提醒"（commonMistake），帮助学生避开典型陷阱
5. 多步计算题附带"估算提示"（estimationTip），培养先估后算的习惯
6. 题型多样化：选择题（4选1）、填空题、判断题混合
7. 薄弱知识点出 70%，新内容出 30%

输出严格 JSON 格式（不要包含其他文字）：
{
  "questions": [
    {
      "id": "REV-1",
      "question": "题目文字",
      "answer": "正确答案",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "story": "解题思路讲解（30字以内）",
      "category": "知识点分类",
      "commonMistake": "⚠️ 常见错误提醒",
      "estimationTip": "💡 估算提示"
    }
  ]
}`;

  const userMsgText = `课本内容：
${textbookContent || '（见上传图片）'}

学生年级：${grade}
薄弱知识点（按优先级）：${allFocus.join('、') || '暂无记录'}
掌握度数据：${JSON.stringify(masteryData || [])}
出题数量：${count}

请出 ${count} 道 ${subjectName} 复习题，重点考察薄弱环节。`;

  // 有图片 → AI 直接看课本图片出题
  const msg = imageData
    ? { text: userMsgText, image: imageData, mimeType: mimeType || 'image/png' }
    : userMsgText;
  const reply = await askAI(systemPrompt, msg, 1500);
  if (!reply) return res.json({ questions: null });

  try {
    const parsed = extractJSON(reply); if (parsed) return res.json(parsed);
  } catch (e) {
    console.error('Review parse error:', e.message);
  }
  res.json({ questions: null });
});

// ===== AI 内容自动分类 =====
app.post('/api/tutor/classify', async (req, res) => {
  const { items, subject, grade } = req.body;
  if (!provider || !config?.apiKey) return res.json({ groups: null });
  if (!items?.length) return res.json({ error: '缺少上传内容' });

  const subjectName = { math: '数学', chinese: '中文', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

  const systemPrompt = `你是香港一位资深${subjectName}教师，擅长分析学生的学习材料。

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
    if (item.imageData) return `[${i + 1}] 图片：（已上传图片）`;
    return `[${i + 1}] （空）`;
  }).join('\n');

  const userMsgText = `科目：${subjectName}
年级：${grade}
共 ${items.length} 份内容：

${itemsText}

请自动分类分组并分析。`;

  // 构建消息（支持多张图片）
  const hasImages = items.some(i => i.imageData);
  let msg;
  if (hasImages) {
    // 有图片时，把文本和第一张图片一起发给 AI（视觉模型）
    const firstImageItem = items.find(i => i.imageData);
    msg = {
      text: userMsgText + '\n\n注意：请直接分析图片中的内容，不要依赖OCR文本。',
      image: firstImageItem.imageData,
      mimeType: firstImageItem.mimeType || 'image/png',
    };
  } else {
    msg = userMsgText;
  }

  const reply = await askAI(systemPrompt, msg, 1200);
  if (!reply) return res.json({ groups: null });

  try {
    const parsed = extractJSON(reply); if (parsed) return res.json(parsed);
  } catch (e) {
    console.error('Classify parse error:', e.message);
  }
  res.json({ groups: null });
});

// ===== AI 根据选中分组生成模拟试卷 =====
app.post('/api/tutor/generate-exam', async (req, res) => {
  const { subject, grade, groups, weakTopics, masteryData, count = 10 } = req.body;
  if (!provider || !config?.apiKey) return res.json({ questions: null });
  if (!groups?.length) return res.json({ error: '缺少分组内容' });

  const subjectName = { math: '数学', chinese: '中文', cantonese: '粤语', english: '英文', gs: '常识' }[subject] || subject;

  const groupsText = groups.map((g, i) => {
    const content = g.items?.map(item => item.text || '（图片）').join('；') || g.summary || '';
    return `分组${i + 1}：${g.label}（${g.type}，${g.difficulty}）\n涉及：${(g.topics || []).join('、')}\n内容摘要：${content.slice(0, 500)}`;
  }).join('\n\n');

  // 检查是否有图片需要发送给 AI
  const allItems = groups.flatMap(g => g.items || []).filter(Boolean);
  const firstImageItem = allItems.find(item => item.imageData);

  const weakPoints = (masteryData || [])
    .filter(m => m.level < 0.6)
    .sort((a, b) => a.level - b.level)
    .map(m => m.topic);

  const allFocus = [...new Set([...(weakTopics || []), ...weakPoints])];

  const systemPrompt = `你是香港一位资深${subjectName}教师，擅长根据学生的学习情况出针对性的模拟试卷。

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
      "question": "题目文字，如果引用了图形请用【图】标记",
      "answer": "正确答案的文字（不要用ABCD字母！必须是选项数组中实际出现的文本值）",
      "options": ["错误选项1", "正确答案", "错误选项2", "错误选项3"],
      "category": "知识点",
      "difficulty": 1-3,
      "hint": "解题提示",
      "diagram": "如果题目涉及图形，在这里用简易的文字描述图形（如"一个三角形底10cm高6cm"）。不需要图形时设为null"
    }
  ],
  "summary": {
    "topics": ["覆盖的知识点"],
    "weakFocus": ["重点考察的薄弱点"],
    "tip": "考试建议"
  }
}`;

  const userMsgText = `科目：${subjectName}
年级：${grade}
选中分组内容：
${groupsText}

学生薄弱知识点：${allFocus.join('、') || '暂无'}
掌握度数据：${JSON.stringify(masteryData || [])}

请生成 ${count} 道模拟试卷题目。`;

  // 如果有图片，把图片也传给 AI（视觉模型可以直接看懂图片内容）
  const msg = firstImageItem
    ? { text: userMsgText, image: firstImageItem.imageData, mimeType: firstImageItem.mimeType || 'image/png' }
    : userMsgText;

  const reply = await askAI(systemPrompt, msg, 2000);
  if (!reply) return res.json({ questions: null });

  try {
    const parsed = extractJSON(reply); if (parsed) return res.json(parsed);
  } catch (e) {
    console.error('Exam parse error:', e.message);
  }
  res.json({ questions: null });
});

// ===== 启动 =====
app.listen(PORT, () => {
  console.log(`   服务端口: http://localhost:${PORT}`);
  console.log(`   前端地址: http://localhost:5173\n`);
});
