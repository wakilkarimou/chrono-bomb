import { writable, derived } from 'svelte/store';
import type { PublicPlayer, PublicGameState, PublicChallenge, UrgencyLevel } from '../shared';

export type Screen = 'home' | 'lobby' | 'game' | 'podium';

export const currentScreen = writable<Screen>('home');
export const playerId = writable<string | null>(null);
export const roomCode = writable<string | null>(null);
export const players = writable<PublicPlayer[]>([]);
export const gameState = writable<PublicGameState | null>(null);
export const urgencyLevel = writable<UrgencyLevel>('low');
export const soundEnabled = writable<boolean>(true);
export const challengeResolved = writable<boolean>(false);
export const errorMessage = writable<string | null>(null);
export const rankings = writable<{ playerId: string; nickname: string; position: number }[]>([]);

export const isHost = derived(
  [playerId, players],
  ([$playerId, $players]) => $players.find(p => p.id === $playerId)?.isHost ?? false
);

export const isActivePlayer = derived(
  [playerId, gameState],
  ([$playerId, $gameState]) => $gameState?.activePlayerId === $playerId
);

export const alivePlayers = derived(
  players,
  ($players) => $players.filter(p => p.status === 'alive')
);

export const currentChallenge = derived(
  gameState,
  ($gameState) => $gameState?.currentChallenge ?? null
);
