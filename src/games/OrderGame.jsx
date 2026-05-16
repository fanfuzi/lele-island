import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * 排序题游戏组件
 * Props:
 *   questions: [{id, question, items, correctOrder, hint?}]
 *     items: 待排序的选项数组
 *     correctOrder: 正确顺序的索引数组 (如 [2, 0, 1])
 *   onComplete: (score, total) => void
 *   onAnswer: (correct, question) => void
 *   title: string
 *   icon: string
 */
export default function OrderGame({ questions, onComplete, onAnswer, title, icon = '🔢' }) {
  const [current, setCurrent] = useState(0);
  const [placed, setPlaced] = useState([]);       // 已放置的索引数组 (顺序)
  const [remaining, setRemaining] = useState([]); // 剩余的索引数组
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  // 初始化/切换题目时打乱剩余选项
  useEffect(() => {
    if (!question) return;
    const indices = question.items.map((_, i) => i);
    const shuffled = [...indices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlaced([]);
    setRemaining(shuffled);
    setFeedback(null);
  }, [question]);

  function playSound(correct) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      if (correct) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  }

  // 从剩余区点击一个 → 放到已放置区末尾
  function handlePlace(index) {
    if (feedback) return;
    setPlaced(prev => [...prev, index]);
    setRemaining(prev => prev.filter(i => i !== index));
  }

  // 从已放置区点击一个 → 放回剩余区
  function handleRemove(index) {
    if (feedback) return;
    setPlaced(prev => prev.filter(i => i !== index));
    setRemaining(prev => [...prev, index]);
  }

  function handleSubmit() {
    if (feedback || !question || placed.length !== question.items.length) return;

    const isCorrect = placed.every((idx, pos) => idx === question.correctOrder[pos]);
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    onAnswer?.(isCorrect, question);
    playSound(isCorrect);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
      } else {
        setFinished(true);
        onComplete?.(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 1200);
  }

  if (finished) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msg = pct >= 80 ? '排序全对！太棒了！🎉' : pct >= 50 ? '不错哦，继续加油！💪' : '多练几次就熟了！😊';
    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars}</div>
        <div className="quiz-result-score">{score} / {questions.length}</div>
        <div className="quiz-result-msg">{msg}</div>
      </div>
    );
  }

  if (!question) return <div className="quiz-empty">暂无题目</div>;

  const allPlaced = placed.length === question.items.length;

  return (
    <div className="order-game">
      {title && <h3 className="game-title">{icon} {title}</h3>}

      <div className="order-counter">
        第 {current + 1} / {questions.length} 题
      </div>

      <div className="order-question">{question.question}</div>

      {question.hint && (
        <div className="order-hint">💡 {question.hint}</div>
      )}

      {/* 已排序区域 */}
      <div className={`order-placed-area ${feedback ? `order-placed-${feedback}` : ''}`}>
        <div className="order-placed-label">你的排序</div>
        <div className="order-placed-list">
          {placed.length === 0 && (
            <span className="order-placeholder">点击下面的选项放入此处</span>
          )}
          {placed.map((idx, pos) => (
            <button
              key={`placed-${idx}`}
              className="order-placed-item"
              onClick={() => handleRemove(idx)}
              disabled={!!feedback}
            >
              <span className="order-placed-pos">{pos + 1}.</span>
              <span>{question.items[idx]}</span>
              {!feedback && <span className="order-remove-hint">✕</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 正确/错误反馈 */}
      {feedback && (
        <div className={`order-feedback-bar order-feedback-${feedback}`}>
          {feedback === 'correct' ? (
            <span>✓ 顺序正确！</span>
          ) : (
            <span>✗ 正确的顺序：{question.correctOrder.map(i => question.items[i]).join(' → ')}</span>
          )}
        </div>
      )}

      {/* 剩余选项区 */}
      <div className="order-remaining-area">
        <div className="order-remaining-label">请选择</div>
        <div className="order-remaining-list">
          {remaining.map(idx => (
            <button
              key={`rem-${idx}`}
              className="order-remaining-item"
              onClick={() => handlePlace(idx)}
              disabled={!!feedback}
            >
              {question.items[idx]}
            </button>
          ))}
        </div>
      </div>

      {allPlaced && !feedback && (
        <div className="order-submit-area">
          <button className="order-submit-btn" onClick={handleSubmit}>
            确认排序 ✓
          </button>
        </div>
      )}
    </div>
  );
}
