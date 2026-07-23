# 💣 Chrono-Bomb

Party game multijoueur en temps réel. 3 à 8 joueurs, une bombe, des mini-défis, un chrono secret.

## Règles

1. Rejoins un salon via un code à 4 lettres
2. Une bombe est assignée à un joueur au hasard
3. Résous un mini-défi rapide pour passer la bombe
4. Le chrono secret (15-30s) est invisible — quand il expire, la bombe explose
5. Le joueur qui tient la bombe perd 1 PV (3 PV au départ)
6. Dernier survivant = gagnant

## Développement local

```bash
# Terminal 1 — Serveur
cd server
npm install
npm run dev

# Terminal 2 — Client
cd client
npm install
npm run dev
```

Ouvre http://localhost:5173

## Déploiement

```bash
docker build -t chrono-bomb .
docker run -p 3001:3001 chrono-bomb
```

Ou pousse sur Railway/Render — le Dockerfile est détecté automatiquement.

## Stack

- Frontend : Svelte 4 + Vite
- Backend : Node.js + Fastify + WebSocket
- Langage : TypeScript
- Déploiement : Docker
