import React from 'react';
import { Search, X, Flame } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: (q: string) => void;
}

const POPULAR_SEARCHES = [
  'Shawarma',
  'ALBAIK',
  'Chicken Mandi',
  'Super Star Burger',
  'Zinger Supreme',
  'Spanish Latte',
  'Pizza',
  'Mix Grill'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4.5 text-slate-400 pointer-events-none flex items-center">
          <Search className="w-5 h-5 text-emerald-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search cravings, dishes, or restaurants (e.g., Shawarma, ALBAIK, Mandi)..."
          className="w-full pl-12 pr-28 py-4 bg-slate-900/90 border-2 border-slate-700/80 focus:border-emerald-500 rounded-2xl text-slate-100 placeholder-slate-400 text-sm sm:text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute right-20 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 transition cursor-pointer"
        >
          Compare
        </button>
      </form>

      {/* Trending Suggestions */}
      <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs">
        <div className="flex items-center gap-1 text-amber-400 font-bold shrink-0 mr-1">
          <Flame className="w-3.5 h-3.5" />
          <span>UAE Trending:</span>
        </div>
        {POPULAR_SEARCHES.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              onQueryChange(tag);
              onSearch(tag);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700/50 hover:border-emerald-500/40 whitespace-nowrap transition cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
