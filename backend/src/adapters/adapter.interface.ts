import {
  PlatformId,
  Restaurant,
  MenuItem,
  DeliveryFee,
  OfferBadge,
  DeepLinkInfo
} from '@uae-food-compare/shared';

export interface IPlatformAdapter {
  readonly platformId: PlatformId;
  readonly isMock: boolean;

  /**
   * Fetches all restaurants delivering to the target grid cell / coordinate.
   */
  getRestaurants(geohash: string, lat?: number, lng?: number): Promise<Restaurant[]>;

  /**
   * Fetches menu items and base prices for a specific restaurant.
   */
  getMenu(restaurantId: string, lat?: number, lng?: number): Promise<MenuItem[]>;

  /**
   * Fetches delivery fee and ETA for a restaurant to the specified location.
   */
  getDeliveryFee(restaurantId: string, lat?: number, lng?: number): Promise<DeliveryFee>;

  /**
   * Fetches inline restaurant offers and active platform campaigns.
   */
  getOffers(restaurantId: string): Promise<OfferBadge[]>;

  /**
   * Fetches item price and promo discount on this platform.
   */
  getItemPricing(
    menuItemId: string,
    restaurantId: string
  ): Promise<{ basePriceAed: number; discountPercent?: number; isAvailable: boolean }>;

  /**
   * Generates web and app deep links to direct user to checkout.
   */
  getDeepLink(restaurantSlug: string, menuItemId?: string): DeepLinkInfo;

  /**
   * Health check for adapter availability/connectivity.
   */
  isHealthy(): Promise<boolean>;
}
