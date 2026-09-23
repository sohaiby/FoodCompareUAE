"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHourlyScheduler = setupHourlyScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const shared_1 = require("@uae-food-compare/shared");
const crawler_service_1 = require("../services/crawler.service");
function setupHourlyScheduler() {
    console.log('[Scheduler] Initializing hourly grid-cell crawler scheduler...');
    // Run at minute 0 of every hour ('0 * * * *')
    node_cron_1.default.schedule('0 * * * *', async () => {
        console.log('[Scheduler] Triggering scheduled hourly cache refresh for UAE seed cells...');
        for (const loc of shared_1.SEED_LOCATIONS) {
            try {
                console.log(`[Scheduler] Refreshing cell ${loc.name} (${loc.geohash})...`);
                const result = await crawler_service_1.crawlerService.refreshCell({
                    geohash: loc.geohash,
                    lat: loc.lat,
                    lng: loc.lng
                });
                console.log(`[Scheduler] Successfully refreshed ${loc.name} in ${result.durationMs}ms`);
            }
            catch (err) {
                console.error(`[Scheduler] Failed to refresh cell ${loc.geohash}:`, err);
            }
        }
    });
    console.log('[Scheduler] Hourly crawler job successfully scheduled (0 * * * *)');
}
