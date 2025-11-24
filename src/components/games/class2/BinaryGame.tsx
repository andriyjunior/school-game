import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  ActionButton
} from '../../game-ui';
import { useAIMessages } from '../../../hooks/useAIMessages';

interface BinaryGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface BinaryChallenge {
  question: string;
  pattern: boolean[];
  targetNumber?: number;
  type: 'match' | 'count' | 'toggle';
  explanation: string;
}

const CHALLENGE_LIBRARY: BinaryChallenge[] = [
  {
    question: "Ввімкни лампочки так само!",
    pattern: [true, false, true, false],
    type: 'match',
    explanation: "Перша і третя лампочки увімкнені, друга і четверта - вимкнені"
  },
  {
    question: "Повтори візерунок!",
    pattern: [true, true, false, false],
    type: 'match',
    explanation: "Дві лампочки зліва увімкнені, дві справа - вимкнені"
  },
  {
    question: "Зроби так само!",
    pattern: [false, true, true, false],
    type: 'match',
    explanation: "Середні дві лампочки увімкнені"
  },
  {
    question: "Скопіюй візерунок!",
    pattern: [true, false, false, true],
    type: 'match',
    explanation: "Крайні лампочки увімкнені, середні - вимкнені"
  },
  {
    question: "Повтори за зразком!",
    pattern: [false, false, true, true],
    type: 'match',
    explanation: "Права половина увімкнена"
  },
  {
    question: "Увімкни рівно 1 лампочку!",
    pattern: [false, false, false, false],
    targetNumber: 1,
    type: 'count',
    explanation: "Потрібна лише одна увімкнена лампочка"
  },
  {
    question: "Увімкни рівно 2 лампочки!",
    pattern: [false, false, false, false],
    targetNumber: 2,
    type: 'count',
    explanation: "Потрібно дві увімкнені лампочки"
  },
  {
    question: "Увімкни рівно 3 лампочки!",
    pattern: [false, false, false, false],
    targetNumber: 3,
    type: 'count',
    explanation: "Потрібно три увімкнені лампочки"
  },
  {
    question: "Увімкни всі лампочки!",
    pattern: [false, false, false, false],
    targetNumber: 4,
    type: 'count',
    explanation: "Всі чотири лампочки мають світитись"
  },
  {
    question: "Вимкни всі лампочки!",
    pattern: [true, true, true, true],
    targetNumber: 0,
    type: 'count',
    explanation: "Жодна лампочка не має світитись"
  },
  {
    question: "Зміни одну лампочку, щоб було чергування!",
    pattern: [true, false, false, false],
    type: 'toggle',
    explanation: "Правильно: увімкнена-вимкнена-увімкнена-вимкнена"
  },
  {
    question: "Виправ візерунок: має бути симетрія!",
    pattern: [true, true, false, false],
    type: 'toggle',
    explanation: "Симетричний візерунок однаковий з обох сторін"
  }
];

export default function BinaryGame({ onBack, onShowHelp, updateScore }: BinaryGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<BinaryChallenge | null>(null);
  const [userPattern, setUserPattern] = useState<boolean[]>([false, false, false, false]);
  const [targetPattern, setTargetPattern] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const { triggerMotivationalToast } = useAIMessages();

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const loadNewChallenge = () => {
    const randomChallenge = CHALLENGE_LIBRARY[Math.floor(Math.random() * CHALLENGE_LIBRARY.length)];
    setCurrentChallenge(randomChallenge);

    if (randomChallenge.type === 'match') {
      setTargetPattern([...randomChallenge.pattern]);
      setUserPattern([false, false, false, false]);
    } else if (randomChallenge.type === 'count') {
      setTargetPattern([]);
      setUserPattern([...randomChallenge.pattern]);
    } else {
      setTargetPattern([]);
      setUserPattern([...randomChallenge.pattern]);
    }

    setShowFeedback(false);
    setIsCorrect(null);
  };

  const toggleLight = (index: number) => {
    if (showFeedback) return;
    const newPattern = [...userPattern];
    newPattern[index] = !newPattern[index];
    setUserPattern(newPattern);
  };

  const checkAnswer = () => {
    if (!currentChallenge) return;

    let correct = false;

    if (currentChallenge.type === 'match') {
      correct = JSON.stringify(userPattern) === JSON.stringify(targetPattern);
    } else if (currentChallenge.type === 'count') {
      const count = userPattern.filter(x => x).length;
      correct = count === currentChallenge.targetNumber;
    } else {
      const alternating = userPattern.every((val, i) => val === (i % 2 === 0));
      const alternatingReverse = userPattern.every((val, i) => val === (i % 2 === 1));
      const symmetric = userPattern[0] === userPattern[3] && userPattern[1] === userPattern[2];
      correct = alternating || alternatingReverse || symmetric;
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const basePoints = 100;
      const streakBonus = streak * 10;
      const totalPoints = basePoints + streakBonus;

      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setTasksCompleted(prev => prev + 1);

      updateScore(totalPoints, {
        gameType: 'binary-game',
        points: totalPoints,
        correct: true
      });

      triggerMotivationalToast();

      if ((tasksCompleted + 1) % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    } else {
      setStreak(0);
    }
  };

  if (!currentChallenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="binary-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="binary-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #ffd89b 0%, #19547b 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 💡 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: '#667eea',
        fontSize: '1.8em',
        marginBottom: '25px'
      }}>
        {currentChallenge.question}
      </h2>

      {/* Target Pattern (for match type) */}
      {currentChallenge.type === 'match' && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center',
          width: '100%'
        }}>
          <h3 style={{ color: '#666', marginBottom: '15px', fontSize: '1.1em' }}>
            📋 Зразок:
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px'
          }}>
            {targetPattern.map((isOn, index) => (
              <div
                key={index}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isOn
                    ? 'radial-gradient(circle, #ffeb3b 0%, #ffc107 100%)'
                    : '#e0e0e0',
                  boxShadow: isOn
                    ? '0 0 30px rgba(255, 235, 59, 0.8)'
                    : '0 3px 10px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5em'
                }}
              >
                {isOn ? '💡' : '⚫'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Controls */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        width: '100%'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2em' }}>
          🎮 Твої лампочки (натисни щоб перемкнути):
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {userPattern.map((isOn, index) => (
            <button
              key={index}
              onClick={() => toggleLight(index)}
              disabled={showFeedback}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: 'none',
                background: isOn
                  ? 'radial-gradient(circle, #ffeb3b 0%, #ffc107 100%)'
                  : '#424242',
                boxShadow: isOn
                  ? '0 0 40px rgba(255, 235, 59, 0.9)'
                  : '0 5px 15px rgba(0,0,0,0.3)',
                cursor: showFeedback ? 'default' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2em',
                transform: isOn ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {isOn ? '💡' : '⚫'}
            </button>
          ))}
        </div>

        {/* Binary representation */}
        <div style={{
          marginTop: '15px',
          color: 'white',
          fontSize: '1.2em',
          fontFamily: 'monospace'
        }}>
          Код: {userPattern.map(x => x ? '1' : '0').join(' ')}
        </div>
      </div>

      {/* Check Button */}
      {!showFeedback && (
        <div style={{ textAlign: 'center' }}>
          <ActionButton onClick={checkAnswer} variant="success">
            ✅ Перевірити
          </ActionButton>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={100 + (streak - 1) * 10}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={loadNewChallenge}
        />
      )}
    </div>
  );
}
