import { useState, useEffect, useRef, useMemo } from 'react';

function generateQuestions(count, level = 1) {
  const ops = level >= 3 ? ['+', '-', '×', '÷'] : level >= 2 ? ['+', '-', '×'] : ['+', '-'];
  const results = [];
  for (let i = 0; i < count; i++) {
    const op1 = ops[Math.floor(Math.random() * ops.length)];
    const _ = Math.floor(Math.random() * ops.length);
    let a, b, c, ans;
    const isTwoOp = _ > 1 && Math.random() > 0.3;
    if (isTwoOp) {
      const ranges = level >= 3 ? [[10, 99], [2, 12], [2, 9]] : level === 2 ? [[5, 50], [2, 9], [2, 6]] : [[2, 30], [2, 9], [2, 5]];
      const [r1, r2, r3] = ranges;
      a = r1[0] + Math.floor(Math.random() * (r1[1] - r1[0] + 1));
      b = (op1 === '×' || op1 === '÷') ? 2 + Math.floor(Math.random() * 9) : r2[0] + Math.floor(Math.random() * (r2[1] - r2[0] + 1));
      if (op1 === '÷') a = a * b;
      c = r3 ? ((op2 === '×' || op2 === '÷') ? 2 + Math.floor(Math.random() * 9) : r3[0] + Math.floor(Math.random() * (r3[1] - r3[0] + 1))) : 0;
      if (op2 === '÷') { c = 2 + Math.floor(Math.random() * 9); a = (applyOp(a, op1, b) || 1) * c; }
      const v1 = applyOp(a, op1, b);
      ans = applyOp(v1, c ? op2 : '+', c || 0);
      if (!Number.isFinite(ans) || ans < 0 || ans > 9999) { i--; continue; }
      results.push({ id: `T${i}-${Date.now()}`, question: `${a} ${op1} ${b}${c ? ` ${op2} ${c}` : ''} = ?`, answer: String(Math.round(ans)), options: generateOptions(ans), category: 'mixed' });
    } else {
      a = 2 + Math.floor(Math.random() * (level >= 2 ? 98 : 49));
      b = (op1 === '×' || op1 === '÷') ? 2 + Math.floor(Math.random() * 9) : 1 + Math.floor(Math.random() * a);
      if (op1 === '÷') a = a * b;
      ans = applyOp(a, op1, b);
      if (!Number.isFinite(ans) || ans < 0 || ans > 9999) { i--; continue; }
      results.push({ id: `T${i}-${Date.now()}`, question: `${a} ${op1} ${b} = ?`, answer: String(Math.round(ans)), options: generateOptions(ans), category: 'mixed' });
    }
  }
  return results;
}

function generateOptions(correctAnswer) {
  const correct = String(Math.round(correctAnswer));
  const distractors = new Set([correct]);
  while (distractors.size < 4) {
    const offset = 1 + Math.floor(Math.random() * 9);
    const d = String(Math.max(0, Math.round(correctAnswer + (Math.random() > 0.5 ? 1 : -1) * offset)));
    if (d !== correct && d.length <= 5) distractors.add(d);
  }
  return shuffleArray([...distractors]);
}

function applyOp(a, op, b) {
  switch (op) { case '+': return a + b; case '-': return a - b; case '×': return a * b; case '÷': return b !== 0 ? a / b : 0; default: return 0; }
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

  // refs 存储可变数据，避免闭包陷阱
  const r = useRef({ score: 0, total: 0, idx: 0, answered: false, qStart: 0, perQ: 15, remaining: 0, qs: [] }).current;
  const onCb = useRef(onComplete);
  const onAb = useRef(onAnswer);
  onCb.current = onComplete;
  onAb.current = onAnswer;

  const question = questions[current];
  const qLeft = question ? Math.max(0, Math.ceil(r.perQ - (Date.now() - r.qStart) / 1000)) : 0;

  // 打乱选项（必须在所有 if return 之前，遵守 hooks 规则）
  const options = useMemo(() => {
    if (!question?.options) return [];
    return shuffleArray([...question.options]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, question?.id]);

  // 选难度时同时改计时参数
  const handleDifficulty = (lvl) => {
    setLevel(lvl);
    setTimeLimit(lvl >= 3 ? 120 : lvl >= 2 ? 90 : 60);
    setPerQuestionTime(lvl >= 2 ? 20 : 15);
  };

  // 开始游戏
  const startGame = () => {
    const qs = generateQuestions(questionCount, level);
    const now = Date.now();
    setQuestions(qs);
    r.qs = qs; r.score = 0; r.total = 0; r.idx = 0; r.answered = false; r.qStart = now; r.perQ = perQuestionTime; r.remaining = timeLimit;
    setScore(0); setTotalAnswered(0); setCurrent(0); setTotalTimeLeft(timeLimit); setFeedback(null);
    setPhase('playing');
  };

  // 提交答案 + 前进
  const onOptionClick = useRef(null);
  onOptionClick.current = (opt, ans) => {
    if (r.answered) return;
    r.answered = true;
    const correct = opt === ans;
    if (correct) r.score += 1;
    r.total += 1;
    setScore(r.score);
    setTotalAnswered(r.total);
    setFeedback(correct ? 'correct' : 'wrong');
    onAb.current?.(correct, question);
    setTimeout(() => {
      const next = r.idx + 1;
      if (next < r.qs.length && r.remaining > 1) {
        r.idx = next; r.answered = false; r.qStart = Date.now();
        setCurrent(next); setFeedback(null);
      } else {
        onCb.current?.(r.score, r.total);
        setPhase('result');
      }
    }, 600);
  };

  // 超时处理
  const handleTimeout = () => {
    if (r.answered) return;
    r.answered = true; r.total += 1;
    setTotalAnswered(r.total);
    setFeedback('wrong');
    onAb.current?.(false, question);
    setTimeout(() => {
      const next = r.idx + 1;
      if (next < r.qs.length && r.remaining > 1) {
        r.idx = next; r.answered = false; r.qStart = Date.now();
        setCurrent(next); setFeedback(null);
      } else {
        onCb.current?.(r.score, r.total);
        setPhase('result');
      }
    }, 600);
  };

  // 整体倒计时
  const gameStart = useRef(0);
  useEffect(() => {
    if (phase !== 'playing') return;
    gameStart.current = Date.now();
    r.remaining = timeLimit;
    setTotalTimeLeft(timeLimit);
    const t = setInterval(() => {
      const left = Math.max(0, timeLimit - Math.floor((Date.now() - gameStart.current) / 1000));
      r.remaining = left;
      setTotalTimeLeft(left);
      if (left <= 0) { clearInterval(t); onCb.current?.(r.score, r.total); setPhase('result'); }
    }, 200);
    return () => clearInterval(t);
  }, [phase]);

  // 每题倒计时
  useEffect(() => {
    if (phase !== 'playing') return;
    const curIdx = r.idx;
    const t = setInterval(() => {
      if (r.idx !== curIdx || r.answered) { clearInterval(t); return; }
      if (Math.floor((Date.now() - r.qStart) / 1000) >= r.perQ) { clearInterval(t); handleTimeout(); }
    }, 200);
    return () => clearInterval(t);
  }, [phase, current]);

  // ===== 设置页 =====
  if (phase === 'setup') {
    return (
      <div className="timed-setup">
        <h3 className="game-title">⏱️ 计时混合运算</h3>
        <div className="timed-setup-card">
          <div className="timed-setup-row">
            <span>⏱️ 总时长</span>
            <div className="timed-setup-inputs">
              {[30, 60, 90, 120].map(t => (
                <button key={t} className={`timed-option-btn ${timeLimit === t ? 'active' : ''}`} onClick={() => setTimeLimit(t)}>{t}秒</button>
              ))}
            </div>
          </div>
          <div className="timed-setup-row">
            <span>📝 每题限时</span>
            <div className="timed-setup-inputs">
              {[5, 10, 15, 20, 30].map(t => (
                <button key={t} className={`timed-option-btn ${perQuestionTime === t ? 'active' : ''}`} onClick={() => setPerQuestionTime(t)}>{t}秒</button>
              ))}
            </div>
          </div>
          <div className="timed-setup-row">
            <span>📊 难度</span>
            <div className="timed-setup-inputs">
              {[{ id: 1, label: '🌱 基础', desc: '加减法' }, { id: 2, label: '🌿 进阶', desc: '含乘法' }, { id: 3, label: '🔥 挑战', desc: '含除法+混合' }].map(l => (
                <button key={l.id} className={`timed-option-btn timed-option-wide ${level === l.id ? 'active' : ''}`} onClick={() => handleDifficulty(l.id)}>
                  {l.label}<span className="timed-option-desc">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary timed-start-btn" onClick={startGame}>🚀 开始挑战！</button>
        </div>
      </div>
    );
  }

  // ===== 结果页 =====
  if (phase === 'result') {
    const finalScore = r.score;
    const finalTotal = r.total || 1;
    const rate = Math.round((finalScore / finalTotal) * 100);
    const stars = rate >= 90 ? '🌟🌟🌟' : rate >= 70 ? '🌟🌟' : '🌟';
    const msg = rate >= 80 ? '太厉害了！你是运算小天才！🏆' : rate >= 50 ? '不错哦！继续加油！💪' : '多练习几次就会越来越快！😊';
    return (
      <div className="speed-result">
        <div className="speed-result-stars">{stars}</div>
        <div className="timed-result-stats">
          <div className="timed-stat"><span className="timed-stat-num">{finalScore}</span><span className="timed-stat-label">答对</span></div>
          <div className="timed-stat"><span className="timed-stat-num">{finalTotal - finalScore}</span><span className="timed-stat-label">答错</span></div>
          <div className="timed-stat"><span className="timed-stat-num">{finalTotal}</span><span className="timed-stat-label">总题数</span></div>
          <div className="timed-stat"><span className="timed-stat-num">{rate}%</span><span className="timed-stat-label">正确率</span></div>
        </div>
        <div className="speed-result-rate">{msg}</div>
        <button className="btn btn-primary" onClick={() => setPhase('setup')}>🔄 再来一轮</button>
      </div>
    );
  }

  // ===== 答题中 =====
  if (!question) return <div className="timed-loading">加载题目中...</div>;
  const totalProgress = timeLimit > 0 ? ((timeLimit - totalTimeLeft) / timeLimit) * 100 : 0;
  const qtProgress = perQuestionTime > 0 ? (qLeft / perQuestionTime) * 100 : 0;

  return (
    <div className="timed-game">
      <div className="timed-header">
        <div className="timed-total-timer">
          <span className="timer-icon">⏱️</span>
          <span className={`timer-value ${totalTimeLeft <= 10 ? 'timer-danger' : ''}`}>{totalTimeLeft}s</span>
          <span className="timer-label">剩余</span>
        </div>
        <div className="timed-counter">{current + 1}/{questions.length}</div>
        <div className="timed-qtimer">
          <span className={`qtimer-value ${qLeft <= 5 ? 'timer-danger' : ''}`}>⏳ {qLeft}s</span>
        </div>
      </div>
      <div className="speed-timer-bar"><div className="speed-timer-fill timed-total-fill" style={{ width: `${totalProgress}%` }} /></div>
      <div className="speed-timer-bar timed-qtimer-bar"><div className="speed-timer-fill timed-qtimer-fill" style={{ width: `${qtProgress}%`, background: qLeft <= 5 ? '#FF6B6B' : '#FFD700' }} /></div>
      <div className="timed-question-wrap"><div className="timed-question">{question.question}</div></div>
      <div className="speed-options speed-grid timed-options">
        {options.map((opt, i) => (
          <button key={`${question?.id}-${i}`} className={`speed-option ${feedback ? (opt === question.answer ? 'correct' : 'wrong') : ''}`}
            onClick={() => onOptionClick.current?.(opt, question.answer)} disabled={feedback !== null}>{opt}</button>
        ))}
      </div>
      <div className="timed-score-bar">
        <span className="timed-score-correct">✅ {score}</span>
        <span className="timed-score-wrong">❌ {totalAnswered - score}</span>
      </div>
    </div>
  );
}
