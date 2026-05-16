// 英文科题目模板 (P1-F3)
export const englishTemplates = [
  // ===== P1-P2 基础 =====
  {
    id: 'EN-P1-VOC-001', genre: 'computation', grade: 'p1', edbCodes: ['EN1-2.1'], difficulty: 1,
    pattern: 'What color is the {color}? — It is {color}.',
    variables: { color: ['red', 'blue', 'green', 'yellow', 'orange', 'purple'] },
    answer: () => '{color}',
    patternFn: (v) => `What color is the ${v.color}? — It is _____.`,
    distractors: [(v) => ({ red: 'blue', blue: 'green', green: 'red', yellow: 'orange', orange: 'purple', purple: 'black' })[v.color] || 'white'],
    distractorLabels: ['常見混淆'],
    _getOptions: (v) => {
      const all = ['red','blue','green','yellow','orange','purple','pink','black','white'];
      const others = all.filter(c => c !== v.color).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.color, ...others];
    },
  },
  {
    id: 'EN-P1-VOC-002', genre: 'word-problem', grade: 'p1', edbCodes: ['EN1-2.2'], difficulty: 1,
    patternFn: (v) => `What is this? — It is a ${v.animal}.`,
    variables: { animal: ['cat', 'dog', 'fish', 'bird', 'rabbit', 'duck'] },
    _getOptions: (v) => {
      const all = ['cat','dog','fish','bird','rabbit','duck','pig','cow'];
      const others = all.filter(a => a !== v.animal).sort(() => Math.random() - 0.5).slice(0, 3);
      return [v.animal, ...others];
    },
    answer: (v) => v.animal,
    distractors: [(v) => ({ cat:'dog', dog:'cat', fish:'bird', bird:'fish', rabbit:'duck', duck:'rabbit' })[v.animal] || 'pig'],
    distractorLabels: ['常見混淆'],
  },
  {
    id: 'EN-P1-GRAM-001', genre: 'computation', grade: 'p1', edbCodes: ['EN1-1.1'], difficulty: 1,
    patternFn: (v) => `I ${v.verb} _____ every day.`,
    variables: { verb: ['eat', 'play', 'read', 'sing', 'run', 'draw'] },
    answer: () => '{verb}',
    distractors: [(v) => `${v.verb}s`, (v) => `${v.verb}ing`, (v) => `${v.verb}ed`],
    distractorLabels: ['加了s', '加了ing', '加了ed'],
    _getOptions: (v) => {
      const forms = [v.verb, `${v.verb}s`, `${v.verb}ing`, `${v.verb}ed`];
      return forms.sort(() => Math.random() - 0.5);
    },
  },
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

  // ===== P3-P4 进阶 =====
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
    answer: (v) => ({ walk:'walked', play:'played', visit:'visited', go:'went', run:'ran' })[v.verb],
    distractors: [(v) => v.verb, (v) => `${v.verb}s`, (v) => `${v.verb}ing`],
    distractorLabels: ['用了原型', '用了現在式', '用了進行式'],
    _getOptions: (v) => {
      const past = ({ walk:'walked', play:'played', visit:'visited', go:'went', run:'ran' })[v.verb];
      const forms = [past, v.verb, `${v.verb}s`, `${v.verb}ing`];
      return forms.sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P3-GRAM-003', genre: 'computation', grade: 'p3', edbCodes: ['EN3-1.3'], difficulty: 2,
    patternFn: (v) => `I have _____ apple.`,
    variables: { word: ['apple', 'orange', 'banana', 'book', 'pen', 'umbrella'] },
    answer: (v) => ['apple','orange','umbrella'].includes(v.word) ? 'an' : 'a',
    distractors: [(v) => ['apple','orange','umbrella'].includes(v.word) ? 'a' : 'an', (v) => 'the', (v) => 'some'],
    distractorLabels: ['元音前用了a', '用了the', '用了some'],
    _getOptions: (v) => {
      const correct = ['apple','orange','umbrella'].includes(v.word) ? 'an' : 'a';
      const wrong = correct === 'an' ? 'a' : 'an';
      return [correct, wrong, 'the', 'some'].sort(() => Math.random() - 0.5);
    },
  },
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
    patternFn: (v) => `A ${v.animal1} is _____ than a ${v.animal2}.`,
    variables: { animal1: ['dog', 'cat', 'bird', 'rabbit', 'duck'], animal2: ['cat', 'mouse', 'fish', 'snail', 'ant'] },
    constraint: (v) => v.animal1 !== v.animal2,
    answer: (v) => ({
      dog:'bigger', cat:'bigger', bird:'faster', rabbit:'faster', duck:'bigger',
    }[v.animal1] || 'bigger'),
    distractors: [(v) => 'big', (v) => 'more big', (v) => 'biggest'],
    distractorLabels: ['用了原級', '用了more', '用了最高級'],
    _getOptions: (v) => {
      const correct = ['bigger','faster','taller','shorter'][Math.floor(Math.random() * 4)];
      return [correct, 'big', 'more big', 'biggest'].sort(() => Math.random() - 0.5);
    },
  },

  // ===== P5-P6 高小 =====
  {
    id: 'EN-P5-GRAM-001', genre: 'computation', grade: 'p5', edbCodes: ['EN5-1.1'], difficulty: 3,
    patternFn: (v) => `I have _____ ${v.verb} this movie before.`,
    variables: { verb: ['see', 'watch', 'read', 'hear', 'visit'] },
    answer: (v) => ({ see:'seen', watch:'watched', read:'read', hear:'heard', visit:'visited' })[v.verb],
    distractors: [(v) => `${v.verb}ed`, (v) => `${v.verb}s`, (v) => v.verb],
    distractorLabels: ['用了簡單過去', '用了現在式', '用了原型'],
    _getOptions: (v) => {
      const pp = ({ see:'seen', watch:'watched', read:'read', hear:'heard', visit:'visited' })[v.verb];
      return [pp, `${v.verb}ed`, `${v.verb}s`, v.verb].sort(() => Math.random() - 0.5);
    },
  },
  {
    id: 'EN-P5-GRAM-002', genre: 'computation', grade: 'p5', edbCodes: ['EN5-1.2'], difficulty: 3,
    patternFn: (v) => `The ${v.food} _____ by the chef.`,
    variables: { food: ['cake', 'bread', 'pizza', 'cookie', 'sandwich'], verb: ['make', 'bake', 'cook', 'prepare', 'eat'] },
    answer: (v) => `is ${v.verb}ed`,
    distractors: [(v) => `${v.verb}s`, (v) => `was ${v.verb}`, (v) => `${v.verb}ing`],
    distractorLabels: ['用了主動式', 'be動詞錯了', '用了進行式'],
    _getOptions: (v) => [`is ${v.verb}ed`, `${v.verb}s`, `was ${v.verb}`, `${v.verb}ing`].sort(() => Math.random() - 0.5),
  },
  {
    id: 'EN-P6-GRAM-001', genre: 'computation', grade: 'p6', edbCodes: ['EN6-1.1'], difficulty: 3,
    patternFn: (v) => `If it _____ tomorrow, I will stay home.`,
    variables: { weather: ['rains', 'snows', 'storms', 'is rainy', 'is cloudy'] },
    answer: (v) => v.weather,
    distractors: [(v) => 'will rain', (v) => 'rained', (v) => 'would rain'],
    distractorLabels: ['用了will', '用了過去式', '用了would'],
    _getOptions: (v) => [v.weather, 'will rain', 'rained', 'would rain'].sort(() => Math.random() - 0.5),
  },

  // ===== F1-F3 初中 =====
  {
    id: 'EN-F1-GRAM-001', genre: 'computation', grade: 'f1', edbCodes: ['EN7-1.2'], difficulty: 4,
    patternFn: (v) => `He said, "I like ${v.food}." → He said that he _____ ${v.food}.`,
    variables: { food: ['pizza', 'sushi', 'burgers', 'pasta', 'salad'] },
    answer: (v) => 'liked',
    distractors: [(v) => 'likes', (v) => 'like', (v) => 'is liking'],
    distractorLabels: ['時態未後移', '用了原形', '用了進行式'],
    _getOptions: (v) => ['liked', 'likes', 'like', 'is liking'].sort(() => Math.random() - 0.5),
  },
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
    id: 'EN-F3-GRAM-001', genre: 'computation', grade: 'f3', edbCodes: ['EN9-1.1'], difficulty: 5,
    patternFn: (v) => `If I _____ you, I would study harder.`,
    variables: {},
    answer: () => 'were',
    distractors: [() => 'was', () => 'am', () => 'would be'],
    distractorLabels: ['用了was', '用了am', '用了would be'],
    _getOptions: () => ['were', 'was', 'am', 'would be'].sort(() => Math.random() - 0.5),
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
