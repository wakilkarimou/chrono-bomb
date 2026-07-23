import type { PublicChallenge, PublicGameState, PublicPlayer, UrgencyLevel } from './models';

// ========== Server → Client ==========

export interface RoomCreatedEvent {
  type: 'room_created';
  code: string;
  playerId: string;
  players: PublicPlayer[];
}

export interface RoomJoinedEvent {
  type: 'room_joined';
  playerId: string;
  players: PublicPlayer[];
}

export interface PlayerJoinedEvent {
  type: 'player_joined';
  player: PublicPlayer;
}

export interface PlayerLeftEvent {
  type: 'player_left';
  playerId: string;
  newHostId: string | null;
}

export interface GameStartedEvent {
  type: 'game_started';
  players: PublicPlayer[];
  activePlayerId: string;
}

export interface ChallengeAssignedEvent {
  type: 'challenge_assigned';
  activePlayerId: string;
  challenge: PublicChallenge;
}

export interface ChallengeResultEvent {
  type: 'challenge_result';
  success: boolean;
  playerId: string;
}

export interface BombPassedEvent {
  type: 'bomb_passed';
  fromPlayerId: string;
  toPlayerId: string;
}

export interface UrgencySignalEvent {
  type: 'urgency_signal';
  level: UrgencyLevel;
}

export interface BombExplodedEvent {
  type: 'bomb_exploded';
  playerId: string;
  livesRemaining: number;
  eliminated: boolean;
}

export interface NewRoundEvent {
  type: 'new_round';
  roundNumber: number;
  activePlayerId: string;
}

export interface GameOverEvent {
  type: 'game_over';
  winnerId: string;
  rankings: { playerId: string; nickname: string; position: number }[];
}

export interface PlayerDisconnectedEvent {
  type: 'player_disconnected';
  playerId: string;
  reason: 'timeout' | 'left';
}

export interface ReconnectedEvent {
  type: 'reconnected';
  gameState: PublicGameState;
}

export interface ServerErrorEvent {
  type: 'error';
  message: string;
  errorCode: string;
}

export type ServerEvent =
  | RoomCreatedEvent
  | RoomJoinedEvent
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | GameStartedEvent
  | ChallengeAssignedEvent
  | ChallengeResultEvent
  | BombPassedEvent
  | UrgencySignalEvent
  | BombExplodedEvent
  | NewRoundEvent
  | GameOverEvent
  | PlayerDisconnectedEvent
  | ReconnectedEvent
  | ServerErrorEvent;
