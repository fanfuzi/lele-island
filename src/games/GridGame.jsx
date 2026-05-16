import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * 记忆配对游戏组件 (Grid Memory Match)
 * Props:
 *   questions: [{id, question, items, cols?}]
 *     items: [{pairId, label}] — 相同 pairId 的卡片配对
 *     cols: 列数 (默认 4)
 *   onComplete: (score, total) => void
 *   onAnswer: (correct, question) => void
 *   title: string
 *   icon: string
 */
export default function GridGame({ questions, onComplete, onAnswer, title, icon = '🎴' }) {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(new Set());     // 当前翻开的卡片索引
  const [matched, setMatched] = useState(new Set());       // 已配对的 pairId
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const lockRef = useRef(false);

  const question = questions[current];

  // 初始化/切换题目时打乱卡片
  useEffect(() => {
    if (!question) return;
    const indices = question.items.map((_, i) => i);
    const shuffled = [...indices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledIndices(shuffled);
    setRevealed(new Set());
    setMatched(new Set());
    setFeedback(null);
    lockRef.current = false;
  }, [question]);

  // 音效
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

  // 翻牌
  function handleReveal(index) {
    if (lockRef.current) return;
    if (matched.has(question.items[index].pairId)) return;
    if (revealed.has(index)) return;
    if (revealed.size >= 2) return;

    const next = new Set(revealed);
    next.add(index);
    setRevealed(next);

    // 翻开了两张 → 检查配对
    if (next.size === 2) {
      lockRef.current = true;
      const [first, second] = [...next];
      const isMatch = question.items[first].pairId === question.items[second].pairId;

      if (isMatch) {
        playSound(true);
        const newMatched = new Set(matched);
        newMatched.add(question.items[first].pairId);
        setMatched(newMatched);
        setRevealed(new Set());
        lockRef.current = false;

        // 检查是否全部配对完成
        if (newMatched.size === question.items.length / 2) {
          setScore(s => s + 1);
          setFeedback('correct');
          onAnswer?.(true, question);
          setTimeout(() => {
            if (current < questions.length - 1) {
              setCurrent(c => c + 1);
            } else {
              setFinished(true);
              onComplete?.(score + 1, questions.length);
            }
          }, 1000);
        }
      } else {
        playSound(false);
        onAnswer?.(false, question);
        setTimeout(() => {
          setRevealed(new Set());
          lockRef.current = false;
        }, 900);
      }
    }
  }

  if (finished) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msg = pct >= 80 ? '记忆力超强！🎉' : pct >= 50 ? '继续加油！💪' : '多练练记忆力！😊';
    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars}</div>
        <div className="quiz-result-score">{score} / {questions.length}</div>
        <div className="quiz-result-msg">{msg}</div>
      </div>
    );
  }

  if (!question) return <div className="quiz-empty">暂无题目</div>;

  const totalPairs = question.items.length / 2;
  const cols = question.cols || 4;

  return (
    <div className="grid-game">
      {title && <h3 className="game-title">{icon} {title}</h3>}

      <div className="grid-counter">
        第 {current + 1} / {questions.length} 关 · 找出 {totalPairs} 对
      </div>

      <div className="grid-question">{question.question}</div>

      {feedback === 'correct' && (
        <div className="grid-correct-banner">✓ 全部配对成功！</div>
      )}

      <div className="grid-board" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {shuffledIndices.map((origIdx) => {
          const item = question.items[origIdx];
          const isMatched = matched.has(item.pairId);
          const isRevealed = revealed.has(origIdx);
          const cardClass = `grid-card${isMatched ? ' grid-card-matched' : ''}${isRevealed ? ' grid-card-revealed' : ''}`;

          return (
            <button
              key={`${item.pairId}-${origIdx}`}
              className={cardClass}
              onClick={() => handleReveal(origIdx)}
              disabled={isMatched}
            >
              <span className="grid-card-inner">
                {isRevealed || isMatched ? item.label : '?'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid-progress">
        已配对：{matched.size} / {totalPairs}
      </div>
    </div>
  );
}
