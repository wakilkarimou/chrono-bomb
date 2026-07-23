<script lang="ts">
  import { floatingEmojis } from '../lib/stores';
</script>

<div class="emoji-overlay">
  {#each $floatingEmojis as item (item.id)}
    <div class="floating-emoji" style="left: {15 + Math.random() * 70}%">
      <span class="emoji">{item.emoji}</span>
      <span class="name">{item.nickname}</span>
    </div>
  {/each}
</div>

<style>
  .emoji-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 50;
    overflow: hidden;
  }

  .floating-emoji {
    position: absolute;
    bottom: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: float-up 2s ease-out forwards;
  }

  .emoji {
    font-size: 2.5rem;
  }

  .name {
    font-size: 0.7rem;
    opacity: 0.7;
    background: rgba(0, 0, 0, 0.4);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    margin-top: 0.2rem;
    white-space: nowrap;
  }

  @keyframes float-up {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: translateY(-60vh) scale(0.6);
      opacity: 0;
    }
  }
</style>
