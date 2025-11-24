import { ReactNode } from 'react';

interface StatItem {
  label: string;
  value: ReactNode;
}

interface ScoreDisplayProps {
  score: number;
  streak: number;
  tasksCompleted: number;
  gradient?: string;
  extraStats?: StatItem[];
  floating?: boolean;
}

export default function ScoreDisplay({
  score,
  streak,
  tasksCompleted,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  extraStats = [],
  floating = false
}: ScoreDisplayProps) {
  const stats: StatItem[] = [
    { label: 'Бали', value: score },
    { label: 'Серія', value: `🔥 ${streak}` },
    { label: 'Завдань', value: `✅ ${tasksCompleted}` },
    ...extraStats
  ];

  if (floating) {
    return (
      <div style={{
        position: 'fixed',
        top: '15px',
        left: '15px',
        background: gradient,
        borderRadius: '20px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: 1000,
        color: 'white',
        fontSize: '0.85em'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{score}</div>
          <div style={{ fontSize: '0.7em', opacity: 0.9 }}>бали</div>
        </div>
        <div style={{
          width: '1px',
          height: '30px',
          background: 'rgba(255,255,255,0.3)'
        }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          {streak > 0 && (
            <span title="Серія">🔥 {streak}</span>
          )}
          <span title="Завдань">✅ {tasksCompleted}</span>
        </div>
        {extraStats.map((stat, index) => (
          <span key={index} title={stat.label}>{stat.value}</span>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '15px',
      background: gradient,
      borderRadius: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px',
      color: 'white',
      width: '100%'
    }}>
      {stats.map((stat, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em' }}>{stat.label}</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
