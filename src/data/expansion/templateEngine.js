/**
 * 模板引擎 — 从模板批量生成题目
 *
 * 模板格式:
 * {
 *   id: 'TMP-xxx',
 *   genre: 'computation' | 'word-problem',
 *   grade: 'p3',
 *   edbCodes: ['N3-1.2'],
 *   difficulty: 2,
 *   pattern: '{a} + {b} = ?',          // 题目模板 (用{varname}占位)
 *   patternFn: (vars) => string,        // 或使用函数生成题目文本
 *   variables: { a: { range: [100,500] }, b: { range: [100,500] } },
 *   constraint: (vars) => boolean,      // 可选约束条件
 *   answer: (vars) => number|string,
 *   distractors: [(vars) => val, ...],  // 错误选项生成函数
 *   distractorLabels: ['原因', ...],    // 每题固定或通用的错误原因
 * }
 */

// 在指定范围内生成随机整数
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 从数组中随机选一个
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fisher-Yates 洗牌
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 为变量生成值
 * @param {object} varDef - 变量定义
 * @returns {number|string} 生成的变量值
 */
function generateVarValue(varDef) {
  if (Array.isArray(varDef)) return pick(varDef);
  if (varDef.range) return randInt(varDef.range[0], varDef.range[1]);
  if (varDef.values) return pick(varDef.values);
  return 0;
}

/**
 * 填充模板字符串: "{a} + {b} = ?" → "345 + 267 = ?"
 */
function fillPattern(pattern, vars) {
  return pattern.replace(/\{(\w+)\}/g, (_, key) => vars[key] !== undefined ? vars[key] : `{${key}}`);
}

/**
 * 从单个模板生成一道题目
 * @returns {object|null} 题目对象 (question schema 格式), 或 null 如果无法满足约束
 */
export function generateFromTemplate(template) {
  const { id, genre, grade, edbCodes, difficulty, pattern, patternFn, variables, constraint, answer, distractors, distractorLabels } = template;

  // 最多尝试 20 次以满足约束
  for (let attempt = 0; attempt < 20; attempt++) {
    const vars = {};
    for (const [key, def] of Object.entries(variables || {})) {
      vars[key] = generateVarValue(def);
    }

    // 检查约束
    if (constraint && !constraint(vars)) continue;

    // 题目文本
    const questionText = patternFn ? patternFn(vars) : fillPattern(pattern, vars);

    // 正确答案
    const correctAnswer = String(answer(vars));

    // 生成干扰项
    const distVals = new Set();
    const distLabels = [];
    if (distractors) {
      for (let i = 0; i < distractors.length; i++) {
        try {
          const val = String(distractors[i](vars));
          if (val !== correctAnswer && !distVals.has(val)) {
            distVals.add(val);
            distLabels.push(distractorLabels?.[i] || '常見錯誤');
          }
        } catch (e) { /* skip invalid distractor */ }
      }
    }

    // 如果干扰项不够，补充一些
    if (distVals.size < 2) {
      const offset = correctAnswer.includes('.') ? 0.1 : 1;
      const extra = [
        String(Number(correctAnswer) + (randInt(1, 3) * 10 * offset)),
        String(Number(correctAnswer) - (randInt(1, 3) * 10 * offset)),
        String(Number(correctAnswer) + (randInt(1, 3) * 100 * offset)),
      ];
      for (const v of extra) {
        if (v !== correctAnswer && !distVals.has(v)) {
          distVals.add(v);
          distLabels.push('計算錯誤');
        }
        if (distVals.size >= 3) break;
      }
    }

    const options = shuffle([correctAnswer, ...distVals]);

    const qid = `${id}-${String(randInt(1000, 9999))}`;

    return {
      id: qid,
      question: questionText,
      answer: correctAnswer,
      options,
      genre: genre || 'computation',
      category: edbCodes?.[0] || 'mixed',
      level: difficulty || 1,
      templateId: id,
    };
  }

  return null; // 无法满足约束
}

/**
 * 从模板批量生成指定数量的题目
 * @param {object} template - 模板定义
 * @param {number} count - 生成数量
 * @returns {Array} 题目数组
 */
export function generateBatch(template, count = 10) {
  const results = [];
  const seen = new Set();
  let attempts = 0;

  while (results.length < count && attempts < count * 20) {
    attempts++;
    const q = generateFromTemplate(template);
    if (q && !seen.has(q.answer + '|' + q.question)) {
      seen.add(q.answer + '|' + q.question);
      results.push(q);
    }
  }

  return results;
}

/**
 * 从多个模板生成题目
 * @param {Array} templates - 模板数组
 * @param {object} options - { total: 总数, grade: 年级筛选, genre: 类型筛选 }
 * @returns {Array} 合并后洗牌的题目数组
 */
export function generateFromTemplates(templates, { total = 100, grade, genre } = {}) {
  let filtered = templates;
  if (grade) filtered = filtered.filter(t => t.grade === grade);
  if (genre) filtered = filtered.filter(t => t.genre === genre);

  if (filtered.length === 0) return [];

  const perTemplate = Math.ceil(total / filtered.length);
  const all = [];

  for (const tpl of filtered) {
    const batch = generateBatch(tpl, perTemplate);
    all.push(...batch);
  }

  return shuffle(all).slice(0, total);
}
