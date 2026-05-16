// 汉字题库 — 新Schema格式
// 基于现有 characters.js 转换

import { charGroups, characters, quizPairs } from '../../characters';
import { createQuestion, SUBJECTS, QUESTION_TYPES, RESPONSE_TYPES, REPRESENTATION_TYPES } from '../schemas/questionSchema';

function levelToGrade(level) {
  const map = { 1: ['p1', 'p2'], 2: ['p3', 'p4'], 3: ['p5', 'p6', 'f1', 'f2', 'f3'] };
  return map[level]?.[0] || 'p3';
}

// 转换汉字为标准题目
function convertCharacters() {
  return characters.map(c => createQuestion({
    id: `CHN-${c.group.toUpperCase()}-${String(c.id).padStart(3, '0')}`,
    subject: SUBJECTS.CHINESE,
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    genre: 'character-recognition',
    curriculumRef: {
      grade: levelToGrade(c.level),
      edbCodes: [c.group],
      difficulty: c.level,
    },
    content: {
      prompt: `"${c.simplified}" 的繁体字是什么？`,
      representation: REPRESENTATION_TYPES.TEXT,
    },
    response: {
      type: RESPONSE_TYPES.SINGLE_SELECT,
      correctAnswer: c.traditional,
    },
    metadata: {
      tags: [c.group, '漢字', `筆畫${c.stroke}`],
    },
  }));
}

const convertedCharacters = convertCharacters();

export default convertedCharacters;

// 保留原格式导出
export { charGroups, quizPairs, characters as legacyCharacters };

// 按组查询
export function getCharactersByGroup(group) {
  return convertedCharacters.filter(c => {
    const cats = c.curriculumRef?.edbCodes || [];
    return cats.includes(group);
  });
}

// 按年级查询
export function getCharactersByGrade(grade) {
  return convertedCharacters.filter(c => c.curriculumRef?.grade === grade);
}
