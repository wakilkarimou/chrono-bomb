import { INITIAL_LIVES, SECRET_TIMER_MIN, SECRET_TIMER_MAX } from './shared';
import type { Room, Player } from './types';
import type { ServerEvent } from './shared';
import { generateChallenge, getChallengePublicData } from './challenges';
import { randomInt, pickRandom } from './utils';

type BroadcastFn = (room: Room, event: ServerEvent) => void;
type SendToPlayerFn = (socketId: string, event: ServerEvent) => void;

export class GameLoop {
  constructor(
    private broadcast: BroadcastFn,
    private sendToPlayer: SendToPlayerFn,
  ) {}

  startGame(room: Room): void {
    const players = Array.from(room.players.values());
    const state = room.gameState;

    // Initialize all players with lives
    for (const player of players) {
      player.lives = INITIAL_LIVES;
      player.status = 'alive';
    }

    state.status = 'playing';
    state.roundNumber = 1;
    state.eliminationOrder = [];

    // Pick random first active player
    const firstActive = pickRandom(players);
    state.activePlayerId = firstActive.id;

    // Generate first challenge
    state.currentChallenge = generateChallenge();
    state.challengeResolved = false;

    // Notify all players
    this.broadcast(room, {
      type: 'game_started',
      players: players.map(p => this.toPublicPlayer(p)),
      activePlayerId: firstActive.id,
    });

    // Send challenge to all
    this.broadcast(room, {
      type: 'challenge_assigned',
      activePlayerId: firstActive.id,
      challenge: getChallengePublicData(state.currentChallenge),
    });

    // Start secret timer
    this.startSecretTimer(room);
  }

  startSecretTimer(room: Room): void {
    const state = room.gameState;
    const duration = randomInt(SECRET_TIMER_MIN, SECRET_TIMER_MAX);

    // Clear existing timer if any
    if (state.secretTimer.timerRef) {
      clearTimeout(state.secretTimer.timerRef);
    }
    if (state.urgency.signalTimerRef) {
      clearTimeout(state.urgency.signalTimerRef);
    }

    state.secretTimer = {
      duration,
      startedAt: Date.now(),
      timerRef: setTimeout(() => this.onBombExplode(room), duration * 1000),
    };

    // Urgency thresholds with random offset (±2s)
    const third = (duration * 1000) / 3;
    state.urgency = {
      currentLevel: 'low',
      signalTimerRef: null,
      thresholds: {
        medium: state.secretTimer.startedAt + third + randomInt(-2000, 2000),
        high: state.secretTimer.startedAt + 2 * third + randomInt(-2000, 2000),
      },
    };

    this.scheduleUrgencySignal(room);
  }

  private scheduleUrgencySignal(room: Room): void {
    const state = room.gameState;
    const delay = randomInt(1000, 3000);

    state.urgency.signalTimerRef = setTimeout(() => {
      if (state.status !== 'playing') return;

      const now = Date.now();
      if (now >= state.urgency.thresholds.high) {
        state.urgency.currentLevel = 'high';
      } else if (now >= state.urgency.thresholds.medium) {
        state.urgency.currentLevel = 'medium';
      }

      this.broadcast(room, {
        type: 'urgency_signal',
        level: state.urgency.currentLevel,
      });

      this.scheduleUrgencySignal(room);
    }, delay);
  }

  private onBombExplode(room: Room): void {
    const state = room.gameState;
    const activePlayer = room.players.get(state.activePlayerId!);
    if (!activePlayer) return;

    // Stop urgency signals
    if (state.urgency.signalTimerRef) {
      clearTimeout(state.urgency.signalTimerRef);
      state.urgency.signalTimerRef = null;
    }

    activePlayer.lives -= 1;
    const eliminated = activePlayer.lives <= 0;

    if (eliminated) {
      activePlayer.status = 'spectator';
      state.eliminationOrder.push(activePlayer.id);
    }

    this.broadcast(room, {
      type: 'bomb_exploded',
      playerId: activePlayer.id,
      livesRemaining: activePlayer.lives,
      eliminated,
    });

    // Check win condition
    const survivors = this.getSurvivors(room);
    if (survivors.length <= 1) {
      this.endGame(room, survivors[0] || null);
    } else {
      // Short delay before new round so clients show explosion feedback
      setTimeout(() => {
        if (room.gameState.status === 'playing') {
          this.startNewRound(room, this.getSurvivors(room));
        }
      }, 2000);
    }
  }

  private startNewRound(room: Room, survivors: Player[]): void {
    const state = room.gameState;
    state.roundNumber += 1;

    // Pick new random active player from survivors
    const newActive = pickRandom(survivors);
    state.activePlayerId = newActive.id;
    state.currentChallenge = generateChallenge();
    state.challengeResolved = false;

    this.broadcast(room, {
      type: 'new_round',
      roundNumber: state.roundNumber,
      activePlayerId: newActive.id,
    });

    this.broadcast(room, {
      type: 'challenge_assigned',
      activePlayerId: newActive.id,
      challenge: getChallengePublicData(state.currentChallenge),
    });

    this.startSecretTimer(room);
  }

  endGame(room: Room, winner: Player | null): void {
    const state = room.gameState;

    // Clear timers
    if (state.secretTimer.timerRef) {
      clearTimeout(state.secretTimer.timerRef);
      state.secretTimer.timerRef = null;
    }
    if (state.urgency.signalTimerRef) {
      clearTimeout(state.urgency.signalTimerRef);
      state.urgency.signalTimerRef = null;
    }

    state.status = 'finished';
    state.activePlayerId = null;
    state.currentChallenge = null;

    // Build rankings
    const rankings: { playerId: string; nickname: string; position: number }[] = [];

    if (winner) {
      rankings.push({ playerId: winner.id, nickname: winner.nickname, position: 1 });
    }

    // Eliminated in reverse order (last eliminated = position 2)
    const eliminated = [...state.eliminationOrder].reverse();
    eliminated.forEach((id, index) => {
      const player = room.players.get(id);
      if (player) {
        rankings.push({ playerId: id, nickname: player.nickname, position: index + 2 });
      }
    });

    this.broadcast(room, {
      type: 'game_over',
      winnerId: winner?.id || '',
      rankings,
    });
  }

  onPassBomb(room: Room, fromPlayerId: string, targetPlayerId: string): boolean {
    const state = room.gameState;
    if (state.activePlayerId !== fromPlayerId) return false;
    if (!state.challengeResolved) return false;
    if (targetPlayerId === fromPlayerId) return false;

    const target = room.players.get(targetPlayerId);
    if (!target || target.status !== 'alive') return false;

    state.activePlayerId = targetPlayerId;
    state.currentChallenge = generateChallenge();
    state.challengeResolved = false;

    this.broadcast(room, {
      type: 'bomb_passed',
      fromPlayerId,
      toPlayerId: targetPlayerId,
    });

    this.broadcast(room, {
      type: 'challenge_assigned',
      activePlayerId: targetPlayerId,
      challenge: getChallengePublicData(state.currentChallenge),
    });

    return true;
  }

  getSurvivors(room: Room): Player[] {
    return Array.from(room.players.values()).filter(
      p => p.status === 'alive' && p.lives > 0
    );
  }

  toPublicPlayer(player: Player) {
    return {
      id: player.id,
      nickname: player.nickname,
      lives: player.lives,
      status: player.status,
      isHost: player.isHost,
    };
  }
}
