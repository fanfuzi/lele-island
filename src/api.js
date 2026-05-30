// AI API 客户端 - 调用后端AI服务
// 如果后端不可用，优雅降级到本地处理

const API_BASE = '/api';

async function fetchAPI(endpoint, data = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`API ${endpoint} failed:`, e.message);
    return null;
  }
}

// AI粤语对话
export async function chatCantonese(messages, level = 1) {
  const res = await fetchAPI('/chat', { messages, level });
  return res?.reply || null;
}

// AI生成数学题
export async function generateMathProblems(level = 1, count = 5, wrongTopics = []) {
  const res = await fetchAPI('/generate-math', { level, count, wrongTopics });
  if (res?.problems) return res.problems;
  return null; // fallback to local题库
}

// AI鼓励语
export async function getEncouragement(stats) {
  const res = await fetchAPI('/encourage', { stats });
  return res?.message || '继续加油哦！团子为你骄傲！🎉';
}

// AI学习诊断
export async function getStudyAdvice(history) {
  const res = await fetchAPI('/advice', { history });
  return res?.advice || null;
}

// 检查AI是否可用
export async function checkAIStatus() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

// AI错题分析
export async function analyzeMistakes(subject, wrongRecords, level = 1) {
  const res = await fetchAPI('/analyze-mistakes', { subject, wrongRecords, level });
  return res || null;
}

// AI题目变体生成
export async function generateQuestionVariations(question, count = 3, grade = 'p3', subject = 'math') {
  const res = await fetchAPI('/vary-question', { question, count, grade, subject });
  return res?.variations || [];
}

// AI生成新题目模板
export async function generateAITemplates(grade, topic, genre = 'computation', count = 3) {
  const res = await fetchAPI('/generate-template', { grade, topic, genre, count });
  return res?.templates || [];
}

// AI 作业诊断（助教模式）
export async function homeworkDiagnose({ textContent, imageData, mimeType, subject, grade, wrongRecords, masteryData }) {
  const res = await fetchAPI('/tutor/homework-diagnose', {
    textContent, imageData, mimeType, subject, grade, wrongRecords, masteryData,
  });
  return res || null;
}

// AI 自适应复习出题
export async function generateReview({ subject, grade, textbookContent, imageData, mimeType, wrongTopics, masteryData, count = 5 }) {
  const res = await fetchAPI('/generate-review', {
    subject, grade, textbookContent, imageData, mimeType, wrongTopics, masteryData, count,
  });
  return res || null;
}

// AI 内容自动分类
export async function classifyContent({ items, subject, grade }) {
  const res = await fetchAPI('/tutor/classify', { items, subject, grade });
  return res || null;
}

// AI 根据选中分组生成模拟试卷
export async function generateExam({ subject, grade, groups, weakTopics, masteryData, count = 10 }) {
  const res = await fetchAPI('/tutor/generate-exam', { subject, grade, groups, weakTopics, masteryData, count });
  return res || null;
}
