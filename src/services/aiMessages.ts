import axios from 'axios';

export type MessageType =
  | 'greeting'
  | 'encouragement'
  | 'correct_answer'
  | 'wrong_answer'
  | 'streak_bonus'
  | 'achievement'
  | 'hint';

interface MessageContext {
  playerName: string;
  playerClass: number;
  gameType?: string;
  score?: number;
  streak?: number;
  tasksCompleted?: number;
  isCorrect?: boolean;
}

// Game descriptions for context-aware messages
const gameDescriptions: Record<string, string> = {
  'algorithm-game': 'складання алгоритмів та послідовностей',
  'binary-game': 'двійкове кодування з лампочками',
  'pattern-game': 'пошук візерунків та закономірностей',
  'bug-hunter': 'пошук помилок у коді',
  'life-skills': 'життєві навички та послідовності дій',
  'sequence-game': 'пошук закономірностей у числах та буквах',
  'maze-game': 'програмування руху робота лабіринтом',
  'variable-game': 'робота зі змінними та значеннями',
  'comparison-game': 'порівняння чисел та виразів',
  'memory-code-game': 'запам\'ятовування послідовностей коду',
  'loop-game': 'цикли та повторення команд',
  'condition-game': 'умовні оператори якщо-тоді-інакше',
  'sorting-game': 'сортування та впорядкування',
  'linear-algorithm': 'побудова лінійних алгоритмів',
  'algorithm-types': 'розпізнавання типів алгоритмів',
  'flowchart-builder': 'створення блок-схем алгоритмів'
};

// Game-specific encouragement messages
const gameSpecificMessages: Record<string, string[]> = {
  'algorithm-game': [
    '{name}, ти чудово складаєш алгоритми! Логіка - твоя сила!',
    'Відмінна послідовність, {name}! Ти думаєш як справжній програміст!',
    '{name}, твої алгоритми стають все кращими! Так тримати!',
  ],
  'binary-game': [
    '{name}, ти вже розумієш двійковий код! Круто!',
    'Лампочки слухаються тебе, {name}! 💡',
    '{name}, 1 і 0 - твої друзі! Чудова робота!',
  ],
  'pattern-game': [
    '{name}, у тебе гострий зір на візерунки!',
    'Ти знаходиш закономірності як детектив, {name}!',
    '{name}, твоя увага до деталей вражає!',
  ],
  'bug-hunter': [
    '{name}, ти справжній мисливець на помилки! 🐛',
    'Жодна помилка не сховається від тебе, {name}!',
    '{name}, ти налагоджуєш код як професіонал!',
  ],
  'life-skills': [
    '{name}, ти чудово знаєш, як робити справи у правильному порядку!',
    'Відмінна організація, {name}! Ти стаєш дуже самостійним!',
    '{name}, твоє розуміння життєвих навичок вражає! 🏠',
    'Ти вмієш планувати свої дії, {name}! Це дуже важливо!',
  ],
  'loop-game': [
    '{name}, ти розумієш цикли! Це важливий навик!',
    'Повторення - твоя суперсила, {name}!',
    '{name}, цикли підкоряються тобі!',
  ],
  'condition-game': [
    '{name}, ти чудово розумієш умови! Якщо-тоді-інакше - легко!',
    'Логічне мислення - твоя сила, {name}!',
    '{name}, ти приймаєш правильні рішення!',
  ],
  'sorting-game': [
    '{name}, ти відмінно сортуєш! Порядок - це важливо!',
    'Все на своїх місцях завдяки тобі, {name}!',
    '{name}, ти впорядковуєш як справжній майстер!',
  ],
  'sequence-game': [
    '{name}, ти бачиш закономірності як справжній математик!',
    'Чудове логічне мислення, {name}!',
    '{name}, послідовності підкоряються тобі!',
  ],
  'maze-game': [
    '{name}, ти чудово програмуєш робота!',
    'Твій робот завжди знаходить шлях, {name}!',
    '{name}, ти справжній навігатор!',
  ],
  'variable-game': [
    '{name}, ти вже розумієш змінні! Це важливо!',
    'Коробки зі значеннями слухаються тебе, {name}!',
    '{name}, ти зберігаєш дані як справжній програміст!',
  ],
  'comparison-game': [
    '{name}, ти порівнюєш як калькулятор! Точно!',
    'Більше, менше, дорівнює - легко для тебе, {name}!',
    '{name}, твоя точність вражає!',
  ],
  'memory-code-game': [
    '{name}, у тебе чудова пам\'ять!',
    'Ти запам\'ятовуєш код як справжній хакер, {name}!',
    '{name}, твій мозок - суперкомп\'ютер!',
  ],
  'linear-algorithm': [
    '{name}, ти чудово будуєш лінійні алгоритми! Крок за кроком до успіху!',
    'Відмінна послідовність, {name}! Ти мислиш як справжній алгоритміст!',
    '{name}, твої алгоритми ідеально логічні! Так тримати!',
  ],
  'algorithm-types': [
    '{name}, ти відмінно розрізняєш типи алгоритмів!',
    'Лінійний, розгалужений чи циклічний - {name} знає відповідь!',
    '{name}, ти експерт з типів алгоритмів! Браво!',
  ],
  'flowchart-builder': [
    '{name}, твої блок-схеми чудові! Ти справжній графічний програміст!',
    'Відмінна робота з блоками, {name}! Початок → Процес → Кінець!',
    '{name}, ти будуєш блок-схеми як професіонал!',
  ]
};

interface AIMessageResponse {
  message: string;
  cached: boolean;
}

// Cache for messages to reduce API calls
const messageCache = new Map<string, string>();

// Fallback messages when AI is disabled or fails
// Ukrainian-appropriate motivational messages for children
const fallbackMessages: Record<MessageType, string[]> = {
  greeting: [
    '{name}, раді тебе бачити! Готовий до нових знань?',
    'Привіт, {name}! Сьогодні чудовий день для навчання!',
    '{name}, ти молодець що прийшов! Погнали!',
  ],
  encouragement: [
    '{name}, кожна спроба робить тебе розумнішим!',
    'Не здавайся, {name}! Ти вже так багато знаєш!',
    '{name}, твоя наполегливість - це справжня сила!',
    'Пам\'ятай, {name}: помилки - це сходинки до успіху!',
    '{name}, вірю в тебе! Ти впораєшся!',
    'Кожне завдання - це нова можливість, {name}!',
    '{name}, ти робиш прогрес! Так тримати!',
    'Навчання - це подорож, {name}. Насолоджуйся нею!',
  ],
  correct_answer: [
    'Чудово, {name}!',
    'Правильно!',
    'Так тримати!',
  ],
  wrong_answer: [
    'Спробуй ще!',
    'Подумай ще трішки!',
    'Майже вдалося!',
  ],
  streak_bonus: [
    '{name}, ти в ударі! Продовжуй!',
    'Чудова серія, {name}!',
    '{name}, ти просто вогонь!',
  ],
  achievement: [
    '{name}, ти досяг нового рівня!',
    'Вітаємо з досягненням, {name}!',
    '{name}, твоя праця винагороджена!',
  ],
  hint: [
    'Придивись уважніше...',
    'Подумай логічно...',
    'Згадай, що ти вже знаєш...',
  ],
};

/**
 * Get a personalized message using AI or fallback
 */
export async function getPersonalizedMessage(
  type: MessageType,
  context: MessageContext,
  aiEnabled: boolean = false
): Promise<AIMessageResponse> {
  // Create cache key
  const cacheKey = `${type}_${context.playerName}_${context.streak || 0}`;

  // Check cache first
  if (messageCache.has(cacheKey)) {
    return {
      message: messageCache.get(cacheKey)!,
      cached: true
    };
  }

  // If AI is disabled, use fallback
  if (!aiEnabled) {
    const message = getRandomFallbackMessage(type, context);
    return { message, cached: false };
  }

  // Try AI generation
  try {
    const message = await generateAIMessage(type, context);
    messageCache.set(cacheKey, message);
    return { message, cached: false };
  } catch (error) {
    console.error('AI message generation failed:', error);
    const message = getRandomFallbackMessage(type, context);
    return { message, cached: false };
  }
}

/**
 * Generate message using OpenAI API
 */
async function generateAIMessage(type: MessageType, context: MessageContext): Promise<string> {
  const corsProxy = 'https://corsproxy.io/?';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const prompt = buildPrompt(type, context);

  const response = await axios.post(
    corsProxy + encodeURIComponent(apiUrl),
    {
      model: 'gpt-4o-mini',
      max_tokens: 100,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `Ти дружній асистент в освітній грі для дітей ${context.playerClass} класу.
Відповідай українською мовою. Будь позитивним, веселим та підбадьорливим.
Використовуй емодзі. Тримай відповіді короткими (1-2 речення).`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      }
    }
  );

  return response.data.choices[0].message.content.trim();
}

/**
 * Build prompt for AI based on message type
 */
function buildPrompt(type: MessageType, context: MessageContext): string {
  const { playerName, score, streak, tasksCompleted } = context;

  switch (type) {
    case 'greeting':
      return `Привітай учня на ім'я ${playerName} коротко і весело.`;

    case 'encouragement':
      const gameDesc = context.gameType ? gameDescriptions[context.gameType] : null;
      const gameContext = gameDesc ? ` Вони грають у гру про ${gameDesc}.` : '';
      return `Підбадьори учня ${playerName}.${gameContext} Вони виконали ${tasksCompleted || 0} завдань і мають ${score || 0} балів. Згадай контекст гри у повідомленні.`;

    case 'correct_answer':
      return `Похвали ${playerName} за правильну відповідь. Їх серія: ${streak || 1}.`;

    case 'wrong_answer':
      return `Підбадьори ${playerName} після неправильної відповіді. Мотивуй спробувати ще раз.`;

    case 'streak_bonus':
      return `${playerName} має серію з ${streak} правильних відповідей! Похвали за досягнення.`;

    case 'achievement':
      return `${playerName} отримав нове досягнення! Набрано ${score} балів. Вітай!`;

    case 'hint':
      return `Дай загальну підказку ${playerName}, не розкриваючи відповідь. Будь загадковим.`;

    default:
      return `Скажи щось приємне ${playerName}.`;
  }
}

/**
 * Get random fallback message with name substitution
 */
function getRandomFallbackMessage(type: MessageType, context: MessageContext): string {
  let messages = fallbackMessages[type] || fallbackMessages.encouragement;

  // Use game-specific messages for encouragement if available
  if (type === 'encouragement' && context.gameType && gameSpecificMessages[context.gameType]) {
    // 70% chance to use game-specific message, 30% generic
    if (Math.random() < 0.7) {
      messages = gameSpecificMessages[context.gameType];
    }
  }

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return randomMessage
    .replace(/{name}/g, context.playerName)
    .replace(/{streak}/g, String(context.streak || 0))
    .replace(/{score}/g, String(context.score || 0));
}

/**
 * Clear message cache
 */
export function clearMessageCache() {
  messageCache.clear();
}

/**
 * Get multiple messages at once (batch)
 */
export async function getPersonalizedMessages(
  types: MessageType[],
  context: MessageContext,
  aiEnabled: boolean = false
): Promise<Record<MessageType, string>> {
  const results: Record<string, string> = {};

  await Promise.all(
    types.map(async (type) => {
      const { message } = await getPersonalizedMessage(type, context, aiEnabled);
      results[type] = message;
    })
  );

  return results as Record<MessageType, string>;
}
