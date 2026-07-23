import type { ChallengeType, PlayerStatus, RoomStatus, UrgencyLevel } from './shared';

export interface Player {
  id: string;
  nickname: string;
  lives: number;
  status: PlayerStatus;
  isHost: boolean;
  joinedAt: number;
  socketId: string | null;
  disconnectedAt: number | null;
  disconnectTimer: ReturnType<typeof setTimeout> | null;
}

export interface WordChallengePayload {
  category: string;
  options: string[];       // 4 choices displayed to the player
  correctAnswer: string;   // the one that belongs to the category
}

export interface ReflexChallengePayload {
  delay: number;
  stimulusShownAt: number | null;
}

export interface PatternChallengePayload {
  sequence: string[];
  colors: string[];
}

export interface MathChallengePayload {
  expression: string;   // ex: "7 × 8"
  answer: number;       // ex: 56
  options: number[];    // 4 choices including the correct one
}

export interface ReverseChallengePayload {
  originalWord: string; // ex: "cuisine"
  reversedWord: string; // ex: "ENISUIC"
}

export type ChallengePayload = WordChallengePayload | ReflexChallengePayload | PatternChallengePayload | MathChallengePayload | ReverseChallengePayload;

export interface Challenge {
  type: ChallengeType;
  payload: ChallengePayload;
  generatedAt: number;
}

export interface SecretTimer {
  duration: number;
  startedAt: number;
  timerRef: ReturnType<typeof setTimeout> | null;
}

export interface UrgencyState {
  currentLevel: UrgencyLevel;
  signalTimerRef: ReturnType<typeof setTimeout> | null;
  thresholds: { medium: number; high: number };
}

export interface GameState {
  status: RoomStatus;
  activePlayerId: string | null;
  currentChallenge: Challenge | null;
  secretTimer: SecretTimer;
  urgency: UrgencyState;
  roundNumber: number;
  eliminationOrder: string[];
  challengeResolved: boolean;
}

export interface Room {
  code: string;
  players: Map<string, Player>;
  gameState: GameState;
  createdAt: number;
  lastActivityAt: number;
  cleanupTimer: ReturnType<typeof setTimeout> | null;
}
