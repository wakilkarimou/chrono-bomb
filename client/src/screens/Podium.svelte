<script lang="ts">
  import { rankings, playerId, currentScreen, gameState, players } from '../lib/stores';
  import { send } from '../lib/ws-client';

  $: sorted = [...$rankings].sort((a, b) => a.position - b.position);

  function backToLobby() {
    gameState.set(null);
    currentScreen.set('lobby');
  }

  const medals = ['🥇', '🥈', '🥉'];
</script>

<div class="podium">
  <h1>🏆 Fin de la partie !</h1>

  <div class="rankings">
    {#each sorted as entry, i}
      <div class="rank-entry" class:is-me={entry.playerId === $playerId} class:winner={entry.position === 1}>
        <span class="position">
          {#if i < 3}
            {medals[i]}
          {:else}
            #{entry.position}
          {/if}
        </span>
        <span class="nickname">{entry.nickname}</span>
        {#if entry.playerId === $playerId}
          <span class="you-badge">Toi</span>
        {/if}
      </div>
    {/each}
  </div>

  <button class="btn-back" on:click={backToLobby}>
    🏠 Retour au salon
  </button>
</div>

<style>
  .podium {
    text-align: center;
    max-width: 450px;
    width: 100%;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
  }

  .rankings {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 2rem;
  }

  .rank-entry {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .rank-entry.winner {
    background: rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.3);
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
  }

  .rank-entry.is-me {
    border-color: rgba(168, 85, 247, 0.4);
  }

  .position {
    font-size: 1.5rem;
    min-width: 2.5rem;
  }

  .nickname {
    flex: 1;
    font-weight: 600;
    text-align: left;
  }

  .you-badge {
    font-size: 0.75rem;
    background: rgba(168, 85, 247, 0.2);
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    color: #c084fc;
  }

  .btn-back {
    background: linear-gradient(135deg, #a855f7, #7c3aed);
    color: white;
    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
</style>
