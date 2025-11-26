import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  FeedbackSection,
  useGameState
} from '../../game-ui';

interface VariableGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface VariableChallenge {
  setup: string;
  question: string;
  options: (number | string)[];
  correctAnswer: number | string;
  explanation: string;
  variables: Record<string, number | string>;
}

const VARIABLE_CHALLENGES: VariableChallenge[] = [
  {
    setup: 'коробка = 5',
    question: 'Що в коробці?',
    options: [3, 5, 7, 10],
    correctAnswer: 5,
    explanation: 'Ми поклали число 5 у коробку',
    variables: { 'коробка': 5 }
  },
  {
    setup: 'яблука = 3\nяблука = яблука + 2',
    question: 'Скільки яблук?',
    options: [2, 3, 5, 6],
    correctAnswer: 5,
    explanation: 'Спочатку було 3 яблука, додали ще 2: 3 + 2 = 5',
    variables: { 'яблука': 5 }
  },
  {
    setup: 'x = 10\ny = 4\nрезультат = x - y',
    question: 'Чому дорівнює результат?',
    options: [4, 6, 10, 14],
    correctAnswer: 6,
    explanation: 'результат = 10 - 4 = 6',
    variables: { 'x': 10, 'y': 4, 'результат': 6 }
  },
  {
    setup: 'число = 7\nчисло = число * 2',
    question: 'Яке число тепер?',
    options: [7, 9, 14, 21],
    correctAnswer: 14,
    explanation: 'число = 7 * 2 = 14',
    variables: { 'число': 14 }
  },
  {
    setup: 'a = 8\nb = a',
    question: 'Чому дорівнює b?',
    options: [0, 4, 8, 16],
    correctAnswer: 8,
    explanation: 'b копіює значення з a, тому b = 8',
    variables: { 'a': 8, 'b': 8 }
  },
  {
    setup: 'цукерки = 12\nз\'їли = 5\nзалишилось = цукерки - з\'їли',
    question: 'Скільки залишилось?',
    options: [5, 7, 12, 17],
    correctAnswer: 7,
    explanation: 'залишилось = 12 - 5 = 7',
    variables: { 'цукерки': 12, "з'їли": 5, 'залишилось': 7 }
  },
  {
    setup: 'монети = 0\nмонети = монети + 10\nмонети = монети + 5',
    question: 'Скільки монет?',
    options: [5, 10, 15, 20],
    correctAnswer: 15,
    explanation: '0 + 10 = 10, потім 10 + 5 = 15',
    variables: { 'монети': 15 }
  },
  {
    setup: 'птахи = 6\nптахи = птахи - 2\nптахи = птахи + 4',
    question: 'Скільки птахів?',
    options: [4, 6, 8, 10],
    correctAnswer: 8,
    explanation: '6 - 2 = 4, потім 4 + 4 = 8',
    variables: { 'птахи': 8 }
  },
  {
    setup: 'ім\'я = "Тарас"',
    question: 'Що зберігається в змінній ім\'я?',
    options: ['Число', 'Тарас', 'ім\'я', 'Нічого'],
    correctAnswer: 'Тарас',
    explanation: 'У змінну можна зберігати не тільки числа, а й текст',
    variables: { "ім'я": 'Тарас' }
  },
  {
    setup: 'вік = 9\nнаступний_рік = вік + 1',
    question: 'Скільки буде наступного року?',
    options: [8, 9, 10, 11],
    correctAnswer: 10,
    explanation: 'наступний_рік = 9 + 1 = 10',
    variables: { 'вік': 9, 'наступний_рік': 10 }
  }
];

export default function VariableGame({ onBack, onShowHelp, updateScore }: VariableGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<VariableChallenge | null>(null);

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
    gameType: 'variable-game'
  });

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const loadNewChallenge = () => {
    const challenge = VARIABLE_CHALLENGES[Math.floor(Math.random() * VARIABLE_CHALLENGES.length)];
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
    <div className="variable-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="variable-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 📦 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: 'var(--theme-primary)',
        fontSize: '1.3em',
        marginBottom: '15px'
      }}>
        Що зберігається у змінній? 📦
      </h2>

      {/* Code Display */}
      <div style={{
        background: '#1e1e1e',
        padding: '15px 20px',
        borderRadius: '12px',
        marginBottom: '15px',
        maxWidth: '350px',
        margin: '0 auto 15px'
      }}>
        <pre style={{
          color: '#9cdcfe',
          fontSize: '1.1em',
          fontFamily: 'monospace',
          margin: 0,
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}>
          {currentChallenge.setup}
        </pre>
      </div>

      {/* Question Text */}
      <h3 style={{
        textAlign: 'center',
        color: 'var(--theme-primary)',
        fontSize: '1.1em',
        marginBottom: '15px'
      }}>
        {currentChallenge.question}
      </h3>

      {/* Answer Options */}
      {!showFeedback && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
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
                fontSize: '1.3em',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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
          points={100 + (streak - 1) * 10}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={loadNewChallenge}
        />
      )}
    </div>
  );
}
