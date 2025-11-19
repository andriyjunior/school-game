import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TestState, CustomTest, TestAttempt, PlayerClass } from '../../types';
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  saveTestAttempt,
} from '../../firebase/testDatabase';

const initialState: TestState = {
  allTests: [],
  currentTest: null,
  currentAttempt: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllTests = createAsyncThunk(
  'test/fetchAllTests',
  async (playerClass?: PlayerClass) => {
    const tests = await getAllTests(playerClass);
    return tests;
  }
);

export const fetchTestById = createAsyncThunk(
  'test/fetchTestById',
  async (testId: string) => {
    const test = await getTestById(testId);
    return test;
  }
);

export const createNewTest = createAsyncThunk(
  'test/createNewTest',
  async (test: Omit<CustomTest, 'id' | 'createdAt'>) => {
    const testId = await createTest(test);
    return { ...test, id: testId };
  }
);

export const updateExistingTest = createAsyncThunk(
  'test/updateExistingTest',
  async ({ testId, updates }: { testId: string; updates: Partial<CustomTest> }) => {
    await updateTest(testId, updates);
    return { testId, updates };
  }
);

export const deleteExistingTest = createAsyncThunk(
  'test/deleteExistingTest',
  async (testId: string) => {
    await deleteTest(testId);
    return testId;
  }
);

export const submitTestAttempt = createAsyncThunk(
  'test/submitTestAttempt',
  async (attempt: Omit<TestAttempt, 'id'>) => {
    const attemptId = await saveTestAttempt(attempt);
    return { ...attempt, id: attemptId };
  }
);

// Slice
const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setCurrentTest: (state, action: PayloadAction<CustomTest | null>) => {
      state.currentTest = action.payload;
      state.currentAttempt = null; // Reset attempt when changing test
    },
    startTestAttempt: (state, action: PayloadAction<{ testId: string; testTitle: string; playerName: string; sessionId: string }>) => {
      if (state.currentTest) {
        state.currentAttempt = {
          testId: action.payload.testId,
          testTitle: action.payload.testTitle,
          playerName: action.payload.playerName,
          sessionId: action.payload.sessionId,
          answers: [],
          totalScore: 0,
          maxScore: state.currentTest.totalPoints,
          percentage: 0,
          startedAt: new Date().toISOString(),
          completedAt: null,
        };
      }
    },
    recordAnswer: (state, action: PayloadAction<{
      questionId: string;
      userAnswer: string;
      isCorrect: boolean;
      pointsEarned: number;
    }>) => {
      if (state.currentAttempt) {
        // Check if answer already exists and update it
        const existingIndex = state.currentAttempt.answers.findIndex(
          a => a.questionId === action.payload.questionId
        );

        if (existingIndex >= 0) {
          // Update existing answer
          state.currentAttempt.answers[existingIndex] = action.payload;
        } else {
          // Add new answer
          state.currentAttempt.answers.push(action.payload);
        }

        // Recalculate total score
        state.currentAttempt.totalScore = state.currentAttempt.answers.reduce(
          (sum, ans) => sum + ans.pointsEarned,
          0
        );

        // Calculate percentage
        state.currentAttempt.percentage = Math.round(
          (state.currentAttempt.totalScore / state.currentAttempt.maxScore) * 100
        );
      }
    },
    completeTestAttempt: (state) => {
      if (state.currentAttempt) {
        state.currentAttempt.completedAt = new Date().toISOString();
      }
    },
    resetCurrentTest: (state) => {
      state.currentTest = null;
      state.currentAttempt = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all tests
    builder.addCase(fetchAllTests.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllTests.fulfilled, (state, action) => {
      state.loading = false;
      state.allTests = action.payload;
    });
    builder.addCase(fetchAllTests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch tests';
    });

    // Fetch test by ID
    builder.addCase(fetchTestById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTestById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTest = action.payload;
    });
    builder.addCase(fetchTestById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch test';
    });

    // Create new test
    builder.addCase(createNewTest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNewTest.fulfilled, (state, action) => {
      state.loading = false;
      state.allTests.push(action.payload as CustomTest);
    });
    builder.addCase(createNewTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create test';
    });

    // Update test
    builder.addCase(updateExistingTest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExistingTest.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.allTests.findIndex(t => t.id === action.payload.testId);
      if (index >= 0) {
        state.allTests[index] = { ...state.allTests[index], ...action.payload.updates };
      }
    });
    builder.addCase(updateExistingTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update test';
    });

    // Delete test
    builder.addCase(deleteExistingTest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteExistingTest.fulfilled, (state, action) => {
      state.loading = false;
      state.allTests = state.allTests.filter(t => t.id !== action.payload);
    });
    builder.addCase(deleteExistingTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete test';
    });

    // Submit test attempt
    builder.addCase(submitTestAttempt.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitTestAttempt.fulfilled, (state) => {
      state.loading = false;
      // Optionally clear current attempt after successful submission
    });
    builder.addCase(submitTestAttempt.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to submit test';
    });
  },
});

export const {
  setCurrentTest,
  startTestAttempt,
  recordAnswer,
  completeTestAttempt,
  resetCurrentTest,
  clearError,
} = testSlice.actions;

export default testSlice.reducer;
