# Game Engine

A reusable game engine for building educational games with consistent UI/UX patterns.

## Overview

The game engine provides a set of components, hooks, and utilities that eliminate boilerplate code and ensure consistency across games. It handles:

- ✅ Common UI layout (header, score display, celebrations)
- ✅ State management (score, streak, feedback)
- ✅ Challenge randomization and history
- ✅ Answer validation and scoring
- ✅ AI-powered motivational messages
- ✅ Progress tracking and celebrations

## Core Components

### GameLayout

Wraps all common UI elements for consistent game structure.

```typescript
import { GameLayout } from '../../../engine';

<GameLayout
  gameType="your-game"
  onBack={onBack}
  onShowHelp={onShowHelp}
  score={score}
  streak={streak}
  tasksCompleted={tasksCompleted}
  showCelebration={showCelebration}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  celebrationEmojis="🎉 🌟 🎊"
  extraStats={[{ label: 'Custom', value: '⭐ 10' }]}
>
  {/* Your game content */}
</GameLayout>
```

**Props:**
- `gameType`: GameType - identifies the game
- `onBack`: () => void - back button handler
- `onShowHelp`: (gameType: GameType) => void - help button handler
- `score`: number - current score
- `streak`: number - current streak
- `tasksCompleted`: number - tasks completed
- `showCelebration`: boolean - show celebration overlay
- `gradient`: string (optional) - custom gradient for score display
- `celebrationEmojis`: string (optional) - custom emojis for celebration
- `extraStats`: StatItem[] (optional) - additional stats to display
- `floating`: boolean (optional, default: true) - floating score display

### QuestionDisplay

Displays questions with optional subtitles and custom content.

```typescript
import { QuestionDisplay } from '../../../engine';

<QuestionDisplay
  question="What comes next?"
  subtitle="Choose the correct answer"
  color="#667eea"
>
  {/* Custom content like patterns, sequences, etc. */}
</QuestionDisplay>
```

### OptionGrid

Displays answer options in a responsive grid.

```typescript
import { OptionGrid } from '../../../engine';

<OptionGrid
  options={['Option 1', 'Option 2', 'Option 3', 'Option 4']}
  onSelect={(option, index) => handleAnswer(option, index)}
  disabled={showFeedback}
  columns={2}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  renderOption={(option) => <div>{option}</div>} // optional
/>
```

**Props:**
- `options`: T[] - array of options
- `onSelect`: (option: T, index: number) => void - selection handler
- `disabled`: boolean (optional) - disable interaction
- `columns`: number (optional, default: 2) - grid columns
- `gradient`: string (optional) - button gradient
- `renderOption`: (option: T, index: number) => ReactNode (optional) - custom renderer
- `buttonStyle`: React.CSSProperties (optional) - custom button styles

### DragDropSequence

**NEW!** Interactive drag-and-drop component for sequencing tasks. Perfect for teaching logical ordering and step-by-step thinking. Supports both mouse and touch events for tablets and mobile devices.

```typescript
import { DragDropSequence } from '../../../engine';

<DragDropSequence
  availableItems={['Step 1', 'Step 2', 'Step 3']}
  orderedItems={userSequence}
  onItemMove={handleItemMove}
  onItemRemove={handleRemoveItem}
  disabled={showFeedback}
  maxItems={3}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  showFeedback={showFeedback}
  isCorrect={isCorrect}
  emptyMessage="Drag steps here ⬆️"
  promptMessage="🎯 Available steps (drag them up):"
/>
```

**Props:**
- `availableItems`: string[] - items available to be dragged
- `orderedItems`: string[] - items currently in the sequence
- `onItemMove`: (fromIndex: number, toIndex: number, fromZone: 'available' | 'ordered') => void - handle item movement
- `onItemRemove`: (index: number) => void (optional) - handle removing item from sequence (click on ordered item)
- `disabled`: boolean (optional) - disable drag interaction
- `maxItems`: number (optional) - maximum items allowed in sequence
- `gradient`: string (optional) - gradient for available items
- `showFeedback`: boolean (optional) - show feedback state
- `isCorrect`: boolean | null (optional) - feedback correctness
- `emptyMessage`: string (optional) - message when sequence is empty
- `promptMessage`: string (optional) - prompt for available items
- `enableSwap`: boolean (optional, default: true) - enable auto-swap when dragging over items

**Features:**
- ✨ Full drag-and-drop support (mouse & touch)
- 📱 Mobile/tablet friendly with touch events
- ⚡ **Ultra-responsive live swapping** - items swap positions nearly instantly as you drag over them (10ms debounce)
- 🎯 Real-time visual feedback - see where items will land before dropping
- ↕️ Continuous reordering while hovering - items dynamically rearrange as you move through the list
- 🖱️ **Clear drag preview** - dragged item follows cursor with dashed border and elevated shadow
- ❌ Click to remove items (returns to available pool)
- 🎨 Rich visual feedback during dragging:
  - Pulsing animation on drop zones
  - Shimmer effect when dragging over
  - Scale and rotation transforms
  - Smooth spring-like transitions (250ms default)
  - `willChange` optimization for smooth performance
- 💫 Drop zone highlighting with glow effect
- 🚫 Max items enforcement
- 🎪 **Fast, visible swap animations** (300ms):
  - ⬆️ **Directional animations** - items move up/down 20px based on swap direction
  - ✨ **Sparkle effects** - stars and sparkles appear during swap (✨⭐💫)
  - 🌟 **Glowing shadows** - dramatic shadow effects during animation
  - 🎭 **Multi-stage animation** - scale (1.0 → 1.08), translate, and fade effects
  - 🔄 **Clearly visible movement** - items visibly move 20px up/down during swap
  - ⏱️ **Snappy 300ms animation** - fast enough to feel responsive, slow enough to see clearly
- 🎨 Hover effects with scale and rotation
- 🎯 Drag handle indicator (⋮⋮)
- 🔢 Number badges that rotate on hover
- ♿ Smooth cubic-bezier transitions for natural, elastic feel

**Usage Example:**

```typescript
const handleItemMove = (fromIndex: number, toIndex: number, fromZone: 'available' | 'ordered') => {
  if (fromZone === 'available') {
    // Moving from available to ordered
    const item = availableSteps[fromIndex];
    const newAvailable = availableSteps.filter((_, i) => i !== fromIndex);
    const newOrdered = [...userOrder];
    newOrdered.splice(toIndex, 0, item);

    setAvailableSteps(newAvailable);
    setUserOrder(newOrdered);

    // Auto-check when all items placed
    if (newOrdered.length === maxItems) {
      checkAnswer(newOrdered);
    }
  } else {
    // Reordering/swapping within ordered zone
    // This handles both manual reordering and auto-swap
    const newOrdered = [...userOrder];
    const [movedItem] = newOrdered.splice(fromIndex, 1);
    newOrdered.splice(toIndex, 0, movedItem);
    setUserOrder(newOrdered);
  }
};

const handleRemoveItem = (index: number) => {
  const removedItem = userOrder[index];
  setUserOrder(userOrder.filter((_, i) => i !== index));
  setAvailableSteps([...availableSteps, removedItem]);
};
```

**How Swap Works:**

When `enableSwap={true}` (default), dragging an ordered item over another ordered item will **nearly instantly** swap their positions (with a minimal 10ms debounce to prevent duplicate triggers). This creates an ultra-responsive, fluid experience where children see items rearranging in real-time as they drag over them. The swap triggers:

1. **Ultra-fast swap** - Items exchange positions within 10ms of hovering
2. **Snappy directional animation** - Items visibly move up/down with a fast 300ms animation:
   - Dragging down → item moves down 20px, displaced item moves up 20px
   - Dragging up → item moves up 20px, displaced item moves down 20px
3. **Clear visual effects** during swap:
   - ✨ Quick sparkles appear (✨⭐💫) with 300ms animation
   - 🌟 Glowing purple shadows (0-40px glow)
   - 📏 Scale changes (1.0 → 1.08 → 1.0)
   - 🎨 Opacity fades (1.0 → 0.6 → 1.0) for emphasis
   - 🔄 Smooth movements visible at 20px displacement
   - 🎯 Elevated z-index (999) to appear on top
4. **Index update** - Dragged item index updates to follow it
5. **Continuous live feedback** - No need to drop - items rearrange dynamically as you hover
6. **Smooth transitions** - All items have 250ms transitions with `willChange` optimization

This makes reordering highly intuitive and responsive - children can **see** and **feel** items moving out of the way instantly with clear visual feedback. The drag preview follows the cursor, and the list continuously rearranges as you move through it!

### FeedbackSection

Displays feedback after answer submission (already available from game-ui).

```typescript
import { FeedbackSection } from '../../../engine';

<FeedbackSection
  isCorrect={isCorrect}
  points={points}
  streak={streak}
  explanation="The correct answer is..."
  onNext={loadNextChallenge}
  nextButtonText="➡️ Next Challenge"
>
  {/* Optional custom content */}
</FeedbackSection>
```

### ActionButton

Styled button component (already available from game-ui).

```typescript
import { ActionButton } from '../../../engine';

<ActionButton onClick={handleClick} variant="success">
  Click Me
</ActionButton>
```

Variants: `primary`, `secondary`, `success`, `danger`

## Hooks

### useGameState

Manages all game state including score, streak, feedback, and celebrations.

```typescript
import { useGameState } from '../../../engine';

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
  gameType: 'your-game'
});

// When user answers correctly
await handleCorrectAnswer();

// When user answers incorrectly
handleIncorrectAnswer();

// When loading next challenge
resetForNewTask();
```

**Features:**
- Automatically calculates points (basePoints + streak * multiplier)
- Triggers celebrations every 5 tasks
- Shows AI motivational messages
- Persists score to Firebase

### useChallengeManager

Manages challenge selection with smart randomization to avoid recent repeats.

```typescript
import { useChallengeManager } from '../../../engine';

interface MyChallenge {
  question: string;
  answer: string;
}

const {
  currentChallenge,
  loadNextChallenge
} = useChallengeManager<MyChallenge>({
  challenges: CHALLENGE_LIBRARY,
  avoidRepeatLast: 5 // avoid repeating last 5 challenges
});

// Load first challenge
useEffect(() => {
  loadNextChallenge();
}, [loadNextChallenge]);

// Load next challenge
loadNextChallenge();
```

## Type Definitions

### GameProps

Standard props interface for all games.

```typescript
import { GameProps } from '../../../engine';

export default function MyGame({ onBack, onShowHelp, updateScore }: GameProps) {
  // ...
}
```

### Challenge Interfaces

```typescript
// Base challenge
interface Challenge {
  question: string;
  explanation: string;
}

// Option-based challenge
interface OptionChallenge extends Challenge {
  options: string[];
  correctAnswer: number;
}

// Create custom challenge types
interface MyChallenge extends Challenge {
  // your custom fields
}
```

### GameConfig

Configuration object for games.

```typescript
interface GameConfig {
  gameType: GameType;
  basePoints: number;
  streakMultiplier: number;
  celebrationInterval?: number;
  gradient?: string;
  celebrationEmojis?: string;
}
```

## Complete Example: Simple Quiz Game

```typescript
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

interface QuizChallenge extends OptionChallenge {
  category: string;
}

const CHALLENGES: QuizChallenge[] = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    explanation: "2 + 2 = 4",
    category: "math"
  },
  // more challenges...
];

export default function QuizGame({ onBack, onShowHelp, updateScore }: GameProps) {
  const {
    currentChallenge,
    loadNextChallenge
  } = useChallengeManager<QuizChallenge>({
    challenges: CHALLENGES,
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
    gameType: 'quiz-game'
  });

  useEffect(() => {
    loadNextChallenge();
  }, [loadNextChallenge]);

  const handleNext = () => {
    loadNextChallenge();
    resetForNewTask();
  };

  const handleAnswer = async (_option: string, answerIndex: number) => {
    if (showFeedback || !currentChallenge) return;

    const correct = answerIndex === currentChallenge.correctAnswer;

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
      gameType="quiz-game"
      onBack={onBack}
      onShowHelp={onShowHelp}
      score={score}
      streak={streak}
      tasksCompleted={tasksCompleted}
      showCelebration={showCelebration}
      gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <QuestionDisplay question={currentChallenge.question} />

      {!showFeedback && (
        <OptionGrid
          options={currentChallenge.options}
          onSelect={handleAnswer}
        />
      )}

      {showFeedback && (
        <FeedbackSection
          isCorrect={isCorrect!}
          points={100 + (streak - 1) * 10}
          streak={streak}
          explanation={currentChallenge.explanation}
          onNext={handleNext}
        />
      )}
    </GameLayout>
  );
}
```

## Migration Guide

### From Old Pattern to Engine

**Before:**
```typescript
const [score, setScore] = useState(0);
const [streak, setStreak] = useState(0);
const [showFeedback, setShowFeedback] = useState(false);
// ... lots of state management

<div className="my-game">
  <GameHeader ... />
  <ScoreDisplay ... />
  <CelebrationOverlay ... />
  {/* game content */}
</div>
```

**After:**
```typescript
const { score, streak, showFeedback, handleCorrectAnswer, handleIncorrectAnswer }
  = useGameState(updateScore, { basePoints: 100, streakMultiplier: 10, gameType: 'my-game' });

<GameLayout gameType="my-game" score={score} streak={streak} ...>
  {/* game content */}
</GameLayout>
```

## Benefits

1. **Less Boilerplate**: ~50-100 lines of code saved per game
2. **Consistency**: All games look and behave similarly
3. **Maintainability**: Bug fixes and improvements apply to all games
4. **Type Safety**: Full TypeScript support
5. **Flexibility**: Can still customize when needed
6. **Smart Randomization**: Avoids repeating recent challenges
7. **Better UX**: Consistent scoring, celebrations, and feedback

## Refactored Games

The following class 2 games have been refactored to use the engine:

- ✅ **PatternGame** - Uses OptionGrid for answer selection
- ✅ **AlgorithmGame** - Uses DragDropSequence for interactive step ordering ✨
- ✅ **BugHunterGame** - Custom bug-finding interface
- ✅ **LifeSkillsGame** - Uses DragDropSequence for life skills sequencing ✨

**NEW: Drag & Drop Support with Live Swapping!** Both `AlgorithmGame` and `LifeSkillsGame` now use the enhanced `DragDropSequence` component with:

- 🎯 **Drag-and-drop** - Intuitive interaction for children
- 🔄 **Live swapping** - Items swap positions as you drag over them
- ✨ **Rich animations** - Smooth, playful transitions and effects
- 📱 **Touch support** - Works perfectly on tablets and iPads
- 🎨 **Visual feedback** - Pulsing, shimmer, and glow effects

This creates a much more engaging and intuitive experience than clicking buttons. Children can see and manipulate items as if they were physical objects!

These serve as reference implementations for migrating other games.

## Future Enhancements

Potential additions to the engine:

- Sound effects system
- Animation library
- Progress persistence across sessions
- Difficulty scaling
- Accessibility improvements (keyboard nav, screen readers)
- Analytics/telemetry hooks
- Multiplayer support
- Achievement system
