"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceService = exports.PriceService = void 0;
const shared_1 = require("@uae-food-compare/shared");
const db_1 = require("../db");
const adapters_1 = require("../adapters");
const geohash_1 = require("../utils/geohash");
class PriceService {
    /**
     * Compares prices across all platforms for a given menu item and location geohash.
     */
    async compareMenuItemPrices(menuItemId, geohash, lat, lng) {
        const item = db_1.db.getMenuItemById(menuItemId);
        if (!item)
            return null;
        const restaurant = db_1.db.getRestaurantById(item.restaurantId);
        if (!restaurant)
            return null;
        const locationCell = (0, geohash_1.resolveLocationCell)(lat, lng, geohash);
        const platformOptions = [];
        for (const platformId of shared_1.ALL_PLATFORM_IDS) {
            const adapter = adapters_1.adapterRegistry.getAdapter(platformId);
            if (!adapter)
                continue;
            const metadata = shared_1.PLATFORMS_METADATA[platformId];
            const pricing = await adapter.getItemPricing(item.id, restaurant.id);
            const deliveryFee = await adapter.getDeliveryFee(restaurant.id, lat, lng);
            const offers = await adapter.getOffers(restaurant.id);
            const deepLink = adapter.getDeepLink(restaurant.slug, item.id);
            const basePrice = pricing.basePriceAed;
            let discountAmount = 0;
            // Auto-applied percent discount
            if (pricing.discountPercent && pricing.discountPercent > 0) {
                discountAmount += (basePrice * pricing.discountPercent) / 100;
            }
            // Check for auto-applied offers
            for (const offer of offers) {
                if (offer.isAutoApplied) {
                    if (offer.discountPercent && basePrice >= (offer.minSpendAed || 0)) {
                        const offerDiscount = (basePrice * offer.discountPercent) / 100;
                        const capped = offer.maxDiscountAed ? Math.min(offerDiscount, offer.maxDiscountAed) : offerDiscount;
                        discountAmount = Math.max(discountAmount, capped);
                    }
                    else if (offer.discountAed && basePrice >= (offer.minSpendAed || 0)) {
                        discountAmount = Math.max(discountAmount, offer.discountAed);
                    }
                }
            }
            const discountedItemPrice = Math.max(0, Number((basePrice - discountAmount).toFixed(1)));
            const deliveryFeeAed = deliveryFee.baseFeeAed + deliveryFee.surgeFeeAed;
            const finalTotal = Number((discountedItemPrice + deliveryFeeAed).toFixed(1));
            platformOptions.push({
                platform: platformId,
                platformDisplayName: metadata.displayName,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                menuItemId: item.id,
                menuItemName: item.name,
                originalItemPriceAed: basePrice,
                discountedItemPriceAed: discountedItemPrice,
                deliveryFeeAed,
                serviceFeeAed: 0,
                smallOrderFeeAed: 0,
                appliedDiscountAed: Number(discountAmount.toFixed(1)),
                finalTotalAed: finalTotal,
                etaMinutes: deliveryFee.etaMinutes,
                rating: restaurant.rating,
                activeOffers: offers,
                deepLink,
                isAvailable: pricing.isAvailable,
                isMock: adapter.isMock
            });
        }
        // Sort by final total ascending
        platformOptions.sort((a, b) => a.finalTotalAed - b.finalTotalAed);
        const lowestTotalAed = platformOptions.length > 0 ? platformOptions[0].finalTotalAed : 0;
        const highestTotalAed = platformOptions.length > 0 ? platformOptions[platformOptions.length - 1].finalTotalAed : 0;
        const bestPlatform = platformOptions.length > 0 ? platformOptions[0].platform : 'talabat';
        const maxSavingsAed = Number((highestTotalAed - lowestTotalAed).toFixed(1));
        return {
            query: item.name,
            restaurantName: restaurant.name,
            menuItemName: item.name,
            menuItemDescription: item.description,
            imageUrl: item.imageUrl,
            geohash: locationCell.geohash,
            locationName: locationCell.name,
            bestPlatform,
            lowestTotalAed,
            highestTotalAed,
            maxSavingsAed,
            platformOptions,
            lastUpdated: new Date().toISOString()
        };
    }
}
exports.PriceService = PriceService;
exports.priceService = new PriceService();
