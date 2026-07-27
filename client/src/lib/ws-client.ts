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
  explosionEvent,
  floatingEmojis,
  bombPassEvent,
  deathScreen,
  killCounts,
  gameStats,
  showCountdown,
  myPowerUp,
  quickChatMessages,
} from './stores';
import { playSuccess, playFail, playPass, playExplosion, playReceiveBomb, playVictory, playTick, playUrgencyTick } from './audio';
import { incrementStat } from './profile';
import { notifyMyTurn } from './notifications';

let ws: WebSocket | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT = 5;

let savedPlayerId: string | null = null;
let savedRoomCode: string | null = null;
let currentPlayers: import('../shared').PublicPlayer[] = [];
let lastBombPasser: string | null = null;

// Queue for messages sent before connection is ready
let pendingMessages: ClientEvent[] = [];

// Reactive connection state
export const connected = writable<boolean>(false);

// Subscribe to stores to keep local refs
playerId.subscribe(v => { savedPlayerId = v; });
roomCode.subscribe(v => { savedRoomCode = v; });
players.subscribe(v => { currentPlayers = v; });

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
      killCounts.set({});
      gameStats.set({ bombsReceived: {}, challengesSolved: {}, fastestSolve: {}, timeHoldingBomb: {} });
      lastBombPasser = null;
      myPowerUp.set(null);
      gameState.set({
        status: 'playing',
        activePlayerId: event.activePlayerId,
        currentChallenge: null,
        players: event.players,
        roundNumber: 1,
        challengeResolved: false,
      });
      urgencyLevel.set('low');
      showCountdown.set(true);
      currentScreen.set('game');
      incrementStat('gamesPlayed');
      break;

    case 'challenge_assigned':
      gameState.update(s => s ? { ...s, activePlayerId: event.activePlayerId, currentChallenge: event.challenge, challengeResolved: false } : s);
      challengeResolved.set(false);
      break;

    case 'challenge_result':
      if (event.success) {
        challengeResolved.set(true);
        gameState.update(s => s ? { ...s, challengeResolved: true } : s);
        playSuccess();
        // Track stat
        gameStats.update(s => {
          const cs = { ...s.challengesSolved };
          cs[event.playerId] = (cs[event.playerId] || 0) + 1;
          return { ...s, challengesSolved: cs };
        });
      } else {
        playFail();
      }
      break;

    case 'bomb_passed': {
      // Show pass animation
      const fromPlayer = currentPlayers.find(p => p.id === event.fromPlayerId);
      const toPlayer = currentPlayers.find(p => p.id === event.toPlayerId);
      if (fromPlayer && toPlayer) {
        bombPassEvent.set({
          fromNickname: fromPlayer.nickname,
          fromAvatar: fromPlayer.avatar,
          toNickname: toPlayer.nickname,
          toAvatar: toPlayer.avatar,
        });
        setTimeout(() => { bombPassEvent.set(null); }, 1200);
      }

      // Track last passer for kill counting
      lastBombPasser = event.fromPlayerId;

      // Track bombs received
      gameStats.update(s => {
        const br = { ...s.bombsReceived };
        br[event.toPlayerId] = (br[event.toPlayerId] || 0) + 1;
        return { ...s, bombsReceived: br };
      });

      playPass();
      gameState.update(s => s ? { ...s, activePlayerId: event.toPlayerId, challengeResolved: false } : s);
      challengeResolved.set(false);

      // Sound + vibrate when you receive the bomb
      if (event.toPlayerId === savedPlayerId) {
        playReceiveBomb();
        notifyMyTurn();
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      }
      break;
    }

    case 'urgency_signal':
      urgencyLevel.set(event.level);
      playUrgencyTick(event.level);
      break;

    case 'bomb_exploded': {
      const explodedPlayer = currentPlayers.find(p => p.id === event.playerId);
      players.update(p => p.map(pl =>
        pl.id === event.playerId
          ? { ...pl, lives: event.livesRemaining, status: event.eliminated ? 'spectator' : pl.status }
          : pl
      ));

      playExplosion();

      // Count kill for the last passer
      if (lastBombPasser && lastBombPasser !== event.playerId) {
        killCounts.update(counts => {
          const updated = { ...counts };
          updated[lastBombPasser!] = (updated[lastBombPasser!] || 0) + 1;
          return updated;
        });
      }
      lastBombPasser = null;

      // Clear power-up if shield was used (no life lost)
      if (event.playerId === savedPlayerId) {
        myPowerUp.set(null);
      }

      // Vibrate on explosion
      if (navigator.vibrate) {
        if (event.playerId === savedPlayerId) {
          navigator.vibrate([100, 50, 200, 50, 300]);
        } else {
          navigator.vibrate(100);
        }
      }

      // Show explosion overlay
      explosionEvent.set({
        playerId: event.playerId,
        nickname: explodedPlayer?.nickname || '???',
        livesRemaining: event.livesRemaining,
        eliminated: event.eliminated,
      });
      setTimeout(() => { explosionEvent.set(null); }, 2500);

      // Show death screen if it's ME and I'm eliminated
      if (event.playerId === savedPlayerId && event.eliminated) {
        const totalPlayers = currentPlayers.length;
        const aliveCount = currentPlayers.filter(p => p.id !== event.playerId && p.status === 'alive' && p.lives > 0).length;
        const myPosition = aliveCount + 1; // I'm out, so my position is alive + 1
        setTimeout(() => {
          deathScreen.set({
            nickname: explodedPlayer?.nickname || '???',
            avatar: explodedPlayer?.avatar || '💀',
            position: myPosition,
          });
        }, 2600); // After explosion overlay clears
        setTimeout(() => { deathScreen.set(null); }, 6000);
      }
      break;
    }

    case 'new_round':
      gameState.update(s => s ? { ...s, roundNumber: event.roundNumber, activePlayerId: event.activePlayerId, challengeResolved: false, currentChallenge: null } : s);
      urgencyLevel.set('low');
      challengeResolved.set(false);
      break;

    case 'game_over':
      rankings.set(event.rankings);
      gameState.update(s => s ? { ...s, status: 'finished' } : s);
      currentScreen.set('podium');
      // Victory sound + stats
      if (event.winnerId === savedPlayerId) {
        playVictory();
        incrementStat('wins');
      }
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

    case 'emoji_received': {
      const emojiId = Date.now() + Math.random();
      floatingEmojis.update(list => [...list, { id: emojiId, emoji: event.emoji, nickname: event.nickname }]);
      setTimeout(() => {
        floatingEmojis.update(list => list.filter(e => e.id !== emojiId));
      }, 2000);
      break;
    }

    case 'power_up_gained':
      if (event.playerId === savedPlayerId) {
        myPowerUp.set(event.powerUp);
      }
      break;

    case 'quick_chat_received': {
      const chatId = Date.now() + Math.random();
      quickChatMessages.update(list => [...list, { id: chatId, nickname: event.nickname, message: event.message }]);
      setTimeout(() => {
        quickChatMessages.update(list => list.filter(m => m.id !== chatId));
      }, 3000);
      break;
    }
  }
}
