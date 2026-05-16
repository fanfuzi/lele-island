import { useGame, getPetEmoji } from '../store';

export default function Header({ user, onSettings }) {
  const { state } = useGame();
  const { coins, streak, pet } = state;
  const today = new Date().toDateString();
  const dailyDone = state.dailyProgress.date === today
    ? ['cantonese', 'chinese', 'math'].filter(s => state.dailyProgress[s].done).length
    : 0;

  return (
    <header className="game-header">
      <div className="header-left">
        <span className="header-pet">{getPetEmoji(pet.type)}</span>
        <span className="header-title">乐乐小岛</span>
      </div>
      <div className="header-right">
        <div className="header-stat">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{streak}天</span>
        </div>
        <div className="header-stat">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{coins}</span>
        </div>
        <div className="header-stat header-progress-sm">
          <span className="stat-icon">📋</span>
          <span className="stat-value">{dailyDone}/3</span>
        </div>
        {user && (
          <button className="header-settings-btn" onClick={onSettings} title="设置">
            ⚙️
          </button>
        )}
      </div>
    </header>
  );
}
