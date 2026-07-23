<script lang="ts">
  import type { UrgencyLevel } from '../shared';
  export let level: UrgencyLevel = 'low';
</script>

<div class="bomb-container urgency-{level}">
  <div class="glow"></div>
  <div class="bomb">💣</div>
  <div class="sparks">
    {#each Array(5) as _, i}
      <div class="spark" style="--delay: {i * 0.15}s; --angle: {i * 72}deg"></div>
    {/each}
  </div>
</div>

<style>
  .bomb-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
  }

  .glow {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 100, 0, 0.3) 0%, transparent 70%);
    transition: all 0.3s;
  }

  .urgency-medium .glow {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255, 50, 0, 0.4) 0%, transparent 70%);
  }

  .urgency-high .glow {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(255, 0, 0, 0.5) 0%, transparent 70%);
    animation: glow-pulse 0.2s infinite alternate;
  }

  .bomb {
    font-size: 3.5rem;
    z-index: 1;
    animation: bomb-pulse var(--pulse-speed, 1s) infinite ease-in-out;
    filter: drop-shadow(0 0 8px rgba(255, 100, 0, 0.5));
  }

  .urgency-low { --pulse-speed: 1s; }
  .urgency-medium { --pulse-speed: 0.45s; }
  .urgency-high { --pulse-speed: 0.2s; }

  @keyframes bomb-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }

  .sparks {
    position: absolute;
    inset: 0;
  }

  .spark {
    position: absolute;
    width: 5px;
    height: 5px;
    background: #ff6b00;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    box-shadow: 0 0 6px #ff6b00;
    animation: orbit var(--pulse-speed, 1s) infinite linear;
    animation-delay: var(--delay);
    transform-origin: 0 0;
  }

  .urgency-medium .spark { background: #ff3d00; box-shadow: 0 0 8px #ff3d00; }
  .urgency-high .spark { background: #ff0040; box-shadow: 0 0 10px #ff0040; }

  @keyframes orbit {
    0% { transform: rotate(var(--angle)) translateX(35px) scale(1); opacity: 1; }
    100% { transform: rotate(calc(var(--angle) + 360deg)) translateX(35px) scale(0.3); opacity: 0.3; }
  }

  @keyframes glow-pulse {
    0% { opacity: 0.7; transform: scale(1); }
    100% { opacity: 1; transform: scale(1.1); }
  }

  .urgency-high .bomb {
    filter: drop-shadow(0 0 15px rgba(255, 0, 64, 0.8));
    animation: bomb-pulse 0.2s infinite ease-in-out, shake 0.1s infinite;
  }

  @keyframes shake {
    0%, 100% { margin-left: 0; }
    25% { margin-left: -3px; }
    75% { margin-left: 3px; }
  }
</style>
