import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { handleConnection, initWsHandler } from './ws-handler';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  const fastify = Fastify({ logger: true });

  await fastify.register(fastifyCors, {
    origin: true,
  });

  await fastify.register(fastifyWebsocket);

  // Serve static frontend files in production
  const clientDist = path.join(__dirname, '../../client/dist');
  await fastify.register(fastifyStatic, {
    root: clientDist,
    wildcard: false,
  });

  // Initialize WebSocket handler
  initWsHandler();

  // WebSocket route
  fastify.get('/ws', { websocket: true }, (connection, _req) => {
    handleConnection(connection.socket as unknown as import('ws').WebSocket);
  });

  // Health check
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: Date.now() };
  });

  // SPA fallback — serve index.html for all non-API/non-WS routes
  fastify.setNotFoundHandler(async (_req, reply) => {
    return reply.sendFile('index.html');
  });

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Chrono-Bomb server running on ${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
