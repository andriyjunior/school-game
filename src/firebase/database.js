// Database Service Layer for Firestore Operations
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';

// ==================== SESSION MANAGEMENT ====================

/**
 * Create a new game session
 * @param {string} playerName - Player's name
 * @param {number} playerClass - Player's class (2 or 4)
 * @returns {Promise<string>} - Session ID
 */
export const createSession = async (playerName, playerClass) => {
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
      isActive: true
    });
    return sessionRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Update session with game result
 * @param {string} sessionId - Session ID
 * @param {object} gameResult - Game result data
 */
export const saveGameResult = async (sessionId, gameResult) => {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);

    // Also save to separate results collection for easier querying
    await addDoc(collection(db, 'results'), {
      sessionId,
      ...gameResult,
      timestamp: serverTimestamp()
    });

    // Update session with aggregated data
    // Note: In production, you'd fetch current data first, but for simplicity:
    await updateDoc(sessionRef, {
      lastActivity: serverTimestamp()
    });

  } catch (error) {
    console.error('Error saving game result:', error);
    throw error;
  }
};

/**
 * End a game session
 * @param {string} sessionId - Session ID
 * @param {object} finalStats - Final statistics
 */
export const endSession = async (sessionId, finalStats) => {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      endTime: serverTimestamp(),
      isActive: false,
      totalScore: finalStats.totalScore,
      maxStreak: finalStats.maxStreak,
      achievementsUnlocked: finalStats.achievements
    });
  } catch (error) {
    console.error('Error ending session:', error);
    throw error;
  }
};

// ==================== ADMIN QUERIES ====================

/**
 * Get all sessions with optional filters
 * @param {object} filters - Filter options
 * @returns {Promise<Array>} - Array of sessions
 */
export const getAllSessions = async (filters = {}) => {
  try {
    let q = collection(db, 'sessions');
    const constraints = [];

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

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw error;
  }
};

/**
 * Get all game results with optional filters
 * @param {object} filters - Filter options
 * @returns {Promise<Array>} - Array of results
 */
export const getAllResults = async (filters = {}) => {
  try {
    let q = collection(db, 'results');
    const constraints = [];

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

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting results:', error);
    throw error;
  }
};

/**
 * Get analytics data
 * @returns {Promise<object>} - Analytics summary
 */
export const getAnalytics = async () => {
  try {
    console.log('Fetching analytics data...');
    // Limit queries for better performance
    const sessions = await getAllSessions({ limit: 500 });
    const results = await getAllResults({ limit: 1000 });

    console.log(`Loaded ${sessions.length} sessions and ${results.length} results`);

    // Calculate statistics
    const totalPlayers = new Set(sessions.map(s => s.playerName)).size;
    const totalSessions = sessions.length;
    const totalGames = results.length;
    const averageScore = totalSessions > 0
      ? sessions.reduce((sum, s) => sum + (s.totalScore || 0), 0) / totalSessions
      : 0;

    // Game type distribution
    const gameTypeCounts = {};
    results.forEach(r => {
      if (r.gameType) {
        gameTypeCounts[r.gameType] = (gameTypeCounts[r.gameType] || 0) + 1;
      }
    });

    // Class distribution
    const classCounts = {};
    sessions.forEach(s => {
      if (s.playerClass) {
        classCounts[s.playerClass] = (classCounts[s.playerClass] || 0) + 1;
      }
    });

    return {
      totalPlayers,
      totalSessions,
      totalGames,
      averageScore: Math.round(averageScore),
      gameTypeCounts,
      classCounts,
      recentSessions: sessions.slice(0, 10)
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

/**
 * Get player statistics
 * @param {string} playerName - Player name
 * @returns {Promise<object>} - Player stats
 */
export const getPlayerStats = async (playerName) => {
  try {
    const sessions = await getAllSessions({ playerName });

    const totalScore = sessions.reduce((sum, s) => sum + (s.totalScore || 0), 0);
    const totalGames = sessions.length;
    const averageScore = totalGames > 0 ? totalScore / totalGames : 0;
    const maxStreak = Math.max(...sessions.map(s => s.maxStreak || 0));

    // Get all achievements
    const allAchievements = new Set();
    sessions.forEach(s => {
      (s.achievementsUnlocked || []).forEach(a => allAchievements.add(a));
    });

    return {
      playerName,
      totalSessions: totalGames,
      totalScore,
      averageScore: Math.round(averageScore),
      maxStreak,
      achievements: Array.from(allAchievements),
      recentSessions: sessions.slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting player stats:', error);
    throw error;
  }
};

// ==================== LIVE SESSIONS (ADMIN) ====================

/**
 * Create a live game session that admin can monitor
 * @param {object} sessionData - Session configuration
 * @returns {Promise<string>} - Live session ID
 */
export const createLiveSession = async (sessionData) => {
  try {
    console.log('Creating live session in Firestore with data:', sessionData);

    const docData = {
      ...sessionData,
      createdAt: serverTimestamp(),
      status: 'active', // active, paused, completed
      participants: sessionData.participants || [], // array of player names or 'all'
      results: {}, // map of playerName -> their results
      createdBy: sessionData.adminEmail || 'admin'
    };

    console.log('Document data to be saved:', docData);

    const liveSessionRef = await addDoc(collection(db, 'liveSessions'), docData);

    console.log('Live session created successfully in Firestore! ID:', liveSessionRef.id);
    return liveSessionRef.id;
  } catch (error) {
    console.error('Error creating live session:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

/**
 * Get all active live sessions
 * @returns {Promise<Array>} - Array of active live sessions
 */
export const getActiveLiveSessions = async () => {
  try {
    console.log('Fetching live sessions from Firestore...');

    // Simplified query - get all and filter in memory to avoid index requirement
    const querySnapshot = await getDocs(collection(db, 'liveSessions'));
    console.log('Found documents:', querySnapshot.size);

    const allSessions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('All sessions:', allSessions);

    // Filter active sessions and sort
    const activeSessions = allSessions
      .filter(session => session.status === 'active')
      .sort((a, b) => {
        const timeA = a.createdAt?.toDate?.() || new Date(0);
        const timeB = b.createdAt?.toDate?.() || new Date(0);
        return timeB - timeA;
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
 * @param {string} sessionId - Live session ID
 * @returns {Promise<object>} - Live session data
 */
export const getLiveSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    if (sessionDoc.exists()) {
      return {
        id: sessionDoc.id,
        ...sessionDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting live session:', error);
    throw error;
  }
};

/**
 * Subscribe to live session updates (real-time)
 * @param {string} sessionId - Live session ID
 * @param {function} callback - Callback function for updates
 * @returns {function} - Unsubscribe function
 */
export const subscribeLiveSession = (sessionId, callback) => {
  const sessionRef = doc(db, 'liveSessions', sessionId);
  return onSnapshot(sessionRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    }
  }, (error) => {
    console.error('Error in live session subscription:', error);
  });
};

/**
 * Update player result in live session
 * @param {string} sessionId - Live session ID
 * @param {string} playerName - Player name
 * @param {object} result - Result data
 */
export const updateLiveSessionResult = async (sessionId, playerName, result) => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const currentResults = sessionDoc.data().results || {};

      // Initialize player results if not exists
      if (!currentResults[playerName]) {
        currentResults[playerName] = {
          answers: [],
          score: 0,
          startedAt: serverTimestamp(),
          lastUpdate: serverTimestamp()
        };
      }

      // Add new answer (use Date instead of serverTimestamp in arrays)
      currentResults[playerName].answers.push({
        ...result,
        timestamp: new Date().toISOString()
      });

      currentResults[playerName].score = (currentResults[playerName].score || 0) + (result.points || 0);
      currentResults[playerName].lastUpdate = serverTimestamp();

      await updateDoc(sessionRef, {
        results: currentResults
      });
    }
  } catch (error) {
    console.error('Error updating live session result:', error);
    throw error;
  }
};

/**
 * End a live session
 * @param {string} sessionId - Live session ID
 */
export const endLiveSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'completed',
      endedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error ending live session:', error);
    throw error;
  }
};

/**
 * Delete a live session
 * @param {string} sessionId - Live session ID
 */
export const deleteLiveSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'liveSessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('Error deleting live session:', error);
    throw error;
  }
};
