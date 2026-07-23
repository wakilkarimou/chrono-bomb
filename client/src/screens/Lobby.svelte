<script lang="ts">
  import { send } from '../lib/ws-client';
  import { players, roomCode, isHost, errorMessage, currentScreen, playerId } from '../lib/stores';
  import { MIN_PLAYERS } from '../shared';

  function startGame() {
    send({ type: 'start_game' });
  }

  function leaveRoom() {
    send({ type: 'leave_room' });
    currentScreen.set('home');
    roomCode.set(null);
    playerId.set(null);
    players.set([]);
  }

  function copyCode() {
    if ($roomCode) {
      navigator.clipboard.writeText($roomCode);
    }
  }
</script>

<div class="lobby">
  <h2>🏠 Salle d'attente</h2>

  <div class="room-code" on:click={copyCode} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && copyCode()}>
    <span class="code-label">Code du salon</span>
    <span class="code-value">{$roomCode}</span>
    <span class="copy-hint">📋 Copier</span>
  </div>

  <div class="player-list">
    <h3>Joueurs ({$players.length}/8)</h3>
    <ul>
      {#each $players as player}
        <li class:is-me={player.id === $playerId}>
          <span class="player-name">
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
  </div>

  <div class="actions">
    {#if $isHost}
      <button class="btn-start" on:click={startGame} disabled={$players.length < MIN_PLAYERS}>
        🚀 Lancer la partie {#if $players.length < MIN_PLAYERS}({MIN_PLAYERS} min){/if}
      </button>
    {:else}
      <p class="wait-msg">En attente du lancement par l'hôte...</p>
    {/if}
    <button class="btn-leave" on:click={leaveRoom}>Quitter</button>
  </div>

  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}
</div>

<style>
  .lobby {
    text-align: center;
    max-width: 450px;
    width: 100%;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .room-code {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(168, 85, 247, 0.3);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .room-code:hover {
    border-color: rgba(168, 85, 247, 0.6);
  }

  .code-label {
    display: block;
    font-size: 0.85rem;
    opacity: 0.6;
    margin-bottom: 0.5rem;
  }

  .code-value {
    display: block;
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: 0.5rem;
    color: #a855f7;
    text-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
  }

  .copy-hint {
    display: block;
    font-size: 0.8rem;
    opacity: 0.5;
    margin-top: 0.5rem;
  }

  .player-list {
    text-align: left;
    margin-bottom: 2rem;
  }

  .player-list h3 {
    font-size: 1rem;
    opacity: 0.7;
    margin-bottom: 0.75rem;
  }

  .player-list ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .player-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .player-list li.is-me {
    border-color: rgba(168, 85, 247, 0.3);
    background: rgba(168, 85, 247, 0.08);
  }

  .host-badge { margin-left: 0.5rem; }

  .you-badge {
    font-size: 0.75rem;
    background: rgba(168, 85, 247, 0.2);
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    color: #c084fc;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-start {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    padding: 1rem;
    font-size: 1.1rem;
  }

  .btn-leave {
    background: rgba(255, 255, 255, 0.08);
    color: #f0e6ff;
    font-size: 0.9rem;
    padding: 0.6rem;
  }

  .wait-msg {
    opacity: 0.6;
    font-style: italic;
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

  @media (max-width: 480px) {
    .code-value {
      font-size: 2.5rem;
      letter-spacing: 0.4rem;
    }

    .room-code {
      padding: 1rem;
    }
  }
</style>
