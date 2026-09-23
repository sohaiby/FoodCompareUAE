import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 py-10 px-4 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-sm text-white">FoodCompare UAE</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
              Free & Anonymous
            </span>
          </div>
          <p>Real-time total cost comparison across Talabat, Noon Food, Careem, Deliveroo, Keeta & Smiles.</p>
          <p className="text-[11px] text-slate-500">
            Covering all 7 Emirates: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ & Fujairah.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-right">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Zero Tracking • No Account Needed</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Data refreshed hourly via deterministic Geohash/H3 grid caching.
          </p>
        </div>
      </div>
    </footer>
  );
};
