import React from 'react';
import { Star, Bike, ArrowRight, Utensils } from 'lucide-react';
import { SearchResultSummary, MenuItem, PLATFORMS_METADATA } from '@uae-food-compare/shared';

interface RestaurantCardProps {
  result: SearchResultSummary;
  onCompareItem: (item: MenuItem) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  result,
  onCompareItem
}) => {
  const { restaurant, availablePlatforms, menuItems } = result;

  return (
    <div className="glass-panel overflow-hidden border border-slate-800/90 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between bg-slate-900/90 hover:bg-slate-900">
      {/* Top Banner & Restaurant Header */}
      <div>
        {restaurant.coverUrl ? (
          <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-800">
            <img
              src={restaurant.coverUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-bold text-amber-400 shadow">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({restaurant.reviewCount})</span>
            </div>
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow-md">
                {restaurant.name}
              </h3>
              <p className="text-xs text-slate-300 truncate">{restaurant.addressSummary}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-md border border-emerald-500/30 shrink-0">
                  {restaurant.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white leading-tight">
                    {restaurant.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{restaurant.addressSummary}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-bold text-amber-400 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cuisines & Platforms Strip */}
        <div className="p-4 border-b border-slate-800/80">
          {/* Cuisines */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {restaurant.cuisines.map((c) => (
              <span
                key={c}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/60"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Delivery Fee Strip */}
          <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Bike className="w-3.5 h-3.5 text-emerald-400" />
              <span>Delivery Fee Comparison (All 6 Apps)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {availablePlatforms.map((p) => {
                const meta = PLATFORMS_METADATA[p.platform];
                const isFree = p.deliveryFeeAed === 0;
                return (
                  <div
                    key={p.platform}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      p.isAvailable
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-900 opacity-60'
                    }`}
                  >
                    <p className="text-[10px] font-semibold text-slate-400 truncate">{meta.displayName}</p>
                    <p className={`text-xs font-black mt-0.5 ${
                      !p.isAvailable
                        ? 'text-slate-500 font-medium text-[10px]'
                        : isFree
                        ? 'text-emerald-400'
                        : 'text-slate-200'
                    }`}>
                      {!p.isAvailable ? 'Not Listed' : isFree ? 'FREE' : `AED ${p.deliveryFeeAed}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Menu Items Preview */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Dishes & Lowest Rates</span>
            <span>Best Deal</span>
          </div>

          <div className="space-y-2">
            {menuItems.map((summary) => {
              const item = summary.item;
              const meta = PLATFORMS_METADATA[summary.bestPlatform];

              return (
                <div
                  key={item.id}
                  onClick={() => onCompareItem(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition shrink-0 border border-slate-700/60">
                        <Utensils className="w-4 h-4" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{item.category}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-[10px] text-slate-400 font-medium">from</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-400">
                        AED {summary.bestPriceAed.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      on {meta.displayName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-1">
        <button
          onClick={() => menuItems[0] && onCompareItem(menuItems[0].item)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-emerald-500 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>Compare Prices on All 6 Apps</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
