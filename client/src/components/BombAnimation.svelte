<script lang="ts">
  import type { UrgencyLevel } from '../shared';
  export let level: UrgencyLevel = 'low';
</script>

<div class="bomb-container urgency-{level}">
  <div class="bomb">💣</div>
  <div class="sparks">
    {#each Array(3) as _, i}
      <div class="spark" style="--delay: {i * 0.2}s"></div>
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

  .bomb {
    font-size: 4rem;
    animation: bomb-pulse var(--pulse-speed, 1s) infinite ease-in-out;
  }

  .urgency-low { --pulse-speed: 1s; }
  .urgency-medium { --pulse-speed: 0.5s; }
  .urgency-high { --pulse-speed: 0.25s; }

  @keyframes bomb-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  .sparks {
    position: absolute;
    top: 5px;
    right: 20px;
  }

  .spark {
    width: 6px;
    height: 6px;
    background: #f59e0b;
    border-radius: 50%;
    position: absolute;
    animation: sparkle 0.6s infinite alternate;
    animation-delay: var(--delay);
  }

  .spark:nth-child(2) { top: -5px; left: 5px; }
  .spark:nth-child(3) { top: 3px; left: 10px; }

  @keyframes sparkle {
    0% { opacity: 0.3; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1.2); }
  }

  .urgency-high .bomb {
    filter: hue-rotate(-20deg) saturate(1.5);
  }

  .urgency-high .sparks {
    animation: shake 0.1s infinite;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
</style>
