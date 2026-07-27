<script lang="ts">
  import { setMuted, isMuted } from '../lib/audio';

  let muted = isMuted();

  function toggle() {
    muted = !muted;
    setMuted(muted);
  }
</script>

<button class="mute-btn" on:click={toggle} aria-label={muted ? 'Activer le son' : 'Couper le son'}>
  {muted ? '🔇' : '🔊'}
</button>

<style>
  .mute-btn {
    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 60;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    width: 36px;
    height: 36px;
    min-height: 36px;
    padding: 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
