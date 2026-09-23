"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapterRegistry = void 0;
const talabat_adapter_1 = require("./talabat.adapter");
const noon_adapter_1 = require("./noon.adapter");
const careem_adapter_1 = require("./careem.adapter");
const deliveroo_adapter_1 = require("./deliveroo.adapter");
const keeta_adapter_1 = require("./keeta.adapter");
const smiles_adapter_1 = require("./smiles.adapter");
__exportStar(require("./adapter.interface"), exports);
class AdapterRegistry {
    adapters = new Map();
    constructor() {
        this.register(talabat_adapter_1.talabatAdapter);
        this.register(noon_adapter_1.noonAdapter);
        this.register(careem_adapter_1.careemAdapter);
        this.register(deliveroo_adapter_1.deliverooAdapter);
        this.register(keeta_adapter_1.keetaAdapter);
        this.register(smiles_adapter_1.smilesAdapter);
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
exports.adapterRegistry = new AdapterRegistry();
