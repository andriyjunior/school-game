import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { subscribeSettings, AppSettings } from '../firebase/database';
import { getPersonalizedMessage, MessageType } from '../services/aiMessages';
import { showToast } from '../store/slices/uiSlice';

interface UseAIMessagesReturn {
  getMessage: (type: MessageType) => Promise<string>;
  triggerMotivationalToast: () => void;
  aiEnabled: boolean;
  loading: boolean;
}

/**
 * Hook to use AI personalized messages in game components
 */
export function useAIMessages(): UseAIMessagesReturn {
  const dispatch = useAppDispatch();
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const taskCountRef = useRef(0);
  const lastToastTimeRef = useRef(0);

  // Get player info from Redux
  const player = useAppSelector((state) => state.player);
  const game = useAppSelector((state) => state.game);

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = subscribeSettings((settings: AppSettings) => {
      setAiEnabled(settings.aiMessagesEnabled);
    });

    return () => unsubscribe();
  }, []);

  // Get message async
  const getMessage = useCallback(async (type: MessageType): Promise<string> => {
    if (!player.name) {
      return '';
    }

    setLoading(true);

    try {
      const { message } = await getPersonalizedMessage(type, {
        playerName: player.name,
        playerClass: player.class || 2,
        gameType: game.currentGame || undefined,
        score: game.totalScore,
        streak: game.streak,
        tasksCompleted: taskCountRef.current,
      }, aiEnabled);

      return message;
    } catch (error) {
      console.error('Error getting AI message:', error);
      return '';
    } finally {
      setLoading(false);
    }
  }, [player.name, player.class, game.currentGame, game.totalScore, game.streak, aiEnabled]);

  // Trigger motivational toast occasionally
  const triggerMotivationalToast = useCallback(async () => {
    taskCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastToast = now - lastToastTimeRef.current;

    // Show toast occasionally:
    // - Every 5th task, OR
    // - After a streak of 3+, OR
    // - Randomly (20% chance) if more than 30 seconds since last
    const shouldShow =
      (taskCountRef.current % 5 === 0) ||
      (game.streak >= 3 && game.streak % 3 === 0) ||
      (timeSinceLastToast > 30000 && Math.random() < 0.2);

    if (shouldShow) {
      const message = await getMessage('encouragement');
      if (message) {
        dispatch(showToast(message));
        lastToastTimeRef.current = now;
      }
    }
  }, [getMessage, game.streak, dispatch]);

  return {
    getMessage,
    triggerMotivationalToast,
    aiEnabled,
    loading,
  };
}

export default useAIMessages;
