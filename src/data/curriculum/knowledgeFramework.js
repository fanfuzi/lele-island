// ================================================================
// 香港课程知识框架 — 全科总览
// 参照香港教育局课程发展议会(CDC)官方课程指引
//
// 架构：
//   学习领域 (Learning Area)
//     └── 学习范畴 (Learning Strand)
//           └── 学习阶段 (Key Stage: KS1/KS2/KS3)
//                 └── 知识点 (Knowledge Point)
//                       └── 学习目标 (Learning Objective)
//                             └── 难度等级 1-5
//
// 参考文件：
//   - 小学教育课程指引(PECG) 2024
//   - 中学教育课程指引(SECG) 2017 + 补充说明 2021
//   - 数学教育学习领域课程指引
//   - 中国语文教育学习领域课程指引
//   - 英国语文教育学习领域课程指引
//   - 常识科课程指引
// ================================================================

import mathCurriculum from './subjects/mathCurriculum';
import chineseCurriculum from './subjects/chineseCurriculum';
import cantoneseCurriculum from './subjects/cantoneseCurriculum';
import { englishCurriculum } from './subjects/englishCurriculum';
import { gsCurriculum } from './subjects/gsCurriculum';

// ============================================================
// 学习阶段定义（参照PECG 2024）
// ============================================================
export const KEY_STAGES = {
  1: {
    name: '第一学习阶段',
    nameEn: 'Key Stage 1',
    grades: ['p1', 'p2', 'p3'],
    desc: '培养基本学习习惯和基础能力，建立学习信心',
    focus: '基础能力、学习兴趣、良好习惯',
  },
  2: {
    name: '第二学习阶段',
    nameEn: 'Key Stage 2',
    grades: ['p4', 'p5', 'p6'],
    desc: '拓展和深化知识，培养高阶思维能力',
    focus: '知识拓展、思维发展、自主学习',
  },
  3: {
    name: '第三学习阶段',
    nameEn: 'Key Stage 3',
    grades: ['f1', 'f2', 'f3'],
    desc: '衔接中学课程，为公开考试做准备',
    focus: '知识整合、批判思维、跨学科应用',
  },
};

// ============================================================
// 全科知识框架总览
// ============================================================
export const KNOWLEDGE_FRAMEWORK = {
  // ── 数学教育 ──
  math: {
    name: '数学',
    nameEn: 'Mathematics',
    icon: '🔢',
    // 官方三大学习范畴
    strands: {
      'NA': { name: '数与代数', topics: '整数、分数、小数、百分比、比、代数式' },
      'MS': { name: '度量、图形与空间', topics: '长度、面积、体积、时间、角、对称、坐标' },
      'DA': { name: '数据处理', topics: '统计图表、平均数、概率初步' },
    },
    // 各阶段重点
    stageFocus: {
      1: '整数运算、基本图形、简单度量',
      2: '分数小数百分比、面积体积、统计图表',
      3: '比与代数、几何证明、数据分析',
    },
    dataSource: mathCurriculum,
  },

  // ── 中国语文教育 ──
  chinese: {
    name: '中文',
    nameEn: 'Chinese Language',
    icon: '✍️',
    // 官方九大学习范畴（部分在此系统中实现）
    strands: {
      'RD': { name: '阅读', topics: '认读字词、理解文意、阅读策略' },
      'WR': { name: '写作', topics: '组词造句、段落写作、篇章结构' },
      'LI': { name: '聆听', topics: '听辨语音、理解内容' },
      'SP': { name: '说话', topics: '口头表达、汇报讨论' },
      'LT': { name: '文学', topics: '古诗、成语、修辞、文学常识' },
      'MA': { name: '品德情意', topics: '价值观、态度、情感' },
    },
    stageFocus: {
      1: '识字写字、基础阅读、简单表达',
      2: '阅读理解、篇章写作、文学欣赏',
      3: '文言文、深度阅读、议论文写作',
    },
    dataSource: chineseCurriculum,
  },

  // ── 英国语文教育 ──
  english: {
    name: '英文',
    nameEn: 'English Language',
    icon: '🔤',
    // 官方三大学习范畴
    strands: {
      'IP': { name: '人际范畴', topics: '日常交际、社交语言' },
      'KN': { name: '知识范畴', topics: '阅读理解、信息提取' },
      'EX': { name: '经验范畴', topics: '故事阅读、创意写作' },
    },
    // 实际教学内容分类
    contentAreas: {
      'grammar': { name: '文法', topics: '时态、词性、句型' },
      'vocabulary': { name: '词汇', topics: '主题词汇、词族' },
      'reading': { name: '阅读', topics: '理解、推论、鉴赏' },
      'writing': { name: '写作', topics: '句子、段落、篇章' },
      'listening': { name: '聆听', topics: '听力理解、拼写' },
    },
    stageFocus: {
      1: '基础词汇、简单句型、图文阅读',
      2: '时态语法、主题阅读、段落写作',
      3: '复杂语法、批判阅读、正式写作',
    },
    dataSource: englishCurriculum,
  },

  // ── 常识科 ──
  gs: {
    name: '常识',
    nameEn: 'General Studies',
    icon: '🌍',
    // 官方三大范畴
    strands: {
      'PSHE': { name: '个人、社会与人文', topics: '自我、家庭、社区、香港社会、中国、全球议题' },
      'SCI': { name: '科学', topics: '生物、物质、能量与变化、地球与太空' },
      'TECH': { name: '科技', topics: '设计与制作、信息科技' },
    },
    stageFocus: {
      1: '个人卫生、动植物、社区认识、基础科学',
      2: '人体系统、能源、香港社会、科学探究',
      3: '生态系统、公民责任、科技应用、全球议题',
    },
    dataSource: gsCurriculum,
  },

  // ── 粤语学习 ──
  cantonese: {
    name: '粤语',
    nameEn: 'Cantonese',
    icon: '🗣️',
    strands: {
      'DC': { name: '日常会话', topics: '问候、出行、购物、饮食' },
      'SL': { name: '学校用语', topics: '课堂用语、校园生活' },
      'SE': { name: '社交礼仪', topics: '礼貌表达、求助投诉' },
      'HK': { name: '香港文化', topics: '节日、地点、俚语、茶餐厅文化' },
    },
    stageFocus: {
      1: '基础问候、数字颜色、家庭称呼、学校基本',
      2: '日常对话、购物点餐、表达感受、香港地点',
      3: '社交礼仪、讨论辩论、正式口语、文化传承',
    },
    dataSource: cantoneseCurriculum,
  },
};

// ============================================================
// 知识点难度等级定义（5级制）
// ============================================================
export const DIFFICULTY_LEVELS = [
  { level: 1, name: '认识', desc: '能够辨别和记忆基本知识', actionWords: ['认识', '辨别', '读出', '说出', '配对'] },
  { level: 2, name: '理解', desc: '能够说明和解释概念', actionWords: ['理解', '说明', '举例', '计算', '排序'] },
  { level: 3, name: '应用', desc: '能够在新情境中运用知识', actionWords: ['应用', '分析', '比较', '分类', '解决'] },
  { level: 4, name: '分析', desc: '能够推理和论证', actionWords: ['推理', '论证', '设计', '创作', '综合'] },
  { level: 5, name: '评鉴', desc: '能够评价和创新', actionWords: ['评鉴', '反思', '创新', '比较优劣', '提出建议'] },
];

// ============================================================
// 辅助函数
// ============================================================

// 获取指定科目、年级的知识点列表
export function getKnowledgePoints(subject, grade) {
  const fw = KNOWLEDGE_FRAMEWORK[subject];
  if (!fw?.dataSource) return [];
  return fw.dataSource.filter(kp => kp.grade === grade);
}

// 获取指定科目的学习范畴
export function getStrands(subject) {
  return KNOWLEDGE_FRAMEWORK[subject]?.strands || {};
}

// 获取指定年级的所有科目知识点概览
export function getGradeOverview(grade) {
  const overview = {};
  for (const [subject, fw] of Object.entries(KNOWLEDGE_FRAMEWORK)) {
    const points = fw.dataSource?.filter(kp => kp.grade === grade) || [];
    overview[subject] = {
      name: fw.name,
      icon: fw.icon,
      count: points.length,
      strands: [...new Set(points.map(kp => kp.domain))],
    };
  }
  return overview;
}

// 根据课程时数比例推荐学习顺序（参考PECG 2024）
export function getRecommendedStudyOrder() {
  return ['chinese', 'english', 'math', 'gs', 'cantonese'];
}

// 获取学习阶段信息
export function getKeyStageForGrade(grade) {
  for (const [ks, info] of Object.entries(KEY_STAGES)) {
    if (info.grades.includes(grade)) return { keyStage: Number(ks), ...info };
  }
  return null;
}

export default KNOWLEDGE_FRAMEWORK;
