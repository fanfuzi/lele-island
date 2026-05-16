import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * 填空题游戏组件
 * Props:
 *   questions: [{id, question, answer, mode?, hint?}]
 *   onComplete: (score, total) => void
 *   onAnswer: (correct, question) => void
 *   title: string
 *   icon: string
 */
export default function FillInGame({ questions, onComplete, onAnswer, title, icon = '✏️' }) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  const question = questions[current];
  const isNumberMode = question?.mode === 'number';

  // 清理输入
  useEffect(() => {
    setInput('');
    setFeedback(null);
  }, [current]);

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

  function handleSubmit() {
    if (feedback || !question || !input.trim()) return;

    const isCorrect = input.trim() === String(question.answer);
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

  function handleKeyPress(key) {
    if (feedback) return;
    if (key === 'submit') {
      handleSubmit();
    } else if (key === 'backspace') {
      setInput(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setInput('');
    } else if (key === 'negative') {
      setInput(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    } else if (key === '.' && !input.includes('.')) {
      setInput(prev => prev + '.');
    } else if (/^[0-9]$/.test(key)) {
      setInput(prev => prev + key);
    }
  }

  // 键盘事件
  useEffect(() => {
    function handleKeyboard(e) {
      if (feedback) return;
      if (e.key === 'Enter') { handleSubmit(); return; }
      if (e.key === 'Backspace') { setInput(prev => prev.slice(0, -1)); return; }
      if (e.key === '-' && isNumberMode) { handleKeyPress('negative'); return; }
      if (/^[0-9.]$/.test(e.key)) { setInput(prev => prev + e.key); return; }
    }
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [feedback, isNumberMode]);

  if (finished) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msg = pct >= 80 ? '太棒了！全部答对！🎉' : pct >= 50 ? '继续加油！💪' : '多练习就会更好哦！😊';
    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars}</div>
        <div className="quiz-result-score">{score} / {questions.length}</div>
        <div className="quiz-result-msg">{msg}</div>
      </div>
    );
  }

  if (!question) return <div className="quiz-empty">暂无题目</div>;

  return (
    <div className="fill-game">
      {title && <h3 className="game-title">{icon} {title}</h3>}

      <div className="fill-counter">
        第 {current + 1} / {questions.length} 题
      </div>

      <div className="fill-question">{question.question}</div>

      {question.hint && (
        <div className="fill-hint">💡 {question.hint}</div>
      )}

      {/* 答案输入显示 */}
      <div className={`fill-display ${feedback ? `fill-display-${feedback}` : ''}`}>
        <span className="fill-answer-text">{input || '?'}</span>
        {feedback && (
          <span className="fill-feedback-icon">
            {feedback === 'correct' ? '✓' : '✗'}
          </span>
        )}
      </div>

      <div className="fill-correct-answer">
        {feedback === 'wrong' && (
          <span>正确答案：{question.answer}</span>
        )}
      </div>

      {/* 数字键盘 */}
      {isNumberMode ? (
        <div className="fill-numpad">
          <div className="numpad-row">
            {[1,2,3].map(n => (
              <button key={n} className="numpad-btn" onClick={() => handleKeyPress(String(n))} disabled={!!feedback}>{n}</button>
            ))}
          </div>
          <div className="numpad-row">
            {[4,5,6].map(n => (
              <button key={n} className="numpad-btn" onClick={() => handleKeyPress(String(n))} disabled={!!feedback}>{n}</button>
            ))}
          </div>
          <div className="numpad-row">
            {[7,8,9].map(n => (
              <button key={n} className="numpad-btn" onClick={() => handleKeyPress(String(n))} disabled={!!feedback}>{n}</button>
            ))}
          </div>
          <div className="numpad-row">
            <button className="numpad-btn numpad-btn-sm" onClick={() => handleKeyPress('negative')} disabled={!!feedback}>-</button>
            <button className="numpad-btn" onClick={() => handleKeyPress('0')} disabled={!!feedback}>0</button>
            <button className="numpad-btn numpad-btn-sm" onClick={() => handleKeyPress('backspace')} disabled={!!feedback}>⌫</button>
          </div>
          <div className="numpad-row numpad-row-double">
            <button className="numpad-btn numpad-btn-wide" onClick={() => handleKeyPress('clear')} disabled={!!feedback}>清除</button>
            <button className="numpad-btn numpad-btn-submit" onClick={handleSubmit} disabled={!!feedback || !input.trim()}>✓</button>
          </div>
        </div>
      ) : (
        /* 文本输入模式 */
        <div className="fill-text-input-area">
          <input
            ref={inputRef}
            type="text"
            className="fill-text-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="输入答案..."
            disabled={!!feedback}
            autoFocus
          />
          <button className="fill-submit-btn" onClick={handleSubmit} disabled={!!feedback || !input.trim()}>
            确定
          </button>
        </div>
      )}
    </div>
  );
}
