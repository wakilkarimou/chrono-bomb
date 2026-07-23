import type { WebSocket } from 'ws';
import type { ClientEvent, ServerEvent } from './shared';
import { MIN_PLAYERS, MAX_PLAYERS, RECONNECT_GRACE_PERIOD_MS, HEARTBEAT_TIMEOUT_MS } from './shared';
import { roomStore } from './rooms';
import { GameLoop } from './game-loop';
import { validateChallengeAnswer, generateChallenge, getChallengePublicData } from './challenges';
import { validateNickname, pickRandom } from './utils';
import { v4 as uuid } from 'uuid';
import type { Room, Player } from './types';

// Map socketId → WebSocket
const sockets = new Map<string, WebSocket>();
// Map socketId → last heartbeat timestamp
const heartbeats = new Map<string, number>();

let gameLoop: GameLoop;

export function initWsHandler() {
  gameLoop = new GameLoop(broadcastToRoom, sendToSocket);

  // Heartbeat checker
  setInterval(() => {
    const now = Date.now();
    for (const [socketId, lastBeat] of heartbeats.entries()) {
      if (now - lastBeat > HEARTBEAT_TIMEOUT_MS) {
        const ws = sockets.get(socketId);
        if (ws) {
          ws.close(1000, 'heartbeat_timeout');
        }
      }
    }
  }, 5000);
}

export function handleConnection(ws: WebSocket): void {
  const socketId = uuid();
  sockets.set(socketId, ws);
  heartbeats.set(socketId, Date.now());

  ws.on('message', (data) => {
    try {
      const event = JSON.parse(data.toString()) as ClientEvent;
      handleEvent(socketId, event);
    } catch {
      sendToSocket(socketId, { type: 'error', message: 'Message invalide', errorCode: 'INVALID_MESSAGE' });
    }
  });

  ws.on('close', () => {
    handleDisconnect(socketId);
    sockets.delete(socketId);
    heartbeats.delete(socketId);
  });
}

function handleEvent(socketId: string, event: ClientEvent): void {
  switch (event.type) {
    case 'heartbeat':
      heartbeats.set(socketId, Date.now());
      break;
    case 'create_room':
      handleCreateRoom(socketId, event.nickname);
      break;
    case 'join_room':
      handleJoinRoom(socketId, event.code, event.nickname);
      break;
    case 'leave_room':
      handleLeaveRoom(socketId);
      break;
    case 'start_game':
      handleStartGame(socketId);
      break;
    case 'submit_challenge':
      handleSubmitChallenge(socketId, event.answer);
      break;
    case 'pass_bomb':
      handlePassBomb(socketId, event.targetPlayerId);
      break;
    case 'reconnect':
      handleReconnect(socketId, event.playerId, event.roomCode);
      break;
  }
}

function handleCreateRoom(socketId: string, nickname: string): void {
  const error = validateNickname(nickname);
  if (error) {
    sendToSocket(socketId, { type: 'error', message: error, errorCode: 'INVALID_NICKNAME' });
    return;
  }

  const room = roomStore.createRoom(nickname, socketId);
  if (!room) {
    sendToSocket(socketId, { type: 'error', message: 'Impossible de créer le salon', errorCode: 'ROOM_CREATION_FAILED' });
    return;
  }

  const player = Array.from(room.players.values())[0];
  sendToSocket(socketId, {
    type: 'room_created',
    code: room.code,
    playerId: player.id,
    players: [gameLoop.toPublicPlayer(player)],
  });
}

function handleJoinRoom(socketId: string, code: string, nickname: string): void {
  const error = validateNickname(nickname);
  if (error) {
    sendToSocket(socketId, { type: 'error', message: error, errorCode: 'INVALID_NICKNAME' });
    return;
  }

  const room = roomStore.getRoom(code);
  if (!room) {
    sendToSocket(socketId, { type: 'error', message: 'Salon introuvable', errorCode: 'ROOM_NOT_FOUND' });
    return;
  }

  if (room.gameState.status !== 'waiting') {
    sendToSocket(socketId, { type: 'error', message: 'La partie a déjà commencé', errorCode: 'GAME_IN_PROGRESS' });
    return;
  }

  if (room.players.size >= MAX_PLAYERS) {
    sendToSocket(socketId, { type: 'error', message: 'Le salon est complet', errorCode: 'ROOM_FULL' });
    return;
  }

  // Check nickname uniqueness
  for (const p of room.players.values()) {
    if (p.nickname.toLowerCase() === nickname.toLowerCase()) {
      sendToSocket(socketId, { type: 'error', message: 'Ce pseudonyme est déjà pris', errorCode: 'NICKNAME_TAKEN' });
      return;
    }
  }

  const playerId = uuid();
  const player: Player = {
    id: playerId,
    nickname,
    lives: 0,
    status: 'alive',
    isHost: false,
    joinedAt: Date.now(),
    socketId,
    disconnectedAt: null,
    disconnectTimer: null,
  };

  room.players.set(playerId, player);
  room.lastActivityAt = Date.now();

  // Send to the new player
  const allPlayers = Array.from(room.players.values()).map(p => gameLoop.toPublicPlayer(p));
  sendToSocket(socketId, {
    type: 'room_joined',
    playerId,
    players: allPlayers,
  });

  // Notify existing players
  broadcastToRoomExcept(room, socketId, {
    type: 'player_joined',
    player: gameLoop.toPublicPlayer(player),
  });
}

function handleLeaveRoom(socketId: string): void {
  const found = roomStore.findPlayerRoom(socketId);
  if (!found) return;

  const { room, player } = found;
  removePlayerFromRoom(room, player);
}

function handleStartGame(socketId: string): void {
  const found = roomStore.findPlayerRoom(socketId);
  if (!found) {
    sendToSocket(socketId, { type: 'error', message: 'Salon introuvable', errorCode: 'NOT_IN_ROOM' });
    return;
  }

  const { room, player } = found;

  if (!player.isHost) {
    sendToSocket(socketId, { type: 'error', message: 'Seul l\'hôte peut lancer la partie', errorCode: 'NOT_HOST' });
    return;
  }

  if (room.gameState.status !== 'waiting') {
    sendToSocket(socketId, { type: 'error', message: 'Une partie est déjà en cours', errorCode: 'GAME_IN_PROGRESS' });
    return;
  }

  if (room.players.size < MIN_PLAYERS) {
    sendToSocket(socketId, { type: 'error', message: `Il faut au minimum ${MIN_PLAYERS} joueurs`, errorCode: 'NOT_ENOUGH_PLAYERS' });
    return;
  }

  gameLoop.startGame(room);
}

function handleSubmitChallenge(socketId: string, answer: string | number | string[]): void {
  const found = roomStore.findPlayerRoom(socketId);
  if (!found) return;

  const { room, player } = found;
  const state = room.gameState;

  if (state.status !== 'playing') return;
  if (state.activePlayerId !== player.id) return;
  if (state.challengeResolved) return;
  if (!state.currentChallenge) return;

  // For reflex challenge, record when stimulus was shown (server-side timing)
  if (state.currentChallenge.type === 'reflex') {
    const payload = state.currentChallenge.payload as import('./types').ReflexChallengePayload;
    if (!payload.stimulusShownAt) {
      // Calculate when stimulus appeared (generatedAt + delay)
      payload.stimulusShownAt = state.currentChallenge.generatedAt + payload.delay;
    }
  }

  const success = validateChallengeAnswer(state.currentChallenge, answer);

  broadcastToRoom(room, {
    type: 'challenge_result',
    success,
    playerId: player.id,
  });

  if (success) {
    state.challengeResolved = true;
  } else {
    // Generate new challenge on failure
    state.currentChallenge = generateChallenge();
    state.challengeResolved = false;

    broadcastToRoom(room, {
      type: 'challenge_assigned',
      activePlayerId: player.id,
      challenge: getChallengePublicData(state.currentChallenge),
    });
  }
}

function handlePassBomb(socketId: string, targetPlayerId: string): void {
  const found = roomStore.findPlayerRoom(socketId);
  if (!found) return;

  const { room, player } = found;

  if (room.gameState.status !== 'playing') return;

  const success = gameLoop.onPassBomb(room, player.id, targetPlayerId);
  if (!success) {
    sendToSocket(socketId, { type: 'error', message: 'Passage de bombe invalide', errorCode: 'INVALID_PASS' });
  }
}

function handleReconnect(socketId: string, playerId: string, roomCode: string): void {
  const room = roomStore.getRoom(roomCode);
  if (!room) {
    sendToSocket(socketId, { type: 'error', message: 'Salon introuvable', errorCode: 'ROOM_NOT_FOUND' });
    return;
  }

  const player = room.players.get(playerId);
  if (!player) {
    sendToSocket(socketId, { type: 'error', message: 'Joueur introuvable', errorCode: 'PLAYER_NOT_FOUND' });
    return;
  }

  if (player.disconnectTimer) {
    clearTimeout(player.disconnectTimer);
    player.disconnectTimer = null;
  }

  player.socketId = socketId;
  player.disconnectedAt = null;
  if (player.lives > 0) {
    player.status = 'alive';
  }

  // Send full game state
  const allPlayers = Array.from(room.players.values()).map(p => gameLoop.toPublicPlayer(p));
  const publicState = {
    status: room.gameState.status,
    activePlayerId: room.gameState.activePlayerId,
    currentChallenge: room.gameState.currentChallenge
      ? getChallengePublicData(room.gameState.currentChallenge)
      : null,
    players: allPlayers,
    roundNumber: room.gameState.roundNumber,
    challengeResolved: room.gameState.challengeResolved,
  };

  sendToSocket(socketId, { type: 'reconnected', gameState: publicState });
}

function handleDisconnect(socketId: string): void {
  const found = roomStore.findPlayerRoom(socketId);
  if (!found) return;

  const { room, player } = found;

  if (room.gameState.status === 'waiting') {
    removePlayerFromRoom(room, player);
    return;
  }

  if (player.status === 'spectator') {
    player.socketId = null;
    return;
  }

  // In-game disconnect: start grace period
  player.socketId = null;
  player.disconnectedAt = Date.now();
  player.status = 'disconnected';

  player.disconnectTimer = setTimeout(() => {
    if (player.status !== 'disconnected') return;

    const isActive = room.gameState.activePlayerId === player.id;

    if (isActive) {
      // Transfer bomb to another survivor
      const survivors = gameLoop.getSurvivors(room).filter(p => p.id !== player.id);
      if (survivors.length > 0) {
        const target = pickRandom(survivors);
        room.gameState.activePlayerId = target.id;
        room.gameState.currentChallenge = generateChallenge();
        room.gameState.challengeResolved = false;

        broadcastToRoom(room, {
          type: 'challenge_assigned',
          activePlayerId: target.id,
          challenge: getChallengePublicData(room.gameState.currentChallenge),
        });
      }
    }

    // Eliminate player
    player.status = 'spectator';
    player.lives = 0;
    room.gameState.eliminationOrder.push(player.id);

    broadcastToRoom(room, {
      type: 'player_disconnected',
      playerId: player.id,
      reason: 'timeout',
    });

    // Check win condition
    const remaining = gameLoop.getSurvivors(room);
    if (remaining.length <= 1) {
      gameLoop.endGame(room, remaining[0] || null);
    }
  }, RECONNECT_GRACE_PERIOD_MS);
}

function removePlayerFromRoom(room: Room, player: Player): void {
  room.players.delete(player.id);

  // If room is empty, delete it
  if (room.players.size === 0) {
    roomStore.deleteRoom(room.code);
    return;
  }

  // If host left, assign new host
  let newHostId: string | null = null;
  if (player.isHost) {
    const oldest = Array.from(room.players.values())
      .sort((a, b) => a.joinedAt - b.joinedAt)[0];
    if (oldest) {
      oldest.isHost = true;
      newHostId = oldest.id;
    }
  }

  broadcastToRoom(room, {
    type: 'player_left',
    playerId: player.id,
    newHostId,
  });
}

// ========== Broadcast utilities ==========

function broadcastToRoom(room: Room, event: ServerEvent): void {
  const message = JSON.stringify(event);
  for (const player of room.players.values()) {
    if (player.socketId) {
      const ws = sockets.get(player.socketId);
      if (ws && ws.readyState === 1) { // WebSocket.OPEN
        ws.send(message);
      }
    }
  }
}

function broadcastToRoomExcept(room: Room, excludeSocketId: string, event: ServerEvent): void {
  const message = JSON.stringify(event);
  for (const player of room.players.values()) {
    if (player.socketId && player.socketId !== excludeSocketId) {
      const ws = sockets.get(player.socketId);
      if (ws && ws.readyState === 1) {
        ws.send(message);
      }
    }
  }
}

function sendToSocket(socketId: string, event: ServerEvent): void {
  const ws = sockets.get(socketId);
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(event));
  }
}
