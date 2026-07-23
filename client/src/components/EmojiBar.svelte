<script lang="ts">
  import { send } from '../lib/ws-client';
  import { REACTION_EMOTES } from '../lib/avatars';

  let cooldown = false;

  function sendEmoji(id: string) {
    if (cooldown) return;
    send({ type: 'send_emoji', emoji: id });
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 500);
  }
</script>

<div class="emoji-bar">
  {#each REACTION_EMOTES as emote}
    <button
      class="emote-btn"
      class:disabled={cooldown}
      on:click={() => sendEmoji(emote.id)}
      disabled={cooldown}
      title={emote.label}
    >
      {@html emote.svg}
    </button>
  {/each}
</div>

<style>
  .emoji-bar {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.4rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .emote-btn {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    padding: 4px;
    width: 34px;
    height: 34px;
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s, background 0.1s;
  }

  .emote-btn :global(svg) {
    width: 22px;
    height: 22px;
  }

  .emote-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    transform: scale(1.2);
  }

  .emote-btn:active:not(:disabled) {
    transform: scale(0.9);
  }

  .emote-btn:disabled {
    opacity: 0.3;
  }
</style>
