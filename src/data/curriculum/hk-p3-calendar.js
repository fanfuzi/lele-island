// 聖公會仁立小學 P3 教學曆
// 對應 2025-2026 學年
// 教材：
//   中文 — 二十一世紀現代中國語文（現代教育研究社）
//   數學 — 現代小學數學（現代教育研究社）
//   英文 — Longman Welcome to English Gold 3A/3B（Pearson）
//   常識 — 今日常識新領域第三版（香港教育圖書）

const CALENDAR = [
  // ========================
  // 上學期 (第 1–19 週)
  // ========================
  { week: 1,
    math:    { topic: '五位數 (一)', desc: '認識萬以內的數、位值、數值比較' },
    english: { topic: 'Unit 1: Weather and Seasons (A-B)', desc: 'Weather vocabulary, What is the weather like?' },
    chinese: { topic: '第一課', desc: '' },
    gs:      { topic: '健康的生活 (一)', desc: '飲食衛生、均衡飲食' } },
  { week: 2,
    math:    { topic: '五位數 (二)', desc: '近似值、數線、大小比較' },
    english: { topic: 'Unit 1: Weather and Seasons (C-F)', desc: 'Story & phonics: weather words' },
    chinese: { topic: '第一課', desc: '' },
    gs:      { topic: '健康的生活 (二)', desc: '運動與健康、個人衛生' } },
  { week: 3,
    math:    { topic: '加與減 (四) (一)', desc: '三位數加減（進位、退位）' },
    english: { topic: 'Unit 2: Festivals we like (A-B)', desc: 'Festival vocabulary, When is...?' },
    chinese: { topic: '第二課', desc: '' },
    gs:      { topic: '健康的生活 (三)', desc: '藥物安全、疾病預防' } },
  { week: 4,
    math:    { topic: '加與減 (四) (二)', desc: '連加連減、加減混合應用' },
    english: { topic: 'Unit 2: Festivals we like (C-F)', desc: 'Story: festival customs, phonics' },
    chinese: { topic: '第二課', desc: '' },
    gs:      { topic: '香港的動植物 (一)', desc: '香港常見植物' } },
  { week: 5,
    math:    { topic: '乘法 (一) (一)', desc: '兩位數乘以一位數' },
    english: { topic: 'Unit 3: Our school events (A-B)', desc: 'School event vocabulary, present continuous' },
    chinese: { topic: '第三課', desc: '' },
    gs:      { topic: '香港的動植物 (二)', desc: '香港常見動物' } },
  { week: 6,
    math:    { topic: '乘法 (一) (二)', desc: '乘法應用題、乘加混合' },
    english: { topic: 'Unit 3: Our school events (C-F)', desc: 'Story: school fair, phonics' },
    chinese: { topic: '第三課', desc: '' },
    gs:      { topic: '香港的動植物 (三)', desc: '環境保護、愛護自然' } },
  { week: 7,
    math:    { topic: '除法 (一) (一)', desc: '兩位數除以一位數、整除' },
    english: { topic: 'Unit 4: At the school fair (A-B)', desc: 'Shopping vocabulary, How much...?' },
    chinese: { topic: '第四課', desc: '' },
    gs:      { topic: '自然現象探趣 (一)', desc: '天氣與季節' } },
  { week: 8,
    math:    { topic: '除法 (一) (二)', desc: '帶餘數除法、除法應用題' },
    english: { topic: 'Unit 4: At the school fair (C-F)', desc: 'Story: school fair, phonics' },
    chinese: { topic: '第四課', desc: '' },
    gs:      { topic: '自然現象探趣 (二)', desc: '日與夜、月亮變化' } },
  { week: 9,
    math:    { topic: '平行線和四邊形', desc: '平行線、平行四邊形、梯形' },
    english: { topic: 'Roundup 1 + 考試複習', desc: 'Units 1-4 複習' },
    chinese: { topic: '第五課', desc: '' },
    gs:      { topic: '自然現象探趣 (三)', desc: '水的三態、天氣現象' } },
  { week: 10,
    math:    { topic: '三角形', desc: '直角三角形、等腰三角形、等邊三角形' },
    english: { topic: 'Unit 5: Things at home (A-B)', desc: 'Home vocabulary, prepositions of place' },
    chinese: { topic: '第五課', desc: '' },
    gs:      { topic: '生活多姿彩 (一)', desc: '社區設施' } },
  { week: 11,
    math:    { topic: '時間 (一)', desc: '秒、24小時報時制' },
    english: { topic: 'Unit 5: Things at home (C-F)', desc: 'Story: home, phonics' },
    chinese: { topic: '第六課', desc: '' },
    gs:      { topic: '生活多姿彩 (二)', desc: '休閒與娛樂' } },
  { week: 12,
    math:    { topic: '時間 (二)', desc: '時間間隔計算、應用題' },
    english: { topic: 'Unit 6: A trip to the beach (A-B)', desc: 'Beach vocabulary, past tense' },
    chinese: { topic: '第六課', desc: '' },
    gs:      { topic: '生活多姿彩 (三)', desc: '藝術與文化' } },
  { week: 13,
    math:    { topic: '重量', desc: '克(g)、千克(kg)、比較重量' },
    english: { topic: 'Unit 6: A trip to the beach (C-F)', desc: 'Story: beach trip, phonics' },
    chinese: { topic: '第七課', desc: '' },
    gs:      { topic: '同一天空下 (一)', desc: '家庭與社區' } },
  { week: 14,
    math:    { topic: '容量', desc: '升(L)、毫升(mL)、比較容量' },
    english: { topic: 'Roundup 2 + 考試複習', desc: 'Units 5-6 複習' },
    chinese: { topic: '第七課', desc: '' },
    gs:      { topic: '同一天空下 (二)', desc: '不同種族與文化' } },
  { week: 15,
    math:    { topic: '公里和毫米', desc: '公里(km)、毫米(mm)、單位換算' },
    english: { topic: '考試週', desc: '上學期考試' },
    chinese: { topic: '第八課', desc: '' },
    gs:      { topic: '同一天空下 (三)', desc: '關懷與幫助他人' } },
  { week: 16,
    math:    { topic: '分數的認識 (一)', desc: '分數概念、寫法、部分與整體' },
    english: { topic: '假期', desc: '聖誕假期' },
    chinese: { topic: '第八課', desc: '' },
    gs:      { topic: '香港知多少 (一)', desc: '香港的地理位置' } },
  { week: 17,
    math:    { topic: '分數的認識 (二)', desc: '比較分數大小、等值分數' },
    english: { topic: '假期', desc: '聖誕假期' },
    chinese: { topic: '複習', desc: '期終複習' },
    gs:      { topic: '香港知多少 (二)', desc: '香港的交通' } },
  { week: 18,
    math:    { topic: '上學期複習', desc: '期終考試' },
    english: { topic: '上學期複習', desc: '期終考試' },
    chinese: { topic: '上學期考試', desc: '' },
    gs:      { topic: '上學期複習', desc: '期終考試' } },
  { week: 19,
    math:    { topic: '試卷回饋', desc: '考試檢討' },
    english: { topic: '試卷回饋', desc: '考試檢討' },
    chinese: { topic: '試卷回饋', desc: '' },
    gs:      { topic: '試卷回饋', desc: '考試檢討' } },

  // ========================
  // 下學期 (第 20–38 週)
  // ========================
  { week: 20,
    math:    { topic: '乘加和乘減混合計算 (一)', desc: '乘加、乘減、括號的使用' },
    english: { topic: 'Unit 1: Open Day (A-B)', desc: 'School vocabulary, simple present vs present continuous' },
    chinese: { topic: '第九課', desc: '' },
    gs:      { topic: '健康的生活 (四)', desc: '青春期初步認識' } },
  { week: 21,
    math:    { topic: '乘加和乘減混合計算 (二)', desc: '混合計算應用題' },
    english: { topic: 'Unit 1: Open Day (C-F)', desc: 'Story: Open Day, phonics' },
    chinese: { topic: '第九課', desc: '' },
    gs:      { topic: '香港的動植物 (四)', desc: '生態系統、食物鏈' } },
  { week: 22,
    math:    { topic: '加減混合計算', desc: '加減混合、括號的運用' },
    english: { topic: 'Unit 2: Helping others (A-B)', desc: 'Helping vocabulary, should/shouldn\'t' },
    chinese: { topic: '第十課', desc: '' },
    gs:      { topic: '自然現象探趣 (四)', desc: '磁力、簡單機械' } },
  { week: 23,
    math:    { topic: '同分母分數加減 (一)', desc: '同分母分數加法' },
    english: { topic: 'Unit 2: Helping others (C-F)', desc: 'Story: helping others, phonics' },
    chinese: { topic: '第十課', desc: '' },
    gs:      { topic: '生活多姿彩 (四)', desc: '傳媒與資訊' } },
  { week: 24,
    math:    { topic: '同分母分數加減 (二)', desc: '同分母分數減法、應用題' },
    english: { topic: 'Unit 3: Camping (A-B)', desc: 'Camping vocabulary, going to future' },
    chinese: { topic: '第十一課', desc: '' },
    gs:      { topic: '同一天空下 (四)', desc: '世界公民' } },
  { week: 25,
    math:    { topic: '除法 (二) (一)', desc: '三位數除以一位數（整除）' },
    english: { topic: 'Unit 3: Camping (C-F)', desc: 'Story: camping trip, phonics' },
    chinese: { topic: '第十一課', desc: '' },
    gs:      { topic: '香港知多少 (三)', desc: '香港的歷史' } },
  { week: 26,
    math:    { topic: '除法 (二) (二)', desc: '帶餘數除法、驗算' },
    english: { topic: 'Roundup 1 + 考試複習', desc: 'Units 1-3 複習' },
    chinese: { topic: '第十二課', desc: '' },
    gs:      { topic: '香港知多少 (四)', desc: '香港的名勝古蹟' } },
  { week: 27,
    math:    { topic: '乘法 (二) (一)', desc: '三位數乘以一位數（進位）' },
    english: { topic: 'Unit 4: In the holidays (A-B)', desc: 'Holiday vocabulary, past tense review' },
    chinese: { topic: '第十二課', desc: '' },
    gs:      { topic: '綜合複習', desc: '跨課題探究' } },
  { week: 28,
    math:    { topic: '乘法 (二) (二)', desc: '乘法應用題、乘除混合' },
    english: { topic: 'Unit 4: In the holidays (C-F)', desc: 'Story: holidays, phonics' },
    chinese: { topic: '第十三課', desc: '' },
    gs:      { topic: '綜合複習', desc: '跨課題探究' } },
  { week: 29,
    math:    { topic: '倍數和因數 (一)', desc: '倍數概念、識別倍數' },
    english: { topic: 'Unit 5: Our bodies (A-B)', desc: 'Body vocabulary, describing people' },
    chinese: { topic: '第十三課', desc: '' },
    gs:      { topic: '科學探究', desc: '實驗與記錄' } },
  { week: 30,
    math:    { topic: '倍數和因數 (二)', desc: '因數概念、質因數初步' },
    english: { topic: 'Unit 5: Our bodies (C-F)', desc: 'Story: health, phonics' },
    chinese: { topic: '第十四課', desc: '' },
    gs:      { topic: '科學探究', desc: '實驗與記錄' } },
  { week: 31,
    math:    { topic: '棒形圖 (一)', desc: '閱讀棒形圖、數據解讀' },
    english: { topic: 'Unit 6: When I was young (A-B)', desc: 'Past tense: was/were, childhood vocabulary' },
    chinese: { topic: '第十四課', desc: '' },
    gs:      { topic: '社會探究', desc: '社區調查' } },
  { week: 32,
    math:    { topic: '棒形圖 (二)', desc: '製作棒形圖、數據收集' },
    english: { topic: 'Unit 6: When I was young (C-F)', desc: 'Story: growing up, phonics' },
    chinese: { topic: '第十五課', desc: '' },
    gs:      { topic: '社會探究', desc: '社區調查' } },
  { week: 33,
    math:    { topic: '小數 (一) (一)', desc: '小數概念、十分位、百分位' },
    english: { topic: 'Roundup 2 + 考試複習', desc: 'Units 4-6 複習' },
    chinese: { topic: '第十五課', desc: '' },
    gs:      { topic: '綜合複習', desc: '跨課題探究' } },
  { week: 34,
    math:    { topic: '小數 (一) (二)', desc: '小數比較、小數加減初步' },
    english: { topic: '考試週', desc: '下學期考試' },
    chinese: { topic: '總複習', desc: '' },
    gs:      { topic: '考試週', desc: '下學期考試' } },
  { week: 35,
    math:    { topic: '小數 (一) (三)', desc: '小數應用、貨幣計算' },
    english: { topic: '考試週', desc: '下學期考試' },
    chinese: { topic: '下學期考試', desc: '' },
    gs:      { topic: '考試週', desc: '下學期考試' } },
  { week: 36,
    math:    { topic: '總複習 (一)', desc: '全學年回顧' },
    english: { topic: '假期活動', desc: '暑期閱讀' },
    chinese: { topic: '暑期閱讀', desc: '' },
    gs:      { topic: '暑期學習', desc: '自主探究' } },
  { week: 37,
    math:    { topic: '總複習 (二)', desc: '全學年回顧' },
    english: { topic: '假期活動', desc: '暑期閱讀' },
    chinese: { topic: '暑期閱讀', desc: '' },
    gs:      { topic: '暑期學習', desc: '自主探究' } },
  { week: 38,
    math:    { topic: '數學遊戲', desc: '數學興趣活動' },
    english: { topic: '假期活動', desc: '暑期閱讀' },
    chinese: { topic: '暑期閱讀', desc: '' },
    gs:      { topic: '暑期學習', desc: '自主探究' } },
];

// ===== 輔助函數 =====

// 香港學校假期估算（2025-2026學年）
function getHolidayWeeks() {
  const now = new Date();
  const yearStart = new Date(2025, 8, 1); // 9月1日
  const weekNum = Math.floor((now - yearStart) / (7 * 86400000)) + 1;
  const holidays = [];
  // 聖誕假期 ≈ 第 16-17 週
  if (weekNum >= 16) holidays.push(16, 17);
  // 農曆新年 ≈ 第 24 週
  if (weekNum >= 24) holidays.push(24);
  // 復活節 ≈ 第 31 週
  if (weekNum >= 31) holidays.push(31);
  return holidays;
}

// 獲取當前是學年第幾週
export function getCurrentSchoolWeek() {
  const schoolStart = new Date(2025, 8, 1); // 2025-09-01
  const now = new Date();
  const diffDays = Math.floor((now - schoolStart) / 86400000);
  let rawWeek = Math.floor(diffDays / 7) + 1;
  if (rawWeek < 1) rawWeek = 1;
  if (rawWeek > 42) rawWeek = 42;

  // 扣除假期週
  const holidays = getHolidayWeeks();
  let adjusted = rawWeek;
  let subtracted = 0;
  for (const hw of holidays.sort((a, b) => a - b)) {
    if (rawWeek > hw - subtracted) {
      adjusted--;
      subtracted++;
    }
  }

  return Math.max(1, Math.min(adjusted, CALENDAR.length));
}

// 獲取本週教學內容
export function getThisWeekCurriculum() {
  const week = getCurrentSchoolWeek();
  const entry = CALENDAR.find(e => e.week === week);
  if (!entry) return { week, subjects: {} };
  return { week, subjects: entry };
}

// 獲取指定週的教學內容
export function getWeekCurriculum(week) {
  const entry = CALENDAR.find(e => e.week === week);
  return entry || null;
}

// 生成今日複習任務列表（用於首頁）
export function getDailyReviewTasks() {
  const { week, subjects } = getThisWeekCurriculum();
  const subjectMeta = {
    math:    { id: 'math',    icon: '🔢', label: '數學', color: '#FF9EAA' },
    english: { id: 'english', icon: '🔤', label: '英文', color: '#AAE1C6' },
    chinese: { id: 'chinese', icon: '✍️', label: '中文', color: '#A8D8EA' },
    gs:      { id: 'gs',      icon: '🌍', label: '常識', color: '#FFDAA3' },
  };

  return {
    week,
    tasks: Object.entries(subjectMeta)
      .filter(([key]) => subjects[key])
      .map(([key, meta]) => {
        const subj = subjects[key];
        const topic = subj.topic || '';
        const isExam = topic.includes('考試') || topic.includes('假期');
        const isReview = topic.includes('複習') || topic.includes('回饋');
        return {
          ...meta,
          topic: subj.topic || '',
          desc: subj.desc || '',
          isExam,
          isReview,
        };
      }),
  };
}

// 中文科課表是否為佔位（提醒用戶自定義）
export function isChinesePlaceholder() {
  const { subjects } = getThisWeekCurriculum();
  return subjects.chinese?.topic === '第一課' || subjects.chinese?.topic === '';
}

export { CALENDAR };
