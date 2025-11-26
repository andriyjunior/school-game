import { useEffect } from 'react';
import {
  GameProps,
  OptionChallenge,
  GameLayout,
  OptionGrid,
  QuestionDisplay,
  FeedbackSection,
  useGameState,
  useChallengeManager
} from '../../../engine';

interface Pattern extends OptionChallenge {
  sequence: string[];
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

export default function PatternGame({ onBack, onShowHelp, updateScore }: GameProps) {
  const {
    currentChallenge: currentPattern,
    loadNextChallenge
  } = useChallengeManager<Pattern>({
    challenges: ALL_PATTERNS,
    avoidRepeatLast: 5
  });

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
    loadNextChallenge();
  }, [loadNextChallenge]);

  const handleNext = () => {
    loadNextChallenge();
    resetForNewTask();
  };

  const handleAnswer = async (_option: string, answerIndex: number) => {
    if (showFeedback || !currentPattern) return;

    const correct = answerIndex === currentPattern.correctAnswer;

    if (correct) {
      await handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  if (!currentPattern) {
    return <div>Loading...</div>;
  }

  return (
    <GameLayout
      gameType="pattern-game"
      onBack={onBack}
      onShowHelp={onShowHelp}
      score={score}
      streak={streak}
      tasksCompleted={tasksCompleted}
      showCelebration={showCelebration}
      gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    >
      <QuestionDisplay question={currentPattern.question}>
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
      </QuestionDisplay>

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
          <OptionGrid
            options={currentPattern.options}
            onSelect={handleAnswer}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={100 + (streak - 1) * 10}
          streak={streak}
          explanation={currentPattern.explanation}
          onNext={handleNext}
          nextButtonText="➡️ Наступний візерунок"
        />
      )}
    </GameLayout>
  );
}
