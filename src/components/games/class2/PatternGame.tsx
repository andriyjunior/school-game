import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface PatternGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface Pattern {
  question: string;
  sequence: string[];
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PATTERN_LIBRARY: Record<string, Pattern[]> = {
  shapes: [
    {
      question: "Яка фігура буде наступною?",
      sequence: ["🔵", "🔴", "🔵", "🔴", "🔵", "?"],
      options: ["🔴", "🔵", "🟢", "🟡"],
      correctAnswer: 0,
      explanation: "Синій і червоний чергуються: синій → червоний → синій → червоний"
    },
    {
      question: "Продовж послідовність!",
      sequence: ["⭐", "⭐", "🌙", "⭐", "⭐", "?"],
      options: ["⭐", "🌙", "☀️", "🌟"],
      correctAnswer: 1,
      explanation: "Дві зірочки, потім місяць - і так повторюється"
    },
    {
      question: "Що буде далі?",
      sequence: ["🔺", "🔻", "🔺", "🔻", "🔺", "?"],
      options: ["🔺", "🔻", "⬛", "⬜"],
      correctAnswer: 1,
      explanation: "Трикутник вгору і вниз чергуються"
    },
    {
      question: "Знайди закономірність!",
      sequence: ["🟡", "🟡", "🟢", "🟡", "🟡", "?"],
      options: ["🟡", "🟢", "🔴", "🔵"],
      correctAnswer: 1,
      explanation: "Два жовтих, потім зелений - і повторюється"
    },
    {
      question: "Яка фігура пропущена?",
      sequence: ["⬛", "⬜", "⬛", "⬜", "⬛", "?"],
      options: ["⬛", "⬜", "🔲", "🔳"],
      correctAnswer: 1,
      explanation: "Чорний і білий квадрати чергуються"
    }
  ],
  numbers: [
    {
      question: "Яке число буде далі?",
      sequence: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "?"],
      options: ["6️⃣", "7️⃣", "1️⃣", "5️⃣"],
      correctAnswer: 0,
      explanation: "Числа йдуть по порядку: 1, 2, 3, 4, 5, 6..."
    },
    {
      question: "Продовж рахунок!",
      sequence: ["2️⃣", "4️⃣", "6️⃣", "8️⃣", "?"],
      options: ["9️⃣", "🔟", "7️⃣", "1️⃣"],
      correctAnswer: 1,
      explanation: "Рахуємо двійками: 2, 4, 6, 8, 10"
    },
    {
      question: "Знайди закономірність!",
      sequence: ["1️⃣", "1️⃣", "2️⃣", "2️⃣", "3️⃣", "?"],
      options: ["3️⃣", "4️⃣", "2️⃣", "1️⃣"],
      correctAnswer: 0,
      explanation: "Кожне число повторюється двічі: 1, 1, 2, 2, 3, 3"
    },
    {
      question: "Що далі?",
      sequence: ["5️⃣", "4️⃣", "3️⃣", "2️⃣", "?"],
      options: ["1️⃣", "0️⃣", "3️⃣", "6️⃣"],
      correctAnswer: 0,
      explanation: "Числа зменшуються на 1: 5, 4, 3, 2, 1"
    }
  ],
  emoji: [
    {
      question: "Яка тваринка буде далі?",
      sequence: ["🐱", "🐶", "🐱", "🐶", "🐱", "?"],
      options: ["🐶", "🐱", "🐰", "🐻"],
      correctAnswer: 0,
      explanation: "Котик і песик чергуються"
    },
    {
      question: "Продовж послідовність!",
      sequence: ["🍎", "🍊", "🍋", "🍎", "🍊", "?"],
      options: ["🍎", "🍋", "🍊", "🍇"],
      correctAnswer: 1,
      explanation: "Яблуко, апельсин, лимон - і повторюється"
    },
    {
      question: "Знайди закономірність!",
      sequence: ["🌸", "🌸", "🌺", "🌸", "🌸", "?"],
      options: ["🌸", "🌺", "🌻", "🌷"],
      correctAnswer: 1,
      explanation: "Дві рожеві квіточки, потім червона"
    },
    {
      question: "Що буде далі?",
      sequence: ["🚗", "🚕", "🚗", "🚕", "🚗", "?"],
      options: ["🚗", "🚕", "🚌", "🏎️"],
      correctAnswer: 1,
      explanation: "Червона і жовта машинка чергуються"
    },
    {
      question: "Яка пташка наступна?",
      sequence: ["🐦", "🦅", "🐦", "🦅", "🐦", "?"],
      options: ["🐦", "🦅", "🦆", "🦉"],
      correctAnswer: 1,
      explanation: "Маленька пташка і орел чергуються"
    }
  ],
  growing: [
    {
      question: "Як росте квітка?",
      sequence: ["🌱", "🌿", "🌸", "🌱", "🌿", "?"],
      options: ["🌸", "🌱", "🌿", "🌺"],
      correctAnswer: 0,
      explanation: "Паросток → листочки → квітка - цикл росту"
    },
    {
      question: "Як змінюється місяць?",
      sequence: ["🌑", "🌓", "🌕", "🌗", "🌑", "?"],
      options: ["🌓", "🌕", "🌗", "🌑"],
      correctAnswer: 0,
      explanation: "Фази місяця: новий → перша чверть → повний → остання чверть"
    },
    {
      question: "Як росте дерево?",
      sequence: ["🌰", "🌱", "🌳", "🌰", "🌱", "?"],
      options: ["🌳", "🌰", "🌱", "🌲"],
      correctAnswer: 0,
      explanation: "Жолудь → паросток → дерево"
    },
    {
      question: "Яка погода далі?",
      sequence: ["☀️", "⛅", "☁️", "🌧️", "☀️", "?"],
      options: ["⛅", "☁️", "🌧️", "❄️"],
      correctAnswer: 0,
      explanation: "Сонечко → хмаринка → хмара → дощ - і знову"
    }
  ],
  size: [
    {
      question: "Який розмір далі?",
      sequence: ["🔴", "⚫", "🔴", "⚫", "🔴", "?"],
      options: ["⚫", "🔴", "🟤", "🟠"],
      correctAnswer: 0,
      explanation: "Великий і маленький чергуються"
    },
    {
      question: "Продовж ряд!",
      sequence: ["🏠", "🏡", "🏠", "🏡", "🏠", "?"],
      options: ["🏡", "🏠", "🏢", "🏰"],
      correctAnswer: 0,
      explanation: "Маленький і великий будинок чергуються"
    }
  ]
};

const ALL_PATTERNS = Object.values(PATTERN_LIBRARY).flat();

export default function PatternGame({ onBack, onShowHelp, updateScore }: PatternGameProps) {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [stars, setStars] = useState(0);

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
    basePoints: 100,
    streakMultiplier: 10,
    gameType: 'pattern-game'
  });

  useEffect(() => {
    loadNewPattern();
  }, []);

  const loadNewPattern = () => {
    const randomPattern = ALL_PATTERNS[Math.floor(Math.random() * ALL_PATTERNS.length)];
    setCurrentPattern(randomPattern);
    resetForNewTask();
  };

  const handleAnswer = async (answerIndex: number) => {
    if (showFeedback || !currentPattern) return;

    const correct = answerIndex === currentPattern.correctAnswer;

    if (correct) {
      setStars(prev => prev + 1);
      await handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  if (!currentPattern) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pattern-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="pattern-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
        extraStats={[{ label: 'Зірки', value: `⭐ ${stars}` }]}
        floating
      />

      <CelebrationOverlay show={showCelebration} />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: '#667eea',
        fontSize: '1.8em',
        marginBottom: '25px'
      }}>
        {currentPattern.question}
      </h2>

      {/* Pattern Sequence */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '3em'
        }}>
          {currentPattern.sequence.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                background: item === '?'
                  ? (showFeedback
                    ? (isCorrect ? '#28a745' : '#dc3545')
                    : '#667eea')
                  : 'white',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                minWidth: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item === '?' && showFeedback
                ? currentPattern.options[currentPattern.correctAnswer]
                : item}
            </div>
          ))}
        </div>
      </div>

      {/* Answer Options */}
      {!showFeedback && (
        <div>
          <h3 style={{
            color: '#667eea',
            marginBottom: '15px',
            fontSize: '1.2em',
            textAlign: 'center'
          }}>
            🎯 Вибери правильну відповідь:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            maxWidth: '400px',
            margin: '0 auto',
            width: '100%'
          }}>
            {currentPattern.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '20px',
                  fontSize: '2em',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  minHeight: '80px'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={100 + (streak - 1) * 10}
          streak={streak}
          explanation={currentPattern.explanation}
          onNext={loadNewPattern}
          nextButtonText="➡️ Наступний візерунок"
        />
      )}
    </div>
  );
}
