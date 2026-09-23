"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = apiRoutes;
const shared_1 = require("@uae-food-compare/shared");
const geohash_1 = require("../utils/geohash");
const search_service_1 = require("../services/search.service");
const price_service_1 = require("../services/price.service");
const crawler_service_1 = require("../services/crawler.service");
const adapters_1 = require("../adapters");
const db_1 = require("../db");
async function apiRoutes(fastify, _opts) {
    // Health & Stats
    fastify.get('/health', async () => {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            stats: db_1.db.getStats()
        };
    });
    // Platform Metadata
    fastify.get('/platforms', async () => {
        return {
            platforms: shared_1.PLATFORMS_METADATA
        };
    });
    // Adapter Health Status
    fastify.get('/adapters/status', async () => {
        const statuses = await adapters_1.adapterRegistry.getAdapterStatuses();
        return {
            adapters: statuses
        };
    });
    // Seed Locations
    fastify.get('/locations/seeds', async () => {
        return {
            locations: shared_1.SEED_LOCATIONS
        };
    });
    // Resolve Location from GPS or Geohash
    fastify.get('/locations/resolve', async (request) => {
        const lat = request.query.lat ? parseFloat(request.query.lat) : undefined;
        const lng = request.query.lng ? parseFloat(request.query.lng) : undefined;
        const geohash = request.query.geohash;
        const resolved = (0, geohash_1.resolveLocationCell)(lat, lng, geohash);
        return {
            location: resolved
        };
    });
    // Search Dishes & Restaurants
    fastify.get('/search', async (request) => {
        const { query = '', geohash = 'wn5r6', cuisine } = request.query;
        const lat = request.query.lat ? parseFloat(request.query.lat) : undefined;
        const lng = request.query.lng ? parseFloat(request.query.lng) : undefined;
        const results = await search_service_1.searchService.search(query, geohash, lat, lng, cuisine);
        return {
            geohash,
            query,
            count: results.length,
            results
        };
    });
    // Real-Time Price Comparison across 6 Platforms
    fastify.get('/compare', async (request, reply) => {
        const { menuItemId, geohash = 'wn5r6' } = request.query;
        const lat = request.query.lat ? parseFloat(request.query.lat) : undefined;
        const lng = request.query.lng ? parseFloat(request.query.lng) : undefined;
        if (!menuItemId) {
            return reply.code(400).send({ error: 'menuItemId is required' });
        }
        const comparison = await price_service_1.priceService.compareMenuItemPrices(menuItemId, geohash, lat, lng);
        if (!comparison) {
            return reply.code(404).send({ error: 'Menu item or restaurant not found' });
        }
        return {
            comparison
        };
    });
    // On-Demand Single Cell Live Refresh
    fastify.post('/refresh-cell', async (request) => {
        const body = request.body || { geohash: 'wn5r6' };
        const refreshResult = await crawler_service_1.crawlerService.refreshCell(body);
        return {
            result: refreshResult
        };
    });
}
