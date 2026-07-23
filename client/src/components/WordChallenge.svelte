<script lang="ts">
  import { send } from '../lib/ws-client';

  export let category: string;
  export let options: string[] = [];

  let selected: string | null = null;

  function choose(option: string) {
    if (selected) return;
    selected = option;
    send({ type: 'submit_challenge', answer: option });
  }
</script>

<div class="challenge">
  <h3>🏷️ Quel mot appartient à :</h3>
  <p class="category">{category}</p>
  <div class="options">
    {#each options as option}
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

  .category {
    font-size: 1.5rem;
    font-weight: 700;
    color: #a855f7;
    text-transform: capitalize;
    margin-bottom: 1.25rem;
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
    padding: 1rem 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: capitalize;
    transition: all 0.15s;
    min-height: 50px;
  }

  .option-btn:hover:not(:disabled) {
    background: rgba(168, 85, 247, 0.15);
    border-color: rgba(168, 85, 247, 0.4);
  }

  .option-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .option-btn.selected {
    background: rgba(168, 85, 247, 0.3);
    border-color: #a855f7;
  }

  .option-btn:disabled:not(.selected) {
    opacity: 0.4;
  }

  @media (max-width: 480px) {
    .options {
      grid-template-columns: 1fr;
    }

    .option-btn {
      padding: 1.1rem;
      font-size: 1.1rem;
    }
  }
</style>
