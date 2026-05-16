/**
 * 乐乐小岛 - AI后端服务
 * 支持 Claude (Anthropic) 和 Deepseek (OpenAI兼容) 两种AI提供商
 *
 * 配置方式 (环境变量):
 *   AI_PROVIDER=claude|deepseek   (默认 auto 根据API key前缀判断)
 *   ANTHROPIC_API_KEY=sk-ant-xxx   Claude API Key
 *   DEEPSEEK_API_KEY=sk-xxx       Deepseek API Key
 *   AI_MODEL=claude-sonnet-4-20250514  (Claude模型, 可选)
 *
 * 启动:
 *   DEEPSEEK_API_KEY=sk-xxx node server/index.js
 *   或
 *   ANTHROPIC_API_KEY=sk-ant-xxx node server/index.js
 */

import express from 'express';
import cors from 'cors';
import { authRouter } from './auth.js';
import { userRouter } from './user.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ===== 认证与用户路由 =====
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

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
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
  },
};

// 自动检测提供商
function detectProvider() {
  const envProvider = process.env.AI_PROVIDER;
  if (envProvider === 'claude' || envProvider === 'deepseek') {
    return envProvider;
  }

  const anthKey = process.env.ANTHROPIC_API_KEY;
  const dsKey = process.env.DEEPSEEK_API_KEY;

  if (anthKey && anthKey.startsWith('sk-ant-')) return 'anthropic';
  if (dsKey && dsKey.startsWith('sk-')) return 'deepseek';
  if (anthKey) return 'anthropic';
  if (dsKey) return 'deepseek';
  return null;
}

const provider = detectProvider();
const config = provider ? CONFIG[provider] : null;

console.log(`\n🌟 乐乐小岛 AI 服务器`);
if (provider && config?.apiKey) {
  console.log(`   使用 ${provider === 'anthropic' ? 'Claude' : 'Deepseek'} AI (模型: ${config.defaultModel})`);
} else {
  console.log(`   AI功能未启用`);
  console.log(`   设置 ANTHROPIC_API_KEY 或 DEEPSEEK_API_KEY 环境变量来开启`);
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
  const resp = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: config.headers(config.apiKey),
    body: JSON.stringify({
      model: config.defaultModel,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
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
  const resp = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: config.headers(config.apiKey),
    body: JSON.stringify({
      model: config.defaultModel,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
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

// ===== 健康检查 =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ai: !!provider && !!config?.apiKey,
    provider: provider,
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
    const jsonMatch = reply.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const problems = JSON.parse(jsonMatch[0]);
      return res.json({ problems });
    }
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
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return res.json(result);
    }
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
    const jsonMatch = reply.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const variations = JSON.parse(jsonMatch[0]);
      return res.json({ variations });
    }
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

  const systemPrompt = `你是香港中小学数学课程专家，负责为${gradeNames[grade] || grade}设计数学题目模板。

每个模板包含：
1. pattern：题目模式，用 {var} 表示变量
2. variables：变量定义（数值范围、可选词语列表）
3. answer：答案计算公式
4. distractors：3个错误选项计算公式
5. distractorLabels：每个错误选项对应的错误原因

返回纯JSON数组，格式：
[
  {
    "id": "AI-TPL-001",
    "pattern": "…{a}…{b}…",
    "variables": { "a": { "range": [10, 50] }, "b": { "range": [5, 20] }, "place": ["公园", "学校"] },
    "answer": "a + b",
    "distractors": ["abs(a-b)", "a+b+10", "a+b-10"],
    "distractorLabels": ["用減法", "進位錯誤", "退位錯誤"],
    "genre": "${genre}",
    "edbCodes": ["N3-1.1"],
    "difficulty": 2
  }
]

注意：变量的range用数字范围，数组用字符串列表。答案和干扰项用表达式，支持 + - * / abs()`,

  const reply = await askAI(systemPrompt, `请为${gradeNames[grade] || grade}设计${count}个关于"${topic}"的${genre === 'word-problem' ? '应用题' : '计算题'}模板。`, 1200);
  if (!reply) return res.json({ templates: [] });

  try {
    const jsonMatch = reply.match(/\[[\s\S]*\]/s);
    if (jsonMatch) {
      const templates = JSON.parse(jsonMatch[0]);
      // 补全字段
      const enriched = templates.map((t, i) => ({
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

// ===== 启动 =====
app.listen(PORT, () => {
  console.log(`   服务端口: http://localhost:${PORT}`);
  console.log(`   前端地址: http://localhost:5173\n`);
});
