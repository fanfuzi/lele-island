import { useState } from 'react';
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
];

export default function PetRoom({ onBack }) {
  const { state, dispatch } = useGame();
  const { pet, inventory } = state;
  const [showCustomize, setShowCustomize] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [nameInput, setNameInput] = useState(pet.name);
  const [petAction, setPetAction] = useState(null);

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
    petAction === 'playing' ? '玩得好开心！🎾' : '';

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🏠 宠物屋</h2>
        <div />
      </div>

      {/* 宠物展示 */}
      <div className="pet-showcase">
        <div className="pet-room-avatar">
          <PetCompanion
            size="large"
            mood={petAction ? 'happy' : pet.hunger < 30 ? 'hungry' : pet.happiness < 30 ? 'sad' : 'normal'}
            celebrating={!!petAction}
            statusText={actionStatus}
            interactive voiceEnabled gazeTracking
          />
        </div>

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
              {pet.name} ✏️
            </h2>
          )}
          <ProgressBar />
        </div>
      </div>

      {/* 状态条 */}
      <div className="pet-stats">
        <div className="pet-stat">
          <span className="stat-label">🍽️ 饱食度</span>
          <div className="stat-bar">
            <div className="stat-fill stat-fill-hunger" style={{ width: `${pet.hunger}%` }} />
          </div>
          <span className="stat-value">{pet.hunger}%</span>
        </div>
        <div className="pet-stat">
          <span className="stat-label">😊 心情</span>
          <div className="stat-bar">
            <div className="stat-fill stat-fill-happy" style={{ width: `${pet.happiness}%` }} />
          </div>
          <span className="stat-value">{pet.happiness}%</span>
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
        <button className="action-btn" onClick={() => setShowCustomize(!showCustomize)}>
          🎨 换装
        </button>
      </div>

      {/* 换装面板 */}
      {showCustomize && (
        <div className="customize-panel">
          <h3>选择宠物</h3>
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
