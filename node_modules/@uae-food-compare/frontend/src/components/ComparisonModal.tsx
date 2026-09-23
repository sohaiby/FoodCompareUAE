import React from 'react';
import {
  X,
  Trophy,
  ExternalLink,
  Tag,
  CreditCard,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Info
} from 'lucide-react';
import { PriceComparison, PLATFORMS_METADATA, PlatformPrice } from '@uae-food-compare/shared';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison: PriceComparison | null;
  isLoading: boolean;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  comparison,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-3xl glass-panel bg-slate-900 border border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Live UAE Price Comparison
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {comparison ? comparison.menuItemName : 'Loading Comparison...'}
            </h2>
            <p className="text-xs text-slate-400">
              {comparison ? `${comparison.restaurantName} • ${comparison.locationName}` : 'Checking 6 aggregators...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-200">Querying platform adapters concurrently...</p>
            <p className="text-xs text-slate-400">Calculating item markups, surge fees & bank cards</p>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && comparison && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* Best Value Highlight Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-2 border-emerald-500/50 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Cheapest Total Deal
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                        {PLATFORMS_METADATA[comparison.bestPlatform].displayName}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-white">
                      AED {comparison.lowestTotalAed.toFixed(1)}
                      <span className="text-xs font-normal text-slate-300 ml-1.5">(Item + Delivery)</span>
                    </p>
                  </div>
                </div>

                {comparison.maxSavingsAed > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
                    <TrendingDown className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-amber-400">Max Savings</p>
                      <p className="text-sm font-black">Save AED {comparison.maxSavingsAed.toFixed(1)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Comparison List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                All 6 Aggregators Ranked (Lowest to Highest)
              </h4>

              <div className="space-y-3">
                {comparison.platformOptions.map((opt: PlatformPrice, idx: number) => {
                  const meta = PLATFORMS_METADATA[opt.platform];
                  const isBest = idx === 0 && opt.isAvailable;

                  if (!opt.isAvailable) {
                    return (
                      <div
                        key={opt.platform}
                        className="p-3.5 rounded-xl border bg-slate-950/40 border-slate-900 opacity-60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 grayscale opacity-60"
                            style={{
                              backgroundColor: meta.brandColor,
                              color: meta.textColor
                            }}
                          >
                            {meta.displayName[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-400 text-sm">{meta.displayName}</span>
                            <p className="text-[11px] text-slate-500">Not listed on this delivery platform in this area</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-500">
                          Unavailable
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={opt.platform}
                      className={`p-4 rounded-xl border transition-all ${
                        isBest
                          ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30 shadow-lg'
                          : 'bg-slate-900/70 hover:bg-slate-800/70 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Platform info */}
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md shrink-0"
                            style={{
                              backgroundColor: meta.brandColor,
                              color: meta.textColor
                            }}
                          >
                            {meta.displayName[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-base">
                                {meta.displayName}
                              </span>
                              {isBest && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md badge-lowest flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> BEST PRICE
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {opt.etaMinutes.min}-{opt.etaMinutes.max} mins
                              </span>
                              <span>•</span>
                              <span>
                                Item: AED {opt.discountedItemPriceAed.toFixed(1)}
                              </span>
                              <span>•</span>
                              <span>
                                Del: {opt.deliveryFeeAed === 0 ? 'FREE' : `AED ${opt.deliveryFeeAed}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Checkout</p>
                            <p className={`text-lg sm:text-xl font-black ${isBest ? 'text-emerald-400' : 'text-slate-100'}`}>
                              AED {opt.finalTotalAed.toFixed(1)}
                            </p>
                          </div>

                          <a
                            href={opt.deepLink.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-md ${
                              isBest
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                            }`}
                          >
                            <span>Order</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Active Offers & Card Badges */}
                      {opt.activeOffers.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                          {opt.activeOffers.map((off) => (
                            <span
                              key={off.id}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                off.type === 'bank_card'
                                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {off.type === 'bank_card' ? <CreditCard className="w-2.5 h-2.5" /> : <Tag className="w-2.5 h-2.5" />}
                              <span>{off.badgeText}</span>
                              {off.code && <span className="font-mono bg-slate-900/60 px-1 rounded ml-1 text-slate-200">[{off.code}]</span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer & Info */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Clicking <strong>Order</strong> redirects directly to the restaurant page on that aggregator's website or app. Prices include active promo rules and location-based delivery fees cached for this area.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
