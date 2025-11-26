import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface ComparisonGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface ComparisonChallenge {
  left: number | string;
  right: number | string;
  correctAnswer: '>' | '<' | '=';
  explanation: string;
}

const COMPARISON_CHALLENGES: ComparisonChallenge[] = [
  { left: 5, right: 3, correctAnswer: '>', explanation: '5 більше ніж 3' },
  { left: 2, right: 7, correctAnswer: '<', explanation: '2 менше ніж 7' },
  { left: 4, right: 4, correctAnswer: '=', explanation: '4 дорівнює 4' },
  { left: 10, right: 8, correctAnswer: '>', explanation: '10 більше ніж 8' },
  { left: 1, right: 9, correctAnswer: '<', explanation: '1 менше ніж 9' },
  { left: 6, right: 6, correctAnswer: '=', explanation: '6 дорівнює 6' },
  { left: 15, right: 12, correctAnswer: '>', explanation: '15 більше ніж 12' },
  { left: 3, right: 11, correctAnswer: '<', explanation: '3 менше ніж 11' },
  { left: 20, right: 20, correctAnswer: '=', explanation: '20 дорівнює 20' },
  { left: '2 + 3', right: 4, correctAnswer: '>', explanation: '2 + 3 = 5, а 5 > 4' },
  { left: '10 - 3', right: 8, correctAnswer: '<', explanation: '10 - 3 = 7, а 7 < 8' },
  { left: '4 + 4', right: 8, correctAnswer: '=', explanation: '4 + 4 = 8, а 8 = 8' },
  { left: '3 × 2', right: 5, correctAnswer: '>', explanation: '3 × 2 = 6, а 6 > 5' },
  { left: '12 ÷ 3', right: 5, correctAnswer: '<', explanation: '12 ÷ 3 = 4, а 4 < 5' },
  { left: '5 × 2', right: '3 + 7', correctAnswer: '=', explanation: '5 × 2 = 10 і 3 + 7 = 10' },
  { left: 100, right: 99, correctAnswer: '>', explanation: '100 більше ніж 99' },
  { left: 50, right: 55, correctAnswer: '<', explanation: '50 менше ніж 55' },
  { left: '9 - 4', right: '2 + 3', correctAnswer: '=', explanation: '9 - 4 = 5 і 2 + 3 = 5' }
];

export default function ComparisonGame({ onBack, onShowHelp, updateScore }: ComparisonGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<ComparisonChallenge | null>(null);

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
    basePoints: 90,
    streakMultiplier: 9,
    gameType: 'comparison-game'
  });

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const loadNewChallenge = () => {
    const challenge = COMPARISON_CHALLENGES[Math.floor(Math.random() * COMPARISON_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    resetForNewTask();
  };

  const handleAnswer = async (answer: '>' | '<' | '=') => {
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
    <div className="comparison-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="comparison-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 ⚖️ 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: 'var(--theme-primary)',
        fontSize: '1.3em',
        marginBottom: '20px'
      }}>
        Порівняй числа ⚖️
      </h2>

      {/* Comparison Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '25px'
      }}>
        {/* Left value */}
        <div style={{
          background: 'var(--theme-gradient-primary)',
          color: 'white',
          padding: '20px 25px',
          borderRadius: '15px',
          fontSize: '1.8em',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          minWidth: '80px',
          textAlign: 'center'
        }}>
          {currentChallenge.left}
        </div>

        {/* Question mark */}
        <div style={{
          fontSize: '2.5em',
          color: 'var(--theme-primary)',
          fontWeight: 'bold'
        }}>
          ?
        </div>

        {/* Right value */}
        <div style={{
          background: 'var(--theme-gradient-primary)',
          color: 'white',
          padding: '20px 25px',
          borderRadius: '15px',
          fontSize: '1.8em',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          minWidth: '80px',
          textAlign: 'center'
        }}>
          {currentChallenge.right}
        </div>
      </div>

      {/* Answer Options */}
      {!showFeedback && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px'
        }}>
          {(['<', '=', '>'] as const).map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleAnswer(symbol)}
              style={{
                background: 'var(--theme-gradient-secondary)',
                color: 'white',
                border: 'none',
                width: '70px',
                height: '70px',
                fontSize: '2em',
                borderRadius: '15px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
            >
              {symbol}
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={90 + (streak - 1) * 9}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={loadNewChallenge}
        />
      )}
    </div>
  );
}
