import { ReactNode } from 'react';
import { GameType } from '../types';
import {
  GameHeader,
  ScoreDisplay,
  CelebrationOverlay
} from '../components/game-ui';
import { StatItem } from './types';

interface GameLayoutProps {
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
  className?: string;
}

export function GameLayout({
  gameType,
  children,
  onBack,
  onShowHelp,
  score,
  streak,
  tasksCompleted,
  showCelebration,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  celebrationEmojis,
  extraStats,
  floating = true,
  className
}: GameLayoutProps) {
  return (
    <div className={className || gameType}>
      <GameHeader onBack={onBack} onShowHelp={onShowHelp} gameType={gameType} />

      <ScoreDisplay
        score={score}
        streak={streak}
        tasksCompleted={tasksCompleted}
        gradient={gradient}
        extraStats={extraStats}
        floating={floating}
      />

      <CelebrationOverlay
        show={showCelebration}
        emojis={celebrationEmojis}
      />

      {children}
    </div>
  );
}
