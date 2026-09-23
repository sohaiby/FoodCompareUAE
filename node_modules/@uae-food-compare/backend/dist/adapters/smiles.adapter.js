"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smilesAdapter = exports.SmilesAdapter = void 0;
const db_1 = require("../db");
class SmilesAdapter {
    platformId = 'smiles';
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
        const webUrl = `https://www.smilesuae.ae/food/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
        return {
            platform: this.platformId,
            webUrl,
            appDeepLink: `smiles://food/restaurant/${restaurantSlug}`
        };
    }
    async isHealthy() {
        return true;
    }
}
exports.SmilesAdapter = SmilesAdapter;
exports.smilesAdapter = new SmilesAdapter();
