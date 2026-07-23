<script lang="ts">
  import { rankings, playerId, currentScreen, gameState, players, roomCode, isHost, killCounts } from '../lib/stores';
  import { send } from '../lib/ws-client';
  import Confetti from '../components/Confetti.svelte';

  $: sorted = [...$rankings].sort((a, b) => a.position - b.position);
  $: myRank = sorted.find(e => e.playerId === $playerId);
  $: isWinner = myRank?.position === 1;

  function rematch() {
    gameState.set(null);
    killCounts.set({});
    send({ type: 'start_game', mode: 'classic' });
  }

  function playAgain() {
    gameState.set(null);
    killCounts.set({});
    currentScreen.set('lobby');
  }

  function goHome() {
    send({ type: 'leave_room' });
    gameState.set(null);
    killCounts.set({});
    roomCode.set(null);
    playerId.set(null);
    players.set([]);
    currentScreen.set('home');
  }

  const medals = ['🥇', '🥈', '🥉'];
</script>

<div class="podium">
  {#if isWinner}
    <Confetti />
  {/if}

  <div class="result-header">
    {#if isWinner}
      <span class="winner-emoji">🎉</span>
      <h1>Victoire !</h1>
      <p class="result-subtitle">Tu es le dernier survivant</p>
    {:else}
      <span class="winner-emoji">💥</span>
      <h1>Partie terminée</h1>
      <p class="result-subtitle">Tu finis #{myRank?.position || '?'}</p>
    {/if}
  </div>

  <div class="rankings">
    {#each sorted as entry, i}
      <div class="rank-entry" class:is-me={entry.playerId === $playerId} class:winner={entry.position === 1}>
        <span class="position">
          {#if i < 3}
            {medals[i]}
          {:else}
            <span class="position-number">#{entry.position}</span>
          {/if}
        </span>
        <span class="nickname">{entry.nickname}</span>
        {#if entry.playerId === $playerId}
          <span class="you-badge">Toi</span>
        {/if}
      </div>
    {/each}
  </div>

  <div class="actions">
    {#if $isHost}
      <button class="btn-rematch" on:click={rematch}>
        ⚡ REVANCHE
      </button>
    {/if}
    <button class="btn-play-again" on:click={playAgain}>
      🔄 RETOUR AU SALON
    </button>
    <button class="btn-home" on:click={goHome}>
      QUITTER
    </button>
  </div>
</div>

<style>
  .podium {
    text-align: center;
    max-width: 450px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;
    justify-content: center;
  }

  .result-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .winner-emoji {
    font-size: 3.5rem;
    animation: bounce 0.6s ease-out;
  }

  h1 {
    font-size: 1.8rem;
    margin: 0;
    text-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
  }

  .result-subtitle {
    opacity: 0.6;
    font-size: 1rem;
  }

  .rankings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rank-entry {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    animation: slide-in 0.3s ease-out backwards;
  }

  .rank-entry:nth-child(1) { animation-delay: 0.1s; }
  .rank-entry:nth-child(2) { animation-delay: 0.2s; }
  .rank-entry:nth-child(3) { animation-delay: 0.3s; }
  .rank-entry:nth-child(4) { animation-delay: 0.4s; }
  .rank-entry:nth-child(5) { animation-delay: 0.5s; }

  .rank-entry.winner {
    background: rgba(255, 0, 0, 0.08);
    border-color: rgba(255, 0, 0, 0.4);
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.15);
  }

  .rank-entry.is-me {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.04);
  }

  .position {
    font-size: 1.4rem;
    min-width: 2.5rem;
    text-align: center;
  }

  .position-number {
    font-size: 1rem;
    opacity: 0.6;
    font-weight: 700;
  }

  .nickname {
    flex: 1;
    font-weight: 600;
    text-align: left;
    font-size: 1rem;
  }

  .you-badge {
    font-size: 0.7rem;
    background: rgba(168, 85, 247, 0.2);
    padding: 0.15rem 0.4rem;
    border-radius: 6px;
    color: #c084fc;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 0.5rem;
  }

  .btn-play-again {
    background: #cc0000;
    color: white;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
    border: 2px solid #ff0000;
    padding: 1rem;
    font-size: 0.7rem;
  }

  .btn-rematch {
    background: #cc0000;
    color: white;
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.5);
    border: 2px solid #ff0000;
    padding: 1rem;
    font-size: 0.75rem;
    animation: rematch-glow 1s infinite alternate;
  }

  @keyframes rematch-glow {
    from { box-shadow: 0 0 15px rgba(255, 0, 0, 0.4); }
    to { box-shadow: 0 0 30px rgba(255, 0, 0, 0.7); }
  }

  .btn-home {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(240, 230, 255, 0.7);
    font-size: 0.9rem;
    padding: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @keyframes bounce {
    0% { transform: scale(0); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
