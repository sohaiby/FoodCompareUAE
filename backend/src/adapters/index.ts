import { PlatformId, ALL_PLATFORM_IDS } from '@uae-food-compare/shared';
import { IPlatformAdapter } from './adapter.interface';
import { talabatAdapter } from './talabat.adapter';
import { noonAdapter } from './noon.adapter';
import { careemAdapter } from './careem.adapter';
import { deliverooAdapter } from './deliveroo.adapter';
import { keetaAdapter } from './keeta.adapter';
import { smilesAdapter } from './smiles.adapter';

export * from './adapter.interface';

class AdapterRegistry {
  private adapters: Map<PlatformId, IPlatformAdapter> = new Map();

  constructor() {
    this.register(talabatAdapter);
    this.register(noonAdapter);
    this.register(careemAdapter);
    this.register(deliverooAdapter);
    this.register(keetaAdapter);
    this.register(smilesAdapter);
  }

  public register(adapter: IPlatformAdapter) {
    this.adapters.set(adapter.platformId, adapter);
  }

  public getAdapter(platformId: PlatformId): IPlatformAdapter | undefined {
    return this.adapters.get(platformId);
  }

  public getAllAdapters(): IPlatformAdapter[] {
    return Array.from(this.adapters.values());
  }

  public async getAdapterStatuses() {
    const statuses = await Promise.all(
      this.getAllAdapters().map(async (adapter) => {
        try {
          const healthy = await adapter.isHealthy();
          return {
            platform: adapter.platformId,
            isMock: adapter.isMock,
            status: healthy ? 'healthy' : 'degraded'
          };
        } catch (err: any) {
          return {
            platform: adapter.platformId,
            isMock: adapter.isMock,
            status: 'error',
            error: err.message
          };
        }
      })
    );
    return statuses;
  }
}

export const adapterRegistry = new AdapterRegistry();
