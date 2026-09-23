import { ALL_PLATFORM_IDS } from '@uae-food-compare/shared';
import { db } from '../db';
import { adapterRegistry } from '../adapters';
import { resolveLocationCell } from '../utils/geohash';
export class CrawlerService {
    /**
     * Refreshes a location cell by querying all 6 platform adapters concurrently.
     */
    async refreshCell(request) {
        const startTime = Date.now();
        const locationCell = resolveLocationCell(request.lat, request.lng, request.geohash);
        // Mark status as refreshing
        db.updateGridCell({
            ...locationCell,
            status: 'refreshing'
        });
        // Fire all adapters concurrently
        const platformPromises = ALL_PLATFORM_IDS.map(async (platformId) => {
            const adapter = adapterRegistry.getAdapter(platformId);
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
                    db.upsertRestaurants(locationCell.geohash, restaurants);
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
        const cellRestaurants = db.getRestaurantsByGeohash(locationCell.geohash);
        const cellRestIds = cellRestaurants.map((r) => r.id);
        // Update cell cache timestamp and status
        db.updateGridCell({
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
export const crawlerService = new CrawlerService();
