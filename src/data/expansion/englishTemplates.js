// 英語題目模板庫 (P1-F3)
// 每個模板透過 patternFn 可生成數十到上百道不同變項的題目
// 組織方式：按年級分組，每組分 grammar / vocabulary / spelling / reading / sentence

export const englishTemplates = [
  // ============================
  // P1 (一年級) — 基礎詞彙、簡單動詞、代名詞、複數、基本句子
  // ============================
  {
    id: 'EN-P1-VOC-001', genre: 'computation', grade: 'p1', edbCodes: ['EN1-2.1'], difficulty: 1,
    patternFn: (v) => `What color is the ${v.color}? — It is _____.`,
    variables: { color: ['red', 'blue', 'green', 'yellow', 'orange', 'purple'] },
    answer: (v) => v.color,
    distractors: [(v) => ({ red: 'blue', blue: 'green', green: 'red', yellow: 'orange', orange: 'purple', purple: 'black' })[v.color] || 'white'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white'];
      const others = all.filter(c => c !== v.color).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.color, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P1-VOC-002', genre: 'word-problem', grade: 'p1', edbCodes: ['EN1-2.2'], difficulty: 1,
    patternFn: (v) => `What is this animal? — It is a _____.`,
    variables: { animal: ['cat', 'dog', 'fish', 'bird', 'rabbit', 'duck'] },
    answer: (v) => v.animal,
    distractors: [(v) => ({ cat: 'dog', dog: 'cat', fish: 'bird', bird: 'fish', rabbit: 'duck', duck: 'rabbit' })[v.animal] || 'pig'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['cat', 'dog', 'fish', 'bird', 'rabbit', 'duck', 'pig', 'cow'];
      const others = all.filter(a => a !== v.animal).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.animal, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P1-VOC-003', genre: 'computation', grade: 'p1', edbCodes: ['EN1-2.3'], difficulty: 1,
    patternFn: (v) => `I like to eat _____.`,
    variables: { food: ['rice', 'bread', 'cake', 'egg', 'apple', 'fish'] },
    answer: (v) => v.food,
    distractors: [(v) => ({ rice: 'bread', bread: 'cake', cake: 'rice', egg: 'milk', apple: 'banana', fish: 'meat' })[v.food] || 'juice'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['rice', 'bread', 'cake', 'egg', 'apple', 'fish', 'milk', 'banana', 'meat', 'juice'];
      const others = all.filter(f => f !== v.food).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.food, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P1-GRAM-001', genre: 'computation', grade: 'p1', edbCodes: ['EN1-1.1'], difficulty: 1,
    patternFn: (v) => `I ${v.verb} _____ every day.`,
    variables: { verb: ['eat', 'play', 'read', 'sing', 'run', 'draw'] },
    answer: (v) => v.verb,
    distractors: [(v) => `${v.verb}s`, (v) => `${v.verb}ing`, (v) => `${v.verb}ed`],
    distractorLabels: ['加了s', '加了ing', '加了ed'],
    _getOptions: (v) => {
      const forms = [v.verb, `${v.verb}s`, `${v.verb}ing`, `${v.verb}ed`];
      return forms.sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P1-GRAM-002', genre: 'computation', grade: 'p1', edbCodes: ['EN1-1.2'], difficulty: 1,
    patternFn: (v) => `_____ am a student.`,
    variables: {},
    answer: () => 'I',
    distractors: [() => 'He', () => 'She', () => 'They'],
    distractorLabels: ['用了He', '用了She', '用了They'],
    _getOptions: () => ['I', 'He', 'She', 'They'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P1-GRAM-003', genre: 'computation', grade: 'p1', edbCodes: ['EN1-1.3'], difficulty: 1,
    patternFn: (v) => `I have two _____.`,
    variables: { noun: ['book', 'pen', 'apple', 'dog', 'cat', 'ball'] },
    answer: (v) => `${v.noun}s`,
    distractors: [(v) => v.noun, (v) => `${v.noun}es`, (v) => `${v.noun}ies`],
    distractorLabels: ['忘了加s', '多加了e', '用了ies'],
    _getOptions: (v) => [`${v.noun}s`, v.noun, `${v.noun}es`, `${v.noun}ies`].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P1-SPELL-001', genre: 'computation', grade: 'p1', edbCodes: ['EN1-3.1'], difficulty: 1,
    patternFn: (v) => `Which is spelled correctly?`,
    variables: { word: ['cat', 'dog', 'sun', 'hat', 'bus', 'cup'] },
    answer: (v) => v.word,
    distractors: [(v) => v.word.slice(0, -1) + v.word.slice(-1).repeat(2), (v) => v.word.replace(/[aeiou]/, 'x'), (v) => v.word.split('').reverse().join('')],
    distractorLabels: ['多了字母', '換了元音', '字母反了'],
    _getOptions: (v) => {
      const correct = v.word;
      const d1 = v.word.slice(0, -1) + v.word.slice(-1).repeat(2);
      const d2 = v.word.replace(/[aeiou]/, 'i');
      const d3 = v.word.length > 2 ? v.word[0] + v.word.slice(2) + v.word[1] : v.word + 'x';
      return [correct, d1, d2, d3].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P1-SENT-001', genre: 'word-problem', grade: 'p1', edbCodes: ['EN1-4.1'], difficulty: 1,
    patternFn: (v) => `Put the words in order: "${v.w1} / ${v.w2} / ${v.w3}"`,
    variables: {
      w1: ['I', 'The cat', 'She'],
      w2: ['like', 'is', 'play'],
      w3: ['apples.', 'big.', 'football.'],
    },
    constraint: (v) => {
      v._sentence = `${v.w1} ${v.w2} ${v.w3}`;
      return true;
    },
    answer: (v) => v._sentence,
    distractors: [(v) => `${v.w3} ${v.w2} ${v.w1}`, (v) => `${v.w2} ${v.w1} ${v.w3}`, (v) => `${v.w1} ${v.w3} ${v.w2}`],
    distractorLabels: ['順序全反', '動詞放最前', '位置互換'],
    _getOptions: (v) => {
      const s = `${v.w1} ${v.w2} ${v.w3}`;
      return [s, `${v.w3} ${v.w2} ${v.w1}`, `${v.w2} ${v.w1} ${v.w3}`, `${v.w1} ${v.w3} ${v.w2}`].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P1-VOC-004', genre: 'computation', grade: 'p1', edbCodes: ['EN1-2.4'], difficulty: 1,
    patternFn: (v) => `How many ${v.thing} are there? — There are _____.`,
    variables: { thing: ['cats', 'apples', 'balls', 'stars'] },
    answer: () => 'three',
    distractors: [() => 'tree', () => 'free', () => 'there'],
    distractorLabels: ['tree', 'free', 'there'],
    _getOptions: () => ['three', 'tree', 'free', 'there'].sort(() => Math.random() - 0.5),
  },

  // ============================
  // P2 (二年級) — 現在簡單式、介詞、家庭/學校詞彙、形容詞、短閱讀
  // ============================
  {
    id: 'EN-P2-GRAM-001', genre: 'computation', grade: 'p2', edbCodes: ['EN2-1.1'], difficulty: 1,
    patternFn: (v) => `She ${v.verb}s _____ every morning.`,
    variables: { verb: ['walk', 'brush', 'wash', 'read', 'cook'] },
    answer: (v) => `${v.verb}s`,
    distractors: [(v) => v.verb, (v) => `${v.verb}ing`, (v) => `${v.verb}ed`],
    distractorLabels: ['忘了加s', '加了ing', '加了ed'],
    _getOptions: (v) => {
      const forms = [`${v.verb}s`, v.verb, `${v.verb}ing`, `${v.verb}ed`];
      return forms.sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P2-GRAM-002', genre: 'computation', grade: 'p2', edbCodes: ['EN2-1.2'], difficulty: 1,
    patternFn: (v) => `The book is _____ the table.`,
    variables: { prep: ['on', 'in', 'under', 'behind'] },
    answer: (v) => v.prep,
    distractors: [(v) => ({ on: 'in', in: 'on', under: 'behind', behind: 'under' })[v.prep] || 'at'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['on', 'in', 'under', 'behind', 'at', 'near', 'between'];
      const others = all.filter(p => p !== v.prep).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.prep, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P2-VOC-001', genre: 'computation', grade: 'p2', edbCodes: ['EN2-2.1'], difficulty: 1,
    patternFn: (v) => `My _____ is a doctor.`,
    variables: { family: ['father', 'mother', 'sister', 'brother', 'grandmother'] },
    answer: (v) => v.family,
    distractors: [(v) => ({ father: 'mother', mother: 'father', sister: 'brother', brother: 'sister', grandmother: 'grandfather' })[v.family] || 'friend'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['father', 'mother', 'sister', 'brother', 'grandmother', 'grandfather', 'uncle', 'aunt'];
      const others = all.filter(f => f !== v.family).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.family, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P2-VOC-002', genre: 'computation', grade: 'p2', edbCodes: ['EN2-2.2'], difficulty: 1,
    patternFn: (v) => `We write with a _____.`,
    variables: { item: ['pencil', 'ruler', 'eraser', 'book', 'bag'] },
    answer: (v) => v.item,
    distractors: [(v) => ({ pencil: 'pen', ruler: 'pencil', eraser: 'ruler', book: 'pencil', bag: 'book' })[v.item] || 'crayon'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['pencil', 'ruler', 'eraser', 'book', 'bag', 'pen', 'crayon', 'chalk'];
      const others = all.filter(i => i !== v.item).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.item, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P2-GRAM-003', genre: 'computation', grade: 'p2', edbCodes: ['EN2-1.3'], difficulty: 1,
    patternFn: (v) => `The ${v.noun} is _____.`,
    variables: { noun: ['sun', 'ice', 'grass', 'sky', 'snow'], adj: ['hot', 'cold', 'green', 'blue', 'white'] },
    constraint: (v) => {
      v._map = { sun: 'hot', ice: 'cold', grass: 'green', sky: 'blue', snow: 'white' };
      return true;
    },
    answer: (v) => v._map[v.noun],
    distractors: [(v) => ({ hot: 'cold', cold: 'hot', green: 'blue', blue: 'green', white: 'black' })[v._map[v.noun]] || 'big'],
    distractorLabels: ['相反的形容詞'],
    _getOptions: (v) => {
      const correct = v._map[v.noun];
      const adjs = ['hot', 'cold', 'green', 'blue', 'white', 'big', 'small', 'tall', 'short'];
      const others = adjs.filter(a => a !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      return [correct, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P2-READ-001', genre: 'word-problem', grade: 'p2', edbCodes: ['EN2-5.1'], difficulty: 2,
    patternFn: (v) => `Tom has a cat. The cat is white. Tom likes his cat.\n\nQ: What color is Tom's cat?`,
    variables: {},
    answer: () => 'white',
    distractors: [() => 'black', () => 'brown', () => 'orange'],
    distractorLabels: ['黑色', '棕色', '橙色'],
    _getOptions: () => ['white', 'black', 'brown', 'orange'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P2-SENT-001', genre: 'word-problem', grade: 'p2', edbCodes: ['EN2-4.1'], difficulty: 1,
    patternFn: (v) => `Find the error: "She play football every day."`,
    variables: {},
    answer: () => 'play → plays',
    distractors: [() => 'football → the football', () => 'every day → yesterday', () => 'No error'],
    distractorLabels: ['加了the', '改了時態', '以為沒錯'],
    _getOptions: () => ['play → plays', 'football → the football', 'every day → yesterday', 'No error'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P2-SPELL-001', genre: 'computation', grade: 'p2', edbCodes: ['EN2-3.1'], difficulty: 1,
    patternFn: (v) => `Fill in the missing letter: b__k (a book)`,
    variables: {},
    answer: () => 'oo',
    distractors: [() => 'ou', () => 'oa', () => 'eu'],
    distractorLabels: ['ou', 'oa', 'eu'],
    _getOptions: () => ['oo', 'ou', 'oa', 'eu'].sort(() => Math.random() - 0.5),
  },

  {
    id: 'EN-P2-GRAM-004', genre: 'computation', grade: 'p2', edbCodes: ['EN2-1.4'], difficulty: 1,
    patternFn: (v) => `_____ does not like milk.`,
    variables: {},
    answer: () => 'He',
    distractors: [() => 'They', () => 'We', () => 'I'],
    distractorLabels: ['用了複數', '用了We', '用了I'],
    _getOptions: () => ['He', 'They', 'We', 'I'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P2-VOC-003', genre: 'computation', grade: 'p2', edbCodes: ['EN2-2.3'], difficulty: 1,
    patternFn: (v) => `We learn to read and write at _____.`,
    variables: {},
    answer: () => 'school',
    distractors: [() => 'home', () => 'park', () => 'hospital'],
    distractorLabels: ['家', '公園', '醫院'],
    _getOptions: () => ['school', 'home', 'park', 'hospital'].sort(() => Math.random() - 0.5),
  },

  // ============================
  // P3 (三年級) — 進行式、過去式、冠詞、天氣/衣物、比較級、拼字
  // ============================
  {
    id: 'EN-P3-GRAM-001', genre: 'computation', grade: 'p3', edbCodes: ['EN3-1.1'], difficulty: 2,
    patternFn: (v) => `Look! The ${v.animal} is _____ right now.`,
    variables: { animal: ['cat', 'dog', 'bird', 'rabbit', 'duck'], verb: ['sleep', 'run', 'fly', 'eat', 'swim'] },
    answer: (v) => `${v.verb}ing`,
    distractors: [(v) => v.verb, (v) => `${v.verb}s`, (v) => `is ${v.verb}`],
    distractorLabels: ['用了原型', '用了第三人稱', '漏了ing'],
    _getOptions: (v) => {
      const forms = [`${v.verb}ing`, v.verb, `${v.verb}s`, `is ${v.verb}`];
      return forms.sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P3-GRAM-002', genre: 'computation', grade: 'p3', edbCodes: ['EN3-1.2'], difficulty: 2,
    patternFn: (v) => `Yesterday, I _____ to the park.`,
    variables: { verb: ['walk', 'play', 'visit', 'go', 'run'] },
    answer: (v) => ({ walk: 'walked', play: 'played', visit: 'visited', go: 'went', run: 'ran' })[v.verb],
    distractors: [(v) => v.verb, (v) => `${v.verb}s`, (v) => `${v.verb}ing`],
    distractorLabels: ['用了原型', '用了現在式', '用了進行式'],
    _getOptions: (v) => {
      const past = ({ walk: 'walked', play: 'played', visit: 'visited', go: 'went', run: 'ran' })[v.verb];
      const forms = [past, v.verb, `${v.verb}s`, `${v.verb}ing`];
      return forms.sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P3-GRAM-003', genre: 'computation', grade: 'p3', edbCodes: ['EN3-1.3'], difficulty: 2,
    patternFn: (v) => `I have _____ ${v.word}.`,
    variables: { word: ['apple', 'orange', 'banana', 'book', 'pen', 'umbrella'] },
    answer: (v) => ['apple', 'orange', 'umbrella'].includes(v.word) ? 'an' : 'a',
    distractors: [(v) => ['apple', 'orange', 'umbrella'].includes(v.word) ? 'a' : 'an', () => 'the', () => 'some'],
    distractorLabels: ['元音前用了a', '用了the', '用了some'],
    _getOptions: (v) => {
      const correct = ['apple', 'orange', 'umbrella'].includes(v.word) ? 'an' : 'a';
      const wrong = correct === 'an' ? 'a' : 'an';
      return [correct, wrong, 'the', 'some'].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P3-VOC-001', genre: 'computation', grade: 'p3', edbCodes: ['EN3-2.1'], difficulty: 2,
    patternFn: (v) => `It is cold. Put on your _____.`,
    variables: { cloth: ['coat', 'hat', 'scarf', 'gloves', 'boots'] },
    answer: (v) => v.cloth,
    distractors: [(v) => ({ coat: 'jacket', hat: 'cap', scarf: 'gloves', gloves: 'scarf', boots: 'shoes' })[v.cloth] || 'shirt'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['coat', 'hat', 'scarf', 'gloves', 'boots', 'jacket', 'cap', 'shoes', 'shirt', 'shorts'];
      const others = all.filter(c => c !== v.cloth).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.cloth, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P3-VOC-002', genre: 'computation', grade: 'p3', edbCodes: ['EN3-2.2'], difficulty: 2,
    patternFn: (v) => `Today the weather is _____.`,
    variables: { weather: ['sunny', 'rainy', 'cloudy', 'windy', 'snowy'] },
    answer: (v) => v.weather,
    distractors: [(v) => ({ sunny: 'hot', rainy: 'wet', cloudy: 'foggy', windy: 'cold', snowy: 'freezing' })[v.weather] || 'warm'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['sunny', 'rainy', 'cloudy', 'windy', 'snowy', 'hot', 'cold', 'wet', 'foggy'];
      const others = all.filter(w => w !== v.weather).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.weather, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P3-GRAM-004', genre: 'computation', grade: 'p3', edbCodes: ['EN3-1.4'], difficulty: 2,
    patternFn: (v) => `An elephant is _____ than a mouse.`,
    variables: {},
    answer: () => 'bigger',
    distractors: [() => 'big', () => 'more big', () => 'biggest'],
    distractorLabels: ['用了原級', '用了more', '用了最高級'],
    _getOptions: () => ['bigger', 'big', 'more big', 'biggest'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P3-READ-001', genre: 'word-problem', grade: 'p3', edbCodes: ['EN3-5.1'], difficulty: 2,
    patternFn: (v) => `Mary goes to school at 8 o'clock. She has lunch at 12 o'clock. She goes home at 3 o'clock.\n\nQ: When does Mary have lunch?`,
    variables: {},
    answer: () => '12 o\'clock',
    distractors: [() => '8 o\'clock', () => '3 o\'clock', () => '10 o\'clock'],
    distractorLabels: ['混淆上學時間', '混淆回家時間', '無中生有'],
    _getOptions: () => ['12 o\'clock', '8 o\'clock', '3 o\'clock', '10 o\'clock'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P3-SPELL-001', genre: 'computation', grade: 'p3', edbCodes: ['EN3-3.1'], difficulty: 2,
    patternFn: (v) => `Which is the correct spelling?`,
    variables: { word: ['beautiful', 'because', 'friend', 'people', 'school', 'house'] },
    answer: (v) => v.word,
    distractors: [(v) => v.word.replace('eau', 'uea'), (v) => v.word.replace('ie', 'ei'), (v) => v.word.slice(0, -1) + 'h'],
    distractorLabels: ['字母順序錯', 'ie/ei搞反', '尾字母錯'],
    _getOptions: (v) => {
      const correct = v.word;
      const wMap = {
        beautiful: ['beautful', 'beautifull', 'beatiful'],
        because: ['becuase', 'becase', 'becouse'],
        friend: ['freind', 'frend', 'friendd'],
        people: ['peopel', 'peple', 'poeple'],
        school: ['shcool', 'scool', 'schooll'],
        house: ['hous', 'houes', 'huose'],
      };
      const wrongs = (wMap[v.word] || ['wrod1', 'wrod2', 'wrod3']).sort(() => Math.random() - 0.5).slice(0, 3);
      return [correct, ...wrongs].sort(() => Math.random() - 0.5);
    },
  },

  {
    id: 'EN-P3-READ-002', genre: 'word-problem', grade: 'p3', edbCodes: ['EN3-5.2'], difficulty: 2,
    patternFn: (v) => `Last Sunday, Tim and his family went to the beach. They swam in the sea and built a sandcastle. Tim found a beautiful shell.\n\nQ: What did Tim find at the beach?`,
    variables: {},
    answer: () => 'A beautiful shell',
    distractors: [() => 'A fish', () => 'A starfish', () => 'A crab'],
    distractorLabels: ['魚', '海星', '螃蟹'],
    _getOptions: () => ['A beautiful shell', 'A fish', 'A starfish', 'A crab'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P3-VOC-003', genre: 'computation', grade: 'p3', edbCodes: ['EN3-2.3'], difficulty: 2,
    patternFn: (v) => `The opposite of "hot" is _____.`,
    variables: {},
    answer: () => 'cold',
    distractors: [() => 'warm', () => 'cool', () => 'wet'],
    distractorLabels: ['暖', '涼', '濕'],
    _getOptions: () => ['cold', 'warm', 'cool', 'wet'].sort(() => Math.random() - 0.5),
  },

  // ============================
  // P4 (四年級) — 未來式、副詞、地點/嗜好詞彙、過去進行式、句子結構
  // ============================
  {
    id: 'EN-P4-GRAM-001', genre: 'computation', grade: 'p4', edbCodes: ['EN4-1.1'], difficulty: 2,
    patternFn: (v) => `Tomorrow, we _____ to the beach.`,
    variables: { verb: ['go', 'travel', 'walk', 'drive', 'fly'] },
    answer: (v) => `will ${v.verb}`,
    distractors: [(v) => `${v.verb}ed`, (v) => `${v.verb}s`, (v) => `will ${v.verb}ing`],
    distractorLabels: ['用了過去式', '用了現在式', '用了will+ing'],
    _getOptions: (v) => [`will ${v.verb}`, `${v.verb}ed`, `${v.verb}s`, `will ${v.verb}ing`].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P4-GRAM-002', genre: 'computation', grade: 'p4', edbCodes: ['EN4-1.2'], difficulty: 2,
    patternFn: (v) => `She _____ TV when I called her.`,
    variables: { verb: ['watch', 'read', 'cook', 'play', 'write'] },
    answer: (v) => `was ${v.verb}ing`,
    distractors: [(v) => `${v.verb}ed`, (v) => `is ${v.verb}ing`, (v) => `${v.verb}s`],
    distractorLabels: ['用了過去式', '用了現在is', '用了現在式'],
    _getOptions: (v) => [`was ${v.verb}ing`, `${v.verb}ed`, `is ${v.verb}ing`, `${v.verb}s`].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P4-GRAM-003', genre: 'computation', grade: 'p4', edbCodes: ['EN4-1.3'], difficulty: 2,
    patternFn: (v) => `She runs _____ than her brother.`,
    variables: { adv: ['faster', 'more quickly', 'better', 'more slowly'] },
    answer: (v) => v.adv,
    distractors: [(v) => ({ faster: 'fast', 'more quickly': 'quickly', better: 'good', 'more slowly': 'slowly' })[v.adv] || 'fast'],
    distractorLabels: ['用了原級'],
    _getOptions: (v) => {
      const correct = v.adv;
      const all = ['faster', 'fast', 'more quickly', 'quickly', 'better', 'good', 'more slowly', 'slowly'];
      const others = all.filter(a => a !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      return [correct, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P4-VOC-001', genre: 'computation', grade: 'p4', edbCodes: ['EN4-2.1'], difficulty: 2,
    patternFn: (v) => `I like to _____ in my free time. It is my hobby.`,
    variables: { hobby: ['swim', 'paint', 'dance', 'cook', 'garden'] },
    answer: (v) => v.hobby,
    distractors: [(v) => ({ swim: 'swimming', paint: 'painting', dance: 'dancing', cook: 'cooking', garden: 'gardening' })[v.hobby] || 'run'],
    distractorLabels: ['用了ing形式'],
    _getOptions: (v) => {
      const all = ['swim', 'paint', 'dance', 'cook', 'garden', 'swimming', 'painting', 'dancing', 'cooking', 'gardening', 'run', 'read'];
      const others = all.filter(h => h !== v.hobby).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.hobby, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P4-VOC-002', genre: 'computation', grade: 'p4', edbCodes: ['EN4-2.2'], difficulty: 2,
    patternFn: (v) => `We can buy food at the _____.`,
    variables: { place: ['supermarket', 'library', 'hospital', 'bakery', 'post office'] },
    answer: (v) => v.place,
    distractors: [(v) => ({ supermarket: 'market', library: 'bookshop', hospital: 'clinic', bakery: 'restaurant', 'post office': 'bank' })[v.place] || 'school'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['supermarket', 'library', 'hospital', 'bakery', 'post office', 'market', 'bookshop', 'clinic', 'restaurant', 'bank'];
      const others = all.filter(p => p !== v.place).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.place, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P4-SENT-001', genre: 'word-problem', grade: 'p4', edbCodes: ['EN4-4.1'], difficulty: 2,
    patternFn: (v) => `Rearrange: "${v.w1} / ${v.w2} / ${v.w3} / ${v.w4}"`,
    variables: {
      w1: ['My mother', 'The students', 'I'],
      w2: ['bought', 'are reading', 'will visit'],
      w3: ['a new', 'their', 'the'],
      w4: ['dress.', 'books.', 'museum.'],
    },
    constraint: (v) => {
      v._sentence = `${v.w1} ${v.w2} ${v.w3} ${v.w4}`;
      return true;
    },
    answer: (v) => v._sentence,
    distractors: [(v) => `${v.w4} ${v.w3} ${v.w2} ${v.w1}`, (v) => `${v.w2} ${v.w1} ${v.w3} ${v.w4}`, (v) => `${v.w1} ${v.w3} ${v.w2} ${v.w4}`],
    distractorLabels: ['完全反序', '動詞在前', '中間交換'],
    _getOptions: (v) => {
      const s = v._sentence;
      return [s, `${v.w4} ${v.w3} ${v.w2} ${v.w1}`, `${v.w2} ${v.w1} ${v.w3} ${v.w4}`, `${v.w1} ${v.w3} ${v.w2} ${v.w4}`].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P4-READ-001', genre: 'word-problem', grade: 'p4', edbCodes: ['EN4-5.1'], difficulty: 2,
    patternFn: (v) => `Peter is a student. He gets up at 7 a.m. every day. He brushes his teeth and eats breakfast. Then he walks to school with his friend, Jack.\n\nQ: Who does Peter go to school with?`,
    variables: {},
    answer: () => 'Jack',
    distractors: [() => 'His mother', () => 'His teacher', () => 'Nobody'],
    distractorLabels: ['媽媽', '老師', '自己'],
    _getOptions: () => ['Jack', 'His mother', 'His teacher', 'Nobody'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P4-SPELL-001', genre: 'computation', grade: 'p4', edbCodes: ['EN4-3.1'], difficulty: 2,
    patternFn: (v) => `Which word has a silent letter?`,
    variables: {},
    answer: () => 'knife',
    distractors: [() => 'cat', () => 'dog', () => 'sun'],
    distractorLabels: ['cat', 'dog', 'sun'],
    _getOptions: () => ['knife', 'cat', 'dog', 'sun'].sort(() => Math.random() - 0.5),
  },

  {
    id: 'EN-P4-GRAM-004', genre: 'computation', grade: 'p4', edbCodes: ['EN4-1.4'], difficulty: 2,
    patternFn: (v) => `Choose the correct word: I can _____ (their / there) house from here.`,
    variables: {},
    answer: () => 'their',
    distractors: [() => 'there', () => 'they\'re', () => 'thier'],
    distractorLabels: ['同音異義', 'they\'re', '拼錯'],
    _getOptions: () => ['their', 'there', 'they\'re', 'thier'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P4-READ-002', genre: 'word-problem', grade: 'p4', edbCodes: ['EN4-5.2'], difficulty: 2,
    patternFn: (v) => `Amy's favourite subject is Science. She likes doing experiments. Last week, she grew a bean plant. It grew 5 cm in one week.\n\nQ: How much did Amy's bean plant grow in one week?`,
    variables: {},
    answer: () => '5 cm',
    distractors: [() => '3 cm', () => '10 cm', () => '1 cm'],
    distractorLabels: ['3公分', '10公分', '1公分'],
    _getOptions: () => ['5 cm', '3 cm', '10 cm', '1 cm'].sort(() => Math.random() - 0.5),
  },

  // ============================
  // P5 (五年級) — 現在完成式、連接詞、被動語態、飲食/旅行詞彙、閱讀理解
  // ============================
  {
    id: 'EN-P5-GRAM-001', genre: 'computation', grade: 'p5', edbCodes: ['EN5-1.1'], difficulty: 3,
    patternFn: (v) => `I have _____ ${v.verb} this movie before.`,
    variables: { verb: ['see', 'watch', 'read', 'hear', 'visit'] },
    answer: (v) => ({ see: 'seen', watch: 'watched', read: 'read', hear: 'heard', visit: 'visited' })[v.verb],
    distractors: [(v) => `${v.verb}ed`, (v) => `${v.verb}s`, (v) => v.verb],
    distractorLabels: ['用了簡單過去', '用了現在式', '用了原型'],
    _getOptions: (v) => {
      const pp = ({ see: 'seen', watch: 'watched', read: 'read', hear: 'heard', visit: 'visited' })[v.verb];
      return [pp, `${v.verb}ed`, `${v.verb}s`, v.verb].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P5-GRAM-002', genre: 'computation', grade: 'p5', edbCodes: ['EN5-1.2'], difficulty: 3,
    patternFn: (v) => `The ${v.food} _____ by the chef yesterday.`,
    variables: { food: ['cake', 'bread', 'pizza', 'cookie', 'sandwich'], verb: ['make', 'bake', 'cook', 'prepare', 'eat'] },
    answer: (v) => `was ${v.verb}n`.replace('was maken', 'was made').replace('was eatn', 'was eaten').replace('was taken', 'was taken'),
    distractors: [(v) => `${v.verb}s`, (v) => `is ${v.verb}ed`, (v) => `${v.verb}ing`],
    distractorLabels: ['用了主動式', '用了現在is', '用了進行式'],
    _getOptions: (v) => {
      const passMap = { make: 'was made', bake: 'was baked', cook: 'was cooked', prepare: 'was prepared', eat: 'was eaten' };
      const correct = passMap[v.verb];
      return [correct, `${v.verb}s`, `is ${v.verb}ed`, `${v.verb}ing`].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P5-GRAM-003', genre: 'computation', grade: 'p5', edbCodes: ['EN5-1.3'], difficulty: 3,
    patternFn: (v) => `I like apples _____ I don't like bananas.`,
    variables: { conj: ['but', 'and', 'or', 'so'] },
    answer: (v) => v.conj,
    distractors: [(v) => ({ but: 'and', and: 'but', or: 'and', so: 'but' })[v.conj] || 'because'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['but', 'and', 'or', 'so', 'because', 'although'];
      const others = all.filter(c => c !== v.conj).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.conj, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P5-VOC-001', genre: 'computation', grade: 'p5', edbCodes: ['EN5-2.1'], difficulty: 3,
    patternFn: (v) => `I'd like some ${v.drink} with my meal.`,
    variables: { drink: ['water', 'juice', 'milk', 'tea', 'coffee'] },
    answer: (v) => v.drink,
    distractors: [(v) => ({ water: 'juice', juice: 'water', milk: 'cream', tea: 'coffee', coffee: 'tea' })[v.drink] || 'soda'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['water', 'juice', 'milk', 'tea', 'coffee', 'soda', 'lemonade', 'cream'];
      const others = all.filter(d => d !== v.drink).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.drink, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P5-VOC-002', genre: 'computation', grade: 'p5', edbCodes: ['EN5-2.2'], difficulty: 3,
    patternFn: (v) => `We took a _____ to the island.`,
    variables: { travel: ['ferry', 'plane', 'train', 'bus', 'boat'] },
    answer: (v) => v.travel,
    distractors: [(v) => ({ ferry: 'boat', plane: 'helicopter', train: 'metro', bus: 'taxi', boat: 'ferry' })[v.travel] || 'car'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['ferry', 'plane', 'train', 'bus', 'boat', 'helicopter', 'metro', 'taxi', 'car'];
      const others = all.filter(t => t !== v.travel).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.travel, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P5-READ-001', genre: 'word-problem', grade: 'p5', edbCodes: ['EN5-5.1'], difficulty: 3,
    patternFn: (v) => `Last summer, Lisa went to Japan with her family. They visited Tokyo and ate sushi. Lisa bought a kimono for her friend.\n\nQ: What did Lisa buy for her friend?`,
    variables: {},
    answer: () => 'A kimono',
    distractors: [() => 'Sushi', () => 'A book', () => 'A toy'],
    distractorLabels: ['壽司', '書', '玩具'],
    _getOptions: () => ['A kimono', 'Sushi', 'A book', 'A toy'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P5-SENT-001', genre: 'word-problem', grade: 'p5', edbCodes: ['EN5-4.1'], difficulty: 3,
    patternFn: (v) => `Find the error: "She have went to the store yesterday."`,
    variables: {},
    answer: () => 'have went → went',
    distractors: [() => 'the store → store', () => 'yesterday → tomorrow', () => 'No error'],
    distractorLabels: ['去掉the', '改了時間', '以為沒錯'],
    _getOptions: () => ['have went → went', 'the store → store', 'yesterday → tomorrow', 'No error'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P5-SPELL-001', genre: 'computation', grade: 'p5', edbCodes: ['EN5-3.1'], difficulty: 3,
    patternFn: (v) => `Which word is a noun form of "${v.verb}"?`,
    variables: { verb: ['teach', 'act', 'build', 'sing', 'think'] },
    answer: (v) => ({ teach: 'teacher', act: 'actor', build: 'builder', sing: 'singer', think: 'thinker' })[v.verb],
    distractors: [(v) => `${v.verb}ing`, (v) => `${v.verb}ed`, (v) => `${v.verb}s`],
    distractorLabels: ['加了ing', '加了ed', '加了s'],
    _getOptions: (v) => {
      const nounMap = { teach: 'teacher', act: 'actor', build: 'builder', sing: 'singer', think: 'thinker' };
      const correct = nounMap[v.verb];
      return [correct, `${v.verb}ing`, `${v.verb}ed`, `${v.verb}s`].sort(() => Math.random() - 0.5);
    },
  },

  {
    id: 'EN-P5-VOC-003', genre: 'computation', grade: 'p5', edbCodes: ['EN5-2.3'], difficulty: 3,
    patternFn: (v) => `Which word belongs to the same family as "${v.base}"?`,
    variables: { base: ['teach', 'act', 'play', 'sing', 'read'] },
    answer: (v) => ({ teach: 'teacher', act: 'action', play: 'player', sing: 'singer', read: 'reader' })[v.base],
    distractors: [(v) => ({ teach: 'teaching', act: 'active', play: 'playing', sing: 'singing', read: 'reading' })[v.base], (v) => `${v.base}ed`, (v) => `${v.base}s`],
    distractorLabels: ['動名詞', '加了ed', '加了s'],
    _getOptions: (v) => {
      const nounMap = { teach: 'teacher', act: 'action', play: 'player', sing: 'singer', read: 'reader' };
      const gerundMap = { teach: 'teaching', act: 'active', play: 'playing', sing: 'singing', read: 'reading' };
      return [nounMap[v.base], gerundMap[v.base], `${v.base}ed`, `${v.base}s`].sort(() => Math.random() - 0.5);
    },
  },

  // ============================
  // P6 (六年級) — 條件句、情態動詞、關係子句、健康/科技/環境詞彙、推論閱讀
  // ============================
  {
    id: 'EN-P6-GRAM-001', genre: 'computation', grade: 'p6', edbCodes: ['EN6-1.1'], difficulty: 3,
    patternFn: (v) => `If it _____ tomorrow, I will stay home.`,
    variables: { weather: ['rains', 'snows', 'storms'] },
    answer: (v) => v.weather,
    distractors: [(v) => 'will rain', (v) => 'rained', (v) => 'would rain'],
    distractorLabels: ['用了will', '用了過去式', '用了would'],
    _getOptions: (v) => [v.weather, 'will rain', 'rained', 'would rain'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P6-GRAM-002', genre: 'computation', grade: 'p6', edbCodes: ['EN6-1.2'], difficulty: 3,
    patternFn: (v) => `You _____ wear a helmet when you ride a bike.`,
    variables: { modal: ['should', 'can', 'must', 'may'] },
    answer: (v) => v.modal,
    distractors: [(v) => ({ should: 'can', can: 'should', must: 'should', may: 'can' })[v.modal] || 'will'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['should', 'can', 'must', 'may', 'will', 'would', 'could'];
      const others = all.filter(m => m !== v.modal).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.modal, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P6-GRAM-003', genre: 'computation', grade: 'p6', edbCodes: ['EN6-1.3'], difficulty: 3,
    patternFn: (v) => `The boy _____ is standing there is my brother.`,
    variables: {},
    answer: () => 'who',
    distractors: [() => 'which', () => 'where', () => 'whose'],
    distractorLabels: ['用了which', '用了where', '用了whose'],
    _getOptions: () => ['who', 'which', 'where', 'whose'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P6-VOC-001', genre: 'computation', grade: 'p6', edbCodes: ['EN6-2.1'], difficulty: 3,
    patternFn: (v) => `To stay healthy, you should eat more _____.`,
    variables: { food: ['vegetables', 'candy', 'chips', 'soda'] },
    answer: (v) => v.food,
    distractors: [(v) => ({ vegetables: 'fruit', candy: 'chocolate', chips: 'crackers', soda: 'juice' })[v.food] || 'meat'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['vegetables', 'fruit', 'candy', 'chocolate', 'chips', 'crackers', 'soda', 'juice', 'meat'];
      const others = all.filter(f => f !== v.food).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.food, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P6-VOC-002', genre: 'computation', grade: 'p6', edbCodes: ['EN6-2.2'], difficulty: 3,
    patternFn: (v) => `We should protect the _____ by recycling.`,
    variables: { word: ['environment', 'economy', 'building', 'machine'] },
    answer: (v) => v.word,
    distractors: [(v) => ({ environment: 'nature', economy: 'market', building: 'house', machine: 'robot' })[v.word] || 'city'],
    distractorLabels: ['近義混淆'],
    _getOptions: (v) => {
      const all = ['environment', 'nature', 'economy', 'market', 'building', 'house', 'machine', 'robot', 'city'];
      const others = all.filter(w => w !== v.word).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.word, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P6-READ-001', genre: 'word-problem', grade: 'p6', edbCodes: ['EN6-5.1'], difficulty: 3,
    patternFn: (v) => `The Earth is getting warmer every year. Ice at the North Pole is melting. Scientists say we should use less oil and coal. We can also plant more trees.\n\nQ: What is happening to the ice at the North Pole?`,
    variables: {},
    answer: () => 'It is melting',
    distractors: [() => 'It is growing', () => 'It is disappearing completely', () => 'It is staying the same'],
    distractorLabels: ['在增長', '完全消失', '沒有變化'],
    _getOptions: () => ['It is melting', 'It is growing', 'It is disappearing completely', 'It is staying the same'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P6-SENT-001', genre: 'word-problem', grade: 'p6', edbCodes: ['EN6-4.1'], difficulty: 3,
    patternFn: (v) => `Which sentence is correct?`,
    variables: {},
    answer: () => 'The book which I bought is interesting.',
    distractors: [() => 'The book who I bought is interesting.', () => 'The book I bought it is interesting.', () => 'The book what I bought is interesting.'],
    distractorLabels: ['用了who', '多了it', '用了what'],
    _getOptions: () => [
      'The book which I bought is interesting.',
      'The book who I bought is interesting.',
      'The book I bought it is interesting.',
      'The book what I bought is interesting.',
    ].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P6-SPELL-001', genre: 'computation', grade: 'p6', edbCodes: ['EN6-3.1'], difficulty: 3,
    patternFn: (v) => `Which is the correct spelling?`,
    variables: {},
    answer: () => 'necessary',
    distractors: [() => 'neccessary', () => 'necessery', () => 'necesary'],
    distractorLabels: ['多了c', '用了ery', '少了一個s'],
    _getOptions: () => ['necessary', 'neccessary', 'necessery', 'necesary'].sort(() => Math.random() - 0.5),
  },

  {
    id: 'EN-P6-VOC-003', genre: 'computation', grade: 'p6', edbCodes: ['EN6-2.3'], difficulty: 3,
    patternFn: (v) => `A _____ is a device we use to talk to people far away.`,
    variables: {},
    answer: () => 'telephone',
    distractors: [() => 'telescope', () => 'television', () => 'thermometer'],
    distractorLabels: ['望遠鏡', '電視', '溫度計'],
    _getOptions: () => ['telephone', 'telescope', 'television', 'thermometer'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P6-READ-002', genre: 'word-problem', grade: 'p6', edbCodes: ['EN6-5.2'], difficulty: 3,
    patternFn: (v) => `Ken always forgets to bring his homework. His teacher is not happy. One day, Ken's mother put a reminder note on his bag. After that, Ken never forgot his homework again.\n\nQ: How did Ken's mother help him?`,
    variables: {},
    answer: () => 'She put a reminder note on his bag',
    distractors: [() => 'She did his homework for him', () => 'She talked to his teacher', () => 'She bought him a new bag'],
    distractorLabels: ['代做功課', '找老師', '買新書包'],
    _getOptions: () => ['She put a reminder note on his bag', 'She did his homework for him', 'She talked to his teacher', 'She bought him a new bag'].sort(() => Math.random() - 0.5),
  },

  // ============================
  // F1 (中一) — 時態複習、間接引語、學術詞彙、文本類型、詞形變化
  // ============================
  {
    id: 'EN-F1-GRAM-001', genre: 'computation', grade: 'f1', edbCodes: ['EN7-1.1'], difficulty: 4,
    patternFn: (v) => `He said, "I like ${v.food}." → He said that he _____ ${v.food}.`,
    variables: { food: ['pizza', 'sushi', 'burgers', 'pasta', 'salad'] },
    answer: () => 'liked',
    distractors: [() => 'likes', () => 'like', () => 'is liking'],
    distractorLabels: ['時態未後移', '用了原形', '用了進行式'],
    _getOptions: () => ['liked', 'likes', 'like', 'is liking'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F1-GRAM-002', genre: 'computation', grade: 'f1', edbCodes: ['EN7-1.2'], difficulty: 4,
    patternFn: (v) => `She said, "I will come." → She said that she _____ come.`,
    variables: {},
    answer: () => 'would',
    distractors: [() => 'will', () => 'shall', () => 'can'],
    distractorLabels: ['時態未後移', '用了shall', '用了can'],
    _getOptions: () => ['would', 'will', 'shall', 'can'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F1-GRAM-003', genre: 'computation', grade: 'f1', edbCodes: ['EN7-1.3'], difficulty: 4,
    patternFn: (v) => `By the time I arrived, they _____ already _____.`,
    variables: { verb: ['leave', 'eat', 'start', 'finish', 'begin'] },
    answer: (v) => `had ${({ leave: 'left', eat: 'eaten', start: 'started', finish: 'finished', begin: 'begun' })[v.verb]}`,
    distractors: [(v) => `have ${({ leave: 'left', eat: 'eaten', start: 'started', finish: 'finished', begin: 'begun' })[v.verb]}`, (v) => `${v.verb}ed`, (v) => `were ${v.verb}ing`],
    distractorLabels: ['用了現在完成', '用了簡單過去', '用了過去進行'],
    _getOptions: (v) => {
      const pp = ({ leave: 'left', eat: 'eaten', start: 'started', finish: 'finished', begin: 'begun' })[v.verb];
      return [`had ${pp}`, `have ${pp}`, `${v.verb}ed`, `were ${v.verb}ing`].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-F1-VOC-001', genre: 'computation', grade: 'f1', edbCodes: ['EN7-2.1'], difficulty: 4,
    patternFn: (v) => `The word "${v.word}" means _____.`,
    variables: { word: ['ancient', 'discover', 'enormous', 'examine', 'predict'] },
    answer: (v) => ({ ancient: 'very old', discover: 'find out', enormous: 'very big', examine: 'look at carefully', predict: 'say what will happen' })[v.word],
    distractors: [(v) => ({ ancient: 'new', discover: 'lose', enormous: 'small', examine: 'ignore', predict: 'forget' })[v.word], (v) => ({ ancient: 'strange', discover: 'hide', enormous: 'heavy', examine: 'break', predict: 'hope' })[v.word], (v) => ({ ancient: 'famous', discover: 'make', enormous: 'fast', examine: 'touch', predict: 'wish' })[v.word]],
    distractorLabels: ['相反意思', '無關意思', '無關意思'],
    _getOptions: (v) => {
      const correct = ({ ancient: 'very old', discover: 'find out', enormous: 'very big', examine: 'look at carefully', predict: 'say what will happen' })[v.word];
      const allDefs = ['very old', 'new', 'strange', 'famous', 'find out', 'lose', 'hide', 'make', 'very big', 'small', 'heavy', 'fast', 'look at carefully', 'ignore', 'break', 'touch', 'say what will happen', 'forget', 'hope', 'wish'];
      const others = allDefs.filter(d => d !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      return [correct, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-F1-VOC-002', genre: 'computation', grade: 'f1', edbCodes: ['EN7-2.2'], difficulty: 4,
    patternFn: (v) => `What is the opposite of "${v.word}"?`,
    variables: { word: ['generous', 'brave', 'polite', 'honest', 'patient'] },
    answer: (v) => ({ generous: 'stingy', brave: 'cowardly', polite: 'rude', honest: 'dishonest', patient: 'impatient' })[v.word],
    distractors: [(v) => ({ generous: 'kind', brave: 'strong', polite: 'quiet', honest: 'truthful', patient: 'calm' })[v.word], (v) => ({ generous: 'rich', brave: 'tall', polite: 'gentle', honest: 'clever', patient: 'smart' })[v.word], (v) => ({ generous: 'happy', brave: 'fast', polite: 'nice', honest: 'good', patient: 'lazy' })[v.word]],
    distractorLabels: ['近義詞', '無關', '無關'],
    _getOptions: (v) => {
      const correct = ({ generous: 'stingy', brave: 'cowardly', polite: 'rude', honest: 'dishonest', patient: 'impatient' })[v.word];
      const allAnts = ['stingy', 'kind', 'rich', 'happy', 'cowardly', 'strong', 'tall', 'fast', 'rude', 'quiet', 'gentle', 'nice', 'dishonest', 'truthful', 'clever', 'good', 'impatient', 'calm', 'smart', 'lazy'];
      const others = allAnts.filter(a => a !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      return [correct, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-F1-READ-001', genre: 'word-problem', grade: 'f1', edbCodes: ['EN7-5.1'], difficulty: 4,
    patternFn: (v) => `Dolphins are intelligent mammals that live in the ocean. They breathe air through a blowhole on top of their heads. Dolphins live in groups called pods and communicate with each other using clicks and whistles.\n\nQ: How do dolphins breathe?`,
    variables: {},
    answer: () => 'Through a blowhole',
    distractors: [() => 'Through gills', () => 'Through their skin', () => 'Through their mouth'],
    distractorLabels: ['用鰓呼吸', '用皮膚', '用嘴巴'],
    _getOptions: () => ['Through a blowhole', 'Through gills', 'Through their skin', 'Through their mouth'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F1-SPELL-001', genre: 'computation', grade: 'f1', edbCodes: ['EN7-3.1'], difficulty: 4,
    patternFn: (v) => `Choose the correct word: The news _____ (affect / effect) many people.`,
    variables: {},
    answer: () => 'affects',
    distractors: [() => 'effects', () => 'affect', () => 'effect'],
    distractorLabels: ['用了名詞', '忘了第三人稱', '名詞+忘了s'],
    _getOptions: () => ['affects', 'effects', 'affect', 'effect'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F1-SENT-001', genre: 'word-problem', grade: 'f1', edbCodes: ['EN7-4.1'], difficulty: 4,
    patternFn: (v) => `Which type of text is a recipe?`,
    variables: {},
    answer: () => 'Instructional',
    distractors: [() => 'Narrative', () => 'Persuasive', () => 'Descriptive'],
    distractorLabels: ['記敍文', '議論文', '描寫文'],
    _getOptions: () => ['Instructional', 'Narrative', 'Persuasive', 'Descriptive'].sort(() => Math.random() - 0.5),
  },

  {
    id: 'EN-F1-VOC-003', genre: 'computation', grade: 'f1', edbCodes: ['EN7-2.3'], difficulty: 4,
    patternFn: (v) => `The noun form of "able" is _____.`,
    variables: {},
    answer: () => 'ability',
    distractors: [() => 'ableness', () => 'abling', () => 'ably'],
    distractorLabels: ['加了ness', '加了ing', '副詞形式'],
    _getOptions: () => ['ability', 'ableness', 'abling', 'ably'].sort(() => Math.random() - 0.5),
  },

  // ============================
  // F2 (中二) — 動名詞/不定詞、片語動詞、連接詞、慣用語、批判閱讀
  // ============================
  {
    id: 'EN-F2-GRAM-001', genre: 'computation', grade: 'f2', edbCodes: ['EN8-1.1'], difficulty: 4,
    patternFn: (v) => `I enjoy _____ computer games.`,
    variables: { verb: ['play', 'make', 'design', 'watch', 'learn'] },
    answer: (v) => `${v.verb}ing`,
    distractors: [(v) => `to ${v.verb}`, (v) => v.verb, (v) => `${v.verb}s`],
    distractorLabels: ['用了to+動詞', '用了原型', '用了第三人稱'],
    _getOptions: (v) => [`${v.verb}ing`, `to ${v.verb}`, v.verb, `${v.verb}s`].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F2-GRAM-002', genre: 'computation', grade: 'f2', edbCodes: ['EN8-1.2'], difficulty: 4,
    patternFn: (v) => `She decided _____ abroad next year.`,
    variables: { verb: ['study', 'travel', 'work', 'visit', 'live'] },
    answer: (v) => `to ${v.verb}`,
    distractors: [(v) => `${v.verb}ing`, (v) => v.verb, (v) => `${v.verb}s`],
    distractorLabels: ['用了動名詞', '用了原型', '用了第三人稱'],
    _getOptions: (v) => [`to ${v.verb}`, `${v.verb}ing`, v.verb, `${v.verb}s`].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F2-VOC-001', genre: 'computation', grade: 'f2', edbCodes: ['EN8-2.1'], difficulty: 4,
    patternFn: (v) => `The plane will _____ at 3 p.m.`,
    variables: { phrasal: ['take off', 'put on', 'give up', 'look after', 'turn on'] },
    answer: (v) => v.phrasal,
    distractors: [(v) => ({ 'take off': 'take on', 'put on': 'put off', 'give up': 'give in', 'look after': 'look for', 'turn on': 'turn off' })[v.phrasal] || 'get up'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['take off', 'take on', 'put on', 'put off', 'give up', 'give in', 'look after', 'look for', 'turn on', 'turn off', 'get up', 'get off'];
      const others = all.filter(p => p !== v.phrasal).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.phrasal, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-F2-VOC-002', genre: 'computation', grade: 'f2', edbCodes: ['EN8-2.2'], difficulty: 4,
    patternFn: (v) => `What does the idiom "break the ice" mean?`,
    variables: {},
    answer: () => 'Start a conversation',
    distractors: [() => 'Break something', () => 'Feel cold', () => 'Stop working'],
    distractorLabels: ['字面意思', '字面意思', '無關'],
    _getOptions: () => ['Start a conversation', 'Break something', 'Feel cold', 'Stop working'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F2-GRAM-003', genre: 'computation', grade: 'f2', edbCodes: ['EN8-1.3'], difficulty: 4,
    patternFn: (v) => `_____ it was raining, we went hiking.`,
    variables: { conj: ['Although', 'Because', 'Therefore', 'However'] },
    answer: (v) => v.conj,
    distractors: [(v) => ({ Although: 'Because', Because: 'Although', Therefore: 'However', However: 'Although' })[v.conj] || 'But'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['Although', 'Because', 'Therefore', 'However', 'But', 'So', 'Since'];
      const others = all.filter(c => c !== v.conj).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.conj, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-F2-READ-001', genre: 'word-problem', grade: 'f2', edbCodes: ['EN8-5.1'], difficulty: 4,
    patternFn: (v) => `Many teenagers spend over 5 hours a day on their phones. Studies show that too much screen time can cause eye problems and poor sleep. Doctors suggest limiting screen time to 2 hours a day and taking breaks every 30 minutes.\n\nQ: What is the writer's main purpose?`,
    variables: {},
    answer: () => 'To warn about screen time dangers',
    distractors: [() => 'To sell phones', () => 'To describe a phone', () => 'To compare phones'],
    distractorLabels: ['推銷手機', '描述手機', '比較手機'],
    _getOptions: () => ['To warn about screen time dangers', 'To sell phones', 'To describe a phone', 'To compare phones'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F2-SPELL-001', genre: 'computation', grade: 'f2', edbCodes: ['EN8-3.1'], difficulty: 4,
    patternFn: (v) => `Choose the correct word: The teacher asked us to _____ (accept / except) the invitation.`,
    variables: {},
    answer: () => 'accept',
    distractors: [() => 'except', () => 'acsept', () => 'exsept'],
    distractorLabels: ['同音異義', '拼錯', '拼錯'],
    _getOptions: () => ['accept', 'except', 'acsept', 'exsept'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F2-SENT-001', genre: 'word-problem', grade: 'f2', edbCodes: ['EN8-4.1'], difficulty: 4,
    patternFn: (v) => `Which register is most suitable for a school essay?`,
    variables: {},
    answer: () => 'Formal',
    distractors: [() => 'Casual', () => 'Slang', () => 'Text-speak'],
    distractorLabels: ['隨意', '俚語', '網路用語'],
    _getOptions: () => ['Formal', 'Casual', 'Slang', 'Text-speak'].sort(() => Math.random() - 0.5),
  },

  {
    id: 'EN-F2-VOC-003', genre: 'computation', grade: 'f2', edbCodes: ['EN8-2.3'], difficulty: 4,
    patternFn: (v) => `The phrase "on the other hand" is used to _____.`,
    variables: {},
    answer: () => 'introduce a contrast',
    distractors: [() => 'give an example', () => 'show a result', () => 'start a topic'],
    distractorLabels: ['舉例', '結果', '開頭'],
    _getOptions: () => ['introduce a contrast', 'give an example', 'show a result', 'start a topic'].sort(() => Math.random() - 0.5),
  },

  // ============================
  // F3 (中三) — 假設語氣、進階被動、複雜句、語域、考試技巧
  // ============================
  {
    id: 'EN-F3-GRAM-001', genre: 'computation', grade: 'f3', edbCodes: ['EN9-1.1'], difficulty: 5,
    patternFn: (v) => `If I _____ you, I would study harder.`,
    variables: {},
    answer: () => 'were',
    distractors: [() => 'was', () => 'am', () => 'would be'],
    distractorLabels: ['用了was', '用了am', '用了would be'],
    _getOptions: () => ['were', 'was', 'am', 'would be'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F3-GRAM-002', genre: 'computation', grade: 'f3', edbCodes: ['EN9-1.2'], difficulty: 5,
    patternFn: (v) => `If I had studied harder, I _____ the exam.`,
    variables: {},
    answer: () => 'would have passed',
    distractors: [() => 'would pass', () => 'will pass', () => 'passed'],
    distractorLabels: ['用了第二條件', '用了未來式', '用了簡單過去'],
    _getOptions: () => ['would have passed', 'would pass', 'will pass', 'passed'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F3-GRAM-003', genre: 'computation', grade: 'f3', edbCodes: ['EN9-1.3'], difficulty: 5,
    patternFn: (v) => `The report _____ by the committee next week.`,
    variables: {},
    answer: () => 'will be reviewed',
    distractors: [() => 'will review', () => 'is reviewed', () => 'was reviewed'],
    distractorLabels: ['用了主動式', '用了現在式', '用了過去式'],
    _getOptions: () => ['will be reviewed', 'will review', 'is reviewed', 'was reviewed'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F3-GRAM-004', genre: 'computation', grade: 'f3', edbCodes: ['EN9-1.4'], difficulty: 5,
    patternFn: (v) => `I wish I _____ more time to travel.`,
    variables: {},
    answer: () => 'had',
    distractors: [() => 'have', () => 'will have', () => 'would have'],
    distractorLabels: ['用了現在式', '用了未來式', '用了would'],
    _getOptions: () => ['had', 'have', 'will have', 'would have'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F3-VOC-001', genre: 'computation', grade: 'f3', edbCodes: ['EN9-2.1'], difficulty: 5,
    patternFn: (v) => `The scientist conducted a thorough _____ of the data.`,
    variables: { word: ['analysis', 'analysation', 'analysing', 'analyst'] },
    answer: (v) => v.word,
    distractors: [(v) => ({ analysis: 'study', analysation: 'analysis', analysing: 'investigation', analyst: 'analysis' })[v.word] || 'review'],
    distractorLabels: ['近義混淆'],
    _getOptions: (v) => {
      const all = ['analysis', 'study', 'investigation', 'review', 'examination', 'summary'];
      const others = all.filter(w => w !== v.word).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.word, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-F3-VOC-002', genre: 'computation', grade: 'f3', edbCodes: ['EN9-2.2'], difficulty: 5,
    patternFn: (v) => `Choose the synonym for "${v.word}":`,
    variables: { word: ['ubiquitous', 'diligent', 'concise', 'pragmatic', 'meticulous'] },
    answer: (v) => ({ ubiquitous: 'everywhere', diligent: 'hardworking', concise: 'brief', pragmatic: 'practical', meticulous: 'careful' })[v.word],
    distractors: [(v) => ({ ubiquitous: 'rare', diligent: 'lazy', concise: 'long', pragmatic: 'theoretical', meticulous: 'careless' })[v.word], (v) => ({ ubiquitous: 'invisible', diligent: 'talented', concise: 'detailed', pragmatic: 'hopeful', meticulous: 'quick' })[v.word], (v) => ({ ubiquitous: 'hidden', diligent: 'quiet', concise: 'loud', pragmatic: 'creative', meticulous: 'slow' })[v.word]],
    distractorLabels: ['反義', '無關', '無關'],
    _getOptions: (v) => {
      const correct = ({ ubiquitous: 'everywhere', diligent: 'hardworking', concise: 'brief', pragmatic: 'practical', meticulous: 'careful' })[v.word];
      const allSyns = ['everywhere', 'rare', 'invisible', 'hidden', 'hardworking', 'lazy', 'talented', 'quiet', 'brief', 'long', 'detailed', 'loud', 'practical', 'theoretical', 'hopeful', 'creative', 'careful', 'careless', 'quick', 'slow'];
      const others = allSyns.filter(s => s !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      return [correct, ...others].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-F3-READ-001', genre: 'word-problem', grade: 'f3', edbCodes: ['EN9-5.1'], difficulty: 5,
    patternFn: (v) => `The proliferation of social media has fundamentally altered interpersonal communication. While proponents argue that it facilitates global connectivity, critics contend that it erodes the quality of face-to-face interactions and contributes to heightened anxiety among adolescents.\n\nQ: What is the author's tone in this passage?`,
    variables: {},
    answer: () => 'Balanced / Neutral',
    distractors: [() => 'Strongly negative', () => 'Strongly positive', () => 'Humorous'],
    distractorLabels: ['非常負面', '非常正面', '幽默'],
    _getOptions: () => ['Balanced / Neutral', 'Strongly negative', 'Strongly positive', 'Humorous'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F3-SPELL-001', genre: 'computation', grade: 'f3', edbCodes: ['EN9-3.1'], difficulty: 5,
    patternFn: (v) => `Choose the correct spelling:`,
    variables: {},
    answer: () => 'accommodation',
    distractors: [() => 'accomodation', () => 'accomodation', () => 'acommodation'],
    distractorLabels: ['少了一個c', '少了一個m', '少了cc'],
    _getOptions: () => ['accommodation', 'accomodation', 'acommodation', 'acomodation'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-F3-SENT-001', genre: 'word-problem', grade: 'f3', edbCodes: ['EN9-4.1'], difficulty: 5,
    patternFn: (v) => `Which sentence uses the subjunctive mood correctly?`,
    variables: {},
    answer: () => 'I suggest that he study harder.',
    distractors: [() => 'I suggest that he studies harder.', () => 'I suggest that he will study harder.', () => 'I suggest that he studying harder.'],
    distractorLabels: ['用了直說語氣', '用了未來式', '用了現在分詞'],
    _getOptions: () => [
      'I suggest that he study harder.',
      'I suggest that he studies harder.',
      'I suggest that he will study harder.',
      'I suggest that he studying harder.',
    ].sort(() => Math.random() - 0.5),
  },
];

// English-specific: convert template to question format
export function getEnglishOptions(template, vars) {
  if (template._getOptions) return template._getOptions(vars);
  const correct = template.answer(vars);
  const dists = template.distractors.map(fn => fn(vars)).filter(d => d !== correct);
  return [correct, ...dists].sort(() => Math.random() - 0.5);
}

export function getEnglishTemplatesByGrade(grade) {
  return englishTemplates.filter(t => t.grade === grade);
}

export default englishTemplates;
