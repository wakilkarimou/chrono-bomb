export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type PlayerStatus = 'alive' | 'spectator' | 'disconnected';
export type ChallengeType = 'word_category' | 'reflex' | 'pattern';
export type UrgencyLevel = 'low' | 'medium' | 'high';

export interface PublicPlayer {
  id: string;
  nickname: string;
  lives: number;
  status: PlayerStatus;
  isHost: boolean;
}

export interface PublicChallenge {
  type: ChallengeType;
  category?: string;
  delay?: number;
  sequence?: string[];
  colors?: string[];
}

export interface PublicGameState {
  status: RoomStatus;
  activePlayerId: string | null;
  currentChallenge: PublicChallenge | null;
  players: PublicPlayer[];
  roundNumber: number;
  challengeResolved: boolean;
}
