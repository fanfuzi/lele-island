import { useGame } from '../store';

export default function ProgressBar() {
  const { state } = useGame();
  const { exp, level } = state.pet;
  const expThisLevel = exp % 100;
  const progress = (expThisLevel / 100) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-label">
        <span>Lv.{level}</span>
        <span>{expThisLevel}/100</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
