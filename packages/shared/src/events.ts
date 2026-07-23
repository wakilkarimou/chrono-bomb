import type { PublicChallenge, PublicGameState, PublicPlayer, UrgencyLevel } from './models';

// ========== Client → Server ==========

export interface CreateRoomEvent {
  type: 'create_room';
  nickname: string;
}

export interface JoinRoomEvent {
  type: 'join_room';
  code: string;
  nickname: string;
}

export interface LeaveRoomEvent {
  type: 'leave_room';
}

export interface StartGameEvent {
  type: 'start_game';
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

export type ClientEvent =
  | CreateRoomEvent
  | JoinRoomEvent
  | LeaveRoomEvent
  | StartGameEvent
  | SubmitChallengeEvent
  | PassBombEvent
  | HeartbeatEvent
  | ReconnectEvent;
