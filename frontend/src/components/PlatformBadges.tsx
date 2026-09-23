import React from 'react';
import { PLATFORMS_METADATA } from '@uae-food-compare/shared';
import { CheckCircle2, Smartphone, Globe } from 'lucide-react';

export const PlatformBadges: React.FC = () => {
  const platforms = Object.values(PLATFORMS_METADATA);

  const isLiveWeb = (id: string) => ['talabat', 'noon', 'deliveroo'].includes(id);

  return (
    <div className="w-full glass-panel p-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Comparing 6 UAE Food Delivery Platforms</h4>
          <p className="text-xs text-slate-300">Live prices, real delivery fees & active bank/membership promos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400">3 Live Web Ingestion</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30">
            <Smartphone className="w-3 h-3 text-sky-400" />
            <span className="text-[11px] font-bold text-sky-400">3 Mobile Staged</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {platforms.map((p) => {
          const live = isLiveWeb(p.id);
          return (
            <div
              key={p.id}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: p.brandColor }}
              />
              <div className="truncate flex-1">
                <p className="text-xs font-bold text-white truncate">{p.displayName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {live ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[10px] font-semibold text-emerald-400 truncate">Live Web Scraper</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      <span className="text-[10px] font-medium text-slate-400 truncate">App Reverse-Eng</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

