import { db } from '../db';
export class KeetaAdapter {
    platformId = 'keeta';
    isMock = true;
    async getRestaurants(geohash, _lat, _lng) {
        return db.getRestaurantsByGeohash(geohash);
    }
    async getMenu(restaurantId) {
        return db.getMenuItemsByRestaurant(restaurantId);
    }
    async getDeliveryFee(restaurantId) {
        return db.getPlatformDeliveryFee(restaurantId, this.platformId);
    }
    async getOffers(restaurantId) {
        return db.getOffersForRestaurant(restaurantId, this.platformId);
    }
    async getItemPricing(menuItemId) {
        return db.getPlatformItemPricing(menuItemId, this.platformId);
    }
    getDeepLink(restaurantSlug, menuItemId) {
        const webUrl = `https://www.keeta.com/ae/restaurant/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
        return {
            platform: this.platformId,
            webUrl,
            appDeepLink: `keeta://restaurant/${restaurantSlug}`
        };
    }
    async isHealthy() {
        return true;
    }
}
export const keetaAdapter = new KeetaAdapter();
