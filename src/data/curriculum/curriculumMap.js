// 香港中小学课程大纲映射
// 参照香港教育局课程发展议会(CDC)官方课程指引编制
// 主要参考：
//   - 小学教育课程指引(PECG) 2024
//   - 中学教育课程指引(SECG) 2017 及补充说明(2021)
//   - 各学习领域课程指引

// ============================================================
// 年级映射
// ============================================================
export const GRADE_MAP = [
  { id: 'p1', label: '小一', curriculumLevel: 1, keyStage: 1, subjectLevel: 1 },
  { id: 'p2', label: '小二', curriculumLevel: 2, keyStage: 1, subjectLevel: 1 },
  { id: 'p3', label: '小三', curriculumLevel: 3, keyStage: 1, subjectLevel: 2 },
  { id: 'p4', label: '小四', curriculumLevel: 4, keyStage: 2, subjectLevel: 2 },
  { id: 'p5', label: '小五', curriculumLevel: 5, keyStage: 2, subjectLevel: 3 },
  { id: 'p6', label: '小六', curriculumLevel: 6, keyStage: 2, subjectLevel: 3 },
  { id: 'f1', label: '中一', curriculumLevel: 7, keyStage: 3, subjectLevel: 4 },
  { id: 'f2', label: '中二', curriculumLevel: 8, keyStage: 3, subjectLevel: 4 },
  { id: 'f3', label: '中三', curriculumLevel: 9, keyStage: 3, subjectLevel: 4 },
];

// ============================================================
// 学习阶段 (Key Stages) — 官方课程架构
// ============================================================
export const KEY_STAGES = {
  1: { name: '第一学习阶段 (KS1)', grades: ['p1', 'p2', 'p3'], desc: '基础能力培养' },
  2: { name: '第二学习阶段 (KS2)', grades: ['p4', 'p5', 'p6'], desc: '能力拓展与深化' },
  3: { name: '第三学习阶段 (KS3)', grades: ['f1', 'f2', 'f3'], desc: '衔接中学课程' },
};

// ============================================================
// 各科学习领域 (Learning Strands) — 官方EDB框架
// ============================================================

// 数学教育 — 三大学习范畴
export const MATH_STRANDS = {
  'NA': { name: '数与代数', nameEn: 'Number and Algebra', desc: '数的概念、运算、代数思维' },
  'MS': { name: '度量、图形与空间', nameEn: 'Measures, Shape and Space', desc: '几何、度量、空间关系' },
  'DA': { name: '数据处理', nameEn: 'Data Handling', desc: '统计图表、概率初步' },
};

// 中国语文教育 — 九个学习范畴
export const CHINESE_STRANDS = {
  'RD': { name: '阅读', nameEn: 'Reading', desc: '理解、分析、鉴赏文本' },
  'WR': { name: '写作', nameEn: 'Writing', desc: '表达思想、组织篇章' },
  'LI': { name: '聆听', nameEn: 'Listening', desc: '理解口语信息' },
  'SP': { name: '说话', nameEn: 'Speaking', desc: '口头表达与沟通' },
  'LT': { name: '文学', nameEn: 'Literature', desc: '文学欣赏与创作' },
  'CL': { name: '中华文化', nameEn: 'Chinese Culture', desc: '认识中华文化' },
  'MA': { name: '品德情意', nameEn: 'Moral & Affection', desc: '价值观与态度' },
  'IL': { name: '自主学习', nameEn: 'Independent Learning', desc: '自学能力' },
  'TH': { name: '思维', nameEn: 'Thinking', desc: '批判与创意思维' },
};

// 英国语文教育 — 三个学习范畴
export const ENGLISH_STRANDS = {
  'IP': { name: '人际范畴', nameEn: 'Interpersonal Strand', desc: '社交沟通语言' },
  'KN': { name: '知识范畴', nameEn: 'Knowledge Strand', desc: '获取信息的语言' },
  'EX': { name: '经验范畴', nameEn: 'Experience Strand', desc: '创意与想象表达' },
};

// 常识科 — 三个学习范畴
export const GS_STRANDS = {
  'PSHE': { name: '个人、社会与人文学科', nameEn: 'Personal, Social & Humanities', desc: '自我、家庭、社区、社会' },
  'SCI': { name: '科学教育', nameEn: 'Science Education', desc: '生物、物质、能量、地球' },
  'TECH': { name: '科技教育', nameEn: 'Technology Education', desc: '设计与制作、信息科技' },
};

// 粤语学习 — 四个范畴
export const CANTONESE_STRANDS = {
  'DC': { name: '日常会话', nameEn: 'Daily Conversation', desc: '生活沟通' },
  'SL': { name: '学校用语', nameEn: 'School Language', desc: '校园场景' },
  'SE': { name: '社交礼仪', nameEn: 'Social Etiquette', desc: '礼貌表达' },
  'HK': { name: '香港文化', nameEn: 'Hong Kong Culture', desc: '本地文化' },
};

// ============================================================
// 难度等级系统 — 对应课程指引的学习进程
// ============================================================
// Level 1-2: 基础 (Basic)      — 认识、记忆、简单应用
// Level 3-4: 进阶 (Intermediate) — 理解、分析、综合应用
// Level 5:   精通 (Advanced)    — 评鉴、创作、高阶思维
export const DIFFICULTY_LEVELS = {
  1: { name: '基础', desc: '认识与记忆', keywords: ['认识', '辨别', '读出', '说出'] },
  2: { name: '巩固', desc: '理解与简单应用', keywords: ['理解', '说明', '举例', '计算'] },
  3: { name: '进阶', desc: '分析与综合应用', keywords: ['分析', '比较', '综合', '应用'] },
  4: { name: '深化', desc: '推理与扩展', keywords: ['推理', '论证', '设计', '创作'] },
  5: { name: '精通', desc: '评鉴与创新', keywords: ['评鉴', '反思', '创新', '跨领域应用'] },
};

// ============================================================
// 辅助函数
// ============================================================

export function getCurriculumLevel(gradeId) {
  return GRADE_MAP.find(g => g.id === gradeId)?.curriculumLevel || 3;
}

export function getSubjectLevel(gradeId) {
  return GRADE_MAP.find(g => g.id === gradeId)?.subjectLevel || 2;
}

export function getKeyStage(gradeId) {
  return GRADE_MAP.find(g => g.id === gradeId)?.keyStage || 2;
}

export function getGradeByLevel(curriculumLevel) {
  return GRADE_MAP.find(g => g.curriculumLevel === curriculumLevel);
}

export function getGradesByKeyStage(keyStage) {
  return KEY_STAGES[keyStage]?.grades || [];
}

// 从旧3级映射到新9级（向后兼容）
export function mapOldLevelToGrades(oldLevel) {
  const ranges = { 1: [1, 2], 2: [3, 4], 3: [5, 9] };
  return ranges[oldLevel] || [3, 4];
}

// 获取科目的学习领域
export function getSubjectStrands(subject) {
  const map = {
    math: MATH_STRANDS,
    chinese: CHINESE_STRANDS,
    english: ENGLISH_STRANDS,
    gs: GS_STRANDS,
    cantonese: CANTONESE_STRANDS,
  };
  return map[subject] || {};
}

// 按年级获取推荐难度
export function getRecommendedDifficulty(gradeId) {
  const level = getCurriculumLevel(gradeId);
  if (level <= 2) return 1;  // P1-P2: 基础
  if (level <= 4) return 2;  // P3-P4: 巩固
  if (level <= 6) return 3;  // P5-P6: 进阶
  return 4;                   // F1-F3: 深化
}

// 获取年级对应的课程时数比例（参考PECG 2024）
export const CURRICULUM_TIME_RATIO = {
  chinese: 0.23,     // 中文 >=23%
  english: 0.16,     // 英文 >=16%
  math: 0.11,        // 数学 >=11%
  gs: 0.11,          // 常识 >=11%
};
