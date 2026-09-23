import React from 'react';

interface CuisineFilterProps {
  selectedCuisine: string;
  onSelectCuisine: (cuisine: string) => void;
}

const CUISINES = [
  { id: '', label: 'All UAE Craves', icon: '🍽️' },
  { id: 'Shawarma', label: 'Shawarma', icon: '🌯' },
  { id: 'Fried Chicken', label: 'Fried Chicken', icon: '🍗' },
  { id: 'Mandi', label: 'Mandi & Grills', icon: '🍚' },
  { id: 'Burgers', label: 'Burgers', icon: '🍔' },
  { id: 'Cafeteria', label: 'Cafeteria & Karak', icon: '☕' },
  { id: 'Pizza', label: 'Pizza', icon: '🍕' },
  { id: 'Specialty Coffee', label: 'Coffee & Cafes', icon: '🥤' }
];

export const CuisineFilter: React.FC<CuisineFilterProps> = ({
  selectedCuisine,
  onSelectCuisine
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
      {CUISINES.map((c) => {
        const isSelected = selectedCuisine === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelectCuisine(c.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/40'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
};
