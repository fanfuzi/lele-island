import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * 分类题游戏组件
 * Props:
 *   questions: [{id, question, categories, items, hint?}]
 *     categories: [{id, label}]
 *     items: [{id, label, category}] — category 指向正确的分类
 *   onComplete: (score, total) => void
 *   onAnswer: (correct, question) => void
 *   title: string
 *   icon: string
 */
export default function SortGame({ questions, onComplete, onAnswer, title, icon = '📂' }) {
  const [current, setCurrent] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [placement, setPlacement] = useState({}); // { itemId: categoryId }
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];
  const itemOrder = useRef([]);

  // 初始化/切换题目
  useEffect(() => {
    if (!question) return;
    const shuffled = [...question.items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    itemOrder.current = shuffled.map(i => i.id);
    setPlacement({});
    setSelectedItem(null);
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
    const isCorrect = question.items.every(item => placement[item.id] === item.category);
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

  const unplaced = itemOrder.current.filter(id => !placement[id]);
  const allPlaced = unplaced.length === 0;

  // 按分类整理已放置的项
  const placedByCategory = useMemo(() => {
    if (!question) return {};
    const result = {};
    for (const cat of question.categories) {
      result[cat.id] = [];
    }
    for (const [itemId, catId] of Object.entries(placement)) {
      if (result[catId]) {
        const foundItem = question.items.find(i => i.id === itemId);
        if (foundItem) result[catId].push(foundItem);
      }
    }
    return result;
  }, [placement, question]);

  if (finished) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msg = pct >= 80 ? '分类小专家！🎉' : pct >= 50 ? '继续加油分类！💪' : '多试几次就会了😊';
    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars}</div>
        <div className="quiz-result-score">{score} / {questions.length}</div>
        <div className="quiz-result-msg">{msg}</div>
      </div>
    );
  }

  if (!question) return <div className="quiz-empty">暂无题目</div>;
  if (!question.categories || !question.items) return <div className="quiz-empty">题目数据格式错误</div>;

  return (
    <div className="sort-game">
      {title && <h3 className="game-title">{icon} {title}</h3>}

      <div className="sort-counter">
        第 {current + 1} / {questions.length} 题
      </div>

      <div className="sort-question">{question.question}</div>

      {question.hint && (
        <div className="sort-hint">💡 {question.hint}</div>
      )}

      {/* 未分类区 */}
      <div className="sort-unplaced-area">
        <div className="sort-unplaced-label">待分类</div>
        <div className="sort-unplaced-list">
          {unplaced.length === 0 ? (
            <span className="sort-placeholder">已全部分完 ✓</span>
          ) : (
            unplaced.map(id => {
              const item = question.items.find(i => i.id === id);
              return (
                <button
                  key={id}
                  className={`sort-item${selectedItem === id ? ' sort-item-selected' : ''}`}
                  onClick={() => handleSelectItem(id)}
                >
                  {item?.label}
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedItem && !feedback && (
        <div className="sort-prompt">放到哪个分类？</div>
      )}

      {/* 分类区 */}
      <div className="sort-categories">
        {question.categories.map(cat => {
          const items = placedByCategory[cat.id] || [];
          return (
            <div
              key={cat.id}
              className={`sort-category${selectedItem ? ' sort-category-drop' : ''}`}
              onClick={() => handleDrop(cat.id)}
            >
              <div className="sort-category-header">{cat.label}</div>
              <div className="sort-category-items">
                {items.length === 0 && (
                  <span className="sort-category-empty">点击此处</span>
                )}
                {items.map(item => (
                  <div
                    key={item.id}
                    className="sort-category-item"
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                  >
                    {item.label}
                    {!feedback && <span className="sort-item-remove">✕</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 反馈 */}
      {feedback && (
        <div className={`sort-feedback sort-feedback-${feedback}`}>
          {feedback === 'correct' ? (
            <span>✓ 全部分类正确！</span>
          ) : (
            <div className="sort-wrong-detail">
              <p>✗ 正确答案：</p>
              {question.categories.map(cat => (
                <div key={cat.id} className="sort-wrong-cat">
                  <strong>{cat.label}：</strong>
                  {question.items.filter(i => i.category === cat.id).map(i => i.label).join('、')}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {allPlaced && !feedback && (
        <div className="sort-submit-area">
          <button className="sort-submit-btn" onClick={checkAll}>
            确认分类 ✓
          </button>
        </div>
      )}
    </div>
  );
}
