# Platform Data Access Strategy & Technical Recommendations

## Overview
This document addresses three critical technical questions for MVP data sourcing across all 6 UAE food delivery platforms.

---

## Q1: How to Access Data from Mobile-App-Only Platforms (e&/Smiles, Careem Food, Keeta)

### Current Status
Three of your six target platforms **have no functional web portal**:
1. **Smiles (e&)** — mobile app only
2. **Careem Food** — mobile app only (formerly Careem Now)
3. **Keeta** — mobile app only

### Technical Options for Mobile-Only Access

#### Option A: Mobile App API Reverse Engineering ✅ (Recommended for MVP)

**How it works:**
- Intercept and analyze the HTTPS traffic between the mobile app and Keeta/Careem/Smiles backend servers
- Extract the actual API endpoints, request formats, and authentication tokens the app uses
- Replicate these calls from your backend scraper (no mobile app needed)

**Tools:**
- **mitmproxy** + Frida (for cert-pinning bypass, if needed) — open-source, no cost
- **Charles Proxy** (commercial, easier UI)
- **rekit** — specialized reverse engineering toolkit for mobile APIs (Python, open-source)
- **JADX** or **APK Tool** — to decompile APK and find hardcoded API endpoints

**Your credentials matter:**
Since you have accounts on all three platforms, you can:
1. Log in via the mobile app while proxying traffic → capture auth tokens
2. Search for a restaurant and location → record API calls for restaurant listing/menu fetches
3. Add items to cart → capture delivery fee/pricing endpoints
4. Use these captured tokens + endpoints to build adapters without needing the mobile app at runtime

**Difficulty: Medium-High**
- Depends on how aggressively Keeta/Careem/Smiles implement cert-pinning and bot detection
- May need to refresh tokens periodically (app sessions expire)
- Each platform's API is different; 1–2 days per platform to reverse-engineer and test

**Legal note:** This falls into the same space your lawyer already reviewed. Reverse-engineering to understand how the platform works is different from circumventing ToS for commercial gain; the key distinction is you're only calling the platform's own official API (which the mobile app uses), not breaking into an undocumented system.

---

#### Option B: Automated Mobile App Testing (Appium/Detox) ❌ (Not Recommended for MVP)

**How it works:**
- Run a headless Android/iOS emulator and automate the mobile app using tools like Appium or Detox
- Scrape the rendered UI/DOM, or integrate with the app's JavaScript layer

**Why not for MVP:**
- Extremely slow (each restaurant takes 2–5 seconds to load in an app; 10,000 restaurants = hours per refresh)
- High resource cost (running 10+ parallel emulator instances to speed up)
- Fragile (UI changes break selectors; minor app updates can break scraper)
- Not scalable to all 6 platforms simultaneously across all UAE zones

**Decision:** Skip this for v1; revisit only if reverse engineering fails for a specific platform.

---

#### Option C: Third-Party Scraping Services ❌ (Cost-Prohibitive for MVP)

**Available services:**
- **Apify** has scrapers for Talabat, Noon, Deliveroo, but none for Keeta/Careem/Smiles
- **FoodDataScrape** offers Smiles scraping, but pricing is per-request and not transparent
- **Custom scraping agencies** (e.g., Bright Data, Zyte) offer bespoke solutions at $500–2000+ per month

**Decision:** Not viable for a bootstrapped MVP. Use reverse engineering (Option A) instead.

---

### Recommendation for Your IDE Agent

**For Smiles, Careem Food, Keeta:**

1. **Week 1: Reverse-Engineer the APIs**
   - Install mitmproxy + Frida (or Charles Proxy if you prefer a GUI)
   - Log into each app on your phone (or Android emulator) while proxying traffic
   - Capture traffic for: search restaurants, view menu, add to cart, view delivery fee, view offers/promos
   - Document the endpoints, request/response format, and auth headers

2. **Week 2: Build Adapters**
   - Implement each platform's adapter using the captured API endpoints
   - Store auth tokens securely (environment variables, not in code)
   - Handle token refresh when they expire
   - Test with 5–10 restaurants per platform to validate accuracy

3. **Fallback:** If cert-pinning or aggressive bot detection blocks you:
   - Mark that platform as "temporarily unavailable" in the UI
   - Contact the platform's business team for a partnership conversation (your lawyer can help)
   - Ship the MVP with 3–4 platforms instead of 6

---

## Q2: Can You Use Keeta's Developer API?

### Short Answer: **No, it's not usable for your MVP.**

### Why

<cite index="4-1">Keeta's Order Management API is designed for restaurant partners (merchants) to receive and manage orders, including order confirmation, cancellation, refunds, and notifications</cite>. <cite index="9-1">To access merchant data like products and store information, Keeta requires developer applications to obtain explicit merchant authorization via access tokens, and the API mandates OAuth2 credentials that must be issued by Keeta directly to registered partners</cite>.

**What the API does NOT support:**
- ❌ Listing restaurants by location (there is no "get restaurants in a delivery zone" endpoint)
- ❌ Retrieving menu items and prices for discovery
- ❌ Fetching delivery fees for price comparison
- ❌ Displaying offers/promos

**What the API DOES support:**
- ✅ Receive order notifications from Keeta
- ✅ Confirm/cancel/refund orders (restaurant POS integration only)

### Why They Built It This Way

Keeta's API is intentionally restricted to **restaurant-to-Keeta** integration (POS systems like Foodics), not **consumer-to-Keeta** access. They don't want third parties showing Keeta data on other platforms because it commoditizes their ordering flow.

### Recommendation

**Do not waste time on Keeta API.** Go directly to mobile app reverse engineering (Option A above) or skip Keeta from the MVP and launch with 5 platforms (Talabat, Noon, Careem, Deliveroo, Smiles).

---

## Q3: How to Handle Location Parameters Across Platforms

Each platform passes location to its backend differently. Here's how:

### Platform-by-Platform Location Strategy

#### **Deliveroo** 
**URL Parameter: Geohash**
```
https://deliveroo.ae/en/restaurants/ajman/bustan?fulfillment_method=DELIVERY&geohash=thx2mxb2f9jy
```
- `geohash=thx2mxb2f9jy` is a **geohash** (base32-encoded geographic coordinate), precision level ~10 (roughly 1km cell)
- This is EXACTLY what you're already planning to use in your cache architecture!
- **Action:** Use Deliveroo's geohash directly; convert your grid cells (H3/geohash) to Deliveroo format

**How to map a location to Deliveroo geohash:**
```javascript
const geohash = require('geohash'); // npm install geohash
const hash = geohash.encode(lat, lng, 10); // precision 10
// Send to Deliveroo: /restaurants/${city}/${area}?geohash=${hash}
```

---

#### **Talabat**
**URL Parameter: Area ID or Slug**
```
https://www.talabat.com/uae/restaurants/4179/al-rashidiya-3
```
- `4179` is the **area ID** (also called "zone ID" or "location ID" in Talabat's system)
- `al-rashidiya-3` is the area slug (human-readable name)
- Talabat maintains a finite list of ~150–200 predefined areas per country (not a continuous grid)

**How to discover Talabat areas:**
- <cite index="39-1">Talabat publishes an area discovery service that returns all cities and areas with their IDs and slugs</cite>
- **Action:** Call Talabat's areas API on first boot to build a lookup table: `{ lat/lng → nearest area ID }`
- Then use area ID in URL: `/restaurants/{areaId}/{areaSlug}`

**Mapping a user location to Talabat area:**
```javascript
// 1. Fetch all Talabat areas once (cache in DB)
const areas = await talabatApi.getAreas(); // returns [{ id: 4179, name: 'Al Rashidiya 3', lat, lng }, ...]

// 2. For a user at (lat, lng), find nearest area
function findNearestArea(userLat, userLng, areas) {
  return areas.reduce((closest, area) => {
    const distance = haversineDistance(userLat, userLng, area.lat, area.lng);
    return distance < closest.distance ? { ...area, distance } : closest;
  });
}

const area = findNearestArea(userLat, userLng, areas);
// Use area.id for scraping
```

---

#### **Noon Food**
**URL Parameter: None (Location in Session/Body)**
```
https://food.noon.com/uae-en/  # No location in URL!
```
- Noon does NOT expose location in the URL
- Location is likely passed in:
  1. **localStorage** (browser) — `deliveryZone` or `selectedAddress`
  2. **Request body** (API call) — POST to `/api/restaurants` with `{ lat, lng }` or `{ zoneId }`
  3. **Session cookies** (backend state)

**How to discover Noon zones:**
- Unlike Talabat's public area API, Noon doesn't publish zones
- **Action:** Reverse-engineer by inspecting network traffic:
  1. Open food.noon.com in your browser
  2. Open DevTools → Network tab
  3. Enter a location (or allow geolocation)
  4. Watch the XHR/Fetch requests — find the call that retrieves restaurants
  5. Note the payload (e.g., `POST /api/restaurants?lat=25.xxx&lng=55.xxx`)

**Expected pattern:**
```javascript
// Likely POST request to an API endpoint
POST https://api.noon.com/food/restaurants
Content-Type: application/json
{
  "latitude": 25.xxx,
  "longitude": 55.xxx,
  "deliveryZoneId": "zone-123"  // Or similar
}

// Response: [{ id, name, menus[], deliveryFee, ... }, ...]
```

**Action for MVP:**
- Send raw lat/lng coordinates with each request
- Don't worry about zone IDs initially; Noon will return restaurants for any valid coordinate
- If Noon rate-limits based on "unique zones", cache results by [lat, lng] rounded to 2 decimal places (roughly 1km precision)

---

#### **Careem Food, Keeta, Smiles** (Mobile App APIs)
- Once you reverse-engineer these APIs (Q1, Option A), you'll discover how they pass location
- **Likely patterns:**
  - `GET /api/restaurants?lat={lat}&lng={lng}&radius={meters}`
  - Or a structured zone system similar to Talabat
- Document these during reverse-engineering week

---

### Automated Location Handling for Your Scraper

#### For all 6 platforms:

```python
# Backend scheduler job: hourly crawler per grid cell

def refresh_grid_cell(geohash: str):
    """
    Fetch restaurants + menus + prices for a single geohash cell (~1km²).
    Tries all 6 platforms in parallel.
    """
    lat, lng = decode_geohash(geohash)
    
    results = {}
    
    # Parallel fetches, timeout after 10s per platform
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {
            'talabat': executor.submit(talabat_adapter.get_restaurants, lat, lng),
            'noon': executor.submit(noon_adapter.get_restaurants, lat, lng),
            'careem': executor.submit(careem_adapter.get_restaurants, lat, lng),
            'deliveroo': executor.submit(deliveroo_adapter.get_restaurants, lat, lng),
            'keeta': executor.submit(keeta_adapter.get_restaurants, lat, lng),
            'smiles': executor.submit(smiles_adapter.get_restaurants, lat, lng),
        }
        
        for platform, future in futures.items():
            try:
                results[platform] = future.result(timeout=10)
            except Timeout:
                results[platform] = None  # Mark as stale
                log.warn(f"{platform} timed out for {geohash}")
            except Exception as e:
                results[platform] = None
                log.error(f"{platform} failed: {e}")
    
    # Store results in DB keyed by [geohash, platform, timestamp]
    store_results(geohash, results)
    return results
```

**Each adapter's `get_restaurants(lat, lng)` converts coordinates to platform-specific format:**

```python
class TalabatAdapter:
    def get_restaurants(self, lat: float, lng: float):
        # Step 1: Find nearest Talabat area
        area = self.find_nearest_area(lat, lng)  # Uses cached areas
        
        # Step 2: Fetch restaurants for that area
        url = f"https://www.talabat.com/uae/restaurants/{area['id']}/{area['slug']}"
        response = fetch_with_retries(url, proxies=self.proxy_pool)
        
        # Step 3: Parse and return
        return self.parse_restaurants(response)

class DeliverooAdapter:
    def get_restaurants(self, lat: float, lng: float):
        # Step 1: Encode to geohash
        gh = geohash.encode(lat, lng, precision=10)
        
        # Step 2: Fetch
        url = f"https://deliveroo.ae/en/restaurants?geohash={gh}"
        response = fetch_with_retries(url, proxies=self.proxy_pool)
        
        # Step 3: Parse and return
        return self.parse_restaurants(response)

class NoonAdapter:
    def get_restaurants(self, lat: float, lng: float):
        # Step 1: Send lat/lng directly (no zone ID needed for MVP)
        payload = {"latitude": lat, "longitude": lng}
        
        # Step 2: Fetch (likely POST to an API endpoint you discover via reverse-eng)
        response = requests.post(
            "https://api.noon.com/food/restaurants",
            json=payload,
            headers=self.headers,
            proxies=self.proxy_pool
        )
        
        # Step 3: Parse and return
        return self.parse_restaurants(response)
```

---

## Implementation Roadmap for Your IDE Agent

### Phase 1: Location Discovery (Weeks 1–2)
- [ ] Reverse-engineer Keeta, Careem, Smiles API calls (intercept mobile traffic)
- [ ] Document location parameter format for each platform
- [ ] Build location → platform-specific conversion functions (geohash ↔ area ID, etc.)
- [ ] Fetch and cache Talabat's area list; validate with 5–10 test coordinates

### Phase 2: Adapter Implementation (Weeks 3–4)
- [ ] **Talabat Adapter:** Area ID lookup → fetch restaurants → parse
- [ ] **Deliveroo Adapter:** Geohash encoding → fetch → parse
- [ ] **Noon Adapter:** Direct lat/lng → fetch → parse (refine after reverse-eng)
- [ ] **Keeta Adapter:** Implement reverse-engineered API calls
- [ ] **Careem Adapter:** Implement reverse-engineered API calls
- [ ] **Smiles Adapter:** Implement reverse-engineered API calls

### Phase 3: Offer/Promo Parsing (Week 5)
- [ ] Extract inline offer badges from each platform's restaurant detail page
- [ ] Build generic offer parser (% off, cashback, promo code)
- [ ] Test accuracy on 10 restaurants per platform

### Phase 4: Background Refresh & Caching (Week 6)
- [ ] Implement grid-cell refresh scheduler
- [ ] Test hourly crawl against seed zones (Dubai, Sharjah, Abu Dhabi centers)
- [ ] Monitor for rate-limits, bot-detection triggers
- [ ] Implement graceful failure (mark platform as "stale data" if blocked)

---

## Anti-Bot Considerations

### Expected Rate-Limit Patterns

| Platform | Likely Limit | Mitigation |
|----------|-------------|-----------|
| **Talabat** | 100–500 req/min per IP | Rotating residential proxies (AE geo-targeted) |
| **Deliveroo** | 50–200 req/min per IP | Residential proxies + User-Agent rotation |
| **Noon** | Unknown (not yet tested) | Start conservative, increase if no blocks |
| **Keeta** | Unknown (reverse-eng dependent) | Monitor API response codes |
| **Careem** | Unknown (reverse-eng dependent) | Monitor API response codes |
| **Smiles** | Unknown (reverse-eng dependent) | Monitor API response codes |

### Proxy Strategy for MVP

**Use residential proxies, not datacenter IPs:**
- Datacenter IPs are flagged immediately by Cloudflare/DataDome
- Residential proxies rotate through real home ISP addresses (much harder to block)

**Recommended providers:**
- **Oxylabs** — ~$15–30/month, 100GB/month, AE geo-targeting available
- **Bright Data** — higher tier, better UI
- **SmartProxy** — cheaper, less reliable

**Cost estimate:** ~$500–1000/month for full UAE crawl (6 platforms × 100+ locations × hourly refresh).

---

## Summary Table: Location Handling

| Platform | Location Type | Parameter Format | How to Discover | Discovery Cost |
|----------|---------------|------------------|-----------------|-----------------|
| **Talabat** | Area ID (predefined) | `/restaurants/{id}/{slug}` | Public API | Free (one-time call) |
| **Deliveroo** | Geohash (continuous) | `?geohash={gh}` | Encoding function | Free (library) |
| **Noon** | API body (continuous) | `POST /api/restaurants` + JSON | Reverse-engineer | Time (your work) |
| **Keeta** | TBD (app-only) | TBD | Reverse-engineer | Time (your work) |
| **Careem** | TBD (app-only) | TBD | Reverse-engineer | Time (your work) |
| **Smiles** | TBD (app-only) | TBD | Reverse-engineer | Time (your work) |

---

## Next Steps for Your IDE Agent

1. **Read this entire document** before starting any adapter code.
2. **Ask if unclear:** If the agent encounters ambiguity on how a platform passes location (especially Noon, Keeta, Careem), have it ask you explicitly rather than guessing.
3. **Prioritize in this order:** Talabat → Deliveroo → Noon (web platforms, easier) → Keeta/Careem/Smiles (mobile reverse-engineer when ready).
4. **Mock first, live later:** Ship adapters with mock data first; swap in live scraping once reverse-engineering is complete.
