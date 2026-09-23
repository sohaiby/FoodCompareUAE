import { SEED_LOCATIONS, PLATFORMS_METADATA } from '@uae-food-compare/shared';
import { resolveLocationCell } from '../utils/geohash';
import { searchService } from '../services/search.service';
import { priceService } from '../services/price.service';
import { crawlerService } from '../services/crawler.service';
import { adapterRegistry } from '../adapters';
import { db } from '../db';
export async function apiRoutes(fastify, _opts) {
    // Health & Stats
    fastify.get('/health', async () => {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            stats: db.getStats()
        };
    });
    // Platform Metadata
    fastify.get('/platforms', async () => {
        return {
            platforms: PLATFORMS_METADATA
        };
    });
    // Adapter Health Status
    fastify.get('/adapters/status', async () => {
        const statuses = await adapterRegistry.getAdapterStatuses();
        return {
            adapters: statuses
        };
    });
    // Seed Locations
    fastify.get('/locations/seeds', async () => {
        return {
            locations: SEED_LOCATIONS
        };
    });
    // Resolve Location from GPS or Geohash
    fastify.get('/locations/resolve', async (request) => {
        const lat = request.query.lat ? parseFloat(request.query.lat) : undefined;
        const lng = request.query.lng ? parseFloat(request.query.lng) : undefined;
        const geohash = request.query.geohash;
        const resolved = resolveLocationCell(lat, lng, geohash);
        return {
            location: resolved
        };
    });
    // Search Dishes & Restaurants
    fastify.get('/search', async (request) => {
        const { query = '', geohash = 'wn5r6', cuisine } = request.query;
        const lat = request.query.lat ? parseFloat(request.query.lat) : undefined;
        const lng = request.query.lng ? parseFloat(request.query.lng) : undefined;
        const results = await searchService.search(query, geohash, lat, lng, cuisine);
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
        const comparison = await priceService.compareMenuItemPrices(menuItemId, geohash, lat, lng);
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
        const refreshResult = await crawlerService.refreshCell(body);
        return {
            result: refreshResult
        };
    });
}
