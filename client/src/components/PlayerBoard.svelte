<script lang="ts">
  import type { PublicPlayer } from '../shared';

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
      <span class="name">{player.nickname}</span>
      <div class="lives">
        {#each Array(3) as _, i}
          <span class="heart" class:lost={i >= player.lives}>
            {i < player.lives ? '❤️' : '🖤'}
          </span>
        {/each}
      </div>
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
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 2px solid transparent;
    text-align: center;
    transition: all 0.3s;
  }

  .player-card.active {
    border-color: #f59e0b;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
  }

  .player-card.is-me {
    background: rgba(168, 85, 247, 0.08);
  }

  .player-card.eliminated {
    opacity: 0.4;
    filter: grayscale(0.8);
  }

  .name {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lives {
    display: flex;
    justify-content: center;
    gap: 2px;
    font-size: 0.8rem;
  }

  .bomb-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 1.2rem;
    animation: bomb-mini-pulse 0.5s infinite alternate;
  }

  @keyframes bomb-mini-pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
  }
</style>
