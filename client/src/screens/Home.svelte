<script lang="ts">
  import { send, connected } from '../lib/ws-client';
  import { errorMessage, roomCode } from '../lib/stores';

  export let initialCode = '';

  type Step = 'identity' | 'action';
  let step: Step = 'identity';

  let nickname = '';
  let joinCode = initialCode;
  let selectedAvatar = '🐱';
  let showRules = false;

  const avatars = ['🐱', '🦊', '🐸', '🦁', '🐼', '🐵', '🐷', '🦄', '🐲', '🦈', '🐙', '🦅'];

  function goToAction() {
    if (!nickname.trim()) return;
    step = 'action';
  }

  function goBack() {
    step = 'identity';
  }

  function createRoom() {
    send({ type: 'create_room', nickname: nickname.trim(), avatar: selectedAvatar });
  }

  function joinRoom() {
    if (!joinCode.trim() || joinCode.length !== 4) return;
    roomCode.set(joinCode.toUpperCase());
    send({ type: 'join_room', code: joinCode.toUpperCase(), nickname: nickname.trim(), avatar: selectedAvatar });
  }
</script>

<div class="home">
  <h1 class="title">💣 Chrono-Bomb</h1>

  {#if showRules}
    <div class="rules-panel">
      <h3>📖 Comment jouer</h3>
      <ol>
        <li>Crée un salon ou rejoins avec un code</li>
        <li>Une bombe tourne entre les joueurs</li>
        <li>Résous un défi rapide pour la passer</li>
        <li>Chrono secret : quand il expire → 💥 -1 vie</li>
        <li>Dernier survivant = 🏆</li>
      </ol>
      <button class="btn-primary" on:click={() => showRules = false}>Compris !</button>
    </div>

  {:else if step === 'identity'}
    <!-- Step 1: Who are you? -->
    <p class="step-label">Choisis ton identité</p>

    <div class="identity-card">
      <div class="avatar-preview">{selectedAvatar}</div>
      <input
        bind:value={nickname}
        placeholder="Ton pseudo"
        maxlength="16"
        autocomplete="off"
        on:keydown={(e) => e.key === 'Enter' && goToAction()}
      />
    </div>

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

    <button class="btn-primary" on:click={goToAction} disabled={!nickname.trim() || !$connected}>
      {#if !$connected}
        ⏳ Connexion...
      {:else}
        Continuer →
      {/if}
    </button>

    <button class="btn-link" on:click={() => showRules = true}>📖 Comment jouer ?</button>

  {:else}
    <!-- Step 2: What do you want to do? -->
    <button class="btn-back" on:click={goBack}>← {selectedAvatar} {nickname}</button>

    <div class="action-buttons">
      <button class="btn-create" on:click={createRoom}>
        🎮 Créer un salon
      </button>

      <div class="join-section">
        <p class="join-label">Rejoindre un salon</p>
        <div class="join-row">
          <input
            bind:value={joinCode}
            placeholder="CODE"
            maxlength="4"
            class="code-input"
            autocomplete="off"
            on:input={() => { joinCode = joinCode.toUpperCase(); }}
            on:keydown={(e) => e.key === 'Enter' && joinRoom()}
          />
          <button class="btn-join" on:click={joinRoom} disabled={joinCode.length !== 4}>
            Rejoindre
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}
</div>

<style>
  .home {
    text-align: center;
    max-width: 380px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .title {
    font-size: 2.5rem;
    text-shadow: 
      0 0 10px rgba(255, 0, 128, 0.8),
      0 0 30px rgba(255, 0, 128, 0.4),
      0 0 60px rgba(255, 0, 128, 0.2);
    margin: 0;
    animation: neon-flicker 3s ease-in-out infinite alternate;
  }

  @keyframes neon-flicker {
    0%, 95% { opacity: 1; }
    96% { opacity: 0.85; }
    97% { opacity: 1; }
    98% { opacity: 0.9; }
    100% { opacity: 1; }
  }

  .step-label {
    opacity: 0.6;
    font-size: 0.9rem;
    margin: 0;
  }

  /* Identity card */
  .identity-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 0.6rem 0.75rem;
  }

  .avatar-preview {
    font-size: 2rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(168, 85, 247, 0.1);
    border-radius: 12px;
    flex-shrink: 0;
  }

  .identity-card input {
    flex: 1;
    border: none;
    background: none;
    padding: 0.5rem;
    font-size: 1.1rem;
  }

  /* Avatar grid */
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.4rem;
    width: 100%;
  }

  .avatar-btn {
    font-size: 1.4rem;
    aspect-ratio: 1;
    padding: 0;
    background: rgba(255, 255, 255, 0.04);
    border: 2px solid transparent;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .avatar-btn.selected {
    border-color: #ff0080;
    background: rgba(255, 0, 128, 0.15);
    transform: scale(1.1);
  }

  /* Buttons */
  .btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #ff0080, #7928ca);
    color: white;
    box-shadow: 0 4px 20px rgba(255, 0, 128, 0.35);
    padding: 0.9rem;
    font-size: 1.05rem;
  }

  .btn-link {
    background: none;
    color: rgba(240, 230, 255, 0.5);
    font-size: 0.85rem;
    padding: 0.4rem;
  }

  .btn-back {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.06);
    color: #f0e6ff;
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
  }

  /* Action buttons */
  .action-buttons {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .btn-create {
    width: 100%;
    background: linear-gradient(135deg, #ff0080, #7928ca);
    color: white;
    box-shadow: 0 4px 20px rgba(255, 0, 128, 0.35);
    padding: 1.1rem;
    font-size: 1.15rem;
  }

  .join-section {
    width: 100%;
  }

  .join-label {
    font-size: 0.85rem;
    opacity: 0.5;
    margin-bottom: 0.6rem;
  }

  .join-row {
    display: flex;
    gap: 0.6rem;
  }

  .code-input {
    flex: 1;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: 0.3rem;
    text-transform: uppercase;
  }

  .btn-join {
    background: linear-gradient(135deg, #00d4ff, #0090ff);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 200, 255, 0.3);
    white-space: nowrap;
    padding: 0.75rem 1.25rem;
  }

  /* Rules */
  .rules-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.25rem;
    text-align: left;
    width: 100%;
  }

  .rules-panel h3 {
    text-align: center;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  .rules-panel ol {
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.85;
  }

  .error {
    width: 100%;
    padding: 0.7rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    .title {
      font-size: 2rem;
    }

    .avatar-grid {
      grid-template-columns: repeat(6, 1fr);
    }

    .join-row {
      flex-direction: column;
    }
  }
</style>
