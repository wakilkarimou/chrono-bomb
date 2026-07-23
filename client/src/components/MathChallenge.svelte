<script lang="ts">
  import { onDestroy } from 'svelte';
  import { send } from '../lib/ws-client';

  export let expression: string;

  let input = '';
  let timeLeft = 5;

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
  <h3>🧮 Calcul rapide !</h3>
  <p class="expression">{expression} = ?</p>
  <div class="input-row">
    <input
      bind:value={input}
      placeholder="Réponse"
      type="number"
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
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .expression {
    font-size: 2.2rem;
    font-weight: 800;
    color: #38bdf8;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .input-row input {
    width: 120px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    -moz-appearance: textfield;
  }

  .input-row input::-webkit-outer-spin-button,
  .input-row input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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
