import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

// Fisher-Yates 洗牌算法
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 限时挑战组件 - 快速答题
 * Props:
 *   questions: [{id, question, answer, options}]
 *   onComplete: (score, total) => void
 *   title: string
 *   timeLimit: number (秒)
 *   icon: string
 *   onAnswer: (correct, question) => void
 */
export default function SpeedChallenge({ questions, onComplete, title, timeLimit = 60, icon = '⚡', onAnswer }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);
  const startTime = useRef(Date.now());

  // 计时器
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      const left = timeLimit - elapsed;
      if (left <= 0) {
        clearInterval(timerRef.current);
        finishGame();
      } else {
        setTimeLeft(left);
      }
    }, 100);

    return () => clearInterval(timerRef.current);
  }, []);

  function finishGame() {
    clearInterval(timerRef.current);
    setFinished(true);
    onComplete?.(score, current);
  }

  const handleAnswer = useCallback((option) => {
    if (finished || feedback) return;

    const question = questions[current];
    if (!question) return;

    const isCorrect = option === question.answer;
    if (isCorrect) setScore(s => s + 1);
    onAnswer?.(isCorrect, question);

    // 反馈
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
      } else {
        finishGame();
      }
    }, 400);
  }, [current, questions, finished, feedback]);

  if (finished) {
    const rate = current > 0 ? Math.round((score / current) * 100) : 0;
    const stars = rate >= 90 ? '🌟🌟🌟' : rate >= 70 ? '🌟🌟' : '🌟';
    return (
      <div className="speed-result">
        <div className="speed-result-stars">{stars}</div>
        <div className="speed-result-score">答对 {score} / {current} 题</div>
        <div className="speed-result-rate">正确率 {rate}%</div>
        {rate >= 80 && <div className="speed-result-msg">太快了！你是速度之王！🏆</div>}
        {rate < 80 && rate >= 50 && <div className="speed-result-msg">加油，越来越快了！💪</div>}
        {rate < 50 && <div className="speed-result-msg">慢慢来，准确率更重要哦！😊</div>}
      </div>
    );
  }

  const question = questions[current];
  if (!question) return null;

  // 每次切换题目时打乱选项顺序
  const shuffledOptions = useMemo(() => {
    if (!question?.options) return [];
    return shuffleArray(question.options);
  }, [question]);

  const progress = ((timeLimit - timeLeft) / timeLimit) * 100;

  return (
    <div className="speed-challenge">
      {title && <h3 className="game-title">{icon} {title}</h3>}

      <div className="speed-header">
        <div className="speed-timer">
          <span className="timer-icon">⏱️</span>
          <span className={`timer-value ${timeLeft <= 10 ? 'timer-danger' : ''}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="speed-counter">
          第 {current + 1} 题
        </div>
      </div>

      <div className="speed-timer-bar">
        <div className="speed-timer-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="speed-question">{question.question}</div>

      <div className="speed-options speed-grid">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            className={`speed-option ${feedback ? (opt === question.answer ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleAnswer(opt)}
            disabled={feedback !== null}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
