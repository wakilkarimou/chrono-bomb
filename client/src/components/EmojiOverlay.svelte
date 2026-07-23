<script lang="ts">
  import { floatingEmojis } from '../lib/stores';
  import { REACTION_EMOTES } from '../lib/avatars';

  function getEmoteSvg(id: string): string {
    const emote = REACTION_EMOTES.find(e => e.id === id);
    return emote?.svg || `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#666"/></svg>`;
  }
</script>

<div class="emoji-overlay">
  {#each $floatingEmojis as item (item.id)}
    <div class="floating-emoji" style="left: {15 + Math.random() * 70}%">
      <span class="emote-icon">{@html getEmoteSvg(item.emoji)}</span>
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

  .emote-icon {
    display: block;
    width: 36px;
    height: 36px;
  }

  .emote-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .name {
    font-size: 0.4rem;
    opacity: 0.7;
    background: rgba(0, 0, 0, 0.6);
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
    margin-top: 0.15rem;
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
      transform: translateY(-50vh) scale(0.6);
      opacity: 0;
    }
  }
</style>
