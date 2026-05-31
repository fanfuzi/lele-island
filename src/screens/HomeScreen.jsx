import { useEffect, useState } from 'react';
import { useGame, getPetEmoji, getPetMood } from '../store';
import PetCompanion from '../components/PetCompanion';
import { logActivity } from '../utils/activityLog';
import { speakPet } from '../utils/speech';

// 5个学科区域（岛屿地图）
const ISLAND_ZONES = [
  { key: 'chinese', label: '中文', icon: '✍️', color: '#A8D8EA', gradient: 'linear-gradient(135deg, #A8D8EA, #87CEEB)', motto: '探索文字世界' },
  { key: 'math', label: '数学', icon: '🔢', color: '#AAE1C6', gradient: 'linear-gradient(135deg, #AAE1C6, #90EE90)', motto: '数字大冒险' },
  { key: 'english', label: '英文', icon: '🔤', color: '#FFB5C2', gradient: 'linear-gradient(135deg, #FFB5C2, #FF9EAA)', motto: '英语小达人' },
  { key: 'cantonese', label: '粤语', icon: '🗣️', color: '#FFDAA3', gradient: 'linear-gradient(135deg, #FFDAA3, #FFD700)', motto: '讲好广东话' },
  { key: 'gs', label: '常识', icon: '🌍', color: '#C9B1FF', gradient: 'linear-gradient(135deg, #C9B1FF, #DDA0DD)', motto: '认识大世界' },
];

export default function HomeScreen({ onNavigate }) {
  const { state } = useGame();
  const { pet, dailyProgress, streak } = state;
  const today = new Date().toDateString();
  const petMood = getPetMood(state);

  // 学习/玩耍循环状态
  const studyMin = state.dailyStudyMinutes || 0;
  const playAvailable = state.playMinutesAvailable || 0;
  const sessionLen = state.studySessionMinutes || 25;
  const canPetPlay = state.isTestAccount || playAvailable > 0;
  const studySinceLastUnlock = studyMin % sessionLen;
  const studyProgress = (studySinceLastUnlock / sessionLen) * 100;
  const minutesToNextUnlock = sessionLen - studySinceLastUnlock;
  const completedCycles = Math.floor(studyMin / sessionLen);

  // 今日完成统计
  const todayDone = ISLAND_ZONES.filter(z => dailyProgress.date === today && dailyProgress[z.key]?.done).length;
  const totalZones = ISLAND_ZONES.length;

  // 欢迎语音
  useEffect(() => {
    const greeted = sessionStorage.getItem('lele-greeted');
    if (!greeted) {
      speakPet('welcome');
      sessionStorage.setItem('lele-greeted', 'true');
    }
  }, []);

  // 饿了语音
  useEffect(() => {
    if (petMood === 'hungry') {
      const t = setTimeout(() => speakPet('hungry'), 3000);
      return () => clearTimeout(t);
    }
  }, [petMood]);

  // 激励语句
  function getMotivationText() {
    if (todayDone === totalZones) return '🎉 太厉害了！今日全部完成！';
    if (todayDone > 0) return `💪 已完成 ${todayDone}/${totalZones} 科，继续加油！`;
    if (streak > 0) return `🔥 连续打卡 ${streak} 天，开始今日学习吧！`;
    return '🌟 新的一天，开始你的小岛冒险！';
  }

  return (
    <div className="screen home-screen-v2">
      {/* ═══════════ 顶部：宠物 + 每日激励 ═══════════ */}
      <div className="home-hero">
        <div className="home-hero-pet">
          <PetCompanion size="small" mood={petMood} interactive idleDetection gazeTracking />
        </div>
        <div className="home-hero-info">
          <div className="hero-greeting">
            {getPetEmoji(pet.type)} {pet.name} <span className="hero-level">Lv.{pet.level}</span>
          </div>
          <div className="hero-motivation">{getMotivationText()}</div>
          {streak > 0 && <span className="hero-streak">🔥 连续{streak}天</span>}
        </div>
      </div>

      {/* ═══════════ 学习进度条（学25分→玩10分 循环）═════════ */}
      <div className="home-progress-section">
        <div className="progress-cycle">
          <div className="progress-step progress-step-study">
            <span className="step-icon">📚</span>
            <span className="step-label">学习</span>
            <span className="step-value">{studyMin}分</span>
          </div>
          <div className="progress-arrow">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${studyProgress}%` }} />
            </div>
            <span className="progress-arrow-text">
              {canPetPlay ? '✅' : `${studySinceLastUnlock}/${sessionLen}分`}
            </span>
          </div>
          <div className={`progress-step progress-step-play ${canPetPlay ? 'unlocked' : 'locked'}`}>
            <span className="step-icon">{canPetPlay ? '🎾' : '🔒'}</span>
            <span className="step-label">玩耍</span>
            <span className="step-value">{playAvailable}分</span>
          </div>
        </div>
        {canPetPlay ? (
          <div className="progress-hint progress-hint-ok">
            🎉 学习达标！🐾 宠物屋 + 🛒 商店已开放（还剩 <b>{playAvailable}</b> 分钟）
          </div>
        ) : (
          <div className="progress-hint">
            🔒 再学 <b>{minutesToNextUnlock}</b> 分钟，解锁宠物屋和商店！{completedCycles > 0 ? `（今日已完成${completedCycles}轮）` : ''}
          </div>
        )}
      </div>

      {/* ═══════════ 小岛地图：5个学科 ═══════════ */}
      <div className="home-island-map">
        <div className="island-title">🏝️ 今日小岛探险</div>
        <div className="island-grid">
          {ISLAND_ZONES.map(zone => {
            const isDone = dailyProgress.date === today && dailyProgress[zone.key]?.done;
            const score = dailyProgress[zone.key]?.score || 0;
            return (
              <button
                key={zone.key}
                className={`island-zone ${isDone ? 'zone-done' : ''}`}
                style={{ '--zone-gradient': zone.gradient, '--zone-color': zone.color }}
                onClick={() => {
                  logActivity({ type: 'visit', subject: zone.key });
                  onNavigate(zone.key);
                }}
              >
                <div className="zone-icon-wrap">
                  <span className="zone-icon">{zone.icon}</span>
                  {isDone && <span className="zone-done-badge">✅</span>}
                </div>
                <span className="zone-label">{zone.label}</span>
                {isDone ? (
                  <span className="zone-score">{score}分</span>
                ) : (
                  <span className="zone-motto">{zone.motto}</span>
                )}
              </button>
            );
          })}
        </div>
        {/* 进度汇总 */}
        <div className="island-progress-summary">
          今日进度：{todayDone}/{totalZones} 科已完成
          <div className="island-progress-bar">
            <div className="island-progress-fill" style={{ width: `${(todayDone / totalZones) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ═══════════ 底部快捷入口 ═══════════ */}
      <div className="home-bottom-actions">
        <button
          className={`bottom-action-btn ${canPetPlay ? 'action-ready' : 'action-locked'}`}
          onClick={() => canPetPlay && onNavigate('pet-room')}
        >
          <span className="action-icon">{canPetPlay ? '🏠' : '🔒'}</span>
          <span className="action-label">宠物屋</span>
          {canPetPlay && <span className="action-badge">{playAvailable}分</span>}
        </button>
        <button className="bottom-action-btn" onClick={() => onNavigate('tutor')}>
          <span className="action-icon">🧑‍🏫</span>
          <span className="action-label">AI助教</span>
        </button>
        <button
          className={`bottom-action-btn ${canPetPlay ? 'action-ready' : 'action-locked'}`}
          onClick={() => canPetPlay && onNavigate('shop')}
        >
          <span className="action-icon">{canPetPlay ? '🛒' : '🔒'}</span>
          <span className="action-label">商店</span>
        </button>
        <button className="bottom-action-btn" onClick={() => onNavigate('stats')}>
          <span className="action-icon">🏆</span>
          <span className="action-label">成就</span>
          {state.achievements.length > 0 && (
            <span className="action-badge">{state.achievements.length}</span>
          )}
        </button>
      </div>
    </div>
  );
}
