import {
  PlatformId,
  PlatformPrice,
  PriceComparison,
  PLATFORMS_METADATA,
  ALL_PLATFORM_IDS
} from '@uae-food-compare/shared';
import { db } from '../db';
import { adapterRegistry } from '../adapters';
import { resolveLocationCell } from '../utils/geohash';

export class PriceService {
  /**
   * Compares prices across all platforms for a given menu item and location geohash.
   */
  public async compareMenuItemPrices(
    menuItemId: string,
    geohash: string,
    lat?: number,
    lng?: number
  ): Promise<PriceComparison | null> {
    const item = db.getMenuItemById(menuItemId);
    if (!item) return null;

    const restaurant = db.getRestaurantById(item.restaurantId);
    if (!restaurant) return null;

    const locationCell = resolveLocationCell(lat, lng, geohash);
    const platformOptions: PlatformPrice[] = [];

    for (const platformId of ALL_PLATFORM_IDS) {
      const adapter = adapterRegistry.getAdapter(platformId);
      if (!adapter) continue;

      const metadata = PLATFORMS_METADATA[platformId];
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
          } else if (offer.discountAed && basePrice >= (offer.minSpendAed || 0)) {
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

    // Separate available vs unavailable platforms
    const availableOptions = platformOptions.filter((p) => p.isAvailable);
    const unavailableOptions = platformOptions.filter((p) => !p.isAvailable);

    // Sort available by final total ascending
    availableOptions.sort((a, b) => a.finalTotalAed - b.finalTotalAed);

    const sortedOptions = [...availableOptions, ...unavailableOptions];

    const lowestTotalAed = availableOptions.length > 0 ? availableOptions[0].finalTotalAed : (platformOptions[0]?.finalTotalAed || 0);
    const highestTotalAed = availableOptions.length > 0 ? availableOptions[availableOptions.length - 1].finalTotalAed : (platformOptions[0]?.finalTotalAed || 0);
    const bestPlatform = availableOptions.length > 0 ? availableOptions[0].platform : (platformOptions[0]?.platform || 'talabat');
    const maxSavingsAed = availableOptions.length > 1 ? Number((highestTotalAed - lowestTotalAed).toFixed(1)) : 0;

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
      platformOptions: sortedOptions,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const priceService = new PriceService();
