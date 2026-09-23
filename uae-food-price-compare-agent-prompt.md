# 🤖 Project Bootstrap Prompt — UAE Food Delivery Price Comparison App

**Role:** You are a senior full-stack architect and product engineer. Your job is to scaffold a new project from scratch based on the context, decisions, and constraints below. Where a decision has been explicitly left to you, proposes the options, suggest what could be better, and ask for clarification before proceeding.

---

## 1. Product Context

**What we're building:** A cross-platform web app that compares food delivery prices across all major UAE aggregators, so a user can find the lowest real total cost (item price + delivery fee + any active discount) for what they want to order, without manually checking multiple apps.

**Target platforms (6):** Talabat, Noon Food, Careem, Deliveroo, Keeta, Smiles (e&'s app).

**Geographic scope:** All of the UAE (all seven emirates), not a single city.

**User accounts:** None in this version. Anonymous browsing only — no login, no saved profiles, no personalization tied to an identity. Location is the only per-session state needed.

**Monetization (not built in this MVP, but the data model should not actively block it later):**
- Sponsored restaurant placement (a restaurant could pay for visibility)
- Bank/fintech card-offer affiliate fees
- Anonymized B2B pricing/trend data sales
- No subscriptions — the app is free to end users.

Keep restaurant and offer records extensible enough that a "sponsored" flag or an "affiliate source" field could be added later without a schema rewrite. Do not build any monetization UI or logic now.

---

## 2. The Hard Technical Problem (read this carefully)

None of the 6 platforms offer a public API for this kind of use. All pricing, delivery-fee, and promo data must be obtained by fetching and parsing each platform's own restaurant/menu pages for a given location. This creates several real constraints:

1. **Anti-bot protection.** Major platforms run commercial bot-detection (e.g. Cloudflare, DataDome) on their ordering flow. Any adapter you build for a platform must assume it can be rate-limited, fingerprinted, or blocked, and should fail gracefully (mark that platform's data as "stale/unavailable" for that location) rather than crash the whole request.
2. **Some data may only exist in the mobile app**, not the mobile web view, for some platforms. Flag this explicitly per platform rather than silently returning incomplete data.
3. **Location-dependent pricing.** Delivery fee, ETA, and restaurant availability are specific to a delivery address/coordinate, not global — the same restaurant can show different prices in different areas.
4. **Promos and card offers are NOT a separate, simpler data source.** They render inline inside each restaurant's own menu page (e.g. "30% off — Auto applied", "20% cashback with ENBD noon One card", bank-specific codes like "AB20"). This means the same fetch/parse pass that gets you prices must also extract these inline offer badges — there is no lower-risk shortcut here. Some *platform-wide* campaigns (e.g. a bank-wide "FAB40" cashback) may be published separately on the platform's or bank's own campaigns page — check for this per platform, since if it exists it's a much simpler, lower-maintenance source than per-restaurant scraping for that specific offer type.
5. Build the data-ingestion layer as a **pluggable adapter interface** — one module per platform, sharing a common contract (e.g. `getRestaurants(locationCell)`, `getMenu(restaurantId)` → normalized price/fee/offer schema) — so that any individual platform's adapter can be disabled, rebuilt, or swapped for an official partner API later without touching the rest of the system.

---

## 3. Data Architecture 

**Do not fetch live data per user, per app-open.** This multiplies request volume and anti-bot exposure for no real benefit, since users near each other see near-identical data. Instead:

- **Local cache-first architecture.** All restaurant/menu/price/offer data is fetched into a local database and served from there. The scraping layer runs independently of user traffic.
- **Refresh cadence:** hourly background refresh of cached location cells, not continuous/real-time. Add an option to hit manual refresh for the user's location.
- **Location indexing:** use a **geohash or H3 hexagonal grid** (roughly 500m–1km cells) as the cache key for "what restaurants/prices exist here". A user's GPS coordinate deterministically maps to one grid cell.
- **Cold-start strategy for grid cells:**
  - **Seed** the ~20–30 highest-density zones at launch across the UAE (e.g. Dubai: Downtown, Marina, JLT, Business Bay, Deira; Sharjah and Ajman city centers;  — treat this as a starting list, refine as needed) so most early users hit a warm cache immediately. We will be building and testing it in Al Rashidia 3, Ajman so would try to cover that area and surroundings first.
  - **Lazy-load** any other cell the first time a real user's location falls into it, then cache it going forward. This organically builds full UAE coverage without wasting fetches on areas nobody uses.
  - When a cell is fetched for the first time, fire all 6 platform adapters **in parallel**, not sequentially, and stream results back to the UI as each platform responds — don't block the whole screen on the slowest platform.
- **On-demand refresh:** provide a manual "refresh this order" action a user can trigger for their specific address — this should be the only per-user live fetch path, and it should be scoped to one address/one platform set, not a broader crawl.
- **Data view and comparison only:** Since the food platforms don't provide an API, we can't implement the 'order now' functionality directly within our system. This means the MVP will only provide data view and comparison. Check if the URLs/links can be fetched for the selected food item/restaurant so if the user clicks on it, they will be redirected either to the app (if installed on their device) or to the respective platform's website to order the food. 

---

## 4. Frontend & Platform Path

- **Framework:** React / Next.js, mobile-responsive web app, built first.
- **Future native path:** the plan is to wrap this later with Capacitor into iOS/Android apps with minimal rework. Build with that in mind now:
  - Use geolocation and notification APIs in a way that has a clean Capacitor-compatible equivalent later.
  - Avoid web-only patterns that don't translate to a WebView shell.
- Anonymous session only for now — no auth screens, no login walls. Will work later on the user registration and login system.

---

## 5. Backend, Database, and Infra

**Left to your judgment — propose and justify, then proceed:**
- Backend language/framework (consider that this workload is scraping- and data-pipeline-heavy, not just CRUD)
- Database choice (consider that the core access pattern is "get all cached restaurant/price/offer records for a grid cell, refreshed hourly")
- Job scheduling approach for the hourly refresh
- Repo structure (monorepo vs. separate frontend/backend/scraper repos) — pick one and explain why

**Not your decision to make — treat as fixed constraints:**
- No user accounts/auth in this version
- Hourly cache-first data flow, not per-request live scraping, with an option for manual refresh on demand.
- Geohash/H3 grid-based location keying
- One adapter module per platform, common interface, mockable/stubbable independently

---

## 6. MVP Build Order

Please scaffold in this order so the UI isn't blocked waiting on scraper development:

1. **Core infra:** project scaffold, DB schema (restaurants, menu items, prices, delivery fees, offers, grid cells, last-refreshed timestamps), geohash/H3 utility functions, and a scheduler stub for hourly refresh.
2. **Platform adapter interface + mock adapters:** define the shared adapter contract, then implement mock/sample-data versions for all 6 platforms so the rest of the app can be built and tested without live scraping working yet. Clearly mark mock vs. live per adapter.
3. **Search & discovery UI:** user sets/detects a location, searches a dish or restaurant, sees which platforms carry it in that grid cell (from cached/mock data).
4. **Price comparison view:** per-platform item price + delivery fee + estimated total + any inline offers/badges, with a "lowest total" highlight.
5. **On-demand refresh action:** manual per-address refresh, as described in Section 3.

**Explicitly out of scope for this MVP** (don't build, but don't architecturally block either): user accounts, sponsored placement logic/UI, affiliate program integration, native app build, admin/restaurant dashboard.

---

## 7. What I need from you before/while building

- State your proposed backend language, framework, and database up front, with a one-paragraph rationale, before generating the full scaffold.
- For each of the 6 platform adapters, if you determine live scraping is currently infeasible or high-risk to implement safely (e.g. requires defeating strong anti-bot protection you can't test against, or requires mobile-app-only data), say so explicitly rather than silently shipping a broken or fake "live" adapter.
- Ask me directly if you hit a genuine fork in the design (not covered above) rather than silently assuming — e.g., exact list of seed launch zones, specific proxy provider/credentials, deployment target.
