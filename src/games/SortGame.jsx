import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

export default function SortGame({ questions, onComplete, onAnswer, title, icon = '📂' }) {
  const [current, setCurrent] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [placement, setPlacement] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  // 同步计算已打乱的ID顺序，不依赖 useEffect
  const itemOrder = useMemo(() => {
    if (!question?.items) return [];
    const shuffled = [...question.items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.map(i => i.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, question?.id]);

  // 只保留当前题目有效的 placement 项
  const validPlacement = useMemo(() => {
    if (!question?.items) return {};
    const validItemIds = new Set(question.items.map(i => i.id));
    const result = {};
    for (const [itemId, catId] of Object.entries(placement)) {
      if (validItemIds.has(itemId)) result[itemId] = catId;
    }
    return result;
  }, [placement, question]);

  // 切题时自动清理无效 placement
  useEffect(() => {
    // 把无效的项过滤掉（不依赖 setState 顺序）
    const validItemIds = new Set(question?.items?.map(i => i.id) || []);
    const hasInvalid = Object.keys(placement).some(id => !validItemIds.has(id));
    if (hasInvalid) {
      const clean = {};
      for (const [id, cat] of Object.entries(placement)) {
        if (validItemIds.has(id)) clean[id] = cat;
      }
      setPlacement(clean);
    }
    setSelectedItem(null);
    setFeedback(null);
  }, [current, question]);

  const unplaced = itemOrder.filter(id => !validPlacement[id]);
  const allPlaced = unplaced.length === 0;

  const placedByCategory = useMemo(() => {
    if (!question) return {};
    const result = {};
    for (const cat of question.categories || []) {
      result[cat.id] = [];
    }
    for (const [itemId, catId] of Object.entries(validPlacement)) {
      if (result[catId]) {
        const foundItem = question.items?.find(i => i.id === itemId);
        if (foundItem) result[catId].push(foundItem);
      }
    }
    return result;
  }, [validPlacement, question]);

  function playSound(correct) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      if (correct) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  }

  function handleSelectItem(itemId) {
    if (feedback) return;
    setSelectedItem(itemId === selectedItem ? null : itemId);
  }

  function handleDrop(categoryId) {
    if (feedback || !selectedItem) return;
    setPlacement(prev => ({ ...prev, [selectedItem]: categoryId }));
    setSelectedItem(null);
  }

  function handleRemove(itemId) {
    if (feedback) return;
    setPlacement(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }

  function checkAll() {
    const isCorrect = question.items.every(item => validPlacement[item.id] === item.category);
    const newScore = score + (isCorrect ? 1 : 0);
    if (isCorrect) setScore(newScore);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    onAnswer?.(isCorrect, question);
    playSound(isCorrect);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
      } else {
        setFinished(true);
        onComplete?.(newScore, questions.length);
      }
    }, 1200);
  }

  if (finished) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msg = pct >= 80 ? '分类小专家！🎉' : pct >= 50 ? '继续加油分类！💪' : '多试几次就会了😊';
    return (<div className="quiz-result"><div className="quiz-result-stars">{stars}</div>
      <div className="quiz-result-score">{score} / {questions.length}</div>
      <div className="quiz-result-msg">{msg}</div></div>);
  }

  if (!question) return <div className="quiz-empty">暂无题目</div>;

  return (<div className="sort-game">
    {title && <h3 className="game-title">{icon} {title}</h3>}
    <div className="sort-counter">第 {current + 1} / {questions.length} 题</div>
    <div className="sort-question">{question.question}</div>
    {question.hint && <div className="sort-hint">💡 {question.hint}</div>}

    <div className="sort-unplaced-area">
      <div className="sort-unplaced-label">待分类</div>
      <div className="sort-unplaced-list">{unplaced.length === 0
        ? <span className="sort-placeholder">已全部分完 ✓</span>
        : unplaced.map(id => {
            const item = question.items.find(i => i.id === id);
            if (!item) return null;
            return (<button key={id} className={`sort-item${selectedItem === id ? ' sort-item-selected' : ''}`}
              onClick={() => handleSelectItem(id)}>{item.label}</button>);
          })
      }</div>
    </div>

    {selectedItem && !feedback && <div className="sort-prompt">放到哪个分类？</div>}

    <div className="sort-categories">{question.categories?.map(cat => {
      const items = placedByCategory[cat.id] || [];
      return (<div key={cat.id} className={`sort-category${selectedItem ? ' sort-category-drop' : ''}`}
        onClick={() => handleDrop(cat.id)}>
        <div className="sort-category-header">{cat.label}</div>
        <div className="sort-category-items">{items.length === 0
          ? <span className="sort-category-empty">点击此处</span>
          : items.map(item => (<div key={item.id} className="sort-category-item"
              onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}>
              {item.label}{!feedback && <span className="sort-item-remove">✕</span>}
            </div>))
        }</div>
      </div>);
    })}</div>

    {feedback && <div className={`sort-feedback sort-feedback-${feedback}`}>
      {feedback === 'correct'
        ? <span>✓ 全部分类正确！</span>
        : <div className="sort-wrong-detail"><p>✗ 正确答案：</p>
          {question.categories?.map(cat => (<div key={cat.id} className="sort-wrong-cat">
            <strong>{cat.label}：</strong>
            {question.items.filter(i => i.category === cat.id).map(i => i.label).join('、')}
          </div>))}</div>
      }</div>}

    {allPlaced && !feedback && <div className="sort-submit-area">
      <button className="sort-submit-btn" onClick={checkAll}>确认分类 ✓</button>
    </div>}
  </div>);
}
