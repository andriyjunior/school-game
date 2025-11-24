import { useState, useEffect } from 'react';
import { GameType, GameDetails } from '../../../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay,
  ActionButton
} from '../../game-ui';
import { useAIMessages } from '../../../hooks/useAIMessages';

interface Task {
  question: string;
  steps: string[];
  correct: number[];
}

interface AlgorithmGameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
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

export default function AlgorithmGame({ onBack, onShowHelp, updateScore }: AlgorithmGameProps) {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [availableSteps, setAvailableSteps] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const { triggerMotivationalToast } = useAIMessages();

  useEffect(() => {
    loadNewTask();
  }, []);

  const loadNewTask = () => {
    const randomTask = ALL_TASKS[Math.floor(Math.random() * ALL_TASKS.length)];
    const shuffled = [...randomTask.steps].sort(() => Math.random() - 0.5);

    setCurrentTask(randomTask);
    setAvailableSteps(shuffled);
    setUserOrder([]);
    setSelectedSteps([]);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleStepClick = (step: string, index: number) => {
    if (!currentTask) return;

    const newUserOrder = [...userOrder, step];
    const newSelectedSteps = [...selectedSteps, index];
    const newAvailable = availableSteps.filter((_, i) => i !== index);

    setUserOrder(newUserOrder);
    setSelectedSteps(newSelectedSteps);
    setAvailableSteps(newAvailable);

    if (newUserOrder.length === currentTask.steps.length) {
      checkAnswer(newUserOrder);
    }
  };

  const handleRemoveStep = (index: number) => {
    const removedStep = userOrder[index];
    const newUserOrder = userOrder.filter((_, i) => i !== index);
    const newSelectedSteps = selectedSteps.filter((_, i) => i !== index);
    const newAvailable = [...availableSteps, removedStep];

    setUserOrder(newUserOrder);
    setSelectedSteps(newSelectedSteps);
    setAvailableSteps(newAvailable);
  };

  const checkAnswer = (answer: string[]) => {
    if (!currentTask) return;

    const isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(currentTask.steps);

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      const basePoints = 100;
      const streakBonus = streak * 10;
      const totalPoints = basePoints + streakBonus;

      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setTasksCompleted(prev => prev + 1);
      setStars(prev => prev + 1);

      updateScore(totalPoints, {
        gameType: 'algorithm-game',
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

  if (!currentTask) {
    return <div>Loading...</div>;
  }

  return (
    <div className="algorithm-game">
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType="algorithm-game" />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
        extraStats={[{ label: 'Зірки', value: `⭐ ${stars}` }]}
        floating
      />

      <CelebrationOverlay show={showCelebration} />

      {/* Question */}
      <h2 style={{
        textAlign: 'center',
        color: '#667eea',
        fontSize: '1.8em',
        marginBottom: '20px'
      }}>
        {currentTask.question}
      </h2>

      {/* Progress indicator */}
      <div style={{
        textAlign: 'center',
        fontSize: '1.2em',
        color: '#666',
        marginBottom: '20px'
      }}>
        Крок {userOrder.length} з {currentTask.steps.length}
      </div>

      {/* User's selected order */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        minHeight: '120px',
        width: '100%'
      }}>
        <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.2em' }}>
          📋 Твоя послідовність:
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {userOrder.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#999',
              fontSize: '1.1em',
              padding: '20px'
            }}>
              Вибери кроки внизу ⬇️
            </div>
          ) : (
            userOrder.map((step, index) => (
              <div
                key={index}
                onClick={() => !showFeedback && handleRemoveStep(index)}
                style={{
                  background: showFeedback
                    ? (isCorrect ? '#28a745' : '#dc3545')
                    : 'white',
                  color: showFeedback ? 'white' : '#333',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  cursor: showFeedback ? 'default' : 'pointer',
                  border: '3px solid ' + (showFeedback
                    ? (isCorrect ? '#28a745' : '#dc3545')
                    : '#667eea'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '35px',
                  height: '35px',
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1em',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>{step}</div>
                {!showFeedback && (
                  <div style={{ fontSize: '1.3em', color: '#dc3545' }}>✖️</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available steps */}
      {!showFeedback && availableSteps.length > 0 && (
        <div>
          <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.2em' }}>
            🎯 Вибери наступний крок:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {availableSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(step, index)}
                style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '20px',
                  fontSize: '1.2em',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
                }}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
}
