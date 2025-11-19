// ==================== PLAYER TYPES ====================

export type PlayerClass = 2 | 3 | 4;

export interface PlayerState {
  name: string;
  class: PlayerClass | null;
  sessionId: string | null;
}

// ==================== GAME TYPES ====================

export type GameType =
  // Class 2 games
  | 'guess'
  | 'memory'
  | 'spell'
  | 'match'
  | 'sound'
  | 'algorithm-game'
  // Class 3 games
  | 'algorithm-adventure'
  // Class 4 games
  | 'binary'
  | 'parts'
  | 'algorithm'
  | 'coding'
  | 'pattern'
  | 'pixel'
  | 'debug'
  | 'sort'
  // Custom tests
  | 'custom-test';

export type CategoryType = 'all' | 'farm' | 'wild' | 'birds' | 'insects';

export interface GameState {
  currentGame: GameType | '';
  selectedCategory: CategoryType | '';
  totalScore: number;
  streak: number;
  maxStreak: number;
  achievements: string[];
}

export interface GameDetails {
  question?: string;
  correct?: boolean;
  points?: number;
  selectedAnswer?: string;
  correctAnswer?: string;
  userAnswer?: string;
  match?: string;
  userMatch?: string;
  correctMatch?: string;
  matchedAnimal?: string;
  attempted?: string;
  gameType?: GameType;
}

// ==================== ANIMAL/DATA TYPES ====================

export interface Animal {
  name: string;
  icon: string;
  hint: string;
  home: string;
  sound: string;
}

export interface Category {
  name: string;
  icon: string;
  description: string;
}

export interface Categories {
  [key: string]: Category;
}

// ==================== SESSION TYPES ====================

export interface Session {
  id?: string;
  playerName: string;
  playerClass: PlayerClass;
  startTime: any; // Firestore Timestamp
  endTime: any | null;
  totalScore: number;
  gamesPlayed: any[];
  achievementsUnlocked: string[];
  maxStreak: number;
  isActive: boolean;
  lastActivity?: any;
}

export interface GameResult {
  sessionId: string;
  gameType: GameType;
  points: number;
  score: number;
  streak: number;
  timestamp: any;
  [key: string]: any;
}

// ==================== LIVE SESSION TYPES ====================

export interface LiveSessionParticipant {
  answers: LiveSessionAnswer[];
  score: number;
  startedAt: any;
  lastUpdate: any;
}

export interface LiveSessionAnswer {
  question: string;
  correct: boolean;
  points: number;
  gameType: GameType;
  timestamp: string;
  [key: string]: any;
}

export interface LiveSession {
  id: string;
  title: string;
  testId: string; // ID of the custom test
  playerClass: PlayerClass;
  participants: string[]; // Array of player names or ['all']
  results: {
    [playerName: string]: LiveSessionParticipant;
  };
  status: 'active' | 'paused' | 'completed';
  createdAt: any;
  createdBy: string;
  endedAt?: any;
}

export interface LiveSessionState {
  activeLiveSession: LiveSession | null;
  allLiveSessions: LiveSession[];
  loading: boolean;
  error: string | null;
}

// ==================== ADMIN TYPES ====================

export interface Analytics {
  totalPlayers: number;
  totalSessions: number;
  totalGames: number;
  averageScore: number;
  gameTypeCounts: {
    [gameType: string]: number;
  };
  classCounts: {
    [classNumber: string]: number;
  };
  recentSessions: Session[];
}

export interface PlayerStats {
  playerName: string;
  totalSessions: number;
  totalScore: number;
  averageScore: number;
  maxStreak: number;
  achievements: string[];
  recentSessions: Session[];
}

export interface AdminState {
  analytics: Analytics | null;
  sessions: Session[];
  selectedPlayer: string | null;
  playerStats: PlayerStats | null;
  loading: boolean;
  error: string | null;
}

// ==================== UI STATE TYPES ====================

export interface UIState {
  showNameModal: boolean;
  showHelp: boolean;
  helpGameType: GameType | '';
}

// ==================== DEBUG GAME TYPES ====================

export interface BuggyCodeExample {
  title: string;
  code: string;
  bug: string;
  bugLine: number;
  explanation: string;
}

// ==================== CUSTOM TEST TYPES ====================

export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice (4 options)
  correctAnswer: string; // Index for multiple choice, 'true'/'false' for true-false, exact text for fill-blank
  points: number;
  explanation?: string; // Optional explanation shown after answer
}

export interface CustomTest {
  id: string;
  title: string;
  description: string;
  playerClass: PlayerClass; // Which class this test is for
  questions: TestQuestion[];
  totalPoints: number;
  createdBy: string; // Admin/teacher name
  createdAt: any; // Firestore timestamp
  updatedAt?: any;
  isActive: boolean; // Can be assigned to sessions
}

export interface TestAttempt {
  id?: string;
  testId: string;
  testTitle: string;
  playerName: string;
  sessionId: string;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
  }[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  startedAt: any;
  completedAt: any;
}

export interface TestState {
  allTests: CustomTest[];
  currentTest: CustomTest | null;
  currentAttempt: TestAttempt | null;
  loading: boolean;
  error: string | null;
}
