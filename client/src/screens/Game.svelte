<script lang="ts">
  import { send } from '../lib/ws-client';
  import { players, playerId, gameState, isActivePlayer, urgencyLevel, challengeResolved, alivePlayers, explosionEvent } from '../lib/stores';
  import WordChallenge from '../components/WordChallenge.svelte';
  import ReflexChallenge from '../components/ReflexChallenge.svelte';
  import PatternChallenge from '../components/PatternChallenge.svelte';
  import MathChallenge from '../components/MathChallenge.svelte';
  import ReverseChallenge from '../components/ReverseChallenge.svelte';
  import BombAnimation from '../components/BombAnimation.svelte';
  import UrgencyGauge from '../components/UrgencyGauge.svelte';
  import PlayerBoard from '../components/PlayerBoard.svelte';
  import EmojiBar from '../components/EmojiBar.svelte';
  import EmojiOverlay from '../components/EmojiOverlay.svelte';

  $: challenge = $gameState?.currentChallenge;
  $: activePlayer = $players.find(p => p.id === $gameState?.activePlayerId);
  $: passTargets = $alivePlayers.filter(p => p.id !== $playerId);

  // Unique key that changes every time a new challenge is assigned
  // Forces Svelte to destroy and recreate the challenge component
  let challengeKey = 0;
  $: if (challenge) { challengeKey++; }

  function passBomb(targetId: string) {
    send({ type: 'pass_bomb', targetPlayerId: targetId });
  }
</script>

<div class="game">
  <UrgencyGauge level={$urgencyLevel} />

  <div class="game-header">
    <h2>Round {$gameState?.roundNumber || 1}</h2>
    {#if activePlayer}
      <p class="active-indicator">
        💣 Bombe chez <strong class:is-me={$isActivePlayer}>{activePlayer.nickname}</strong>
        {#if $isActivePlayer}(TOI !){/if}
      </p>
    {/if}
  </div>

  <div class="game-content">
    {#if $isActivePlayer}
      <BombAnimation level={$urgencyLevel} />

      {#if $challengeResolved}
        <!-- Pass bomb phase -->
        <div class="pass-phase">
          <h3>✅ Défi réussi ! Passe la bombe :</h3>
          <div class="pass-targets">
            {#each passTargets as target}
              <button class="btn-pass" on:click={() => passBomb(target.id)}>
                💣→ {target.nickname}
              </button>
            {/each}
          </div>
        </div>
      {:else if challenge}
        <!-- Challenge phase -->
        <div class="challenge-phase">
          {#key challengeKey}
            {#if challenge.type === 'word_category'}
              <WordChallenge category={challenge.category || ''} options={challenge.options || []} />
            {:else if challenge.type === 'reflex'}
              <ReflexChallenge delay={challenge.delay || 2000} />
            {:else if challenge.type === 'pattern'}
              <PatternChallenge sequence={challenge.sequence || []} colors={challenge.colors || []} />
            {:else if challenge.type === 'math'}
              <MathChallenge expression={challenge.expression || ''} mathOptions={challenge.mathOptions || []} />
            {:else if challenge.type === 'reverse'}
              <ReverseChallenge reversedWord={challenge.reversedWord || ''} />
            {/if}
          {/key}
        </div>
      {/if}
    {:else}
      <!-- Spectator / Waiting view -->
      <div class="spectator-view">
        {#if activePlayer}
          <p class="watching">👀 {activePlayer.nickname} a la bombe...</p>
        {/if}
        {#if challenge}
          <div class="challenge-preview">
            {#if challenge.type === 'word_category'}
              <p>Défi : trouver un mot dans la catégorie <strong>{challenge.category}</strong></p>
            {:else if challenge.type === 'reflex'}
              <p>Défi : test de réflexe</p>
            {:else if challenge.type === 'pattern'}
              <p>Défi : reproduire un pattern de couleurs</p>
            {:else if challenge.type === 'math'}
              <p>Défi : calcul mental</p>
            {:else if challenge.type === 'reverse'}
              <p>Défi : mot inversé</p>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <PlayerBoard players={$players} activePlayerId={$gameState?.activePlayerId || null} myId={$playerId} />

  <EmojiBar />
  <EmojiOverlay />

  {#if $explosionEvent}
    <div class="explosion-overlay">
      <div class="explosion-content">
        <span class="explosion-emoji">💥</span>
        <p class="explosion-text">
          {$explosionEvent.nickname} a explosé !
        </p>
        {#if $explosionEvent.eliminated}
          <p class="elimination-text">☠️ Éliminé !</p>
        {:else}
          <p class="lives-text">❤️ {$explosionEvent.livesRemaining} vie{$explosionEvent.livesRemaining > 1 ? 's' : ''} restante{$explosionEvent.livesRemaining > 1 ? 's' : ''}</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .game {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
  }

  .game-header {
    text-align: center;
  }

  .game-header h2 {
    font-size: 1.2rem;
    opacity: 0.7;
    margin-bottom: 0.25rem;
  }

  .active-indicator {
    font-size: 1.1rem;
  }

  .active-indicator strong.is-me {
    color: #ff0000;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
  }

  .game-content {
    min-height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .pass-phase {
    text-align: center;
  }

  .pass-phase h3 {
    margin-bottom: 1rem;
    color: #4ade80;
  }

  .pass-targets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .btn-pass {
    background: #cc0000;
    color: white;
    box-shadow: 0 0 12px rgba(255, 0, 0, 0.35);
    border: 2px solid #ff0000;
    padding: 0.75rem 1.25rem;
  }

  .challenge-phase {
    width: 100%;
  }

  .spectator-view {
    text-align: center;
    padding: 2rem;
    opacity: 0.8;
  }

  .watching {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .challenge-preview {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 12px;
    font-size: 0.95rem;
    opacity: 0.7;
  }

  @media (max-width: 480px) {
    .game {
      gap: 0.75rem;
    }

    .game-content {
      min-height: 200px;
    }

    .pass-targets {
      flex-direction: column;
    }

    .btn-pass {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
    }

    .spectator-view {
      padding: 1rem;
    }

    .watching {
      font-size: 1.1rem;
    }
  }

  .explosion-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fade-in 0.15s ease-out;
  }

  .explosion-content {
    text-align: center;
    animation: explosion-pop 0.3s ease-out;
  }

  .explosion-emoji {
    font-size: 5rem;
    display: block;
    animation: shake-big 0.4s ease-out;
  }

  .explosion-text {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 1rem;
  }

  .elimination-text {
    font-size: 1.2rem;
    color: #ef4444;
    margin-top: 0.5rem;
  }

  .lives-text {
    font-size: 1.2rem;
    color: #fb923c;
    margin-top: 0.5rem;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes explosion-pop {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes shake-big {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
</style>
