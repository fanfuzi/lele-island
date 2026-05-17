import { useEffect } from 'react';
import { useGame, getPetEmoji, getPetMood } from '../store';
import PetCompanion from '../components/PetCompanion';
import TaskList from '../components/TaskList';
import ProgressBar from '../components/ProgressBar';
import { logActivity } from '../utils/activityLog';
import { speakPet } from '../utils/speech';

const zones = [
  { key: 'cantonese', label: '粤语区', icon: '🗣️', color: '#FF9EAA', desc: '和团子一起学粤语' },
  { key: 'chinese', label: '汉字区', icon: '✍️', color: '#A8D8EA', desc: '认识繁体字' },
  { key: 'math', label: '数学岛', icon: '🔢', color: '#AAE1C6', desc: '数学大冒险' },
];

export default function HomeScreen({ onNavigate }) {
  const { state } = useGame();
  const { pet, dailyProgress, stats, streak, showTutorial } = state;
  const today = new Date().toDateString();
  const isNewDay = dailyProgress.date !== today;
  const petMood = getPetMood(state);

  // 欢迎语音
  useEffect(() => {
    const greeted = sessionStorage.getItem('lele-greeted');
    if (!greeted) {
      speakPet('welcome');
      sessionStorage.setItem('lele-greeted', 'true');
    }
  }, []);

  // 饿了/难过时自动语音
  useEffect(() => {
    if (petMood === 'hungry') {
      const t = setTimeout(() => speakPet('hungry'), 3000);
      return () => clearTimeout(t);
    }
  }, [petMood]);

  return (
    <div className="screen home-screen">
      {/* 宠物区域 */}
      <div className="home-pet-section">
        <PetCompanion size="large" showLevel interactive voiceEnabled idleDetection gazeTracking />
      </div>

      {/* 今日任务 */}
      <TaskList onNavigate={onNavigate} />

      {/* 功能区导航 */}
      <div className="zone-grid">
        {zones.map(zone => {
          const isDone = dailyProgress.date === today && dailyProgress[zone.key]?.done;
          return (
            <button
              key={zone.key}
              className={`zone-card ${isDone ? 'zone-done' : ''}`}
              style={{ '--zone-color': zone.color }}
              onClick={() => {
                logActivity({ type: 'visit', subject: zone.key });
                onNavigate(zone.key);
              }}
            >
              <span className="zone-icon">{zone.icon}</span>
              <span className="zone-label">{zone.label}</span>
              {isDone ? (
                <span className="zone-check">✅</span>
              ) : (
                <span className="zone-desc">{zone.desc}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 快捷导航 */}
      <div className="quick-nav">
        <button className="quick-btn" onClick={() => onNavigate('pet-room')}>
          🏠 宠物屋
        </button>
        <button className="quick-btn" onClick={() => onNavigate('shop')}>
          🛒 商店
        </button>
        <button className="quick-btn" onClick={() => onNavigate('stats')}>
          📊 成就
        </button>
      </div>

      {/* AI 助教入口 */}
      <div className="home-tutor-section">
        <button className="home-tutor-card" onClick={() => onNavigate('tutor')}>
          <span className="home-tutor-icon">🧑‍🏫</span>
          <span className="home-tutor-info">
            <span className="home-tutor-title">AI 助教</span>
            <span className="home-tutor-desc">作业诊断 + 智能复习</span>
          </span>
          <span className="home-tutor-badge">AI</span>
          <span className="game-select-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
