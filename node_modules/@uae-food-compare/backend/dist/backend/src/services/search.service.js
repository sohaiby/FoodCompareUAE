import { ALL_PLATFORM_IDS } from '@uae-food-compare/shared';
import { db } from '../db';
import { resolveLocationCell } from '../utils/geohash';
import { priceService } from './price.service';
export class SearchService {
    /**
     * Searches restaurants and menu items by query string in the specified location.
     */
    async search(query = '', geohash, lat, lng, cuisine) {
        const locationCell = resolveLocationCell(lat, lng, geohash);
        const restaurants = db.getRestaurantsByGeohash(locationCell.geohash);
        const q = query.trim().toLowerCase();
        const results = [];
        for (const restaurant of restaurants) {
            // Filter by cuisine if specified
            if (cuisine && !restaurant.cuisines.some((c) => c.toLowerCase().includes(cuisine.toLowerCase()))) {
                continue;
            }
            const allItems = db.getMenuItemsByRestaurant(restaurant.id);
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
            const availablePlatforms = ALL_PLATFORM_IDS.map((platform) => {
                const fee = db.getPlatformDeliveryFee(restaurant.id, platform);
                return {
                    platform,
                    isAvailable: true,
                    deliveryFeeAed: fee.baseFeeAed + fee.surgeFeeAed,
                    etaMinutes: fee.etaMinutes
                };
            });
            // Compute best price preview for each item
            const itemSummaries = await Promise.all((matchedItems.length > 0 ? matchedItems : allItems.slice(0, 3)).map(async (item) => {
                const comparison = await priceService.compareMenuItemPrices(item.id, locationCell.geohash, lat, lng);
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
export const searchService = new SearchService();
