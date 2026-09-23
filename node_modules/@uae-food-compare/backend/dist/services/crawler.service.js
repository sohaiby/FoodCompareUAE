"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlerService = exports.CrawlerService = void 0;
const shared_1 = require("@uae-food-compare/shared");
const db_1 = require("../db");
const adapters_1 = require("../adapters");
const geohash_1 = require("../utils/geohash");
class CrawlerService {
    /**
     * Refreshes a location cell by querying all 6 platform adapters concurrently.
     */
    async refreshCell(request) {
        const startTime = Date.now();
        const locationCell = (0, geohash_1.resolveLocationCell)(request.lat, request.lng, request.geohash);
        // Mark status as refreshing
        db_1.db.updateGridCell({
            ...locationCell,
            status: 'refreshing'
        });
        // Fire all adapters concurrently
        const platformPromises = shared_1.ALL_PLATFORM_IDS.map(async (platformId) => {
            const adapter = adapters_1.adapterRegistry.getAdapter(platformId);
            if (!adapter) {
                return {
                    platform: platformId,
                    success: false,
                    restaurantCount: 0,
                    menuItemCount: 0,
                    error: 'Adapter not registered',
                    isMock: true
                };
            }
            try {
                const restaurants = await adapter.getRestaurants(locationCell.geohash, locationCell.lat, locationCell.lng);
                // Persist scraped venues to this location cell
                if (restaurants && restaurants.length > 0) {
                    db_1.db.upsertRestaurants(locationCell.geohash, restaurants);
                }
                let menuItemCount = 0;
                for (const r of restaurants) {
                    const menu = await adapter.getMenu(r.id, locationCell.lat, locationCell.lng);
                    menuItemCount += menu.length;
                }
                return {
                    platform: platformId,
                    success: true,
                    restaurantCount: restaurants.length,
                    menuItemCount,
                    isMock: adapter.isMock
                };
            }
            catch (err) {
                return {
                    platform: platformId,
                    success: false,
                    restaurantCount: 0,
                    menuItemCount: 0,
                    error: err.message || 'Scrape failed',
                    isMock: adapter.isMock
                };
            }
        });
        const results = await Promise.all(platformPromises);
        const durationMs = Date.now() - startTime;
        const nowIso = new Date().toISOString();
        const cellRestaurants = db_1.db.getRestaurantsByGeohash(locationCell.geohash);
        const cellRestIds = cellRestaurants.map((r) => r.id);
        // Update cell cache timestamp and status
        db_1.db.updateGridCell({
            ...locationCell,
            status: 'cached',
            lastRefreshedAt: nowIso,
            restaurantCount: cellRestIds.length
        }, cellRestIds);
        return {
            geohash: locationCell.geohash,
            refreshedAt: nowIso,
            durationMs,
            platformsRefreshed: results
        };
    }
}
exports.CrawlerService = CrawlerService;
exports.crawlerService = new CrawlerService();
