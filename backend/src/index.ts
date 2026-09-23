import Fastify from 'fastify';
import cors from '@fastify/cors';
import { apiRoutes } from './routes/api.routes';
import { runSeed } from './db/seed';
import { setupHourlyScheduler } from './scheduler/grid-crawler';
import { db } from './db';

const PORT = parseInt(process.env.PORT || '3005', 10);
const HOST = process.env.HOST || '127.0.0.1';

async function startServer() {
  const fastify = Fastify({
    logger: true
  });

  // Enable CORS for frontend development
  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  // Seed DB if empty
  const stats = db.getStats();
  if (stats.restaurantsCount === 0) {
    fastify.log.info('Empty database detected. Auto-seeding UAE food database...');
    runSeed();
  }

  // Register API Routes
  await fastify.register(apiRoutes, { prefix: '/api' });

  // Initialize Scheduler
  setupHourlyScheduler();

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`\n======================================================`);
    console.log(`🚀 UAE Food Delivery Price Compare API Backend Running!`);
    console.log(`📍 Local URL: http://localhost:${PORT}/api/health`);
    console.log(`📍 Seed location: Al Rashidia 3, Ajman (wn5r6)`);
    console.log(`======================================================\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
