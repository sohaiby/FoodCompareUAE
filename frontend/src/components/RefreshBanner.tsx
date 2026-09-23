import React from 'react';
import { RefreshCw, CheckCircle, Zap } from 'lucide-react';
import { RefreshCellResponse } from '@uae-food-compare/shared';

interface RefreshBannerProps {
  isRefreshing: boolean;
  refreshResult: RefreshCellResponse | null;
  locationName: string;
}

export const RefreshBanner: React.FC<RefreshBannerProps> = ({
  isRefreshing,
  refreshResult,
  locationName
}) => {
  if (!isRefreshing && !refreshResult) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      {isRefreshing && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>
              Triggering live parallel data crawl across Talabat, Noon, Careem, Deliveroo, Keeta & Smiles for <strong>{locationName}</strong>...
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            Parallel Ingestion
          </span>
        </div>
      )}

      {!isRefreshing && refreshResult && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All 6 platforms refreshed in {refreshResult.durationMs}ms ({new Date(refreshResult.refreshedAt).toLocaleTimeString()})
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {refreshResult.platformsRefreshed.map((p) => (
              <span
                key={p.platform}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
              >
                {p.platform}: {p.restaurantCount} spots
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
