// 英文科课程大纲 (P1-F3)
// 参照香港教育局英语课程指引（小一至中三）

export const englishCurriculum = [
  // ===== 小一 (P1, Level 1) =====
  { grade: 'p1', curriculumLevel: 1, domain: '文法', topic: 'Basic Verbs', edbRef: 'EN1-1',
    difficulty: 1,
    learningObjectives: ['認識常見動作動詞 (run, eat, play)', '用動詞描述動作', '動詞與主語配對'] },
  { grade: 'p1', curriculumLevel: 1, domain: '文法', topic: 'Pronouns', edbRef: 'EN1-2',
    difficulty: 1,
    learningObjectives: ['認識 I, you, he, she, it, we, they', '主格代名詞的使用', '用代名詞代替名詞'] },
  { grade: 'p1', curriculumLevel: 1, domain: '詞彙', topic: 'Nouns', edbRef: 'EN1-3',
    difficulty: 1,
    learningObjectives: ['認識常見名詞 (boy, girl, book, school)', '分辨可數名詞', '詞彙圖像配對'] },
  { grade: 'p1', curriculumLevel: 1, domain: '詞彙', topic: 'Colors & Numbers', edbRef: 'EN1-4',
    difficulty: 1,
    learningObjectives: ['認識顏色詞彙 (red, blue, green)', '數字 1-20', '用顏色和數字描述物件'] },
  { grade: 'p1', curriculumLevel: 1, domain: '詞彙', topic: 'Animals & Food', edbRef: 'EN1-5',
    difficulty: 1,
    learningObjectives: ['認識常見動物詞彙', '認識常見食物詞彙', '分類動物和食物'] },
  { grade: 'p1', curriculumLevel: 1, domain: '文法', topic: 'Simple Sentences', edbRef: 'EN1-6',
    difficulty: 1,
    learningObjectives: ['認識基本句式 S+V+O', '組合簡單句子', '句首大寫和句號'] },
  { grade: 'p1', curriculumLevel: 1, domain: '文法', topic: 'Plurals', edbRef: 'EN1-7',
    difficulty: 1,
    learningObjectives: ['認識名詞複數 -s 規則', '常見不規則複數 (children, mice)', '單複數配對'] },

  // ===== 小二 (P2, Level 2) =====
  { grade: 'p2', curriculumLevel: 2, domain: '文法', topic: 'Present Simple', edbRef: 'EN2-1',
    difficulty: 1,
    learningObjectives: ['認識現在簡單式', '第三人稱單數 -s 規則', '用現在簡單式描述日常'] },
  { grade: 'p2', curriculumLevel: 2, domain: '文法', topic: 'Prepositions', edbRef: 'EN2-2',
    difficulty: 1,
    learningObjectives: ['認識方位介詞 (in, on, under, next to)', '用介詞描述位置', '介詞短語'] },
  { grade: 'p2', curriculumLevel: 2, domain: '詞彙', topic: 'Family & School', edbRef: 'EN2-3',
    difficulty: 1,
    learningObjectives: ['認識家庭成員詞彙', '學校用品詞彙', '用英語介紹家人和學校'] },
  { grade: 'p2', curriculumLevel: 2, domain: '詞彙', topic: 'Adjectives', edbRef: 'EN2-4',
    difficulty: 1,
    learningObjectives: ['認識常見形容詞 (big, small, tall)', '形容詞修飾名詞', '用形容詞描述事物'] },
  { grade: 'p2', curriculumLevel: 2, domain: '文法', topic: 'Actions', edbRef: 'EN2-5',
    difficulty: 1,
    learningObjectives: ['動詞加 -ing 形式', '用動作動詞描述圖片', '動作詞彙擴展'] },
  { grade: 'p2', curriculumLevel: 2, domain: '閱讀', topic: 'Daily Routines', edbRef: 'EN2-6',
    difficulty: 1,
    learningObjectives: ['閱讀日常活動短文', '理解時間先後順序', '回答簡單閱讀問題'] },
  { grade: 'p2', curriculumLevel: 2, domain: '閱讀', topic: 'Short Reading', edbRef: 'EN2-7',
    difficulty: 1,
    learningObjectives: ['閱讀短句和短段落', '找出關鍵資訊', '圖文配對'] },

  // ===== 小三 (P3, Level 3) =====
  { grade: 'p3', curriculumLevel: 3, domain: '文法', topic: 'Present Continuous', edbRef: 'EN3-1',
    difficulty: 2,
    learningObjectives: ['認識現在進行式 (am/is/are + V-ing)', '辨別現在簡單式與進行式', '描述正在進行的動作'] },
  { grade: 'p3', curriculumLevel: 3, domain: '文法', topic: 'Past Simple', edbRef: 'EN3-2',
    difficulty: 2,
    learningObjectives: ['認識過去簡單式', '規則動詞加 -ed', '常見不規則動詞 (go-went, eat-ate)'] },
  { grade: 'p3', curriculumLevel: 3, domain: '文法', topic: 'Articles (a/an/the)', edbRef: 'EN3-3',
    difficulty: 2,
    learningObjectives: ['認識冠詞 a, an, the', '不定冠詞與定冠詞的分別', '正確使用冠詞'] },
  { grade: 'p3', curriculumLevel: 3, domain: '詞彙', topic: 'Weather & Clothes', edbRef: 'EN3-4',
    difficulty: 2,
    learningObjectives: ['天氣詞彙 (sunny, rainy, cloudy)', '衣物詞彙', '根據天氣選擇衣物'] },
  { grade: 'p3', curriculumLevel: 3, domain: '文法', topic: 'Comparatives', edbRef: 'EN3-5',
    difficulty: 2,
    learningObjectives: ['認識比較級 -er/more', '認識最高級 -est/most', '用比較級描述差異'] },
  { grade: 'p3', curriculumLevel: 3, domain: '閱讀', topic: 'Story Reading', edbRef: 'EN3-6',
    difficulty: 2,
    learningObjectives: ['閱讀短篇故事', '理解故事大意和角色', '回答故事細節問題'] },
  { grade: 'p3', curriculumLevel: 3, domain: '聆聽', topic: 'Spelling', edbRef: 'EN3-7',
    difficulty: 2,
    learningObjectives: ['聽寫常見詞彙', '拼讀 CVC 和 CVCE 詞', '聽音辨字'] },

  // ===== 小四 (P4, Level 4) =====
  { grade: 'p4', curriculumLevel: 4, domain: '文法', topic: 'Future Tense', edbRef: 'EN4-1',
    difficulty: 2,
    learningObjectives: ['認識 will 和 be going to', '用未來式描述計劃', '未來式時間狀語 (tomorrow, next week)'] },
  { grade: 'p4', curriculumLevel: 4, domain: '文法', topic: 'Adverbs', edbRef: 'EN4-2',
    difficulty: 2,
    learningObjectives: ['認識副詞 -ly', '副詞修飾動詞', '頻率副詞 (always, sometimes, never)'] },
  { grade: 'p4', curriculumLevel: 4, domain: '詞彙', topic: 'Places & Directions', edbRef: 'EN4-3',
    difficulty: 2,
    learningObjectives: ['地點詞彙 (library, hospital, park)', '方向詞彙 (turn left, go straight)', '問路和指路'] },
  { grade: 'p4', curriculumLevel: 4, domain: '詞彙', topic: 'Hobbies', edbRef: 'EN4-4',
    difficulty: 2,
    learningObjectives: ['嗜好和活動詞彙', '用英語描述喜好', 'like/love + V-ing 句式'] },
  { grade: 'p4', curriculumLevel: 4, domain: '文法', topic: 'Past Continuous', edbRef: 'EN4-5',
    difficulty: 2,
    learningObjectives: ['認識過去進行式 (was/were + V-ing)', '過去進行式與簡單式並用', '描述過去某時正在進行的動作'] },
  { grade: 'p4', curriculumLevel: 4, domain: '閱讀', topic: 'Dialogue Reading', edbRef: 'EN4-6',
    difficulty: 2,
    learningObjectives: ['閱讀對話和短文', '理解對話情境', '推斷對話者意圖'] },
  { grade: 'p4', curriculumLevel: 4, domain: '寫作', topic: 'Sentence Building', edbRef: 'EN4-7',
    difficulty: 2,
    learningObjectives: ['用連詞 (and, but, because) 連接句子', '寫完整的段落', '正確使用標點符號'] },

  // ===== 小五 (P5, Level 5) =====
  { grade: 'p5', curriculumLevel: 5, domain: '文法', topic: 'Present Perfect', edbRef: 'EN5-1',
    difficulty: 3,
    learningObjectives: ['認識現在完成式 (have/has + p.p.)', '常見過去分詞', '與過去簡單式的分別'] },
  { grade: 'p5', curriculumLevel: 5, domain: '文法', topic: 'Conjunctions', edbRef: 'EN5-2',
    difficulty: 3,
    learningObjectives: ['認識連詞 (and, but, or, so, because)', '用連詞連接從句', '複合句結構'] },
  { grade: 'p5', curriculumLevel: 5, domain: '文法', topic: 'Passive Voice', edbRef: 'EN5-3',
    difficulty: 3,
    learningObjectives: ['認識被動語態 (be + p.p.)', '主動句轉被動句', '被動語態的使用時機'] },
  { grade: 'p5', curriculumLevel: 5, domain: '詞彙', topic: 'Food & Drink', edbRef: 'EN5-4',
    difficulty: 3,
    learningObjectives: ['食物和飲品詞彙擴展', '可數與不可數名詞 (some, any, much, many)', '餐飲相關詞彙'] },
  { grade: 'p5', curriculumLevel: 5, domain: '閱讀', topic: 'Travel', edbRef: 'EN5-5',
    difficulty: 3,
    learningObjectives: ['閱讀旅遊相關文章', '理解不同文體', '提取關鍵資訊和推斷'] },
  { grade: 'p5', curriculumLevel: 5, domain: '閱讀', topic: 'Comprehension', edbRef: 'EN5-6',
    difficulty: 3,
    learningObjectives: ['閱讀理解技巧 (skimming, scanning)', '推斷詞義', '主旨和細節題'] },
  { grade: 'p5', curriculumLevel: 5, domain: '寫作', topic: 'Paragraph Writing', edbRef: 'EN5-7',
    difficulty: 3,
    learningObjectives: ['段落結構 (topic sentence, supporting details)', '寫描述性段落', '段落連貫性'] },

  // ===== 小六 (P6, Level 6) =====
  { grade: 'p6', curriculumLevel: 6, domain: '文法', topic: 'Conditionals', edbRef: 'EN6-1',
    difficulty: 3,
    learningObjectives: ['認識第一條件句 (If + present, will + V)', '認識第二條件句 (If + past, would + V)', '條件句應用'] },
  { grade: 'p6', curriculumLevel: 6, domain: '文法', topic: 'Modals', edbRef: 'EN6-2',
    difficulty: 3,
    learningObjectives: ['情態動詞 can, could, should, must', '情態動詞表達能力、建議、義務', '情態動詞的語境運用'] },
  { grade: 'p6', curriculumLevel: 6, domain: '文法', topic: 'Relative Clauses', edbRef: 'EN6-3',
    difficulty: 3,
    learningObjectives: ['認識關係代名詞 (who, which, that)', '限制性關係從句', '用關係從句擴展句子'] },
  { grade: 'p6', curriculumLevel: 6, domain: '詞彙', topic: 'Health & Tech', edbRef: 'EN6-4',
    difficulty: 3,
    learningObjectives: ['健康和科技詞彙', '學術詞彙 (develop, system, environment)', '詞彙在語境中的理解'] },
  { grade: 'p6', curriculumLevel: 6, domain: '閱讀', topic: 'Environment', edbRef: 'EN6-5',
    difficulty: 3,
    learningObjectives: ['閱讀環境議題文章', '理解議論文結構', '辨別作者觀點和立場'] },
  { grade: 'p6', curriculumLevel: 6, domain: '閱讀', topic: 'Inference', edbRef: 'EN6-6',
    difficulty: 3,
    learningObjectives: ['閱讀推斷技巧', '從上下文推斷隱含意義', '回答推斷題'] },
  { grade: 'p6', curriculumLevel: 6, domain: '寫作', topic: 'Essay Writing', edbRef: 'EN6-7',
    difficulty: 3,
    learningObjectives: ['文章結構 (引言、主體、結論)', '寫記敘文和議論文', '使用過渡詞和連貫表達'] },

  // ===== 中一 (F1, Level 7) =====
  { grade: 'f1', curriculumLevel: 7, domain: '文法', topic: 'Tenses Review', edbRef: 'EN7-1',
    difficulty: 4,
    learningObjectives: ['複習所有時態 (簡單式、進行式、完成式)', '在語境中正確選用時態', '時態混合練習'] },
  { grade: 'f1', curriculumLevel: 7, domain: '文法', topic: 'Reported Speech', edbRef: 'EN7-2',
    difficulty: 4,
    learningObjectives: ['直接引語轉間接引語', '時態後移規則', '引述句和轉述句的分別'] },
  { grade: 'f1', curriculumLevel: 7, domain: '詞彙', topic: 'Academic Vocabulary', edbRef: 'EN7-3',
    difficulty: 4,
    learningObjectives: ['學術詞彙擴展 (analyze, compare, evaluate)', '詞根和詞綴知識', '同義詞和反義詞'] },
  { grade: 'f1', curriculumLevel: 7, domain: '閱讀', topic: 'Text Types', edbRef: 'EN7-4',
    difficulty: 4,
    learningObjectives: ['辨別不同文體 (記敘、說明、議論)', '分析文章結構和組織', '根據文體選擇閱讀策略'] },
  { grade: 'f1', curriculumLevel: 7, domain: '聆聽', topic: 'Listening Skills', edbRef: 'EN7-5',
    difficulty: 4,
    learningObjectives: ['聆聽理解主旨和細節', '辨別語調和態度', '筆記記錄技巧'] },
  { grade: 'f1', curriculumLevel: 7, domain: '寫作', topic: 'Formal Writing', edbRef: 'EN7-6',
    difficulty: 4,
    learningObjectives: ['正式書信格式', '正式與非正式語體的分別', '寫作語氣和用詞'] },

  // ===== 中二 (F2, Level 8) =====
  { grade: 'f2', curriculumLevel: 8, domain: '文法', topic: 'Gerunds & Infinitives', edbRef: 'EN8-1',
    difficulty: 4,
    learningObjectives: ['動名詞 (V-ing) 作主語和賓語', '不定式 (to V) 的用法', '動詞後接 gerund 或 infinitive 的規則'] },
  { grade: 'f2', curriculumLevel: 8, domain: '詞彙', topic: 'Phrasal Verbs', edbRef: 'EN8-2',
    difficulty: 4,
    learningObjectives: ['常見短語動詞 (give up, look after, turn on)', '從上下文推斷短語動詞意思', '短語動詞在寫作中的運用'] },
  { grade: 'f2', curriculumLevel: 8, domain: '文法', topic: 'Connectors', edbRef: 'EN8-3',
    difficulty: 4,
    learningObjectives: ['連接詞分類 (時間、因果、對比)', '段落間的銜接', '連接詞使文章更流暢'] },
  { grade: 'f2', curriculumLevel: 8, domain: '詞彙', topic: 'Idioms', edbRef: 'EN8-4',
    difficulty: 4,
    learningObjectives: ['常見英語習語 (break the ice, piece of cake)', '習語的文化背景', '在語境中理解習語'] },
  { grade: 'f2', curriculumLevel: 8, domain: '閱讀', topic: 'Critical Reading', edbRef: 'EN8-5',
    difficulty: 4,
    learningObjectives: ['批判性閱讀技巧', '評估論據的可靠性', '辨別事實與意見'] },
  { grade: 'f2', curriculumLevel: 8, domain: '寫作', topic: 'Creative Writing', edbRef: 'EN8-6',
    difficulty: 4,
    learningObjectives: ['創意寫作技巧 (比喻、擬人)', '故事創作和角色發展', '描寫性語言的運用'] },

  // ===== 中三 (F3, Level 9) =====
  { grade: 'f3', curriculumLevel: 9, domain: '文法', topic: 'Subjunctive Mood', edbRef: 'EN9-1',
    difficulty: 5,
    learningObjectives: ['虛擬語氣的基本結構', 'wish/if only 句式', 'It is important that... 等句式中的虛擬語氣'] },
  { grade: 'f3', curriculumLevel: 9, domain: '文法', topic: 'Advanced Passive', edbRef: 'EN9-2',
    difficulty: 5,
    learningObjectives: ['複雜被動語態 (進行式被動、完成式被動)', '雙賓語動詞的被動轉換', '被動語態在不同時態中的應用'] },
  { grade: 'f3', curriculumLevel: 9, domain: '文法', topic: 'Complex Sentences', edbRef: 'EN9-3',
    difficulty: 5,
    learningObjectives: ['複合句和複雜句結構', '名詞從句和副詞從句', '多從句句子的組合'] },
  { grade: 'f3', curriculumLevel: 9, domain: '聆聽', topic: 'Register', edbRef: 'EN9-4',
    difficulty: 5,
    learningObjectives: ['辨別語域 (formal, informal, neutral)', '根據場合選擇合適語域', '聆聽不同語域的表達'] },
  { grade: 'f3', curriculumLevel: 9, domain: '閱讀', topic: 'Exam Skills', edbRef: 'EN9-5',
    difficulty: 5,
    learningObjectives: ['公開試閱讀技巧', '時間管理和答題策略', '長篇閱讀理解練習'] },
  { grade: 'f3', curriculumLevel: 9, domain: '寫作', topic: 'Summary Writing', edbRef: 'EN9-6',
    difficulty: 5,
    learningObjectives: ['摘要寫作技巧', '篩選關鍵資訊', '用自己的話改寫', '控制字數和保持連貫'] },
];

// 依年级筛选
export function getEnglishCurriculum(grade) {
  return englishCurriculum.filter(c => c.grade === grade);
}

// 依领域筛选
export function getEnglishCurriculumByDomain(domain) {
  return englishCurriculum.filter(c => c.domain === domain);
}

// 依 curriculumLevel 筛选
export function getEnglishCurriculumByLevel(level) {
  return englishCurriculum.filter(c => c.curriculumLevel === level);
}

// 获取所有领域列表
export function getEnglishDomains() {
  return [...new Set(englishCurriculum.map(c => c.domain))];
}

// 获取某年级的所有领域
export function getDomainsForGrade(grade) {
  return [...new Set(getEnglishCurriculum(grade).map(c => c.domain))];
}

export default englishCurriculum;
