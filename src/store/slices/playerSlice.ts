import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PlayerState, PlayerClass } from '../../types';
import { createSession, endSession } from '../../firebase/database';

const initialState: PlayerState = {
  name: '',
  class: null,
  sessionId: null,
};

// Async thunks
export const initializeSession = createAsyncThunk(
  'player/initializeSession',
  async ({ playerName, playerClass }: { playerName: string; playerClass: PlayerClass }) => {
    const sessionId = await createSession(playerName, playerClass);
    return sessionId;
  }
);

export const finalizeSession = createAsyncThunk(
  'player/finalizeSession',
  async (
    {
      sessionId,
      stats,
    }: {
      sessionId: string;
      stats: { totalScore: number; maxStreak: number; achievements: string[] };
    }
  ) => {
    await endSession(sessionId, stats);
  }
);

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
    },
    clearPlayer: (state) => {
      state.name = '';
      state.class = null;
      state.sessionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSession.fulfilled, (state, action) => {
        state.sessionId = action.payload;
      })
      .addCase(initializeSession.rejected, (state) => {
        console.error('Failed to create session');
        state.sessionId = null;
      });
  },
});

export const { setPlayerInfo, clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
