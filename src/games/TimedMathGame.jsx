import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

function generateQuestions(count, level = 1) {
  const ops = level >= 3 ? ['+', '-', '×', '÷'] : level >= 2 ? ['+', '-', '×'] : ['+', '-'];
  const results = [];
  for (let i = 0; i < count; i++) {
    const op1 = ops[Math.floor(Math.random() * ops.length)];
    const op2 = ops[Math.floor(Math.random() * ops.length)];
    let a, b, c, ans;
    const isTwoOp = op2 !== '+' && Math.random() > 0.4;
    if (isTwoOp) {
      const ranges = level >= 3 ? [[10, 99], [2, 12], [2, 9]] : level === 2 ? [[5, 50], [2, 9], [2, 6]] : [[2, 30], [2, 9], null];
      const [r1, r2, r3] = ranges;
      a = Math.floor(Math.random() * (r1[1] - r1[0] + 1)) + r1[0];
      b = (op1 === '×' || op1 === '÷') ? Math.floor(Math.random() * 9) + 2 : Math.floor(Math.random() * (r2[1] - r2[0] + 1)) + r2[0];
      if (op1 === '÷') a = a * b;
      c = r3 ? ((op2 === '×' || op2 === '÷') ? Math.floor(Math.random() * 9) + 2 : Math.floor(Math.random() * (r3[1] - r3[0] + 1)) + r3[0]) : 0;
      if (op2 === '÷') { let t = applyOp(a, op1, b); if (t <= 0) t = Math.floor(Math.random() * 50) + 10; c = Math.floor(Math.random() * 9) + 2; a = t * c; }
      const v1 = applyOp(a, op1, b);
      ans = applyOp(v1, c ? op2 : '+', c || 0);
      if (!Number.isFinite(ans) || ans < 0 || ans > 9999) { i--; continue; }
      results.push({ id: `T-${i + 1}`, question: `${a} ${op1} ${b}${c ? ` ${op2} ${c}` : ''} = ?`, answer: String(Math.round(ans)), options: generateOptions(ans), category: 'mixed' });
    } else {
      a = Math.floor(Math.random() * (level >= 2 ? 99 : 50)) + 2;
      b = (op1 === '×' || op1 === '÷') ? Math.floor(Math.random() * 9) + 2 : Math.floor(Math.random() * a) + 1;
      if (op1 === '÷') a = a * b;
      ans = applyOp(a, op1, b);
      if (!Number.isFinite(ans) || ans < 0 || ans > 9999) { i--; continue; }
      results.push({ id: `T-${i + 1}`, question: `${a} ${op1} ${b} = ?`, answer: String(Math.round(ans)), options: generateOptions(ans), category: 'mixed' });
    }
  }
  return results;
}

function generateOptions(correctAnswer) {
  const correct = String(Math.round(correctAnswer));
  const distractors = new Set([correct]);
  while (distractors.size < 4) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const d = String(Math.max(0, Math.round(correctAnswer + (Math.random() > 0.5 ? 1 : -1) * offset)));
    if (d !== correct) distractors.add(d);
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

  // 所有可变值用 ref 存储，避免闭包陷阱
  const refs = useRef({
    score: 0, total: 0, current: 0, feedback: null,
    questions: [], totalTimeLeft: 0, perQTime: 15,
    qStartTime: Date.now(), answered: false,
  }).current;
  const liveOnComplete = useRef(onComplete);
  const liveOnAnswer = useRef(onAnswer);
  liveOnComplete.current = onComplete;
  liveOnAnswer.current = onAnswer;

  // 每帧更新显示（用 ref 值展示）
  const displayScore = score;
  const displayTotal = totalAnswered;
  const question = questions[current];
  const qTimeLeft = question ? Math.max(0, Math.ceil(refs.perQTime - (Date.now() - refs.qStartTime) / 1000)) : 0;

  const shuffledOptions = useMemo(() => {
    if (!question?.options) return [];
    return shuffleArray(question.options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.question]);

  function doAnswer(isCorrect) {
    if (isCorrect) refs.score += 1;
    refs.total += 1;
    refs.answered = true;
    setScore(refs.score);
    setTotalAnswered(refs.total);
    liveOnAnswer.current?.(isCorrect, question);
  }

  function advance() {
    const nextIdx = refs.current + 1;
    refs.feedback = null;
    refs.answered = false;
    refs.qStartTime = Date.now();
    if (nextIdx < refs.questions.length && refs.totalTimeLeft > 1) {
      refs.current = nextIdx;
      setCurrent(nextIdx);
      setFeedback(null);
    } else {
      liveOnComplete.current?.(refs.score, refs.total);
      setPhase('result');
    }
  }

  function handleTimeout() {
    if (refs.answered) return;
    doAnswer(false);
    setFeedback('wrong');
    setTimeout(advance, 600);
  }

  // 整体倒计时
  const gameStartRef = useRef(null);
  useEffect(() => {
    if (phase !== 'playing') return;
    gameStartRef.current = Date.now();
    refs.totalTimeLeft = timeLimit;
    setTotalTimeLeft(timeLimit);
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameStartRef.current) / 1000);
      const left = Math.max(0, timeLimit - elapsed);
      refs.totalTimeLeft = left;
      setTotalTimeLeft(left);
      if (left <= 0) {
        clearInterval(timer);
        liveOnComplete.current?.(refs.score, refs.total);
        setPhase('result');
      }
    }, 200);
    return () => clearInterval(timer);
  }, [phase]);

  // 每题倒计时
  useEffect(() => {
    if (phase !== 'playing') return;
    const qNum = refs.current;
    const timer = setInterval(() => {
      if (refs.current !== qNum) { clearInterval(timer); return; }
      if (refs.answered) { clearInterval(timer); return; }
      const elapsed = Math.floor((Date.now() - refs.qStartTime) / 1000);
      if (elapsed >= refs.perQTime) {
        clearInterval(timer);
        handleTimeout();
      }
    }, 200);
    return () => clearInterval(timer);
  }, [phase, current]);

  // ===== 渲染 =====
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
                <button key={l.id} className={`timed-option-btn timed-option-wide ${level === l.id ? 'active' : ''}`} onClick={() => {
                  setLevel(l.id);
                  setTimeLimit(l.id === 3 ? 120 : l.id === 2 ? 90 : 60);
                  setPerQuestionTime(l.id >= 2 ? 20 : 15);
                }}>
                  {l.label}<span className="timed-option-desc">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary timed-start-btn" onClick={() => {
            const qs = generateQuestions(questionCount, level);
            setQuestions(qs);
            refs.questions = qs;
            refs.score = 0; refs.total = 0; refs.current = 0;
            refs.feedback = null; refs.answered = false;
            refs.qStartTime = Date.now();
            refs.perQTime = perQuestionTime;
            refs.totalTimeLeft = timeLimit;
            gameStartRef.current = Date.now();
            setScore(0); setTotalAnswered(0); setCurrent(0);
            setTotalTimeLeft(timeLimit);
            setFeedback(null);
            setPhase('playing');
          }}>🚀 开始挑战！</button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const finalScore = refs.score;
    const finalTotal = refs.total || 1;
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

  if (!question) return <div className="timed-loading">加载题目中...</div>;

  const totalProgress = totalTimeLeft > 0 ? ((timeLimit - totalTimeLeft) / timeLimit) * 100 : 0;
  const qtProgress = qTimeLeft > 0 ? (qTimeLeft / perQuestionTime) * 100 : 0;

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
          <span className={`qtimer-value ${qTimeLeft <= 5 ? 'timer-danger' : ''}`}>⏳ {qTimeLeft}s</span>
        </div>
      </div>
      <div className="speed-timer-bar"><div className="speed-timer-fill timed-total-fill" style={{ width: `${totalProgress}%` }} /></div>
      <div className="speed-timer-bar timed-qtimer-bar"><div className="speed-timer-fill timed-qtimer-fill" style={{ width: `${qtProgress}%`, background: qTimeLeft <= 5 ? '#FF6B6B' : '#FFD700' }} /></div>
      <div className="timed-question-wrap"><div className="timed-question">{question.question}</div></div>
      <div className="speed-options speed-grid timed-options">
        {shuffledOptions.map((opt, i) => (
          <button key={i} className={`speed-option ${feedback ? (opt === question.answer ? 'correct' : 'wrong') : ''}`}
            onClick={() => {
              if (refs.answered) return;
              refs.answered = true;
              const right = opt === question.answer;
              doAnswer(right);
              setFeedback(right ? 'correct' : 'wrong');
              setTimeout(advance, 600);
            }} disabled={feedback !== null}>{opt}</button>
        ))}
      </div>
      <div className="timed-score-bar">
        <span className="timed-score-correct">✅ {displayScore}</span>
        <span className="timed-score-wrong">❌ {displayTotal - displayScore}</span>
      </div>
    </div>
  );
}
