import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, PlayerClass } from '../../types';

// LocalStorage keys
const STORAGE_KEY = 'school_game_player';
const COMPLETED_TESTS_KEY = 'school_game_completed_tests';

// Load player from localStorage
const loadPlayerFromStorage = (): PlayerState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        name: data.name || '',
        class: data.class || null,
        sessionId: data.sessionId || `local_${Date.now()}`,
      };
    }
  } catch (error) {
    console.error('Error loading player from storage:', error);
  }
  return {
    name: '',
    class: null,
    sessionId: null,
  };
};

// Save player to localStorage
const savePlayerToStorage = (player: PlayerState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch (error) {
    console.error('Error saving player to storage:', error);
  }
};

// Get completed tests from localStorage
export const getCompletedTests = (): string[] => {
  try {
    const saved = localStorage.getItem(COMPLETED_TESTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading completed tests:', error);
  }
  return [];
};

// Add completed test to localStorage
export const addCompletedTest = (testId: string) => {
  try {
    const completed = getCompletedTests();
    if (!completed.includes(testId)) {
      completed.push(testId);
      localStorage.setItem(COMPLETED_TESTS_KEY, JSON.stringify(completed));
    }
  } catch (error) {
    console.error('Error saving completed test:', error);
  }
};

// Check if test is completed
export const isTestCompleted = (testId: string): boolean => {
  return getCompletedTests().includes(testId);
};

// Clear all student data (for logout)
export const clearStudentData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COMPLETED_TESTS_KEY);
  } catch (error) {
    console.error('Error clearing student data:', error);
  }
};

const initialState: PlayerState = loadPlayerFromStorage();

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerInfo: (
      state,
      action: PayloadAction<{ name: string; class: PlayerClass }>
    ) => {
      state.name = action.payload.name;
      state.class = action.payload.class;
      state.sessionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save to localStorage
      savePlayerToStorage({
        name: state.name,
        class: state.class,
        sessionId: state.sessionId,
      });
    },
    clearPlayer: (state) => {
      state.name = '';
      state.class = null;
      state.sessionId = null;

      // Clear from localStorage
      clearStudentData();
    },
    // Load player from storage (for app initialization)
    loadFromStorage: (state) => {
      const loaded = loadPlayerFromStorage();
      state.name = loaded.name;
      state.class = loaded.class;
      state.sessionId = loaded.sessionId;
    },
  },
});

export const { setPlayerInfo, clearPlayer, loadFromStorage } = playerSlice.actions;
export default playerSlice.reducer;
