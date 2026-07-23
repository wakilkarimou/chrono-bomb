<script lang="ts">
  import { onDestroy } from 'svelte';
  import { send } from '../lib/ws-client';

  export let reversedWord: string;

  let input = '';
  let timeLeft = 7;

  const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      send({ type: 'submit_challenge', answer: '' });
    }
  }, 1000);

  onDestroy(() => clearInterval(timer));

  function submit() {
    if (!input.trim()) return;
    clearInterval(timer);
    send({ type: 'submit_challenge', answer: input.trim() });
    input = '';
  }
</script>

<div class="challenge">
  <h3>🔄 Mot inversé !</h3>
  <p class="hint">Remets ce mot à l'endroit :</p>
  <p class="reversed-word">{reversedWord}</p>
  <div class="input-row">
    <input
      bind:value={input}
      placeholder="Le mot à l'endroit..."
      maxlength="30"
      autofocus
      on:keydown={(e) => e.key === 'Enter' && submit()}
    />
    <button on:click={submit} disabled={!input.trim()}>✓</button>
  </div>
  <span class="timer" class:urgent={timeLeft <= 2}>{timeLeft}s</span>
</div>

<style>
  .challenge {
    text-align: center;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  h3 {
    margin-bottom: 0.25rem;
    font-size: 1.1rem;
  }

  .hint {
    font-size: 0.9rem;
    opacity: 0.6;
    margin-bottom: 0.75rem;
  }

  .reversed-word {
    font-size: 2rem;
    font-weight: 800;
    color: #f472b6;
    letter-spacing: 0.15rem;
    margin-bottom: 1.25rem;
    text-shadow: 0 0 10px rgba(244, 114, 182, 0.3);
    font-family: monospace;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
  }

  .input-row input {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
  }

  .input-row button {
    background: #22c55e;
    color: white;
    padding: 0.75rem 1rem;
    font-size: 1.2rem;
  }

  .timer {
    display: inline-block;
    margin-top: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    opacity: 0.8;
  }

  .timer.urgent {
    color: #ef4444;
    animation: blink 0.5s infinite alternate;
  }

  @keyframes blink {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }
</style>
