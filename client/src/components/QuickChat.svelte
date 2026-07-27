<script lang="ts">
  import { send } from '../lib/ws-client';
  import { quickChatMessages } from '../lib/stores';

  const messages = ['Facile', 'Noooo', 'GG', 'Encore !', 'Vite !', 'Rip'];
  let cooldown = false;

  function sendChat(msg: string) {
    if (cooldown) return;
    send({ type: 'send_quick_chat', message: msg });
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 1000);
  }
</script>

<div class="quick-chat">
  <div class="chat-buttons">
    {#each messages as msg}
      <button class="chat-btn" on:click={() => sendChat(msg)} disabled={cooldown}>{msg}</button>
    {/each}
  </div>

  <!-- Floating messages -->
  <div class="chat-overlay">
    {#each $quickChatMessages as item (item.id)}
      <div class="chat-bubble">
        <span class="chat-nick">{item.nickname}:</span>
        <span class="chat-msg">{item.message}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .quick-chat {
    width: 100%;
  }

  .chat-buttons {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .chat-btn {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    font-size: 0.4rem;
    min-height: 28px;
    transition: all 0.1s;
  }

  .chat-btn:hover:not(:disabled) {
    background: rgba(255, 0, 0, 0.1);
    border-color: rgba(255, 0, 0, 0.3);
    color: #fff;
  }

  .chat-btn:disabled {
    opacity: 0.3;
  }

  .chat-overlay {
    position: fixed;
    top: 3rem;
    left: 0.5rem;
    z-index: 55;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    pointer-events: none;
  }

  .chat-bubble {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: 4px;
    padding: 0.25rem 0.4rem;
    animation: chat-appear 0.2s ease-out, chat-fade 3s ease-in forwards;
    font-size: 0.4rem;
  }

  .chat-nick {
    color: #ff4444;
    margin-right: 0.2rem;
  }

  .chat-msg {
    color: #fff;
  }

  @keyframes chat-appear {
    from { transform: translateX(-10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes chat-fade {
    0%, 70% { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
