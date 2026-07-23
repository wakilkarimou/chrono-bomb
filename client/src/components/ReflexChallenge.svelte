<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { send } from '../lib/ws-client';

  export let delay: number;

  let phase: 'waiting' | 'ready' | 'tooEarly' | 'done' = 'waiting';
  let timer: ReturnType<typeof setTimeout>;

  onMount(() => {
    timer = setTimeout(() => {
      phase = 'ready';
    }, delay);
  });

  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });

  function onTap() {
    if (phase === 'done') return;

    if (phase === 'waiting') {
      phase = 'tooEarly';
      clearTimeout(timer);
      send({ type: 'submit_challenge', answer: -1 });
    } else if (phase === 'ready') {
      phase = 'done';
      send({ type: 'submit_challenge', answer: Date.now() });
    }
  }
</script>

<div class="challenge" role="button" tabindex="0" on:click={onTap} on:keydown={(e) => e.key === ' ' && onTap()}>
  {#if phase === 'waiting'}
    <div class="circle red">
      <span>⏳</span>
      <p>Attends le signal...</p>
    </div>
  {:else if phase === 'ready'}
    <div class="circle green">
      <span>👆</span>
      <p>TAP !</p>
    </div>
  {:else if phase === 'tooEarly'}
    <div class="circle orange">
      <span>❌</span>
      <p>Trop tôt !</p>
    </div>
  {:else}
    <div class="circle blue">
      <span>✅</span>
      <p>Bien joué !</p>
    </div>
  {/if}
</div>

<style>
  .challenge {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    min-height: 220px;
  }

  .circle {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .circle span {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .circle p {
    font-weight: 700;
    font-size: 1.2rem;
  }

  .circle.red {
    background: rgba(239, 68, 68, 0.2);
    border: 3px solid #ef4444;
    color: #fca5a5;
  }

  .circle.green {
    background: rgba(34, 197, 94, 0.2);
    border: 3px solid #22c55e;
    color: #86efac;
    animation: pop 0.2s ease-out;
  }

  .circle.orange {
    background: rgba(251, 146, 60, 0.2);
    border: 3px solid #fb923c;
    color: #fdba74;
  }

  .circle.blue {
    background: rgba(96, 165, 250, 0.2);
    border: 3px solid #60a5fa;
    color: #93c5fd;
  }

  @keyframes pop {
    0% { transform: scale(0.9); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
</style>
