<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let count = 3;
  let phase: '3' | '2' | '1' | 'go' | 'done' = '3';

  onMount(() => {
    const interval = setInterval(() => {
      count--;
      if (count === 2) phase = '2';
      else if (count === 1) phase = '1';
      else if (count === 0) { phase = 'go'; }
      else if (count < 0) {
        clearInterval(interval);
        phase = 'done';
        dispatch('complete');
      }
    }, 800);

    return () => clearInterval(interval);
  });
</script>

{#if phase !== 'done'}
  <div class="countdown-overlay">
    <div class="countdown-content" class:go={phase === 'go'}>
      {#if phase === 'go'}
        <span class="count-text go-text">GO!</span>
      {:else}
        <span class="count-text">{count}</span>
      {/if}
    </div>
  </div>
{/if}

<style>
  .countdown-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .countdown-content {
    animation: pop-in 0.4s ease-out;
  }

  .count-text {
    font-size: 4rem;
    color: #ff0000;
    text-shadow:
      0 0 20px rgba(255, 0, 0, 0.8),
      0 0 40px rgba(255, 0, 0, 0.4);
    animation: pulse-count 0.8s ease-in-out;
  }

  .go-text {
    color: #4ade80;
    text-shadow:
      0 0 20px rgba(74, 222, 128, 0.8),
      0 0 40px rgba(74, 222, 128, 0.4);
  }

  @keyframes pop-in {
    0% { transform: scale(2); opacity: 0; }
    50% { transform: scale(0.9); opacity: 1; }
    100% { transform: scale(1); }
  }

  @keyframes pulse-count {
    0% { transform: scale(1.5); opacity: 0; }
    30% { transform: scale(1); opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0.3; transform: scale(0.8); }
  }
</style>
