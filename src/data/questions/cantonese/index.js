// 粤语题库 — 新Schema格式
// 基于现有 cantonese.js 转换

import { phrases, categories, scenarios, pronunciationTips } from '../../cantonese';
import { createQuestion, SUBJECTS, QUESTION_TYPES, RESPONSE_TYPES, REPRESENTATION_TYPES } from '../schemas/questionSchema';

// 等级转年级
function levelToGrade(level) {
  const map = { 1: ['p1', 'p2'], 2: ['p3', 'p4'], 3: ['p5', 'p6', 'f1', 'f2', 'f3'] };
  return map[level]?.[0] || 'p3';
}

// 转换短语为标准题目
function convertPhrases() {
  return phrases.map(p => createQuestion({
    id: `CAN-${p.category.toUpperCase()}-${String(p.id).padStart(3, '0')}`,
    subject: SUBJECTS.CANTONESE,
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    genre: 'translation',
    curriculumRef: {
      grade: levelToGrade(p.level),
      edbCodes: [p.category],
      difficulty: p.level,
    },
    content: {
      prompt: `"${p.mandarin}" 的粤语是？`,
      representation: REPRESENTATION_TYPES.TEXT,
    },
    response: {
      type: RESPONSE_TYPES.SINGLE_SELECT,
      correctAnswer: p.cantonese,
    },
    metadata: {
      tags: [p.category, '粤語', p.jyutping],
    },
  }));
}

const convertedPhrases = convertPhrases();

export default convertedPhrases;

// 保留原格式导出
export { categories, scenarios, pronunciationTips };
export { phrases as legacyPhrases };

// 按分类查询
export function getCantoneseByCategory(category) {
  return convertedPhrases.filter(p => {
    const cats = p.curriculumRef?.edbCodes || [];
    return cats.includes(category);
  });
}

// 按年级查询
export function getCantoneseByGrade(grade) {
  return convertedPhrases.filter(p => p.curriculumRef?.grade === grade);
}
