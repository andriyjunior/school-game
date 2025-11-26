import { useEffect, useState } from 'react';
import {
  GameProps,
  GameLayout,
  DragDropSequence,
  FeedbackSection,
  useGameState,
  useChallengeManager,
  QuestionDisplay
} from '../../../engine';

interface FlowchartTask {
  question: string;
  description: string;
  blocks: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const FLOWCHART_LIBRARY: FlowchartTask[] = [
  // Easy - 4 blocks
  {
    question: "📞 Дзвінок по телефону",
    description: "Побудуй блок-схему дзвінка",
    blocks: [
      "🟢 ПОЧАТОК",
      "📱 Взяти телефон",
      "☎️ Набрати номер",
      "💬 Поговорити",
      "📴 Покласти слухавку",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Блок-схема показує послідовність дій при дзвінку. Завжди починається з ПОЧАТОК та закінчується КІНЕЦЬ.",
    difficulty: 'easy'
  },
  {
    question: "🚪 Вихід з класу",
    description: "Створи схему виходу після уроку",
    blocks: [
      "🟢 ПОЧАТОК",
      "📝 Записати домашнє завдання",
      "🎒 Зібрати портфель",
      "🪑 Поставити стілець",
      "👋 Попрощатися",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Лінійна блок-схема - всі дії йдуть по порядку зверху вниз.",
    difficulty: 'easy'
  },
  {
    question: "🖨️ Друк документа",
    description: "Блок-схема друку файлу",
    blocks: [
      "🟢 ПОЧАТОК",
      "📄 Відкрити документ",
      "🖨️ Натиснути 'Друк'",
      "⚙️ Вибрати принтер",
      "✅ Підтвердити",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Кожен прямокутник - це дія (процес). Стрілки показують напрямок виконання.",
    difficulty: 'easy'
  },
  {
    question: "✉️ Відправка листа",
    description: "Схема відправки поштою",
    blocks: [
      "🟢 ПОЧАТОК",
      "✍️ Написати лист",
      "📮 Покласти в конверт",
      "💰 Наклеїти марку",
      "📫 Кинути в поштову скриньку",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Блок-схема допомагає бачити всі кроки процесу від початку до кінця.",
    difficulty: 'easy'
  },

  // Medium - 5-6 blocks
  {
    question: "🥤 Приготування соку",
    description: "Блок-схема приготування напою",
    blocks: [
      "🟢 ПОЧАТОК",
      "🍊 Взяти апельсин",
      "🔪 Розрізати навпіл",
      "💧 Видавити сік",
      "🥤 Налити в склянку",
      "🥄 Додати цукор",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Чим більше кроків, тим детальніша блок-схема. Але послідовність залишається лінійною.",
    difficulty: 'medium'
  },
  {
    question: "🌱 Посадка квітки",
    description: "Створи схему посадки рослини",
    blocks: [
      "🟢 ПОЧАТОК",
      "🪴 Підготувати горщик",
      "🌍 Насипати землю",
      "🕳️ Зробити ямку",
      "🌰 Покласти насіння",
      "🌊 Полити водою",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Блок-схема природного процесу - кожен крок важливий для результату.",
    difficulty: 'medium'
  },
  {
    question: "💾 Збереження файлу",
    description: "Блок-схема збереження документа",
    blocks: [
      "🟢 ПОЧАТОК",
      "📝 Створити документ",
      "⌨️ Написати текст",
      "📁 Вибрати папку",
      "🏷️ Ввести назву",
      "💾 Натиснути 'Зберегти'",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Робота з комп'ютером теж описується блок-схемами - це універсальний спосіб показати алгоритм.",
    difficulty: 'medium'
  },
  {
    question: "🎨 Малювання",
    description: "Схема створення малюнка",
    blocks: [
      "🟢 ПОЧАТОК",
      "📄 Взяти папір",
      "✏️ Намалювати контур",
      "🎨 Вибрати кольори",
      "🖍️ Розфарбувати",
      "✍️ Підписати роботу",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Навіть творчий процес можна описати блок-схемою!",
    difficulty: 'medium'
  },

  // Hard - 7+ blocks
  {
    question: "🧪 Науковий дослід",
    description: "Блок-схема проведення експерименту",
    blocks: [
      "🟢 ПОЧАТОК",
      "📋 Підготувати обладнання",
      "🥼 Одягти захисний фартух",
      "🧴 Налити воду в склянку",
      "🧂 Додати сіль",
      "🥄 Розмішати",
      "👁️ Спостерігати результат",
      "📝 Записати висновки",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Наукові експерименти потребують чіткої послідовності - блок-схема це гарантує!",
    difficulty: 'hard'
  },
  {
    question: "🍕 Приготування піци",
    description: "Детальна схема приготування",
    blocks: [
      "🟢 ПОЧАТОК",
      "🌾 Приготувати тісто",
      "🥫 Відкрити соус",
      "🍅 Намазати соус на тісто",
      "🧀 Покласти сир",
      "🍄 Додати інгредієнти",
      "🔥 Поставити в піч",
      "⏱️ Чекати 15 хвилин",
      "🍽️ Дістати та подати",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Складний рецепт з багатьма кроками - блок-схема допомагає нічого не забути!",
    difficulty: 'hard'
  },
  {
    question: "🚲 Підготовка до поїздки на велосипеді",
    description: "Схема підготовки до велопрогулянки",
    blocks: [
      "🟢 ПОЧАТОК",
      "🚲 Перевірити шини",
      "💨 Підкачати колеса",
      "🔧 Перевірити гальма",
      "🪑 Налаштувати висоту сидіння",
      "🦺 Одягти шолом",
      "🧥 Одягти захист",
      "🗺️ Вибрати маршрут",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Безпека вимагає багато кроків підготовки - блок-схема не дасть щось пропустити!",
    difficulty: 'hard'
  },
  {
    question: "📚 Підготовка до презентації",
    description: "Схема створення доповіді",
    blocks: [
      "🟢 ПОЧАТОК",
      "📖 Вибрати тему",
      "🔍 Знайти інформацію",
      "📝 Написати текст",
      "🖼️ Підібрати картинки",
      "💻 Створити слайди",
      "🎤 Відрепетирувати",
      "👥 Виступити перед класом",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Підготовка презентації - складний процес, блок-схема допоможе організувати роботу.",
    difficulty: 'hard'
  },

  // More easy examples
  {
    question: "🧼 Миття рук",
    description: "Гігієнічна процедура",
    blocks: [
      "🟢 ПОЧАТОК",
      "🚰 Відкрити кран",
      "💧 Змочити руки",
      "🧼 Намилити руки",
      "💦 Змити мило",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Навіть прості повсякденні дії - це алгоритми, які можна показати блок-схемою.",
    difficulty: 'easy'
  },
  {
    question: "📖 Читання книги",
    description: "Процес читання",
    blocks: [
      "🟢 ПОЧАТОК",
      "📚 Взяти книгу",
      "📖 Відкрити на закладці",
      "👀 Читати сторінку",
      "📑 Поставити закладку",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Читання книги - простий лінійний алгоритм.",
    difficulty: 'easy'
  },

  // More medium examples
  {
    question: "🎒 Збори в школу ввечері",
    description: "Підготовка портфеля",
    blocks: [
      "🟢 ПОЧАТОК",
      "📅 Подивитися розклад",
      "📚 Скласти підручники",
      "📓 Скласти зошити",
      "✏️ Перевірити пенал",
      "🥪 Приготувати ланч-бокс",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Організація ввечері допоможе не забути нічого вранці!",
    difficulty: 'medium'
  },
  {
    question: "🏃 Ранкова зарядка",
    description: "Схема фізичних вправ",
    blocks: [
      "🟢 ПОЧАТОК",
      "🙆 Розминка шиї",
      "💪 Розминка рук",
      "🦵 Присідання",
      "🤸 Нахили",
      "🧘 Розтяжка",
      "🔴 КІНЕЦЬ"
    ],
    explanation: "Послідовність вправ - це теж алгоритм для здоров'я!",
    difficulty: 'medium'
  }
];

const DIFFICULTY_GRADIENTS = {
  easy: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  medium: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  hard: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
};

const DIFFICULTY_NAMES = {
  easy: 'Легко',
  medium: 'Середньо',
  hard: 'Складно'
};

export default function FlowchartGame({ onBack, onShowHelp, updateScore }: GameProps) {
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);

  const {
    currentChallenge,
    loadNextChallenge
  } = useChallengeManager<FlowchartTask>({
    challenges: FLOWCHART_LIBRARY,
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
    basePoints: 120,
    streakMultiplier: 12,
    gameType: 'flowchart-builder'
  });

  useEffect(() => {
    loadNextChallenge();
  }, [loadNextChallenge]);

  useEffect(() => {
    if (currentChallenge) {
      // Shuffle blocks except first (START) and last (END)
      const blocks = [...currentChallenge.blocks];
      const start = blocks[0];
      const end = blocks[blocks.length - 1];
      const middle = blocks.slice(1, -1).sort(() => Math.random() - 0.5);

      setAvailableBlocks([start, ...middle, end]);
      setUserOrder([]);
    }
  }, [currentChallenge]);

  const handleItemMove = (fromIndex: number, toIndex: number, fromZone: 'available' | 'ordered') => {
    if (showFeedback) return;

    if (fromZone === 'available') {
      const item = availableBlocks[fromIndex];
      const newAvailable = availableBlocks.filter((_, i) => i !== fromIndex);
      const newOrdered = [...userOrder];
      newOrdered.splice(toIndex, 0, item);

      setAvailableBlocks(newAvailable);
      setUserOrder(newOrdered);

      // Auto-check when all blocks are placed
      if (newOrdered.length === currentChallenge!.blocks.length) {
        setTimeout(() => checkAnswer(newOrdered), 300);
      }
    } else {
      // Reordering within ordered zone
      const newOrdered = [...userOrder];
      const [movedItem] = newOrdered.splice(fromIndex, 1);
      newOrdered.splice(toIndex, 0, movedItem);
      setUserOrder(newOrdered);
    }
  };

  const handleItemRemove = (index: number) => {
    if (showFeedback) return;

    const removedItem = userOrder[index];
    setUserOrder(userOrder.filter((_, i) => i !== index));
    setAvailableBlocks([...availableBlocks, removedItem]);
  };

  const checkAnswer = async (order: string[]) => {
    if (!currentChallenge) return;

    const correct = order.every((block, index) => block === currentChallenge.blocks[index]);

    if (correct) {
      await handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  const handleNext = () => {
    loadNextChallenge();
    resetForNewTask();
  };

  if (!currentChallenge) {
    return <div>Завантаження...</div>;
  }

  const gradient = DIFFICULTY_GRADIENTS[currentChallenge.difficulty];
  const difficultyName = DIFFICULTY_NAMES[currentChallenge.difficulty];

  // Custom render function for flowchart blocks
  const renderFlowchartBlock = (block: string) => {
    const isStart = block.includes('ПОЧАТОК');
    const isEnd = block.includes('КІНЕЦЬ');

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        {isStart && (
          <div style={{
            width: '100%',
            padding: '12px',
            background: '#4caf50',
            color: 'white',
            borderRadius: '25px',
            fontWeight: 'bold',
            textAlign: 'center',
            border: '3px solid #2e7d32'
          }}>
            {block}
          </div>
        )}
        {isEnd && (
          <div style={{
            width: '100%',
            padding: '12px',
            background: '#f44336',
            color: 'white',
            borderRadius: '25px',
            fontWeight: 'bold',
            textAlign: 'center',
            border: '3px solid #c62828'
          }}>
            {block}
          </div>
        )}
        {!isStart && !isEnd && (
          <div style={{
            width: '100%',
            padding: '12px',
            background: '#2196f3',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            textAlign: 'center',
            border: '3px solid #1565c0'
          }}>
            {block}
          </div>
        )}
      </div>
    );
  };

  return (
    <GameLayout
      gameType="flowchart-builder"
      onBack={onBack}
      onShowHelp={onShowHelp}
      score={score}
      streak={streak}
      tasksCompleted={tasksCompleted}
      showCelebration={showCelebration}
      gradient={gradient}
      extraStats={[{ label: 'Складність', value: `⭐ ${difficultyName}` }]}
    >
      <QuestionDisplay
        question={currentChallenge.question}
        subtitle={currentChallenge.description}
        color="#2196f3"
      />

      {!showFeedback && (
        <div style={{ marginTop: '20px' }}>
          <DragDropSequence
            availableItems={availableBlocks}
            orderedItems={userOrder}
            onItemMove={handleItemMove}
            onItemRemove={handleItemRemove}
            disabled={showFeedback}
            maxItems={currentChallenge.blocks.length}
            gradient={gradient}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            emptyMessage="Перетягни блоки блок-схеми сюди ⬆️"
            promptMessage="📊 Блоки блок-схеми (розстав їх у правильному порядку):"
          />
        </div>
      )}

      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={120 + (streak - 1) * 12}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={handleNext}
          nextButtonText="➡️ Наступна блок-схема"
        >
          {isCorrect && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              borderRadius: '12px',
              border: '2px solid #2196f3'
            }}>
              <div style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#0d47a1', marginBottom: '15px' }}>
                ✅ Правильна блок-схема:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                {currentChallenge.blocks.map((block, index) => (
                  <div key={index} style={{ width: '100%', maxWidth: '400px' }}>
                    {renderFlowchartBlock(block)}
                    {index < currentChallenge.blocks.length - 1 && (
                      <div style={{ textAlign: 'center', fontSize: '1.5em', color: '#2196f3', margin: '5px 0' }}>
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'white',
                borderRadius: '8px',
                fontSize: '0.95em',
                color: '#0d47a1'
              }}>
                💡 <strong>Запам'ятай:</strong> Блок-схема завжди має ПОЧАТОК (овал зелений),
                ПРОЦЕСИ (прямокутники сині) та КІНЕЦЬ (овал червоний). Стрілки показують напрямок виконання.
              </div>
            </div>
          )}
        </FeedbackSection>
      )}
    </GameLayout>
  );
}
