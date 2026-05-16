// 英文科题库 — 使用模板引擎动态生成
export { englishTemplates } from '../expansion/englishTemplates';
export { default as englishCurriculum } from '../curriculum/subjects/englishCurriculum';

// 按年级获取英文题
import { getTemplateGeneratedProblems } from '../../queryEngine';

export function getEnglishQuestions(grade, count = 10) {
  return getTemplateGeneratedProblems({ subject: 'english', grade, count });
}

export default { getEnglishQuestions };
