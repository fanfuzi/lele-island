// 常識科课程大纲 (P1-P6)
export const gsCurriculum = [
  { grade: 'p1', domain: '健康', topic: '個人衛生', edbRef: 'GS1-1.1', difficulty: 1 },
  { grade: 'p1', domain: '社會', topic: '家庭與社區', edbRef: 'GS1-2.1', difficulty: 1 },
  { grade: 'p2', domain: '科學', topic: '動植物', edbRef: 'GS2-1.1', difficulty: 1 },
  { grade: 'p2', domain: '環境', topic: '天氣與四季', edbRef: 'GS2-2.1', difficulty: 1 },
  { grade: 'p3', domain: '健康', topic: '食物與營養', edbRef: 'GS3-1.1', difficulty: 2 },
  { grade: 'p3', domain: '社會', topic: '香港的節日', edbRef: 'GS3-2.1', difficulty: 2 },
  { grade: 'p3', domain: '科學', topic: '力與運動', edbRef: 'GS3-3.1', difficulty: 2 },
  { grade: 'p4', domain: '科學', topic: '光與聲音', edbRef: 'GS4-1.1', difficulty: 2 },
  { grade: 'p4', domain: '環境', topic: '環保與回收', edbRef: 'GS4-2.1', difficulty: 2 },
  { grade: 'p4', domain: '社會', topic: '香港交通', edbRef: 'GS4-3.1', difficulty: 2 },
  { grade: 'p5', domain: '科學', topic: '電與磁', edbRef: 'GS5-1.1', difficulty: 3 },
  { grade: 'p5', domain: '健康', topic: '人體系統', edbRef: 'GS5-2.1', difficulty: 3 },
  { grade: 'p5', domain: '社會', topic: '基本法', edbRef: 'GS5-3.1', difficulty: 3 },
  { grade: 'p6', domain: '科學', topic: '地球與宇宙', edbRef: 'GS6-1.1', difficulty: 3 },
  { grade: 'p6', domain: '環境', topic: '能源危機', edbRef: 'GS6-2.1', difficulty: 3 },
  { grade: 'p6', domain: '社會', topic: '世界公民', edbRef: 'GS6-3.1', difficulty: 3 },
];

export function getGSCurriculum(grade) {
  return gsCurriculum.filter(c => c.grade === grade);
}

export default gsCurriculum;
