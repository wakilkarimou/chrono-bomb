<script lang="ts">
  import { send, connected } from '../lib/ws-client';
  import { errorMessage, roomCode } from '../lib/stores';

  let nickname = '';
  let joinCode = '';

  function createRoom() {
    if (!nickname.trim()) return;
    send({ type: 'create_room', nickname: nickname.trim() });
  }

  function joinRoom() {
    if (!nickname.trim() || !joinCode.trim()) return;
    roomCode.set(joinCode.toUpperCase());
    send({ type: 'join_room', code: joinCode.toUpperCase(), nickname: nickname.trim() });
  }
</script>

<div class="home">
  <h1 class="title">💣 Chrono-Bomb</h1>
  <p class="subtitle">Le party game explosif !</p>

  <div class="form-group">
    <label for="nickname">Ton pseudo</label>
    <input
      id="nickname"
      bind:value={nickname}
      placeholder="Ex: Alex-42"
      maxlength="16"
      autocomplete="off"
    />
  </div>

  <div class="actions">
    <button class="btn-create" on:click={createRoom} disabled={!nickname.trim()}>
      {#if !$connected}
        ⏳ Connexion...
      {:else}
        🎮 Créer un salon
      {/if}
    </button>

    <div class="separator">— ou —</div>

    <div class="join-group">
      <input
        bind:value={joinCode}
        placeholder="CODE"
        maxlength="4"
        class="code-input"
        autocomplete="off"
        on:input={() => { joinCode = joinCode.toUpperCase(); }}
      />
      <button class="btn-join" on:click={joinRoom} disabled={!nickname.trim() || joinCode.length !== 4 || !$connected}>
        🚀 Rejoindre
      </button>
    </div>
  </div>

  {#if !$connected}
    <p class="connecting">⏳ Connexion au serveur en cours...</p>
  {/if}

  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}
</div>

<style>
  .home {
    text-align: center;
    max-width: 400px;
    width: 100%;
  }

  .title {
    font-size: 3rem;
    margin-bottom: 0.25rem;
    text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
  }

  .subtitle {
    opacity: 0.7;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    opacity: 0.8;
  }

  .form-group input {
    width: 100%;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .btn-create {
    background: linear-gradient(135deg, #a855f7, #7c3aed);
    color: white;
    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
  }

  .separator {
    opacity: 0.5;
    font-size: 0.9rem;
  }

  .join-group {
    display: flex;
    gap: 0.75rem;
  }

  .code-input {
    flex: 1;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.3rem;
    text-transform: uppercase;
  }

  .btn-join {
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    color: white;
    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
    white-space: nowrap;
  }

  .error {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 0.9rem;
  }

  .connecting {
    margin-top: 1rem;
    font-size: 0.9rem;
    opacity: 0.6;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
</style>
