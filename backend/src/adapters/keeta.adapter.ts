import {
  PlatformId,
  Restaurant,
  MenuItem,
  DeliveryFee,
  OfferBadge,
  DeepLinkInfo
} from '@uae-food-compare/shared';
import { IPlatformAdapter } from './adapter.interface';
import { db } from '../db';

export class KeetaAdapter implements IPlatformAdapter {
  public readonly platformId: PlatformId = 'keeta';
  public readonly isMock: boolean = true;

  async getRestaurants(geohash: string, _lat?: number, _lng?: number): Promise<Restaurant[]> {
    return db.getRestaurantsByGeohash(geohash);
  }

  async getMenu(restaurantId: string): Promise<MenuItem[]> {
    return db.getMenuItemsByRestaurant(restaurantId);
  }

  async getDeliveryFee(restaurantId: string): Promise<DeliveryFee> {
    return db.getPlatformDeliveryFee(restaurantId, this.platformId);
  }

  async getOffers(restaurantId: string): Promise<OfferBadge[]> {
    return db.getOffersForRestaurant(restaurantId, this.platformId);
  }

  async getItemPricing(menuItemId: string): Promise<{ basePriceAed: number; discountPercent?: number; isAvailable: boolean }> {
    return db.getPlatformItemPricing(menuItemId, this.platformId);
  }

  getDeepLink(restaurantSlug: string, menuItemId?: string): DeepLinkInfo {
    const webUrl = `https://www.keeta.com/ae/restaurant/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
    return {
      platform: this.platformId,
      webUrl,
      appDeepLink: `keeta://restaurant/${restaurantSlug}`
    };
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

export const keetaAdapter = new KeetaAdapter();
