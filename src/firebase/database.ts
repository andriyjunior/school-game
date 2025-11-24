// Database Service Layer for Firestore Operations
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  QueryConstraint,
  Unsubscribe,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import {
  PlayerClass,
  Session,
  GameResult,
  Analytics,
  PlayerStats,
  LiveSession,
  LiveSessionAnswer,
  GameType,
} from '../types';

// ==================== SESSION MANAGEMENT ====================

/**
 * Create a new game session
 */
export const createSession = async (
  playerName: string,
  playerClass: PlayerClass
): Promise<string> => {
  try {
    const sessionRef = await addDoc(collection(db, 'sessions'), {
      playerName,
      playerClass,
      startTime: serverTimestamp(),
      endTime: null,
      totalScore: 0,
      gamesPlayed: [],
      achievementsUnlocked: [],
      maxStreak: 0,
      isActive: true,
    });
    return sessionRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Update session with game result
 */
export const saveGameResult = async (
  sessionId: string,
  gameResult: Partial<GameResult>
): Promise<void> => {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);

    // Also save to separate results collection for easier querying
    await addDoc(collection(db, 'results'), {
      sessionId,
      ...gameResult,
      timestamp: serverTimestamp(),
    });

    // Update session with aggregated data
    await updateDoc(sessionRef, {
      lastActivity: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving game result:', error);
    throw error;
  }
};

/**
 * End a game session
 */
export const endSession = async (
  sessionId: string,
  finalStats: {
    totalScore: number;
    maxStreak: number;
    achievements: string[];
  }
): Promise<void> => {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      endTime: serverTimestamp(),
      isActive: false,
      totalScore: finalStats.totalScore,
      maxStreak: finalStats.maxStreak,
      achievementsUnlocked: finalStats.achievements,
    });
  } catch (error) {
    console.error('Error ending session:', error);
    throw error;
  }
};

// ==================== ADMIN QUERIES ====================

interface SessionFilters {
  playerClass?: PlayerClass;
  playerName?: string;
  limit?: number;
}

/**
 * Get all sessions with optional filters
 */
export const getAllSessions = async (
  filters: SessionFilters = {}
): Promise<Session[]> => {
  try {
    const baseCollection = collection(db, 'sessions');
    const constraints: QueryConstraint[] = [];

    if (filters.playerClass) {
      constraints.push(where('playerClass', '==', filters.playerClass));
    }

    if (filters.playerName) {
      constraints.push(where('playerName', '==', filters.playerName));
    }

    // Always order by start time, newest first
    constraints.push(orderBy('startTime', 'desc'));

    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = constraints.length > 0 ? query(baseCollection, ...constraints) : baseCollection;

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Session[];
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw error;
  }
};

interface ResultFilters {
  gameType?: GameType;
  sessionId?: string;
  limit?: number;
}

/**
 * Get all game results with optional filters
 */
export const getAllResults = async (
  filters: ResultFilters = {}
): Promise<GameResult[]> => {
  try {
    const baseCollection = collection(db, 'results');
    const constraints: QueryConstraint[] = [];

    if (filters.gameType) {
      constraints.push(where('gameType', '==', filters.gameType));
    }

    if (filters.sessionId) {
      constraints.push(where('sessionId', '==', filters.sessionId));
    }

    constraints.push(orderBy('timestamp', 'desc'));

    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = constraints.length > 0 ? query(baseCollection, ...constraints) : baseCollection;

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as GameResult[];
  } catch (error) {
    console.error('Error getting results:', error);
    throw error;
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async (): Promise<Analytics> => {
  try {
    console.log('Fetching analytics data...');
    // Limit queries for better performance
    const sessions = await getAllSessions({ limit: 500 });
    const results = await getAllResults({ limit: 1000 });

    console.log(`Loaded ${sessions.length} sessions and ${results.length} results`);

    // Calculate statistics
    const totalPlayers = new Set(sessions.map((s) => s.playerName)).size;
    const totalSessions = sessions.length;
    const totalGames = results.length;
    const averageScore =
      totalSessions > 0
        ? sessions.reduce((sum, s) => sum + (s.totalScore || 0), 0) / totalSessions
        : 0;

    // Game type distribution
    const gameTypeCounts: { [gameType: string]: number } = {};
    results.forEach((r) => {
      if (r.gameType) {
        gameTypeCounts[r.gameType] = (gameTypeCounts[r.gameType] || 0) + 1;
      }
    });

    // Class distribution
    const classCounts: { [classNumber: string]: number } = {};
    sessions.forEach((s) => {
      if (s.playerClass) {
        classCounts[s.playerClass.toString()] =
          (classCounts[s.playerClass.toString()] || 0) + 1;
      }
    });

    return {
      totalPlayers,
      totalSessions,
      totalGames,
      averageScore: Math.round(averageScore),
      gameTypeCounts,
      classCounts,
      recentSessions: sessions.slice(0, 10),
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

/**
 * Get player statistics
 */
export const getPlayerStats = async (playerName: string): Promise<PlayerStats> => {
  try {
    const sessions = await getAllSessions({ playerName });

    const totalScore = sessions.reduce((sum, s) => sum + (s.totalScore || 0), 0);
    const totalGames = sessions.length;
    const averageScore = totalGames > 0 ? totalScore / totalGames : 0;
    const maxStreak = Math.max(...sessions.map((s) => s.maxStreak || 0));

    // Get all achievements
    const allAchievements = new Set<string>();
    sessions.forEach((s) => {
      (s.achievementsUnlocked || []).forEach((a) => allAchievements.add(a));
    });

    return {
      playerName,
      totalSessions: totalGames,
      totalScore,
      averageScore: Math.round(averageScore),
      maxStreak,
      achievements: Array.from(allAchievements),
      recentSessions: sessions.slice(0, 5),
    };
  } catch (error) {
    console.error('Error getting player stats:', error);
    throw error;
  }
};

// ==================== LIVE SESSIONS (ADMIN) ====================

interface LiveSessionData {
  title: string;
  testId: string;
  playerClass: PlayerClass;
  participants?: string[];
  adminEmail?: string;
}

/**
 * Create a live test session that admin can monitor
 */
export const createLiveSession = async (
  sessionData: LiveSessionData
): Promise<string> => {
  try {
    console.log('Creating live session in Firestore with data:', sessionData);

    const docData = {
      ...sessionData,
      createdAt: serverTimestamp(),
      status: 'active' as const,
      participants: sessionData.participants || [],
      results: {},
      createdBy: sessionData.adminEmail || 'admin',
    };

    console.log('Document data to be saved:', docData);

    const liveSessionRef = await addDoc(collection(db, 'liveSessions'), docData);

    console.log('Live session created successfully in Firestore! ID:', liveSessionRef.id);
    return liveSessionRef.id;
  } catch (error) {
    console.error('Error creating live session:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
};

/**
 * Get all live sessions (including completed and paused)
 */
export const getAllLiveSessions = async (): Promise<LiveSession[]> => {
  try {
    console.log('Fetching all live sessions from Firestore...');

    const querySnapshot = await getDocs(collection(db, 'liveSessions'));
    console.log('Found documents:', querySnapshot.size);

    const allSessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LiveSession[];

    // Sort by creation date (newest first)
    const sortedSessions = allSessions.sort((a, b) => {
      const timeA = a.createdAt?.toDate?.() || new Date(0);
      const timeB = b.createdAt?.toDate?.() || new Date(0);
      return timeB.getTime() - timeA.getTime();
    });

    console.log('All sessions:', sortedSessions);
    return sortedSessions;
  } catch (error) {
    console.error('Error getting all live sessions:', error);
    throw error;
  }
};

/**
 * Get all active live sessions
 */
export const getActiveLiveSessions = async (): Promise<LiveSession[]> => {
  try {
    console.log('Fetching live sessions from Firestore...');

    // Simplified query - get all and filter in memory to avoid index requirement
    const querySnapshot = await getDocs(collection(db, 'liveSessions'));
    console.log('Found documents:', querySnapshot.size);

    const allSessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LiveSession[];

    console.log('All sessions:', allSessions);

    // Filter active sessions and sort
    const activeSessions = allSessions
      .filter((session) => session.status === 'active')
      .sort((a, b) => {
        const timeA = a.createdAt?.toDate?.() || new Date(0);
        const timeB = b.createdAt?.toDate?.() || new Date(0);
        return timeB.getTime() - timeA.getTime();
      });

    console.log('Active sessions:', activeSessions);
    return activeSessions;
  } catch (error) {
    console.error('Error getting active live sessions:', error);
    throw error;
  }
};

/**
 * Get a specific live session
 */
export const getLiveSession = async (
  sessionId: string
): Promise<LiveSession | null> => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    if (sessionDoc.exists()) {
      return {
        id: sessionDoc.id,
        ...sessionDoc.data(),
      } as LiveSession;
    }
    return null;
  } catch (error) {
    console.error('Error getting live session:', error);
    throw error;
  }
};

/**
 * Subscribe to live session updates (real-time)
 */
export const subscribeLiveSession = (
  sessionId: string,
  callback: (session: LiveSession) => void
): Unsubscribe => {
  const sessionRef = doc(db, 'liveSessions', sessionId);
  return onSnapshot(
    sessionRef,
    (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data(),
        } as LiveSession);
      }
    },
    (error) => {
      console.error('Error in live session subscription:', error);
    }
  );
};

/**
 * Update player result in live session
 */
export const updateLiveSessionResult = async (
  sessionId: string,
  playerName: string,
  result: Partial<LiveSessionAnswer>
): Promise<void> => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const data = sessionDoc.data();
      const currentResults = (data.results as DocumentData) || {};

      // Initialize player results if not exists
      if (!currentResults[playerName]) {
        currentResults[playerName] = {
          answers: [],
          score: 0,
          startedAt: serverTimestamp(),
          lastUpdate: serverTimestamp(),
        };
      }

      // Add new answer (use Date instead of serverTimestamp in arrays)
      currentResults[playerName].answers.push({
        ...result,
        timestamp: new Date().toISOString(),
      });

      currentResults[playerName].score =
        (currentResults[playerName].score || 0) + (result.points || 0);
      currentResults[playerName].lastUpdate = serverTimestamp();

      await updateDoc(sessionRef, {
        results: currentResults,
      });
    }
  } catch (error) {
    console.error('Error updating live session result:', error);
    throw error;
  }
};

/**
 * End a live session
 */
export const endLiveSession = async (sessionId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'completed',
      endedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error ending live session:', error);
    throw error;
  }
};

/**
 * Delete a live session
 */
export const deleteLiveSession = async (sessionId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('Error deleting live session:', error);
    throw error;
  }
};

// ==================== SETTINGS MANAGEMENT ====================

export interface AppSettings {
  aiMessagesEnabled: boolean;
  updatedAt?: any;
}

const DEFAULT_SETTINGS: AppSettings = {
  aiMessagesEnabled: false,
};

/**
 * Get application settings
 */
export const getSettings = async (): Promise<AppSettings> => {
  try {
    const settingsRef = doc(db, 'settings', 'app');
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      return settingsDoc.data() as AppSettings;
    }

    // Return default settings if not exists
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Update application settings
 */
export const updateSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    const settingsRef = doc(db, 'settings', 'app');
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

/**
 * Subscribe to settings changes (real-time)
 */
export const subscribeSettings = (
  callback: (settings: AppSettings) => void
): Unsubscribe => {
  const settingsRef = doc(db, 'settings', 'app');
  return onSnapshot(
    settingsRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as AppSettings);
      } else {
        callback(DEFAULT_SETTINGS);
      }
    },
    (error) => {
      console.error('Error in settings subscription:', error);
      callback(DEFAULT_SETTINGS);
    }
  );
};
