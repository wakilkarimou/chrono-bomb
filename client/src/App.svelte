<script lang="ts">
  import { onMount } from 'svelte';
  import { currentScreen } from './lib/stores';
  import { connect } from './lib/ws-client';
  import Home from './screens/Home.svelte';
  import Lobby from './screens/Lobby.svelte';
  import Game from './screens/Game.svelte';
  import Podium from './screens/Podium.svelte';

  // Extract ?code=XXXX from URL to pre-fill join code
  let initialCode = '';
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && code.length === 4) {
      initialCode = code.toUpperCase();
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
    connect();
  });
</script>

<main class="app">
  {#if $currentScreen === 'home'}
    <Home {initialCode} />
  {:else if $currentScreen === 'lobby'}
    <Lobby />
  {:else if $currentScreen === 'game'}
    <Game />
  {:else if $currentScreen === 'podium'}
    <Podium />
  {/if}
</main>

<style>
  :global(html) {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #0a0a1a;
    color: #ffffff;
    min-height: 100dvh;
    overflow-x: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    padding: 1rem;
    padding-bottom: env(safe-area-inset-bottom, 1rem);
  }

  /* Animated gradient background */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse at 20% 50%, rgba(255, 0, 128, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(120, 0, 255, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(0, 200, 255, 0.1) 0%, transparent 50%),
      linear-gradient(180deg, #0a0a1a 0%, #12062e 50%, #0a1628 100%);
    animation: bg-shift 12s ease-in-out infinite alternate;
    z-index: -2;
  }

  /* Floating particles overlay */
  .app::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 70%, rgba(255, 0, 200, 0.3) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 30%, rgba(0, 200, 255, 0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 80% 80%, rgba(255, 200, 0, 0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 50% 50%, rgba(120, 0, 255, 0.3) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 90% 15%, rgba(255, 100, 100, 0.3) 0%, transparent 100%);
    animation: stars-drift 20s linear infinite;
    z-index: -1;
    pointer-events: none;
  }

  @keyframes bg-shift {
    0% { transform: scale(1); }
    100% { transform: scale(1.05); opacity: 0.9; }
  }

  @keyframes stars-drift {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
  }

  :global(button) {
    font-family: inherit;
    cursor: pointer;
    border: none;
    border-radius: 14px;
    padding: 0.85rem 1.5rem;
    font-size: 1rem;
    font-weight: 700;
    transition: transform 0.12s, box-shadow 0.12s, filter 0.12s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    min-height: 44px;
    letter-spacing: 0.02em;
  }

  :global(button:hover:not(:disabled)) {
    transform: scale(1.04);
    filter: brightness(1.1);
  }

  :global(button:active:not(:disabled)) {
    transform: scale(0.96);
    filter: brightness(0.95);
  }

  :global(button:disabled) {
    opacity: 0.4;
    cursor: not-allowed;
    filter: saturate(0.5);
  }

  :global(input) {
    font-family: inherit;
    border: 2px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;
    padding: 0.85rem 1rem;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-height: 44px;
    -webkit-appearance: none;
  }

  :global(input:focus) {
    border-color: rgba(200, 0, 255, 0.6);
    box-shadow: 0 0 12px rgba(200, 0, 255, 0.2);
  }

  :global(input::placeholder) {
    color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 480px) {
    .app {
      padding: 0.75rem;
      justify-content: flex-start;
      padding-top: 2rem;
    }
  }
</style>
