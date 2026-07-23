<script lang="ts">
  import { onMount } from 'svelte';
  import { currentScreen } from './lib/stores';
  import { connect } from './lib/ws-client';
  import Home from './screens/Home.svelte';
  import Lobby from './screens/Lobby.svelte';
  import Game from './screens/Game.svelte';
  import Podium from './screens/Podium.svelte';

  onMount(() => {
    connect();
  });
</script>

<main class="app">
  {#if $currentScreen === 'home'}
    <Home />
  {:else if $currentScreen === 'lobby'}
    <Lobby />
  {:else if $currentScreen === 'game'}
    <Game />
  {:else if $currentScreen === 'podium'}
    <Podium />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #1a0533 0%, #0d1b3e 100%);
    color: #f0e6ff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
  }

  :global(button) {
    font-family: inherit;
    cursor: pointer;
    border: none;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  :global(button:hover:not(:disabled)) {
    transform: scale(1.05);
  }

  :global(button:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(input) {
    font-family: inherit;
    border: 2px solid rgba(240, 230, 255, 0.2);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.05);
    color: #f0e6ff;
    outline: none;
    transition: border-color 0.2s;
  }

  :global(input:focus) {
    border-color: rgba(168, 85, 247, 0.6);
  }
</style>
