import { useState, useEffect, useRef, useMemo } from 'react';

function calc(x, y, op) {
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '×': return x * y;
    case '÷': return y !== 0 && x % y === 0 ? x / y : null;
    default: return null;
  }
}

function generateQuestions(count, level = 1) {
  const ops = level >= 3 ? ['+', '-', '×', '÷'] : level >= 2 ? ['+', '-', '×'] : ['+', '-'];
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  // 减法相关：max 确保不負
  // 除法相關：保證整除
  // 全用正向構造，不依賴 try-catch retry

  function makeLL() {   // 低-低: (a ○ b) ○ c
    const op1 = ops[Math.floor(Math.random() * ops.length)];
    const op2 = ops[Math.floor(Math.random() * ops.length)];
    const r = level >= 3 ? [10, 99] : [10, 50];
    let a = rand(r[0], r[1]);
    let b = rand(2, level >= 2 ? 9 : 8);
    // 確保 (a ○ b) ≥ 0
    if (op1 === '-') a = a + b;
    const v1 = calc(a, b, op1);
    if (v1 === null) return null;
    let c = rand(2, level >= 2 ? 9 : 8);
    if (op2 === '-' && v1 < c) c = rand(1, v1);
    const ans = calc(v1, c, op2);
    if (ans === null || ans < 0) return null;
    return { display: `(${a} ${op1} ${b}) ${op2} ${c} = ?`, ans };
  }

  function makeHH() {   // 高-高: (a ○ b) ○ c — 只用 ×，不用 ÷（太難且不穩定）
    const op1 = '×';
    const op2 = Math.random() > 0.5 ? '×' : '÷';
    const a = rand(2, level >= 3 ? 20 : 12);
    const b = rand(2, 9);
    const v1 = calc(a, b, op1);
    if (v1 === null) return null;
    let c;
    if (op2 === '÷') {
      // 從 v1 的因數中選 c
      const factors = [];
      for (let i = 2; i <= Math.min(v1, 12); i++) if (v1 % i === 0) factors.push(i);
      if (factors.length === 0) return null;
      c = factors[Math.floor(Math.random() * factors.length)];
    } else {
      c = rand(2, 9);
    }
    const ans = calc(v1, c, op2);
    if (ans === null || ans < 0 || ans > 9999) return null;
    return { display: `(${a} ${op1} ${b}) ${op2} ${c} = ?`, ans };
  }

  function makeHL() {   // 高-低: a ○ b ○ c （先乘除後加减）
    const highOps = level >= 3 && Math.random() > 0.5 ? ['×', '÷'] : ['×'];
    const lowOps = ['+', '-'];
    const op1 = highOps[Math.floor(Math.random() * highOps.length)];
    const op2 = lowOps[Math.floor(Math.random() * lowOps.length)];
    let a = rand(2, level >= 3 ? 50 : 20);
    let b = rand(2, 9);
    // 確保 a ÷ b 整除
    if (op1 === '÷') a = a * b;
    const v1 = calc(a, b, op1);
    if (v1 === null) return null;
    let c = rand(2, 9);
    // 如果是減：確保 v1 ≥ c
    if (op2 === '-' && v1 < c) c = rand(1, Math.max(1, v1));
    const ans = calc(v1, c, op2);
    if (ans === null || ans < 0 || ans > 9999) return null;
    return { display: `${a} ${op1} ${b} ${op2} ${c} = ?`, ans };
  }

  function makeLH() {   // 低-高: a ○ b ○ c（先乘除後加减，op2 = ×÷）
    const lowOps = ['+'];
    const highOps = level >= 3 && Math.random() > 0.5 ? ['×', '÷'] : ['×'];
    // op1 只用 +（減法搭配高優先級容易負數）
    const op1 = lowOps[Math.floor(Math.random() * lowOps.length)];
    const op2 = highOps[Math.floor(Math.random() * highOps.length)];
    let b = rand(2, 9);
    let c = rand(2, 9);
    if (op2 === '÷') {
      // 確保 b ÷ c 整除
      b = b * c;
      // 避免太大
      if (b > 81) { b = rand(2, 9); c = rand(2, 9); if (c > b) [b, c] = [c, b]; b = b * c; }
    }
    const v2 = calc(b, c, op2);
    if (v2 === null || v2 < 0) return null;
    const a = rand(level >= 3 ? 10 : 5, 99);
    const ans = calc(a, v2, op1);
    if (ans === null || ans < 0 || ans > 9999) return null;
    return { display: `${a} ${op1} ${b} ${op2} ${c} = ?`, ans };
  }

  const makers = level >= 3 ? [makeLL, makeHH, makeHL, makeLH] : level === 2 ? [makeLL, makeHH, makeHL] : [makeLL];

  const results = [];
  let attempts = 0;
  while (results.length < count && attempts < count * 20) {
    attempts++;
    const maker = makers[Math.floor(Math.random() * makers.length)];
    const result = maker();
    if (!result) continue;
    if (results.some(r => r.ans === result.ans && r.display === result.display)) continue;
    const correct = String(result.ans);
    const distractors = new Set([correct]);
    while (distractors.size < 4) {
      const offset = 1 + Math.floor(Math.random() * 9);
      const d = String(Math.max(0, result.ans + (Math.random() > 0.5 ? 1 : -1) * offset));
      if (d !== correct && d.length <= 5) distractors.add(d);
    }
    results.push({ id: `T${results.length}-${Date.now()}`, question: result.display, answer: correct, options: shuffleArray([...distractors]), category: 'mixed' });
  }
  for (const q of results) {
    if (!q.options.includes(q.answer)) q.options[0] = q.answer;
  }
  return results;
}

function shuffleArray(arr) {
  const s = [...arr]; for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; } return s;
}

export default function TimedMathGame({ level: defaultLevel = 1, questionCount = 12, onComplete, onAnswer }) {
  const [phase, setPhase] = useState('setup');
  const [level, setLevel] = useState(defaultLevel);
  const [timeLimit, setTimeLimit] = useState(60);
  const [perQuestionTime, setPerQuestionTime] = useState(15);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);

  const r = useRef({ score: 0, total: 0, idx: 0, answered: false, qStart: 0, perQ: 15, remaining: 0, qs: [] }).current;
  const onCb = useRef(onComplete);
  const onAb = useRef(onAnswer);
  onCb.current = onComplete;
  onAb.current = onAnswer;

  const question = questions[current];
  const qLeft = question ? Math.max(0, Math.ceil(r.perQ - (Date.now() - r.qStart) / 1000)) : 0;
  const options = useMemo(() => {
    if (!question?.options) return [];
    return shuffleArray([...question.options]);
  }, [current, question?.id]);

  const handleDifficulty = (lvl) => {
    setLevel(lvl);
    setTimeLimit(lvl >= 3 ? 120 : lvl >= 2 ? 90 : 60);
    setPerQuestionTime(lvl >= 2 ? 25 : 20);
  };

  const startGame = () => {
    const qs = generateQuestions(questionCount, level);
    const now = Date.now();
    setQuestions(qs);
    r.qs = qs; r.score = 0; r.total = 0; r.idx = 0; r.answered = false; r.qStart = now; r.perQ = perQuestionTime; r.remaining = timeLimit;
    setScore(0); setTotalAnswered(0); setCurrent(0); setTotalTimeLeft(timeLimit); setFeedback(null);
    setPhase('playing');
  };

  const onOptionClick = useRef(null);
  onOptionClick.current = (opt, ans) => {
    if (r.answered) return;
    r.answered = true;
    const correct = opt === ans;
    if (correct) r.score += 1;
    r.total += 1;
    setScore(r.score); setTotalAnswered(r.total);
    setFeedback(correct ? 'correct' : 'wrong');
    onAb.current?.(correct, question);
    setTimeout(() => {
      const next = r.idx + 1;
      if (next < r.qs.length && r.remaining > 1) { r.idx = next; r.answered = false; r.qStart = Date.now(); setCurrent(next); setFeedback(null); }
      else { onCb.current?.(r.score, r.total); setPhase('result'); }
    }, 600);
  };

  const handleTimeout = () => {
    if (r.answered) return;
    r.answered = true; r.total += 1;
    setTotalAnswered(r.total); setFeedback('wrong');
    onAb.current?.(false, question);
    setTimeout(() => {
      const next = r.idx + 1;
      if (next < r.qs.length && r.remaining > 1) { r.idx = next; r.answered = false; r.qStart = Date.now(); setCurrent(next); setFeedback(null); }
      else { onCb.current?.(r.score, r.total); setPhase('result'); }
    }, 600);
  };

  const gameStart = useRef(0);
  useEffect(() => {
    if (phase !== 'playing') return;
    gameStart.current = Date.now(); r.remaining = timeLimit; setTotalTimeLeft(timeLimit);
    const t = setInterval(() => {
      const left = Math.max(0, timeLimit - Math.floor((Date.now() - gameStart.current) / 1000));
      r.remaining = left; setTotalTimeLeft(left);
      if (left <= 0) { clearInterval(t); onCb.current?.(r.score, r.total); setPhase('result'); }
    }, 200);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const curIdx = r.idx;
    const t = setInterval(() => {
      if (r.idx !== curIdx || r.answered) { clearInterval(t); return; }
      if (Math.floor((Date.now() - r.qStart) / 1000) >= r.perQ) { clearInterval(t); handleTimeout(); }
    }, 200);
    return () => clearInterval(t);
  }, [phase, current]);

  if (phase === 'setup') {
    return (<div className="timed-setup"><h3 className="game-title">⏱️ 计时混合运算</h3><div className="timed-setup-card">
      <div className="timed-setup-row"><span>⏱️ 总时长</span><div className="timed-setup-inputs">{ [30, 60, 90, 120].map(t => (<button key={t} className={`timed-option-btn ${timeLimit === t ? 'active' : ''}`} onClick={() => setTimeLimit(t)}>{t}秒</button>)) }</div></div>
      <div className="timed-setup-row"><span>📝 每题限时</span><div className="timed-setup-inputs">{ [5, 10, 15, 20, 30].map(t => (<button key={t} className={`timed-option-btn ${perQuestionTime === t ? 'active' : ''}`} onClick={() => setPerQuestionTime(t)}>{t}秒</button>)) }</div></div>
      <div className="timed-setup-row"><span>📊 难度</span><div className="timed-setup-inputs">{ [{id:1,label:'🌱 基础',desc:'加减混合'},{id:2,label:'🌿 进阶',desc:'加减乘混合'},{id:3,label:'🔥 挑战',desc:'加减乘除'}].map(l => (<button key={l.id} className={`timed-option-btn timed-option-wide ${level === l.id ? 'active' : ''}`} onClick={() => handleDifficulty(l.id)}>{l.label}<span className="timed-option-desc">{l.desc}</span></button>)) }</div></div>
      <button className="btn btn-primary timed-start-btn" onClick={startGame}>🚀 开始挑战！</button>
    </div></div>);
  }

  if (phase === 'result') {
    const finalScore = r.score; const finalTotal = r.total || 1; const rate = Math.round((finalScore / finalTotal) * 100);
    const stars = rate >= 90 ? '🌟🌟🌟' : rate >= 70 ? '🌟🌟' : '🌟';
    const msg = rate >= 80 ? '混合運算高手！🏆' : rate >= 50 ? '不錯哦！💪' : '多練習幾次！😊';
    return (<div className="speed-result"><div className="speed-result-stars">{stars}</div>
      <div className="timed-result-stats">
        <div className="timed-stat"><span className="timed-stat-num">{finalScore}</span><span className="timed-stat-label">答对</span></div>
        <div className="timed-stat"><span className="timed-stat-num">{finalTotal - finalScore}</span><span className="timed-stat-label">答错</span></div>
        <div className="timed-stat"><span className="timed-stat-num">{finalTotal}</span><span className="timed-stat-label">总题数</span></div>
        <div className="timed-stat"><span className="timed-stat-num">{rate}%</span><span className="timed-stat-label">正确率</span></div>
      </div>
      <div className="speed-result-rate">{msg}</div>
      <button className="btn btn-primary" onClick={() => setPhase('setup')}>🔄 再来一轮</button>
    </div>);
  }

  if (!question) return <div className="timed-loading">加载题目中...</div>;
  const totalProgress = timeLimit > 0 ? ((timeLimit - totalTimeLeft) / timeLimit) * 100 : 0;
  const qtProgress = perQuestionTime > 0 ? (qLeft / perQuestionTime) * 100 : 0;

  return (<div className="timed-game">
    <div className="timed-header">
      <div className="timed-total-timer"><span className="timer-icon">⏱️</span><span className={`timer-value ${totalTimeLeft <= 10 ? 'timer-danger' : ''}`}>{totalTimeLeft}s</span><span className="timer-label">剩余</span></div>
      <div className="timed-counter">{current + 1}/{questions.length}</div>
      <div className="timed-qtimer"><span className={`qtimer-value ${qLeft <= 5 ? 'timer-danger' : ''}`}>⏳ {qLeft}s</span></div>
    </div>
    <div className="speed-timer-bar"><div className="speed-timer-fill timed-total-fill" style={{ width: `${totalProgress}%` }} /></div>
    <div className="speed-timer-bar timed-qtimer-bar"><div className="speed-timer-fill timed-qtimer-fill" style={{ width: `${qtProgress}%`, background: qLeft <= 5 ? '#FF6B6B' : '#FFD700' }} /></div>
    <div className="timed-question-wrap"><div className="timed-question">{question.question}</div></div>
    <div className="speed-options speed-grid timed-options">
      {options.map((opt, i) => (<button key={`${question?.id}-${i}`} className={`speed-option ${feedback ? (opt === question.answer ? 'correct' : 'wrong') : ''}`}
        onClick={() => onOptionClick.current?.(opt, question.answer)} disabled={feedback !== null}>{opt}</button>))}
    </div>
    <div className="timed-score-bar">
      <span className="timed-score-correct">✅ {score}</span>
      <span className="timed-score-wrong">❌ {totalAnswered - score}</span>
    </div>
  </div>);
}
