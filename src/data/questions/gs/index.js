// 常識科题库 — 使用模板引擎动态生成
export { gsTemplates } from '../expansion/gsTemplates';
export { default as gsCurriculum } from '../curriculum/subjects/gsCurriculum';

// 按年级获取常识题
import { getTemplateGeneratedProblems } from '../../queryEngine';

export function getGSQuestions(grade, count = 10) {
  return getTemplateGeneratedProblems({ subject: 'gs', grade, count });
}

export default { getGSQuestions };
