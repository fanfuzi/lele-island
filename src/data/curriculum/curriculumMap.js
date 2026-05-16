// 香港中小学课程大纲映射
// 参照香港教育局课程指引编制

export const GRADE_MAP = [
  { id: 'p1', label: '小一', curriculumLevel: 1, subjectLevel: 1 },
  { id: 'p2', label: '小二', curriculumLevel: 2, subjectLevel: 1 },
  { id: 'p3', label: '小三', curriculumLevel: 3, subjectLevel: 2 },
  { id: 'p4', label: '小四', curriculumLevel: 4, subjectLevel: 2 },
  { id: 'p5', label: '小五', curriculumLevel: 5, subjectLevel: 3 },
  { id: 'p6', label: '小六', curriculumLevel: 6, subjectLevel: 3 },
  { id: 'f1', label: '中一', curriculumLevel: 7, subjectLevel: 4 },
  { id: 'f2', label: '中二', curriculumLevel: 8, subjectLevel: 4 },
  { id: 'f3', label: '中三', curriculumLevel: 9, subjectLevel: 4 },
];

export function getCurriculumLevel(gradeId) {
  return GRADE_MAP.find(g => g.id === gradeId)?.curriculumLevel || 3;
}

export function getSubjectLevel(gradeId) {
  return GRADE_MAP.find(g => g.id === gradeId)?.subjectLevel || 2;
}

export function getGradeByLevel(curriculumLevel) {
  return GRADE_MAP.find(g => g.curriculumLevel === curriculumLevel);
}

// 从旧3级映射到新9级（用于向后兼容）
export function mapOldLevelToGrades(oldLevel) {
  // oldLevel 1 → P1-P2 (curriculumLevel 1-2)
  // oldLevel 2 → P3-P4 (curriculumLevel 3-4)
  // oldLevel 3 → P5-F3 (curriculumLevel 5-9)
  const ranges = { 1: [1, 2], 2: [3, 4], 3: [5, 9] };
  return ranges[oldLevel] || [3, 4];
}

// 从curriculumLevel获取对应年级的起始subjectLevel
export function getSubjectLevelFromCurriculum(curriculumLevel) {
  const grade = GRADE_MAP.find(g => g.curriculumLevel === curriculumLevel);
  return grade?.subjectLevel || 2;
}
