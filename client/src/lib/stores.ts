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
export const explosionEvent = writable<{ playerId: string; nickname: string; livesRemaining: number; eliminated: boolean } | null>(null);
export const floatingEmojis = writable<{ id: number; emoji: string; nickname: string }[]>([]);
export const bombPassEvent = writable<{ fromNickname: string; fromAvatar: string; toNickname: string; toAvatar: string } | null>(null);
export const deathScreen = writable<{ nickname: string; avatar: string; position: number } | null>(null);
export const killCounts = writable<Record<string, number>>({}); // playerId → number of "assists"

// Game stats tracked during play
export const gameStats = writable<{
  bombsReceived: Record<string, number>;
  challengesSolved: Record<string, number>;
  fastestSolve: Record<string, number>; // ms
  timeHoldingBomb: Record<string, number>; // ms
}>({
  bombsReceived: {},
  challengesSolved: {},
  fastestSolve: {},
  timeHoldingBomb: {},
});

export const showCountdown = writable<boolean>(false);
export const myPowerUp = writable<string | null>(null);
export const quickChatMessages = writable<{ id: number; nickname: string; message: string }[]>([]);

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
