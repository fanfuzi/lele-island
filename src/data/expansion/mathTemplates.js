/**
 * 数学题目模板库 (P1-F3)
 * 每个模板通过 templateEngine 可生成数十到上百道不同数值的题目
 * 组织方式：按年级分组，每组分 domain (数/度量/图形/代数/统计)
 */

export const mathTemplates = [
  // ============================
  // P1 (一年级)
  // ============================
  {
    id: 'P1-ADD-001', genre: 'computation', grade: 'p1', edbCodes: ['N1-1.1'], difficulty: 1,
    pattern: '{a} + {b} = ?',
    variables: { a: { range: [1, 20] }, b: { range: [1, 20] } },
    constraint: (v) => v.a + v.b <= 50,
    answer: (v) => v.a + v.b,
    distractors: [(v) => v.a + v.b + 1, (v) => Math.abs(v.a - v.b), (v) => v.a + v.b + 10],
    distractorLabels: ['數錯', '用減法', '多加了10'],
  },
  {
    id: 'P1-SUB-001', genre: 'computation', grade: 'p1', edbCodes: ['N1-1.1'], difficulty: 1,
    pattern: '{a} - {b} = ?',
    variables: { a: { range: [10, 50] }, b: { range: [1, 20] } },
    constraint: (v) => v.a >= v.b,
    answer: (v) => v.a - v.b,
    distractors: [(v) => v.a - v.b + 1, (v) => v.a + v.b, (v) => v.a - v.b - 1],
    distractorLabels: ['數錯', '用加法', '數錯'],
  },
  {
    id: 'P1-WP-ADD-001', genre: 'word-problem', grade: 'p1', edbCodes: ['N1-1.2'], difficulty: 1,
    pattern: '{name}有{a}個{thing}，媽媽又給了{b}個，{name}一共有多少個{thing}？',
    variables: { a: { range: [1, 15] }, b: { range: [1, 15] }, name: ['小明', '小紅', '小華', '小美'], thing: ['蘋果', '糖', '積木', '貼紙'] },
    constraint: (v) => v.a + v.b <= 30,
    answer: (v) => v.a + v.b,
    distractors: [(v) => Math.abs(v.a - v.b), (v) => v.a + v.b + 1, (v) => v.a + v.b + 5],
    distractorLabels: ['用減法', '數錯', '多算'],
  },
  {
    id: 'P1-WP-SUB-001', genre: 'word-problem', grade: 'p1', edbCodes: ['N1-1.2'], difficulty: 1,
    pattern: '{name}有{a}枝{thing}，用了{b}枝，還剩多少枝？',
    variables: { a: { range: [5, 30] }, b: { range: [1, 15] }, name: ['小明', '小紅', '小華'], thing: ['鉛筆', '顏色筆', '蠟筆'] },
    constraint: (v) => v.a >= v.b,
    answer: (v) => v.a - v.b,
    distractors: [(v) => v.a + v.b, (v) => v.a - v.b - 1, (v) => v.a - v.b + 2],
    distractorLabels: ['用加法', '數錯', '數錯'],
  },
  {
    id: 'P1-COMP-001', genre: 'computation', grade: 'p1', edbCodes: ['N1-2.1'], difficulty: 1,
    pattern: '比較大小：{a} ○ {b}（填 >、< 或 =）',
    variables: { a: { range: [1, 50] }, b: { range: [1, 50] } },
    constraint: (v) => v.a !== v.b,
    answer: (v) => v.a > v.b ? '>' : '<',
    distractors: [(v) => v.a < v.b ? '>' : '<', (v) => '=', (v) => v.a > v.b ? '<' : '>'],
    distractorLabels: ['方向搞錯', '以爲相等', '搞反了'],
  },
  {
    id: 'P1-PLACE-001', genre: 'computation', grade: 'p1', edbCodes: ['N1-2.2'], difficulty: 1,
    pattern: '{a} 是幾個十和幾個一？',
    variables: { a: { range: [11, 99] } },
    answer: (v) => `${Math.floor(v.a / 10)}個十和${v.a % 10}個一`,
    distractors: [(v) => `${v.a % 10}個十和${Math.floor(v.a / 10)}個一`, (v) => `${Math.floor(v.a / 10)}個十`, (v) => `${v.a % 10}個一`],
    distractorLabels: ['十位個位搞反', '漏了個位', '漏了十位'],
  },

  // ============================
  // P2 (二年级)
  // ============================
  {
    id: 'P2-ADD-001', genre: 'computation', grade: 'p2', edbCodes: ['N2-1.1'], difficulty: 1,
    pattern: '{a} + {b} = ?',
    variables: { a: { range: [10, 100] }, b: { range: [10, 100] } },
    constraint: (v) => v.a + v.b <= 200,
    answer: (v) => v.a + v.b,
    distractors: [(v) => v.a + v.b + 10, (v) => v.a + v.b - 10, (v) => Math.abs(v.a - v.b)],
    distractorLabels: ['忘記進位', '多進位', '用減法'],
  },
  {
    id: 'P2-SUB-001', genre: 'computation', grade: 'p2', edbCodes: ['N2-1.1'], difficulty: 1,
    pattern: '{a} - {b} = ?',
    variables: { a: { range: [50, 150] }, b: { range: [10, 80] } },
    constraint: (v) => v.a >= v.b + 10,
    answer: (v) => v.a - v.b,
    distractors: [(v) => v.a - v.b + 10, (v) => v.a + v.b, (v) => v.a - v.b - 10],
    distractorLabels: ['忘記退位', '用加法', '多退位'],
  },
  {
    id: 'P2-MUL-001', genre: 'computation', grade: 'p2', edbCodes: ['N2-2.1'], difficulty: 1,
    pattern: '{a} × {b} = ?',
    variables: { a: { range: [2, 5] }, b: { range: [1, 9] } },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a + v.b, (v) => v.a * v.b + v.a, (v) => v.a * v.b + v.b],
    distractorLabels: ['用加法', '多乘一次', '多乘一次'],
  },
  {
    id: 'P2-DIV-001', genre: 'computation', grade: 'p2', edbCodes: ['N2-2.2'], difficulty: 2,
    pattern: '{a} ÷ {b} = ?',
    variables: { a: { range: [2, 5] }, b: { range: [1, 9] }, _product: null },
    constraint: (v) => {
      const nums = [[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10]];
      const pair = nums[Math.floor(Math.random() * nums.length)];
      v.a = pair[0] * pair[1];
      v.b = pair[0];
      v._product = pair[1];
      return true;
    },
    answer: (v) => v._product,
    distractors: [(v) => v._product + 1, (v) => v.a - v.b, (v) => v._product > 5 ? v._product - 1 : v._product + 2],
    distractorLabels: ['數錯', '用減法', '數錯'],
  },
  {
    id: 'P2-WP-MUL-001', genre: 'word-problem', grade: 'p2', edbCodes: ['N2-2.1'], difficulty: 2,
    pattern: '每盒有{a}顆{thing}，買了{b}盒，一共有多少顆{thing}？',
    variables: { a: [2, 3, 4, 5, 6], b: [2, 3, 4, 5], thing: ['糖', '朱古力', '餅乾', '波子'] },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a + v.b, (v) => v.a * v.b + v.a, (v) => v.a * v.b + v.b],
    distractorLabels: ['用加法', '多算一盒', '每盒多算'],
  },
  {
    id: 'P2-WP-DIV-001', genre: 'word-problem', grade: 'p2', edbCodes: ['N2-2.2'], difficulty: 2,
    pattern: '有{a}塊{thing}，平均分給{b}個人，每人分到多少塊？',
    variables: { a: [6, 8, 10, 12, 15, 16, 18, 20], b: [2, 3, 4, 5] },
    constraint: (v) => v.a % v.b === 0,
    answer: (v) => v.a / v.b,
    distractors: [(v) => v.a - v.b, (v) => v.a + v.b, (v) => (v.a / v.b) + 1],
    distractorLabels: ['用減法', '用加法', '多算'],
  },
  {
    id: 'P2-TIME-001', genre: 'computation', grade: 'p2', edbCodes: ['M2-1.1'], difficulty: 2,
    pattern: '{a}時 + {b}小時 = {a + b}時，如果 {a} 時是上午，過 {b} 小時後是？',
    variables: { a: { range: [1, 11] }, b: { range: [1, 6] } },
    constraint: (v) => v.a + v.b <= 12,
    answer: (v) => `${v.a + v.b}時`,
    distractors: [(v) => `${v.a + v.b + 1}時`, (v) => `${v.a}時`, (v) => `${v.a - v.b}時`],
    distractorLabels: ['算多一小時', '沒變', '用減法'],
  },

  // ============================
  // P3 (三年级) — 香港小三核心
  // ============================
  {
    id: 'P3-ADD-001', genre: 'computation', grade: 'p3', edbCodes: ['N3-1.1'], difficulty: 2,
    pattern: '{a} + {b} = ?',
    variables: { a: { range: [100, 500] }, b: { range: [100, 500] } },
    constraint: (v) => v.a + v.b <= 999,
    answer: (v) => v.a + v.b,
    distractors: [(v) => v.a + v.b + 10, (v) => v.a + v.b - 10, (v) => v.a + v.b + 100],
    distractorLabels: ['忘記個位進位', '多進位', '忘記百位進位'],
  },
  {
    id: 'P3-ADD-002', genre: 'computation', grade: 'p3', edbCodes: ['N3-1.1'], difficulty: 2,
    pattern: '{a} + {b} = ?',
    variables: { a: { range: [300, 700] }, b: { range: [200, 500] } },
    constraint: (v) => v.a + v.b >= 1000 && v.a + v.b <= 1999,
    answer: (v) => v.a + v.b,
    distractors: [(v) => v.a + v.b - 100, (v) => v.a + v.b - 1000, (v) => v.a + v.b - 10],
    distractorLabels: ['千位忘了進1', '忘了進千位', '十位忘了進位'],
  },
  {
    id: 'P3-SUB-001', genre: 'computation', grade: 'p3', edbCodes: ['N3-1.1'], difficulty: 2,
    pattern: '{a} - {b} = ?',
    variables: { a: { range: [200, 999] }, b: { range: [100, 500] } },
    constraint: (v) => v.a >= v.b + 50,
    answer: (v) => v.a - v.b,
    distractors: [(v) => v.a - v.b + 10, (v) => v.a - v.b - 10, (v) => v.a + v.b],
    distractorLabels: ['退位搞錯', '多退了', '用加法'],
  },
  {
    id: 'P3-MUL-001', genre: 'computation', grade: 'p3', edbCodes: ['N3-2.1'], difficulty: 2,
    pattern: '{a} × {b} = ?',
    variables: { a: { range: [6, 9] }, b: { range: [2, 9] } },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a * v.b + v.a, (v) => v.a + v.b, (v) => v.a * v.b - v.a],
    distractorLabels: ['多乘一次', '用加法', '少乘一次'],
  },
  {
    id: 'P3-DIV-001', genre: 'computation', grade: 'p3', edbCodes: ['N3-2.2'], difficulty: 2,
    pattern: '{a} ÷ {b} = ?',
    variables: { a: { range: [6, 9] }, b: { range: [2, 9] } },
    constraint: (v) => {
      const table = {2:[2,4,6,8,10,12,14,16,18],3:[3,6,9,12,15,18,21,24,27],4:[4,8,12,16,20,24,28,32,36],5:[5,10,15,20,25,30,35,40,45],6:[6,12,18,24,30,36,42,48,54],7:[7,14,21,28,35,42,49,56,63],8:[8,16,24,32,40,48,56,64,72],9:[9,18,27,36,45,54,63,72,81]};
      const b = v.b;
      const multiples = table[b] || [b, b*2, b*3, b*4, b*5, b*6, b*7, b*8, b*9];
      const quotient = Math.floor(Math.random() * 9) + 1;
      v.a = b * quotient;
      v._q = quotient;
      return true;
    },
    answer: (v) => v._q,
    distractors: [(v) => v._q + 1, (v) => v._q > 1 ? v._q - 1 : v._q + 2, (v) => v.a - v.b],
    distractorLabels: ['乘法表記錯', '乘法表記錯', '用減法'],
  },
  {
    id: 'P3-WP-ADDSUB-001', genre: 'word-problem', grade: 'p3', edbCodes: ['N3-1.2'], difficulty: 2,
    pattern: '{place}有{a}本{book}，運來{b}本，又借出{c}本，現在有多少本？',
    variables: { a: { range: [100, 400] }, b: { range: [100, 300] }, c: { range: [50, 200] }, place: ['圖書館', '書店', '學校圖書館'], book: ['故事書', '繪本', '漫畫書'] },
    constraint: (v) => v.a + v.b >= v.c,
    answer: (v) => v.a + v.b - v.c,
    distractors: [(v) => v.a + v.b + v.c, (v) => v.a - v.b - v.c, (v) => v.a + v.b - v.c + 10],
    distractorLabels: ['全部相加', '全部相減', '退位算錯'],
  },
  {
    id: 'P3-WP-MUL-001', genre: 'word-problem', grade: 'p3', edbCodes: ['N3-2.1'], difficulty: 2,
    pattern: '{name}每天喝{a}杯水，{b}天一共喝多少杯水？',
    variables: { a: { range: [2, 8] }, b: { range: [3, 9] }, name: ['小明', '小紅', '小華'] },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a + v.b, (v) => v.a * v.b + v.a, (v) => v.a * v.b + v.b],
    distractorLabels: ['用加法', '多算一天', '每杯多算'],
  },
  {
    id: 'P3-WP-DIV-001', genre: 'word-problem', grade: 'p3', edbCodes: ['N3-2.2'], difficulty: 2,
    pattern: '把{a}顆{thing}平均裝入{b}個袋子，每袋有幾顆？還剩幾顆？',
    variables: { a: { range: [20, 50] }, b: { range: [3, 9] }, thing: ['糖', '彈珠', '鈕扣'] },
    answer: (v) => `${Math.floor(v.a / v.b)}顆，剩${v.a % v.b}顆`,
    distractors: [(v) => `${Math.floor(v.a / v.b) + 1}顆`, (v) => `${Math.floor(v.a / v.b)}顆`, (v) => `${v.a - v.b}顆`],
    distractorLabels: ['商算多了', '忘了餘數', '用減法'],
  },
  {
    id: 'P3-FRAC-001', genre: 'computation', grade: 'p3', edbCodes: ['N3-3.1'], difficulty: 2,
    pattern: '{a}/{b} + {c}/{b} = ?（同分母加法）',
    variables: { a: { range: [1, 4] }, b: { range: [4, 8] }, c: { range: [1, 4] } },
    constraint: (v) => v.a + v.c < v.b,
    answer: (v) => `${v.a + v.c}/${v.b}`,
    distractors: [(v) => `${v.a + v.c}/${v.a + v.b + v.c}`, (v) => `${v.a + v.c + 1}/${v.b}`, (v) => `${Math.abs(v.a - v.c)}/${v.b}`],
    distractorLabels: ['分母也加了', '分子算多', '用減法'],
  },
  {
    id: 'P3-FRAC-002', genre: 'computation', grade: 'p3', edbCodes: ['N3-3.1'], difficulty: 2,
    pattern: '{a}/{b} - {c}/{b} = ?（同分母減法）',
    variables: { a: { range: [3, 7] }, b: { range: [4, 10] }, c: { range: [1, 3] } },
    constraint: (v) => v.a > v.c && v.a <= v.b,
    answer: (v) => `${v.a - v.c}/${v.b}`,
    distractors: [(v) => `${v.a - v.c}/${v.b + 1}`, (v) => `${Math.abs(v.a - v.c)}/${v.b + 1}`, (v) => `${v.a + v.c}/${v.b}`],
    distractorLabels: ['分母寫錯', '分母錯且減錯', '用加法'],
  },
  {
    id: 'P3-TIME-001', genre: 'word-problem', grade: 'p3', edbCodes: ['M3-1.1'], difficulty: 2,
    pattern: '{name}{a}時{b}分出發，坐了{c}分鐘車到達，到達時間是？',
    variables: { a: { range: [8, 16] }, b: [0, 15, 20, 30, 45], c: [15, 20, 25, 30, 35, 40], name: ['小明', '小紅', '小華'] },
    constraint: (v) => v.b + v.c < 60,
    answer: (v) => `${v.a}時${v.b + v.c}分`,
    distractors: [(v) => `${v.a}時${v.b + v.c + 10}分`, (v) => `${v.a + 1}時${v.b + v.c - 60}分`, (v) => `${v.a}時${v.b - v.c}分`],
    distractorLabels: ['多加了10分鐘', '忘了進位到小時', '用減法'],
  },
  {
    id: 'P3-MONEY-001', genre: 'word-problem', grade: 'p3', edbCodes: ['M3-2.1'], difficulty: 2,
    pattern: '{name}買了一件${a}元的{item}，付了${b}元，應找回多少元？',
    variables: { a: [5, 10, 15, 20, 25, 30, 50], b: [50, 100], name: ['小明', '小紅', '小華'], item: ['書包', '文具盒', '玩具車', '公仔'] },
    constraint: (v) => v.b > v.a,
    answer: (v) => v.b - v.a,
    distractors: [(v) => v.b - v.a - 5, (v) => v.b + v.a, (v) => v.b - v.a + 5],
    distractorLabels: ['找錯錢', '付錢加物品價', '多找了'],
  },
  {
    id: 'P3-LENGTH-001', genre: 'word-problem', grade: 'p3', edbCodes: ['M3-3.1'], difficulty: 2,
    pattern: '{name}跳了{a}厘米，{name2}跳了{b}厘米，兩人一共跳了多少厘米？',
    variables: { a: { range: [80, 150] }, b: { range: [60, 120] }, name: ['小明', '小紅'], name2: ['小華', '小美'] },
    answer: (v) => v.a + v.b,
    distractors: [(v) => Math.abs(v.a - v.b), (v) => v.a + v.b + 10, (v) => v.a + v.b - 10],
    distractorLabels: ['用減法', '多算', '少算'],
  },

  // ============================
  // P4 (四年级)
  // ============================
  {
    id: 'P4-ADD-001', genre: 'computation', grade: 'p4', edbCodes: ['N4-1.1'], difficulty: 2,
    pattern: '{a} + {b} = ?',
    variables: { a: { range: [1000, 5000] }, b: { range: [1000, 4000] } },
    constraint: (v) => v.a + v.b <= 9999,
    answer: (v) => v.a + v.b,
    distractors: [(v) => v.a + v.b - 1000, (v) => v.a + v.b + 100, (v) => v.a + v.b - 100],
    distractorLabels: ['千位忘了進位', '百位多進', '百位少進'],
  },
  {
    id: 'P4-SUB-001', genre: 'computation', grade: 'p4', edbCodes: ['N4-1.1'], difficulty: 2,
    pattern: '{a} - {b} = ?',
    variables: { a: { range: [2000, 9999] }, b: { range: [1000, 4000] } },
    constraint: (v) => v.a >= v.b + 500,
    answer: (v) => v.a - v.b,
    distractors: [(v) => v.a - v.b - 100, (v) => v.a - v.b + 100, (v) => v.a + v.b],
    distractorLabels: ['千位退位錯', '百位退位錯', '用加法'],
  },
  {
    id: 'P4-MUL-001', genre: 'computation', grade: 'p4', edbCodes: ['N4-2.1'], difficulty: 2,
    pattern: '{a} × {b} = ?',
    variables: { a: { range: [10, 50] }, b: { range: [2, 9] } },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a * v.b + 10, (v) => v.a * v.b - v.a, (v) => v.a * v.b + v.b],
    distractorLabels: ['乘法表記錯', '少乘一次', '多乘一次'],
  },
  {
    id: 'P4-MUL-002', genre: 'computation', grade: 'p4', edbCodes: ['N4-2.1'], difficulty: 3,
    pattern: '{a} × {b} = ?（兩位數乘兩位數）',
    variables: { a: { range: [11, 30] }, b: { range: [11, 30] } },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a * v.b - v.a, (v) => v.a * v.b + v.b * 10, (v) => v.a * 10 + v.b * 10],
    distractorLabels: ['忘記部分積', '十位乘錯', '只乘了十位'],
  },
  {
    id: 'P4-DIV-001', genre: 'computation', grade: 'p4', edbCodes: ['N4-2.2'], difficulty: 3,
    pattern: '{a} ÷ {b} = ?（兩位數除以一位數）',
    variables: { a: { range: [10, 50] }, b: { range: [2, 9] } },
    constraint: (v) => v.a % v.b === 0,
    answer: (v) => v.a / v.b,
    distractors: [(v) => Math.floor(v.a / v.b) + 1, (v) => v.a - v.b, (v) => Math.floor(v.a / v.b) - 1],
    distractorLabels: ['商算多了', '用減法', '商算少了'],
  },
  {
    id: 'P4-FRAC-001', genre: 'computation', grade: 'p4', edbCodes: ['N4-3.1'], difficulty: 3,
    pattern: '{a}/{b} + {c}/{d} = ?（異分母加法）',
    variables: { a: { range: [1, 3] }, b: [2, 3, 4, 5, 6, 8, 10], c: { range: [1, 3] }, d: [2, 3, 4, 5, 6, 8, 10] },
    constraint: (v) => v.b !== v.d,
    answer: (v) => {
      const lcm = (x, y) => { let n = x; while (n % y !== 0) n += x; return n; };
      const m = lcm(v.b, v.d);
      const num = v.a * (m / v.b) + v.c * (m / v.d);
      return `${num}/${m}`;
    },
    distractors: [(v) => `${v.a + v.c}/${v.b + v.d}`, (v) => `${v.a}/${v.b}`, (v) => `${v.a + v.c}/${Math.max(v.b, v.d)}`],
    distractorLabels: ['分子分母分別相加', '沒變', '分母取大的'],
  },
  {
    id: 'P4-DECIMAL-001', genre: 'computation', grade: 'p4', edbCodes: ['N4-3.2'], difficulty: 2,
    pattern: '{a}.{b} + {c}.{d} = ?',
    variables: { a: { range: [1, 20] }, b: { range: [1, 9] }, c: { range: [1, 20] }, d: { range: [1, 9] } },
    constraint: (v) => {
      const sum = v.a + v.c;
      const dec = v.b + v.d;
      if (dec >= 10) { v.a_sum = sum + 1; v.dec_sum = dec - 10; }
      else { v.a_sum = sum; v.dec_sum = dec; }
      return v.a_sum <= 50;
    },
    answer: (v) => {
      const sum = v.a + v.c;
      const dec = v.b + v.d;
      const whole = dec >= 10 ? sum + 1 : sum;
      const decPart = dec >= 10 ? dec - 10 : dec;
      return `${whole}.${decPart}`;
    },
    distractors: [(v) => `${v.a + v.c}.${v.b + v.d}`, (v) => `${v.a + v.c}.${Math.abs(v.b - v.d)}`, (v) => `${v.a + v.c + 1}.${v.b + v.d}`],
    distractorLabels: ['小數位忘記進位', '小數位用減法', '整數進位但小數沒調'],
  },
  {
    id: 'P4-PERIMETER-001', genre: 'word-problem', grade: 'p4', edbCodes: ['M4-1.1'], difficulty: 2,
    pattern: '一個長方形長{a}厘米，寬{b}厘米，周界是多少厘米？',
    variables: { a: { range: [5, 30] }, b: { range: [3, 20] } },
    answer: (v) => 2 * (v.a + v.b),
    distractors: [(v) => v.a + v.b, (v) => v.a * v.b, (v) => 2 * v.a + v.b],
    distractorLabels: ['只加了長和寬', '用了面積公式', '只乘了長'],
  },
  {
    id: 'P4-AREA-001', genre: 'word-problem', grade: 'p4', edbCodes: ['M4-1.2'], difficulty: 2,
    pattern: '一個長方形長{a}米，寬{b}米，面積是多少平方米？',
    variables: { a: { range: [5, 30] }, b: { range: [3, 20] } },
    answer: (v) => v.a * v.b,
    distractors: [(v) => 2 * (v.a + v.b), (v) => v.a + v.b, (v) => v.a * v.b + v.a],
    distractorLabels: ['用了周界公式', '用了加法', '多乘了'],
  },
  {
    id: 'P4-WP-MULTISTEP-001', genre: 'word-problem', grade: 'p4', edbCodes: ['N4-1.2'], difficulty: 3,
    pattern: '{name}有${a}元，買了{b}個{item}，每個${c}元，還剩多少元？',
    variables: { a: { range: [50, 200] }, b: { range: [2, 6] }, c: { range: [5, 20] }, name: ['小明', '小紅', '小華'], item: ['筆記本', '文件夾', '筆'] },
    constraint: (v) => v.a >= v.b * v.c,
    answer: (v) => v.a - v.b * v.c,
    distractors: [(v) => v.a - v.b - v.c, (v) => v.a - v.b * v.c + v.c, (v) => v.b * v.c - v.a],
    distractorLabels: ['減錯了', '少減一個', '順序搞反了'],
  },

  // ============================
  // P5 (五年级)
  // ============================
  {
    id: 'P5-MUL-001', genre: 'computation', grade: 'p5', edbCodes: ['N5-2.1'], difficulty: 3,
    pattern: '{a} × {b} = ?（多位數乘法）',
    variables: { a: { range: [100, 500] }, b: { range: [10, 50] } },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a * v.b - v.a, (v) => v.a * v.b + v.a * 10, (v) => v.a * 10 + v.b * 10],
    distractorLabels: ['忘了一個部分積', '十位乘錯位', '只乘了十位'],
  },
  {
    id: 'P5-DIV-002', genre: 'computation', grade: 'p5', edbCodes: ['N5-2.2'], difficulty: 3,
    pattern: '{a} ÷ {b} = ?（兩位數除法）',
    variables: { a: { range: [100, 500] }, b: { range: [11, 30] } },
    constraint: (v) => v.a % v.b === 0,
    answer: (v) => v.a / v.b,
    distractors: [(v) => Math.floor(v.a / v.b) + 1, (v) => Math.floor(v.a / v.b) - 1, (v) => v.a - v.b],
    distractorLabels: ['商估大了', '商估小了', '用減法'],
  },
  {
    id: 'P5-FRAC-003', genre: 'computation', grade: 'p5', edbCodes: ['N5-3.1'], difficulty: 3,
    pattern: '{a}/{b} × {c} = ?（分數乘法）',
    variables: { a: { range: [1, 5] }, b: { range: [3, 8] }, c: { range: [2, 6] } },
    constraint: (v) => v.a < v.b,
    answer: (v) => `${v.a * v.c}/${v.b}`,
    distractors: [(v) => `${v.a + v.c}/${v.b}`, (v) => `${v.a * v.c}/${v.b * v.c}`, (v) => `${v.a}/${v.b * v.c}`],
    distractorLabels: ['分子用加法', '分母也乘了', '分母多乘'],
  },
  {
    id: 'P5-DECIMAL-002', genre: 'computation', grade: 'p5', edbCodes: ['N5-3.2'], difficulty: 3,
    pattern: '{a}.{b} × {c} = ?（小數乘法）',
    variables: { a: { range: [1, 20] }, b: { range: [1, 9] }, c: { range: [2, 9] } },
    answer: (v) => {
      const result = (v.a + v.b / 10) * v.c;
      return Math.round(result * 10) / 10;
    },
    distractors: [(v) => Math.round((v.a + v.b / 10) * v.c * 10) / 10 + 1, (v) => v.a * v.c + v.b, (v) => Math.round((v.a + v.b / 10) * v.c / 10)],
    distractorLabels: ['小數點錯位', '整數部分乘對但小數加', '小數點向左錯'],
  },
  {
    id: 'P5-PCT-001', genre: 'computation', grade: 'p5', edbCodes: ['N5-4.1'], difficulty: 3,
    pattern: '{a}% 寫成小數是？',
    variables: { a: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90, 100] },
    answer: (v) => `${v.a / 100}`,
    distractors: [(v) => `${v.a * 100}`, (v) => `${v.a}`, (v) => `${v.a / 10}`],
    distractorLabels: ['乘了100', '沒變', '除以10'],
  },
  {
    id: 'P5-VOLUME-001', genre: 'word-problem', grade: 'p5', edbCodes: ['M5-1.1'], difficulty: 3,
    pattern: '一個長方體長{a}厘米、寬{b}厘米、高{c}厘米，體積是多少立方厘米？',
    variables: { a: { range: [3, 15] }, b: { range: [3, 12] }, c: { range: [2, 10] } },
    answer: (v) => v.a * v.b * v.c,
    distractors: [(v) => v.a + v.b + v.c, (v) => 2 * (v.a * v.b + v.b * v.c + v.a * v.c), (v) => v.a * v.b + v.b * v.c],
    distractorLabels: ['用了加法', '用了表面積公式', '只乘了兩個面'],
  },
  {
    id: 'P5-SPEED-001', genre: 'word-problem', grade: 'p5', edbCodes: ['M5-2.1'], difficulty: 3,
    pattern: '{name}騎自行車每小時行{a}公里，{b}小時可行多少公里？',
    variables: { a: { range: [10, 30] }, b: { range: [2, 6] }, name: ['小明', '小紅', '小華'] },
    answer: (v) => v.a * v.b,
    distractors: [(v) => v.a + v.b, (v) => v.a / v.b, (v) => v.a * v.b + v.a],
    distractorLabels: ['用加法', '用除法', '多算一小時'],
  },

  // ============================
  // P6 (六年级)
  // ============================
  {
    id: 'P6-FRAC-004', genre: 'computation', grade: 'p6', edbCodes: ['N6-3.1'], difficulty: 3,
    pattern: '{a}/{b} ÷ {c} = ?（分數除法）',
    variables: { a: { range: [2, 7] }, b: { range: [3, 9] }, c: { range: [2, 5] } },
    constraint: (v) => v.a % v.c !== 0 || Math.random() > 0.5,
    answer: (v) => `${v.a}/${v.b * v.c}`,
    distractors: [(v) => `${v.a * v.c}/${v.b}`, (v) => `${v.a + v.c}/${v.b}`, (v) => `${v.a}/${v.b + v.c}`],
    distractorLabels: ['乘了倒數的分子', '分子用加法', '分母用加法'],
  },
  {
    id: 'P6-PCT-002', genre: 'word-problem', grade: 'p6', edbCodes: ['N6-4.1'], difficulty: 3,
    pattern: '一件{item}原價${a}元，打{b}折出售，售價是多少元？',
    variables: { a: [50, 80, 100, 120, 150, 200, 250], b: [5, 6, 7, 8, 9], item: ['外套', '運動鞋', '書包', '手錶'] },
    answer: (v) => (v.a * v.b) / 10,
    distractors: [(v) => v.a * (10 - v.b) / 10, (v) => v.a - v.b, (v) => v.a * v.b / 100],
    distractorLabels: ['減了折扣而非價格', '直接減折扣數', '折扣率搞錯'],
  },
  {
    id: 'P6-RATIO-001', genre: 'computation', grade: 'p6', edbCodes: ['N6-5.1'], difficulty: 3,
    pattern: '{a}:{b} = {c}:?，求 ?',
    variables: { a: { range: [2, 8] }, b: { range: [3, 9] } },
    constraint: (v) => {
      const factor = Math.floor(Math.random() * 3) + 2;
      v.c = v.a * factor;
      v._ans = v.b * factor;
      return v._ans <= 50;
    },
    answer: (v) => v._ans,
    distractors: [(v) => v.c * v.b / v.a + 1, (v) => v.c + v.b, (v) => v.c * v.a / v.b],
    distractorLabels: ['比例計算錯', '用加法', '比例方向搞反'],
  },
  {
    id: 'P6-CIRCLE-001', genre: 'word-problem', grade: 'p6', edbCodes: ['M6-1.1'], difficulty: 3,
    pattern: '一個圓的半徑是{a}厘米，圓周是多少厘米？（π取3.14）',
    variables: { a: { range: [3, 15] } },
    answer: (v) => Math.round(2 * 3.14 * v.a * 100) / 100,
    distractors: [(v) => Math.round(3.14 * v.a * v.a * 100) / 100, (v) => Math.round(3.14 * v.a * 100) / 100, (v) => 2 * v.a],
    distractorLabels: ['用了面積公式', '用了半徑乘π', '直徑當周長'],
  },
  {
    id: 'P6-CIRCLE-002', genre: 'word-problem', grade: 'p6', edbCodes: ['M6-1.2'], difficulty: 3,
    pattern: '一個圓的半徑是{a}厘米，面積是多少平方厘米？（π取3.14）',
    variables: { a: { range: [3, 12] } },
    answer: (v) => Math.round(3.14 * v.a * v.a * 100) / 100,
    distractors: [(v) => Math.round(2 * 3.14 * v.a * 100) / 100, (v) => Math.round(3.14 * v.a * 100) / 100, (v) => v.a * v.a],
    distractorLabels: ['用了周長公式', '用半徑乘π', '忘了乘π'],
  },

  // ============================
  // F1-F3 (初中) — 基礎代數/幾何/統計
  // ============================
  {
    id: 'F1-ALGEBRA-001', genre: 'computation', grade: 'f1', edbCodes: ['A1-1.1'], difficulty: 4,
    pattern: '解方程：x + {a} = {b}，x = ?',
    variables: { a: { range: [2, 30] }, b: { range: [10, 50] } },
    constraint: (v) => v.b > v.a,
    answer: (v) => v.b - v.a,
    distractors: [(v) => v.b + v.a, (v) => v.a - v.b, (v) => v.b - v.a + 1],
    distractorLabels: ['移項忘了變號', '方向搞反', '計算錯誤'],
  },
  {
    id: 'F1-ALGEBRA-002', genre: 'computation', grade: 'f1', edbCodes: ['A1-1.1'], difficulty: 4,
    pattern: '解方程：{a}x = {b}，x = ?',
    variables: { a: { range: [2, 9] }, b: { range: [10, 72] } },
    constraint: (v) => v.b % v.a === 0,
    answer: (v) => v.b / v.a,
    distractors: [(v) => v.b * v.a, (v) => v.b - v.a, (v) => Math.floor(v.b / v.a) + 1],
    distractorLabels: ['乘了而非除了', '用減法', '除錯了'],
  },
  {
    id: 'F1-ALGEBRA-003', genre: 'computation', grade: 'f1', edbCodes: ['A1-1.2'], difficulty: 4,
    pattern: '化簡：{a}x + {b}x = ?',
    variables: { a: { range: [2, 10] }, b: { range: [2, 10] } },
    answer: (v) => `${v.a + v.b}x`,
    distractors: [(v) => `${v.a + v.b}x²`, (v) => `${v.a * v.b}x`, (v) => `${v.a + v.b}${v.a + v.b}`],
    distractorLabels: ['x次數搞錯', '係數乘了', '係數寫錯'],
  },
  {
    id: 'F1-NEG-001', genre: 'computation', grade: 'f1', edbCodes: ['A1-2.1'], difficulty: 4,
    pattern: '({a}) + ({b}) = ?（整數加法）',
    variables: { a: { range: [-20, -1] }, b: { range: [-20, 20] } },
    constraint: (v) => v.b !== 0,
    answer: (v) => v.a + v.b,
    distractors: [(v) => Math.abs(v.a + v.b), (v) => v.a - v.b, (v) => Math.abs(v.a) + Math.abs(v.b)],
    distractorLabels: ['取了絕對值', '減法搞錯', '絕對值相加'],
  },
  {
    id: 'F1-GEO-001', genre: 'computation', grade: 'f1', edbCodes: ['G1-1.1'], difficulty: 4,
    pattern: '直角三角形兩直角邊分別為{a}和{b}，斜邊是多少？',
    variables: { a: [3, 5, 6, 7, 8, 9], b: [4, 12, 8, 24, 15, 12, 40] },
    constraint: (v) => {
      const squares = {3:4,5:12,6:8,7:24,8:15,9:12,9:40};
      const result = Math.sqrt(v.a * v.a + v.b * v.b);
      return Number.isInteger(result);
    },
    answer: (v) => Math.sqrt(v.a * v.a + v.b * v.b),
    distractors: [(v) => v.a + v.b, (v) => Math.sqrt(v.a * v.b), (v) => Math.sqrt(v.a * v.a + v.b)],
    distractorLabels: ['直接把邊相加', '以爲是a×b開方', '忘了b要平方'],
  },
  {
    id: 'F1-STATS-001', genre: 'word-problem', grade: 'f1', edbCodes: ['S1-1.1'], difficulty: 3,
    pattern: '{a}、{b}、{c}、{d}、{e} 的平均數是多少？',
    variables: { a: { range: [10, 50] }, b: { range: [10, 50] }, c: { range: [10, 50] }, d: { range: [10, 50] }, e: { range: [10, 50] } },
    answer: (v) => Math.round((v.a + v.b + v.c + v.d + v.e) / 5),
    distractors: [(v) => v.a + v.b + v.c + v.d + v.e, (v) => Math.round((v.a + v.b + v.c + v.d + v.e) / 5) + 1, (v) => Math.round((v.a + v.b + v.c + v.d + v.e) / 3)],
    distractorLabels: ['忘了除以個數', '計算誤差', '除以3而非5'],
  },
  {
    id: 'F2-ALGEBRA-001', genre: 'computation', grade: 'f2', edbCodes: ['A2-1.1'], difficulty: 4,
    pattern: '展開：({a}x + {b})({c}x + {d}) = ?',
    variables: { a: { range: [1, 5] }, b: { range: [-5, 5] }, c: { range: [1, 5] }, d: { range: [-5, 5] } },
    constraint: (v) => v.b !== 0 && v.d !== 0,
    answer: (v) => {
      const a2 = v.a * v.c;
      const ab = v.a * v.d + v.b * v.c;
      const b2 = v.b * v.d;
      let result = '';
      if (a2 !== 1) result += a2;
      result += 'x²';
      if (ab > 0) result += `+${ab}x`; else if (ab < 0) result += `${ab}x`; else if (ab === 0) result += '';
      if (b2 > 0) result += `+${b2}`; else if (b2 < 0) result += `${b2}`;
      return result;
    },
    distractors: [(v) => {
      const a2 = v.a * v.c;
      const b2 = v.b * v.d;
      let r = '';
      if (a2 !== 1) r += a2;
      r += 'x²';
      const ab = v.a * v.d + v.b * v.c;
      if (ab > 0) r += `+${ab}x`; else if (ab < 0) r += `${ab}x`;
      if (b2 > 0) r += `+${b2}`; else if (b2 < 0) r += `${b2}`;
      return r + 'x'; // extra x
    }, (v) => `${v.a * v.c}x²+${v.b * v.d}`, (v) => {
      const sum = v.a + v.b + v.c + v.d;
      return `${sum}x²+${sum}x+${sum}`;
    }],
    distractorLabels: ['多寫了個x', '只乘了首尾', '全部加起來'],
  },
  {
    id: 'F2-PYTHAG-001', genre: 'computation', grade: 'f2', edbCodes: ['G2-1.1'], difficulty: 4,
    pattern: '直角三角形的斜邊是{c}，一條直角邊是{a}，另一條直角邊是？',
    variables: { a: [5, 6, 7, 8, 9, 10, 12], c: [13, 10, 25, 17, 15, 26, 20] },
    constraint: (v) => {
      const b = Math.sqrt(v.c * v.c - v.a * v.a);
      return Number.isInteger(b);
    },
    answer: (v) => Math.sqrt(v.c * v.c - v.a * v.a),
    distractors: [(v) => v.c - v.a, (v) => Math.sqrt(v.c * v.c + v.a * v.a), (v) => Math.sqrt(v.c - v.a)],
    distractorLabels: ['直接用減法', '用了加法', '忘了平方'],
  },
  {
    id: 'F3-INEQ-001', genre: 'computation', grade: 'f3', edbCodes: ['A3-1.1'], difficulty: 5,
    pattern: '解不等式：{a}x + {b} > {c}，x 的範圍是？',
    variables: { a: { range: [2, 5] }, b: { range: [-10, 20] }, c: { range: [10, 30] } },
    constraint: (v) => v.a > 0,
    answer: (v) => `x > ${(v.c - v.b) / v.a}`,
    distractors: [(v) => `x < ${(v.c - v.b) / v.a}`, (v) => `x < ${(v.c + v.b) / v.a}`, (v) => `x > ${(v.c + v.b) / v.a}`],
    distractorLabels: ['移項忘了變方向', '移項符號錯了', '計算錯誤'],
  },
  {
    id: 'F3-SIMUL-001', genre: 'computation', grade: 'f3', edbCodes: ['A3-2.1'], difficulty: 5,
    pattern: '解方程組：x + y = {a}，x - y = {b}，求 x',
    variables: { a: { range: [5, 30] }, b: { range: [-10, 10] } },
    constraint: (v) => (v.a + v.b) % 2 === 0 && v.a !== v.b,
    answer: (v) => (v.a + v.b) / 2,
    distractors: [(v) => (v.a - v.b) / 2, (v) => v.a - v.b, (v) => (v.a + v.b) / 2 + 1],
    distractorLabels: ['兩式相減而非相加', '直接相減', '計算誤差'],
  },
];

// 按年级获取模板
export function getTemplatesByGrade(grade) {
  return mathTemplates.filter(t => t.grade === grade);
}

// 获取所有涉及的年级
export function getAvailableGrades() {
  return [...new Set(mathTemplates.map(t => t.grade))].sort();
}

// 统计每个年级的模板数量
export function getTemplateStats() {
  const stats = {};
  for (const t of mathTemplates) {
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
