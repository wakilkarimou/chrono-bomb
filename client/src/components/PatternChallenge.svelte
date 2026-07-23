<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { send } from '../lib/ws-client';

  export let sequence: string[];
  export let colors: string[];

  let showingSequence = true;
  let highlightedColor: string | null = null;
  let playerInput: string[] = [];
  let timeLeft = 5;
  let countdownTimer: ReturnType<typeof setInterval> | null = null;

  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
  };

  onMount(async () => {
    // Show sequence
    for (const color of sequence) {
      highlightedColor = color;
      await sleep(800);
      highlightedColor = null;
      await sleep(200);
    }
    showingSequence = false;

    // Start countdown
    countdownTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        if (countdownTimer) clearInterval(countdownTimer);
        send({ type: 'submit_challenge', answer: playerInput });
      }
    }, 1000);
  });

  onDestroy(() => {
    if (countdownTimer) clearInterval(countdownTimer);
  });

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function selectColor(color: string) {
    if (showingSequence) return;
    playerInput = [...playerInput, color];
    if (playerInput.length === sequence.length) {
      if (countdownTimer) clearInterval(countdownTimer);
      send({ type: 'submit_challenge', answer: playerInput });
    }
  }
</script>

<div class="challenge">
  {#if showingSequence}
    <p class="instruction">👀 Mémorise la séquence...</p>
  {:else}
    <p class="instruction">🎨 Reproduis la séquence ! <span class="timer" class:urgent={timeLeft <= 2}>{timeLeft}s</span></p>
  {/if}

  <div class="color-grid">
    {#each colors as color}
      <button
        class="color-btn"
        style="background-color: {colorMap[color] || color}; opacity: {highlightedColor === color ? 1 : (showingSequence ? 0.3 : 0.8)};
               transform: {highlightedColor === color ? 'scale(1.15)' : 'scale(1)'}"
        disabled={showingSequence}
        on:click={() => selectColor(color)}
        aria-label={color}
      ></button>
    {/each}
  </div>

  <div class="progress">
    {#each sequence as _, i}
      <span class="dot" class:filled={i < playerInput.length}></span>
    {/each}
  </div>
</div>

<style>
  .challenge {
    text-align: center;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .instruction {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .timer {
    font-weight: 700;
  }

  .timer.urgent {
    color: #ef4444;
  }

  .color-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    max-width: 250px;
    margin: 0 auto;
  }

  .color-btn {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 16px;
    border: 3px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s;
    padding: 0;
  }

  .color-btn:not(:disabled):hover {
    transform: scale(1.1) !important;
    border-color: rgba(255, 255, 255, 0.5);
  }

  .progress {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all 0.2s;
  }

  .dot.filled {
    background: #a855f7;
    border-color: #a855f7;
  }
</style>
