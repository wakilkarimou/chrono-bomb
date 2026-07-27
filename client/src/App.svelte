<script lang="ts">
  import { onMount } from 'svelte';
  import { currentScreen } from './lib/stores';
  import { connect } from './lib/ws-client';
  import Home from './screens/Home.svelte';
  import Lobby from './screens/Lobby.svelte';
  import Game from './screens/Game.svelte';
  import Podium from './screens/Podium.svelte';
  import MuteButton from './components/MuteButton.svelte';

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
  <MuteButton />
  {#key $currentScreen}
    <div class="screen-transition">
      {#if $currentScreen === 'home'}
        <Home {initialCode} />
      {:else if $currentScreen === 'lobby'}
        <Lobby />
      {:else if $currentScreen === 'game'}
        <Game />
      {:else if $currentScreen === 'podium'}
        <Podium />
      {/if}
    </div>
  {/key}
</main>

<style>
  :global(html) {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Press Start 2P', monospace;
    background: #0a0a0a;
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
    width: 100%;
  }

  /* Dark background with subtle red glow */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse at 50% 0%, rgba(200, 0, 0, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 20% 80%, rgba(150, 0, 0, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 60%, rgba(100, 0, 0, 0.06) 0%, transparent 50%),
      #0a0a0a;
    z-index: -2;
  }

  /* Scanline overlay for retro CRT effect */
  .app::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.15) 2px,
      rgba(0, 0, 0, 0.15) 4px
    );
    z-index: -1;
    pointer-events: none;
  }

  :global(button) {
    font-family: 'Press Start 2P', monospace;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 0.85rem 1.5rem;
    font-size: 0.7rem;
    font-weight: 400;
    transition: transform 0.1s, box-shadow 0.1s, filter 0.1s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    min-height: 44px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.4;
  }

  :global(button:hover:not(:disabled)) {
    transform: scale(1.03);
    filter: brightness(1.15);
  }

  :global(button:active:not(:disabled)) {
    transform: scale(0.96);
    filter: brightness(0.9);
  }

  :global(button:disabled) {
    opacity: 0.35;
    cursor: not-allowed;
    filter: saturate(0.3);
  }

  :global(input) {
    font-family: 'Press Start 2P', monospace;
    border: 2px solid rgba(255, 0, 0, 0.3);
    border-radius: 4px;
    padding: 0.85rem 1rem;
    font-size: 0.75rem;
    background: rgba(255, 0, 0, 0.05);
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-height: 44px;
    -webkit-appearance: none;
  }

  :global(input:focus) {
    border-color: #ff0000;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  }

  :global(input::placeholder) {
    color: rgba(255, 255, 255, 0.25);
    font-size: 0.65rem;
  }

  @media (max-width: 480px) {
    .app {
      padding: 0.5rem;
      padding-top: 1rem;
      justify-content: center;
    }
  }

  .screen-transition {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    justify-content: center;
    animation: screen-in 0.3s ease-out;
  }

  @keyframes screen-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
