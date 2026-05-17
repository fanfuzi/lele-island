import { useState, useEffect, useRef } from 'react';
import { useGame, getPetEmoji } from '../store';
import { shopItems } from '../data/shopItems';
import ProgressBar from '../components/ProgressBar';
import PetCompanion from '../components/PetCompanion';
import { logActivity } from '../utils/activityLog';

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
  const [showCustomize, setShowCustomize] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showFurniture, setShowFurniture] = useState(false);
  const [nameInput, setNameInput] = useState(pet.name);
  const [petAction, setPetAction] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const [dragPos, setDragPos] = useState({});
  const dragPosRef = useRef({});
  const sceneRef = useRef(null);

  // 家具拖动
  function handleFurnitureStart(e, f) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    e.preventDefault();
    const touch = e.touches?.[0];
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragTarget({
      id: f.id,
      startX: (touch?.clientX || e.clientX),
      startY: (touch?.clientY || e.clientY),
      initX: f.x,
      initY: f.y,
      rect,
    });
  }

  useEffect(() => {
    if (!dragTarget) return;
    function onMove(e) {
      const touch = e.touches?.[0];
      const clientX = touch?.clientX || e.clientX;
      const clientY = touch?.clientY || e.clientY;
      const dx = ((clientX - dragTarget.startX) / dragTarget.rect.width) * 100;
      const dy = ((clientY - dragTarget.startY) / dragTarget.rect.height) * 100;
      const newX = Math.max(5, Math.min(85, dragTarget.initX + dx));
      const newY = Math.max(50, Math.min(90, dragTarget.initY + dy));
      const pos = { x: newX, y: newY };
      dragPosRef.current = { [dragTarget.id]: pos };
      setDragPos(dragPosRef.current);
    }
    function onEnd() {
      if (dragTarget) {
        const pos = dragPosRef.current[dragTarget.id] || { x: dragTarget.initX, y: dragTarget.initY };
        dispatch({ type: 'MOVE_FURNITURE', payload: { id: dragTarget.id, x: pos.x, y: pos.y } });
      }
      setDragTarget(null);
      setDragPos({});
      dragPosRef.current = {};
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [dragTarget]);

  function handleFeed() {
    if (state.coins < 2) return;
    dispatch({ type: 'FEED_PET', payload: 20 });
    dispatch({ type: 'ADD_COINS', payload: -2 });
    setPetAction('eating');
    logActivity({ type: 'pet', subject: null, gameType: 'feed' });
    setTimeout(() => setPetAction(null), 2000);
  }

  function handlePlay() {
    dispatch({ type: 'PLAY_WITH_PET', payload: 15 });
    setPetAction('playing');
    logActivity({ type: 'pet', subject: null, gameType: 'play' });
    setTimeout(() => setPetAction(null), 2000);
  }

  function handleClean() {
    dispatch({ type: 'CLEAN_PET', payload: 25 });
    setPetAction('cleaning');
    logActivity({ type: 'pet', subject: null, gameType: 'clean' });
    setTimeout(() => setPetAction(null), 2000);
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
          <span style={{ marginRight: 8 }}>⭐ {state.coins}</span>
          <span>🌟 {state.stars}</span>
        </div>
      </div>

      {/* 房间展示区 */}
      <div className="pet-room-scene" ref={sceneRef}>
        <div className="pet-room-wall" />
        <div className="pet-room-floor" />

        {/* 房间家具（可拖动） */}
        {furniture.map(f => {
          const item = shopItems.find(i => i.id === f.id);
          if (!item) return null;
          const pos = getFurniturePos(f);
          return (
            <div
              key={f.id}
              className={`room-furniture ${dragTarget?.id === f.id ? 'room-furniture-dragging' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseDown={e => handleFurnitureStart(e, f)}
              onTouchStart={e => handleFurnitureStart(e, f)}
            >
              <span className="room-furniture-icon">{item.icon}</span>
            </div>
          );
        })}

        {/* 宠物 */}
        <div className="pet-room-avatar">
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
        <button className="action-btn" onClick={handleFeed} disabled={state.coins < 2}>
          🍪 喂食
        </button>
        <button className="action-btn" onClick={handlePlay}>
          🎾 玩耍
        </button>
        <button className="action-btn" onClick={handleClean} disabled={pet.cleanliness >= 95}>
          🧼 清洁
        </button>
        <button className="action-btn" onClick={() => setShowFurniture(!showFurniture)}>
          🛋️ 家具
        </button>
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
