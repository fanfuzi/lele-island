/**
 * 中文題目模板庫 (P1-F3) — 香港繁體中文
 * 每個模板通過 templateEngine 可生成多道不同題目
 * 組織方式：按年級分組，涵蓋認讀/筆畫/部首/組詞/詞語/量詞/標點/成語/排序/閱讀理解
 */

export const chineseTemplates = [
  // ============================
  // P1 (一年級) — 基礎認讀
  // ============================
  {
    id: 'P1-STROKE-001', genre: 'stroke-count', grade: 'p1', edbCodes: ['CL1-1.1'], difficulty: 1,
    pattern: '「{char}」字有多少筆畫？',
    variables: {
      char: ['山', '大', '人', '口', '水', '火', '天', '日', '月', '木'],
    },
    answer: (v) => {
      const strokes = { '山': 3, '大': 3, '人': 2, '口': 3, '水': 4, '火': 4, '天': 4, '日': 4, '月': 4, '木': 4 };
      return strokes[v.char];
    },
    distractors: (v) => {
      const s = { '山': 3, '大': 3, '人': 2, '口': 3, '水': 4, '火': 4, '天': 4, '日': 4, '月': 4, '木': 4 };
      const c = s[v.char];
      return [c + 1, c - 1 || c + 2, c + 2];
    },
    distractorLabels: ['多數一筆', '少數一筆', '多數兩筆'],
  },
  {
    id: 'P1-STROKE-002', genre: 'stroke-count', grade: 'p1', edbCodes: ['CL1-1.1'], difficulty: 1,
    pattern: '「{char}」字有多少筆畫？',
    variables: {
      char: ['小', '手', '足', '牙', '耳', '心', '白', '黑', '出', '去'],
    },
    answer: (v) => {
      const strokes = { '小': 3, '手': 4, '足': 7, '牙': 4, '耳': 6, '心': 4, '白': 5, '黑': 12, '出': 5, '去': 5 };
      return strokes[v.char];
    },
    distractors: (v) => {
      const s = { '小': 3, '手': 4, '足': 7, '牙': 4, '耳': 6, '心': 4, '白': 5, '黑': 12, '出': 5, '去': 5 };
      const c = s[v.char];
      return [c + 1, c - 1 || c + 2, c + 2];
    },
    distractorLabels: ['多數一筆', '少數一筆', '多數兩筆'],
  },
  {
    id: 'P1-RADICAL-001', genre: 'radical-match', grade: 'p1', edbCodes: ['CL1-1.2'], difficulty: 1,
    pattern: '哪個字和「{target}」有相同的部首？',
    variables: {
      target: ['河', '花', '說', '吃', '你'],
    },
    answer: (v) => {
      const answers = { '河': '海', '花': '草', '說': '話', '吃': '叫', '你': '他' };
      return answers[v.target];
    },
    distractors: (v) => {
      const d = { '河': ['山', '火', '木'], '花': ['水', '手', '日'], '說': ['足', '心', '火'], '吃': ['目', '手', '心'], '你': ['口', '木', '女'] };
      return d[v.target];
    },
    distractorLabels: ['不同部首', '不同部首', '不同部首'],
  },
  {
    id: 'P1-WORDFORM-001', genre: 'word-formation', grade: 'p1', edbCodes: ['CL1-2.1'], difficulty: 1,
    pattern: '用「{char}」組一個正確的詞語：',
    variables: {
      char: ['學', '大', '開', '好'],
    },
    answer: (v) => {
      const answers = { '學': '學校', '大': '大小', '開': '開心', '好': '好人' };
      return answers[v.char];
    },
    distractors: (v) => {
      const d = { '學': ['學水', '學火', '學山'], '大': ['大去', '大入', '大出'], '開': ['開去', '開走', '開跑'], '好': ['好去', '好走', '好跑'] };
      return d[v.char];
    },
    distractorLabels: ['不是詞語', '不是詞語', '不是詞語'],
  },
  {
    id: 'P1-ANTONYM-001', genre: 'synonym-antonym', grade: 'p1', edbCodes: ['CL1-2.2'], difficulty: 1,
    pattern: '「{word}」的反義詞是？',
    variables: {
      word: ['大', '上', '來', '多', '開'],
    },
    answer: (v) => {
      const answers = { '大': '小', '上': '下', '來': '去', '多': '少', '開': '關' };
      return answers[v.word];
    },
    distractors: (v) => {
      const d = { '大': ['高', '長', '遠'], '上': ['左', '前', '東'], '來': ['走', '回', '到'], '多': ['大', '高', '好'], '開': ['走', '出', '放'] };
      return d[v.word];
    },
    distractorLabels: ['意思不同', '意思不同', '意思不同'],
  },
  {
    id: 'P1-MEASURE-001', genre: 'measure-word', grade: 'p1', edbCodes: ['CL1-2.3'], difficulty: 1,
    pattern: '一（{blank}）{noun}，應該填哪個量詞？',
    variables: {
      noun: ['狗', '貓', '魚', '鳥'],
    },
    answer: (v) => {
      const mw = { '狗': '隻', '貓': '隻', '魚': '條', '鳥': '隻' };
      return mw[v.noun];
    },
    distractors: (v) => {
      const d = { '狗': ['個', '張', '本'], '貓': ['個', '張', '本'], '魚': ['個', '隻', '張'], '鳥': ['個', '條', '張'] };
      return d[v.noun];
    },
    distractorLabels: ['量詞錯誤', '量詞錯誤', '量詞錯誤'],
  },
  {
    id: 'P1-PUNCT-001', genre: 'punctuation', grade: 'p1', edbCodes: ['CL1-3.1'], difficulty: 1,
    pattern: '「{sentence}{blank}」應該填甚麼標點符號？',
    variables: {
      sentence: ['你叫甚麼名字', '今天天氣很好', '我們去公園玩吧', '這是我的書包'],
    },
    answer: (v) => {
      const p = { '你叫甚麼名字': '？', '今天天氣很好': '。', '我們去公園玩吧': '！', '這是我的書包': '。' };
      return p[v.sentence];
    },
    distractors: (v) => {
      const wrong = { '你叫甚麼名字': ['。', '，', '！'], '今天天氣很好': ['？', '，', '！'], '我們去公園玩吧': ['。', '？', '，'], '這是我的書包': ['？', '！', '，'] };
      return wrong[v.sentence];
    },
    distractorLabels: ['應用問號', '不是句號', '不是感嘆號'],
  },
  {
    id: 'P1-IDIOM-001', genre: 'idiom', grade: 'p1', edbCodes: ['CL1-3.2'], difficulty: 2,
    pattern: '「三{a}兩{b}」是哪個成語？（形容心意不定）',
    variables: { a: ['心'], b: ['意'] },
    answer: () => '三心兩意',
    distractors: () => ['三頭兩面', '三言兩語', '三三兩兩'],
    distractorLabels: ['成語錯誤', '意思不同', '意思不同'],
  },
  {
    id: 'P1-SENT-ORDER-001', genre: 'sentence-order', grade: 'p1', edbCodes: ['CL1-3.3'], difficulty: 2,
    pattern: '把以下詞語排列成正確的句子：{words}',
    variables: {
      words: ['我 / 去 / 學校', '媽媽 / 買了 / 蘋果', '小明 / 在 / 看書', '我們 / 玩 / 很開心'],
    },
    answer: (v) => {
      const ans = { '我 / 去 / 學校': '我去學校', '媽媽 / 買了 / 蘋果': '媽媽買了蘋果', '小明 / 在 / 看書': '小明在看書', '我們 / 玩 / 很開心': '我們玩得很開心' };
      return ans[v.words];
    },
    distractors: (v) => {
      const d = {
        '我 / 去 / 學校': ['學校去我', '去學校我', '我學校去'],
        '媽媽 / 買了 / 蘋果': ['蘋果買了媽媽', '買了媽媽蘋果', '媽媽蘋果買了'],
        '小明 / 在 / 看書': ['看書在小明', '在小明看書', '小明看書在'],
        '我們 / 玩 / 很開心': ['很開心玩我們', '玩很開心我們', '我們很開心玩'],
      };
      return d[v.words];
    },
    distractorLabels: ['語序錯誤', '語序錯誤', '語序錯誤'],
  },
  {
    id: 'P1-READCOMP-001', genre: 'reading-comp', grade: 'p1', edbCodes: ['CL1-4.1'], difficulty: 2,
    patternFn: () => {
      const passages = [
        {
          passage: '小明今年六歲了。他每天早上七點起牀，然後吃早餐。他的學校在公園旁邊。',
          question: '小明每天幾點起牀？',
          answer: '七點',
          distractors: ['六點', '八點', '九點'],
        },
        {
          passage: '小紅家裏有一隻小狗和一隻小貓。小狗叫旺財，小貓叫咪咪。小紅最喜歡和牠們玩。',
          question: '小紅家裏有甚麼動物？',
          answer: '小狗和小貓',
          distractors: ['只有小狗', '只有小貓', '小兔和小狗'],
        },
        {
          passage: '今天是星期天，天氣很好。爸爸帶我和姐姐去海灘玩。我們在沙灘上堆城堡。',
          question: '他們去哪裏玩？',
          answer: '海灘',
          distractors: ['公園', '學校', '山上'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // P2 (二年級) — 日常用字
  // ============================
  {
    id: 'P2-STROKE-001', genre: 'stroke-count', grade: 'p2', edbCodes: ['CL2-1.1'], difficulty: 2,
    pattern: '「{char}」字有多少筆畫？',
    variables: {
      char: ['書', '學', '愛', '頭', '媽', '門', '電', '來', '買', '說'],
    },
    answer: (v) => {
      const s = { '書': 10, '學': 16, '愛': 13, '頭': 16, '媽': 13, '門': 8, '電': 13, '來': 8, '買': 12, '說': 14 };
      return s[v.char];
    },
    distractors: (v) => {
      const s = { '書': 10, '學': 16, '愛': 13, '頭': 16, '媽': 13, '門': 8, '電': 13, '來': 8, '買': 12, '說': 14 };
      const c = s[v.char];
      return [c + 1, c - 1, c + 2];
    },
    distractorLabels: ['多數一筆', '少數一筆', '多數兩筆'],
  },
  {
    id: 'P2-RADICAL-001', genre: 'radical-match', grade: 'p2', edbCodes: ['CL2-1.2'], difficulty: 2,
    pattern: '哪個字和「{target}」有相同的部首？',
    variables: {
      target: ['跑', '樹', '晴', '跳', '想'],
    },
    answer: (v) => {
      const a = { '跑': '跳', '樹': '林', '晴': '明', '跳': '踢', '想': '念' };
      return a[v.target];
    },
    distractors: (v) => {
      const d = {
        '跑': ['河', '火', '木'],
        '樹': ['水', '手', '口'],
        '晴': ['水', '土', '口'],
        '跳': ['河', '花', '木'],
        '想': ['水', '口', '木'],
      };
      return d[v.target];
    },
    distractorLabels: ['不同部首', '不同部首', '不同部首'],
  },
  {
    id: 'P2-WORDFORM-001', genre: 'word-formation', grade: 'p2', edbCodes: ['CL2-2.1'], difficulty: 2,
    pattern: '用「{char}」組一個正確的詞語：',
    variables: {
      char: ['友', '快', '朋', '快', '高', '老'],
    },
    answer: (v) => {
      const a = { '友': '朋友', '快': '快樂', '朋': '朋友', '高': '高興', '老': '老師' };
      return a[v.char];
    },
    distractors: (v) => {
      const d = {
        '友': ['友水', '友火', '友木'],
        '快': ['快水', '快山', '快火'],
        '朋': ['朋水', '朋山', '朋火'],
        '高': ['高水', '高山', '高火'],
        '老': ['老水', '老山', '老火'],
      };
      return d[v.char];
    },
    distractorLabels: ['不是詞語', '不是詞語', '不是詞語'],
  },
  {
    id: 'P2-SYNONYM-001', genre: 'synonym-antonym', grade: 'p2', edbCodes: ['CL2-2.2'], difficulty: 2,
    pattern: '「{word}」的同義詞是？',
    variables: {
      word: ['快樂', '美麗', '巨大', '常常'],
    },
    answer: (v) => {
      const a = { '快樂': '開心', '美麗': '漂亮', '巨大': '龐大', '常常': '經常' };
      return a[v.word];
    },
    distractors: (v) => {
      const d = {
        '快樂': ['傷心', '生氣', '安靜'],
        '美麗': ['醜陋', '巨大', '微小'],
        '巨大': ['微小', '快樂', '安靜'],
        '常常': ['從不', '很少', '偶爾'],
      };
      return d[v.word];
    },
    distractorLabels: ['這是反義詞', '意思不同', '意思不同'],
  },
  {
    id: 'P2-ANTONYM-001', genre: 'synonym-antonym', grade: 'p2', edbCodes: ['CL2-2.2'], difficulty: 2,
    pattern: '「{word}」的反義詞是？',
    variables: {
      word: ['高興', '乾淨', '安靜', '聰明', '勇敢'],
    },
    answer: (v) => {
      const a = { '高興': '傷心', '乾淨': '骯髒', '安靜': '吵鬧', '聰明': '愚蠢', '勇敢': '膽小' };
      return a[v.word];
    },
    distractors: (v) => {
      const d = {
        '高興': ['快樂', '開心', '歡喜'],
        '乾淨': ['清潔', '整齊', '明亮'],
        '安靜': ['平靜', '冷靜', '寧靜'],
        '聰明': ['機靈', '伶俐', '精明'],
        '勇敢': ['強壯', '堅強', '厲害'],
      };
      return d[v.word];
    },
    distractorLabels: ['這是同義詞', '這是同義詞', '這是同義詞'],
  },
  {
    id: 'P2-MEASURE-001', genre: 'measure-word', grade: 'p2', edbCodes: ['CL2-2.3'], difficulty: 2,
    pattern: '一（{blank}）{noun}，應該填哪個量詞？',
    variables: {
      noun: ['紙', '書', '筆', '畫'],
    },
    answer: (v) => {
      const mw = { '紙': '張', '書': '本', '筆': '枝', '畫': '幅' };
      return mw[v.noun];
    },
    distractors: (v) => {
      const d = { '紙': ['本', '個', '條'], '書': ['張', '個', '條'], '筆': ['張', '本', '個'], '畫': ['張', '本', '個'] };
      return d[v.noun];
    },
    distractorLabels: ['量詞錯誤', '量詞錯誤', '量詞錯誤'],
  },
  {
    id: 'P2-PUNCT-001', genre: 'punctuation', grade: 'p2', edbCodes: ['CL2-3.1'], difficulty: 2,
    pattern: '「{sentence}{blank}」應該填甚麼標點符號？',
    variables: {
      sentence: ['你今天吃了甚麼', '下雨了我們快走吧', '小華是一個好學生', '請問圖書館在哪裏'],
    },
    answer: (v) => {
      const p = { '你今天吃了甚麼': '？', '下雨了我們快走吧': '！', '小華是一個好學生': '。', '請問圖書館在哪裏': '？' };
      return p[v.sentence];
    },
    distractors: (v) => {
      const wrong = {
        '你今天吃了甚麼': ['。', '，', '！'],
        '下雨了我們快走吧': ['。', '？', '，'],
        '小華是一個好學生': ['？', '！', '，'],
        '請問圖書館在哪裏': ['。', '，', '！'],
      };
      return wrong[v.sentence];
    },
    distractorLabels: ['應用問號', '不是句號', '不是逗號'],
  },
  {
    id: 'P2-IDIOM-001', genre: 'idiom', grade: 'p2', edbCodes: ['CL2-3.2'], difficulty: 2,
    pattern: '「{hint}」是形容做事有頭無尾，應該是哪個成語？',
    variables: {
      hint: ['虎頭蛇尾'],
    },
    answer: () => '虎頭蛇尾',
    distractors: () => ['馬馬虎虎', '畫蛇添足', '虎視眈眈'],
    distractorLabels: ['意思不同', '意思不同', '意思不同'],
  },
  {
    id: 'P2-SENT-ORDER-001', genre: 'sentence-order', grade: 'p2', edbCodes: ['CL2-3.3'], difficulty: 2,
    pattern: '把以下詞語排列成正確的句子：{words}',
    variables: {
      words: ['小紅 / 和 / 小明 / 是朋友', '老師 / 教 / 我們 / 寫字', '爸爸 / 每天 / 看報紙'],
    },
    answer: (v) => {
      const ans = {
        '小紅 / 和 / 小明 / 是朋友': '小紅和小明是朋友',
        '老師 / 教 / 我們 / 寫字': '老師教我們寫字',
        '爸爸 / 每天 / 看報紙': '爸爸每天看報紙',
      };
      return ans[v.words];
    },
    distractors: (v) => {
      const d = {
        '小紅 / 和 / 小明 / 是朋友': ['小明和小紅是朋友', '是朋友小紅和小明', '朋友小紅和小明是'],
        '老師 / 教 / 我們 / 寫字': ['我們教老師寫字', '寫字教我們老師', '教老師我們寫字'],
        '爸爸 / 每天 / 看報紙': ['報紙爸爸每天看', '每天爸爸看報紙', '看報紙爸爸每天'],
      };
      return d[v.words];
    },
    distractorLabels: ['語序錯誤', '語序錯誤', '語序錯誤'],
  },
  {
    id: 'P2-READCOMP-001', genre: 'reading-comp', grade: 'p2', edbCodes: ['CL2-4.1'], difficulty: 2,
    patternFn: () => {
      const passages = [
        {
          passage: '昨天是小華的生日。媽媽做了一個大蛋糕，爸爸買了一份禮物。小華請了五個好朋友來家裏開派對。他們一起唱生日歌，一起吃蛋糕。小華說這是他最開心的一天。',
          question: '小華請了多少個朋友來參加派對？',
          answer: '五個',
          distractors: ['三個', '四個', '六個'],
        },
        {
          passage: '我家住在香港島。每天早上，我和姐姐一起坐巴士上學。學校離家不遠，大約十五分鐘就到了。放學後，我們有時會去學校旁邊的公園玩。',
          question: '他們怎樣去上學？',
          answer: '坐巴士',
          distractors: ['坐地鐵', '走路', '坐小巴'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // P3 (三年級) — 閱讀與詞語
  // ============================
  {
    id: 'P3-STROKE-001', genre: 'stroke-count', grade: 'p3', edbCodes: ['CL3-1.1'], difficulty: 2,
    pattern: '「{char}」字有多少筆畫？',
    variables: {
      char: ['聽', '醫', '謝', '難', '樹', '館', '讀', '題', '還', '貓'],
    },
    answer: (v) => {
      const s = { '聽': 22, '醫': 18, '謝': 17, '難': 19, '樹': 16, '館': 16, '讀': 22, '題': 18, '還': 17, '貓': 13 };
      return s[v.char];
    },
    distractors: (v) => {
      const s = { '聽': 22, '醫': 18, '謝': 17, '難': 19, '樹': 16, '館': 16, '讀': 22, '題': 18, '還': 17, '貓': 13 };
      const c = s[v.char];
      return [c + 1, c - 1, c + 2];
    },
    distractorLabels: ['多數一筆', '少數一筆', '多數兩筆'],
  },
  {
    id: 'P3-RADICAL-001', genre: 'radical-match', grade: 'p3', edbCodes: ['CL3-1.2'], difficulty: 2,
    pattern: '哪個字和「{target}」有相同的部首？',
    variables: {
      target: ['快', '冷', '燈', '送', '病'],
    },
    answer: (v) => {
      const a = { '快': '忙', '冷': '涼', '燈': '熱', '送': '通', '病': '痛' };
      return a[v.target];
    },
    distractors: (v) => {
      const d = {
        '快': ['河', '吃', '木'],
        '冷': ['火', '水', '口'],
        '燈': ['水', '木', '口'],
        '送': ['水', '口', '木'],
        '病': ['水', '口', '木'],
      };
      return d[v.target];
    },
    distractorLabels: ['不同部首', '不同部首', '不同部首'],
  },
  {
    id: 'P3-WORDFORM-001', genre: 'word-formation', grade: 'p3', edbCodes: ['CL3-2.1'], difficulty: 2,
    pattern: '哪個詞語填在句子中最恰當？\n「{sentence}」',
    variables: {
      sentence: ['今天天氣很____，我們去行山吧！', '小明很____，每次都拿一百分。', '這本書很____，我看了一整天。'],
    },
    answer: (v) => {
      const a = {
        '今天天氣很____，我們去行山吧！': '晴朗',
        '小明很____，每次都拿一百分。': '聰明',
        '這本書很____，我看了一整天。': '有趣',
      };
      return a[v.sentence];
    },
    distractors: (v) => {
      const d = {
        '今天天氣很____，我們去行山吧！': ['寒冷', '下雨', '打風'],
        '小明很____，每次都拿一百分。': ['懶惰', '頑皮', '膽小'],
        '這本書很____，我看了一整天。': ['無聊', '簡單', '困難'],
      };
      return d[v.sentence];
    },
    distractorLabels: ['不合語境', '不合語境', '不合語境'],
  },
  {
    id: 'P3-SYNONYM-001', genre: 'synonym-antonym', grade: 'p3', edbCodes: ['CL3-2.2'], difficulty: 3,
    pattern: '以下哪個詞語和「{word}」意思最相近？',
    variables: {
      word: ['高興', '忽然', '立刻', '非常'],
    },
    answer: (v) => {
      const a = { '高興': '歡喜', '忽然': '突然', '立刻': '馬上', '非常': '十分' };
      return a[v.word];
    },
    distractors: (v) => {
      const d = {
        '高興': ['傷心', '生氣', '害怕'],
        '忽然': ['慢慢', '經常', '永遠'],
        '立刻': ['緩緩', '漸漸', '偶爾'],
        '非常': ['普通', '稍微', '一點'],
      };
      return d[v.word];
    },
    distractorLabels: ['這是反義詞', '意思相反', '意思相反'],
  },
  {
    id: 'P3-ANTONYM-001', genre: 'synonym-antonym', grade: 'p3', edbCodes: ['CL3-2.2'], difficulty: 3,
    pattern: '以下哪個詞語和「{word}」意思相反？',
    variables: {
      word: ['成功', '開始', '容易', '安全'],
    },
    answer: (v) => {
      const a = { '成功': '失敗', '開始': '結束', '容易': '困難', '安全': '危險' };
      return a[v.word];
    },
    distractors: (v) => {
      const d = {
        '成功': ['勝利', '完成', '達到'],
        '開始': ['出發', '啟動', '開幕'],
        '容易': ['簡單', '輕鬆', '方便'],
        '安全': ['平安', '安心', '穩妥'],
      };
      return d[v.word];
    },
    distractorLabels: ['這是同義詞', '這是同義詞', '這是同義詞'],
  },
  {
    id: 'P3-MEASURE-001', genre: 'measure-word', grade: 'p3', edbCodes: ['CL3-2.3'], difficulty: 3,
    pattern: '一（{blank}）{noun}，應該填哪個量詞？',
    variables: {
      noun: ['眼淚', '明月', '彩虹', '新聞', '眼鏡'],
    },
    answer: (v) => {
      const mw = { '眼淚': '滴', '明月': '輪', '彩虹': '道', '新聞': '則', '眼鏡': '副' };
      return mw[v.noun];
    },
    distractors: (v) => {
      const d = {
        '眼淚': ['條', '個', '顆'],
        '明月': ['個', '輪', '條'].filter(x => x !== '輪'),
        '彩虹': ['條', '個', '座'],
        '新聞': ['條', '個', '篇'],
        '眼鏡': ['個', '條', '隻'],
      };
      return d[v.noun];
    },
    distractorLabels: ['量詞錯誤', '量詞錯誤', '量詞錯誤'],
  },
  {
    id: 'P3-PUNCT-001', genre: 'punctuation', grade: 'p3', edbCodes: ['CL3-3.1'], difficulty: 3,
    pattern: '以下句子應該用甚麼標點符號？\n「{sentence}」',
    variables: {
      sentence: ['他說 我明天一定會來', '香港是一個美麗的城市', '你到底去不去啊'],
    },
    answer: (v) => {
      const a = {
        '他說 我明天一定會來': '冒號和引號',
        '香港是一個美麗的城市': '句號',
        '你到底去不去啊': '問號',
      };
      return a[v.sentence];
    },
    distractors: (v) => {
      const d = {
        '他說 我明天一定會來': ['逗號', '句號', '感嘆號'],
        '香港是一個美麗的城市': ['逗號', '問號', '感嘆號'],
        '你到底去不去啊': ['句號', '逗號', '感嘆號'],
      };
      return d[v.sentence];
    },
    distractorLabels: ['應用冒號引號', '不是逗號', '應用問號'],
  },
  {
    id: 'P3-IDIOM-001', genre: 'idiom', grade: 'p3', edbCodes: ['CL3-3.2'], difficulty: 3,
    pattern: '哪個成語的意思是「{meaning}」？',
    variables: {
      meaning: ['做事多此一舉', '比喻自欺欺人', '形容非常危險'],
    },
    answer: (v) => {
      const a = { '做事多此一舉': '畫蛇添足', '比喻自欺欺人': '掩耳盜鈴', '形容非常危險': '千鈞一髮' };
      return a[v.meaning];
    },
    distractors: (v) => {
      const d = {
        '做事多此一舉': ['守株待兔', '亡羊補牢', '杯弓蛇影'],
        '比喻自欺欺人': ['畫蛇添足', '對牛彈琴', '狐假虎威'],
        '形容非常危險': ['九死一生', '小心翼翼', '如履薄冰'],
      };
      return d[v.meaning];
    },
    distractorLabels: ['意思不同', '意思不同', '意思不同'],
  },
  {
    id: 'P3-SENT-ORDER-001', genre: 'sentence-order', grade: 'p3', edbCodes: ['CL3-3.3'], difficulty: 3,
    pattern: '把以下詞語排列成通順的句子：\n{words}',
    variables: {
      words: ['香港 / 維多利亞港 / 美麗的 / 有', '圖書館 / 書 / 很多 / 裏面 / 有', '妹妹 / 鋼琴 / 每天 / 彈'],
    },
    answer: (v) => {
      const ans = {
        '香港 / 維多利亞港 / 美麗的 / 有': '香港有美麗的維多利亞港',
        '圖書館 / 書 / 很多 / 裏面 / 有': '圖書館裏面有很多書',
        '妹妹 / 鋼琴 / 每天 / 彈': '妹妹每天彈鋼琴',
      };
      return ans[v.words];
    },
    distractors: (v) => {
      const d = {
        '香港 / 維多利亞港 / 美麗的 / 有': ['維多利亞港有美麗的香港', '美麗的香港有維多利亞港', '有美麗的維多利亞港香港'],
        '圖書館 / 書 / 很多 / 裏面 / 有': ['很多書圖書館裏面有', '裏面圖書館有很多書', '書圖書館裏面有很多'],
        '妹妹 / 鋼琴 / 每天 / 彈': ['鋼琴妹妹每天彈', '每天彈妹妹鋼琴', '彈鋼琴每天妹妹'],
      };
      return d[v.words];
    },
    distractorLabels: ['語序錯誤', '語序錯誤', '語序錯誤'],
  },
  {
    id: 'P3-READCOMP-001', genre: 'reading-comp', grade: 'p3', edbCodes: ['CL3-4.1'], difficulty: 3,
    patternFn: () => {
      const passages = [
        {
          passage: '端午節是中國的傳統節日。每年農曆五月初五，人們會吃粽子和賽龍舟。據說這個節日是為了紀念古代詩人屈原。屈原是一個愛國的詩人，他為了國家投江自盡。人們為了不讓魚吃掉他的身體，就用粽子投入江中餵魚。',
          question: '人們為甚麼要投入粽子到江中？',
          answer: '為了不讓魚吃掉屈原的身體',
          distractors: ['因為粽子很好吃', '為了讓魚長大', '為了慶祝節日'],
        },
        {
          passage: '香港的交通非常方便。我們可以坐地鐵、巴士、小巴或渡輪去不同的地方。地鐵是最多人使用的交通工具，因為它又快又準時。如果要過海，可以坐地鐵或天星小輪。天星小輪是香港的特色交通工具，已經服務市民超過一百年。',
          question: '哪種交通工具服務市民超過一百年？',
          answer: '天星小輪',
          distractors: ['地鐵', '巴士', '小巴'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // P4 (四年級) — 詞語運用
  // ============================
  {
    id: 'P4-SIMPTO-TRAD-001', genre: 'simp-to-trad', grade: 'p4', edbCodes: ['CL4-1.1'], difficulty: 2,
    pattern: '簡體字「{simp}」的繁體字是？',
    variables: {
      simp: ['书', '买', '东', '见', '来', '马', '鱼', '鸟'],
    },
    answer: (v) => {
      const a = { '书': '書', '买': '買', '东': '東', '见': '見', '来': '來', '马': '馬', '鱼': '魚', '鸟': '鳥' };
      return a[v.simp];
    },
    distractors: (v) => {
      const d = {
        '书': ['晝', '盡', '畫'],
        '买': ['賣', '頭', '實'],
        '东': ['棟', '陳', '凍'],
        '见': ['貝', '頁', '現'],
        '来': ['米', '未', '束'],
        '马': ['與', '駕', '馮'],
        '鱼': ['魯', '鮮', '漁'],
        '鸟': ['烏', '雞', '鳴'],
      };
      return d[v.simp];
    },
    distractorLabels: ['形近字錯誤', '形近字錯誤', '形近字錯誤'],
  },
  {
    id: 'P4-STROKE-001', genre: 'stroke-count', grade: 'p4', edbCodes: ['CL4-1.2'], difficulty: 3,
    pattern: '「{char}」字有多少筆畫？',
    variables: {
      char: ['龍', '鑰', '廳', '麗', '嚴'],
    },
    answer: (v) => {
      const s = { '龍': 16, '鑰': 25, '廳': 25, '麗': 19, '嚴': 20 };
      return s[v.char];
    },
    distractors: (v) => {
      const s = { '龍': 16, '鑰': 25, '廳': 25, '麗': 19, '嚴': 20 };
      const c = s[v.char];
      return [c + 1, c - 1, c + 2];
    },
    distractorLabels: ['多數一筆', '少數一筆', '多數兩筆'],
  },
  {
    id: 'P4-RADICAL-001', genre: 'radical-match', grade: 'p4', edbCodes: ['CL4-1.3'], difficulty: 3,
    pattern: '以下哪個字和「{target}」的部首相同？',
    variables: {
      target: ['語', '銀', '遠', '清'],
    },
    answer: (v) => {
      const a = { '語': '話', '銀': '鏡', '遠': '近', '清': '河' };
      return a[v.target];
    },
    distractors: (v) => {
      const d = {
        '語': ['金', '走', '水'],
        '銀': ['言', '走', '水'],
        '遠': ['言', '金', '水'],
        '清': ['言', '金', '走'],
      };
      return d[v.target];
    },
    distractorLabels: ['不同部首', '不同部首', '不同部首'],
  },
  {
    id: 'P4-WORDFORM-001', genre: 'word-formation', grade: 'p4', edbCodes: ['CL4-2.1'], difficulty: 3,
    pattern: '以下哪個詞語使用正確？\n「{sentence}」',
    variables: {
      sentence: ['他的成績很____，老師都讚他。', '小明____地完成了作業。', '這件事讓我感到很____。'],
    },
    answer: (v) => {
      const a = {
        '他的成績很____，老師都讚他。': '優秀',
        '小明____地完成了作業。': '認真',
        '這件事讓我感到很____。': '驚訝',
      };
      return a[v.sentence];
    },
    distractors: (v) => {
      const d = {
        '他的成績很____，老師都讚他。': ['糟糕', '普通', '馬虎'],
        '小明____地完成了作業。': ['隨便', '懶惰', '粗心'],
        '這件事讓我感到很____。': ['平常', '無聊', '冷淡'],
      };
      return d[v.sentence];
    },
    distractorLabels: ['不合語境', '不合語境', '不合語境'],
  },
  {
    id: 'P4-SYNONYM-001', genre: 'synonym-antonym', grade: 'p4', edbCodes: ['CL4-2.2'], difficulty: 3,
    pattern: '以下哪組詞語全部都是同義詞？',
    variables: {},
    answer: () => '巨大—龐大—宏大',
    distractors: () => ['高興—快樂—傷心', '美麗—漂亮—醜陋', '安靜—寧靜—吵鬧'],
    distractorLabels: ['混入反義詞', '混入反義詞', '混入反義詞'],
  },
  {
    id: 'P4-MEASURE-001', genre: 'measure-word', grade: 'p4', edbCodes: ['CL4-2.3'], difficulty: 3,
    pattern: '以下哪個量詞使用不正確？',
    variables: {},
    answer: () => '一「條」人',
    distractors: () => ['一「本」書', '一「張」紙', '一「隻」貓'],
    distractorLabels: ['用法正確', '用法正確', '用法正確'],
  },
  {
    id: 'P4-PUNCT-0001', genre: 'punctuation', grade: 'p4', edbCodes: ['CL4-3.1'], difficulty: 3,
    pattern: '以下句子的標點符號，哪個用法正確？',
    variables: {},
    answer: () => '老師問：「你做完功課了嗎？」',
    distractors: () => ['老師問「你做完功課了嗎」。', '老師問：「你做完功課了嗎」。', '老師問，「你做完功課了嗎？」'],
    distractorLabels: ['引號位置錯誤', '句號應在引號內', '應用冒號'],
  },
  {
    id: 'P4-IDIOM-001', genre: 'idiom', grade: 'p4', edbCodes: ['CL4-3.2'], difficulty: 3,
    pattern: '哪個成語形容「不勞而獲」？',
    variables: {},
    answer: () => '守株待兔',
    distractors: () => ['亡羊補牢', '畫蛇添足', '杯弓蛇影'],
    distractorLabels: ['意思不同', '意思不同', '意思不同'],
  },
  {
    id: 'P4-SENT-ORDER-001', genre: 'sentence-order', grade: 'p4', edbCodes: ['CL4-3.3'], difficulty: 3,
    pattern: '把以下句子排列成一段通順的短文：\n{sentences}',
    variables: {
      sentences: ['(A) 他決定每天練習一小時 (B) 小明想學好英文 (C) 半年後，他的英文進步了很多 (D) 於是他報了英文班'],
    },
    answer: () => 'B→D→A→C',
    distractors: () => ['A→B→C→D', 'B→A→D→C', 'D→B→A→C'],
    distractorLabels: ['邏輯順序錯誤', '順序錯誤', '順序錯誤'],
  },
  {
    id: 'P4-READCOMP-001', genre: 'reading-comp', grade: 'p4', edbCodes: ['CL4-4.1'], difficulty: 3,
    patternFn: () => {
      const passages = [
        {
          passage: '維多利亞港是香港最有名的景點之一。每天晚上八點，兩岸的高樓大廈會亮起燈光，上演「幻彩詠香江」燈光音樂表演。這個表演已經被列入健力士世界紀錄，成為全球最大型的燈光音樂表演。不少遊客專程來香港觀看這個精彩的表演。',
          question: '「幻彩詠香江」在甚麼時候表演？',
          answer: '每天晚上八點',
          distractors: ['每天早上八點', '每天下午三點', '每逢星期六晚上'],
        },
        {
          passage: '大熊貓是中國的國寶。牠們主要住在四川的山區，喜歡吃竹子。由於環境破壞和氣候變化，大熊貓的數量越來越少。為了保護大熊貓，中國設立了很多自然保護區。香港海洋公園也曾經飼養過大熊貓，吸引了很多市民和遊客參觀。',
          question: '大熊貓喜歡吃甚麼？',
          answer: '竹子',
          distractors: ['樹葉', '水果', '魚'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // P5 (五年級) — 理解與應用
  // ============================
  {
    id: 'P5-SIMPTO-TRAD-001', genre: 'simp-to-trad', grade: 'p5', edbCodes: ['CL5-1.1'], difficulty: 3,
    pattern: '簡體字「{simp}」的繁體字是？',
    variables: {
      simp: ['关', '还', '从', '为', '么', '发', '对', '会'],
    },
    answer: (v) => {
      const a = { '关': '關', '还': '還', '从': '從', '为': '為', '么': '麼', '发': '發', '对': '對', '会': '會' };
      return a[v.simp];
    },
    distractors: (v) => {
      const d = {
        '关': ['開', '閉', '閘'],
        '还': ['遠', '近', '達'],
        '从': ['以', '比', '北'],
        '为': ['力', '辦', '勸'],
        '么': ['公', '去', '參'],
        '发': ['友', '反', '取'],
        '对': ['時', '樹', '導'],
        '会': ['曾', '合', '令'],
      };
      return d[v.simp];
    },
    distractorLabels: ['形近字錯誤', '形近字錯誤', '形近字錯誤'],
  },
  {
    id: 'P5-STROKE-001', genre: 'stroke-count', grade: 'p5', edbCodes: ['CL5-1.2'], difficulty: 3,
    pattern: '「{char}」字的正確筆畫數是？',
    variables: {
      char: ['龜', '鬱', '鹽', '鷹', '豔'],
    },
    answer: (v) => {
      const s = { '龜': 16, '鬱': 29, '鹽': 24, '鷹': 24, '豔': 28 };
      return s[v.char];
    },
    distractors: (v) => {
      const s = { '龜': 16, '鬱': 29, '鹽': 24, '鷹': 24, '豔': 28 };
      const c = s[v.char];
      return [c + 1, c - 1, c + 3];
    },
    distractorLabels: ['多數一筆', '少數一筆', '多數三筆'],
  },
  {
    id: 'P5-RADICAL-001', genre: 'radical-match', grade: 'p5', edbCodes: ['CL5-1.3'], difficulty: 3,
    pattern: '以下哪個字的部首和其他三個不同？',
    variables: {},
    answer: () => '銅',
    distractors: () => ['跑', '跳', '踢'],
    distractorLabels: ['足字旁', '足字旁', '足字旁'],
  },
  {
    id: 'P5-WORDFORM-001', genre: 'word-formation', grade: 'p5', edbCodes: ['CL5-2.1'], difficulty: 3,
    pattern: '以下哪個句子中的詞語使用正確？',
    variables: {},
    answer: () => '他做事很認真，從不馬虎。',
    distractors: () => ['他做事很馬虎，從不認真地檢查。', '這道題目很簡單，小明答錯了，真是聰明。', '他非常勇敢，看到蟲子就大叫。'],
    distractorLabels: ['語境矛盾', '語境矛盾', '語境矛盾'],
  },
  {
    id: 'P5-SYNONYM-001', genre: 'synonym-antonym', grade: 'p5', edbCodes: ['CL5-2.2'], difficulty: 4,
    pattern: '「{word}」這個詞語最恰當的同義詞是？',
    variables: {
      word: ['五光十色', '千方百計', '興高采烈', '一絲不苟'],
    },
    answer: (v) => {
      const a = { '五光十色': '色彩斑斕', '千方百計': '想方設法', '興高采烈': '歡天喜地', '一絲不苟': '小心翼翼' };
      return a[v.word];
    },
    distractors: (v) => {
      const d = {
        '五光十色': ['一片漆黑', '平平無奇', '單調乏味'],
        '千方百計': ['無計可施', '束手無策', '無能為力'],
        '興高采烈': ['愁眉苦臉', '垂頭喪氣', '悶悶不樂'],
        '一絲不苟': ['粗心大意', '馬馬虎虎', '敷衍了事'],
      };
      return d[v.word];
    },
    distractorLabels: ['這是反義詞', '這是反義詞', '這是反義詞'],
  },
  {
    id: 'P5-MEASURE-001', genre: 'measure-word', grade: 'p5', edbCodes: ['CL5-2.3'], difficulty: 3,
    pattern: '「一（{blank}）{noun}」，括號內應填哪個量詞？',
    variables: {
      noun: ['駱駝', '輪船', '序言', '清泉'],
    },
    answer: (v) => {
      const mw = { '駱駝': '匹', '輪船': '艘', '序言': '篇', '清泉': '泓' };
      return mw[v.noun];
    },
    distractors: (v) => {
      const d = {
        '駱駝': ['隻', '頭', '條'],
        '輪船': ['隻', '條', '架'],
        '序言': ['本', '條', '個'],
        '清泉': ['條', '股', '個'],
      };
      return d[v.noun];
    },
    distractorLabels: ['量詞錯誤', '量詞錯誤', '量詞錯誤'],
  },
  {
    id: 'P5-PUNCT-001', genre: 'punctuation', grade: 'p5', edbCodes: ['CL5-3.1'], difficulty: 4,
    pattern: '以下句子應填入哪種標點符號？\n「他帶來了三樣東西{blank}書、筆和紙」',
    variables: {},
    answer: () => '冒號（：）',
    distractors: () => ['逗號（，）', '句號（。）', '問號（？）'],
    distractorLabels: ['應用冒號', '不是句號', '不是問句'],
  },
  {
    id: 'P5-IDIOM-001', genre: 'idiom', grade: 'p5', edbCodes: ['CL5-3.2'], difficulty: 4,
    pattern: '以下哪個成語的解釋正確？',
    variables: {},
    answer: () => '「亡羊補牢」— 出了問題後及時補救',
    distractors: () => ['「守株待兔」— 努力工作就有收穫', '「畫蛇添足」— 做事要精益求精', '「杯弓蛇影」— 眼力很好'],
    distractorLabels: ['解釋錯誤', '解釋錯誤', '解釋錯誤'],
  },
  {
    id: 'P5-SENT-ORDER-001', genre: 'sentence-order', grade: 'p5', edbCodes: ['CL5-3.3'], difficulty: 4,
    pattern: '把以下句子排列成一段通順的短文：\n{sentences}',
    variables: {
      sentences: ['(A) 於是他在田邊等了一整天 (B) 古時候有個農夫 (C) 結果甚麼也沒等到 (D) 他看見一隻兔子撞到樹樁上死了 (E) 從此他不再耕田，每天守在樹樁旁'],
    },
    answer: () => 'B→D→A→E→C',
    distractors: () => ['A→B→C→D→E', 'B→A→D→C→E', 'D→B→A→E→C'],
    distractorLabels: ['邏輯錯誤', '順序錯誤', '順序錯誤'],
  },
  {
    id: 'P5-READCOMP-001', genre: 'reading-comp', grade: 'p5', edbCodes: ['CL5-4.1'], difficulty: 4,
    patternFn: () => {
      const passages = [
        {
          passage: '垃圾分類是保護環境的重要方法。在香港，市民應該把垃圾分為四類：廢紙、金屬、塑膠和玻璃。把可回收物品分開處理，可以減少堆填區的壓力，也能節省資源。然而，根據調查，香港的回收率仍然偏低，只有大約百分之三十。政府正積極推廣垃圾分類，希望市民能夠養成回收的習慣。',
          question: '根據短文，香港的回收率大約是多少？',
          answer: '百分之三十',
          distractors: ['百分之五十', '百分之七十', '百分之九十'],
        },
        {
          passage: '蜻蜓是一種常見的昆蟲。牠們有兩對透明的翅膀和一對大眼睛。蜻蜓可以在空中懸停和倒退飛行，飛行技術非常高超。蜻蜓的幼蟲生活在水中，以小魚和蝌蚪為食物。蜻蜓對人類有益，因為牠們會捕食蚊子等害蟲。',
          question: '蜻蜓的幼蟲住在哪裏？',
          answer: '水中',
          distractors: ['樹上', '地上', '空中'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // P6 (六年級) — 進階運用
  // ============================
  {
    id: 'P6-SIMPTO-TRAD-001', genre: 'simp-to-trad', grade: 'p6', edbCodes: ['CL6-1.1'], difficulty: 3,
    pattern: '簡體字「{simp}」的繁體字是？',
    variables: {
      simp: ['盐', '鲜', '面', '钟', '园', '馆', '铁', '网'],
    },
    answer: (v) => {
      const a = { '盐': '鹽', '鲜': '鮮', '面': '麵', '钟': '鐘', '园': '園', '馆': '館', '铁': '鐵', '网': '網' };
      return a[v.simp];
    },
    distractors: (v) => {
      const d = {
        '盐': ['監', '盜', '盞'],
        '鲜': ['魚', '鯉', '鯊'],
        '面': ['而', '回', '向'],
        '钟': ['種', '衝', '衝'],
        '园': ['圓', '圖', '國'],
        '馆': ['官', '管', '營'],
        '铁': ['銅', '銀', '鋼'],
        '网': ['岡', '內', '兩'],
      };
      return d[v.simp];
    },
    distractorLabels: ['形近字錯誤', '形近字錯誤', '形近字錯誤'],
  },
  {
    id: 'P6-RADICAL-001', genre: 'radical-match', grade: 'p6', edbCodes: ['CL6-1.2'], difficulty: 4,
    pattern: '以下哪組字的部首全部相同？',
    variables: {},
    answer: () => '江、河、湖、海',
    distractors: () => ['花、草、荷、藍', '說、話、跑、語', '明、晴、時、燈'],
    distractorLabels: ['「藍」是草字頭', '「跑」是足字旁', '「燈」是火字旁'],
  },
  {
    id: 'P6-WORDFORM-001', genre: 'word-formation', grade: 'p6', edbCodes: ['CL6-2.1'], difficulty: 4,
    pattern: '以下哪個句子中畫線的詞語使用不正確？',
    variables: {},
    answer: () => '他的作文寫得「栩栩如生」，老師給了他滿分。（用於描寫文章生動）',
    distractors: () => [
      '他「津津有味」地吃着雪糕。',
      '妹妹「興高采烈」地拆開生日禮物。',
      '這幅畫「五彩繽紛」，非常漂亮。',
    ],
    distractorLabels: ['用法正確', '用法正確', '用法正確'],
  },
  {
    id: 'P6-SYNONYM-001', genre: 'synonym-antonym', grade: 'p6', edbCodes: ['CL6-2.2'], difficulty: 4,
    pattern: '以下哪組詞語不是同義詞？',
    variables: {},
    answer: () => '快樂—悲傷',
    distractors: () => ['巨大—龐大', '美麗—漂亮', '迅速—快速'],
    distractorLabels: ['是同義詞', '是同義詞', '是同義詞'],
  },
  {
    id: 'P6-ANTONYM-001', genre: 'synonym-antonym', grade: 'p6', edbCodes: ['CL6-2.2'], difficulty: 4,
    pattern: '以下哪組詞語不是反義詞？',
    variables: {},
    answer: () => '高興—快樂',
    distractors: () => ['光明—黑暗', '勤勞—懶惰', '謙虛—驕傲'],
    distractorLabels: ['是反義詞', '是反義詞', '是反義詞'],
  },
  {
    id: 'P6-MEASURE-001', genre: 'measure-word', grade: 'p6', edbCodes: ['CL6-2.3'], difficulty: 4,
    pattern: '以下哪個量詞和名詞的配對不正確？',
    variables: {},
    answer: () => '一「座」歌曲',
    distractors: () => ['一「首」歌曲', '一「幅」畫', '一「棟」大樓'],
    distractorLabels: ['配對正確', '配對正確', '配對正確'],
  },
  {
    id: 'P6-PUNCT-001', genre: 'punctuation', grade: 'p6', edbCodes: ['CL6-3.1'], difficulty: 4,
    pattern: '以下哪個句子的標點符號使用正確？',
    variables: {},
    answer: () => '「你好嗎？」他問道。',
    distractors: () => ['「你好嗎」？他問道。', '你好嗎？他問道', '「你好嗎」他問道？'],
    distractorLabels: ['問號應在引號內', '缺少引號', '句號不應改為問號'],
  },
  {
    id: 'P6-IDIOM-001', genre: 'idiom', grade: 'p6', edbCodes: ['CL6-3.2'], difficulty: 4,
    pattern: '以下哪個成語用在句子中最恰當？\n「他做事總是____，從來不會半途放棄。」',
    variables: {},
    answer: () => '堅持不懈',
    distractors: () => ['半途而廢', '虎頭蛇尾', '三心兩意'],
    distractorLabels: ['意思相反', '意思相反', '意思相反'],
  },
  {
    id: 'P6-SENT-ORDER-001', genre: 'sentence-order', grade: 'p6', edbCodes: ['CL6-3.3'], difficulty: 4,
    pattern: '把以下段落重新排序：\n{sentences}',
    variables: {
      sentences: ['(A) 因此我們應該珍惜水資源 (B) 水是生命之源 (C) 然而全球正面臨水資源短缺的問題 (D) 沒有水，地球上就不會有生命'],
    },
    answer: () => 'B→D→C→A',
    distractors: () => ['A→B→C→D', 'B→C→D→A', 'C→B→D→A'],
    distractorLabels: ['邏輯錯誤', '順序錯誤', '順序錯誤'],
  },
  {
    id: 'P6-READCOMP-001', genre: 'reading-comp', grade: 'p6', edbCodes: ['CL6-4.1'], difficulty: 4,
    patternFn: () => {
      const passages = [
        {
          passage: '近年來，人工智能技術發展迅速。人工智能可以幫助醫生診斷疾病，幫助老師為學生制定個人化的學習計劃，也可以幫助城市管理者優化交通流量。然而，人工智能也帶來了一些問題。例如，有些工作可能會被機器取代，令部分工人失業。此外，人工智能的安全性和私隱問題也引起了社會的關注。如何在享受科技便利的同時保障人類的利益，是一個值得深思的問題。',
          question: '根據短文，人工智能帶來了哪方面的問題？',
          answer: '就業和私隱問題',
          distractors: ['只影響醫療行業', '令電腦速度變慢', '使天氣變得更差'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // F1 (中一) — 文章理解與分析
  // ============================
  {
    id: 'F1-SIMPTO-TRAD-001', genre: 'simp-to-trad', grade: 'f1', edbCodes: ['CLF1-1.1'], difficulty: 4,
    pattern: '以下哪組簡繁體字配對正確？',
    variables: {},
    answer: () => '学→學、习→習',
    distractors: () => ['发→發、发→髮（同字不同義）', '干→幹、干→乾（同字不同義）', '后→后、後→後（部分錯誤）'],
    distractorLabels: ['一字多義', '一字多義', '配對不完整'],
  },
  {
    id: 'F1-RADICAL-001', genre: 'radical-match', grade: 'f1', edbCodes: ['CLF1-1.2'], difficulty: 4,
    pattern: '「{char}」字的部首是？',
    variables: {
      char: ['贏', '購', '蹤', '辯'],
    },
    answer: (v) => {
      const a = { '贏': '貝', '購': '貝', '蹤': '足', '辯': '辛' };
      return a[v.char];
    },
    distractors: (v) => {
      const d = {
        '贏': ['月', '凡', '女'],
        '購': ['言', '口', '手'],
        '蹤': ['辵', '走', '彳'],
        '辯': ['言', '刀', '口'],
      };
      return d[v.char];
    },
    distractorLabels: ['部首錯誤', '部首錯誤', '部首錯誤'],
  },
  {
    id: 'F1-WORDFORM-001', genre: 'word-formation', grade: 'f1', edbCodes: ['CLF1-2.1'], difficulty: 4,
    pattern: '以下哪個句子使用了「擬人」修辭手法？',
    variables: {},
    answer: () => '風兒輕輕地唱着歌，走過了山崗。',
    distractors: () => [
      '他的眼睛像星星一樣明亮。',
      '操場上的人像螞蟻一樣多。',
      '這本書好比一扇窗，讓我看到外面的世界。',
    ],
    distractorLabels: ['這是比喻（明喻）', '這是比喻（明喻）', '這是比喻（明喻）'],
  },
  {
    id: 'F1-SYNONYM-001', genre: 'synonym-antonym', grade: 'f1', edbCodes: ['CLF1-2.2'], difficulty: 4,
    pattern: '以下哪個詞語和「{word}」意思最相近？',
    variables: {
      word: ['持之以恆', '恍然大悟', '栩栩如生'],
    },
    answer: (v) => {
      const a = { '持之以恆': '堅持不懈', '恍然大悟': '茅塞頓開', '栩栩如生': '活靈活現' };
      return a[v.word];
    },
    distractors: (v) => {
      const d = {
        '持之以恆': ['半途而廢', '三心兩意', '虎頭蛇尾'],
        '恍然大悟': ['一知半解', '迷惑不解', '百思不解'],
        '栩栩如生': ['死氣沉沉', '呆若木雞', '毫無生氣'],
      };
      return d[v.word];
    },
    distractorLabels: ['這是反義詞', '這是反義詞', '這是反義詞'],
  },
  {
    id: 'F1-IDIOM-001', genre: 'idiom', grade: 'f1', edbCodes: ['CLF1-3.1'], difficulty: 4,
    pattern: '以下哪個成語可以用來形容「在困難中找到希望」？',
    variables: {},
    answer: () => '柳暗花明',
    distractors: () => ['山窮水盡', '走投無路', '四面楚歌'],
    distractorLabels: ['意思相反', '意思相反', '意思相反'],
  },
  {
    id: 'F1-PUNCT-001', genre: 'punctuation', grade: 'f1', edbCodes: ['CLF1-3.2'], difficulty: 4,
    pattern: '以下句子中的分號（；）使用正確的是？',
    variables: {},
    answer: () => '他喜歡打籃球；她喜歡游泳。',
    distractors: () => [
      '他去過北京；上海和廣州。',
      '因為下雨了；所以我們取消了活動。',
      '老師說：「你們要努力學習」；。',
    ],
    distractorLabels: ['應用頓號', '應用逗號', '標點重複'],
  },
  {
    id: 'F1-MEASURE-001', genre: 'measure-word', grade: 'f1', edbCodes: ['CLF1-2.3'], difficulty: 4,
    pattern: '以下哪個量詞的用法屬於「借用名詞作量詞」？',
    variables: {},
    answer: () => '一「身」汗',
    distractors: () => ['一「本」書', '一「條」河', '一「張」紙'],
    distractorLabels: ['專用量詞', '專用量詞', '專用量詞'],
  },
  {
    id: 'F1-SENT-ORDER-001', genre: 'sentence-order', grade: 'f1', edbCodes: ['CLF1-3.3'], difficulty: 4,
    pattern: '把以下段落重新排序，使之成為一篇結構完整的短文：\n{sentences}',
    variables: {
      sentences: ['(A) 最後，他終於在比賽中獲得了冠軍 (B) 這告訴我們，努力是不會白費的 (C) 小華從小就熱愛跑步 (D) 即使受傷了，他也不放棄訓練 (E) 他每天早上五點就起牀練習'],
    },
    answer: () => 'C→E→D→A→B',
    distractors: () => ['A→B→C→D→E', 'C→A→E→D→B', 'E→C→D→A→B'],
    distractorLabels: ['邏輯錯誤', '順序錯誤', '順序錯誤'],
  },
  {
    id: 'F1-READCOMP-001', genre: 'reading-comp', grade: 'f1', edbCodes: ['CLF1-4.1'], difficulty: 4,
    patternFn: () => {
      const passages = [
        {
          passage: '竹子是一種生長速度極快的植物。在適宜的環境下，有些品種一天可以長近一米。竹子的用途非常廣泛：可以做成家具、樂器、紙張，甚至可以食用。在中國文化中，竹子象徵着堅韌和謙虛，因為它雖然是空心的，卻能抵擋風雨而不折斷。古人常以竹子比喻君子的品格。',
          question: '根據短文，竹子在中國文化中象徵甚麼？',
          answer: '堅韌和謙虛',
          distractors: ['財富和權力', '速度和力量', '智慧和勇敢'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // F2 (中二) — 深層理解
  // ============================
  {
    id: 'F2-SIMPTO-TRAD-001', genre: 'simp-to-trad', grade: 'f2', edbCodes: ['CLF2-1.1'], difficulty: 4,
    pattern: '以下哪組簡繁字在兩地中用法有差異？',
    variables: {},
    answer: () => '「質量」（內地=quality，香港=mass）',
    distractors: () => [
      '「學校」（兩地意思相同）',
      '「老師」（兩地意思相同）',
      '「學生」（兩地意思相同）',
    ],
    distractorLabels: ['意思相同', '意思相同', '意思相同'],
  },
  {
    id: 'F2-WORDFORM-001', genre: 'word-formation', grade: 'f2', edbCodes: ['CLF2-2.1'], difficulty: 5,
    pattern: '以下哪個句子使用了「排比」修辭手法？',
    variables: {},
    answer: () => '讀書使人充實，討論使人機智，寫作使人準確。',
    distractors: () => [
      '月亮像一個大圓盤掛在天空。',
      '他的心像刀割一樣痛。',
      '春天來了，花兒都笑了。',
    ],
    distractorLabels: ['這是比喻', '這是比喻', '這是擬人'],
  },
  {
    id: 'F2-SYNONYM-001', genre: 'synonym-antonym', grade: 'f2', edbCodes: ['CLF2-2.2'], difficulty: 5,
    pattern: '以下哪組詞語雖然意思相近，但感情色彩不同？',
    variables: {},
    answer: () => '「頑強」和「頑固」',
    distractors: () => [
      '「美麗」和「漂亮」',
      '「巨大」和「龐大」',
      '「快速」和「迅速」',
    ],
    distractorLabels: ['感情色彩相同', '感情色彩相同', '感情色彩相同'],
  },
  {
    id: 'F2-IDIOM-001', genre: 'idiom', grade: 'f2', edbCodes: ['CLF2-3.1'], difficulty: 5,
    pattern: '以下哪個成語來自歷史故事？',
    variables: {},
    answer: () => '「完璧歸趙」',
    distractors: () => ['「一石二鳥」', '「龍飛鳳舞」', '「花紅柳綠」'],
    distractorLabels: ['來自生活經驗', '來自自然觀察', '來自自然觀察'],
  },
  {
    id: 'F2-PUNCT-001', genre: 'punctuation', grade: 'f2', edbCodes: ['CLF2-3.2'], difficulty: 5,
    pattern: '以下哪個句子的書名號使用正確？',
    variables: {},
    answer: () => '我最喜歡的課外書是《小王子》。',
    distractors: () => [
      '我最喜歡的課外書是「小王子」。',
      '我最喜歡的課外書是《小王子》和《哈利波特》。',
      '我最喜歡的課外書是《小王子。》',
    ],
    distractorLabels: ['應用書名號', '書名號內不應用頓號', '句號應在書名號外'],
  },
  {
    id: 'F2-MEASURE-001', genre: 'measure-word', grade: 'f2', edbCodes: ['CLF2-2.3'], difficulty: 5,
    pattern: '以下哪個句子中的量詞使用有誤？',
    variables: {},
    answer: () => '一「個」風景',
    distractors: () => ['一「幅」畫', '一「首」詩', '一「輪」明月'],
    distractorLabels: ['用法正確', '用法正確', '用法正確'],
  },
  {
    id: 'F2-RADICAL-001', genre: 'radical-match', grade: 'f2', edbCodes: ['CLF2-1.2'], difficulty: 5,
    pattern: '「穎」字的部首是？',
    variables: {},
    answer: () => '禾',
    distractors: () => ['頁', '匕', '木'],
    distractorLabels: ['這是聲旁', '這是部件', '這是部件'],
  },
  {
    id: 'F2-SENT-ORDER-001', genre: 'sentence-order', grade: 'f2', edbCodes: ['CLF2-3.3'], difficulty: 5,
    pattern: '把以下段落重新排序：\n{sentences}',
    variables: {
      sentences: ['(A) 可是隨着城市發展，很多老店都結業了 (B) 香港有不少老字號的店鋪 (C) 政府近年開始推動保育工作 (D) 它們見證了香港的變遷 (E) 希望能保留這些珍貴的文化遺產'],
    },
    answer: () => 'B→D→A→C→E',
    distractors: () => ['A→B→C→D→E', 'B→A→D→C→E', 'C→B→D→A→E'],
    distractorLabels: ['邏輯錯誤', '順序錯誤', '順序錯誤'],
  },
  {
    id: 'F2-READCOMP-001', genre: 'reading-comp', grade: 'f2', edbCodes: ['CLF2-4.1'], difficulty: 5,
    patternFn: () => {
      const passages = [
        {
          passage: '香港的「劏房」問題一直備受關注。所謂劏房，就是把一個住宅單位分隔成多個小房間出租。有些劏房的面積只有幾十平方呎，住戶連轉身都困難。根據統計，香港有超過二十萬人住在劏房之中。造成劏房問題的原因有很多：私人樓價高企、公屋供應不足、以及收入差距擴大等。要解決這個問題，需要政府和社會各界共同努力。',
          question: '作者認為解決劏房問題需要甚麼？',
          answer: '政府和社會各界共同努力',
          distractors: ['增加劏房數量', '降低租金管制', '限制人口增長'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },

  // ============================
  // F3 (中三) — 批判思考
  // ============================
  {
    id: 'F3-SIMPTO-TRAD-001', genre: 'simp-to-trad', grade: 'f3', edbCodes: ['CLF3-1.1'], difficulty: 5,
    pattern: '以下哪個說法關於簡繁體字是正確的？',
    variables: {},
    answer: () => '有些簡體字對應多個繁體字，需要根據語境判斷',
    distractors: () => [
      '所有簡體字都只對應一個繁體字',
      '簡體字都是從繁體字隨意簡化而來',
      '繁體字比簡體字多出幾千個字',
    ],
    distractorLabels: ['說法過於絕對', '不是隨意簡化', '數量差異沒那麼大'],
  },
  {
    id: 'F3-WORDFORM-001', genre: 'word-formation', grade: 'f3', edbCodes: ['CLF3-2.1'], difficulty: 5,
    pattern: '以下哪個句子使用了「反語」修辭手法？',
    variables: {},
    answer: () => '你可真「聰明」啊，連這麼簡單的題目都做錯了。',
    distractors: () => [
      '他跑得像風一樣快。',
      '書籍是人類進步的階梯。',
      '這朵花真美，像天上的雲。',
    ],
    distractorLabels: ['這是明喻', '這是暗喻', '這是明喻'],
  },
  {
    id: 'F3-SYNONYM-001', genre: 'synonym-antonym', grade: 'f3', edbCodes: ['CLF3-2.2'], difficulty: 5,
    pattern: '以下哪組詞語屬於「同音異義詞」？',
    variables: {},
    answer: () => '「公式」和「工事」',
    distractors: () => [
      '「高興」和「開心」',
      '「巨大」和「龐大」',
      '「安靜」和「寧靜」',
    ],
    distractorLabels: ['這是同義詞', '這是同義詞', '這是同義詞'],
  },
  {
    id: 'F3-IDIOM-001', genre: 'idiom', grade: 'f3', edbCodes: ['CLF3-3.1'], difficulty: 5,
    pattern: '以下哪個成語的出處和其他三個不同？',
    variables: {},
    answer: () => '「火中取栗」（出自法國寓言）',
    distractors: () => ['「守株待兔」', '「畫蛇添足」', '「亡羊補牢」'],
    distractorLabels: ['出自中國典故', '出自中國典故', '出自中國典故'],
  },
  {
    id: 'F3-PUNCT-001', genre: 'punctuation', grade: 'f3', edbCodes: ['CLF3-3.2'], difficulty: 5,
    pattern: '以下哪個句子中省略號（……）的用法正確？',
    variables: {},
    answer: () => '花園裏有玫瑰、百合、菊花……各種花卉。',
    distractors: () => [
      '他說……「我不同意。」',
      '你好……！',
      '今天天氣……很好。',
    ],
    distractorLabels: ['省略號不能用在引號前', '省略號不能與感嘆號連用', '省略號不能插入詞語中間'],
  },
  {
    id: 'F3-MEASURE-001', genre: 'measure-word', grade: 'f3', edbCodes: ['CLF3-2.3'], difficulty: 5,
    pattern: '以下哪個量詞組合體現了「量詞的感情色彩」？',
    variables: {},
    answer: () => '一「位」老師（表尊重）vs 一「個」人（中性）',
    distractors: () => [
      '一「本」書和一「本」雜誌',
      '一「條」河和一「條」路',
      '一「張」紙和一「張」桌',
    ],
    distractorLabels: ['用法相同', '用法相同', '用法相同'],
  },
  {
    id: 'F3-STROKE-001', genre: 'stroke-count', grade: 'f3', edbCodes: ['CLF3-1.2'], difficulty: 5,
    pattern: '「靄」字的部首和筆畫數分別是？',
    variables: {},
    answer: () => '部首是「雨」，共24畫',
    distractors: () => ['部首是「雨」，共20畫', '部首是「雲」，共24畫', '部首是「雨」，共22畫'],
    distractorLabels: ['筆畫數錯誤', '部首錯誤', '筆畫數錯誤'],
  },
  {
    id: 'F3-SENT-ORDER-001', genre: 'sentence-order', grade: 'f3', edbCodes: ['CLF3-3.3'], difficulty: 5,
    pattern: '把以下論證段落重新排序：\n{sentences}',
    variables: {
      sentences: ['(A) 因此，我們應該在中學階段就開始培養學生的理財意識 (B) 調查顯示，大部分年輕人缺乏基本的理財知識 (C) 這導致很多人成年後負債累累 (D) 理財能力是現代社會必備的技能之一'],
    },
    answer: () => 'D→B→C→A',
    distractors: () => ['A→B→C→D', 'B→D→C→A', 'D→C→B→A'],
    distractorLabels: ['邏輯錯誤', '順序錯誤', '順序錯誤'],
  },
  {
    id: 'F3-READCOMP-001', genre: 'reading-comp', grade: 'f3', edbCodes: ['CLF3-4.1'], difficulty: 5,
    patternFn: () => {
      const passages = [
        {
          passage: '社交媒體的興起改變了人們的溝通方式。一方面，它讓人們能夠即時分享資訊、保持聯繫，也為小企業提供了低成本的宣傳渠道。另一方面，社交媒體也帶來了不少問題：網絡霸凌、假新聞傳播、以及青少年過度使用手機等。有研究指出，每天使用社交媒體超過三小時的青少年，出現焦慮和抑鬱症狀的風險明顯較高。因此，如何善用社交媒體，是現代人需要學習的重要課題。',
          question: '作者對社交媒體持甚麼態度？',
          answer: '辯證看待，既看到好處也看到問題',
          distractors: ['完全支持', '完全反對', '漠不關心'],
        },
      ];
      const pick = passages[Math.floor(Math.random() * passages.length)];
      return {
        pattern: `閱讀以下短文，然後回答問題：\n「${pick.passage}」\n${pick.question}`,
        answer: pick.answer,
        distractors: pick.distractors,
      };
    },
    variables: {},
    distractorLabels: ['答案錯誤', '答案錯誤', '答案錯誤'],
  },
];

// 按年級獲取模板
export function getChineseTemplatesByGrade(grade) {
  return chineseTemplates.filter(t => t.grade === grade);
}

// 獲取所有涉及的年級
export function getChineseAvailableGrades() {
  return [...new Set(chineseTemplates.map(t => t.grade))].sort();
}

// 統計每個年級的模板數量
export function getChineseTemplateStats() {
  const stats = {};
  for (const t of chineseTemplates) {
    if (!stats[t.grade]) stats[t.grade] = { templates: 0, genres: new Set(), edbCodes: new Set() };
    stats[t.grade].templates++;
    stats[t.grade].genres.add(t.genre);
    stats[t.grade].edbCodes.add(t.edbCodes?.[0]);
  }
  const result = {};
  for (const [grade, s] of Object.entries(stats)) {
    result[grade] = { templates: s.templates, genres: [...s.genres], topics: s.edbCodes.size };
  }
  return result;
}
