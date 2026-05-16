// 统一查询引擎
// 替代各Screen中零散的 useMemo + filter + slice 逻辑

import { getCurriculumLevel, GRADE_MAP } from './curriculum/curriculumMap';
import mathCurriculum from './curriculum/subjects/mathCurriculum';
import { generateFromTemplates } from './expansion/templateEngine';
import { mathTemplates } from './expansion/mathTemplates';
import { englishTemplates } from './expansion/englishTemplates';
import { gsTemplates } from './expansion/gsTemplates';

/**
 * 查询题目
 * @param {Object} params
 * @param {Array} params.questions   - 题目数组（已加载到内存）
 * @param {string} params.subject    - 科目
 * @param {number} params.maxLevel   - 最大等级（筛选 <= 该等级）
 * @param {string} params.topic      - 可选：按知识点筛选
 * @param {number} params.count      - 返回数量
 * @param {Array} params.excludeIds  - 排除的题目ID
 * @param {boolean} params.shuffle   - 是否随机排序，默认true
 */
export function findQuestions({ questions = [], maxLevel, topic, count = 10, excludeIds = [], shuffle = true }) {
  if (!questions.length) return [];

  let filtered = questions;

  // 按等级筛选
  if (maxLevel) {
    filtered = filtered.filter(q => {
      const level = q.level || q.curriculumRef?.difficulty || 1;
      return level <= maxLevel;
    });
  }

  // 按知识点筛选
  if (topic) {
    filtered = filtered.filter(q => {
      const cat = q.category || q.curriculumRef?.edbCodes?.[0] || '';
      return cat === topic;
    });
  }

  // 排除指定ID
  if (excludeIds.length) {
    filtered = filtered.filter(q => !excludeIds.includes(q.id));
  }

  // 随机排序
  if (shuffle) {
    filtered = [...filtered].sort(() => Math.random() - 0.5);
  }

  return filtered.slice(0, count);
}

/**
 * 从各类别均衡取题
 * @param {Object} params
 * @param {Array} params.questions
 * @param {number} params.count - 总题数
 * @param {number} params.maxLevel
 */
export function getBalancedQuestions({ questions = [], count = 10, maxLevel }) {
  if (!questions.length) return [];

  let pool = questions;
  if (maxLevel) {
    pool = pool.filter(q => (q.level || 1) <= maxLevel);
  }

  // 按类别分组
  const byCategory = {};
  pool.forEach(q => {
    const cat = q.category || q.curriculumRef?.edbCodes?.[0] || 'general';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(q);
  });

  const catIds = Object.keys(byCategory);
  if (!catIds.length) return [];

  const perCategory = Math.max(1, Math.floor(count / catIds.length));
  const picked = [];
  const usedIds = new Set();

  // 每类至少取 perCategory 题
  catIds.forEach(catId => {
    const pool = byCategory[catId].filter(q => !usedIds.has(q.id));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(perCategory, shuffled.length) && picked.length < count; i++) {
      picked.push(shuffled[i]);
      usedIds.add(shuffled[i].id);
    }
  });

  // 补不够的
  if (picked.length < count) {
    const remaining = pool.filter(q => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
    for (const q of remaining) {
      if (picked.length >= count) break;
      picked.push(q);
      usedIds.add(q.id);
    }
  }

  return picked;
}

/**
 * 获取错题的知识点分析
 * @param {Array} wrongRecords - [{ category, questionId }]
 * @param {Array} questions    - 完整的题目数据
 * @returns {Array} [{ category, count, percentage }]
 */
export function analyzeWrongRecords(wrongRecords, questions) {
  if (!wrongRecords?.length) return [];

  const counts = {};
  wrongRecords.forEach(r => {
    const cat = r.category || 'unknown';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const total = wrongRecords.length;
  return Object.entries(counts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 获取年级对应的课程大纲
 */
export function getCurriculumPath(gradeId) {
  const cl = getCurriculumLevel(gradeId);
  const grade = GRADE_MAP.find(g => g.curriculumLevel === cl);
  if (!grade) return [];
  return mathCurriculum.filter(c => c.grade === grade.id);
}

/**
 * 转换题目为游戏组件需要的格式
 */
export function toQuizQuestion(q) {
  const answer = q.response?.correctAnswer || q.answer;
  const options = q.response?.distractors
    ? [answer, ...q.response.distractors]
    : (q.options || []);
  // 打乱选项（在组件中再洗牌，这里保持原样）
  return {
    id: q.id,
    question: q.content?.prompt || q.question,
    answer: String(answer),
    options: options.map(String),
    story: q.story || null,
    category: q.category || q.curriculumRef?.edbCodes?.[0] || null,
  };
}

/**
 * 从模板生成题目（无限扩充）
 * @param {Object} params
 * @param {string} params.subject   - 科目: 'math' | 'english' | 'gs'
 * @param {string} params.grade     - 年级 (p1-f3)
 * @param {number} params.count     - 数量
 * @param {string} params.genre     - 可选：'computation' | 'word-problem'
 * @param {string} params.edbCode   - 可选：按知识点编码筛选
 * @returns {Array} 生成的题目
 */
const SUBJECT_TEMPLATES = {
  math: mathTemplates,
  english: englishTemplates,
  gs: gsTemplates,
};

export function getTemplateGeneratedProblems({ subject = 'math', grade, count = 10, genre, edbCode } = {}) {
  let templates = SUBJECT_TEMPLATES[subject] || mathTemplates;
  if (grade) templates = templates.filter(t => t.grade === grade);
  if (genre) templates = templates.filter(t => t.genre === genre);
  if (edbCode) templates = templates.filter(t => t.edbCodes?.includes(edbCode));

  if (templates.length === 0) return [];

  const generated = generateFromTemplates(templates, { total: count, grade, genre });
  // 为不同科目标记类别
  return generated.map(p => ({ ...p, subject }));
}

export default {
  findQuestions,
  getBalancedQuestions,
  analyzeWrongRecords,
  getCurriculumPath,
  toQuizQuestion,
  getTemplateGeneratedProblems,
};
