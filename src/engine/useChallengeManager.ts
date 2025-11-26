import { useState, useCallback, useRef } from 'react';
import { ChallengeManagerOptions } from './types';

export function useChallengeManager<T>(options: ChallengeManagerOptions<T>) {
  const { challenges, avoidRepeatLast = 3 } = options;
  const [currentChallenge, setCurrentChallenge] = useState<T | null>(null);
  const recentIndicesRef = useRef<number[]>([]);

  const getNextChallenge = useCallback(() => {
    if (challenges.length === 0) return null;

    if (challenges.length <= avoidRepeatLast) {
      // Not enough challenges to avoid repeats, just pick random
      const index = Math.floor(Math.random() * challenges.length);
      setCurrentChallenge(challenges[index]);
      return challenges[index];
    }

    // Find an index that's not in recent history
    let attempts = 0;
    let index: number;

    do {
      index = Math.floor(Math.random() * challenges.length);
      attempts++;
    } while (recentIndicesRef.current.includes(index) && attempts < 20);

    // Update recent indices
    recentIndicesRef.current.push(index);
    if (recentIndicesRef.current.length > avoidRepeatLast) {
      recentIndicesRef.current.shift();
    }

    const challenge = challenges[index];
    setCurrentChallenge(challenge);
    return challenge;
  }, [challenges, avoidRepeatLast]);

  const loadNextChallenge = useCallback(() => {
    return getNextChallenge();
  }, [getNextChallenge]);

  return {
    currentChallenge,
    loadNextChallenge,
    setCurrentChallenge
  };
}
