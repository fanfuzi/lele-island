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

export default function TimedMathGame({ level = 1, questionCount = 12, onComplete, onAnswer }) {
  const [phase, setPhase] = useState('setup');
  const [timeLimit, setTimeLimit] = useState(60);
  const [perQuestionTime, setPerQuestionTime] = useState(15);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);
  const startTime = useRef(null);
  const scoreRef = useRef(0);
  const totalRef = useRef(0);

  // 设置页
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
                  const t = l.id === 3 ? 120 : l.id === 2 ? 90 : 60;
                  setTimeLimit(t); setPerQuestionTime(l.id >= 2 ? 20 : 15);
                }}>
                  {l.label}<span className="timed-option-desc">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary timed-start-btn" onClick={() => {
            const qs = generateQuestions(questionCount, level);
            setQuestions(qs);
            setTotalTimeLeft(timeLimit);
            setQuestionTimeLeft(perQuestionTime);
            startTime.current = Date.now();
            scoreRef.current = 0; totalRef.current = 0;
            setScore(0); setTotalAnswered(0);
            setPhase('playing');
          }}>🚀 开始挑战！</button>
        </div>
      </div>
    );
  }

  // 结果页
  if (phase === 'result') {
    const finalScore = scoreRef.current;
    const finalTotal = totalRef.current || 1;
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

  // 答题中
  const question = questions[current];
  if (!question) return null;

  const shuffledOptions = useMemo(() => {
    if (!question?.options) return [];
    return shuffleArray(question.options);
  }, [question]);

  function submitAnswer(isCorrect) {
    if (isCorrect) { scoreRef.current += 1; setScore(scoreRef.current); }
    totalRef.current += 1; setTotalAnswered(totalRef.current);
    onAnswer?.(isCorrect, question);
  }

  const handleAnswer = useCallback((option) => {
    if (feedback) return;
    submitAnswer(option === question.answer);
    setFeedback(option === question.answer ? 'correct' : 'wrong');
    clearInterval(questionTimerRef.current);
    setTimeout(() => {
      setFeedback(null);
      if (current < questions.length - 1 && totalTimeLeft > 0) { setCurrent(c => c + 1); setQuestionTimeLeft(perQuestionTime); }
      else finishGame();
    }, 600);
  }, [current, questions, feedback, perQuestionTime, totalTimeLeft, question?.answer]);

  function handleTimeout() {
    if (feedback) return;
    submitAnswer(false);
    setFeedback('wrong');
    setTimeout(() => {
      setFeedback(null);
      if (current < questions.length - 1 && totalTimeLeft > 0) { setCurrent(c => c + 1); setQuestionTimeLeft(perQuestionTime); }
      else finishGame();
    }, 600);
  }

  function finishGame() {
    clearInterval(timerRef.current); clearInterval(questionTimerRef.current);
    onComplete?.(scoreRef.current, totalRef.current);
    setPhase('result');
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      const left = timeLimit - elapsed;
      if (left <= 0) { clearInterval(timerRef.current); finishGame(); }
      else setTotalTimeLeft(left);
    }, 200);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    questionTimerRef.current = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) { clearInterval(questionTimerRef.current); handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(questionTimerRef.current);
  }, [phase, current, feedback]);

  const totalProgress = ((timeLimit - totalTimeLeft) / timeLimit) * 100;
  const questionProgress = (questionTimeLeft / perQuestionTime) * 100;

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
          <span className={`qtimer-value ${questionTimeLeft <= 5 ? 'timer-danger' : ''}`}>⏳ {questionTimeLeft}s</span>
        </div>
      </div>
      <div className="speed-timer-bar"><div className="speed-timer-fill timed-total-fill" style={{ width: `${totalProgress}%` }} /></div>
      <div className="speed-timer-bar timed-qtimer-bar"><div className="speed-timer-fill timed-qtimer-fill" style={{ width: `${questionProgress}%`, background: questionTimeLeft <= 5 ? '#FF6B6B' : '#FFD700' }} /></div>
      <div className="timed-question-wrap"><div className="timed-question">{question.question}</div></div>
      <div className="speed-options speed-grid timed-options">
        {shuffledOptions.map((opt, i) => (
          <button key={i} className={`speed-option ${feedback ? (opt === question.answer ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleAnswer(opt)} disabled={feedback !== null}>{opt}</button>
        ))}
      </div>
      <div className="timed-score-bar">
        <span className="timed-score-correct">✅ {score}</span>
        <span className="timed-score-wrong">❌ {totalAnswered - score}</span>
      </div>
    </div>
  );
}
