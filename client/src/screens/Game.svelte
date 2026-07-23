<script lang="ts">
  import { send } from '../lib/ws-client';
  import { players, playerId, gameState, isActivePlayer, urgencyLevel, challengeResolved, alivePlayers } from '../lib/stores';
  import WordChallenge from '../components/WordChallenge.svelte';
  import ReflexChallenge from '../components/ReflexChallenge.svelte';
  import PatternChallenge from '../components/PatternChallenge.svelte';
  import MathChallenge from '../components/MathChallenge.svelte';
  import ReverseChallenge from '../components/ReverseChallenge.svelte';
  import BombAnimation from '../components/BombAnimation.svelte';
  import UrgencyGauge from '../components/UrgencyGauge.svelte';
  import PlayerBoard from '../components/PlayerBoard.svelte';

  $: challenge = $gameState?.currentChallenge;
  $: activePlayer = $players.find(p => p.id === $gameState?.activePlayerId);
  $: passTargets = $alivePlayers.filter(p => p.id !== $playerId);

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
          {#if challenge.type === 'word_category'}
            <WordChallenge category={challenge.category || ''} />
          {:else if challenge.type === 'reflex'}
            <ReflexChallenge delay={challenge.delay || 2000} />
          {:else if challenge.type === 'pattern'}
            <PatternChallenge sequence={challenge.sequence || []} colors={challenge.colors || []} />
          {:else if challenge.type === 'math'}
            <MathChallenge expression={challenge.expression || ''} />
          {:else if challenge.type === 'reverse'}
            <ReverseChallenge reversedWord={challenge.reversedWord || ''} />
          {/if}
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
</div>

<style>
  .game {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    color: #f59e0b;
    text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
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
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    box-shadow: 0 3px 10px rgba(245, 158, 11, 0.3);
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
</style>
