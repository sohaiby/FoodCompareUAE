"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchService = exports.SearchService = void 0;
const shared_1 = require("@uae-food-compare/shared");
const db_1 = require("../db");
const geohash_1 = require("../utils/geohash");
const price_service_1 = require("./price.service");
class SearchService {
    /**
     * Searches restaurants and menu items by query string in the specified location.
     */
    async search(query = '', geohash, lat, lng, cuisine) {
        const locationCell = (0, geohash_1.resolveLocationCell)(lat, lng, geohash);
        const restaurants = db_1.db.getRestaurantsByGeohash(locationCell.geohash);
        const q = query.trim().toLowerCase();
        const results = [];
        for (const restaurant of restaurants) {
            // Filter by cuisine if specified
            if (cuisine && !restaurant.cuisines.some((c) => c.toLowerCase().includes(cuisine.toLowerCase()))) {
                continue;
            }
            const allItems = db_1.db.getMenuItemsByRestaurant(restaurant.id);
            const restaurantMatches = !q || restaurant.name.toLowerCase().includes(q) || restaurant.cuisines.some(c => c.toLowerCase().includes(q));
            const matchedItems = q
                ? allItems.filter((item) => restaurantMatches ||
                    item.name.toLowerCase().includes(q) ||
                    (item.description && item.description.toLowerCase().includes(q)) ||
                    item.category.toLowerCase().includes(q))
                : allItems;
            if (!restaurantMatches && matchedItems.length === 0) {
                continue;
            }
            // Compute platform delivery fee summaries
            const availablePlatforms = shared_1.ALL_PLATFORM_IDS.map((platform) => {
                const fee = db_1.db.getPlatformDeliveryFee(restaurant.id, platform);
                return {
                    platform,
                    isAvailable: true,
                    deliveryFeeAed: fee.baseFeeAed + fee.surgeFeeAed,
                    etaMinutes: fee.etaMinutes
                };
            });
            // Compute best price preview for each item
            const itemSummaries = await Promise.all((matchedItems.length > 0 ? matchedItems : allItems.slice(0, 3)).map(async (item) => {
                const comparison = await price_service_1.priceService.compareMenuItemPrices(item.id, locationCell.geohash, lat, lng);
                return {
                    item,
                    bestPriceAed: comparison ? comparison.lowestTotalAed : item.basePriceAed,
                    bestPlatform: comparison ? comparison.bestPlatform : 'noon',
                    platformCount: comparison ? comparison.platformOptions.filter((p) => p.isAvailable).length : 6
                };
            }));
            results.push({
                restaurant,
                availablePlatforms,
                menuItems: itemSummaries
            });
        }
        return results;
    }
}
exports.SearchService = SearchService;
exports.searchService = new SearchService();
