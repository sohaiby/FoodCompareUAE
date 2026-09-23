"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crawler_service_1 = require("../services/crawler.service");
const db_1 = require("../db");
const search_service_1 = require("../services/search.service");
async function testLiveRefresh() {
    console.log('--- Initial DB stats before refresh ---');
    console.log(db_1.db.getStats());
    console.log('\n--- Refreshing Al Rashidiya 3, Ajman (wn5r6) with Live Adapters ---');
    const refreshRes = await crawler_service_1.crawlerService.refreshCell({
        geohash: 'wn5r6',
        lat: 25.3995,
        lng: 55.4455
    });
    console.log('\nRefresh result summary:');
    console.log(`Duration: ${refreshRes.durationMs}ms`);
    console.log('Platforms refreshed:');
    refreshRes.platformsRefreshed.forEach((p) => {
        console.log(`- ${p.platform}: ${p.restaurantCount} restaurants (isMock: ${p.isMock}, success: ${p.success})`);
    });
    console.log('\n--- DB stats after refresh ---');
    console.log(db_1.db.getStats());
    const ajmanRest = db_1.db.getRestaurantsByGeohash('wn5r6');
    console.log(`Total restaurants in Al Rashidiya 3, Ajman: ${ajmanRest.length}`);
    console.log('\n--- Testing Search for "Shawarma" in Al Rashidiya 3 ---');
    const searchShawarma = await search_service_1.searchService.search('shawarma', 'wn5r6', 25.3995, 55.4455);
    console.log(`Found ${searchShawarma.length} matching results for "shawarma"`);
    console.log('\n--- Testing Search for "Pizza" in Al Rashidiya 3 ---');
    const searchPizza = await search_service_1.searchService.search('pizza', 'wn5r6', 25.3995, 55.4455);
    console.log(`Found ${searchPizza.length} matching results for "pizza"`);
    searchPizza.slice(0, 3).forEach((r) => {
        console.log(`Restaurant: ${r.restaurant.name} (${r.restaurant.cuisines.join(', ')})`);
    });
}
testLiveRefresh();
