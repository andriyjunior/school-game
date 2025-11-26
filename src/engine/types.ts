import { GameType, GameDetails } from '../types';
import { ReactNode } from 'react';

export interface GameProps {
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>;
}

export interface GameConfig {
  gameType: GameType;
  basePoints: number;
  streakMultiplier: number;
  celebrationInterval?: number;
  gradient?: string;
  celebrationEmojis?: string;
}

export interface Challenge {
  question: string;
  explanation: string;
}

export interface OptionChallenge extends Challenge {
  options: string[];
  correctAnswer: number;
}

export interface StatItem {
  label: string;
  value: string | number;
}

export interface GameLayoutProps {
  gameType: GameType;
  children: ReactNode;
  onBack: () => void;
  onShowHelp: (gameType: GameType) => void;
  score: number;
  streak: number;
  tasksCompleted: number;
  showCelebration: boolean;
  gradient?: string;
  celebrationEmojis?: string;
  extraStats?: StatItem[];
  floating?: boolean;
}

export interface OptionGridProps<T = string> {
  options: T[];
  onSelect: (option: T, index: number) => void;
  disabled?: boolean;
  columns?: number;
  renderOption?: (option: T, index: number) => ReactNode;
  gradient?: string;
}

export interface ChallengeManagerOptions<T> {
  challenges: T[];
  avoidRepeatLast?: number;
}
