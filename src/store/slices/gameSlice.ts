import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { GameState, GameType, CategoryType, GameDetails } from '../../types';
import { saveGameResult, updateLiveSessionResult } from '../../firebase/database';
import { RootState } from '../index';

const initialState: GameState = {
  currentGame: '',
  selectedCategory: '',
  totalScore: 0,
  streak: 0,
  maxStreak: 0,
  achievements: [],
};

// Async thunk for updating score with Firebase
export const updateScoreAsync = createAsyncThunk(
  'game/updateScore',
  async (
    { points, gameDetails }: { points: number; gameDetails?: GameDetails },
    { getState }
  ) => {
    const state = getState() as RootState;
    const { player, game, liveSession } = state;

    // Save to regular session
    if (player.sessionId && game.currentGame) {
      try {
        await saveGameResult(player.sessionId, {
          gameType: game.currentGame,
          points,
          score: game.totalScore + points,
          streak: game.streak + 1,
          ...gameDetails,
        });
      } catch (error) {
        console.error('Failed to save game result:', error);
      }
    }

    // Update live session if active
    if (liveSession.activeLiveSession && player.name) {
      try {
        await updateLiveSessionResult(
          liveSession.activeLiveSession.id,
          player.name,
          {
            question: gameDetails?.question || 'Питання',
            correct: gameDetails?.correct || false,
            points,
            gameType: game.currentGame as GameType,
            ...gameDetails,
          }
        );
      } catch (error) {
        console.error('Failed to update live session:', error);
      }
    }

    return { points, gameDetails };
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<GameType | ''>) => {
      state.currentGame = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<CategoryType | ''>) => {
      state.selectedCategory = action.payload;
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.totalScore += action.payload;
      state.streak += 1;
      if (state.streak > state.maxStreak) {
        state.maxStreak = state.streak;
      }
    },
    resetStreak: (state) => {
      state.streak = 0;
    },
    addAchievement: (state, action: PayloadAction<string>) => {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload);
      }
    },
    resetGame: (state) => {
      state.currentGame = '';
      state.selectedCategory = '';
    },
    resetGameState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateScoreAsync.fulfilled, (state, action) => {
      state.totalScore += action.payload.points;
      state.streak += 1;
      if (state.streak > state.maxStreak) {
        state.maxStreak = state.streak;
      }
    });
  },
});

export const {
  setCurrentGame,
  setSelectedCategory,
  updateScore,
  resetStreak,
  addAchievement,
  resetGame,
  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer;
