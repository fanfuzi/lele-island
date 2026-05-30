// 粤语模板题库 — 按年级(小一~中三) × 知识点分类
// 每个模板: id, genre, grade, edbCodes, difficulty, patternFn, answer, distractors, distractorLabels, category

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ===== P1：基礎問候、數字時間、家庭稱呼、顏色動物、學校基本 =====

export const cantoneseTemplates = [

// ---------- P1 (小一) ----------
{
  id: 'CT-P1-01', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-1'], difficulty: 1,
  category: 'greeting',
  patternFn: () => {
    const qs = [
      { q: '「早上好」用粤語點講？', a: '早晨', d: ['午安', '晚安', '你好'], dl: ['午間問候', '晚間問候', '通用問候'] },
      { q: '「谢谢」用粤語點講？', a: '唔該', d: ['多謝', '對唔住', '冇關係'], dl: ['收到禮物時說', '道歉用語', '回應道歉'] },
      { q: '「对不起」用粤語點講？', a: '對唔住', d: ['唔該', '冇關係', '再見'], dl: ['感謝用語', '回應道歉', '告別用語'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P1-02', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-1'], difficulty: 1,
  category: 'greeting',
  patternFn: () => {
    const qs = [
      { q: '「再见」用粤語點講？', a: '再見', d: ['你好', '晚安', '聽日見'], dl: ['問候', '晚間', '明天見'] },
      { q: '「我是學生」用粤語點講？', a: '我係學生', d: '我唔係學生|我是學生|我係老師'.split('|'), dl: ['否定', '普通話', '身份不同'] },
      { q: '「你叫什么名字？」用粤語點講？', a: '你叫咩名？', d: ['你係邊個？', '你好嗎？', '你食咗未？'], dl: ['問身份', '問好', '問吃飯'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P1-03', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-2'], difficulty: 1,
  category: 'number',
  patternFn: () => {
    const qs = [
      { q: '「一」用粤語讀出嚟？', a: '一 (jat1)', d: ['二 (ji6)', '十 (sap6)', '三 (saam1)'], dl: ['二', '十', '三'] },
      { q: '「十」用粤語讀出嚟？', a: '十 (sap6)', d: ['七 (cat1)', '八 (baat3)', '九 (gau2)'], dl: ['七', '八', '九'] },
      { q: '「今日幾號？」用粤語點問？', a: '今日幾號？', d: ['今日星期幾？', '而家幾點？', '你幾歲？'], dl: ['問星期', '問時間', '問年齡'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P1-04', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-3'], difficulty: 1,
  category: 'family',
  patternFn: () => {
    const qs = [
      { q: '「爸爸」用粤語點講？', a: '爸爸 (baa4 baa1)', d: ['媽咪 (maa1 mi1)', '阿爺 (aa3 je4)', '阿嫲 (aa3 maa4)'], dl: ['媽媽', '爺爺', '嫲嫲'] },
      { q: '「奶奶（嫲嫲）」用粤語點講？', a: '阿嫲 (aa3 maa4)', d: ['婆婆 (po4 po2)', '媽咪 (maa1 mi1)', '家姐 (gaa1 ze1)'], dl: ['外婆', '媽媽', '姐姐'] },
      { q: '「哥哥」用粤語點講？', a: '哥哥 (go4 go1)', d: ['弟弟 (dai4 dai2)', '細佬 (sai3 lou2)', '家姐 (gaa1 ze1)'], dl: ['弟弟', '弟弟(口語)', '姐姐'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P1-05', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-4'], difficulty: 1,
  category: 'color',
  patternFn: () => {
    const qs = [
      { q: '「红色」用粤語點講？', a: '紅色 (hung4 sik1)', d: ['藍色 (laam4 sik1)', '綠色 (luk6 sik1)', '黃色 (wong4 sik1)'], dl: ['藍', '綠', '黃'] },
      { q: '「白色」用粤語點講？', a: '白色 (baak6 sik1)', d: ['黑色 (haak1 sik1)', '紅色 (hung4 sik1)', '灰色 (fui1 sik1)'], dl: ['黑', '紅', '灰'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P1-06', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-4'], difficulty: 1,
  category: 'animal',
  patternFn: () => {
    const qs = [
      { q: '「小猫」用粤語點講？', a: '貓仔 (maau1 zai2)', d: ['狗仔 (gau2 zai2)', '兔仔 (tou3 zai2)', '魚仔 (jyu4 zai2)'], dl: ['狗', '兔', '魚'] },
      { q: '「小狗」用粤語點講？', a: '狗仔 (gau2 zai2)', d: ['貓仔 (maau1 zai2)', '馬仔 (maa5 zai2)', '豬仔 (zyu1 zai2)'], dl: ['貓', '馬', '豬'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P1-07', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-5'], difficulty: 1,
  category: 'school',
  patternFn: () => {
    const qs = [
      { q: '「铅笔」用粤語點講？', a: '鉛筆 (jyun4 bat1)', d: ['原子筆 (jyun4 zi2 bat1)', '擦膠 (caat3 gaau1)', '尺 (cek3)'], dl: ['圓珠筆', '橡皮', '尺子'] },
      { q: '「书包」用粤語點講？', a: '書包 (syu1 baau1)', d: ['筆袋 (bat1 doi2)', '書枱 (syu1 toi4)', '校服 (haau3 fuk6)'], dl: ['筆袋', '書桌', '校服'] },
      { q: '「下课了」用粤語點講？', a: '落堂啦 (lok6 tong4 laa3)', d: ['上堂啦 (soeng5 tong4 laa3)', '放學啦 (fong3 hok6 laa3)', '返學啦 (faan2 hok6 laa3)'], dl: ['上課', '放學', '上學'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P1-08', genre: 'word-problem', grade: 'p1', edbCodes: ['CT1-6'], difficulty: 1,
  category: 'daily',
  patternFn: () => {
    const qs = [
      { q: '「巴士」用粤語講法係？', a: '巴士 (baa1 si2)', d: ['小巴 (siu2 baa1)', '的士 (dik1 si2)', '地鐵 (dei6 tit3)'], dl: ['小巴', '出租車', '地鐵'] },
      { q: '「回家」用粤語點講？', a: '返屋企 (faan2 nguk1 kei2)', d: ['出門 (ceot1 mun4)', '返學 (faan2 hok6)', '返工 (faan2 gung1)'], dl: ['出門', '上學', '上班'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- P2 (小二) ----------
{
  id: 'CT-P2-01', genre: 'word-problem', grade: 'p2', edbCodes: ['CT2-1'], difficulty: 2,
  category: 'daily',
  patternFn: () => {
    const qs = [
      { q: '「洗澡」用粤語點講？', a: '沖涼 (cung1 loeng4)', d: ['瞓覺 (fan3 gaau3)', '食飯 (sik6 faan6)', '洗面 (sai2 min6)'], dl: ['睡覺', '吃飯', '洗臉'] },
      { q: '「睡觉」用粤語點講？', a: '瞓覺 (fan3 gaau3)', d: ['起身 (hei2 san1)', '沖涼 (cung1 loeng4)', '休息 (jau1 sik1)'], dl: ['起床', '洗澡', '休息(書面語)'] },
      { q: '「起床」用粤語點講？', a: '起身 (hei2 san1)', d: ['瞓覺 (fan3 gaau3)', '出門 (ceot1 mun4)', '返工 (faan2 gung1)'], dl: ['睡覺', '出門', '上班'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P2-02', genre: 'word-problem', grade: 'p2', edbCodes: ['CT2-2'], difficulty: 2,
  category: 'food',
  patternFn: () => {
    const qs = [
      { q: '「吃饭」用粤語點講？', a: '食飯 (sik6 faan6)', d: ['飲茶 (jam2 caa4)', '食麵 (sik6 min6)', '飲水 (jam2 seoi2)'], dl: ['喝茶', '吃麵', '喝水'] },
      { q: '「喝水」用粤語點講？', a: '飲水 (jam2 seoi2)', d: ['食飯 (sik6 faan6)', '飲汽水 (jam2 hei3 seoi2)', '飲湯 (jam2 tong1)'], dl: ['吃飯', '喝汽水', '喝湯'] },
      { q: '「肚子饿了」用粤語點講？', a: '肚餓啦 (tou5 ngo2 laa1)', d: ['好飽啦 (hou2 baau2 laa1)', '口渴啦 (hau2 hot3 laa1)', '好攰啦 (hou2 gui6 laa1)'], dl: ['飽了', '口渴', '累了'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P2-03', genre: 'word-problem', grade: 'p2', edbCodes: ['CT2-3'], difficulty: 2,
  category: 'transport',
  patternFn: () => {
    const qs = [
      { q: '「坐地铁」用粤語點講？', a: '搭地鐵 (daap3 dei6 tit3)', d: ['坐巴士 (co5 baa1 si2)', '搭的士 (daap3 dik1 si2)', '踩單車 (caai2 daan1 ce1)'], dl: ['坐巴士', '搭出租車', '騎自行車'] },
      { q: '「红绿灯」用粤語點講？', a: '紅綠燈 (hung4 luk6 dang1)', d: ['斑馬線 (baan1 maa5 sin2)', '交通燈 (gaau1 tung1 dang1)', '行人路 (hang4 jan4 lou6)'], dl: ['斑馬線', '交通燈(正式)', '人行道'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P2-04', genre: 'word-problem', grade: 'p2', edbCodes: ['CT2-4'], difficulty: 2,
  category: 'shopping',
  patternFn: () => {
    const qs = [
      { q: '「多少钱？」用粤語點問？', a: '幾多錢？ (gei2 do1 cin2)', d: ['邊度買？', '貴唔貴？', '有冇平啲？'], dl: ['在哪買', '貴不貴', '有沒便宜點'] },
      { q: '「太贵了」用粤語點講？', a: '太貴啦 (taai3 gwai3 laa1)', d: ['好平啊 (hou2 peng4 aa3)', '幾多錢？', '我要買'], dl: ['很便宜', '多少錢', '我要買'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P2-05', genre: 'word-problem', grade: 'p2', edbCodes: ['CT2-5'], difficulty: 2,
  category: 'feeling',
  patternFn: () => {
    const qs = [
      { q: '「我很开心」用粤語點講？', a: '我好開心 (ngo5 hou2 hoi1 sam1)', d: '我好唔開心|我好嬲|我好驚'.split('|'), dl: ['很不開心', '很生氣', '很害怕'] },
      { q: '「我很累」用粤語點講？', a: '我好攰 (ngo5 hou2 gui6)', d: ['我好餓 (ngo5 hou2 ngo2)', '我好瞓 (ngo5 hou2 fan3)', '我好悶 (ngo5 hou2 mun6)'], dl: ['很餓', '很困', '很悶'] },
      { q: '「没关系」用粤語點講？', a: '冇關係 (mou5 gwaan1 hai6)', d: ['唔好意思 (m4 hou2 ji3 si1)', '對唔住 (deoi3 m4 zyu6)', '唔該 (m4 goi1)'], dl: ['不好意思', '對不起', '謝謝'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P2-06', genre: 'word-problem', grade: 'p2', edbCodes: ['CT2-5'], difficulty: 2,
  category: 'daily',
  patternFn: () => {
    const qs = [
      { q: '「看电视」用粤語點講？', a: '睇電視 (tai2 din6 si6)', d: ['聽歌 (teng1 go1)', '睇書 (tai2 syu1)', '打機 (daa2 gei1)'], dl: ['聽歌', '看書', '打遊戲'] },
      { q: '「打电话」用粤語點講？', a: '打電話 (daa2 din6 waa2)', d: ['發短訊', '寄信', '上網'], dl: ['發短信', '寄信', '上網'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- P3 (小三) ----------
{
  id: 'CT-P3-01', genre: 'word-problem', grade: 'p3', edbCodes: ['CT3-1'], difficulty: 2,
  category: 'polite',
  patternFn: () => {
    const qs = [
      { q: '「麻烦你了」用粤語點講？', a: '唔該晒你 (m4 goi1 saai3 nei5)', d: ['多謝晒你 (do1 ze6 saai3 nei5)', '對唔住 (deoi3 m4 zyu6)', '辛苦你 (san1 fu2 nei5)'], dl: ['感謝收到禮物', '道歉', '慰勞'] },
      { q: '「不客气」用粤語點講？', a: '唔使客氣 (m4 sai2 haak1 hei3)', d: ['唔好意思 (m4 hou2 ji3 si1)', '冇問題 (mou5 man4 tai4)', '好呀 (hou2 aa3)'], dl: ['不好意思', '沒問題', '好的'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P3-02', genre: 'word-problem', grade: 'p3', edbCodes: ['CT3-2'], difficulty: 2,
  category: 'direction',
  patternFn: () => {
    const qs = [
      { q: '「左边」用粤語點講？', a: '左邊 (zo2 bin1)', d: ['右邊 (jau6 bin1)', '上面 (soeng5 min6)', '入面 (jap6 min6)'], dl: ['右', '上面', '裏面'] },
      { q: '「前面」用粤語點講？', a: '前面 (cin4 min6)', d: ['後面 (hau6 min6)', '隔籬 (gaak3 lei4)', '出面 (ceot1 min6)'], dl: ['後面', '隔壁', '外面'] },
      { q: '「在哪里？」用粤語點問？', a: '喺邊度？ (hai2 bin1 dou6)', d: ['去邊度？ (heoi3 bin1 dou6)', '幾遠？ (gei2 jyun5)', '點去？ (dim2 heoi3)'], dl: ['去哪', '多遠', '怎麼去'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P3-03', genre: 'word-problem', grade: 'p3', edbCodes: ['CT3-3'], difficulty: 3,
  category: 'weather',
  patternFn: () => {
    const qs = [
      { q: '「今天很热」用粤語點講？', a: '今日好熱 (gam1 jat6 hou2 jit6)', d: ['今日好凍 (gam1 jat6 hou2 dung3)', '今日好涼 (gam1 jat6 hou2 loeng4)', '落雨啦 (lok6 jyu5 laa1)'], dl: ['很冷', '很涼', '下雨了'] },
      { q: '「下雨了」用粤語點講？', a: '落雨啦 (lok6 jyu5 laa1)', d: ['出太陽啦 (ceot1 taai3 joeng4 laa1)', '好大風 (hou2 daai6 fung1)', '落雪啦 (lok6 syut3 laa1)'], dl: ['出太陽', '大風', '下雪'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P3-04', genre: 'word-problem', grade: 'p3', edbCodes: ['CT3-4'], difficulty: 3,
  category: 'school',
  patternFn: () => {
    const qs = [
      { q: '「考试考得怎样？」用粤語點問？', a: '考試考成點？ (haau2 si5 haau2 sing4 dim2)', d: ['考試幾時？ (haau2 si5 gei2 si4)', '你溫咗書未？', '你做完功課未？'], dl: ['考試什麼時候', '你溫習了嗎', '你做完作業了嗎'] },
      { q: '「我要温习」用粤語點講？', a: '我要溫書 (ngo5 jiu3 wan1 syu1)', d: ['我要做功課 (ngo5 jiu3 zou6 gung1 fo3)', '我要讀課文', '我要睇書'], dl: ['做作業', '讀課文', '看書'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P3-05', genre: 'word-problem', grade: 'p3', edbCodes: ['CT3-5'], difficulty: 3,
  category: 'health',
  patternFn: () => {
    const qs = [
      { q: '「我头痛」用粤語點講？', a: '我頭痛 (ngo5 tau4 tung3)', d: ['我肚痛 (ngo5 tou5 tung3)', '我喉嚨痛', '我咳 (ngo5 kat1)'], dl: ['肚子痛', '喉嚨痛', '咳嗽'] },
      { q: '「看医生」用粤語點講？', a: '睇醫生 (tai2 ji1 sang1)', d: ['去醫院 (heoi3 ji1 jyun2)', '買藥 (maai5 joek6)', '打針 (daa2 zam1)'], dl: ['去醫院', '買藥', '打針'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P3-06', genre: 'word-problem', grade: 'p3', edbCodes: ['CT3-3'], difficulty: 3,
  category: 'daily',
  patternFn: () => {
    const qs = [
      { q: '「帮忙」用粤語點講？', a: '幫手 (bong1 sau2)', d: ['等陣 (dang2 zan6)', '借一借 (ze3 jat1 ze3)', '行開 (haang4 hoi1)'], dl: ['等一下', '借過', '走開'] },
      { q: '「点餐」用粤語在茶餐廳講？', a: '唔該，我要… (m4 goi1, ngo5 jiu3…)', d: ['老闆，呢個！', '比杯奶茶我', '我要叫…'], dl: ['叫老闆', '不禮貌說法', '不自然'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- P4 (小四) ----------
{
  id: 'CT-P4-01', genre: 'word-problem', grade: 'p4', edbCodes: ['CT4-1'], difficulty: 3,
  category: 'place',
  patternFn: () => {
    const qs = [
      { q: '「维多利亚港」用粤語點講？', a: '維多利亞港 (wai4 do1 lei6 aa3 gong2)', d: ['尖沙咀 (zim1 saa1 zeoi2)', '旺角 (wong6 gok3)', '中環 (zung1 waan4)'], dl: ['地區名', '地區名', '地區名'] },
      { q: '「去海洋公园」用粤語點講？', a: '去海洋公園 (heoi3 hoi2 jyun4 gung1 jyun2)', d: ['去迪士尼 (heoi3 dik6 si6 nei4)', '去山頂 (heoi3 saan1 deng2)', '去沙灘 (heoi3 saa1 taan1)'], dl: ['迪士尼', '太平山頂', '海灘'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P4-02', genre: 'word-problem', grade: 'p4', edbCodes: ['CT4-2'], difficulty: 3,
  category: 'phone',
  patternFn: () => {
    const qs = [
      { q: '「打电话」时粤語點講「你好」？', a: '喂，你好 (wai4, nei5 hou2)', d: ['嗨，你好', '係呀，你好', '你好呀，邊位？'], dl: ['非電話用語', '不自然', '接電話問法'] },
      { q: '「请稍等」用粤語點講？', a: '請等陣 (ceng2 dang2 zan6)', d: ['請坐 (ceng2 co5)', '請入嚟 (ceng2 jap6 lai4)', '請行先 (ceng2 haang4 sin1)'], dl: ['請坐', '請進來', '請先走'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P4-03', genre: 'word-problem', grade: 'p4', edbCodes: ['CT4-3'], difficulty: 3,
  category: 'compare',
  patternFn: () => {
    const qs = [
      { q: '「比较大」用粤語點講？', a: '大啲 (daai6 di1)', d: ['細啲 (sai3 di1)', '差唔多 (caa1 m4 do1)', '最大 (zeoi3 daai6)'], dl: ['小一點', '差不多', '最大(最高級)'] },
      { q: '「最便宜」用粤語點講？', a: '最平 (zeoi3 peng4)', d: ['貴啲 (gwai3 di1)', '平啲 (peng4 di1)', '最貴 (zeoi3 gwai3)'], dl: ['貴一點', '便宜一點(比較級)', '最貴'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P4-04', genre: 'word-problem', grade: 'p4', edbCodes: ['CT4-4'], difficulty: 3,
  category: 'invite',
  patternFn: () => {
    const qs = [
      { q: '「你想一起去吗？」用粤語點問？', a: '你想唔想一齊去？ (nei5 soeng2 m4 soeng2 jat1 cai4 heoi3)', d: '你去唔去呀？|你一齊去啦？|你去嗎？'.split('|'), dl: ['直接問', '建議(非問句)', '普通話'] },
      { q: '「好啊，一起去吧」用粤語點講？', a: '好呀，一齊去啦 (hou2 aa3, jat1 cai4 heoi3 laa3)', d: ['好，我哋去', '得啦，去', '可以，走啦'], dl: ['混合口語', '過於簡短', '不自然'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P4-05', genre: 'word-problem', grade: 'p4', edbCodes: ['CT4-5'], difficulty: 3,
  category: 'story',
  patternFn: () => {
    const qs = [
      { q: '「从前」用粤語點講？', a: '從前 (cung4 cin4)', d: ['而家 (ji4 gaa1)', '陣間 (zan6 gaan1)', '之後 (zi1 hau6)'], dl: ['現在', '等一下', '之後'] },
      { q: '「讲故事」用粤語點講？', a: '講故事 (gong2 gu3 si6)', d: ['睇故事 (tai2 gu3 si6)', '寫故事 (se2 gu3 si6)', '聽故事 (teng1 gu3 si6)'], dl: ['看故事', '寫故事', '聽故事'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- P5 (小五) ----------
{
  id: 'CT-P5-01', genre: 'word-problem', grade: 'p5', edbCodes: ['CT5-1'], difficulty: 4,
  category: 'complain',
  patternFn: () => {
    const qs = [
      { q: '「我想投訴」用粤語點講？', a: '我想投訴 (ngo5 soeng2 tau4 sou3)', d: ['我想問 (ngo5 soeng2 man6)', '我想幫忙', '我有意見 (ngo5 jau5 ji3 gin3)'], dl: ['提問', '幫忙', '有意見(較溫和)'] },
      { q: '「请你帮我」用粤語點講？', a: '可唔可以幫下我？ (ho2 m4 ho2 ji5 bong1 haa5 ngo5)', d: '你幫我啦！|幫手呀！|你要幫我！'.split('|'), dl: ['命令語氣', '不禮貌', '要求語氣'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P5-02', genre: 'word-problem', grade: 'p5', edbCodes: ['CT5-2'], difficulty: 4,
  category: 'medical',
  patternFn: () => {
    const qs = [
      { q: '「我发烧了」用粤語點講？', a: '我發燒啦 (ngo5 faat3 siu1 laa1)', d: ['我感冒啦 (ngo5 gam2 mou6 laa1)', '我咳啦 (ngo5 kat1 laa1)', '我嘔吐啦'], dl: ['感冒', '咳嗽', '嘔吐'] },
      { q: '「药房」用粤語點講？', a: '藥房 (joek6 fong4)', d: ['醫院 (ji1 jyun2)', '診所 (can2 so2)', '急症室 (gap1 zing3 sat1)'], dl: ['醫院', '診所', '急症室'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P5-03', genre: 'word-problem', grade: 'p5', edbCodes: ['CT5-3'], difficulty: 4,
  category: 'festival',
  patternFn: () => {
    const qs = [
      { q: '「中秋节」粤語點講？', a: '中秋節 (zung1 cau1 zit3)', d: ['端午節 (dyun1 ng5 zit3)', '元宵節 (jyun4 siu1 zit3)', '重陽節 (coeng4 joeng4 zit3)'], dl: ['端午', '元宵', '重陽'] },
      { q: '「舞龙舞狮」用粤語點講？', a: '舞龍舞獅 (mou5 lung4 mou5 si1)', d: ['划龍舟', '放鞭炮', '賞月'], dl: ['龍舟', '鞭炮', '賞月'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P5-04', genre: 'word-problem', grade: 'p5', edbCodes: ['CT5-4'], difficulty: 4,
  category: 'condition',
  patternFn: () => {
    const qs = [
      { q: '「如果下雨，就不去」用粤語點講？', a: '如果落雨，就唔去 (jyu4 gwo2 lok6 jyu5, zau6 m4 heoi3)', d: '落雨嘅話，唔去|萬一下雨，不去|下雨了，不去'.split('|'), dl: ['可以(口語)', '書面語', '已發生'] },
      { q: '「除非你来，否则我不去」用粤語點講？', a: '除非你嚟，如果唔係我唔去', d: ['如果你唔嚟，我就唔去', '你嚟我就去', '你唔嚟我都去'], dl: ['相反意思', '太簡短', '相反意思'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P5-05', genre: 'word-problem', grade: 'p5', edbCodes: ['CT5-5'], difficulty: 4,
  category: 'polite',
  patternFn: () => {
    const qs = [
      { q: '「请问厕所在哪里？」用粤語最禮貌講法？', a: '唔好意思，請問廁所喺邊度？', d: ['廁所喺邊？', '去廁所點行？', '我想問廁所'], dl: ['太直接', '不夠禮貌', '可以但不夠禮貌'] },
      { q: '「麻烦让一让」用粤語點講？', a: '唔該借借 (m4 goi1 ze3 ze3)', d: ['讓開！', '行開！', '過一過！'], dl: ['命令語氣', '不禮貌', '不完整'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- P6 (小六) ----------
{
  id: 'CT-P6-01', genre: 'word-problem', grade: 'p6', edbCodes: ['CT6-1'], difficulty: 4,
  category: 'discuss',
  patternFn: () => {
    const qs = [
      { q: '「我同意你的看法」用粤語點講？', a: '我同意你嘅睇法 (ngo5 tung4 ji3 nei5 ge3 tai2 faat3)', d: '我唔同意|我有唔同意見|我都係咁諗'.split('|'), dl: ['不同意', '不同意', '也這麼想(接近)'] },
      { q: '「我觉得应该是这样」用粤語點講？', a: '我覺得應該係咁 (ngo5 gok3 dak1 jing1 goi1 hai6 gam2)', d: ['我諗係咁', '梗係咁啦', '唔係咁'], dl: ['可以但較簡', '過於肯定', '否定'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P6-02', genre: 'word-problem', grade: 'p6', edbCodes: ['CT6-2'], difficulty: 4,
  category: 'slang',
  patternFn: () => {
    const qs = [
      { q: '粤語「好攰」係咩意思？', a: '很累', d: ['很餓', '很開心', '很生氣'], dl: ['飢餓', '高興', '憤怒'] },
      { q: '粤語「好耐」係咩意思？', a: '很久', d: ['很快', '很好', '很遠'], dl: ['速度', '程度好', '距離'] },
      { q: '粤語「幾好」係咩意思？', a: '挺好的', d: ['非常好', '不好', '一點好'], dl: ['程度更高', '否定', '程度更低'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P6-03', genre: 'word-problem', grade: 'p6', edbCodes: ['CT6-3'], difficulty: 5,
  category: 'formal',
  patternFn: () => {
    const qs = [
      { q: '口語「食飯」轉做書面語係？', a: '吃飯', d: ['食嘢', '食餐', '開飯'], dl: ['食嘢=吃東西', '非書面語', '開飯=準備吃飯'] },
      { q: '口語「瞓覺」轉做書面語係？', a: '睡覺', d: ['瞓眠', '休息', '躺下'], dl: ['非詞語', '休息≠睡覺', '只是動作'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-P6-04', genre: 'word-problem', grade: 'p6', edbCodes: ['CT6-4'], difficulty: 5,
  category: 'command',
  patternFn: () => {
    const qs = [
      { q: '「先做完功课才可以玩」用粤語點講？', a: '做完功課先可以玩 (zou6 gung1 fo3 sin1 ho2 ji5 waan2)', d: '玩完先做功課|做完功課去玩|功課做完就玩'.split('|'), dl: ['順序相反', '缺「先」字', '缺「可以」'] },
      { q: '「请你坐在这里等一下」用粤語點講？', a: '請你坐喺呢度等陣 (ceng2 nei5 co5 hai2 ni1 dou6 dang2 zan6)', d: '坐喺度等|你坐喺呢度等吓', dl: ['太簡短', '「等吓」也可以'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- F1 (中一) ----------
{
  id: 'CT-F1-01', genre: 'word-problem', grade: 'f1', edbCodes: ['CT7-1'], difficulty: 4,
  category: 'campus',
  patternFn: () => {
    const qs = [
      { q: '「辅导员」用粤語點講？', a: '社工 (si3 gung1)', d: ['輔導員 (fu6 dou3 jyun4)', '老師 (lou5 si1)', '校長 (haau2 zoeng2)'], dl: ['社工=更常用', '老師=teacher', '校長=principal'] },
      { q: '「课外活动」用粤語點講？', a: '課外活動 (fo3 oi6 wut6 dung6)', d: ['放學活動', '課堂活動', '興趣班'], dl: ['非正式說法', '課堂=課上', '興趣班=興趣班'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F1-02', genre: 'word-problem', grade: 'f1', edbCodes: ['CT7-2'], difficulty: 4,
  category: 'community',
  patternFn: () => {
    const qs = [
      { q: '「区议会」用粤語點講？', a: '區議會 (keoi1 ji5 wui6)', d: ['立法會 (lap6 faat3 wui6)', '政府 (zing3 fu2)', '街坊會'], dl: ['立法會≠區議會', '政府=政府', '街坊會=非正式'] },
      { q: '「社区中心」用粤語點講？', a: '社區中心 (se5 wui6 zung1 sam1)', d: ['街坊會', '文化中心', '體育館'], dl: ['非正式', '文化中心≠社區', '體育館=體育'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F1-03', genre: 'word-problem', grade: 'f1', edbCodes: ['CT7-3'], difficulty: 4,
  category: 'media',
  patternFn: () => {
    const qs = [
      { q: '「新闻报道」用粤語點講？', a: '新聞報道 (san1 man4 bou3 dou6)', d: ['消息 (siu1 sik1)', '廣告 (gwong3 gou3)', '節目 (zit3 muk6)'], dl: ['消息=不正式', '廣告=advertisement', '節目=program'] },
      { q: '「社交媒体」粤語常用講法？', a: '社交媒體 (si3 gaau1 mui4 tai2)', d: ['網絡平台', '通訊軟件', '即時通訊'], dl: ['網絡平台=更廣', '通訊軟件=通訊', '即時通訊=即時'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F1-04', genre: 'word-problem', grade: 'f1', edbCodes: ['CT7-4'], difficulty: 5,
  category: 'register',
  patternFn: () => {
    const qs = [
      { q: '正式場合「你好」用粤語點講更得體？', a: '你好 (nei5 hou2)', d: ['嗨 (hoi1)', '喂 (wai3)', '大佬你好'], dl: ['嗨=太casual', '喂=電話用語', '大佬=不正式'] },
      { q: '演講開場用粤語應該點講？', a: '各位好，多謝大家嚟到', d: '大家好呀，歡迎晒|Hi大家|你哋好'.split('|'), dl: ['可以但「歡迎晒」太casual', '太casual', '太簡短'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F1-05', genre: 'word-problem', grade: 'f1', edbCodes: ['CT7-5'], difficulty: 4,
  category: 'festival',
  patternFn: () => {
    const qs = [
      { q: '「年宵市场」用粤語點講？', a: '年宵市場 (nin4 siu1 si5 coeng4)', d: ['花市 (faa1 si5)', '夜市 (je6 si5)', '街市 (gaai1 si5)'], dl: ['花市=年宵一部分', '夜市≠年宵', '街市=菜市場'] },
      { q: '「团年饭」用粤語點講？', a: '團年飯 (tyun4 nin4 faan6)', d: ['年夜飯', '開年飯', '盆菜'], dl: ['普通話', '開年飯=年初一', '盆菜=盆菜'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- F2 (中二) ----------
{
  id: 'CT-F2-01', genre: 'word-problem', grade: 'f2', edbCodes: ['CT8-1'], difficulty: 5,
  category: 'current',
  patternFn: () => {
    const qs = [
      { q: '「可持续发展」用粤語點講？', a: '可持續發展 (ho2 ci4 ziu6 faat3 zin2)', d: ['環保發展', '綠色發展', '經濟發展'], dl: ['環保≠可持續', '綠色=部分意思', '經濟≠可持續'] },
      { q: '「气候变化」用粤語點講？', a: '氣候變化 (hei3 hau6 bin3 faa3)', d: ['天氣改變', '全球暖化', '溫室效應'], dl: ['非正式', '全球暖化=部分', '溫室效應=原因'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F2-02', genre: 'word-problem', grade: 'f2', edbCodes: ['CT8-2'], difficulty: 5,
  category: 'workplace',
  patternFn: () => {
    const qs = [
      { q: '「面试」用粤語點講？', a: '面試 (min6 si5)', d: ['見工 (gin3 gung1)', '口試 (hau2 si5)', '筆試 (bat1 si5)'], dl: ['見工=口語(也對)', '口試=口頭考試', '筆試=written test'] },
      { q: '「简历」用粤語點講？', a: '履歷表 (lei5 lik6 biu2)', d: ['CV', '個人介紹', '求職信'], dl: ['英文說法', '非正式', '求職信=cover letter'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F2-03', genre: 'word-problem', grade: 'f2', edbCodes: ['CT8-3'], difficulty: 5,
  category: 'idiom',
  patternFn: () => {
    const qs = [
      { q: '粤語俗語「食碗面反碗底」係咩意思？', a: '忘恩負義', d: ['貪心不足', '做事馬虎', '兩面三刀'], dl: ['貪心', '馬虎', '兩面派(接近但不同)'] },
      { q: '粤語俗語「爛船都有三分釘」係咩意思？', a: '瘦死的骆驼比马大', d: ['船到橋頭自然直', '破釜沉舟', '欲速則不達'], dl: ['隨遇而安', '下定決心', '不要急'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F2-04', genre: 'word-problem', grade: 'f2', edbCodes: ['CT8-4'], difficulty: 5,
  category: 'emotion',
  patternFn: () => {
    const qs = [
      { q: '「百感交集」用粤語點樣表達？', a: '心入面五味雜陳', d: ['好開心', '好嬲', '好驚'], dl: ['只有開心', '只有生氣', '只有害怕'] },
      { q: '「忐忑不安」用粤語點講？', a: '心卜卜跳，好唔安樂', d: ['好緊張', '好興奮', '好攰'], dl: ['緊張≠不安', '興奮=正面', '攰=累'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F2-05', genre: 'word-problem', grade: 'f2', edbCodes: ['CT8-5'], difficulty: 5,
  category: 'crossculture',
  patternFn: () => {
    const qs = [
      { q: '用粤語介紹自己「我來自香港」，邊個講法最自然？', a: '我係香港人 (ngo5 hai6 hoeng2 gong2 jan4)', d: ['我來自香港', '我住喺香港', '我香港嚟㗎'], dl: ['書面語', '住≠來自', '可以但語氣不同'] },
      { q: '向外国人用粤語介紹茶餐廳文化，邊個講法好？', a: '呢度係茶餐廳，香港人最鍾意嚟呢度食嘢', d: '茶餐廳係食嘢嘅地方|呢間嘢好好食|香港茶餐廳'.split('|'), dl: ['太簡短', '只說食物', '只有名詞'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

// ---------- F3 (中三) ----------
{
  id: 'CT-F3-01', genre: 'word-problem', grade: 'f3', edbCodes: ['CT9-1'], difficulty: 5,
  category: 'academic',
  patternFn: () => {
    const qs = [
      { q: '「论点」用粤語學術講法？', a: '論點 (leon3 dim2)', d: ['觀點 (gun1 dim2)', '重點 (zung6 dim2)', '睇法 (tai2 faat3)'], dl: ['觀點=viewpoint', '重點=key point', '睇法=口語'] },
      { q: '「论据」用粤語學術講法？', a: '論據 (leon3 geoi3)', d: ['證據 (zing3 geoi3)', '例子 (lai6 zi2)', '原因 (jyun4 jan1)'], dl: ['證據=evidence', '例子=example', '原因=reason'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F3-02', genre: 'word-problem', grade: 'f3', edbCodes: ['CT9-2'], difficulty: 5,
  category: 'express',
  patternFn: () => {
    const qs = [
      { q: '做presentation用粤語開場，邊個最好？', a: '各位同學，今日我想同大家分享嘅主題係…', d: '大家好，我講嘅係…|Hi，今日我講呢個|各位，聽我講'.split('|'), dl: ['太簡短', '太casual', '命令語氣'] },
      { q: '做presentation用粤語總結，邊個最好？', a: '總括嚟講，我哋可以見到…多謝各位', d: '完啦，多謝|就係咁啦|講完，有冇問題？'.split('|'), dl: ['太簡短', '不正式', '缺總結'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F3-03', genre: 'word-problem', grade: 'f3', edbCodes: ['CT9-3'], difficulty: 5,
  category: 'business',
  patternFn: () => {
    const qs = [
      { q: '「客户」用粤語商業講法？', a: '客戶 (haak3 wu6)', d: ['客人 (haak3 jan4)', '買家 (maai5 gaa)', '顧客 (gu3 haak3)'], dl: ['客人=日常', '買家=買方', '顧客=也對'] },
      { q: '「合作」用粤語商業場合點講？', a: '合作 (hap6 zok3)', d: ['一齊做', '拍檔', '搭檔'], dl: ['太casual', '拍檔=partner', '搭檔=北方說法'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F3-04', genre: 'word-problem', grade: 'f3', edbCodes: ['CT9-4'], difficulty: 5,
  category: 'literary',
  patternFn: () => {
    const qs = [
      { q: '「春眠不覺曉」用粤語點讀？', a: 'ceon1 min4 bat1 gok3 hiu2', d: ['ceon1 man4 bat1 gok3 hiu2', '春mian不覺曉', 'ceon1 min4 bat1 gok3 hiu5'], dl: ['眠≠man4', '普通話拼音', '曉聲調錯'] },
      { q: '「花落知多少」用粤語點讀？', a: 'faa1 lok6 zi1 do1 siu2', d: ['faa1 lok6 gei1 do1 siu2', '花lak知多少', 'faa1 lok3 zi1 do1 siu2'], dl: ['知≠gei1', '部分粵語部分普通話', '落聲調錯'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

{
  id: 'CT-F3-05', genre: 'word-problem', grade: 'f3', edbCodes: ['CT9-5'], difficulty: 5,
  category: 'exam',
  patternFn: () => {
    const qs = [
      { q: '口試小組討論，想打斷別人補充，用粤語應該點講？', a: '唔好意思，我想補充一下…', d: '你講錯啦！|等陣，我有嘢講|唔係咁，聽我講'.split('|'), dl: ['太攻擊', '不禮貌', '命令語氣'] },
      { q: '口試小組討論，同意別人觀點，用粤語應該點講？', a: '你講得有道理，我都係咁諗', d: ['係呀係呀', '啱呀', '我同意'], dl: ['太簡短', '太casual', '太簡短'] },
    ];
    const { q, a, d, dl } = pick(qs);
    return { question: q, correctAnswer: a, options: shuffle([a, ...d]), distractorLabels: dl };
  },
  answer: (v) => v._ans,
  distractors: [],
},

];

// 辅助函数：按年级获取模板
export function getCantoneseTemplatesByGrade(grade) {
  return cantoneseTemplates.filter(t => t.grade === grade);
}

// 获取所有可用年级
export function getCantoneseAvailableGrades() {
  return [...new Set(cantoneseTemplates.map(t => t.grade))];
}

// 统计信息
export function getCantoneseTemplateStats() {
  const stats = {};
  cantoneseTemplates.forEach(t => {
    if (!stats[t.grade]) stats[t.grade] = 0;
    stats[t.grade]++;
  });
  return stats;
}
