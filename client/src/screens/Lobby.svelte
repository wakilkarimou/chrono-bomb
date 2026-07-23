<script lang="ts">
  import { send } from '../lib/ws-client';
  import { players, roomCode, isHost, errorMessage, currentScreen, playerId } from '../lib/stores';
  import { MIN_PLAYERS, MAX_PLAYERS } from '../shared';
  import type { GameMode } from '../shared';

  let copied = false;
  let shareSupported = typeof navigator.share === 'function';
  let selectedMode: GameMode = 'classic';

  const modes = [
    { id: 'classic' as GameMode, name: 'CLASSIQUE', icon: '💣', desc: '3 vies · 15-30s' },
    { id: 'speed' as GameMode, name: 'SPEED', icon: '⚡', desc: '3 vies · 8-15s' },
    { id: 'hardcore' as GameMode, name: 'HARDCORE', icon: '💀', desc: '1 vie · 10-20s' },
  ];

  function startGame() {
    send({ type: 'start_game', mode: selectedMode });
  }

  function leaveRoom() {
    send({ type: 'leave_room' });
    currentScreen.set('home');
    roomCode.set(null);
    playerId.set(null);
    players.set([]);
  }

  function copyCode() {
    if (!$roomCode) return;
    navigator.clipboard.writeText($roomCode);
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }

  function shareRoom() {
    if (!$roomCode) return;
    const url = window.location.origin;
    navigator.share({
      title: '💣 Chrono-Bomb',
      text: `Rejoins ma partie Chrono-Bomb ! Code : ${$roomCode}`,
      url: url,
    }).catch(() => {});
  }

  function copyLink() {
    if (!$roomCode) return;
    const url = `${window.location.origin}?code=${$roomCode}`;
    navigator.clipboard.writeText(url);
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }
</script>

<div class="lobby">
  <div class="header">
    <button class="btn-back-icon" on:click={leaveRoom} aria-label="Quitter">←</button>
    <h2>Salle d'attente</h2>
    <div class="spacer"></div>
  </div>

  <div class="room-code-section">
    <div class="room-code" on:click={copyCode} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && copyCode()}>
      <span class="code-label">Code du salon</span>
      <span class="code-value">{$roomCode}</span>
      <span class="copy-hint">
        {#if copied}
          ✅ Copié !
        {:else}
          📋 Tap pour copier
        {/if}
      </span>
    </div>

    <div class="share-buttons">
      {#if shareSupported}
        <button class="btn-share" on:click={shareRoom}>📤 Partager</button>
      {/if}
      <button class="btn-share" on:click={copyLink}>🔗 Copier le lien</button>
    </div>
  </div>

  <div class="player-list">
    <h3>Joueurs <span class="count">{$players.length}/{MAX_PLAYERS}</span></h3>
    <ul>
      {#each $players as player}
        <li class:is-me={player.id === $playerId}>
          <span class="player-name">
            <span class="avatar">{player.avatar}</span>
            {player.nickname}
            {#if player.isHost}
              <span class="host-badge">👑</span>
            {/if}
          </span>
          {#if player.id === $playerId}
            <span class="you-badge">Toi</span>
          {/if}
        </li>
      {/each}
    </ul>
    {#if $players.length < MAX_PLAYERS}
      <p class="waiting-more">En attente d'autres joueurs...</p>
    {/if}
  </div>

  <div class="actions">
    {#if $isHost}
      <div class="mode-selector">
        <h3>Mode de jeu</h3>
        <div class="mode-grid">
          {#each modes as mode}
            <button
              class="mode-btn"
              class:selected={selectedMode === mode.id}
              on:click={() => selectedMode = mode.id}
              type="button"
            >
              <span class="mode-icon">{mode.icon}</span>
              <span class="mode-name">{mode.name}</span>
              <span class="mode-desc">{mode.desc}</span>
            </button>
          {/each}
        </div>
      </div>

      <button class="btn-start" on:click={startGame} disabled={$players.length < MIN_PLAYERS}>
        🚀 Lancer la partie
      </button>
      {#if $players.length < MIN_PLAYERS}
        <p class="hint-text">Il faut au moins {MIN_PLAYERS} joueur{MIN_PLAYERS > 1 ? 's' : ''}</p>
      {/if}
    {:else}
      <div class="wait-box">
        <span class="wait-icon">⏳</span>
        <p>L'hôte va lancer la partie...</p>
      </div>
    {/if}
  </div>

  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}
</div>

<style>
  .lobby {
    max-width: 450px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    flex: 1;
    justify-content: center;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header h2 {
    flex: 1;
    text-align: center;
    font-size: 1.4rem;
    margin: 0;
  }

  .spacer { width: 36px; }

  .btn-back-icon {
    background: rgba(255, 255, 255, 0.08);
    color: #f0e6ff;
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border-radius: 10px;
  }

  .room-code-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .room-code {
    background: rgba(255, 0, 0, 0.03);
    border: 2px solid rgba(255, 0, 0, 0.3);
    border-radius: 4px;
    padding: 1.25rem;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    text-align: center;
  }

  .room-code:hover {
    border-color: #ff0000;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.15);
  }

  .code-label {
    display: block;
    font-size: 0.8rem;
    opacity: 0.5;
    margin-bottom: 0.4rem;
  }

  .code-value {
    display: block;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.5rem;
    color: #ff0000;
    text-shadow: 
      0 0 8px rgba(255, 0, 0, 0.6),
      0 0 20px rgba(255, 0, 0, 0.3);
  }

  .copy-hint {
    display: block;
    font-size: 0.8rem;
    opacity: 0.6;
    margin-top: 0.4rem;
  }

  .share-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .btn-share {
    flex: 1;
    background: rgba(255, 255, 255, 0.06);
    color: #f0e6ff;
    font-size: 0.85rem;
    padding: 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .player-list {
    text-align: left;
  }

  .player-list h3 {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-bottom: 0.6rem;
    display: flex;
    justify-content: space-between;
  }

  .count {
    color: #ff0000;
  }

  .player-list ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .player-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7rem 1rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .player-list li.is-me {
    border-color: rgba(255, 0, 0, 0.3);
    background: rgba(255, 0, 0, 0.05);
  }

  .host-badge { margin-left: 0.5rem; }

  .avatar {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }

  .you-badge {
    font-size: 0.7rem;
    background: rgba(168, 85, 247, 0.2);
    padding: 0.15rem 0.4rem;
    border-radius: 6px;
    color: #c084fc;
  }

  .waiting-more {
    text-align: center;
    font-size: 0.8rem;
    opacity: 0.4;
    margin-top: 0.5rem;
    font-style: italic;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .btn-start {
    background: #cc0000;
    color: white;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
    border: 2px solid #ff0000;
    padding: 1rem;
    font-size: 0.7rem;
    width: 100%;
  }

  .hint-text {
    font-size: 0.8rem;
    opacity: 0.5;
  }

  .wait-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    width: 100%;
    justify-content: center;
  }

  .wait-icon {
    font-size: 1.3rem;
    animation: pulse 1.5s infinite;
  }

  .wait-box p {
    opacity: 0.7;
    font-size: 0.95rem;
  }

  .error {
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 0.9rem;
    text-align: center;
  }

  .mode-selector {
    width: 100%;
    text-align: center;
  }

  .mode-selector h3 {
    font-size: 0.6rem;
    opacity: 0.6;
    margin-bottom: 0.6rem;
    text-transform: uppercase;
  }

  .mode-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
  }

  .mode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    padding: 0.6rem 0.3rem;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    transition: all 0.15s;
  }

  .mode-btn.selected {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.08);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
  }

  .mode-icon {
    font-size: 1.3rem;
  }

  .mode-name {
    font-size: 0.45rem;
    color: #fff;
  }

  .mode-desc {
    font-size: 0.4rem;
    opacity: 0.5;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @media (max-width: 480px) {
    .code-value {
      font-size: 2.2rem;
      letter-spacing: 0.4rem;
    }

    .share-buttons {
      flex-direction: column;
    }
  }
</style>
