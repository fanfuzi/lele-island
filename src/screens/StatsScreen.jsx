import { useGame } from '../store';

const ACHIEVEMENTS = [
  { id: 'first-quest', name: '第一次任务', icon: '🌟', desc: '完成第一个学习任务', check: s => s.stats.totalQuestions > 0 },
  { id: 'all-done', name: '全能小达人', icon: '🏆', desc: '同一天完成粤语、繁体、数学三个任务', check: s => s.achievements.includes('all-done') },
  { id: '7day', name: '坚持一周', icon: '🔥', desc: '连续打卡7天', check: s => s.achievements.includes('7day') },
  { id: 'level3', name: '三级小岛主', icon: '⭐', desc: '宠物升到3级', check: s => s.achievements.includes('level3') },
  { id: '100q', name: '答题达人', icon: '📚', desc: '累计答对100题', check: s => s.stats.correctAnswers >= 100 },
  { id: '50q', name: '小小学霸', icon: '✏️', desc: '累计答对50题', check: s => s.stats.correctAnswers >= 50 },
  { id: 'shop-first', name: '第一次购物', icon: '🛍️', desc: '在商店买一件东西', check: s => s.inventory.length > 0 },
  { id: 'level5', name: '五星岛主', icon: '👑', desc: '宠物升到5级', check: s => s.pet.level >= 5 },
  { id: 'rich', name: '小小富翁', icon: '💰', desc: '攒到200个金币', check: s => s.coins >= 200 },
];

export default function StatsScreen({ onBack }) {
  const { state } = useGame();
  const { stats, streak } = state;

  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
    : 0;

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>📊 我的成就</h2>
        <div />
      </div>

      {/* 统计概览 */}
      <div className="stats-overview">
        <div className="stat-card">
          <span className="stat-num">{stats.totalQuestions}</span>
          <span className="stat-label">答题总数</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{accuracy}%</span>
          <span className="stat-label">正确率</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{streak}</span>
          <span className="stat-label">连续天数</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{state.pet.level}</span>
          <span className="stat-label">宠物等级</span>
        </div>
      </div>

      {/* 成就列表 */}
      <div className="achievement-list">
        <h3>🏅 成就徽章</h3>
        {ACHIEVEMENTS.map(ach => {
          const unlocked = ach.check(state);
          return (
            <div key={ach.id} className={`achievement-item ${unlocked ? 'unlocked' : 'locked'}`}>
              <span className="achievement-icon">{unlocked ? ach.icon : '🔒'}</span>
              <div className="achievement-info">
                <span className="achievement-name">{ach.name}</span>
                <span className="achievement-desc">{ach.desc}</span>
              </div>
              {unlocked && <span className="achievement-check">✅</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
