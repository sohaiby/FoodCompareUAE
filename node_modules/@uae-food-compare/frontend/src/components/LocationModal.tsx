import React, { useState } from 'react';
import { X, MapPin, Navigation, Check, Sparkles } from 'lucide-react';
import { LocationCell, SEED_LOCATIONS } from '@uae-food-compare/shared';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationCell;
  onSelectLocation: (location: LocationCell) => void;
  onDetectGPS: () => void;
  isDetectingGPS: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onDetectGPS,
  isDetectingGPS
}) => {
  const [filterEmirate, setFilterEmirate] = useState<string>('All');

  if (!isOpen) return null;

  const emirates = ['All', 'Ajman', 'Dubai', 'Sharjah', 'Abu Dhabi'];

  const filteredLocations = filterEmirate === 'All'
    ? SEED_LOCATIONS
    : SEED_LOCATIONS.filter((loc) => loc.emirate.toLowerCase() === filterEmirate.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-700/80 shadow-2xl p-6 rounded-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Choose Delivery Location</h3>
              <p className="text-xs text-slate-400">Cached prices across 6 UAE aggregators</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="my-4">
          <button
            onClick={onDetectGPS}
            disabled={isDetectingGPS}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isDetectingGPS ? 'animate-spin' : ''}`} />
            <span>{isDetectingGPS ? 'Detecting Precise Location...' : 'Use Current GPS Location'}</span>
          </button>
        </div>

        {/* Emirate Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {emirates.map((em) => (
            <button
              key={em}
              onClick={() => setFilterEmirate(em)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterEmirate === em
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {em}
            </button>
          ))}
        </div>

        {/* Location List */}
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {filteredLocations.map((loc) => {
            const isSelected = loc.geohash === currentLocation.geohash;
            const isTestArea = loc.name.includes('Al Rashidia 3');

            return (
              <button
                key={loc.geohash}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/40 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isSelected ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-slate-600'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{loc.name}</span>
                      {isTestArea && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Primary Test Area
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{loc.emirate}</span>
                      <span>•</span>
                      <span>{loc.restaurantCount} verified restaurants</span>
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
