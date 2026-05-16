import { useState, useCallback } from 'react';

/**
 * 配对游戏组件 - 支持简繁配对、词语配对等
 * Props:
 *   pairs: [{id, left, right, leftLabel?, rightLabel?}]
 *   onComplete: (score, total) => void
 *   title: string
 *   leftLabel: string (默认 "简体")
 *   rightLabel: string (默认 "繁体")
 */
export default function MatchGame({ pairs, onComplete, title, leftLabel = 'A', rightLabel = 'B', onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [shuffledLeft, setShuffledLeft] = useState(
    () => [...pairs].sort(() => Math.random() - 0.5)
  );
  const [shuffledRight, setShuffledRight] = useState(
    () => [...pairs].sort(() => Math.random() - 0.5)
  );
  const [wrongPair, setWrongPair] = useState(null);

  const handleSelect = useCallback((side, id, value) => {
    if (matched.includes(id)) return;

    if (selected === null) {
      setSelected({ side, id, value });
    } else if (selected.side === side) {
      setSelected({ side, id, value });
    } else {
      // 配对
      if ((side === 'left' && selected.id === id) ||
          (side === 'right' && selected.id === id)) {
        // 正确
        setMatched([...matched, id]);
        setSelected(null);
        setWrongPair(null);
        const correctPair = pairs.find(p => p.id === id);
        onAnswer?.(true, correctPair);

        // 检查是否全部完成
        if (matched.length + 1 === pairs.length) {
          setTimeout(() => onComplete?.(pairs.length, pairs.length), 500);
        }
      } else {
        // 错误
        setWrongPair([selected.id, id]);
        setTimeout(() => setWrongPair(null), 600);
        setSelected(null);
        const wrongPairData = pairs.find(p => p.id === selected.id);
        onAnswer?.(false, wrongPairData);
      }
    }
  }, [selected, matched, pairs, onComplete]);

  const isSelected = (side, id) => selected?.side === side && selected?.id === id;
  const isMatched = (id) => matched.includes(id);
  const isWrong = (id) => wrongPair?.includes(id);

  return (
    <div className="match-game">
      {title && <h3 className="game-title">{title}</h3>}

      <div className="match-columns">
        <div className="match-column">
          <div className="match-column-label">{leftLabel}</div>
          {shuffledLeft.map(p => (
            <button
              key={`l-${p.id}`}
              className={`match-card ${isSelected('left', p.id) ? 'selected' : ''} ${isMatched(p.id) ? 'matched' : ''} ${isWrong(p.id) ? 'wrong' : ''}`}
              onClick={() => handleSelect('left', p.id, p.left)}
              disabled={isMatched(p.id)}
            >
              <span className="match-text">{p.left}</span>
              {p.leftLabel && <span className="match-sub">{p.leftLabel}</span>}
            </button>
          ))}
        </div>

        <div className="match-divider">↔</div>

        <div className="match-column">
          <div className="match-column-label">{rightLabel}</div>
          {shuffledRight.map(p => (
            <button
              key={`r-${p.id}`}
              className={`match-card ${isSelected('right', p.id) ? 'selected' : ''} ${isMatched(p.id) ? 'matched' : ''} ${isWrong(p.id) ? 'wrong' : ''}`}
              onClick={() => handleSelect('right', p.id, p.right)}
              disabled={isMatched(p.id)}
            >
              <span className="match-text">{p.right}</span>
              {p.rightLabel && <span className="match-sub">{p.rightLabel}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="match-progress">
        {matched.length} / {pairs.length} 完成
      </div>
    </div>
  );
}
