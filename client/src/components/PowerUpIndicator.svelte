<script lang="ts">
  import { myPowerUp } from '../lib/stores';

  const POWER_UP_INFO: Record<string, { icon: string; name: string }> = {
    shield: { icon: '🛡️', name: 'BOUCLIER' },
    freeze: { icon: '❄️', name: 'FREEZE' },
    random_pass: { icon: '🔀', name: 'RANDOM' },
  };
</script>

{#if $myPowerUp}
  {@const info = POWER_UP_INFO[$myPowerUp]}
  <div class="power-up-badge">
    <span class="pu-icon">{info.icon}</span>
    <span class="pu-name">{info.name}</span>
  </div>
{/if}

<style>
  .power-up-badge {
    position: fixed;
    top: 0.5rem;
    left: 0.5rem;
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #4ade80;
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    animation: pu-appear 0.3s ease-out, pu-glow 1.5s infinite alternate;
  }

  .pu-icon {
    font-size: 1rem;
  }

  .pu-name {
    font-size: 0.4rem;
    color: #4ade80;
  }

  @keyframes pu-appear {
    from { transform: scale(0) rotate(-10deg); }
    to { transform: scale(1) rotate(0); }
  }

  @keyframes pu-glow {
    from { box-shadow: 0 0 5px rgba(74, 222, 128, 0.3); }
    to { box-shadow: 0 0 12px rgba(74, 222, 128, 0.6); }
  }
</style>
