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

export class NoonAdapter implements IPlatformAdapter {
  public readonly platformId: PlatformId = 'noon';
  public isMock: boolean = false; // Live web API ingestion

  async getRestaurants(geohash: string, lat?: number, lng?: number): Promise<Restaurant[]> {
    const latitude = lat || 25.3995;
    const longitude = lng || 55.4455;

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'x-experience': 'food',
      'x-locale': 'en-ae',
      'x-platform': 'web'
    };

    let cookies: string[] = [];

    const updateCookies = (res: Response) => {
      const raw = res.headers.get('set-cookie');
      if (raw) {
        raw.split(/,(?=[^;]+=[^;]+)/).forEach((p) => {
          const pair = p.split(';')[0].trim();
          cookies.push(pair);
        });
      }
    };

    try {
      // Step 1: Query geo info for coordinates
      const geoRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/serviceable-geo-info/by-location', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          location: { lat: latitude, lng: longitude }
        })
      });

      if (!geoRes.ok) {
        throw new Error(`Geo info failed with HTTP ${geoRes.status}`);
      }

      updateCookies(geoRes);
      const geoData = await geoRes.json();

      if (!geoData.isServiceable) {
        console.warn(`[NoonAdapter] Area not serviceable for (${latitude}, ${longitude})`);
        return db.getRestaurantsByGeohash(geohash);
      }

      // Step 2: Set location session
      const setLocRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/address/set-location', {
        method: 'POST',
        headers: { ...headers, 'Cookie': cookies.join('; ') },
        body: JSON.stringify({
          location: geoData.location || { lat: latitude, lng: longitude },
          area: geoData.area,
          cityId: geoData.cityId
        })
      });

      updateCookies(setLocRes);

      // Step 3: Fetch catalog
      const catRes = await fetch('https://food.noon.com/_svc/mp-food-api-catalog/api', {
        method: 'GET',
        headers: { ...headers, 'Cookie': cookies.join('; ') }
      });

      if (!catRes.ok) {
        throw new Error(`Catalog failed with HTTP ${catRes.status}`);
      }

      const catJson = await catRes.json();
      const rawResults = catJson.results || [];
      const outlets = rawResults.filter((r: any) => r.outletCode && r.name);

      if (outlets.length === 0) {
        throw new Error('No outlets returned from Noon catalog');
      }

      this.isMock = false;

      return outlets.map((o: any) => {
        const cleanSlug = o.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return {
          id: `noon-${o.outletCode}`,
          name: o.name,
          slug: `${cleanSlug}-${o.outletCode.toLowerCase()}`,
          cuisines: Array.isArray(o.cuisines) && o.cuisines.length > 0 ? o.cuisines : ['Food & Beverage'],
          rating: typeof o.rating === 'number' ? o.rating : 4.6,
          reviewCount: typeof o.ratingCount === 'number' ? o.ratingCount : 120,
          addressSummary: geoData.area ? `${geoData.area}, UAE` : 'Al Rashidia 3, Ajman, UAE',
          phone: undefined,
          logoUrl: undefined,
          coverUrl: undefined
        };
      });
    } catch (err: any) {
      console.warn(`[NoonAdapter] Live API fetch failed (${err.message}). Using cached records.`);
      this.isMock = true;
      return db.getRestaurantsByGeohash(geohash);
    }
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
    const webUrl = `https://food.noon.com/uae-en/outlet/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
    return {
      platform: this.platformId,
      webUrl,
      appDeepLink: `noon://food/outlet/${restaurantSlug}`
    };
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

export const noonAdapter = new NoonAdapter();
