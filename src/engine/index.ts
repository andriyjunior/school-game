// Game Engine - Reusable components for building games
export { GameLayout } from './GameLayout';
export { OptionGrid } from './OptionGrid';
export { QuestionDisplay } from './QuestionDisplay';
export { DragDropSequence } from './DragDropSequence';
export { useChallengeManager } from './useChallengeManager';

// Re-export game-ui components for convenience
export {
  useGameState,
  FeedbackSection,
  ActionButton
} from '../components/game-ui';

// Types
export type {
  GameProps,
  GameConfig,
  Challenge,
  OptionChallenge,
  StatItem,
  GameLayoutProps,
  OptionGridProps,
  ChallengeManagerOptions
} from './types';
