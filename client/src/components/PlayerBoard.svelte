<script lang="ts">
  import type { PublicPlayer } from '../shared';
  import { killCounts } from '../lib/stores';

  export let players: PublicPlayer[] = [];
  export let activePlayerId: string | null = null;
  export let myId: string | null = null;
</script>

<div class="board">
  {#each players as player}
    <div
      class="player-card"
      class:active={player.id === activePlayerId}
      class:eliminated={player.status === 'spectator'}
      class:is-me={player.id === myId}
    >
      <span class="name">{player.avatar} {player.nickname}</span>
      <div class="lives">
        {#each Array(3) as _, i}
          <span class="heart" class:lost={i >= player.lives}>
            {i < player.lives ? '❤️' : '🖤'}
          </span>
        {/each}
      </div>
      {#if $killCounts[player.id]}
        <span class="kill-count">🎯{$killCounts[player.id]}</span>
      {/if}
      {#if player.id === activePlayerId}
        <span class="bomb-icon">💣</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
    width: 100%;
    margin-top: 1rem;
  }

  .player-card {
    position: relative;
    padding: 0.6rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    border: 2px solid rgba(255, 255, 255, 0.08);
    text-align: center;
    transition: all 0.3s;
  }

  .player-card.active {
    border-color: #ff0000;
    box-shadow: 0 0 12px rgba(255, 0, 0, 0.4);
    background: rgba(255, 0, 0, 0.06);
  }

  .player-card.is-me {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .player-card.eliminated {
    opacity: 0.35;
    filter: grayscale(0.8);
  }

  .name {
    display: block;
    font-size: 0.5rem;
    margin-bottom: 0.3rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lives {
    display: flex;
    justify-content: center;
    gap: 1px;
    font-size: 0.7rem;
  }

  .kill-count {
    display: block;
    font-size: 0.4rem;
    margin-top: 0.2rem;
    opacity: 0.6;
    color: #ff4444;
  }

  .bomb-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 1rem;
    animation: bomb-mini-pulse 0.5s infinite alternate;
  }

  @keyframes bomb-mini-pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
  }
</style>
