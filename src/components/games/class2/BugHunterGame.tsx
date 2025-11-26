import { useState, useEffect } from 'react';
import {
  GameProps,
  Challenge,
  GameLayout,
  QuestionDisplay,
  FeedbackSection,
  useGameState,
  useChallengeManager
} from '../../../engine';

interface BugChallenge extends Challenge {
  sequence: string[];
  bugIndex: number;
  correctItem: string;
  category: string;
}

const BUG_LIBRARY: BugChallenge[] = [
  {
    question: "Знайди помилку в числах!",
    sequence: ["1", "2", "4", "4", "5"],
    bugIndex: 2,
    correctItem: "3",
    explanation: "Числа йдуть по порядку: 1, 2, 3, 4, 5. Третє число має бути 3!",
    category: "numbers"
  },
  {
    question: "Яке число неправильне?",
    sequence: ["2", "4", "6", "9", "10"],
    bugIndex: 3,
    correctItem: "8",
    explanation: "Рахуємо двійками: 2, 4, 6, 8, 10. Четверте число має бути 8!",
    category: "numbers"
  },
  {
    question: "Знайди баг у послідовності!",
    sequence: ["10", "9", "8", "6", "6"],
    bugIndex: 3,
    correctItem: "7",
    explanation: "Числа зменшуються: 10, 9, 8, 7, 6. Четверте число має бути 7!",
    category: "numbers"
  },
  {
    question: "Яка буква зайва?",
    sequence: ["А", "Б", "В", "Д", "Ґ"],
    bugIndex: 3,
    correctItem: "Г",
    explanation: "Букви йдуть по порядку: А, Б, В, Г, Ґ. Четверта буква має бути Г!",
    category: "alphabet"
  },
  {
    question: "Знайди помилку в алфавіті!",
    sequence: ["К", "Л", "Н", "Н", "О"],
    bugIndex: 2,
    correctItem: "М",
    explanation: "По порядку: К, Л, М, Н, О. Третя буква має бути М!",
    category: "alphabet"
  },
  {
    question: "Яка фігура порушує візерунок?",
    sequence: ["🔴", "🔵", "🔴", "🔴", "🔴"],
    bugIndex: 3,
    correctItem: "🔵",
    explanation: "Червоний і синій чергуються. Четверта має бути 🔵!",
    category: "colors"
  },
  {
    question: "Знайди зайву фігуру!",
    sequence: ["🟡", "🟡", "🟢", "🟡", "🟡", "🟡"],
    bugIndex: 5,
    correctItem: "🟢",
    explanation: "Два жовтих, потім зелений. Шоста має бути 🟢!",
    category: "colors"
  },
  {
    question: "Яка фігура неправильна?",
    sequence: ["⬛", "⬜", "⬛", "⬛", "⬛"],
    bugIndex: 3,
    correctItem: "⬜",
    explanation: "Чорний і білий чергуються. Четверта має бути ⬜!",
    category: "shapes"
  },
  {
    question: "Знайди помилку!",
    sequence: ["🔺", "🔻", "🔺", "🔻", "🔻"],
    bugIndex: 4,
    correctItem: "🔺",
    explanation: "Трикутники чергуються вгору-вниз. П'ятий має бути 🔺!",
    category: "shapes"
  },
  {
    question: "Яка тваринка зайва?",
    sequence: ["🐱", "🐶", "🐱", "🐱", "🐱"],
    bugIndex: 3,
    correctItem: "🐶",
    explanation: "Котик і песик чергуються. Четверта має бути 🐶!",
    category: "emoji"
  },
  {
    question: "Знайди помилку в їжі!",
    sequence: ["🍎", "🍊", "🍋", "🍎", "🍎", "🍋"],
    bugIndex: 4,
    correctItem: "🍊",
    explanation: "Яблуко, апельсин, лимон повторюються. П'ята має бути 🍊!",
    category: "emoji"
  },
  {
    question: "Яка погода неправильна?",
    sequence: ["☀️", "⛅", "☁️", "☀️", "⛅", "⛅"],
    bugIndex: 5,
    correctItem: "☁️",
    explanation: "Сонце, хмаринка, хмара повторюються. Шоста має бути ☁️!",
    category: "emoji"
  },
  {
    question: "Що не так у розпорядку дня?",
    sequence: ["🌅", "☀️", "🌙", "🌅", "☀️", "☀️"],
    bugIndex: 5,
    correctItem: "🌙",
    explanation: "Ранок, день, вечір повторюються. Шостий має бути 🌙!",
    category: "daily"
  },
  {
    question: "Знайди помилку в рості!",
    sequence: ["🌱", "🌿", "🌳", "🌱", "🌱", "🌳"],
    bugIndex: 4,
    correctItem: "🌿",
    explanation: "Паросток, листочки, дерево. П'ятий має бути 🌿!",
    category: "growing"
  }
];

export default function BugHunterGame({ onBack, onShowHelp, updateScore }: GameProps) {
  const {
    currentChallenge,
    loadNextChallenge
  } = useChallengeManager<BugChallenge>({
    challenges: BUG_LIBRARY,
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
    gameType: 'bug-hunter'
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadNextChallenge();
  }, [loadNextChallenge]);

  const handleNext = () => {
    loadNextChallenge();
    setSelectedIndex(null);
    resetForNewTask();
  };

  const handleSelect = async (index: number) => {
    if (showFeedback || !currentChallenge) return;

    setSelectedIndex(index);
    const correct = index === currentChallenge.bugIndex;

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
    <GameLayout
      gameType="bug-hunter"
      onBack={onBack}
      onShowHelp={onShowHelp}
      score={score}
      streak={streak}
      tasksCompleted={tasksCompleted}
      showCelebration={showCelebration}
      gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
      extraStats={[{ label: 'Знайдено', value: `🐛 ${tasksCompleted}` }]}
      celebrationEmojis="🎉 🐛 🌟"
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '3em', marginBottom: '10px' }}>🔍🐛</div>
      </div>

      <QuestionDisplay
        question={currentChallenge.question}
        subtitle="Натисни на елемент з помилкою!"
      />

      {/* Sequence */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          {currentChallenge.sequence.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showFeedback}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '15px',
                border: showFeedback
                  ? index === currentChallenge.bugIndex
                    ? '4px solid #dc3545'
                    : index === selectedIndex
                      ? '4px solid #ffc107'
                      : '3px solid #e0e0e0'
                  : selectedIndex === index
                    ? '4px solid #667eea'
                    : '3px solid #e0e0e0',
                background: showFeedback
                  ? index === currentChallenge.bugIndex
                    ? '#ffebee'
                    : 'white'
                  : 'white',
                cursor: showFeedback ? 'default' : 'pointer',
                fontSize: '2em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: selectedIndex === index && !showFeedback
                  ? '0 5px 20px rgba(102, 126, 234, 0.4)'
                  : '0 3px 10px rgba(0,0,0,0.1)',
                transform: selectedIndex === index && !showFeedback
                  ? 'scale(1.1)'
                  : 'scale(1)'
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Position numbers */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '10px'
        }}>
          {currentChallenge.sequence.map((_, index) => (
            <div
              key={index}
              style={{
                width: '70px',
                textAlign: 'center',
                fontSize: '0.9em',
                color: showFeedback && index === currentChallenge.bugIndex
                  ? '#dc3545'
                  : '#999',
                fontWeight: showFeedback && index === currentChallenge.bugIndex
                  ? 'bold'
                  : 'normal'
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={100 + (streak - 1) * 10}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={handleNext}
          nextButtonText="➡️ Шукати наступний баг"
        >
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '1.3em',
            marginBottom: '15px'
          }}>
            Правильно: <strong>{currentChallenge.correctItem}</strong> (позиція {currentChallenge.bugIndex + 1})
          </div>
        </FeedbackSection>
      )}
    </GameLayout>
  );
}
