// 题目类型Schema定义
// 用于统一各科目题目的数据结构和类型标准

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',     // 单选题
  MULTI_SELECT: 'multi-select',           // 多选题
  FILL_IN: 'fill-in',                     // 填空题
  MATCHING: 'matching',                   // 配对题
  ORDERING: 'ordering',                   // 排序题
  TRUE_FALSE: 'true-false',              // 是非题
  GRID: 'grid',                          // 网格题
  SORTING: 'sorting',                     // 分类题
  AUDIO: 'audio-choice',                 // 听力选择题
  STEP_SOLVER: 'step-solver',            // 多步解题
};

export const RESPONSE_TYPES = {
  SINGLE_SELECT: 'single-select',        // 单选
  MULTI_SELECT: 'multi-select',          // 多选
  TEXT_INPUT: 'text-input',              // 文字输入
  DRAG_DROP: 'drag-drop',                // 拖拽
  TAP_GRID: 'tap-grid',                 // 点击网格
  ORDER: 'order',                        // 排序
  MATCH: 'match',                        // 配对
};

export const REPRESENTATION_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  INTERACTIVE: 'interactive',
  MIXED: 'mixed',
};

export const SUBJECTS = {
  MATH: 'math',
  CANTONESE: 'cantonese',
  CHINESE: 'chinese',
  ENGLISH: 'english',
  GS: 'gs',
};

// 验证题目Schema完整性
export function validateQuestion(question) {
  const errors = [];
  if (!question.id) errors.push('缺少id');
  if (!question.subject) errors.push('缺少subject');
  if (!question.type) errors.push('缺少type');
  if (!question.content?.prompt) errors.push('缺少content.prompt');
  if (!question.response?.correctAnswer) errors.push('缺少response.correctAnswer');
  if (!question.curriculumRef?.grade) errors.push('缺少curriculumRef.grade');
  return errors;
}

// 创建标准化题目（补全默认字段）
export function createQuestion(data) {
  return {
    id: data.id,
    subject: data.subject,
    type: data.type || QUESTION_TYPES.MULTIPLE_CHOICE,
    genre: data.genre || 'computation',
    curriculumRef: {
      grade: data.curriculumRef?.grade || 'p3',
      edbCodes: data.curriculumRef?.edbCodes || [],
      learningObjectives: data.curriculumRef?.learningObjectives || [],
      difficulty: data.curriculumRef?.difficulty || 1,
    },
    metadata: {
      version: data.metadata?.version || 1,
      author: data.metadata?.author || 'curriculum-team',
      lastReviewed: data.metadata?.lastReviewed || new Date().toISOString().split('T')[0],
      tags: data.metadata?.tags || [],
      isAiGenerated: data.metadata?.isAiGenerated || false,
      seedQuestion: data.metadata?.seedQuestion || null,
      variantGroup: data.metadata?.variantGroup || null,
    },
    content: {
      prompt: data.content?.prompt,
      computation: data.content?.computation || null,
      representation: data.content?.representation || REPRESENTATION_TYPES.TEXT,
      mediaUrls: data.content?.mediaUrls || [],
    },
    response: {
      type: data.response?.type || RESPONSE_TYPES.SINGLE_SELECT,
      correctAnswer: data.response?.correctAnswer,
      distractors: data.response?.distractors || [],
      distractorRationale: data.response?.distractorRationale || [],
      hint: data.response?.hint || '',
    },
    adaptivity: {
      initialMastery: data.adaptivity?.initialMastery || 0.5,
      timeEstimate: data.adaptivity?.timeEstimate || 30,
      skillWeight: data.adaptivity?.skillWeight || 1.0,
      prerequisiteQuestions: data.adaptivity?.prerequisiteQuestions || [],
    },
  };
}

// 将本地题库格式转换为标准Schema
export function convertMathProblem(p) {
  return createQuestion({
    id: `MTH-${p.category?.toUpperCase()}-P${p.level}-${String(p.id).padStart(3, '0')}`,
    subject: SUBJECTS.MATH,
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    genre: p.story ? 'word-problem' : 'computation',
    curriculumRef: {
      grade: levelToGrade(p.level),
      edbCodes: [p.category],
      learningObjectives: [],
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
    },
    metadata: {
      tags: [p.category],
    },
  });
}

// 将本地粤语短语转为标准Schema
export function convertCantonesePhrase(p) {
  return createQuestion({
    id: `CAN-${p.category?.toUpperCase()}-${String(p.id).padStart(3, '0')}`,
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
      tags: [p.category, 'cantonese'],
    },
  });
}

// level转grade（向后兼容）
function levelToGrade(level) {
  const map = { 1: 'p1', 2: 'p3', 3: 'p5' };
  return map[level] || 'p3';
}
