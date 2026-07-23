import type { ClientEvent, ServerEvent } from '../shared';
import { writable } from 'svelte/store';
import {
  currentScreen,
  playerId,
  roomCode,
  players,
  gameState,
  urgencyLevel,
  challengeResolved,
  errorMessage,
  rankings,
} from './stores';

let ws: WebSocket | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT = 5;

let savedPlayerId: string | null = null;
let savedRoomCode: string | null = null;

// Queue for messages sent before connection is ready
let pendingMessages: ClientEvent[] = [];

// Reactive connection state
export const connected = writable<boolean>(false);

// Subscribe to stores to keep local refs
playerId.subscribe(v => { savedPlayerId = v; });
roomCode.subscribe(v => { savedRoomCode = v; });

export function connect(): void {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const url = `${protocol}//${window.location.host}/ws`;

  ws = new WebSocket(url);

  ws.onopen = () => {
    reconnectAttempts = 0;
    connected.set(true);
    startHeartbeat();

    // If we have saved player/room, attempt reconnect
    if (savedPlayerId && savedRoomCode) {
      send({ type: 'reconnect', playerId: savedPlayerId, roomCode: savedRoomCode });
    }

    // Flush pending messages
    while (pendingMessages.length > 0) {
      const msg = pendingMessages.shift()!;
      ws!.send(JSON.stringify(msg));
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as ServerEvent;
      handleServerEvent(data);
    } catch {
      // ignore malformed messages
    }
  };

  ws.onclose = () => {
    connected.set(false);
    stopHeartbeat();
    if (reconnectAttempts < MAX_RECONNECT) {
      setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, 2000);
    } else {
      errorMessage.set('Connexion au serveur perdue. Rafraîchis la page.');
    }
  };

  ws.onerror = () => {
    connected.set(false);
  };
}

export function send(event: ClientEvent): void {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  } else {
    // Queue the message to be sent when connection opens
    pendingMessages.push(event);
  }
}

function startHeartbeat(): void {
  heartbeatInterval = setInterval(() => {
    send({ type: 'heartbeat' });
  }, 5000);
}

function stopHeartbeat(): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function handleServerEvent(event: ServerEvent): void {
  // Clear error on any successful event (except error itself)
  if (event.type !== 'error') {
    errorMessage.set(null);
  }

  switch (event.type) {
    case 'room_created':
      playerId.set(event.playerId);
      roomCode.set(event.code);
      players.set(event.players);
      currentScreen.set('lobby');
      break;

    case 'room_joined':
      playerId.set(event.playerId);
      players.set(event.players);
      currentScreen.set('lobby');
      break;

    case 'player_joined':
      players.update(p => [...p, event.player]);
      break;

    case 'player_left':
      players.update(p => {
        const filtered = p.filter(pl => pl.id !== event.playerId);
        if (event.newHostId) {
          return filtered.map(pl =>
            pl.id === event.newHostId ? { ...pl, isHost: true } : { ...pl, isHost: false }
          );
        }
        return filtered;
      });
      break;

    case 'game_started':
      players.set(event.players);
      gameState.set({
        status: 'playing',
        activePlayerId: event.activePlayerId,
        currentChallenge: null,
        players: event.players,
        roundNumber: 1,
        challengeResolved: false,
      });
      urgencyLevel.set('low');
      currentScreen.set('game');
      break;

    case 'challenge_assigned':
      gameState.update(s => s ? { ...s, activePlayerId: event.activePlayerId, currentChallenge: event.challenge, challengeResolved: false } : s);
      challengeResolved.set(false);
      break;

    case 'challenge_result':
      if (event.success) {
        challengeResolved.set(true);
        gameState.update(s => s ? { ...s, challengeResolved: true } : s);
      }
      break;

    case 'bomb_passed':
      gameState.update(s => s ? { ...s, activePlayerId: event.toPlayerId, challengeResolved: false } : s);
      challengeResolved.set(false);
      break;

    case 'urgency_signal':
      urgencyLevel.set(event.level);
      break;

    case 'bomb_exploded':
      players.update(p => p.map(pl =>
        pl.id === event.playerId
          ? { ...pl, lives: event.livesRemaining, status: event.eliminated ? 'spectator' : pl.status }
          : pl
      ));
      break;

    case 'new_round':
      gameState.update(s => s ? { ...s, roundNumber: event.roundNumber, activePlayerId: event.activePlayerId, challengeResolved: false } : s);
      urgencyLevel.set('low');
      challengeResolved.set(false);
      break;

    case 'game_over':
      rankings.set(event.rankings);
      gameState.update(s => s ? { ...s, status: 'finished' } : s);
      currentScreen.set('podium');
      break;

    case 'player_disconnected':
      players.update(p => p.map(pl =>
        pl.id === event.playerId ? { ...pl, status: 'spectator', lives: 0 } : pl
      ));
      break;

    case 'reconnected':
      gameState.set(event.gameState);
      players.set(event.gameState.players);
      challengeResolved.set(event.gameState.challengeResolved);
      if (event.gameState.status === 'playing') {
        currentScreen.set('game');
      } else if (event.gameState.status === 'finished') {
        currentScreen.set('podium');
      } else {
        currentScreen.set('lobby');
      }
      break;

    case 'error':
      errorMessage.set(event.message);
      break;
  }
}
