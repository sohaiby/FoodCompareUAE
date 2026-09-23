"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careemAdapter = exports.CareemAdapter = void 0;
const db_1 = require("../db");
class CareemAdapter {
    platformId = 'careem';
    isMock = true;
    async getRestaurants(geohash, _lat, _lng) {
        return db_1.db.getRestaurantsByGeohash(geohash);
    }
    async getMenu(restaurantId) {
        return db_1.db.getMenuItemsByRestaurant(restaurantId);
    }
    async getDeliveryFee(restaurantId) {
        return db_1.db.getPlatformDeliveryFee(restaurantId, this.platformId);
    }
    async getOffers(restaurantId) {
        return db_1.db.getOffersForRestaurant(restaurantId, this.platformId);
    }
    async getItemPricing(menuItemId) {
        return db_1.db.getPlatformItemPricing(menuItemId, this.platformId);
    }
    getDeepLink(restaurantSlug, menuItemId) {
        const webUrl = `https://www.careem.com/en-ae/food/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
        return {
            platform: this.platformId,
            webUrl,
            appDeepLink: `careem://food/merchant/${restaurantSlug}`
        };
    }
    async isHealthy() {
        return true;
    }
}
exports.CareemAdapter = CareemAdapter;
exports.careemAdapter = new CareemAdapter();
