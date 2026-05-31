import { useState, useEffect, useRef } from 'react';
import { useGame, getPetEmoji, getPetMood } from '../store';
import { shopItems } from '../data/shopItems';
import PetCompanion from '../components/PetCompanion';
import { logActivity } from '../utils/activityLog';

// 宠物随机说话
const PET_SAYINGS = {
  happy: ['今天好開心呀！', '有你陪真好！', '一齊玩啦！', '你係我最好嘅朋友！', '好幸福呀～'],
  hungry: ['肚仔餓啦…', '有冇嘢食呀？', '想食嘢～', '好想食零食呀！'],
  sad: ['悶悶地…', '陪我玩吓啦', '想你陪我', '唔開心…'],
  normal: ['你好呀！', '今日學咗啲咩？', '加油呀！', '你叻仔！', '一起努力啦！'],
  sleepy: ['好眼瞓…', '想瞓覺覺', 'zzZ…'],
};

// 每日首次登录奖励
const DAILY_LOGIN_KEY = 'lele-daily-login';

const PET_TYPES = [
  { type: 'cat', emoji: '🐱', name: '小猫', color: '#FFB5C2' },
  { type: 'dog', emoji: '🐶', name: '小狗', color: '#FFDAA3' },
  { type: 'rabbit', emoji: '🐰', name: '小兔', color: '#FFB5E6' },
  { type: 'hamster', emoji: '🐹', name: '仓鼠', color: '#DDA0DD' },
  { type: 'fox', emoji: '🦊', name: '小狐', color: '#FF8C42' },
  { type: 'panda', emoji: '🐼', name: '熊猫', color: '#F5F5F5' },
];

export default function PetRoom({ onBack }) {
  const { state, dispatch } = useGame();
  const { pet, inventory, furniture } = state;
  const playMinutesAvailable = state.playMinutesAvailable || 0;

  // 未解锁时显示锁定页，直接拦截
  if (playMinutesAvailable <= 0) {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={onBack}>← 返回</button>
          <h2>🏠 宠物屋</h2><div />
        </div>
        <div className="pet-locked-screen">
          <div className="pet-locked-icon">🔒</div>
          <div className="pet-locked-title">宠物屋已上锁</div>
          <div className="pet-locked-desc">
            完成 <b>{state.studySessionMinutes || 25}</b> 分钟学习后，即可进入宠物屋和宠物玩耍！
          </div>
          <div className="pet-locked-studied">
            今日已学习 <b>{state.dailyStudyMinutes || 0}</b> 分钟
          </div>
          <button className="btn btn-primary" onClick={onBack}>📚 去学习</button>
        </div>
      </div>
    );
  }

  // 每日激活次数限制（最多3次）
  const MAX_DAILY_ACTIVATIONS = 3;
  const petActivationsToday = state.petActivationsToday || 0;

  // 进入时自动计数
  useEffect(() => {
    if (petActivationsToday < MAX_DAILY_ACTIVATIONS) {
      dispatch({ type: 'INCREMENT_PET_ACTIVATIONS' });
    }
  }, []);

  if (petActivationsToday >= MAX_DAILY_ACTIVATIONS) {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={onBack}>← 返回</button>
          <h2>🏠 宠物屋</h2><div />
        </div>
        <div className="pet-locked-screen">
          <div className="pet-locked-icon">⏰</div>
          <div className="pet-locked-title">今日次数已用完</div>
          <div className="pet-locked-desc">
            每天最多可以进入宠物屋 <b>{MAX_DAILY_ACTIVATIONS}</b> 次，明天再来吧！
          </div>
          <div className="pet-locked-studied">
            今日已进入 <b>{petActivationsToday}/{MAX_DAILY_ACTIVATIONS}</b> 次
          </div>
          <button className="btn btn-primary" onClick={onBack}>📚 去学习</button>
        </div>
      </div>
    );
  }
  const [showCustomize, setShowCustomize] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showFurniture, setShowFurniture] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [nameInput, setNameInput] = useState(pet.name);
  const [petAction, setPetAction] = useState(null);
  const [dragPos, setDragPos] = useState({});
  const [petSpeech, setPetSpeech] = useState('');
  const [dailyGift, setDailyGift] = useState(null);
  const dragRef = useRef(null);
  const playTimerRef = useRef(null);

  // 学习-玩耍循环机制
  const studyMinutes = state.dailyStudyMinutes || 0;
  const sessionLen = state.studySessionMinutes || 25;
  const playLen = state.playSessionMinutes || 10;
  const canPlay = playMinutesAvailable > 0;
  // 今天是否学过（学1分钟就算，解锁互动和商店）
  const hasStudied = studyMinutes > 0;
  // 距离下一轮解锁还需学习多少分钟
  const studySinceLastUnlock = studyMinutes % sessionLen;
  const minutesToNextUnlock = sessionLen - studySinceLastUnlock;
  const petMood = getPetMood(state);

  // 每日首次登录奖励
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem(DAILY_LOGIN_KEY);
    if (lastLogin !== today) {
      localStorage.setItem(DAILY_LOGIN_KEY, today);
      const bonus = Math.floor(Math.random() * 3) + 1; // 1-3 coins
      dispatch({ type: 'ADD_COINS', payload: bonus });
      setDailyGift(bonus);
      setTimeout(() => setDailyGift(null), 4000);
    }
  }, []);

  // 宠物随机说话
  useEffect(() => {
    const sayings = PET_SAYINGS[petMood] || PET_SAYINGS.normal;
    const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
    setPetSpeech(randomSaying);
    const timer = setTimeout(() => setPetSpeech(''), 6000);
    return () => clearTimeout(timer);
  }, [petMood]);
  const sceneRef = useRef(null);

  // 家具拖动（全部用 ref 避免闭包过期问题）
  function handleFurnitureStart(e, f) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    e.preventDefault();
    const touch = e.touches?.[0];
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = touch?.clientX || e.clientX;
    const clientY = touch?.clientY || e.clientY;
    const pos = { x: f.x, y: f.y };
    dragRef.current = {
      id: f.id, startX: clientX, startY: clientY,
      initX: f.x, initY: f.y, rect,
      pos, // 实时位置，onEnd 从这里读取
    };
    // 直接绑定 window 事件，避免 useEffect 延迟
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      const t = e.touches?.[0];
      const cx = t?.clientX || e.clientX;
      const cy = t?.clientY || e.clientY;
      const dx = ((cx - d.startX) / d.rect.width) * 100;
      const dy = ((cy - d.startY) / d.rect.height) * 100;
      const x = Math.max(5, Math.min(85, d.initX + dx));
      const y = Math.max(50, Math.min(90, d.initY + dy));
      d.pos = { x, y };
      setDragPos({ [d.id]: { x, y } });
    };
    const onEnd = () => {
      const d = dragRef.current;
      if (d) {
        dispatch({ type: 'MOVE_FURNITURE', payload: { id: d.id, x: d.pos.x, y: d.pos.y } });
      }
      dragRef.current = null;
      setDragPos({});
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  }

  // 从背包使用食物喂宠物
  function useFoodItem(item) {
    if (!item) return;
    // 食物越贵效果越好
    const hungerGain = Math.min(30, Math.round(item.price * 1.5));
    dispatch({ type: 'FEED_PET', payload: hungerGain });
    // 从背包移除已使用的食物
    dispatch({ type: 'REMOVE_INVENTORY_ITEM', payload: item.id });
    setPetAction('eating');
    setPetSpeech('好好食！😋');
    logActivity({ type: 'pet', subject: null, gameType: 'feed' });
    setTimeout(() => setPetAction(null), 2000);
  }

  function handleFeed() {
    if (state.coins < 2) return;
    dispatch({ type: 'FEED_PET', payload: 20 });
    dispatch({ type: 'ADD_COINS', payload: -2 });
    setPetAction('eating');
    setPetSpeech('好好食！😋');
    logActivity({ type: 'pet', subject: null, gameType: 'feed' });
    setTimeout(() => setPetAction(null), 2000);
  }

  // 背包中的食物
  const ownedFood = shopItems.filter(i => i.type === 'food' && inventory.includes(i.id));

  // 多种玩耍方式
  const playActivities = [
    { name: '抛波波', icon: '⚽', msg: '接住啦！', happiness: 12 },
    { name: '捉迷藏', icon: '🙈', msg: '搵到你啦！', happiness: 15 },
    { name: '搔痒痒', icon: '🤭', msg: '哈哈哈！好癢！', happiness: 10 },
    { name: '跳舞', icon: '💃', msg: '一齊跳啦！', happiness: 14 },
  ];

  function handlePlay(activity) {
    if (!canPlay) return;
    const act = activity || playActivities[Math.floor(Math.random() * playActivities.length)];
    dispatch({ type: 'PLAY_WITH_PET', payload: act.happiness });
    dispatch({ type: 'USE_PET_PLAY_TIME', payload: 1 });
    setPetAction('playing');
    setPetSpeech(act.msg);
    logActivity({ type: 'pet', subject: null, gameType: 'play' });
    setTimeout(() => setPetAction(null), 2000);
  }

  function handleClean() {
    dispatch({ type: 'CLEAN_PET', payload: 25 });
    setPetAction('cleaning');
    setPetSpeech('好舒服呀～🧼');
    logActivity({ type: 'pet', subject: null, gameType: 'clean' });
    setTimeout(() => setPetAction(null), 2000);
  }

  function handleTap() {
    if (!hasStudied) {
      setPetSpeech('先学习才能跟我玩哦！📚');
      setTimeout(() => setPetSpeech(''), 2500);
      return;
    }
    // 点击宠物获得小互动
    const tapSayings = ['嘿嘿！', '做咩呀？', '嘻嘻～', '你叫我呀？', '摸摸我啦！'];
    setPetSpeech(tapSayings[Math.floor(Math.random() * tapSayings.length)]);
    dispatch({ type: 'PLAY_WITH_PET', payload: 2 });
    setTimeout(() => setPetSpeech(''), 3000);
  }

  function handlePetChange(newType) {
    dispatch({ type: 'CHOOSE_PET', payload: { type: newType.type, color: newType.color } });
    setShowCustomize(false);
  }

  function handleNameSave() {
    if (nameInput.trim()) {
      dispatch({ type: 'SET_PET_NAME', payload: nameInput.trim() });
    }
    setShowNameEdit(false);
  }

  const actionStatus = petAction === 'eating' ? '正在吃东西…好吃！😋' :
    petAction === 'playing' ? '玩得好开心！🎾' :
    petAction === 'cleaning' ? '洗香香～🧼' : '';

  // 已购买的家具列表
  const ownedFurniture = shopItems.filter(i => i.type === 'furniture' && inventory.includes(i.id));

  // 获取家具显示位置（拖动中优先取 dragPos）
  function getFurniturePos(f) {
    return dragPos[f.id] || { x: f.x, y: f.y };
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🏠 宠物屋</h2>
        <div className="header-coins">
          <span style={{ marginRight: 8 }}>🪙 {state.coins}</span>
          <span>🌟 {state.stars}</span>
        </div>
      </div>

      {/* 房间展示区 */}
      <div className="pet-room-scene" ref={sceneRef}>
        <div className="pet-room-wall" />
        <div className="pet-room-floor" />

        {/* 每日登录奖励 */}
        {dailyGift && (
          <div className="daily-gift-popup">
            🎁 每日奖励 +{dailyGift} 🪙
          </div>
        )}

        {/* 房间家具（可拖动） */}
        {furniture.map(f => {
          const item = shopItems.find(i => i.id === f.id);
          if (!item) return null;
          const pos = getFurniturePos(f);
          return (
            <div
              key={f.id}
              className={`room-furniture ${dragRef.current?.id === f.id ? 'room-furniture-dragging' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseDown={e => handleFurnitureStart(e, f)}
              onTouchStart={e => handleFurnitureStart(e, f)}
            >
              <span className="room-furniture-icon">{item.icon}</span>
            </div>
          );
        })}

        {/* 宠物 */}
        <div className="pet-room-avatar" onClick={handleTap}>
          {/* 说话气泡 */}
          {petSpeech && (
            <div className="pet-speech-bubble">{petSpeech}</div>
          )}
          <PetCompanion
            size="large"
            mood={petAction ? 'happy' : pet.hunger < 30 ? 'hungry' : pet.happiness < 30 ? 'sad' : 'normal'}
            celebrating={!!petAction}
            statusText={actionStatus}
            interactive voiceEnabled gazeTracking
          />
        </div>
      </div>

      {/* 宠物名字 + 等级 */}
      <div className="pet-details">
        {showNameEdit ? (
          <div className="name-edit">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="name-input"
              maxLength={10}
            />
            <button className="btn btn-primary btn-small" onClick={handleNameSave}>保存</button>
          </div>
        ) : (
          <h2 className="pet-name-display" onClick={() => setShowNameEdit(true)}>
            {getPetEmoji(pet.type)} {pet.name} ✏️
          </h2>
        )}
        <span className="pet-level-badge">Lv.{pet.level}</span>
      </div>

      {/* 属性条 */}
      <div className="pet-stats-grid">
        <div className="pet-stat-row">
          <span className="stat-label">🍽️ 饱食</span>
          <div className="stat-bar-sm"><div className="stat-fill fill-pink" style={{ width: `${pet.hunger}%` }} /></div>
          <span className="stat-value">{pet.hunger}</span>
        </div>
        <div className="pet-stat-row">
          <span className="stat-label">😊 心情</span>
          <div className="stat-bar-sm"><div className="stat-fill fill-orange" style={{ width: `${pet.happiness}%` }} /></div>
          <span className="stat-value">{pet.happiness}</span>
        </div>
        <div className="pet-stat-row">
          <span className="stat-label">⚡ 活力</span>
          <div className="stat-bar-sm"><div className="stat-fill fill-yellow" style={{ width: `${pet.energy || 80}%` }} /></div>
          <span className="stat-value">{pet.energy || 80}</span>
        </div>
        <div className="pet-stat-row">
          <span className="stat-label">❤️ 健康</span>
          <div className="stat-bar-sm"><div className="stat-fill fill-green" style={{ width: `${pet.health || 80}%` }} /></div>
          <span className="stat-value">{pet.health || 80}</span>
        </div>
        <div className="pet-stat-row">
          <span className="stat-label">🧼 清洁</span>
          <div className="stat-bar-sm"><div className="stat-fill fill-blue" style={{ width: `${pet.cleanliness || 80}%` }} /></div>
          <span className="stat-value">{pet.cleanliness || 80}</span>
        </div>
      </div>

      {/* 互动按钮 */}
      <div className="pet-actions">
        <button className="action-btn" onClick={handleFeed}
          disabled={!hasStudied || state.coins < 2}
          title={!hasStudied ? '先学习才能喂食哦！' : state.coins < 2 ? '金币不够' : ''}>
          <span className="action-icon">🍪</span>
          <span className="action-label">{!hasStudied ? '🔒' : ''} 喂食</span>
          <span className="action-cost">2🪙</span>
        </button>
        <button className="action-btn" onClick={handleClean}
          disabled={!hasStudied || pet.cleanliness >= 95}
          title={!hasStudied ? '先学习才能清洁哦！' : ''}>
          <span className="action-icon">🧼</span>
          <span className="action-label">{!hasStudied ? '🔒' : ''} 清洁</span>
        </button>
        <button className="action-btn" onClick={() => setShowFurniture(!showFurniture)}>
          <span className="action-icon">🛋️</span>
          <span className="action-label">家具</span>
        </button>
        {ownedFood.length > 0 && (
          <button className={`action-btn ${showFood ? 'active' : ''}`} onClick={() => setShowFood(!showFood)}>
            <span className="action-icon">🎒</span>
            <span className="action-label">食物包</span>
            <span className="action-cost">{ownedFood.length}</span>
          </button>
        )}
      </div>

      {/* 食物背包面板 */}
      {showFood && ownedFood.length > 0 && (
        <div className="pet-food-panel">
          <h3 className="pet-food-title">🎒 背包中的食物（点击使用）</h3>
          <div className="pet-food-grid">
            {ownedFood.map(item => (
              <button key={item.id} className="pet-food-item" onClick={() => useFoodItem(item)}>
                <span className="pet-food-icon">{item.icon}</span>
                <span className="pet-food-name">{item.name}</span>
                <span className="pet-food-effect">+{Math.min(30, Math.round(item.price * 1.5))}</span>
              </button>
            ))}
          </div>
          <p className="pet-food-hint">食物价格越高，饱食度增加越多。也可直接花2金币喂食</p>
        </div>
      )}

      {/* 未学习提示条 */}
      {!hasStudied && (
        <div className="hint-bar hint-bar-warn" style={{ margin: '0 16px 10px', textAlign: 'center' }}>
          🔒 先学习才能和{pet.name}互动哦！
        </div>
      )}

      {/* 玩耍活动 */}
      <div className="pet-play-section">
        <h3 className="play-section-title">
          {canPlay ? `🎾 和${pet.name}一起玩（还剩${playMinutesAvailable}分钟）` : `🔒 学习${minutesToNextUnlock}分钟后解锁`}
        </h3>
        <div className="play-activities">
          {playActivities.map((act, i) => (
            <button
              key={i}
              className="play-activity-btn"
              onClick={() => handlePlay(act)}
              disabled={!canPlay}
            >
              <span className="play-activity-icon">{act.icon}</span>
              <span className="play-activity-name">{act.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 循环机制提示 */}
      <div className="pet-parent-hint">
        {canPlay ? (
          <div className="hint-bar hint-bar-ok">
            ✅ 本轮可玩 <b>{playMinutesAvailable}</b> 分钟 · 再学 {minutesToNextUnlock} 分钟解锁下一轮
          </div>
        ) : (
          <div className="hint-bar hint-bar-warn">
            📚 今日已学习 {studyMinutes} 分钟 · 再学 <b>{minutesToNextUnlock}</b> 分钟解锁 {playLen} 分钟玩耍
          </div>
        )}
        <div className="hint-bar hint-cycle">
          ⚡ 循环模式：学 {sessionLen} 分钟 → 玩 {playLen} 分钟 → 学 {sessionLen} 分钟 → 玩 {playLen} 分钟...
        </div>
      </div>

      {/* 家具摆放面板 */}
      {showFurniture && (
        <div className="furniture-panel">
          <h3>🛋️ 摆放家具（最多6件）</h3>
          <div className="furniture-grid">
            {ownedFurniture.length === 0 ? (
              <p className="empty-hint">还没有家具，去商店买一些吧！</p>
            ) : (
              ownedFurniture.map(item => {
                const isPlaced = furniture.some(f => f.id === item.id);
                return (
                  <button
                    key={item.id}
                    className={`furniture-btn ${isPlaced ? 'placed' : ''}`}
                    onClick={() => dispatch({ type: 'PLACE_FURNITURE', payload: item.id })}
                  >
                    <span className="furniture-btn-icon">{item.icon}</span>
                    <span className="furniture-btn-name">{item.name}</span>
                    <span className="furniture-btn-status">{isPlaced ? '已摆放' : '点击摆放'}</span>
                  </button>
                );
              })
            )}
            {furniture.length >= 6 && <p className="empty-hint">房间摆满了！（最多6件）</p>}
          </div>
        </div>
      )}

      {/* 换装面板 */}
      <div className="customize-toggle">
        <button className={`action-btn action-btn-wide ${showCustomize ? 'active' : ''}`} onClick={() => setShowCustomize(!showCustomize)}>
          🎨 换装
        </button>
      </div>
      {showCustomize && (
        <div className="customize-panel">
          <h3>选择宠物种类</h3>
          <div className="pet-type-grid">
            {PET_TYPES.map(p => (
              <button
                key={p.type}
                className={`pet-type-btn ${pet.type === p.type ? 'active' : ''}`}
                onClick={() => handlePetChange(p)}
              >
                <span className="pet-type-emoji">{p.emoji}</span>
                <span className="pet-type-name">{p.name}</span>
              </button>
            ))}
          </div>
          {/* 自定义颜色 */}
          <div className="color-picker-section">
            <h3>🎨 自定义颜色</h3>
            <div className="color-picker-row">
              <input
                type="color"
                value={pet.color}
                onChange={e => dispatch({ type: 'SET_PET_COLOR', payload: e.target.value })}
                className="color-picker-input"
              />
              <span className="color-picker-value">{pet.color}</span>
            </div>
          </div>
        </div>
      )}

      {/* 穿着展示 */}
      {pet.accessories.length > 0 && (
        <div className="wearing-section">
          <h3>🎀 当前穿着</h3>
          <div className="wearing-list">
            {pet.accessories.map(accId => {
              const item = shopItems.find(i => i.id === accId);
              return (
                <div key={accId} className="wearing-item">
                  <span className="wearing-icon">{item?.icon || '🎀'}</span>
                  <span className="wearing-name">{item?.name || `道具 #${accId}`}</span>
                  <button
                    className="btn-remove"
                    onClick={() => dispatch({ type: 'WEAR_ACCESSORY', payload: accId })}
                  >脱下</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
