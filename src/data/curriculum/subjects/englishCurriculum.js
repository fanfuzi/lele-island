// 英文科课程大纲 (P1-F3)
export const englishCurriculum = [
  // P1-P2: 基础
  { grade: 'p1', domain: '文法', topic: 'Basic Verbs', edbRef: 'EN1-1.1', difficulty: 1 },
  { grade: 'p1', domain: '文法', topic: 'Pronouns', edbRef: 'EN1-1.2', difficulty: 1 },
  { grade: 'p1', domain: '詞彙', topic: 'Colors & Numbers', edbRef: 'EN1-2.1', difficulty: 1 },
  { grade: 'p1', domain: '詞彙', topic: 'Animals & Food', edbRef: 'EN1-2.2', difficulty: 1 },
  { grade: 'p2', domain: '文法', topic: 'Present Simple', edbRef: 'EN2-1.1', difficulty: 1 },
  { grade: 'p2', domain: '文法', topic: 'Prepositions', edbRef: 'EN2-1.2', difficulty: 1 },
  { grade: 'p2', domain: '詞彙', topic: 'Family & School', edbRef: 'EN2-2.1', difficulty: 1 },

  // P3-P4: 进阶
  { grade: 'p3', domain: '文法', topic: 'Present Continuous', edbRef: 'EN3-1.1', difficulty: 2 },
  { grade: 'p3', domain: '文法', topic: 'Past Simple', edbRef: 'EN3-1.2', difficulty: 2 },
  { grade: 'p3', domain: '文法', topic: 'Articles (a/an/the)', edbRef: 'EN3-1.3', difficulty: 2 },
  { grade: 'p3', domain: '閱讀', topic: 'Simple Reading', edbRef: 'EN3-2.1', difficulty: 2 },
  { grade: 'p4', domain: '文法', topic: 'Future Tense', edbRef: 'EN4-1.1', difficulty: 2 },
  { grade: 'p4', domain: '文法', topic: 'Comparatives', edbRef: 'EN4-1.2', difficulty: 2 },
  { grade: 'p4', domain: '詞彙', topic: 'Weather & Seasons', edbRef: 'EN4-2.1', difficulty: 2 },

  // P5-P6: 高小
  { grade: 'p5', domain: '文法', topic: 'Present Perfect', edbRef: 'EN5-1.1', difficulty: 3 },
  { grade: 'p5', domain: '文法', topic: 'Passive Voice', edbRef: 'EN5-1.2', difficulty: 3 },
  { grade: 'p5', domain: '寫作', topic: 'Sentence Structure', edbRef: 'EN5-3.1', difficulty: 3 },
  { grade: 'p6', domain: '文法', topic: 'Conditionals', edbRef: 'EN6-1.1', difficulty: 3 },
  { grade: 'p6', domain: '文法', topic: 'Relative Clauses', edbRef: 'EN6-1.2', difficulty: 3 },
  { grade: 'p6', domain: '閱讀', topic: 'Comprehension', edbRef: 'EN6-2.1', difficulty: 3 },

  // F1-F3: 初中
  { grade: 'f1', domain: '文法', topic: 'Tenses Review', edbRef: 'EN7-1.1', difficulty: 4 },
  { grade: 'f1', domain: '文法', topic: 'Reported Speech', edbRef: 'EN7-1.2', difficulty: 4 },
  { grade: 'f2', domain: '文法', topic: 'Gerunds & Infinitives', edbRef: 'EN8-1.1', difficulty: 4 },
  { grade: 'f2', domain: '詞彙', topic: 'Phrasal Verbs', edbRef: 'EN8-2.1', difficulty: 4 },
  { grade: 'f3', domain: '文法', topic: 'Subjunctive Mood', edbRef: 'EN9-1.1', difficulty: 5 },
];

export function getEnglishCurriculum(grade) {
  return englishCurriculum.filter(c => c.grade === grade);
}

export default englishCurriculum;
