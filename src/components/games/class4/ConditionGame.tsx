import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface ConditionGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface ConditionChallenge {
  question: string;
  condition: string;
  value: number | string | boolean;
  trueAction: string;
  falseAction: string;
  isTrue: boolean;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CONDITION_CHALLENGES: ConditionChallenge[] = [
  {
    question: "Що виконає програма?",
    condition: "якщо (вік >= 7)",
    value: 8,
    trueAction: "йти до школи 🏫",
    falseAction: "йти до садочка 🧒",
    isTrue: true,
    options: ["йти до школи 🏫", "йти до садочка 🧒"],
    correctAnswer: 0,
    explanation: "8 >= 7 - це правда, тому виконається перша дія"
  },
  {
    question: "Що зробить робот?",
    condition: "якщо (температура > 30)",
    value: 25,
    trueAction: "увімкнути кондиціонер ❄️",
    falseAction: "нічого не робити 😊",
    isTrue: false,
    options: ["увімкнути кондиціонер ❄️", "нічого не робити 😊"],
    correctAnswer: 1,
    explanation: "25 > 30 - це неправда, тому виконається друга дія"
  },
  {
    question: "Що буде результатом?",
    condition: "якщо (є парасолька)",
    value: true,
    trueAction: "йти гуляти 🚶",
    falseAction: "залишитись вдома 🏠",
    isTrue: true,
    options: ["йти гуляти 🚶", "залишитись вдома 🏠"],
    correctAnswer: 0,
    explanation: "Парасолька є - умова правдива"
  },
  {
    question: "Що зробить програма?",
    condition: "якщо (число > 10)",
    value: 5,
    trueAction: "сказати 'Велике!' 📢",
    falseAction: "сказати 'Мале!' 🔇",
    isTrue: false,
    options: ["сказати 'Велике!' 📢", "сказати 'Мале!' 🔇"],
    correctAnswer: 1,
    explanation: "5 > 10 - це неправда, тому скаже 'Мале!'"
  },
  {
    question: "Яку дію виконає робот?",
    condition: "якщо (батарея < 20%)",
    value: 15,
    trueAction: "йти заряджатись 🔋",
    falseAction: "продовжити роботу 🤖",
    isTrue: true,
    options: ["йти заряджатись 🔋", "продовжити роботу 🤖"],
    correctAnswer: 0,
    explanation: "15 < 20 - правда, робот піде заряджатись"
  },
  {
    question: "Що станеться?",
    condition: "якщо (сьогодні вихідний)",
    value: false,
    trueAction: "грати в ігри 🎮",
    falseAction: "робити уроки 📚",
    isTrue: false,
    options: ["грати в ігри 🎮", "робити уроки 📚"],
    correctAnswer: 1,
    explanation: "Сьогодні не вихідний - треба робити уроки"
  },
  {
    question: "Що виведе програма?",
    condition: "якщо (оцінка >= 10)",
    value: 12,
    trueAction: "показати '⭐ Відмінно!'",
    falseAction: "показати '📝 Спробуй ще'",
    isTrue: true,
    options: ["показати '⭐ Відмінно!'", "показати '📝 Спробуй ще'"],
    correctAnswer: 0,
    explanation: "12 >= 10 - правда, тому буде 'Відмінно!'"
  },
  {
    question: "Яка буде відповідь?",
    condition: "якщо (швидкість > 50)",
    value: 45,
    trueAction: "показати '🚨 Сповільнити!'",
    falseAction: "показати '✅ Добре!'",
    isTrue: false,
    options: ["показати '🚨 Сповільнити!'", "показати '✅ Добре!'"],
    correctAnswer: 1,
    explanation: "45 > 50 - неправда, швидкість нормальна"
  },
  {
    question: "Що зробить комп'ютер?",
    condition: "якщо (пароль правильний)",
    value: true,
    trueAction: "відкрити доступ 🔓",
    falseAction: "заблокувати 🔒",
    isTrue: true,
    options: ["відкрити доступ 🔓", "заблокувати 🔒"],
    correctAnswer: 0,
    explanation: "Пароль правильний - доступ відкрито"
  },
  {
    question: "Яке повідомлення з'явиться?",
    condition: "якщо (кількість яблук == 0)",
    value: 3,
    trueAction: "показати '🛒 Купи яблука'",
    falseAction: "показати '🍎 Яблука є!'",
    isTrue: false,
    options: ["показати '🛒 Купи яблука'", "показати '🍎 Яблука є!'"],
    correctAnswer: 1,
    explanation: "3 == 0 - неправда, яблука ще є"
  },
  {
    question: "Що виконається?",
    condition: "якщо (година >= 22)",
    value: 23,
    trueAction: "лягти спати 😴",
    falseAction: "продовжити грати 🎮",
    isTrue: true,
    options: ["лягти спати 😴", "продовжити грати 🎮"],
    correctAnswer: 0,
    explanation: "23 >= 22 - правда, час спати!"
  },
  {
    question: "Що зробить світлофор?",
    condition: "якщо (колір == 'зелений')",
    value: "зелений",
    trueAction: "дозволити рух 🟢",
    falseAction: "зупинити рух 🔴",
    isTrue: true,
    options: ["дозволити рух 🟢", "зупинити рух 🔴"],
    correctAnswer: 0,
    explanation: "Колір зелений - можна їхати!"
  }
];

export default function ConditionGame({ onBack, onShowHelp, updateScore }: ConditionGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<ConditionChallenge | null>(null);

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
    gameType: 'condition-game'
  });

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const loadNewChallenge = () => {
    const challenge = CONDITION_CHALLENGES[Math.floor(Math.random() * CONDITION_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    resetForNewTask();
  };

  const handleAnswer = async (answerIndex: number) => {
    if (showFeedback || !currentChallenge) return;

    const correct = answerIndex === currentChallenge.correctAnswer;

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
    <div className="condition-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="condition-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 🔀 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: '#667eea',
        fontSize: '1.6em',
        marginBottom: '20px'
      }}>
        {currentChallenge.question}
      </h2>

      {/* Code Display */}
      <div style={{
        background: '#2d3436',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        fontFamily: 'monospace',
        width: '100%'
      }}>
        <div style={{ color: '#74b9ff', fontSize: '0.9em', marginBottom: '10px' }}>
          // Значення: {String(currentChallenge.value)}
        </div>
        <pre style={{
          color: '#dfe6e9',
          fontSize: '1.2em',
          margin: 0,
          whiteSpace: 'pre-wrap'
        }}>
          <span style={{ color: '#fdcb6e' }}>{currentChallenge.condition}</span>{'\n'}
          {'  '}<span style={{ color: '#55efc4' }}>тоді: {currentChallenge.trueAction}</span>{'\n'}
          {'  '}<span style={{ color: '#fab1a0' }}>інакше: {currentChallenge.falseAction}</span>
        </pre>
      </div>

      {/* Answer Options */}
      {!showFeedback && (
        <div>
          <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.1em', textAlign: 'center' }}>
            🎯 Що виконається?
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {currentChallenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                style={{
                  background: index === 0
                    ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
                    : 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '20px',
                  fontSize: '1.3em',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}
              >
                {index === 0 ? '✅ ' : '❌ '}{option}
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
          explanation={currentChallenge.explanation}
          onNext={loadNewChallenge}
        />
      )}
    </div>
  );
}
