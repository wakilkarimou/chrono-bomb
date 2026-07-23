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
  <h3>🔄 MOT INVERSE</h3>
  <p class="reversed-word">{reversedWord}</p>
  <div class="input-row">
    <input
      bind:value={input}
      placeholder="Mot a l'endroit"
      maxlength="30"
      autofocus
      on:keydown={(e) => e.key === 'Enter' && submit()}
    />
    <button on:click={submit} disabled={!input.trim()}>OK</button>
  </div>
  <span class="timer" class:urgent={timeLeft <= 2}>{timeLeft}s</span>
</div>

<style>
  .challenge {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 0, 0, 0.03);
    border-radius: 4px;
    border: 2px solid rgba(255, 0, 0, 0.2);
    width: 100%;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.6rem;
  }

  .reversed-word {
    font-size: 1.2rem;
    color: #ff4444;
    letter-spacing: 0.2rem;
    margin: 0.75rem 0;
    text-shadow: 0 0 8px rgba(255, 0, 0, 0.4);
    word-break: break-all;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }

  .input-row input {
    flex: 1;
    min-width: 0;
    text-align: center;
    font-size: 0.7rem;
  }

  .input-row button {
    background: #cc0000;
    color: white;
    border: 2px solid #ff0000;
    padding: 0.75rem 1rem;
    font-size: 0.65rem;
    flex-shrink: 0;
  }

  .timer {
    display: inline-block;
    margin-top: 0.75rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .timer.urgent {
    color: #ff0000;
    animation: blink 0.5s infinite alternate;
  }

  @keyframes blink {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }
</style>
