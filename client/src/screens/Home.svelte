<script lang="ts">
  import { send, connected } from '../lib/ws-client';
  import { errorMessage, roomCode } from '../lib/stores';
  import { AVATARS } from '../lib/avatars';
  import Avatar from '../components/Avatar.svelte';
  import type { GameMode } from '../shared';

  export let initialCode = '';

  type Step = 'identity' | 'action' | 'mode';
  let step: Step = 'identity';

  let nickname = '';
  let joinCode = initialCode;
  let selectedAvatar = 'skull';
  let selectedMode: GameMode = 'classic';
  let showRules = false;

  const modes: { id: GameMode; name: string; icon: string; desc: string }[] = [
    { id: 'classic', name: 'CLASSIQUE', icon: '💣', desc: '3 vies, chrono 15-30s. Le mode standard pour tous.' },
    { id: 'speed', name: 'SPEED', icon: '⚡', desc: '3 vies, chrono 8-15s. Pas le temps de réfléchir !' },
    { id: 'hardcore', name: 'HARDCORE', icon: '💀', desc: '1 seule vie, chrono 10-20s. Zéro droit à l\'erreur.' },
  ];

  function goToAction() {
    if (!nickname.trim()) return;
    step = 'action';
  }

  function goToMode() {
    step = 'mode';
  }

  function goBack() {
    if (step === 'mode') { step = 'action'; }
    else if (step === 'action') { step = 'identity'; }
  }

  function createRoom() {
    send({ type: 'create_room', nickname: nickname.trim(), avatar: selectedAvatar, mode: selectedMode });
  }

  function joinRoom() {
    if (!joinCode.trim() || joinCode.length !== 4) return;
    roomCode.set(joinCode.toUpperCase());
    send({ type: 'join_room', code: joinCode.toUpperCase(), nickname: nickname.trim(), avatar: selectedAvatar });
  }
</script>

<div class="home">
  <h1 class="title">CHRONO-BOMB</h1>

  {#if showRules}
    <div class="rules-panel">
      <h3>REGLES</h3>
      <ol>
        <li>Cree un salon ou rejoins avec un code</li>
        <li>Une bombe tourne entre les joueurs</li>
        <li>Resous un defi rapide pour la passer</li>
        <li>Chrono secret : quand il expire → -1 vie</li>
        <li>Dernier survivant = victoire</li>
      </ol>
      <button class="btn-primary" on:click={() => showRules = false}>COMPRIS</button>
    </div>

  {:else if step === 'identity'}
    <p class="step-label">TON IDENTITE</p>

    <div class="identity-card">
      <div class="avatar-preview">
        <Avatar avatarId={selectedAvatar} size="36px" />
      </div>
      <input
        bind:value={nickname}
        placeholder="Pseudo"
        maxlength="16"
        autocomplete="off"
        on:keydown={(e) => e.key === 'Enter' && goToAction()}
      />
    </div>

    <div class="avatar-grid">
      {#each AVATARS as av}
        <button
          class="avatar-btn"
          class:selected={selectedAvatar === av.id}
          on:click={() => selectedAvatar = av.id}
          type="button"
          style="border-color: {selectedAvatar === av.id ? av.color : 'rgba(255,255,255,0.08)'}"
        >
          {@html av.svg}
        </button>
      {/each}
    </div>

    <button class="btn-primary" on:click={goToAction} disabled={!nickname.trim() || !$connected}>
      {#if !$connected}
        CONNEXION...
      {:else}
        CONTINUER
      {/if}
    </button>

    <button class="btn-link" on:click={() => showRules = true}>REGLES DU JEU</button>

  {:else if step === 'action'}
    <button class="btn-back" on:click={goBack}>
      <span class="back-avatar"><Avatar avatarId={selectedAvatar} size="20px" /></span>
      ← {nickname}
    </button>

    <div class="action-buttons">
      <button class="btn-create" on:click={goToMode}>
        CREER UN SALON
      </button>

      <div class="join-section">
        <p class="join-label">REJOINDRE UN SALON</p>
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
            GO
          </button>
        </div>
      </div>
    </div>

  {:else if step === 'mode'}
    <button class="btn-back" on:click={goBack}>← RETOUR</button>

    <p class="step-label">CHOISIS LE MODE</p>

    <div class="mode-list">
      {#each modes as mode}
        <button
          class="mode-card"
          class:selected={selectedMode === mode.id}
          on:click={() => selectedMode = mode.id}
          type="button"
        >
          <div class="mode-header">
            <span class="mode-icon">{mode.icon}</span>
            <span class="mode-name">{mode.name}</span>
          </div>
          <p class="mode-desc">{mode.desc}</p>
        </button>
      {/each}
    </div>

    <button class="btn-primary" on:click={createRoom}>
      LANCER EN {modes.find(m => m.id === selectedMode)?.name}
    </button>
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
    gap: 1rem;
    flex: 1;
    justify-content: center;
  }

  .title {
    font-size: clamp(0.9rem, 5vw, 1.5rem);
    text-shadow: 
      0 0 10px rgba(255, 0, 0, 0.8),
      0 0 30px rgba(255, 0, 0, 0.4);
    margin: 0;
    color: #ff0000;
    white-space: nowrap;
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
    opacity: 0.5;
    font-size: 0.55rem;
    margin: 0;
    letter-spacing: 0.1em;
  }

  /* Identity card */
  .identity-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    background: rgba(255, 0, 0, 0.03);
    border: 2px solid rgba(255, 0, 0, 0.2);
    border-radius: 4px;
    padding: 0.6rem 0.75rem;
  }

  .avatar-preview {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .identity-card input {
    flex: 1;
    border: none;
    background: none;
    padding: 0.5rem;
    font-size: 0.7rem;
    min-width: 0;
  }

  /* Avatar grid */
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.35rem;
    width: 100%;
  }

  .avatar-btn {
    aspect-ratio: 1;
    padding: 4px;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s;
  }

  .avatar-btn :global(svg) {
    width: 100%;
    height: 100%;
  }

  .avatar-btn.selected {
    background: rgba(255, 255, 255, 0.08);
    transform: scale(1.1);
    box-shadow: 0 0 8px currentColor;
  }

  /* Buttons */
  .btn-primary {
    width: 100%;
    background: #cc0000;
    color: white;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.35);
    padding: 0.85rem;
    font-size: 0.6rem;
    border: 2px solid #ff0000;
  }

  .btn-link {
    background: none;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.5rem;
    padding: 0.4rem;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0;
  }

  .btn-back {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.5rem;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .back-avatar {
    display: flex;
  }

  /* Action step */
  .action-buttons {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .btn-create {
    width: 100%;
    background: #cc0000;
    color: white;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.35);
    padding: 1rem;
    font-size: 0.65rem;
    border: 2px solid #ff0000;
  }

  .join-section {
    width: 100%;
  }

  .join-label {
    font-size: 0.5rem;
    opacity: 0.4;
    margin-bottom: 0.5rem;
  }

  .join-row {
    display: flex;
    gap: 0.5rem;
  }

  .code-input {
    flex: 1;
    text-align: center;
    font-size: 1rem;
    letter-spacing: 0.3rem;
    text-transform: uppercase;
  }

  .btn-join {
    background: #1a1a1a;
    color: #ff4444;
    border: 2px solid #ff0000;
    white-space: nowrap;
    padding: 0.75rem 1rem;
    font-size: 0.6rem;
  }

  /* Mode selection step */
  .mode-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .mode-card {
    width: 100%;
    text-align: left;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.02);
    border: 2px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    transition: all 0.12s;
  }

  .mode-card.selected {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.06);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.15);
  }

  .mode-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
  }

  .mode-icon {
    font-size: 1.2rem;
  }

  .mode-name {
    font-size: 0.55rem;
    color: #fff;
  }

  .mode-desc {
    font-size: 0.45rem;
    opacity: 0.5;
    line-height: 1.6;
    margin: 0;
  }

  /* Rules */
  .rules-panel {
    background: rgba(255, 0, 0, 0.03);
    border: 2px solid rgba(255, 0, 0, 0.2);
    border-radius: 4px;
    padding: 1rem;
    text-align: left;
    width: 100%;
  }

  .rules-panel h3 {
    text-align: center;
    margin-bottom: 0.75rem;
    font-size: 0.6rem;
    color: #ff0000;
  }

  .rules-panel ol {
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.5rem;
    line-height: 1.6;
    opacity: 0.7;
  }

  .error {
    width: 100%;
    padding: 0.6rem;
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: 4px;
    color: #ff6666;
    font-size: 0.5rem;
  }

  @media (max-width: 480px) {
    .home {
      max-width: 100%;
      padding: 0 0.25rem;
    }

    .join-row {
      flex-direction: column;
    }
  }
</style>
