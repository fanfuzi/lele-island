/**
 * 题目批量生成脚本
 * 从 mathTemplates 生成大量题目，按年级导出
 */

import { generateFromTemplates, generateBatch } from './templateEngine';
import { mathTemplates } from './mathTemplates';

// 每个年级的目标题数
const TARGETS = {
  p1: 200,
  p2: 300,
  p3: 500,
  p4: 400,
  p5: 300,
  p6: 300,
  f1: 200,
  f2: 150,
  f3: 100,
};

/**
 * 为指定年级生成题目
 * @param {string} grade - 年级 (p1-f3)
 * @param {number} count - 生成数量
 * @returns {Array} 题目数组
 */
export function generateForGrade(grade, count) {
  const templates = mathTemplates.filter(t => t.grade === grade);
  if (templates.length === 0) return [];
  return generateFromTemplates(templates, { total: count, grade });
}

/**
 * 为所有年级生成题目
 * @param {object} overrides - 可选覆盖各年级目标数量
 * @returns {object} { p1: [...], p2: [...], ... }
 */
export function generateAll(overrides = {}) {
  const result = {};
  const grades = [...new Set(mathTemplates.map(t => t.grade))].sort();
  for (const grade of grades) {
    const count = overrides[grade] || TARGETS[grade] || 200;
    result[grade] = generateForGrade(grade, count);
    console.log(`[expand] ${grade}: generated ${result[grade].length} problems`);
  }
  return result;
}

/**
 * 获取所有年级的扁平化题目列表（用于查询引擎）
 * @returns {Array} 所有题目
 */
export function getAllExpandedProblems() {
  const all = [];
  const grades = [...new Set(mathTemplates.map(t => t.grade))].sort();
  for (const grade of grades) {
    // 每次生成适量题目（app运行时可重新生成）
    const problems = generateForGrade(grade, TARGETS[grade] || 200);
    all.push(...problems);
  }
  return all;
}

// 模板统计
export function getTemplateStats() {
  const stats = {};
  for (const t of mathTemplates) {
    if (!stats[t.grade]) stats[t.grade] = { templates: 0, genres: new Set() };
    stats[t.grade].templates++;
    stats[t.grade].genres.add(t.genre);
  }
  const result = {};
  for (const [grade, s] of Object.entries(stats)) {
    result[grade] = { templates: s.templates, genres: [...s.genres] };
  }
  return result;
}
