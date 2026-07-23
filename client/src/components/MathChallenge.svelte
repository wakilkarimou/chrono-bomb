<script lang="ts">
  import { send } from '../lib/ws-client';

  export let expression: string;
  export let mathOptions: number[] = [];

  let selected: number | null = null;

  function choose(option: number) {
    if (selected !== null) return;
    selected = option;
    send({ type: 'submit_challenge', answer: option.toString() });
  }
</script>

<div class="challenge">
  <h3>🧮 Calcul rapide !</h3>
  <p class="expression">{expression} = ?</p>
  <div class="options">
    {#each mathOptions as option}
      <button
        class="option-btn"
        class:selected={selected === option}
        disabled={selected !== null}
        on:click={() => choose(option)}
      >
        {option}
      </button>
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

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .expression {
    font-size: 2.2rem;
    font-weight: 800;
    color: #38bdf8;
    margin-bottom: 1.25rem;
    text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
  }

  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }

  .option-btn {
    background: rgba(255, 255, 255, 0.08);
    color: #f0e6ff;
    border: 2px solid rgba(255, 255, 255, 0.15);
    padding: 1rem;
    font-size: 1.4rem;
    font-weight: 700;
    transition: all 0.15s;
    min-height: 55px;
  }

  .option-btn:hover:not(:disabled) {
    background: rgba(56, 189, 248, 0.15);
    border-color: rgba(56, 189, 248, 0.4);
  }

  .option-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .option-btn.selected {
    background: rgba(56, 189, 248, 0.3);
    border-color: #38bdf8;
  }

  .option-btn:disabled:not(.selected) {
    opacity: 0.4;
  }

  @media (max-width: 480px) {
    .expression {
      font-size: 1.8rem;
    }

    .option-btn {
      padding: 1.1rem;
      font-size: 1.3rem;
    }
  }
</style>
