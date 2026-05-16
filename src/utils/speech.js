// 共享语音和音效工具

// ===== 语音引擎 =====

let voiceCache = null;
let voiceReady = false;
let voiceCallbacks = [];

export function initVoice(lang = 'zh-HK') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const synth = window.speechSynthesis;

  function findVoice() {
    const voices = synth.getVoices();
    let v = voices.find(v => v.lang === lang)
      || voices.find(v => v.lang.startsWith(lang))
      || voices.find(v => v.lang.startsWith('zh'))
      || voices[0];
    voiceCache = v;
    voiceReady = true;
    voiceCallbacks.forEach(cb => cb());
    voiceCallbacks = [];
    return !!v;
  }

  if (synth.getVoices().length > 0) {
    findVoice();
  } else {
    synth.onvoiceschanged = findVoice;
  }
  return true;
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

export function onVoiceReady(callback) {
  if (voiceReady) { callback(); return; }
  voiceCallbacks.push(callback);
}

export function speak(text, options = {}) {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) { resolve(); return; }
    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = options.lang || 'zh-HK';
    utter.rate = options.rate ?? 0.85;
    utter.pitch = options.pitch ?? 1.1;
    utter.volume = options.volume ?? 1;
    if (voiceCache) utter.voice = voiceCache;

    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    synth.speak(utter);

    // 安全超时（某些移动端 onend 可能不触发）
    setTimeout(resolve, 15000);
  });
}

export function speakAll(texts, options = {}) {
  return texts.reduce((chain, text) => {
    return chain.then(() => speak(text, options));
  }, Promise.resolve());
}

export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

// ===== 宠物语音库 =====

export const PET_VOICES = {
  greeting: [
    { zh: '你来了！我好想你呀！', hk: '你嚟咗！我好掛住你呀！' },
    { zh: '今天要一起玩吗？', hk: '今日一齊玩好唔好？' },
    { zh: '早上好！今天也要加油哦！', hk: '早晨！今日都要加油呀！' },
  ],
  correct: [
    { zh: '答对了！你好厉害！', hk: '答啱咗！你好叻呀！' },
    { zh: '真棒！继续加油！', hk: '真係叻！繼續加油！' },
    { zh: '太聪明了！', hk: '太聰明啦！' },
  ],
  wrong: [
    { zh: '没关系，再试试看！', hk: '唔緊要，再試吓！' },
    { zh: '我陪你一起想～', hk: '我陪你一齊諗～' },
    { zh: '加油！你可以的！', hk: '加油！你可以嘅！' },
  ],
  hungry: [
    { zh: '我肚子饿了...', hk: '我肚餓啦...' },
    { zh: '可以喂我吃点东西吗？', hk: '可唔可以餵我食啲嘢？' },
  ],
  attention: [
    { zh: '点一下我嘛～', hk: '撳吓我啦～' },
    { zh: '陪我玩一会儿好吗？', hk: '陪我玩一陣好唔好？' },
    { zh: '我在这里等你哦！', hk: '我喺度等你㗎！' },
  ],
  sleepy: [
    { zh: '我有点困了...', hk: '我有啲眼瞓...' },
    { zh: '呼...呼...', hk: '呼...呼...' },
  ],
  welcome: [
    { zh: '欢迎回来！', hk: '歡迎返嚟！' },
    { zh: '你回来啦！', hk: '你返嚟啦！' },
  ],
  tap: [
    { zh: '嘿嘿！', hk: '嘿嘿！' },
    { zh: '好痒～', hk: '好痕呀～' },
    { zh: '再来一下！', hk: '再嚟一下！' },
    { zh: '嘻嘻！', hk: '嘻嘻！' },
  ],
};

export function speakPet(key, lang = 'zh-HK') {
  const lines = PET_VOICES[key];
  if (!lines || lines.length === 0) return Promise.resolve();
  const line = lines[Math.floor(Math.random() * lines.length)];
  const text = lang === 'zh-HK' ? (line.hk || line.zh) : line.zh;
  return speak(text, { lang, rate: 0.85, pitch: 1.2 });
}

// ===== 音效引擎 =====

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.2) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* ignore */ }
}

export function playCorrectSound() {
  playTone(523, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 100);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 200);
}

export function playWrongSound() {
  playTone(200, 0.15, 'sawtooth', 0.15);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.15), 150);
}

export function playNotes(notes) {
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note.freq, note.dur || 0.2, note.type || 'sine', note.vol || 0.2), note.delay || i * 120);
  });
}

export function playTapSound() {
  playTone(880, 0.08, 'sine', 0.12);
}

// ===== 学习语音 =====

/**
 * 朗读一个汉字，用于默写模式
 */
export function speakChar(character, options = {}) {
  return speak(character, { lang: options.lang || 'zh-HK', rate: options.rate ?? 0.75, pitch: options.pitch ?? 1.0 });
}

/**
 * 朗读组词：先读字再读词
 */
export function speakCharWithWord(character, word) {
  return speakAll([character, word], { lang: 'zh-HK', rate: 0.75, pitch: 1.0 });
}
