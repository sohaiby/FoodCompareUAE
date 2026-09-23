export type PlatformId = 'talabat' | 'noon' | 'careem' | 'deliveroo' | 'keeta' | 'smiles';

export type OfferType = 
  | 'percent_discount' 
  | 'flat_discount' 
  | 'bogo' 
  | 'bank_card' 
  | 'free_delivery' 
  | 'promo_code';

export interface OfferBadge {
  id: string;
  platform: PlatformId;
  type: OfferType;
  badgeText: string;
  description: string;
  code?: string;
  bankName?: 'ENBD' | 'ADCB' | 'FAB' | 'Mashreq' | 'DIB' | 'HSBC' | 'CBD' | 'Noon VIP';
  discountPercent?: number;
  discountAed?: number;
  flatDiscountAed?: number;
  minSpendAed?: number;
  minOrderAed?: number;
  maxDiscountAed?: number;
  isAutoApplied: boolean;
  termsNote?: string;
}

export interface DeliveryFee {
  platform: PlatformId;
  baseFeeAed: number;
  surgeFeeAed: number;
  freeThresholdAed?: number;
  minOrderAed: number;
  etaMinutes: {
    min: number;
    max: number;
  };
}

export interface DeepLinkInfo {
  platform: PlatformId;
  webUrl: string;
  appDeepLink?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  isSponsored?: boolean;
  affiliateSource?: string;
  addressSummary?: string;
  phone?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  isPopular?: boolean;
  basePriceAed: number;
}

export interface PlatformPrice {
  platform: PlatformId;
  platformDisplayName: string;
  restaurantId: string;
  restaurantName: string;
  menuItemId: string;
  menuItemName: string;
  originalItemPriceAed: number;
  discountedItemPriceAed: number;
  deliveryFeeAed: number;
  serviceFeeAed: number;
  smallOrderFeeAed: number;
  appliedDiscountAed: number;
  finalTotalAed: number;
  etaMinutes: {
    min: number;
    max: number;
  };
  rating: number;
  activeOffers: OfferBadge[];
  deepLink: DeepLinkInfo;
  isAvailable: boolean;
  statusMessage?: string;
  isMock: boolean;
}

export interface PriceComparison {
  query: string;
  restaurantName: string;
  menuItemName: string;
  menuItemDescription?: string;
  imageUrl?: string;
  geohash: string;
  locationName: string;
  bestPlatform: PlatformId;
  lowestTotalAed: number;
  highestTotalAed: number;
  maxSavingsAed: number;
  platformOptions: PlatformPrice[];
  lastUpdated: string;
}

export interface LocationCell {
  geohash: string;
  name: string;
  emirate: string;
  lat: number;
  lng: number;
  lastRefreshedAt?: string;
  status: 'cached' | 'refreshing' | 'stale' | 'pending';
  restaurantCount: number;
}

export interface SearchResultSummary {
  restaurant: Restaurant;
  availablePlatforms: {
    platform: PlatformId;
    isAvailable: boolean;
    deliveryFeeAed: number;
    etaMinutes: { min: number; max: number };
  }[];
  menuItems: {
    item: MenuItem;
    bestPriceAed: number;
    bestPlatform: PlatformId;
    platformCount: number;
  }[];
}

export interface PlatformMetadata {
  id: PlatformId;
  name: string;
  displayName: string;
  brandColor: string;
  accentColor: string;
  textColor: string;
  badgeBgColor: string;
  logo: string;
  webBaseUrl: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  isMocked: boolean;
  status: 'healthy' | 'degraded' | 'maintenance';
}

export interface RefreshCellRequest {
  geohash: string;
  lat?: number;
  lng?: number;
  forceAllPlatforms?: boolean;
}

export interface RefreshCellResponse {
  geohash: string;
  refreshedAt: string;
  durationMs: number;
  platformsRefreshed: {
    platform: PlatformId;
    success: boolean;
    restaurantCount: number;
    menuItemCount: number;
    error?: string;
    isMock: boolean;
  }[];
}
