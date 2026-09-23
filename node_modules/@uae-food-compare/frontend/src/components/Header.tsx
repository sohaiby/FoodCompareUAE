import React from 'react';
import { MapPin, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { LocationCell } from '@uae-food-compare/shared';

interface HeaderProps {
  location: LocationCell;
  onOpenLocationModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  onOpenLocationModal,
  onRefresh,
  isRefreshing
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-xl">🇦🇪</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">FoodCompare</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">UAE</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Talabat • Noon • Careem • Deliveroo • Keeta • Smiles</p>
          </div>
        </div>

        {/* Location & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Selector Button */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-emerald-500/50 transition text-left cursor-pointer group"
          >
            <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="max-w-[130px] sm:max-w-[200px] truncate">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-0.5">Delivering to</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">{location.name}</p>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 ml-1 shrink-0">
              {location.emirate}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh prices for this location"
            className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
              isRefreshing
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 cursor-wait'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-slate-300 hover:text-white cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Anonymous Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anonymous</span>
          </div>
        </div>
      </div>
    </header>
  );
};
