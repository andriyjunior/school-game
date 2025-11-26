import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface MemoryCodeGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

type CodeSymbol = '🔴' | '🔵' | '🟢' | '🟡' | '🟣';

const ALL_SYMBOLS: CodeSymbol[] = ['🔴', '🔵', '🟢', '🟡', '🟣'];

export default function MemoryCodeGame({ onBack, onShowHelp, updateScore }: MemoryCodeGameProps) {
  const [sequence, setSequence] = useState<CodeSymbol[]>([]);
  const [userSequence, setUserSequence] = useState<CodeSymbol[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(true);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [level, setLevel] = useState(3);

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
    basePoints: 130,
    streakMultiplier: 13,
    gameType: 'memory-code-game'
  });

  useEffect(() => {
    generateNewSequence();
  }, []);

  const generateNewSequence = () => {
    const newSequence: CodeSymbol[] = [];
    for (let i = 0; i < level; i++) {
      const randomSymbol = ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
      newSequence.push(randomSymbol);
    }
    setSequence(newSequence);
    setUserSequence([]);
    setIsShowingSequence(true);
    setCurrentShowIndex(0);
    resetForNewTask();

    // Animate showing sequence
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setCurrentShowIndex(index);
      if (index >= newSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsShowingSequence(false);
        }, 800);
      }
    }, 600);
  };

  const handleSymbolClick = async (symbol: CodeSymbol) => {
    if (isShowingSequence || showFeedback) return;

    const newUserSequence = [...userSequence, symbol];
    setUserSequence(newUserSequence);

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      const isMatch = newUserSequence.every((s, i) => s === sequence[i]);

      if (isMatch) {
        await handleCorrectAnswer();
        // Increase level after 3 correct answers
        if ((tasksCompleted + 1) % 3 === 0 && level < 7) {
          setLevel(level + 1);
        }
      } else {
        handleIncorrectAnswer();
        // Decrease level on wrong answer
        if (level > 3) {
          setLevel(level - 1);
        }
      }
    }
  };

  const loadNewChallenge = () => {
    generateNewSequence();
  };

  return (
    <div className="memory-code-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="memory-code-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 🧠 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: 'var(--theme-primary)',
        fontSize: '1.3em',
        marginBottom: '10px'
      }}>
        Запам'ятай послідовність 🧠
      </h2>

      {/* Level indicator */}
      <div style={{
        textAlign: 'center',
        color: 'var(--theme-text-muted)',
        fontSize: '0.9em',
        marginBottom: '15px'
      }}>
        Рівень: {level - 2} (елементів: {level})
      </div>

      {/* Sequence Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
        minHeight: '70px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {isShowingSequence ? (
          // Show sequence one by one
          sequence.slice(0, currentShowIndex).map((symbol, index) => (
            <div
              key={index}
              style={{
                fontSize: '2.5em',
                animation: 'fadeIn 0.3s ease-in',
                transform: index === currentShowIndex - 1 ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s'
              }}
            >
              {symbol}
            </div>
          ))
        ) : (
          // Show user's input
          <>
            {userSequence.map((symbol, index) => (
              <div
                key={index}
                style={{
                  fontSize: '2.5em',
                  animation: 'fadeIn 0.2s ease-in'
                }}
              >
                {symbol}
              </div>
            ))}
            {/* Show remaining slots */}
            {Array(sequence.length - userSequence.length).fill(0).map((_, index) => (
              <div
                key={`empty-${index}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '3px dashed var(--theme-primary)',
                  opacity: 0.3
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Status text */}
      {isShowingSequence && (
        <p style={{
          textAlign: 'center',
          color: 'var(--theme-primary)',
          fontSize: '1.1em',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}>
          Запам'ятовуй... 👀
        </p>
      )}

      {/* Symbol buttons */}
      {!isShowingSequence && !showFeedback && (
        <div>
          <p style={{
            textAlign: 'center',
            color: 'var(--theme-primary)',
            fontSize: '1em',
            marginBottom: '12px'
          }}>
            Відтвори послідовність:
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {ALL_SYMBOLS.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSymbolClick(symbol)}
                style={{
                  background: 'var(--theme-gradient-secondary)',
                  border: 'none',
                  width: '60px',
                  height: '60px',
                  fontSize: '2em',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'transform 0.1s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={130 + (streak - 1) * 13}
          streak={streak}
          explanation={`Правильна послідовність: ${sequence.join(' ')}`}
          onNext={loadNewChallenge}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
