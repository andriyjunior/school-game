import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface LoopGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface LoopChallenge {
  question: string;
  code: string;
  loopCount: number;
  action: string;
  options: number[];
  correctAnswer: number;
  explanation: string;
  visual: string[];
}

const LOOP_CHALLENGES: LoopChallenge[] = [
  {
    question: "Скільки разів виконається цикл?",
    code: "повторити 3 рази:\n  намалювати ⭐",
    loopCount: 3,
    action: "намалювати зірку",
    options: [2, 3, 4, 5],
    correctAnswer: 3,
    explanation: "Цикл повторюється 3 рази, тому намалюємо 3 зірки",
    visual: ["⭐", "⭐", "⭐"]
  },
  {
    question: "Що буде результатом цього циклу?",
    code: "повторити 5 разів:\n  додати 🍎",
    loopCount: 5,
    action: "додати яблуко",
    options: [3, 4, 5, 6],
    correctAnswer: 5,
    explanation: "Цикл виконується 5 разів - отримаємо 5 яблук",
    visual: ["🍎", "🍎", "🍎", "🍎", "🍎"]
  },
  {
    question: "Скільки кроків зробить робот?",
    code: "повторити 4 рази:\n  крок вперед ➡️",
    loopCount: 4,
    action: "крок вперед",
    options: [2, 3, 4, 5],
    correctAnswer: 4,
    explanation: "Робот зробить 4 кроки вперед",
    visual: ["➡️", "➡️", "➡️", "➡️"]
  },
  {
    question: "Скільки сердечок буде намальовано?",
    code: "повторити 6 разів:\n  намалювати ❤️",
    loopCount: 6,
    action: "намалювати сердечко",
    options: [4, 5, 6, 7],
    correctAnswer: 6,
    explanation: "Цикл повторюється 6 разів",
    visual: ["❤️", "❤️", "❤️", "❤️", "❤️", "❤️"]
  },
  {
    question: "Скільки разів пролунає дзвіночок?",
    code: "повторити 2 рази:\n  дзвінок 🔔",
    loopCount: 2,
    action: "дзвінок",
    options: [1, 2, 3, 4],
    correctAnswer: 2,
    explanation: "Дзвіночок пролунає 2 рази",
    visual: ["🔔", "🔔"]
  },
  {
    question: "Скільки м'ячиків буде?",
    code: "повторити 7 разів:\n  кинути ⚽",
    loopCount: 7,
    action: "кинути м'яч",
    options: [5, 6, 7, 8],
    correctAnswer: 7,
    explanation: "Цикл виконається 7 разів",
    visual: ["⚽", "⚽", "⚽", "⚽", "⚽", "⚽", "⚽"]
  },
  {
    question: "Скільки квіточок виросте?",
    code: "повторити 4 рази:\n  посадити 🌸",
    loopCount: 4,
    action: "посадити квітку",
    options: [3, 4, 5, 6],
    correctAnswer: 4,
    explanation: "Посадимо 4 квіточки",
    visual: ["🌸", "🌸", "🌸", "🌸"]
  },
  {
    question: "Скільки стрибків зробить кролик?",
    code: "повторити 8 разів:\n  стрибнути 🐰",
    loopCount: 8,
    action: "стрибнути",
    options: [6, 7, 8, 9],
    correctAnswer: 8,
    explanation: "Кролик стрибне 8 разів",
    visual: ["🐰", "🐰", "🐰", "🐰", "🐰", "🐰", "🐰", "🐰"]
  },
  {
    question: "Скільки разів блисне зірка?",
    code: "повторити 10 разів:\n  блиснути ✨",
    loopCount: 10,
    action: "блиснути",
    options: [8, 9, 10, 11],
    correctAnswer: 10,
    explanation: "Зірка блисне 10 разів",
    visual: ["✨", "✨", "✨", "✨", "✨", "✨", "✨", "✨", "✨", "✨"]
  },
  {
    question: "Скільки буде нот?",
    code: "повторити 3 рази:\n  заграти 🎵",
    loopCount: 3,
    action: "заграти ноту",
    options: [2, 3, 4, 5],
    correctAnswer: 3,
    explanation: "Заграємо 3 ноти",
    visual: ["🎵", "🎵", "🎵"]
  }
];

export default function LoopGame({ onBack, onShowHelp, updateScore }: LoopGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<LoopChallenge | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

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
    gameType: 'loop-game'
  });

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const loadNewChallenge = () => {
    const challenge = LOOP_CHALLENGES[Math.floor(Math.random() * LOOP_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    resetForNewTask();
    setShowAnimation(false);
    setAnimationStep(0);
  };

  const handleAnswer = async (answer: number) => {
    if (showFeedback || !currentChallenge) return;

    const correct = answer === currentChallenge.correctAnswer;

    if (correct) {
      setShowAnimation(true);
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setAnimationStep(step);
        if (step >= currentChallenge.loopCount) {
          clearInterval(interval);
        }
      }, 300);

      await handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  if (!currentChallenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="loop-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="loop-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 🔄 🌟" />

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
          // Код програми:
        </div>
        <pre style={{
          color: '#dfe6e9',
          fontSize: '1.3em',
          margin: 0,
          whiteSpace: 'pre-wrap'
        }}>
          {currentChallenge.code}
        </pre>
      </div>

      {/* Answer Options */}
      {!showFeedback && (
        <div>
          <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.1em', textAlign: 'center' }}>
            🎯 Вибери відповідь:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            {currentChallenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '20px',
                  fontSize: '2em',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
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
          points={120 + (streak - 1) * 12}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={loadNewChallenge}
        >
          {/* Visual Animation */}
          {showAnimation && (
            <div style={{
              background: '#f8f9fa',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ color: '#666', marginBottom: '10px' }}>Результат циклу:</div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                fontSize: '2em'
              }}>
                {currentChallenge.visual.map((item, index) => (
                  <span
                    key={index}
                    style={{
                      opacity: index < animationStep ? 1 : 0.2,
                      transition: 'opacity 0.3s',
                      transform: index < animationStep ? 'scale(1)' : 'scale(0.8)'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </FeedbackSection>
      )}
    </div>
  );
}
