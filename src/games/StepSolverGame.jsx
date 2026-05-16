import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * 多步解题游戏组件
 * Props:
 *   questions: [{id, question, steps, hint?}]
 *     steps: [{prompt, answer}]
 *     question: 题目描述
 *   onComplete: (score, total) => void
 *   onAnswer: (correct, question, stepResults) => void
 *   title: string
 *   icon: string
 */
export default function StepSolverGame({ questions, onComplete, onAnswer, title, icon = '🧩' }) {
  const [current, setCurrent] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState('');
  const [stepFeedback, setStepFeedback] = useState(null);  // 'correct' | 'wrong' | null
  const [stepResults, setStepResults] = useState([]);        // [true, false, ...]
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showingStepResult, setShowingStepResult] = useState(false);

  const question = questions[current];

  // 切换题目时重置
  useEffect(() => {
    setStepIndex(0);
    setInput('');
    setStepFeedback(null);
    setStepResults([]);
    setShowingStepResult(false);
  }, [current]);

  const isNumberMode = question?.steps?.every(s => /^-?\d+(\.\d+)?$/.test(s.answer));

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
    if (showingStepResult || !question || !input.trim()) return;

    const step = question.steps[stepIndex];
    const isCorrect = input.trim() === String(step.answer);
    const newResults = [...stepResults, isCorrect];
    setStepResults(newResults);
    setStepFeedback(isCorrect ? 'correct' : 'wrong');
    setShowingStepResult(true);
    playSound(isCorrect);

    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (stepIndex < question.steps.length - 1) {
        // 下一步
        setStepIndex(i => i + 1);
        setInput('');
        setStepFeedback(null);
        setShowingStepResult(false);
      } else {
        // 所有步骤完成
        const totalCorrect = newResults.filter(Boolean).length;
        const allCorrect = totalCorrect === question.steps.length;
        onAnswer?.(allCorrect, question, newResults);
        if (current < questions.length - 1) {
          setCurrent(c => c + 1);
        } else {
          setFinished(true);
          onComplete?.(score + (isCorrect ? 1 : 0), questions.length * question.steps.length);
        }
      }
    }, 1200);
  }

  // 虚拟数字键盘
  function handleKeyPress(key) {
    if (showingStepResult) return;
    if (key === 'submit') { handleSubmit(); return; }
    if (key === 'backspace') { setInput(prev => prev.slice(0, -1)); return; }
    if (key === 'clear') { setInput(''); return; }
    if (key === 'negative') { setInput(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev); return; }
    if (key === '.' && !input.includes('.')) { setInput(prev => prev + '.'); return; }
    if (/^[0-9]$/.test(key)) { setInput(prev => prev + key); return; }
    setInput(prev => prev + key);
  }

  useEffect(() => {
    function handleKeyboard(e) {
      if (showingStepResult) return;
      if (e.key === 'Enter') { handleSubmit(); return; }
      if (e.key === 'Backspace') { handleKeyPress('backspace'); return; }
      if (!isNumberMode && e.key.length === 1) { handleKeyPress(e.key); return; }
      if (isNumberMode && /^[0-9.-]$/.test(e.key)) { handleKeyPress(e.key === '-' ? 'negative' : e.key); return; }
    }
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [showingStepResult, input, isNumberMode]);

  if (finished) {
    const totalSteps = questions.reduce((s, q) => s + q.steps.length, 0);
    const pct = totalSteps > 0 ? Math.round((score / totalSteps) * 100) : 0;
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msg = pct >= 80 ? '解题小能手！🎉' : pct >= 50 ? '多练练就会了！💪' : '一步一步来，加油！😊';
    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars}</div>
        <div className="quiz-result-score">{score} / {totalSteps} 步骤</div>
        <div className="quiz-result-msg">{msg}</div>
      </div>
    );
  }

  if (!question) return <div className="quiz-empty">暂无题目</div>;

  const step = question.steps[stepIndex];
  const stepTotal = question.steps.length;

  return (
    <div className="step-game">
      {title && <h3 className="game-title">{icon} {title}</h3>}

      <div className="step-counter">
        第 {current + 1} / {questions.length} 题 · 步骤 {stepIndex + 1}/{stepTotal}
      </div>

      <div className="step-question">{question.question}</div>

      {question.hint && !showingStepResult && (
        <div className="step-hint">💡 {question.hint}</div>
      )}

      {/* 进度条 */}
      <div className="step-progress-bar">
        {Array.from({ length: stepTotal }).map((_, i) => (
          <div
            key={i}
            className={`step-progress-dot${i < stepIndex ? ' step-dot-done' : ''}${i === stepIndex ? ' step-dot-current' : ''}`}
          >
            {i < stepResults.length ? (stepResults[i] ? '✓' : '✗') : i + 1}
          </div>
        ))}
      </div>

      {/* 当前步骤 */}
      <div className={`step-prompt ${showingStepResult ? `step-prompt-${stepFeedback}` : ''}`}>
        <div className="step-prompt-label">{step.prompt}</div>
        <div className="step-answer-display">
          {input || (showingStepResult ? step.answer : '?')}
        </div>
        {showingStepResult && (
          <div className="step-feedback-text">
            {stepFeedback === 'correct' ? '✓ 答对了！' : `✗ 答案是 ${step.answer}`}
          </div>
        )}
      </div>

      {/* 数字键盘或文本输入 */}
      {!showingStepResult && (
        isNumberMode ? (
          <div className="step-numpad">
            <div className="numpad-row">
              {[1,2,3].map(n => <button key={n} className="numpad-btn" onClick={() => handleKeyPress(String(n))}>{n}</button>)}
            </div>
            <div className="numpad-row">
              {[4,5,6].map(n => <button key={n} className="numpad-btn" onClick={() => handleKeyPress(String(n))}>{n}</button>)}
            </div>
            <div className="numpad-row">
              {[7,8,9].map(n => <button key={n} className="numpad-btn" onClick={() => handleKeyPress(String(n))}>{n}</button>)}
            </div>
            <div className="numpad-row">
              <button className="numpad-btn numpad-btn-sm" onClick={() => handleKeyPress('negative')}>-</button>
              <button className="numpad-btn" onClick={() => handleKeyPress('0')}>0</button>
              <button className="numpad-btn numpad-btn-sm" onClick={() => handleKeyPress('backspace')}>⌫</button>
            </div>
            <div className="numpad-row numpad-row-double">
              <button className="numpad-btn numpad-btn-wide" onClick={() => handleKeyPress('clear')}>清除</button>
              <button className="numpad-btn numpad-btn-submit" onClick={handleSubmit} disabled={!input.trim()}>✓</button>
            </div>
          </div>
        ) : (
          <div className="step-text-input-area">
            <input
              type="text"
              className="step-text-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入答案..."
              autoFocus
            />
            <button className="step-submit-btn" onClick={handleSubmit} disabled={!input.trim()}>确定</button>
          </div>
        )
      )}
    </div>
  );
}
