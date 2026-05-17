import { useEffect, useRef, useState } from 'react';
import PetCompanion from './PetCompanion';
import ConfettiEffect from './ConfettiEffect';

export default function RewardModal({ show, coins, stars, message, onClose, score, total, petReaction }) {
  const audioCtxRef = useRef(null);
  const [animStep, setAnimStep] = useState('start');
  const [displayCoins, setDisplayCoins] = useState(0);

  // 星星奖励计算（每题1星，上限8，与 store 中 COMPLETE_QUEST 一致）
  const starEarned = stars !== undefined ? stars : Math.min(8, total || 0);

  // 分数档次
  const pct = total > 0 ? Math.round((score / total) * 100) : 100;
  const tier = pct >= 90 ? 'perfect' : pct >= 70 ? 'great' : 'good';
  const celebrationLevel = pct >= 90 ? 50 : pct >= 70 ? 30 : 15;
  const confettiCount = pct >= 70 ? 40 : 20;

  const tierMessages = {
    perfect: { title: '🎉 完美表现！', sub: '你是最棒的！' },
    great: { title: '👏 做得真好！', sub: '继续加油哦！' },
    good: { title: '💪 不错不错！', sub: '再练练会更好！' },
  };

  const tierSound = {
    perfect: [784, 988, 1175, 1568],
    great: [659, 784, 988],
    good: [523, 659, 784],
  };

  useEffect(() => {
    if (!show) return;
    setAnimStep('start');
    setDisplayCoins(0);

    // 分步动画
    const t1 = setTimeout(() => setAnimStep('show-pet'), 200);
    const t2 = setTimeout(() => setAnimStep('show-coins'), 500);
    const t3 = setTimeout(() => setAnimStep('complete'), 800);

    // 金币数字滚动动画
    let current = 0;
    const coinInterval = setInterval(() => {
      current += Math.max(1, Math.floor(coins / 15));
      if (current >= coins) {
        current = coins;
        clearInterval(coinInterval);
      }
      setDisplayCoins(current);
    }, 50);

    playRewardSound(pct);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(coinInterval);
    };
  }, [show, coins, pct]);

  function playRewardSound(pct) {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const notes = pct >= 90 ? tierSound.perfect : pct >= 70 ? tierSound.great : tierSound.good;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    } catch (e) {}
  }

  if (!show) return null;

  const info = tierMessages[tier];

  return (
    <div className="reward-overlay" onClick={onClose}>
      <ConfettiEffect count={confettiCount} active={show} />
      <div className="reward-modal" onClick={e => e.stopPropagation()}>
        {/* 宠物庆祝区 */}
        <div className={`reward-pet ${animStep !== 'start' ? 'reward-pet-visible' : ''}`}>
          <PetCompanion size="small" celebrating mood="excited" statusText="太棒啦！🎉" />
        </div>

        {/* 标题 */}
        <h2 className="reward-title">{message || info.title}</h2>
        {score !== undefined && total > 0 && (
          <div className="reward-score-info">
            <span className="reward-score-text">{score} / {total}</span>
            <span className={`reward-tier reward-tier-${tier}`}>
              {pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟'}
            </span>
          </div>
        )}

        {/* 奖励 */}
        <div className="reward-currencies">
          <div className={`reward-currency-item ${animStep === 'show-coins' || animStep === 'complete' ? 'reward-coins-show' : ''}`}>
            <span className="coin-icon">🪙</span>
            <span className="coin-amount">+{displayCoins}</span>
            <span className="reward-currency-label">金币</span>
          </div>
          <div className={`reward-currency-item ${animStep === 'complete' ? 'reward-coins-show' : ''}`}>
            <span className="coin-icon">🌟</span>
            <span className="coin-amount">+{starEarned}</span>
            <span className="reward-currency-label">星星</span>
          </div>
        </div>

        {/* 鼓励语 */}
        <div className="reward-sub">{info.sub}</div>

        {/* 每日任务完成进度 */}
        <button className="reward-btn" onClick={onClose}>
          太棒了，继续！
        </button>
      </div>
    </div>
  );
}
