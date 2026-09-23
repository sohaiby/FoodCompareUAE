import { talabatAdapter } from './talabat.adapter';
import { noonAdapter } from './noon.adapter';
import { careemAdapter } from './careem.adapter';
import { deliverooAdapter } from './deliveroo.adapter';
import { keetaAdapter } from './keeta.adapter';
import { smilesAdapter } from './smiles.adapter';
export * from './adapter.interface';
class AdapterRegistry {
    adapters = new Map();
    constructor() {
        this.register(talabatAdapter);
        this.register(noonAdapter);
        this.register(careemAdapter);
        this.register(deliverooAdapter);
        this.register(keetaAdapter);
        this.register(smilesAdapter);
    }
    register(adapter) {
        this.adapters.set(adapter.platformId, adapter);
    }
    getAdapter(platformId) {
        return this.adapters.get(platformId);
    }
    getAllAdapters() {
        return Array.from(this.adapters.values());
    }
    async getAdapterStatuses() {
        const statuses = await Promise.all(this.getAllAdapters().map(async (adapter) => {
            try {
                const healthy = await adapter.isHealthy();
                return {
                    platform: adapter.platformId,
                    isMock: adapter.isMock,
                    status: healthy ? 'healthy' : 'degraded'
                };
            }
            catch (err) {
                return {
                    platform: adapter.platformId,
                    isMock: adapter.isMock,
                    status: 'error',
                    error: err.message
                };
            }
        }));
        return statuses;
    }
}
export const adapterRegistry = new AdapterRegistry();
