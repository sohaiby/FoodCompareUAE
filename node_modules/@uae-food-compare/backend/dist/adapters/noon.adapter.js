"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noonAdapter = exports.NoonAdapter = void 0;
const db_1 = require("../db");
class NoonAdapter {
    platformId = 'noon';
    isMock = false; // Live web API ingestion
    async getRestaurants(geohash, lat, lng) {
        const latitude = lat || 25.3995;
        const longitude = lng || 55.4455;
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-experience': 'food',
            'x-locale': 'en-ae',
            'x-platform': 'web'
        };
        let cookies = [];
        const updateCookies = (res) => {
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
                return db_1.db.getRestaurantsByGeohash(geohash);
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
            const outlets = rawResults.filter((r) => r.outletCode && r.name);
            if (outlets.length === 0) {
                throw new Error('No outlets returned from Noon catalog');
            }
            this.isMock = false;
            return outlets.map((o) => {
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
        }
        catch (err) {
            console.warn(`[NoonAdapter] Live API fetch failed (${err.message}). Using cached records.`);
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
        const webUrl = `https://food.noon.com/uae-en/outlet/${restaurantSlug}${menuItemId ? `?item=${menuItemId}` : ''}`;
        return {
            platform: this.platformId,
            webUrl,
            appDeepLink: `noon://food/outlet/${restaurantSlug}`
        };
    }
    async isHealthy() {
        return true;
    }
}
exports.NoonAdapter = NoonAdapter;
exports.noonAdapter = new NoonAdapter();
