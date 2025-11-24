import { useState, useRef, useEffect } from 'react';
import { GameDetails, GameType } from '../../types';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { subscribeSettings, AppSettings } from '../../firebase/database';
import { getPersonalizedMessage } from '../../services/aiMessages';
import { showToast } from '../../store/slices/uiSlice';

interface UseGameStateOptions {
  basePoints: number;
  streakMultiplier: number;
  gameType: GameType;
}

export function useGameState(
  updateScore: (points: number, gameDetails?: GameDetails) => Promise<void>,
  options: UseGameStateOptions
) {
  const { basePoints, streakMultiplier, gameType } = options;
  const dispatch = useAppDispatch();

  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  const taskCountRef = useRef(0);
  const lastToastTimeRef = useRef(0);

  const player = useAppSelector((state) => state.player);
  const game = useAppSelector((state) => state.game);

  // Subscribe to AI settings
  useEffect(() => {
    const unsubscribe = subscribeSettings((settings: AppSettings) => {
      setAiEnabled(settings.aiMessagesEnabled);
    });
    return () => unsubscribe();
  }, []);

  const triggerMotivationalToast = async () => {
    taskCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastToast = now - lastToastTimeRef.current;

    const shouldShow =
      (taskCountRef.current % 5 === 0) ||
      (streak >= 3 && streak % 3 === 0) ||
      (timeSinceLastToast > 30000 && Math.random() < 0.2);

    if (shouldShow && player.name) {
      const { message } = await getPersonalizedMessage('encouragement', {
        playerName: player.name,
        playerClass: player.class || 2,
        gameType: game.currentGame || undefined,
        score: game.totalScore,
        streak,
        tasksCompleted: taskCountRef.current,
      }, aiEnabled);

      if (message) {
        dispatch(showToast(message));
        lastToastTimeRef.current = now;
      }
    }
  };

  const handleCorrectAnswer = async () => {
    const totalPoints = basePoints + streak * streakMultiplier;

    setScore(prev => prev + totalPoints);
    setStreak(prev => prev + 1);
    setTasksCompleted(prev => prev + 1);
    setIsCorrect(true);
    setShowFeedback(true);

    await updateScore(totalPoints, {
      gameType,
      points: totalPoints,
      correct: true
    });

    // Trigger motivational toast occasionally
    triggerMotivationalToast();

    if ((tasksCompleted + 1) % 5 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }

    return totalPoints;
  };

  const handleIncorrectAnswer = () => {
    setStreak(0);
    setIsCorrect(false);
    setShowFeedback(true);
  };

  const resetForNewTask = () => {
    setShowFeedback(false);
    setIsCorrect(null);
  };

  return {
    showFeedback,
    isCorrect,
    score,
    streak,
    tasksCompleted,
    showCelebration,
    handleCorrectAnswer,
    handleIncorrectAnswer,
    resetForNewTask
  };
}
