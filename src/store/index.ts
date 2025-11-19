import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import gameReducer from './slices/gameSlice';
import liveSessionReducer from './slices/liveSessionSlice';
import uiReducer from './slices/uiSlice';
import testReducer from './slices/testSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    game: gameReducer,
    liveSession: liveSessionReducer,
    ui: uiReducer,
    test: testReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase timestamp fields
        ignoredActions: [
          'player/initializeSession/fulfilled',
          'game/updateScoreAsync/fulfilled',
          'liveSession/fetchActive/fulfilled',
        ],
        ignoredPaths: [
          'liveSession.activeLiveSession.createdAt',
          'liveSession.activeLiveSession.results',
          'liveSession.allLiveSessions',
        ],
      },
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
