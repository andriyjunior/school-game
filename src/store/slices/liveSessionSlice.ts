import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LiveSessionState, LiveSession } from '../../types';
import {
  getActiveLiveSessions,
  getAllLiveSessions,
  createLiveSession,
  endLiveSession,
  deleteLiveSession,
} from '../../firebase/database';

const initialState: LiveSessionState = {
  activeLiveSession: null,
  allLiveSessions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchActiveLiveSessions = createAsyncThunk(
  'liveSession/fetchActive',
  async () => {
    const sessions = await getActiveLiveSessions();
    return sessions;
  }
);

export const fetchAllLiveSessions = createAsyncThunk(
  'liveSession/fetchAll',
  async () => {
    const sessions = await getAllLiveSessions();
    return sessions;
  }
);

export const createLiveSessionAsync = createAsyncThunk(
  'liveSession/create',
  async (sessionData: Omit<LiveSession, 'id' | 'results' | 'status' | 'createdAt' | 'createdBy'>) => {
    const sessionId = await createLiveSession(sessionData);
    return sessionId;
  }
);

export const endLiveSessionAsync = createAsyncThunk(
  'liveSession/end',
  async (sessionId: string) => {
    await endLiveSession(sessionId);
    return sessionId;
  }
);

export const deleteLiveSessionAsync = createAsyncThunk(
  'liveSession/delete',
  async (sessionId: string) => {
    await deleteLiveSession(sessionId);
    return sessionId;
  }
);

const liveSessionSlice = createSlice({
  name: 'liveSession',
  initialState,
  reducers: {
    setActiveLiveSession: (state, action: PayloadAction<LiveSession | null>) => {
      state.activeLiveSession = action.payload;
    },
    clearActiveLiveSession: (state) => {
      state.activeLiveSession = null;
    },
    updateLiveSessionsList: (state, action: PayloadAction<LiveSession[]>) => {
      state.allLiveSessions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active live sessions
      .addCase(fetchActiveLiveSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveLiveSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.allLiveSessions = action.payload;
      })
      .addCase(fetchActiveLiveSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch live sessions';
      })
      // Fetch all live sessions (including completed)
      .addCase(fetchAllLiveSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLiveSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.allLiveSessions = action.payload;
      })
      .addCase(fetchAllLiveSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch all live sessions';
      })
      // Create live session
      .addCase(createLiveSessionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLiveSessionAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createLiveSessionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create live session';
      })
      // End live session
      .addCase(endLiveSessionAsync.fulfilled, (state, action) => {
        if (state.activeLiveSession?.id === action.payload) {
          state.activeLiveSession = null;
        }
      })
      // Delete live session
      .addCase(deleteLiveSessionAsync.fulfilled, (state, action) => {
        if (state.activeLiveSession?.id === action.payload) {
          state.activeLiveSession = null;
        }
        state.allLiveSessions = state.allLiveSessions.filter(
          (session) => session.id !== action.payload
        );
      });
  },
});

export const {
  setActiveLiveSession,
  clearActiveLiveSession,
  updateLiveSessionsList,
} = liveSessionSlice.actions;

export default liveSessionSlice.reducer;
