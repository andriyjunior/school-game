import { GameType } from '../../types';

interface GameHeaderProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  gameType: GameType;
}

const gameNames: Record<string, string> = {
  'algorithm-game': 'Алгоритми',
  'binary-game': 'Двійковий код',
  'pattern-game': 'Візерунки',
  'bug-hunter': 'Мисливець на баги',
  'loop-game': 'Цикли',
  'condition-game': 'Умови',
  'sorting-game': 'Сортування'
};

export default function GameHeader({ onBack, onShowHelp, gameType }: GameHeaderProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Game Title */}
      <div style={{
        background: 'var(--theme-gradient-primary)',
        borderRadius: '12px',
        padding: '12px 20px',
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        <h2 style={{
          margin: 0,
          color: 'white',
          fontSize: '1.4em',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
        }}>
          {gameNames[gameType] || gameType}
        </h2>
      </div>

      {/* Navigation buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '0.85em',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Назад
        </button>

        <button
          onClick={() => onShowHelp(gameType)}
          style={{
            background: 'transparent',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '0.85em',
            color: '#666'
          }}
        >
          ❓
        </button>
      </div>
    </div>
  );
}
