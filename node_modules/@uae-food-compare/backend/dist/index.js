"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const api_routes_1 = require("./routes/api.routes");
const seed_1 = require("./db/seed");
const grid_crawler_1 = require("./scheduler/grid-crawler");
const db_1 = require("./db");
const PORT = parseInt(process.env.PORT || '3005', 10);
const HOST = process.env.HOST || '127.0.0.1';
async function startServer() {
    const fastify = (0, fastify_1.default)({
        logger: true
    });
    // Enable CORS for frontend development
    await fastify.register(cors_1.default, {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });
    // Seed DB if empty
    const stats = db_1.db.getStats();
    if (stats.restaurantsCount === 0) {
        fastify.log.info('Empty database detected. Auto-seeding UAE food database...');
        (0, seed_1.runSeed)();
    }
    // Register API Routes
    await fastify.register(api_routes_1.apiRoutes, { prefix: '/api' });
    // Initialize Scheduler
    (0, grid_crawler_1.setupHourlyScheduler)();
    try {
        await fastify.listen({ port: PORT, host: HOST });
        console.log(`\n======================================================`);
        console.log(`🚀 UAE Food Delivery Price Compare API Backend Running!`);
        console.log(`📍 Local URL: http://localhost:${PORT}/api/health`);
        console.log(`📍 Seed location: Al Rashidia 3, Ajman (wn5r6)`);
        console.log(`======================================================\n`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
startServer();
