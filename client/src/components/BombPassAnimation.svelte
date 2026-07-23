<script lang="ts">
  import { bombPassEvent } from '../lib/stores';
</script>

{#if $bombPassEvent}
  <div class="pass-overlay">
    <div class="pass-content">
      <div class="from-player">
        <span class="avatar">{$bombPassEvent.fromAvatar}</span>
        <span class="name">{$bombPassEvent.fromNickname}</span>
      </div>
      <div class="bomb-flight">
        <span class="bomb-icon">💣</span>
      </div>
      <div class="to-player">
        <span class="avatar">{$bombPassEvent.toAvatar}</span>
        <span class="name">{$bombPassEvent.toNickname}</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .pass-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 90;
    pointer-events: none;
    animation: pass-fade 1.2s ease-out forwards;
  }

  .pass-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.85);
    border: 2px solid rgba(255, 0, 0, 0.4);
    border-radius: 4px;
    padding: 1rem 1.5rem;
  }

  .from-player, .to-player {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .avatar {
    font-size: 1.8rem;
  }

  .name {
    font-size: 0.45rem;
    opacity: 0.7;
  }

  .bomb-flight {
    font-size: 1.5rem;
    animation: fly-across 0.8s ease-in-out;
  }

  @keyframes fly-across {
    0% { transform: translateX(-20px) scale(0.8); opacity: 0; }
    30% { transform: translateX(-5px) scale(1.2); opacity: 1; }
    70% { transform: translateX(5px) scale(1.2); opacity: 1; }
    100% { transform: translateX(20px) scale(0.8); opacity: 0.8; }
  }

  @keyframes pass-fade {
    0% { opacity: 0; }
    15% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
