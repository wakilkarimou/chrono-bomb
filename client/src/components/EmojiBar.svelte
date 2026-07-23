<script lang="ts">
  import { send } from '../lib/ws-client';

  const emojis = ['😂', '💀', '🔥', '😱', '👀', '💣', '🎉', '😈', '🤡', '❤️', '👏', '😭'];

  let cooldown = false;

  function sendEmoji(emoji: string) {
    if (cooldown) return;
    send({ type: 'send_emoji', emoji });
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 500);
  }
</script>

<div class="emoji-bar">
  {#each emojis as emoji}
    <button
      class="emoji-btn"
      class:disabled={cooldown}
      on:click={() => sendEmoji(emoji)}
      disabled={cooldown}
    >{emoji}</button>
  {/each}
</div>

<style>
  .emoji-bar {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .emoji-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    padding: 0.3rem 0.4rem;
    border-radius: 8px;
    min-height: 38px;
    min-width: 38px;
    transition: transform 0.1s, background 0.1s;
  }

  .emoji-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.3);
  }

  .emoji-btn:active:not(:disabled) {
    transform: scale(0.9);
  }

  .emoji-btn:disabled {
    opacity: 0.4;
  }

  @media (max-width: 480px) {
    .emoji-btn {
      font-size: 1.2rem;
      min-height: 34px;
      min-width: 34px;
      padding: 0.2rem 0.3rem;
    }
  }
</style>
