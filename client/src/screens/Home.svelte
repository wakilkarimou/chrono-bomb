<script lang="ts">
  import { send, connected } from '../lib/ws-client';
  import { errorMessage, roomCode } from '../lib/stores';

  export let initialCode = '';

  let nickname = '';
  let joinCode = initialCode;
  let showRules = false;
  let selectedAvatar = '🐱';

  const avatars = ['🐱', '🦊', '🐸', '🦁', '🐼', '🐵', '🐷', '🦄', '🐲', '🦈', '🐙', '🦅'];

  function createRoom() {
    if (!nickname.trim()) return;
    send({ type: 'create_room', nickname: nickname.trim(), avatar: selectedAvatar });
  }

  function joinRoom() {
    if (!nickname.trim() || !joinCode.trim()) return;
    roomCode.set(joinCode.toUpperCase());
    send({ type: 'join_room', code: joinCode.toUpperCase(), nickname: nickname.trim(), avatar: selectedAvatar });
  }
</script>

<div class="home">
  <div class="logo-section">
    <h1 class="title">💣 Chrono-Bomb</h1>
    <p class="subtitle">Le party game explosif !</p>
  </div>

  {#if showRules}
    <div class="rules-panel">
      <h3>📖 Comment jouer</h3>
      <ol>
        <li>Crée un salon ou rejoins-en un avec un code</li>
        <li>Une bombe est donnée à un joueur au hasard</li>
        <li>Résous un mini-défi rapide (QCM, réflexe, pattern...)</li>
        <li>Passe la bombe à un autre joueur avant qu'elle explose !</li>
        <li>Un chrono secret (15-30s) tourne en arrière-plan</li>
        <li>Quand il atteint zéro → 💥 explosion → -1 vie</li>
        <li>3 vies par joueur — le dernier survivant gagne 🏆</li>
      </ol>
      <button class="btn-close-rules" on:click={() => showRules = false}>Compris !</button>
    </div>
  {:else}
    <div class="form-section">
      <div class="form-group">
        <label for="nickname">Ton pseudo</label>
        <input
          id="nickname"
          bind:value={nickname}
          placeholder="Ex: Alex-42"
          maxlength="16"
          autocomplete="off"
          on:keydown={(e) => e.key === 'Enter' && createRoom()}
        />
      </div>

      <div class="avatar-section">
        <label>Ton avatar</label>
        <div class="avatar-grid">
          {#each avatars as av}
            <button
              class="avatar-btn"
              class:selected={selectedAvatar === av}
              on:click={() => selectedAvatar = av}
              type="button"
            >{av}</button>
          {/each}
        </div>
      </div>

      <div class="actions">
        <button class="btn-create" on:click={createRoom} disabled={!nickname.trim() || !$connected}>
          {#if !$connected}
            ⏳ Connexion...
          {:else}
            🎮 Créer un salon
          {/if}
        </button>

        <div class="separator">
          <span class="line"></span>
          <span class="or-text">ou rejoindre</span>
          <span class="line"></span>
        </div>

        <div class="join-group">
          <input
            bind:value={joinCode}
            placeholder="CODE"
            maxlength="4"
            class="code-input"
            autocomplete="off"
            on:input={() => { joinCode = joinCode.toUpperCase(); }}
            on:keydown={(e) => e.key === 'Enter' && joinRoom()}
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

    <button class="btn-rules" on:click={() => showRules = true}>
      📖 Comment jouer ?
    </button>
  {/if}
</div>

<style>
  .home {
    text-align: center;
    max-width: 420px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .logo-section {
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: 3rem;
    margin-bottom: 0.25rem;
    text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
  }

  .subtitle {
    opacity: 0.7;
    font-size: 1.1rem;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
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

  .avatar-section {
    text-align: left;
  }

  .avatar-section label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    opacity: 0.8;
  }

  .avatar-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .avatar-btn {
    font-size: 1.5rem;
    width: 44px;
    height: 44px;
    padding: 0;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid transparent;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .avatar-btn.selected {
    border-color: #a855f7;
    background: rgba(168, 85, 247, 0.15);
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
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
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.15);
  }

  .or-text {
    font-size: 0.85rem;
    opacity: 0.5;
    white-space: nowrap;
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

  .btn-rules {
    background: none;
    color: rgba(240, 230, 255, 0.6);
    font-size: 0.9rem;
    padding: 0.5rem;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .btn-rules:hover {
    color: #f0e6ff;
  }

  /* Rules panel */
  .rules-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: left;
  }

  .rules-panel h3 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .rules-panel ol {
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    font-size: 0.95rem;
    line-height: 1.4;
    opacity: 0.85;
  }

  .btn-close-rules {
    margin-top: 1.25rem;
    width: 100%;
    background: linear-gradient(135deg, #a855f7, #7c3aed);
    color: white;
    padding: 0.85rem;
  }

  .error {
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 0.9rem;
  }

  .connecting {
    font-size: 0.9rem;
    opacity: 0.6;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  @media (max-width: 480px) {
    .title {
      font-size: 2.2rem;
    }

    .join-group {
      flex-direction: column;
    }

    .code-input {
      font-size: 1.5rem;
    }
  }
</style>
