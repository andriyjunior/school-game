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

interface LifeSkillTask {
  question: string;
  steps: string[];
  explanation: string;
  category: 'pets' | 'plants' | 'home' | 'hygiene' | 'food';
}

const LIFE_SKILLS_LIBRARY: LifeSkillTask[] = [
  // Pet Care
  {
    question: "🐱 Як правильно нагодувати кота?",
    steps: ["🥫 Взяти миску", "🍖 Відкрити корм", "🥄 Насипати корм у миску", "💧 Налити свіжої води"],
    explanation: "Спочатку готуємо миску, потім відкриваємо корм, насипаємо його і не забуваємо про воду!",
    category: 'pets'
  },
  {
    question: "🐕 Як вивести собаку на прогулянку?",
    steps: ["🦴 Взяти повідець", "👕 Одягти нашийник", "🚪 Відкрити двері", "🏞️ Піти на вулицю"],
    explanation: "Перед прогулянкою треба підготувати повідець, одягти нашийник і тільки тоді виходити.",
    category: 'pets'
  },
  {
    question: "🐹 Як доглянути за хом'ячком?",
    steps: ["🧹 Почистити клітку", "🌾 Насипати свіжу підстилку", "🥕 Покласти їжу", "💧 Налити води"],
    explanation: "Спочатку чистимо клітку, потім додаємо свіжу підстилку, їжу та воду.",
    category: 'pets'
  },
  {
    question: "🐦 Як нагодувати пташку?",
    steps: ["🌾 Взяти зерна", "🍽️ Відкрити клітку обережно", "🥄 Насипати корм", "🔒 Закрити клітку"],
    explanation: "Беремо зерна, обережно відкриваємо клітку, насипаємо корм і закриваємо назад.",
    category: 'pets'
  },
  {
    question: "🐠 Як нагодувати рибок?",
    steps: ["🥫 Взяти корм для рибок", "👀 Подивитись скільки рибок", "🤏 Насипати трішки корму", "⏰ Зачекати поки з'їдять"],
    explanation: "Важливо не перегодовувати рибок - насипаємо трішки і дивимось як вони їдять.",
    category: 'pets'
  },

  // Plant Care
  {
    question: "🌱 Як полити квітку?",
    steps: ["💧 Налити воду в лійку", "👀 Перевірити чи суха земля", "🚿 Полити квітку", "✨ Витерти листочки"],
    explanation: "Спочатку готуємо воду, перевіряємо землю, поливаємо і протираємо листочки від пилу.",
    category: 'plants'
  },
  {
    question: "🌻 Як посадити насіння?",
    steps: ["🪴 Взяти горщик із землею", "👆 Зробити ямку", "🌰 Покласти насіння", "🌊 Полити водою"],
    explanation: "Готуємо горщик, робимо ямку для насіння, садимо його і поливаємо.",
    category: 'plants'
  },
  {
    question: "🌿 Як доглянути за кімнатною рослиною?",
    steps: ["🍂 Зібрати сухе листя", "💧 Перевірити вологість землі", "🌊 Полити якщо треба", "☀️ Поставити на світло"],
    explanation: "Прибираємо сухе листя, перевіряємо чи потрібна вода, поливаємо і ставимо на сонце.",
    category: 'plants'
  },
  {
    question: "🌺 Як пересадити квітку?",
    steps: ["🪴 Підготувати новий горщик", "🌱 Обережно вийняти рослину", "🌍 Насипати свіжої землі", "🌊 Полити після пересадки"],
    explanation: "Готуємо новий горщик, обережно пересаджуємо, додаємо землю і поливаємо.",
    category: 'plants'
  },

  // Home Tasks
  {
    question: "🧹 Як прибрати в кімнаті?",
    steps: ["🧸 Зібрати іграшки", "🧹 Підмести підлогу", "💧 Помити підлогу", "✨ Провітрити кімнату"],
    explanation: "Спочатку прибираємо іграшки, потім підмітаємо, миємо підлогу і провітрюємо.",
    category: 'home'
  },
  {
    question: "🛏️ Як застелити ліжко?",
    steps: ["🫳 Зняти ковдру", "📐 Розправити простирадло", "🛏️ Поправити подушку", "🌟 Акуратно накрити ковдрою"],
    explanation: "Знімаємо ковдру, розправляємо простирадло, поправляємо подушку і накриваємо ковдрою.",
    category: 'home'
  },
  {
    question: "📚 Як прибрати на столі?",
    steps: ["✏️ Зібрати олівці", "📖 Покласти книжки на полицю", "🗑️ Викинути сміття", "🧽 Витерти стіл"],
    explanation: "Збираємо речі, розкладаємо книжки, викидаємо сміття і витираємо стіл.",
    category: 'home'
  },
  {
    question: "👕 Як скласти одяг?",
    steps: ["👔 Розправити одяг", "📐 Акуратно скласти", "👕 Покласти в шафу", "✨ Закрити шафу"],
    explanation: "Розправляємо одяг, акуратно складаємо, кладемо в шафу і закриваємо.",
    category: 'home'
  },

  // Hygiene
  {
    question: "🛁 Як підготуватись до купання?",
    steps: ["👕 Підготувати чистий одяг", "🧴 Взяти мило і шампунь", "🛁 Налити теплу воду", "🧽 Взяти мочалку"],
    explanation: "Готуємо чистий одяг, беремо засоби для миття, наливаємо воду і беремо мочалку.",
    category: 'hygiene'
  },
  {
    question: "🦷 Як доглядати за зубами?",
    steps: ["🪥 Взяти зубну щітку", "🧴 Видавити пасту", "🦷 Почистити зуби 2 хвилини", "💧 Прополоскати рот"],
    explanation: "Беремо щітку, наносимо пасту, чистимо зуби і полощемо рот водою.",
    category: 'hygiene'
  },
  {
    question: "💅 Як доглянути за нігтями?",
    steps: ["🧼 Помити руки", "✂️ Акуратно підстригти нігті", "📁 Підпиляти краї", "🧴 Змазати кремом"],
    explanation: "Спочатку миємо руки, стрижемо нігті, підпилюємо і наносимо крем.",
    category: 'hygiene'
  },

  // Food Preparation
  {
    question: "🥤 Як зробити лимонад?",
    steps: ["🍋 Вичавити лимон", "💧 Налити води", "🍯 Додати цукор", "🥄 Перемішати"],
    explanation: "Вичавлюємо лимон, додаємо воду і цукор, добре перемішуємо.",
    category: 'food'
  },
  {
    question: "🍪 Як приготувати сніданок?",
    steps: ["🍞 Взяти тарілку і хліб", "🧈 Намазати маслом", "🍯 Додати мед", "🥛 Налити молока"],
    explanation: "Готуємо тарілку, намазуємо хліб маслом і медом, наливаємо молоко.",
    category: 'food'
  },
  {
    question: "🥗 Як приготувати фруктовий салат?",
    steps: ["🍎 Помити фрукти", "🔪 Порізати на шматочки", "🥣 Покласти в миску", "🍯 Полити медом"],
    explanation: "Миємо фрукти, ріжемо їх, кладемо в миску і поливаємо медом.",
    category: 'food'
  },
  {
    question: "🧃 Як налити сік?",
    steps: ["🥤 Взяти чисту склянку", "📦 Відкрити пакет соку", "🧃 Обережно налити", "📦 Закрити пакет і поставити в холодильник"],
    explanation: "Беремо склянку, відкриваємо сік, наливаємо і ставимо назад в холодильник.",
    category: 'food'
  }
];

export default function LifeSkillsGame({ onBack, onShowHelp, updateScore }: GameProps) {
  const {
    currentChallenge: currentTask,
    loadNextChallenge
  } = useChallengeManager<LifeSkillTask>({
    challenges: LIFE_SKILLS_LIBRARY,
    avoidRepeatLast: 6
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
    basePoints: 110,
    streakMultiplier: 11,
    gameType: 'life-skills'
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

  // Get category emoji and color
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'pets':
        return { emoji: '🐾', color: '#ff9a9e', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' };
      case 'plants':
        return { emoji: '🌿', color: '#84fab0', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' };
      case 'home':
        return { emoji: '🏠', color: '#a8edea', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' };
      case 'hygiene':
        return { emoji: '✨', color: '#ffecd2', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' };
      case 'food':
        return { emoji: '🍽️', color: '#fbc2eb', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' };
      default:
        return { emoji: '📚', color: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }
  };

  if (!currentTask) {
    return <div>Loading...</div>;
  }

  const categoryStyle = getCategoryStyle(currentTask.category);

  return (
    <GameLayout
      gameType="life-skills"
      onBack={onBack}
      onShowHelp={onShowHelp}
      score={score}
      streak={streak}
      tasksCompleted={tasksCompleted}
      showCelebration={showCelebration}
      gradient={categoryStyle.gradient}
      extraStats={[{ label: 'Зірки', value: `⭐ ${stars}` }]}
    >
      <QuestionDisplay
        question={currentTask.question}
        subtitle={`${categoryStyle.emoji} Крок ${userOrder.length} з ${currentTask.steps.length}`}
        color={categoryStyle.color}
      />

      <DragDropSequence
        availableItems={availableSteps}
        orderedItems={userOrder}
        onItemMove={handleItemMove}
        onItemRemove={handleItemRemove}
        disabled={showFeedback}
        maxItems={currentTask.steps.length}
        gradient={categoryStyle.gradient}
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
            {isCorrect ? '🎉' : '🤔'}
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
            color: isCorrect ? '#28a745' : '#dc3545',
            marginBottom: '10px'
          }}>
            {isCorrect ? 'Чудово! Ти все зробив правильно!' : 'Майже! Спробуй ще раз!'}
          </div>

          {isCorrect && (
            <div style={{
              fontSize: '1.3em',
              color: categoryStyle.color,
              marginBottom: '20px'
            }}>
              +{110 + (streak - 1) * 11} балів! {streak > 1 && `🔥 Серія: ${streak}`}
            </div>
          )}

          {/* Explanation */}
          <div style={{
            background: isCorrect ? '#d4edda' : '#fff3cd',
            border: `2px solid ${isCorrect ? '#28a745' : '#ffc107'}`,
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <h3 style={{
              color: isCorrect ? '#155724' : '#856404',
              fontSize: '1.3em',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {isCorrect ? '✅ Правильна послідовність!' : '💡 Правильна послідовність:'}
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

            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: 'white',
              borderRadius: '10px',
              color: '#333',
              fontSize: '1.05em',
              textAlign: 'center'
            }}>
              💭 {currentTask.explanation}
            </div>
          </div>

          <ActionButton onClick={loadNewTask} variant="success">
            {isCorrect ? '➡️ Наступне завдання' : '🔄 Спробувати знову'}
          </ActionButton>
        </div>
      )}
    </GameLayout>
  );
}
