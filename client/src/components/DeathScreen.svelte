<script lang="ts">
  import { deathScreen } from '../lib/stores';
</script>

{#if $deathScreen}
  <div class="death-overlay">
    <div class="death-content">
      <div class="skull">☠️</div>
      <h2>GAME OVER</h2>
      <div class="player-info">
        <span class="avatar">{$deathScreen.avatar}</span>
        <span class="nickname">{$deathScreen.nickname}</span>
      </div>
      <p class="position">POSITION: #{$deathScreen.position}</p>
      <p class="spectator-hint">MODE SPECTATEUR...</p>
    </div>
    <div class="scanlines"></div>
  </div>
{/if}

<style>
  .death-overlay {
    position: fixed;
    inset: 0;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 150;
    animation: death-appear 0.3s ease-out, death-fade 3.4s ease-in 3s forwards;
  }

  .death-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    animation: glitch-in 0.5s ease-out;
  }

  .skull {
    font-size: 4rem;
    animation: skull-bounce 0.6s ease-out;
  }

  h2 {
    font-size: 1.2rem;
    color: #ff0000;
    text-shadow: 
      0 0 10px rgba(255, 0, 0, 0.8),
      0 0 30px rgba(255, 0, 0, 0.4);
    margin: 0;
    animation: blink-text 0.5s steps(2) 3;
  }

  .player-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .avatar {
    font-size: 1.5rem;
  }

  .nickname {
    font-size: 0.6rem;
    opacity: 0.8;
  }

  .position {
    font-size: 0.55rem;
    color: #ff4444;
    opacity: 0.7;
    margin: 0;
  }

  .spectator-hint {
    font-size: 0.45rem;
    opacity: 0.4;
    margin: 0;
    margin-top: 0.5rem;
    animation: pulse 1s infinite;
  }

  .scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.3) 2px,
      rgba(0, 0, 0, 0.3) 4px
    );
    pointer-events: none;
  }

  @keyframes death-appear {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes death-fade {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes skull-bounce {
    0% { transform: scale(0) rotate(-10deg); }
    50% { transform: scale(1.3) rotate(5deg); }
    100% { transform: scale(1) rotate(0); }
  }

  @keyframes glitch-in {
    0% { transform: translateX(-5px); opacity: 0; }
    20% { transform: translateX(3px); opacity: 0.5; }
    40% { transform: translateX(-2px); opacity: 0.8; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes blink-text {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
</style>
