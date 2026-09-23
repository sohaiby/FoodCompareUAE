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

interface TalabatAreaMapping {
  areaId: number;
  slug: string;
  adjacentAreas?: { areaId: number; slug: string }[];
}

// Predefined Talabat Area IDs for key UAE seed zones (with adjacent serving areas)
const TALABAT_AREAS: Record<string, TalabatAreaMapping> = {
  'wn5r6': {
    areaId: 4179,
    slug: 'al-rashidiya-3',
    adjacentAreas: [
      { areaId: 6782, slug: 'al-rashidiya-3' },
      { areaId: 4178, slug: 'al-nuaimia' },
      { areaId: 4175, slug: 'corniche' },
      { areaId: 4176, slug: 'al-jurf-1' }
    ]
  },
  'wn5r7': { areaId: 4178, slug: 'al-nuaimia', adjacentAreas: [{ areaId: 4179, slug: 'al-rashidiya-3' }] },
  'wn5r3': { areaId: 4175, slug: 'corniche', adjacentAreas: [{ areaId: 4179, slug: 'al-rashidiya-3' }] },
  'thk0w': { areaId: 4150, slug: 'downtown', adjacentAreas: [{ areaId: 4148, slug: 'business-bay' }] },
  'thk0s': { areaId: 4125, slug: 'dubai-marina', adjacentAreas: [{ areaId: 4127, slug: 'jumeirah-lakes-towers' }] },
  'thk0m': { areaId: 4127, slug: 'jumeirah-lakes-towers', adjacentAreas: [{ areaId: 4125, slug: 'dubai-marina' }] },
  'thk0y': { areaId: 4148, slug: 'business-bay', adjacentAreas: [{ areaId: 4150, slug: 'downtown' }] },
  'thk1r': { areaId: 4110, slug: 'deira' },
  'wn5rb': { areaId: 4165, slug: 'al-majaz' },
  'wn5rd': { areaId: 4168, slug: 'al-taawun' },
  'thk44': { areaId: 4001, slug: 'al-danah' },
  'thk4c': { areaId: 4020, slug: 'yas-island' }
};

export class TalabatAdapter implements IPlatformAdapter {
  public readonly platformId: PlatformId = 'talabat';
  public isMock: boolean = false; // Live web ingestion enabled

  private getAreaForLocation(geohash: string): TalabatAreaMapping {
    for (const [key, area] of Object.entries(TALABAT_AREAS)) {
      if (geohash.startsWith(key) || key.startsWith(geohash)) {
        return area;
      }
    }
    return TALABAT_AREAS['wn5r6']; // Default to Al Rashidia 3
  }

  async getRestaurants(geohash: string, _lat?: number, _lng?: number): Promise<Restaurant[]> {
    const mainArea = this.getAreaForLocation(geohash);
    const targetAreas = [{ areaId: mainArea.areaId, slug: mainArea.slug }, ...(mainArea.adjacentAreas || [])];

    const allVendors: Restaurant[] = [];
    const seenSlugs = new Set<string>();

    for (const area of targetAreas) {
      const url = `https://www.talabat.com/uae/restaurants/${area.areaId}/${area.slug}`;

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          },
          signal: AbortSignal.timeout(6000)
        });

        if (!response.ok) continue;

        const html = await response.text();
        const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
        if (!match) continue;

        const json = JSON.parse(match[1]);
        const vendors = json.props?.pageProps?.data?.vendors || [];

        for (const v of vendors) {
          const normName = v.name?.trim().toLowerCase();
          if (!normName || seenSlugs.has(normName)) continue;
          seenSlugs.add(normName);

          allVendors.push({
            id: `talabat-${v.id || v.restaurantId}`,
            name: v.name.trim(),
            slug: v.restaurantSlug || v.branchSlug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            cuisines: Array.isArray(v.cuisines) ? v.cuisines.map((c: any) => c.name || c) : ['Food'],
            rating: typeof v.rate === 'number' ? v.rate : 4.5,
            reviewCount: typeof v.totalRatings === 'number' ? v.totalRatings : 100,
            addressSummary: v.areaName ? `${v.areaName}, UAE` : 'Al Rashidia 3, Ajman, UAE',
            phone: undefined,
            logoUrl: v.logo || undefined,
            coverUrl: v.heroImage || undefined
          });
        }
      } catch (err: any) {
        // Continue to next sub-area
      }
    }

    if (allVendors.length > 0) {
      this.isMock = false;
      return allVendors;
    }

    console.warn(`[TalabatAdapter] Live scrape returned 0 vendors. Using cached records.`);
    this.isMock = true;
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
    const webUrl = `https://www.talabat.com/uae/restaurant/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
    return {
      platform: this.platformId,
      webUrl,
      appDeepLink: `talabat://restaurant/${restaurantSlug}`
    };
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

export const talabatAdapter = new TalabatAdapter();
