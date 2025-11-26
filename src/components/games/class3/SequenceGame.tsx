import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface SequenceGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface SequenceChallenge {
  sequence: (number | string)[];
  missingIndex: number;
  options: (number | string)[];
  correctAnswer: number | string;
  type: 'numbers' | 'letters' | 'mixed';
  explanation: string;
}

const SEQUENCE_CHALLENGES: SequenceChallenge[] = [
  // Number sequences
  { sequence: [2, 4, 6, '?', 10], missingIndex: 3, options: [7, 8, 9, 5], correctAnswer: 8, type: 'numbers', explanation: 'Кожне число збільшується на 2' },
  { sequence: [1, 3, 5, 7, '?'], missingIndex: 4, options: [8, 9, 10, 11], correctAnswer: 9, type: 'numbers', explanation: 'Непарні числа: +2 кожного разу' },
  { sequence: [10, 20, 30, '?', 50], missingIndex: 3, options: [35, 40, 45, 25], correctAnswer: 40, type: 'numbers', explanation: 'Десятки: +10 кожного разу' },
  { sequence: [5, 10, 15, 20, '?'], missingIndex: 4, options: [22, 25, 30, 24], correctAnswer: 25, type: 'numbers', explanation: 'Числа кратні 5: +5 кожного разу' },
  { sequence: [100, 90, 80, '?', 60], missingIndex: 3, options: [75, 70, 65, 55], correctAnswer: 70, type: 'numbers', explanation: 'Спадна послідовність: -10 кожного разу' },
  { sequence: [1, 2, 4, '?', 16], missingIndex: 3, options: [6, 8, 10, 12], correctAnswer: 8, type: 'numbers', explanation: 'Подвоєння: кожне число множиться на 2' },
  { sequence: [3, 6, 9, 12, '?'], missingIndex: 4, options: [14, 15, 16, 18], correctAnswer: 15, type: 'numbers', explanation: 'Таблиця множення на 3' },

  // Letter sequences
  { sequence: ['А', 'Б', 'В', '?', 'Ґ'], missingIndex: 3, options: ['Г', 'Д', 'Е', 'Є'], correctAnswer: 'Г', type: 'letters', explanation: 'Український алфавіт по порядку' },
  { sequence: ['А', 'В', 'Ґ', '?', 'Е'], missingIndex: 3, options: ['Г', 'Д', 'Є', 'Ж'], correctAnswer: 'Д', type: 'letters', explanation: 'Кожна друга буква алфавіту' },
  { sequence: ['К', 'Л', 'М', 'Н', '?'], missingIndex: 4, options: ['О', 'П', 'Р', 'С'], correctAnswer: 'О', type: 'letters', explanation: 'Послідовні букви алфавіту' },

  // Mixed/pattern sequences
  { sequence: [1, 1, 2, 3, '?'], missingIndex: 4, options: [4, 5, 6, 7], correctAnswer: 5, type: 'mixed', explanation: 'Числа Фібоначчі: 3+2=5' },
  { sequence: [2, 4, 8, 16, '?'], missingIndex: 4, options: [24, 28, 32, 20], correctAnswer: 32, type: 'numbers', explanation: 'Степені двійки: ×2 кожного разу' },
];

export default function SequenceGame({ onBack, onShowHelp, updateScore }: SequenceGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<SequenceChallenge | null>(null);

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
    basePoints: 110,
    streakMultiplier: 11,
    gameType: 'sequence-game'
  });

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const loadNewChallenge = () => {
    const challenge = SEQUENCE_CHALLENGES[Math.floor(Math.random() * SEQUENCE_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    resetForNewTask();
  };

  const handleAnswer = async (answer: number | string) => {
    if (showFeedback || !currentChallenge) return;

    const correct = answer === currentChallenge.correctAnswer;

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
    <div className="sequence-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="sequence-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 🔢 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: 'var(--theme-primary)',
        fontSize: '1.4em',
        marginBottom: '15px'
      }}>
        Знайди пропущений елемент
      </h2>

      {/* Sequence Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {currentChallenge.sequence.map((item, index) => (
          <div
            key={index}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 'bold',
              background: item === '?'
                ? 'var(--theme-gradient-primary)'
                : '#f0f0f0',
              color: item === '?' ? 'white' : 'var(--theme-primary)',
              boxShadow: item === '?'
                ? '0 4px 15px rgba(0,0,0,0.2)'
                : '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Answer Options */}
      {!showFeedback && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          {currentChallenge.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              style={{
                background: 'var(--theme-gradient-secondary)',
                color: 'white',
                border: 'none',
                padding: '15px',
                fontSize: '1.5em',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={110 + (streak - 1) * 11}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={loadNewChallenge}
        />
      )}
    </div>
  );
}
