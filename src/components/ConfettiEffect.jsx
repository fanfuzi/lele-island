import { useMemo } from 'react';

const COLORS = ['#FF9EAA', '#A8D8EA', '#FFD700', '#AAE1C6', '#DDA0DD', '#FFB5E6', '#87CEEB', '#FF8C9E'];
const SHAPES = ['circle', 'square', 'star'];

function Particle({ index, color, shape, style }) {
  const emoji = shape === 'star' ? '⭐' : shape === 'circle' ? '✨' : '🎉';
  return (
    <span
      className="confetti-particle"
      style={{
        '--x': `${Math.random() * 100}%`,
        '--delay': `${Math.random() * 0.6}s`,
        '--duration': `${1.5 + Math.random() * 1.5}s`,
        '--color': color,
        '--size': `${6 + Math.random() * 8}px`,
        '--rotation': `${Math.random() * 360}deg`,
        color,
        fontSize: `var(--size)`,
        ...style,
      }}
    >
      {emoji}
    </span>
  );
}

export default function ConfettiEffect({ count = 30, active = true }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 2,
      size: 10 + Math.random() * 16,
    }));
  }, [count]);

  if (!active) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
            '--hue': p.id * 37,
          }}
        >
          {p.id % 3 === 0 ? '⭐' : p.id % 3 === 1 ? '✨' : '🎉'}
        </span>
      ))}
    </div>
  );
}
