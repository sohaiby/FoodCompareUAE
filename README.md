# 🍕 UAE Food Delivery Price Comparison App

A cross-platform web application that compares real-time food delivery prices across the UAE's major aggregators, helping users find the lowest total checkout cost (item price + delivery fee + active discounts) without manually checking multiple apps.

---

## 🎯 Product Overview

### The Problem
UAE food delivery aggregators (Talabat, Noon Food, Careem, Deliveroo, Keeta, Smiles) have highly volatile, hyper-local pricing. The same meal can cost drastically different amounts depending on:
- Platform-specific menu markups
- Dynamic delivery fees (vary by location, traffic, demand)
- Active promotional codes and discounts
- Bank-specific card offers (ADCB, Emirates NBD, FAB, etc.)

### The Solution
Users enter their location and craving, and the app instantly shows them the lowest total price across all 6 platforms — complete with active discounts, delivery fees, and which card to use for maximum savings.

### Target Platforms
1. **Talabat** (~45% DXB market share)
2. **Noon Food**
3. **Careem**
4. **Deliveroo**
5. **Keeta**
6. **Smiles** (e&'s super-app)

### Geographic Scope
All seven emirates of the UAE (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Umm Al Quwain, Fujairah).

---

## 💰 Monetization Model (Future)

The MVP is **100% free to end users**. Revenue streams (not implemented in v1, but architecture supports them):
- **Sponsored restaurant placements** — independent restaurants pay for top-tier visibility
- **Fintech affiliate perks** — referral fees from banks/fintech partners for "best card for this order" recommendations
- **B2B data analytics** — anonymized pricing trends and search patterns sold to food brands and restaurant chains

---

## 🏗️ Technical Architecture

### Core Constraint
None of the 6 platforms expose a public API for menu/price/delivery-fee data. All data must be fetched and parsed from each platform's restaurant/menu pages.

### Data Flow: Cache-First, Hourly Refresh

```
┌─────────────────────────────────────────┐
│  Background Scheduler (Hourly)          │
│  - Picks a location grid cell           │
│  - Fires all 6 platform adapters        │
│  - Stores results in local DB           │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  Local Cache (DB)  │
        │  - Restaurants     │
        │  - Menu items      │
        │  - Prices          │
        │  - Delivery fees   │
        │  - Offers/promos   │
        └────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │   React Frontend   │
        │  (Anonymous, No    │
        │   Auth Needed)     │
        └────────────────────┘
```

**Why this approach?**
- Reduces anti-bot exposure (one background scraper vs. millions of user requests)
- Eliminates per-user latency for data fetches
- Keeps database costs predictable
- Allows graceful degradation (if one platform blocks us, others still work)

### Location Indexing: Geohash/H3 Grid

Locations are cached in **fixed-size hexagonal or rectangular grid cells** (~500m–1km per cell), not named neighborhoods:
- A user's GPS coordinate `(lat, lng)` deterministically maps to one grid cell
- One background job per cell, once per hour
- Systematically covers all of the UAE without manual boundary-drawing

**Cold-start strategy:**
- **Seed the top ~20–30 high-density zones** at launch (Downtown Dubai, Marina, JLT, Business Bay, Deira, Sharjah City Center, Ajman City, Abu Dhabi Corniche, etc.) so day-one users hit a warm cache
- **Lazy-load** any other cell the first time a real user's location falls into it
- Organically builds full UAE coverage as more users join

### On-Demand Live Refresh

Users can manually trigger a fresh data fetch for their specific address right before checkout, bypassing the hourly cache for that one order. This is the **only per-user live fetch path** and is scoped to a single location/platform set, not a broad crawl.

---

## 📋 MVP Scope

### In Scope (v1)
- ✅ Search by dish name or restaurant across all 6 platforms
- ✅ View which platforms serve a specific location
- ✅ Real-time price comparison table (item price + delivery fee + total)
- ✅ Inline offer badges (% off, cashback, promo codes) as displayed on the original platform
- ✅ "Lowest total" highlight and direct deep-link to the platform's ordering page
- ✅ Manual refresh action per address
- ✅ Mobile-responsive web app (React/Next.js)
- ✅ Anonymous browsing (no accounts, login, or profiles)

### Explicitly Out of Scope (future versions)
- ❌ User accounts, saved preferences, order history
- ❌ Native iOS/Android apps (Capacitor wrap comes later)
- ❌ Sponsored restaurant UI or admin dashboard
- ❌ Affiliate/fintech integration (data model prepared, UI not built)
- ❌ Real-time push notifications
- ❌ Multi-user personalization

---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React / Next.js | Mobile-responsive, Capacitor-compatible for future native wrap |
| **Backend** | *(Agent to decide)* | Scraping-heavy workload; agent proposes best fit |
| **Database** | *(Agent to decide)* | Time-series location/cache data; agent proposes best fit |
| **Job Scheduler** | *(Agent to decide)* | Hourly grid-cell refresh; agent proposes best fit |
| **Location Library** | Geohash or H3 | Deterministic grid indexing, no manual boundaries |
| **Proxy/Anti-bot** | *(To be configured)* | Residential proxy rotation for platform adapters; credentials not in repo |

---

## 📂 Project Structure

```
uae-food-price-compare/
├── README.md                      # This file
├── ARCHITECTURE.md                # Detailed data flow and adapter interface spec
├── BOOTSTRAP_PROMPT.md            # Prompt used to scaffold this project
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── PriceComparison.tsx
│   │   │   ├── OfferBadges.tsx
│   │   │   ├── LocationPicker.tsx
│   │   │   └── RefreshButton.tsx
│   │   ├── pages/
│   │   ├── hooks/
│   │   │   └── useGeolocation.ts
│   │   ├── services/
│   │   │   └── api.ts             # Calls backend for cached data
│   │   └── App.tsx
│   ├── package.json
│   └── next.config.js
│
├── backend/
│   ├── src/
│   │   ├── adapters/              # One per platform (Talabat, Noon, Careem, etc.)
│   │   │   ├── talabat.adapter.ts
│   │   │   ├── noon.adapter.ts
│   │   │   ├── careem.adapter.ts
│   │   │   ├── deliveroo.adapter.ts
│   │   │   ├── keeta.adapter.ts
│   │   │   ├── smiles.adapter.ts
│   │   │   └── adapter.interface.ts # Common contract
│   │   ├── db/
│   │   │   ├── models/            # Restaurants, MenuItems, Prices, Offers, GridCells
│   │   │   ├── migrations/
│   │   │   └── schema.ts
│   │   ├── scheduler/
│   │   │   ├── grid-crawler.ts    # Orchestrates hourly refresh
│   │   │   └── job-runner.ts
│   │   ├── services/
│   │   │   ├── search.service.ts
│   │   │   ├── price.service.ts
│   │   │   └── geohash.service.ts
│   │   ├── routes/
│   │   │   ├── search.routes.ts
│   │   │   └── prices.routes.ts
│   │   └── index.ts              # Entry point
│   ├── package.json
│   └── .env.example
│
├── shared/
│   ├── types/
│   │   └── index.ts              # Shared TypeScript interfaces
│   └── constants/
│       └── platforms.ts          # Platform enum, config
│
├── docker-compose.yml            # Local dev: DB, backend, maybe proxy setup
├── .env.example                  # Copy to .env; add proxy credentials, etc.
└── .gitignore                    # Exclude .env, node_modules, etc.
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional, for local DB/redis)
- A valid .env file (copy from `.env.example`)

### Local Development Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd uae-food-price-compare
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd ../backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values:
   # - DB connection string
   # - Proxy provider credentials (if using rotating residential proxies)
   # - Platform-specific headers/cookies (if needed for adapters)
   ```

4. **Start services** (if using Docker)
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run migrate
   ```

6. **Start the backend**
   ```bash
   npm run dev
   # Runs on http://localhost:3001 (or configured port)
   ```

7. **Start the frontend** (new terminal)
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:3000
   ```

8. **Trigger a test data fetch** (optional, to seed cache)
   ```bash
   curl -X POST http://localhost:3001/api/admin/refresh-cell?geohash=...
   ```

---

## 🧩 Platform Adapters: The Interface Contract

Each platform adapter exports a module that implements this interface:

```typescript
interface IPlatformAdapter {
  platformName: 'talabat' | 'noon' | 'careem' | 'deliveroo' | 'keeta' | 'smiles';
  
  // Returns all restaurants delivering to this grid cell
  getRestaurants(geohash: string, lat: number, lng: number): Promise<Restaurant[]>;
  
  // Returns menu + prices for a specific restaurant
  getMenu(restaurantId: string, lat: number, lng: number): Promise<MenuItem[]>;
  
  // Returns delivery fee for a restaurant/address
  getDeliveryFee(restaurantId: string, lat: number, lng: number): Promise<DeliveryFee>;
  
  // Error handling: return null or throw, adapter consumer decides
  isHealthy(): Promise<boolean>;
}
```

**Current Status:**
- 🟡 **Talabat, Noon, Careem, Deliveroo:** Mocked with sample data (ready for live implementation)
- 🟡 **Keeta, Smiles:** Mocked with sample data (ready for live implementation)

Each adapter is independently mockable, testable, and can be disabled without affecting others.

---

## ⚖️ Legal & Ethical Notes

### Data Sourcing Approach
This project fetches data from the platforms' own web/app interfaces without explicit API access. This was reviewed by legal counsel under UAE law; the development approach is designed to:
1. Minimize platform load (hourly batch refresh, not per-user live scraping)
2. Fail gracefully if platforms block the data source
3. Support a direct partnership path (if a platform offers API access, swap out the adapter)

**Important:** Do not modify adapters to work around rate-limiting or bot detection in ways not explicitly approved by your legal counsel. If an adapter is being blocked, mark it as unavailable and escalate rather than escalating the technical evasion.

### Data Privacy
- Zero PII is collected (no user accounts, no tracking)
- Pricing and offer data is aggregated, never associated with individuals
- B2B data products (future) will be fully anonymized at the aggregation level

---

## 📊 Monitoring & Debugging

### Logs
All adapters and background jobs log failures explicitly:
- Which platform failed to fetch
- Why it failed (rate-limit, parse error, platform down, etc.)
- When it will be retried

Check logs for:
- Adapter health (are any platforms consistently failing?)
- Grid-cell refresh times (is the hourly cycle keeping up?)
- Cache hit rates (what % of user requests hit warm data?)

### Database Queries
Monitor these key metrics:
- `restaurants` table row count (should be stable, growing slowly with new grid cells)
- `menu_items` and `prices` growth (indicator of scraper activity)
- `last_refreshed` timestamps per grid cell (all should be within the last 1–2 hours)

---

## 🔄 Future Roadmap

### Phase 2: Native Apps
Wrap the React web app with **Capacitor** into iOS and Android apps:
- Geolocation permission handling (native)
- Push notifications for flash sales (optional)
- Deep-linking from comparison → native platform app

### Phase 3: Monetization
- Sponsored restaurant placement UI
- Bank card affiliate integration
- B2B analytics dashboard

### Phase 4: Partnerships
- Outreach to platforms for official API partnerships
- Swap out scrapers for official adapters as they're negotiated

---

## 📝 Contributing

### Adding a New Platform Adapter
1. Create `backend/src/adapters/<platform>.adapter.ts`
2. Implement `IPlatformAdapter` interface
3. Add mock data in `backend/src/adapters/mocks/<platform>.mock.ts`
4. Add platform to `shared/constants/platforms.ts`
5. Add unit tests in `backend/src/adapters/__tests__/<platform>.test.ts`
6. Document any platform-specific quirks in `ARCHITECTURE.md`

### Reporting Issues
- **Data is stale/wrong:** Check `last_refreshed` timestamp in DB; trigger a manual refresh
- **Platform adapter failing:** Check logs; disable adapter temporarily if blocking; escalate
- **Performance issues:** Check DB query times; consider adding indexes on `geohash` and `platform` columns

---

## 📄 License

[Specify your license here, e.g., MIT, proprietary, etc.]

---

## 👤 Author & Contact

**Built by:** Sohaib  
**Location:** Ajman / Dubai, UAE  
**Questions?** See `ARCHITECTURE.md` for deep dives on specific components.

---

## 🙏 Acknowledgments

- Legal review provided by [lawyer name/firm] on UAE cybercrime law and data sourcing approach
- Geohashing powered by [library name, e.g., `geohash2`]
- Special thanks to the early users providing feedback on pricing accuracy
