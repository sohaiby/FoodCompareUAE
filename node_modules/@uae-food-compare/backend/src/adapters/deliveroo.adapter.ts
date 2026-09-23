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

interface DeliverooAreaMapping {
  city: string;
  neighborhood: string;
}

// Predefined Deliveroo city & neighborhood mapping for UAE seed zones
const DELIVEROO_AREAS: Record<string, DeliverooAreaMapping> = {
  'wn5r6': { city: 'ajman', neighborhood: 'rashidiya' },       // Al Rashidia 3 / Al Rashidia, Ajman
  'wn5r7': { city: 'ajman', neighborhood: 'nuaimia' },         // Al Nuaimia, Ajman
  'wn5r3': { city: 'ajman', neighborhood: 'corniche' },        // Ajman Corniche
  'thk0w': { city: 'dubai', neighborhood: 'downtown' },        // Downtown Dubai
  'thk0s': { city: 'dubai', neighborhood: 'dubai-marina' },    // Dubai Marina
  'thk0m': { city: 'dubai', neighborhood: 'jumeirah-lakes-towers' }, // JLT
  'thk0y': { city: 'dubai', neighborhood: 'business-bay' },    // Business Bay
  'thk1r': { city: 'dubai', neighborhood: 'deira' },           // Deira
  'wn5rb': { city: 'sharjah', neighborhood: 'al-majaz' },      // Al Majaz, Sharjah
  'wn5rd': { city: 'sharjah', neighborhood: 'al-taawun' },     // Al Taawun, Sharjah
  'thk44': { city: 'abu-dhabi', neighborhood: 'corniche' },    // Abu Dhabi Corniche
  'thk4c': { city: 'abu-dhabi', neighborhood: 'yas-island' }   // Yas Island
};

export class DeliverooAdapter implements IPlatformAdapter {
  public readonly platformId: PlatformId = 'deliveroo';
  public isMock: boolean = false; // Live web ingestion enabled

  private getAreaForLocation(geohash: string): DeliverooAreaMapping {
    for (const [key, area] of Object.entries(DELIVEROO_AREAS)) {
      if (geohash.startsWith(key) || key.startsWith(geohash)) {
        return area;
      }
    }
    return DELIVEROO_AREAS['wn5r6']; // Default to Al Rashidiya, Ajman
  }

  async getRestaurants(geohash: string, _lat?: number, _lng?: number): Promise<Restaurant[]> {
    const area = this.getAreaForLocation(geohash);
    const url = `https://deliveroo.ae/restaurants/${area.city}/${area.neighborhood}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-GB,en;q=0.9'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok) {
        throw new Error(`Deliveroo responded with HTTP ${response.status}`);
      }

      const html = await response.text();

      // Extract partner-card accessibility data and action links
      const cardRegex = /"partner-card(?:-[^"]*)?\.accessibility\.screen-reader":"([^"]+)",\s*"partner-card(?:-[^"]*)?\.action":"([^"]+)"/g;
      let match;
      const parsed: Restaurant[] = [];
      const seenNames = new Set<string>();

      while ((match = cardRegex.exec(html)) !== null) {
        const rawText = match[1];
        const actionUrl = decodeURIComponent(match[2].replace(/\\u0026/g, '&'));

        // Extract restaurant href
        const hrefMatch = actionUrl.match(/restaurant_href=([^&]+)/);
        const href = hrefMatch ? decodeURIComponent(hrefMatch[1]) : '';

        // Extract partner ID
        const idMatch = actionUrl.match(/partner_drn_id=([^&]+)/);
        const partnerId = idMatch ? idMatch[1] : '';

        // Parse screen-reader text e.g.: "Laffah Restaurant. Delivers at 15. Spend AED 50, get free delivery."
        const parts = rawText.split('. ');
        const name = parts[0]?.trim();

        if (!name || seenNames.has(name.toLowerCase())) {
          continue;
        }
        seenNames.add(name.toLowerCase());

        let rating = 4.5;
        let reviews = 50;

        for (const part of parts.slice(1)) {
          const rateMatch = part.match(/Rated\s+([0-9.]+)(?:\s+from\s+([0-9]+)\s+reviews)?/i);
          if (rateMatch) {
            rating = parseFloat(rateMatch[1]);
            if (rateMatch[2]) reviews = parseInt(rateMatch[2], 10);
          }
        }

        const slug = href
          ? href.replace(/^\/menu\/[^\/]+\/[^\/]+\//, '').replace(/^\/menu\/[^\/]+\//, '').replace(/^\/menu\//, '').replace(/\?.*/, '')
          : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Infer cuisine categories based on name keywords
        const cuisines = this.inferCuisines(name);

        parsed.push({
          id: partnerId ? `deliveroo-${partnerId}` : `deliveroo-${slug}`,
          name,
          slug,
          cuisines,
          rating,
          reviewCount: reviews,
          addressSummary: `${area.neighborhood.charAt(0).toUpperCase() + area.neighborhood.slice(1)}, ${area.city.charAt(0).toUpperCase() + area.city.slice(1)}, UAE`,
          phone: undefined,
          logoUrl: undefined,
          coverUrl: undefined
        });
      }

      if (parsed.length === 0) {
        throw new Error('No partner cards parsed from Deliveroo HTML');
      }

      this.isMock = false;
      return parsed;
    } catch (err: any) {
      console.warn(`[DeliverooAdapter] Live scrape failed (${err.message}). Using cached records.`);
      this.isMock = true;
      return db.getRestaurantsByGeohash(geohash);
    }
  }

  private inferCuisines(name: string): string[] {
    const lower = name.toLowerCase();
    if (lower.includes('pizza')) return ['Pizza', 'Italian', 'Fast Food'];
    if (lower.includes('burger') || lower.includes('hardee') || lower.includes('mcdonald')) return ['Burgers', 'American', 'Fast Food'];
    if (lower.includes('shawarma') || lower.includes('laffah') || lower.includes('falafel') || lower.includes('moqren')) return ['Arabic', 'Shawarma', 'Middle Eastern'];
    if (lower.includes('mandi') || lower.includes('maraheb') || lower.includes('yemen')) return ['Mandi', 'Yemeni', 'Khaleeji'];
    if (lower.includes('chicken') || lower.includes('kfc') || lower.includes('chicking')) return ['Fried Chicken', 'Fast Food'];
    if (lower.includes('chinese') || lower.includes('chin') || lower.includes('panda')) return ['Chinese', 'Asian', 'Noodles'];
    if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('cafe')) return ['Coffee', 'Beverages', 'Bakery'];
    if (lower.includes('ice cream') || lower.includes('baskin') || lower.includes('stone')) return ['Desserts', 'Ice Cream'];
    if (lower.includes('salad') || lower.includes('healthy') || lower.includes('500 calorie')) return ['Healthy', 'Salads', 'Bowls'];
    if (lower.includes('indian') || lower.includes('biryani') || lower.includes('gazebo')) return ['Indian', 'Biryani', 'Curry'];
    return ['Food & Beverage', 'Fast Food'];
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
    const webUrl = `https://deliveroo.ae/menu/ajman/rashidiya/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
    return {
      platform: this.platformId,
      webUrl,
      appDeepLink: `deliveroo://menu/ajman/rashidiya/${restaurantSlug}`
    };
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

export const deliverooAdapter = new DeliverooAdapter();
