import { useGame } from '../store';

const tasks = [
  { key: 'cantonese', label: '粤语练习', icon: '🗣️', color: '#FF9EAA' },
  { key: 'chinese', label: '繁体字', icon: '✍️', color: '#A8D8EA' },
  { key: 'math', label: '数学', icon: '🔢', color: '#AAE1C6' },
];

export default function TaskList({ onNavigate }) {
  const { state } = useGame();
  const today = new Date().toDateString();
  const progress = state.dailyProgress.date === today ? state.dailyProgress : null;

  return (
    <div className="task-list">
      <h3 className="task-list-title">📋 今日任务</h3>
      <div className="task-items">
        {tasks.map(task => {
          const done = progress?.[task.key]?.done;
          return (
            <button
              key={task.key}
              className={`task-item ${done ? 'task-done' : ''}`}
              style={{ '--task-color': task.color }}
              onClick={() => onNavigate?.(task.key)}
            >
              <span className="task-icon">{task.icon}</span>
              <span className="task-label">{task.label}</span>
              {done ? (
                <span className="task-check">✅</span>
              ) : (
                <span className="task-go">GO →</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
