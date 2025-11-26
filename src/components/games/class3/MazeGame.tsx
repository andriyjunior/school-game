import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface MazeGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

type Direction = '⬆️' | '➡️' | '⬇️' | '⬅️';

interface MazeChallenge {
  grid: string[][];
  start: [number, number];
  end: [number, number];
  correctPath: Direction[];
  options: Direction[][];
}

const MAZE_CHALLENGES: MazeChallenge[] = [
  {
    grid: [
      ['🤖', '⬜', '⬜'],
      ['⬛', '⬛', '⬜'],
      ['⬜', '⬜', '🎯']
    ],
    start: [0, 0],
    end: [2, 2],
    correctPath: ['➡️', '➡️', '⬇️', '⬇️'],
    options: [
      ['➡️', '➡️', '⬇️', '⬇️'],
      ['⬇️', '⬇️', '➡️', '➡️'],
      ['➡️', '⬇️', '➡️', '⬇️'],
      ['⬇️', '➡️', '⬇️', '➡️']
    ]
  },
  {
    grid: [
      ['🤖', '⬜', '🎯'],
      ['⬛', '⬜', '⬛'],
      ['⬜', '⬜', '⬜']
    ],
    start: [0, 0],
    end: [0, 2],
    correctPath: ['➡️', '➡️'],
    options: [
      ['➡️', '➡️'],
      ['⬇️', '➡️', '➡️', '⬆️'],
      ['➡️', '⬇️', '➡️'],
      ['⬇️', '⬇️', '➡️', '➡️', '⬆️', '⬆️']
    ]
  },
  {
    grid: [
      ['🤖', '⬛', '⬜'],
      ['⬜', '⬜', '⬜'],
      ['⬜', '⬛', '🎯']
    ],
    start: [0, 0],
    end: [2, 2],
    correctPath: ['⬇️', '➡️', '➡️', '⬇️'],
    options: [
      ['⬇️', '➡️', '➡️', '⬇️'],
      ['➡️', '⬇️', '⬇️', '➡️'],
      ['⬇️', '⬇️', '➡️', '➡️'],
      ['⬇️', '➡️', '⬇️', '➡️']
    ]
  },
  {
    grid: [
      ['⬜', '⬜', '🤖'],
      ['⬜', '⬛', '⬜'],
      ['🎯', '⬜', '⬜']
    ],
    start: [0, 2],
    end: [2, 0],
    correctPath: ['⬇️', '⬇️', '⬅️', '⬅️'],
    options: [
      ['⬇️', '⬇️', '⬅️', '⬅️'],
      ['⬅️', '⬅️', '⬇️', '⬇️'],
      ['⬇️', '⬅️', '⬇️', '⬅️'],
      ['⬅️', '⬇️', '⬅️', '⬇️']
    ]
  },
  {
    grid: [
      ['🤖', '⬜', '⬜', '⬜'],
      ['⬛', '⬛', '⬛', '⬜'],
      ['⬜', '⬜', '⬜', '⬜'],
      ['⬜', '⬛', '⬛', '🎯']
    ],
    start: [0, 0],
    end: [3, 3],
    correctPath: ['➡️', '➡️', '➡️', '⬇️', '⬇️', '⬇️'],
    options: [
      ['➡️', '➡️', '➡️', '⬇️', '⬇️', '⬇️'],
      ['⬇️', '⬇️', '⬇️', '➡️', '➡️', '➡️'],
      ['➡️', '⬇️', '➡️', '⬇️', '➡️', '⬇️'],
      ['⬇️', '➡️', '⬇️', '➡️', '⬇️', '➡️']
    ]
  }
];

export default function MazeGame({ onBack, onShowHelp, updateScore }: MazeGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<MazeChallenge | null>(null);

  const {
    showFeedback,
    isCorrect,
    score,
    streak,
    tasksCompleted,
    showCelebration,
    handleCorrectAnswer,
    handleIncorrectAnswer,
    resetForNewTask
  } = useGameState(updateScore, {
    basePoints: 120,
    streakMultiplier: 12,
    gameType: 'maze-game'
  });

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const loadNewChallenge = () => {
    const challenge = MAZE_CHALLENGES[Math.floor(Math.random() * MAZE_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    resetForNewTask();
  };

  const handleAnswer = async (path: Direction[]) => {
    if (showFeedback || !currentChallenge) return;

    const correct = JSON.stringify(path) === JSON.stringify(currentChallenge.correctPath);

    if (correct) {
      await handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  if (!currentChallenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="maze-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="maze-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 🤖 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: 'var(--theme-primary)',
        fontSize: '1.3em',
        marginBottom: '15px'
      }}>
        Допоможи роботу 🤖 дійти до цілі 🎯
      </h2>

      {/* Maze Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${currentChallenge.grid[0].length}, 50px)`,
          gap: '4px',
          background: '#333',
          padding: '8px',
          borderRadius: '12px'
        }}>
          {currentChallenge.grid.flat().map((cell, index) => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8em',
                background: cell === '⬛' ? '#1a1a1a' : '#f0f0f0',
                borderRadius: '6px'
              }}
            >
              {cell !== '⬜' && cell !== '⬛' ? cell : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Path Options */}
      {!showFeedback && (
        <div>
          <h3 style={{
            textAlign: 'center',
            color: 'var(--theme-primary)',
            fontSize: '1em',
            marginBottom: '12px'
          }}>
            Вибери правильний шлях:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            {currentChallenge.options.map((path, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(path)}
                style={{
                  background: 'var(--theme-gradient-secondary)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  fontSize: '1.2em',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                }}
              >
                {path.join(' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={120 + (streak - 1) * 12}
          streak={streak}
          explanation={`Правильний шлях: ${currentChallenge.correctPath.join(' ')}`}
          onNext={loadNewChallenge}
        />
      )}
    </div>
  );
}
