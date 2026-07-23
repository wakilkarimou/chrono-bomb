import { MAX_ROOMS, ROOM_CLEANUP_DELAY_MS } from './shared';
import type { Room, Player, GameState } from './types';
import { generateRoomCode } from './utils';
import { v4 as uuid } from 'uuid';

export class RoomStore {
  private rooms: Map<string, Room> = new Map();

  createRoom(nickname: string, avatar: string, socketId: string, mode: 'classic' | 'speed' | 'hardcore'): Room | null {
    if (this.rooms.size >= MAX_ROOMS) return null;

    let code: string | null = null;
    for (let i = 0; i < 10; i++) {
      const candidate = generateRoomCode();
      if (!this.rooms.has(candidate)) {
        code = candidate;
        break;
      }
    }
    if (!code) return null;

    const playerId = uuid();
    const player: Player = {
      id: playerId,
      nickname,
      avatar,
      lives: 0,
      status: 'alive',
      isHost: true,
      joinedAt: Date.now(),
      socketId,
      disconnectedAt: null,
      disconnectTimer: null,
    };

    const gameState: GameState = {
      status: 'waiting',
      activePlayerId: null,
      currentChallenge: null,
      secretTimer: { duration: 0, startedAt: 0, timerRef: null },
      urgency: { currentLevel: 'low', signalTimerRef: null, thresholds: { medium: 0, high: 0 } },
      roundNumber: 0,
      eliminationOrder: [],
      challengeResolved: false,
    };

    const room: Room = {
      code,
      mode,
      players: new Map([[playerId, player]]),
      gameState,
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      cleanupTimer: null,
    };

    this.rooms.set(code, room);
    return room;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  deleteRoom(code: string): void {
    const room = this.rooms.get(code);
    if (room) {
      // Clean up all timers
      if (room.gameState.secretTimer.timerRef) {
        clearTimeout(room.gameState.secretTimer.timerRef);
      }
      if (room.gameState.urgency.signalTimerRef) {
        clearTimeout(room.gameState.urgency.signalTimerRef);
      }
      if (room.cleanupTimer) {
        clearTimeout(room.cleanupTimer);
      }
      for (const player of room.players.values()) {
        if (player.disconnectTimer) {
          clearTimeout(player.disconnectTimer);
        }
      }
      this.rooms.delete(code);
    }
  }

  scheduleCleanup(code: string): void {
    const room = this.rooms.get(code);
    if (!room) return;

    if (room.cleanupTimer) {
      clearTimeout(room.cleanupTimer);
    }

    room.cleanupTimer = setTimeout(() => {
      this.deleteRoom(code);
    }, ROOM_CLEANUP_DELAY_MS);
  }

  getRoomCount(): number {
    return this.rooms.size;
  }

  findPlayerRoom(socketId: string): { room: Room; player: Player } | null {
    for (const room of this.rooms.values()) {
      for (const player of room.players.values()) {
        if (player.socketId === socketId) {
          return { room, player };
        }
      }
    }
    return null;
  }

  findByPlayerId(playerId: string): { room: Room; player: Player } | null {
    for (const room of this.rooms.values()) {
      const player = room.players.get(playerId);
      if (player) return { room, player };
    }
    return null;
  }
}

export const roomStore = new RoomStore();
