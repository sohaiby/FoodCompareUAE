import cron from 'node-cron';
import { SEED_LOCATIONS } from '@uae-food-compare/shared';
import { crawlerService } from '../services/crawler.service';

export function setupHourlyScheduler() {
  console.log('[Scheduler] Initializing hourly grid-cell crawler scheduler...');

  // Run at minute 0 of every hour ('0 * * * *')
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Triggering scheduled hourly cache refresh for UAE seed cells...');
    for (const loc of SEED_LOCATIONS) {
      try {
        console.log(`[Scheduler] Refreshing cell ${loc.name} (${loc.geohash})...`);
        const result = await crawlerService.refreshCell({
          geohash: loc.geohash,
          lat: loc.lat,
          lng: loc.lng
        });
        console.log(`[Scheduler] Successfully refreshed ${loc.name} in ${result.durationMs}ms`);
      } catch (err) {
        console.error(`[Scheduler] Failed to refresh cell ${loc.geohash}:`, err);
      }
    }
  });

  console.log('[Scheduler] Hourly crawler job successfully scheduled (0 * * * *)');
}
