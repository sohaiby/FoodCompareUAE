"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.talabatAdapter = exports.TalabatAdapter = void 0;
const db_1 = require("../db");
// Predefined Talabat Area IDs for key UAE seed zones
const TALABAT_AREAS = {
    'wn5r6': { areaId: 4179, slug: 'al-rashidiya-3' }, // Al Rashidia 3, Ajman
    'wn5r7': { areaId: 4178, slug: 'al-nuaimia' }, // Al Nuaimia, Ajman
    'wn5r3': { areaId: 4175, slug: 'corniche' }, // Ajman Corniche
    'thk0w': { areaId: 4150, slug: 'downtown' }, // Downtown Dubai
    'thk0s': { areaId: 4125, slug: 'dubai-marina' }, // Dubai Marina
    'thk0m': { areaId: 4127, slug: 'jumeirah-lakes-towers' }, // JLT
    'thk0y': { areaId: 4148, slug: 'business-bay' }, // Business Bay
    'thk1r': { areaId: 4110, slug: 'deira' }, // Deira
    'wn5rb': { areaId: 4165, slug: 'al-majaz' }, // Al Majaz, Sharjah
    'wn5rd': { areaId: 4168, slug: 'al-taawun' }, // Al Taawun, Sharjah
    'thk44': { areaId: 4001, slug: 'al-danah' }, // Abu Dhabi Corniche
    'thk4c': { areaId: 4020, slug: 'yas-island' } // Yas Island
};
class TalabatAdapter {
    platformId = 'talabat';
    isMock = false; // Live web ingestion enabled
    getAreaForLocation(geohash) {
        for (const [key, area] of Object.entries(TALABAT_AREAS)) {
            if (geohash.startsWith(key) || key.startsWith(geohash)) {
                return area;
            }
        }
        return TALABAT_AREAS['wn5r6']; // Default to Al Rashidia 3
    }
    async getRestaurants(geohash, lat, lng) {
        const area = this.getAreaForLocation(geohash);
        const url = `https://www.talabat.com/uae/restaurants/${area.areaId}/${area.slug}`;
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            });
            if (!response.ok) {
                throw new Error(`Talabat responded with HTTP ${response.status}`);
            }
            const html = await response.text();
            const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
            if (!match) {
                throw new Error('Talabat __NEXT_DATA__ not found');
            }
            const json = JSON.parse(match[1]);
            const vendors = json.props?.pageProps?.data?.vendors || [];
            if (!Array.isArray(vendors) || vendors.length === 0) {
                throw new Error('No vendors returned from Talabat web page');
            }
            this.isMock = false;
            // Map vendors to our standardized Restaurant schema
            return vendors.map((v) => ({
                id: `talabat-${v.id || v.restaurantId}`,
                name: v.name,
                slug: v.restaurantSlug || v.branchSlug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                cuisines: Array.isArray(v.cuisines) ? v.cuisines.map((c) => c.name || c) : ['Food'],
                rating: typeof v.rate === 'number' ? v.rate : 4.5,
                reviewCount: typeof v.totalRatings === 'number' ? v.totalRatings : 100,
                addressSummary: v.areaName ? `${v.areaName}, UAE` : 'UAE Delivery Area',
                phone: undefined,
                logoUrl: undefined,
                coverUrl: undefined
            }));
        }
        catch (err) {
            console.warn(`[TalabatAdapter] Live scrape failed (${err.message}). Using cached records.`);
            this.isMock = true;
            return db_1.db.getRestaurantsByGeohash(geohash);
        }
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
        const webUrl = `https://www.talabat.com/uae/restaurant/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
        return {
            platform: this.platformId,
            webUrl,
            appDeepLink: `talabat://restaurant/${restaurantSlug}`
        };
    }
    async isHealthy() {
        return true;
    }
}
exports.TalabatAdapter = TalabatAdapter;
exports.talabatAdapter = new TalabatAdapter();
