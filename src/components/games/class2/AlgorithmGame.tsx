import { useState, useEffect } from 'react';
import {
  GameProps,
  GameLayout,
  QuestionDisplay,
  DragDropSequence,
  ActionButton,
  useGameState,
  useChallengeManager
} from '../../../engine';

interface Task {
  question: string;
  steps: string[];
  correct: number[];
}

const TASK_LIBRARY: Record<string, Task[]> = {
  daily: [
    {
      question: "📅 Як правильно почати день?",
      steps: ["😴 Прокинутись", "🛏️ Встати з ліжка", "🦷 Почистити зуби", "🥐 Поснідати"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🌙 Як правильно лягти спати?",
      steps: ["👕 Одягти піжаму", "🦷 Почистити зуби", "📖 Почитати книжку", "😴 Лягти в ліжко"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🎒 Як зібратись до школи?",
      steps: ["👕 Одягтись", "🎒 Зібрати рюкзак", "🥪 Взяти снідок", "👋 Попрощатись"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🧼 Як правильно помити руки?",
      steps: ["💧 Змочити руки", "🧼 Намилити милом", "💦 Змити мило", "🧻 Витерти рушником"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🚗 Як безпечно перейти дорогу?",
      steps: ["👀 Подивитись наліво", "👀 Подивитись направо", "🚶 Переконатись що безпечно", "➡️ Перейти дорогу"],
      correct: [0, 1, 2, 3]
    }
  ],
  cooking: [
    {
      question: "🥪 Як зробити бутерброд?",
      steps: ["🍞 Взяти хліб", "🧈 Намазати маслом", "🧀 Покласти сир", "🍅 Додати помідор"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🥗 Як приготувати салат?",
      steps: ["🥒 Помити овочі", "🔪 Порізати овочі", "🥗 Покласти в миску", "🧂 Посолити і перемішати"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🍝 Як зварити макарони?",
      steps: ["💧 Налити воду в каструлю", "🔥 Поставити на вогонь", "🍝 Кинути макарони", "⏰ Варити 10 хвилин"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🥞 Як спекти млинці?",
      steps: ["🥣 Замісити тісто", "🔥 Розігріти сковороду", "🥄 Налити тісто", "⏰ Смажити з двох сторін"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🧃 Як зробити сік?",
      steps: ["🍊 Взяти фрукти", "🔪 Порізати фрукти", "🔨 Вичавити сік", "🥤 Налити в склянку"],
      correct: [0, 1, 2, 3]
    }
  ],
  nature: [
    {
      question: "🌱 Як виростити квітку?",
      steps: ["🌰 Посадити насіння", "💧 Поливати водою", "☀️ Поставити на сонце", "🌸 Дочекатись квітки"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🦋 Як метелик з'являється?",
      steps: ["🥚 Яйце", "🐛 Гусениця", "🛏️ Кокон", "🦋 Метелик"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🌳 Як росте дерево?",
      steps: ["🌰 Насіння в землі", "🌱 Паросток", "🌿 Молоде дерево", "🌳 Велике дерево"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🐣 Як курча з'являється?",
      steps: ["🥚 Яйце", "🔥 Висиджування", "🐣 Дзьоб проклюнувся", "🐥 Курчатко вилупилось"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "☔ Як утворюється дощ?",
      steps: ["☀️ Сонце гріє воду", "💨 Пара піднімається", "☁️ Утворюються хмари", "☔ Випадає дощ"],
      correct: [0, 1, 2, 3]
    }
  ],
  school: [
    {
      question: "✏️ Як зробити завдання?",
      steps: ["📖 Прочитати умову", "🤔 Подумати над розв'язком", "✍️ Написати відповідь", "✅ Перевірити"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🎨 Як намалювати картину?",
      steps: ["📝 Намалювати олівцем", "🎨 Підготувати фарби", "🖌️ Розфарбувати", "⭐ Показати вчителю"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "📚 Як підготуватись до уроку?",
      steps: ["📖 Прочитати параграф", "📝 Виписати головне", "🤔 Вивчити матеріал", "✅ Повторити перед уроком"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🧮 Як розв'язати задачу?",
      steps: ["📖 Прочитати умову", "🎯 Зрозуміти що треба знайти", "➕ Виконати дії", "✍️ Записати відповідь"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "📐 Як накреслити фігуру?",
      steps: ["📏 Взяти лінійку", "✏️ Поставити олівець", "📐 Провести лінії", "✅ Перевірити розміри"],
      correct: [0, 1, 2, 3]
    }
  ],
  fun: [
    {
      question: "⚽ Як забити гол?",
      steps: ["👀 Знайти м'яч", "🏃 Підбігти до м'яча", "🦶 Вдарити по м'ячу", "🥅 М'яч у воротах!"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🎂 Як святкувати день народження?",
      steps: ["🎈 Прикрасити кімнату", "👥 Запросити друзів", "🎂 Задути свічки", "🎁 Розпакувати подарунки"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🏖️ Як підготуватись до пляжу?",
      steps: ["👙 Одягти купальник", "🧴 Взяти сонцезахист", "🏖️ Прийти на пляж", "🏊 Плавати в морі"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🎮 Як пограти в гру?",
      steps: ["🎮 Включити консоль", "🎯 Вибрати гру", "🕹️ Почати грати", "🏆 Виграти!"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🎬 Як подивитись мультфільм?",
      steps: ["📺 Включити телевізор", "🎬 Вибрати мультфільм", "🍿 Взяти попкорн", "😊 Насолоджуватись"],
      correct: [0, 1, 2, 3]
    }
  ],
  patterns: [
    {
      question: "🎨 Як намалювати будинок?",
      steps: ["📐 Намалювати квадрат", "🔺 Додати дах", "🚪 Намалювати двері", "🪟 Додати вікна"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🎵 Як вивчити пісню?",
      steps: ["👂 Послухати пісню", "📝 Запам'ятати слова", "🎤 Співати з музикою", "⭐ Виступити перед друзями"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🧩 Як скласти пазл?",
      steps: ["📦 Висипати деталі", "🔍 Знайти кутові частини", "🧩 З'єднати деталі", "🖼️ Завершити картинку"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🎁 Як загорнути подарунок?",
      steps: ["📄 Взяти папір", "📦 Покласти подарунок", "✂️ Загорнути і склеїти", "🎀 Прикрасити бантиком"],
      correct: [0, 1, 2, 3]
    },
    {
      question: "🏃 Як підготуватись до забігу?",
      steps: ["👟 Одягти кросівки", "🤸 Зробити розминку", "🏁 Стати на старт", "🏃 Почати біг"],
      correct: [0, 1, 2, 3]
    }
  ]
};

const ALL_TASKS = Object.values(TASK_LIBRARY).flat();

export default function AlgorithmGame({ onBack, onShowHelp, updateScore }: GameProps) {
  const {
    currentChallenge: currentTask,
    loadNextChallenge
  } = useChallengeManager<Task>({
    challenges: ALL_TASKS,
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
    gameType: 'algorithm-game'
  });

  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [availableSteps, setAvailableSteps] = useState<string[]>([]);
  const [stars, setStars] = useState<number>(0);

  useEffect(() => {
    loadNewTask();
  }, []);

  const loadNewTask = () => {
    const task = loadNextChallenge();
    if (!task) return;

    const shuffled = [...task.steps].sort(() => Math.random() - 0.5);

    setAvailableSteps(shuffled);
    setUserOrder([]);
    resetForNewTask();
  };

  const handleItemMove = (fromIndex: number, toIndex: number, fromZone: 'available' | 'ordered') => {
    if (!currentTask) return;

    if (fromZone === 'available') {
      // Moving from available to ordered
      const item = availableSteps[fromIndex];
      const newAvailable = availableSteps.filter((_, i) => i !== fromIndex);
      const newOrdered = [...userOrder];
      newOrdered.splice(toIndex, 0, item);

      setAvailableSteps(newAvailable);
      setUserOrder(newOrdered);

      // Check answer if all steps are placed
      if (newOrdered.length === currentTask.steps.length) {
        checkAnswer(newOrdered);
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
    const removedStep = userOrder[index];
    const newUserOrder = userOrder.filter((_, i) => i !== index);
    const newAvailable = [...availableSteps, removedStep];

    setUserOrder(newUserOrder);
    setAvailableSteps(newAvailable);
  };

  const checkAnswer = async (answer: string[]) => {
    if (!currentTask) return;

    const isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(currentTask.steps);

    if (isAnswerCorrect) {
      setStars(prev => prev + 1);
      await handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  if (!currentTask) {
    return <div>Loading...</div>;
  }

  return (
    <GameLayout
      gameType="algorithm-game"
      onBack={onBack}
      onShowHelp={onShowHelp}
      score={score}
      streak={streak}
      tasksCompleted={tasksCompleted}
      showCelebration={showCelebration}
      gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
      extraStats={[{ label: 'Зірки', value: `⭐ ${stars}` }]}
    >
      <QuestionDisplay
        question={currentTask.question}
        subtitle={`Крок ${userOrder.length} з ${currentTask.steps.length}`}
      />

      <DragDropSequence
        availableItems={availableSteps}
        orderedItems={userOrder}
        onItemMove={handleItemMove}
        onItemRemove={handleItemRemove}
        disabled={showFeedback}
        maxItems={currentTask.steps.length}
        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        emptyMessage="Перетягни кроки сюди ⬆️"
        promptMessage="🎯 Доступні кроки (перетягни їх вверх):"
      />

      {/* Feedback */}
      {showFeedback && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{
            fontSize: '4em',
            marginBottom: '15px',
            animation: 'bounce 1s ease'
          }}>
            {isCorrect ? '🎉' : '😔'}
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
            color: isCorrect ? '#28a745' : '#dc3545',
            marginBottom: '10px'
          }}>
            {isCorrect ? 'Чудово!' : 'Спробуй ще раз!'}
          </div>

          {isCorrect && (
            <div style={{
              fontSize: '1.3em',
              color: '#667eea',
              marginBottom: '20px'
            }}>
              +{100 + (streak - 1) * 10} балів! {streak > 1 && `🔥 Серія: ${streak}`}
            </div>
          )}

          {/* Explanation */}
          <div style={{
            background: isCorrect ? '#d4edda' : '#f8d7da',
            border: `2px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <h3 style={{
              color: isCorrect ? '#155724' : '#721c24',
              fontSize: '1.3em',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {isCorrect ? '✅ Правильна послідовність!' : '❌ Правильна послідовність:'}
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {currentTask.steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '12px 15px',
                    borderRadius: '10px',
                    fontSize: '1.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: !isCorrect && userOrder[index] !== step ? '2px solid #dc3545' : '2px solid transparent'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    background: isCorrect ? '#28a745' : (userOrder[index] === step ? '#28a745' : '#dc3545'),
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, color: '#333' }}>{step}</div>
                </div>
              ))}
            </div>
            {!isCorrect && (
              <div style={{
                marginTop: '15px',
                padding: '12px',
                background: '#fff3cd',
                borderRadius: '10px',
                color: '#856404',
                fontSize: '1.1em',
                textAlign: 'center'
              }}>
                💡 Подумай, що має бути спочатку, а що потім!
              </div>
            )}
          </div>

          <ActionButton onClick={loadNewTask} variant="success">
            {isCorrect ? '➡️ Наступне завдання' : '🔄 Спробувати знову'}
          </ActionButton>
        </div>
      )}
    </GameLayout>
  );
}
