import type { PublicChallenge, PublicGameState, PublicPlayer, UrgencyLevel } from './models';

// ========== Client → Server ==========

export interface CreateRoomEvent {
  type: 'create_room';
  nickname: string;
  avatar: string;
  mode: 'classic' | 'speed' | 'hardcore';
}

export interface JoinRoomEvent {
  type: 'join_room';
  code: string;
  nickname: string;
  avatar: string;
}

export interface LeaveRoomEvent {
  type: 'leave_room';
}

export interface StartGameEvent {
  type: 'start_game';
  mode: 'classic' | 'speed' | 'hardcore';
}

export interface SubmitChallengeEvent {
  type: 'submit_challenge';
  answer: string | number | string[];
}

export interface PassBombEvent {
  type: 'pass_bomb';
  targetPlayerId: string;
}

export interface HeartbeatEvent {
  type: 'heartbeat';
}

export interface ReconnectEvent {
  type: 'reconnect';
  playerId: string;
  roomCode: string;
}

export interface SendEmojiEvent {
  type: 'send_emoji';
  emoji: string;
}

export type ClientEvent =
  | CreateRoomEvent
  | JoinRoomEvent
  | LeaveRoomEvent
  | StartGameEvent
  | SubmitChallengeEvent
  | PassBombEvent
  | HeartbeatEvent
  | ReconnectEvent
  | SendEmojiEvent;

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

export interface EmojiReceivedEvent {
  type: 'emoji_received';
  playerId: string;
  nickname: string;
  emoji: string;
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
  | ServerErrorEvent
  | EmojiReceivedEvent;
