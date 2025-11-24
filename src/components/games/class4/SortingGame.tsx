import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  ActionButton
} from '../../game-ui';
import { useAIMessages } from '../../../hooks/useAIMessages';

interface SortingGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

interface SortChallenge {
  type: 'numbers' | 'letters' | 'words' | 'sizes';
  items: (string | number)[];
  question: string;
  sortOrder: 'asc' | 'desc';
}

const SORT_CHALLENGES: SortChallenge[] = [
  { type: 'numbers', items: [5, 2, 8, 1, 9], question: "Відсортуй числа від найменшого до найбільшого", sortOrder: 'asc' },
  { type: 'numbers', items: [15, 3, 22, 7, 11], question: "Розстав числа за зростанням", sortOrder: 'asc' },
  { type: 'numbers', items: [100, 45, 78, 23, 56], question: "Впорядкуй від меншого до більшого", sortOrder: 'asc' },
  { type: 'numbers', items: [33, 11, 55, 22, 44], question: "Відсортуй числа за зростанням", sortOrder: 'asc' },
  { type: 'numbers', items: [3, 9, 1, 7, 4], question: "Відсортуй числа від найбільшого до найменшого", sortOrder: 'desc' },
  { type: 'numbers', items: [25, 50, 10, 35, 5], question: "Розстав числа за спаданням", sortOrder: 'desc' },
  { type: 'numbers', items: [88, 12, 45, 67, 23], question: "Впорядкуй від більшого до меншого", sortOrder: 'desc' },
  { type: 'letters', items: ['Г', 'А', 'В', 'Б', 'Ґ'], question: "Розстав букви за алфавітом", sortOrder: 'asc' },
  { type: 'letters', items: ['К', 'И', 'М', 'Л', 'Й'], question: "Впорядкуй букви за абеткою", sortOrder: 'asc' },
  { type: 'letters', items: ['П', 'Н', 'Р', 'О', 'С'], question: "Відсортуй букви за алфавітом", sortOrder: 'asc' },
  { type: 'words', items: ['кіт', 'слон', 'їжак', 'ведмідь', 'лев'], question: "Відсортуй слова від найкоротшого до найдовшого", sortOrder: 'asc' },
  { type: 'words', items: ['дім', 'школа', 'клас', 'комп\'ютер', 'миша'], question: "Розстав слова за довжиною (коротші спочатку)", sortOrder: 'asc' },
  { type: 'sizes', items: ['🐜', '🐁', '🐱', '🐕', '🐘'], question: "Розстав тварин від найменшої до найбільшої", sortOrder: 'asc' },
  { type: 'sizes', items: ['🌰', '🍎', '🍉', '🎃', '🏠'], question: "Впорядкуй від найменшого до найбільшого", sortOrder: 'asc' },
];

export default function SortingGame({ onBack, onShowHelp, updateScore }: SortingGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<SortChallenge | null>(null);
  const [userOrder, setUserOrder] = useState<(string | number)[]>([]);
  const [availableItems, setAvailableItems] = useState<(string | number)[]>([]);
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
    const challenge = SORT_CHALLENGES[Math.floor(Math.random() * SORT_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    const shuffled = [...challenge.items].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setUserOrder([]);
    setShowFeedback(false);
    setIsCorrect(null);
  };

  const handleItemClick = (item: string | number, index: number) => {
    if (showFeedback) return;
    setUserOrder([...userOrder, item]);
    setAvailableItems(availableItems.filter((_, i) => i !== index));
  };

  const handleRemoveItem = (index: number) => {
    if (showFeedback) return;
    const removedItem = userOrder[index];
    setUserOrder(userOrder.filter((_, i) => i !== index));
    setAvailableItems([...availableItems, removedItem]);
  };

  const checkAnswer = () => {
    if (!currentChallenge || userOrder.length !== currentChallenge.items.length) return;

    let correctOrder: (string | number)[];

    if (currentChallenge.type === 'numbers') {
      correctOrder = [...currentChallenge.items].sort((a, b) =>
        currentChallenge.sortOrder === 'asc' ? (a as number) - (b as number) : (b as number) - (a as number)
      );
    } else if (currentChallenge.type === 'letters') {
      correctOrder = [...currentChallenge.items].sort((a, b) =>
        currentChallenge.sortOrder === 'asc'
          ? (a as string).localeCompare(b as string, 'uk')
          : (b as string).localeCompare(a as string, 'uk')
      );
    } else if (currentChallenge.type === 'words') {
      correctOrder = [...currentChallenge.items].sort((a, b) =>
        currentChallenge.sortOrder === 'asc'
          ? (a as string).length - (b as string).length
          : (b as string).length - (a as string).length
      );
    } else {
      correctOrder = currentChallenge.sortOrder === 'asc'
        ? [...currentChallenge.items]
        : [...currentChallenge.items].reverse();
    }

    const correct = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const basePoints = 150;
      const streakBonus = streak * 15;
      const totalPoints = basePoints + streakBonus;

      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setTasksCompleted(prev => prev + 1);

      updateScore(totalPoints, {
        gameType: 'sorting-game',
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
    <div className="sorting-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="sorting-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        floating
      />

      <CelebrationOverlay show={showCelebration} emojis="🎉 📊 🌟" />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: '#667eea',
        fontSize: '1.6em',
        marginBottom: '20px'
      }}>
        {currentChallenge.question}
      </h2>

      {/* User's sorted order */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        minHeight: '100px',
        width: '100%'
      }}>
        <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.1em' }}>
          📋 Твій порядок:
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center'
        }}>
          {userOrder.length === 0 ? (
            <div style={{ color: '#999', fontSize: '1.1em', padding: '20px' }}>
              Вибери елементи знизу ⬇️
            </div>
          ) : (
            userOrder.map((item, index) => (
              <div
                key={index}
                onClick={() => !showFeedback && handleRemoveItem(index)}
                style={{
                  background: showFeedback
                    ? (isCorrect ? '#28a745' : '#dc3545')
                    : '#667eea',
                  color: 'white',
                  padding: '15px 20px',
                  borderRadius: '10px',
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  cursor: showFeedback ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s'
                }}
              >
                <span style={{
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7em'
                }}>
                  {index + 1}
                </span>
                {item}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available items */}
      {!showFeedback && availableItems.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.1em', textAlign: 'center' }}>
            🎯 Вибери наступний:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {availableItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item, index)}
                style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 25px',
                  fontSize: '1.5em',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Check button */}
      {!showFeedback && userOrder.length === currentChallenge.items.length && (
        <div style={{ textAlign: 'center' }}>
          <ActionButton onClick={checkAnswer} variant="success">
            ✅ Перевірити
          </ActionButton>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '4em', marginBottom: '15px', animation: 'bounce 1s ease' }}>
            {isCorrect ? '🎉' : '😔'}
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
            color: isCorrect ? '#28a745' : '#dc3545',
            marginBottom: '10px'
          }}>
            {isCorrect ? 'Правильно!' : 'Спробуй ще!'}
          </div>

          {isCorrect && (
            <div style={{ fontSize: '1.3em', color: '#667eea', marginBottom: '20px' }}>
              +{150 + (streak - 1) * 15} балів! {streak > 1 && `🔥 Серія: ${streak}`}
            </div>
          )}

          <ActionButton onClick={loadNewChallenge} variant="success">
            ➡️ Наступне завдання
          </ActionButton>
        </div>
      )}
    </div>
  );
}
