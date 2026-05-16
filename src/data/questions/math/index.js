// 数学题库 — 新Schema格式
// 基于现有 mathProblems.js 转换，保持向后兼容

import { problems, mathCategories } from '../../mathProblems';
import { createQuestion, SUBJECTS, QUESTION_TYPES, RESPONSE_TYPES, REPRESENTATION_TYPES } from '../schemas/questionSchema';
import { GRADE_MAP } from '../../curriculum/curriculumMap';

// 题目等级转年级
function levelToGrade(level) {
  const map = { 1: ['p1', 'p2'], 2: ['p3', 'p4'], 3: ['p5', 'p6', 'f1', 'f2', 'f3'] };
  return map[level]?.[0] || 'p3';
}

// 转换全部题目为新Schema
function convertAll() {
  return problems.map(p => {
    const grades = levelToGrade(p.level);
    const distractorRationale = p.options
      .filter(o => o !== p.answer)
      .map(o => {
        const diff = Math.abs(Number(o) - Number(p.answer));
        if (diff === 10) return '忘記進位/退位';
        if (diff === 100) return '位值錯誤';
        if (diff === 1) return '計算誤差';
        return '計算錯誤';
      });

    return createQuestion({
      id: `MTH-${p.category.toUpperCase()}-${String(p.id).padStart(3, '0')}`,
      subject: SUBJECTS.MATH,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      genre: p.story ? 'word-problem' : 'computation',
      curriculumRef: {
        grade: grades,
        edbCodes: [p.category],
        difficulty: p.level,
      },
      content: {
        prompt: p.question,
        computation: p.question,
        representation: REPRESENTATION_TYPES.TEXT,
      },
      response: {
        type: RESPONSE_TYPES.SINGLE_SELECT,
        correctAnswer: String(p.answer),
        distractors: p.options.filter(o => o !== p.answer).map(String),
        distractorRationale,
      },
      metadata: {
        tags: [p.category, ...(p.story ? ['應用題'] : ['計算題'])],
      },
    });
  });
}

const convertedMathProblems = convertAll();

export default convertedMathProblems;

// 保留原格式导出（向后兼容）
export { problems as legacyProblems, mathCategories };

// 按分类查询
export function getMathProblemsByCategory(category) {
  return convertedMathProblems.filter(p => {
    const cats = p.curriculumRef?.edbCodes || [];
    return cats.includes(category);
  });
}

// 按年级查询
export function getMathProblemsByGrade(grade) {
  return convertedMathProblems.filter(p => p.curriculumRef?.grade === grade);
}

// 按等级查询（1-3）
export function getMathProblemsByLevel(level) {
  const grades = levelToGrade(level);
  return getMathProblemsByGrade(grades);
}
