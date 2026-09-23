import React, { useState, useEffect, useCallback } from 'react';
import {
  LocationCell,
  DEFAULT_LOCATION,
  SearchResultSummary,
  PriceComparison,
  MenuItem,
  RefreshCellResponse
} from '@uae-food-compare/shared';
import { api } from './services/api';
import { Header } from './components/Header';
import { LocationModal } from './components/LocationModal';
import { SearchBar } from './components/SearchBar';
import { CuisineFilter } from './components/CuisineFilter';
import { PlatformBadges } from './components/PlatformBadges';
import { RestaurantCard } from './components/RestaurantCard';
import { ComparisonModal } from './components/ComparisonModal';
import { RefreshBanner } from './components/RefreshBanner';
import { Footer } from './components/Footer';
import { Sparkles, UtensilsCrossed, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationCell>(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultSummary[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Comparison modal state
  const [selectedComparison, setSelectedComparison] = useState<PriceComparison | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshResult, setRefreshResult] = useState<RefreshCellResponse | null>(null);

  // Fetch search results
  const fetchResults = useCallback(async (query = searchQuery, cuisine = selectedCuisine, loc = currentLocation) => {
    setIsLoadingResults(true);
    setError(null);
    try {
      const results = await api.search(query, loc.geohash, loc.lat, loc.lng, cuisine);
      setSearchResults(results);
    } catch (err: any) {
      console.error('Failed to fetch search results:', err);
      setError('Unable to fetch live restaurant listings. Please check backend connection.');
    } finally {
      setIsLoadingResults(false);
    }
  }, [searchQuery, selectedCuisine, currentLocation]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Handle live comparison for an item
  const handleCompareItem = async (item: MenuItem) => {
    setIsComparing(true);
    setIsComparisonModalOpen(true);
    setSelectedComparison(null);
    try {
      const comp = await api.compare(item.id, currentLocation.geohash, currentLocation.lat, currentLocation.lng);
      setSelectedComparison(comp);
    } catch (err) {
      console.error('Failed to run comparison:', err);
    } finally {
      setIsComparing(false);
    }
  };

  // Handle GPS detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const resolved = await api.resolveLocation(pos.coords.latitude, pos.coords.longitude);
          setCurrentLocation(resolved);
          setIsLocationModalOpen(false);
          fetchResults(searchQuery, selectedCuisine, resolved);
        } catch (err) {
          console.error('Failed to resolve GPS location:', err);
        } finally {
          setIsDetectingGPS(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed, fallback to default', err);
        setIsDetectingGPS(false);
        alert('Could not obtain GPS permission. Using Al Rashidia 3, Ajman as default.');
      }
    );
  };

  // Handle on-demand manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.refreshCell(currentLocation.geohash, currentLocation.lat, currentLocation.lng);
      setRefreshResult(res);
      // Re-fetch listings with freshly refreshed cell
      await fetchResults();
    } catch (err) {
      console.error('Failed to manually refresh cell:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navigation Header */}
      <Header
        location={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 flex-grow">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Never Overpay for UAE Food Delivery Again</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3 leading-tight">
            Compare <span className="gradient-text-uae">Real Total Costs</span> Across All 6 UAE Apps
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Find the lowest final checkout price (Item + Delivery Fee + Active Card Discounts) for what you're craving in <strong>{currentLocation.name}</strong>.
          </p>
        </div>

        {/* Search & Suggestions */}
        <SearchBar
          query={searchQuery}
          onQueryChange={(q) => {
            setSearchQuery(q);
          }}
          onSearch={(q) => {
            fetchResults(q, selectedCuisine, currentLocation);
          }}
        />

        {/* Platform Status Strip */}
        <PlatformBadges />

        {/* Manual Refresh Feedback Banner */}
        <RefreshBanner
          isRefreshing={isRefreshing}
          refreshResult={refreshResult}
          locationName={currentLocation.name}
        />

        {/* Cuisine Filters */}
        <CuisineFilter
          selectedCuisine={selectedCuisine}
          onSelectCuisine={(cuisine) => {
            setSelectedCuisine(cuisine);
            fetchResults(searchQuery, cuisine, currentLocation);
          }}
        />

        {/* Error Feedback */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Restaurant Results Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              <span>Available Restaurants in {currentLocation.name}</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              {searchResults.length} restaurants found
            </span>
          </div>

          {isLoadingResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-2xl skeleton border border-slate-800" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <RestaurantCard
                  key={result.restaurant.id}
                  result={result}
                  onCompareItem={handleCompareItem}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400">
              <p className="text-base font-bold text-slate-200 mb-1">No restaurants or dishes matched your search.</p>
              <p className="text-xs">Try searching for "Shawarma", "ALBAIK", "Mandi", or select another UAE zone.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Location Picker Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          fetchResults(searchQuery, selectedCuisine, loc);
        }}
        onDetectGPS={handleDetectGPS}
        isDetectingGPS={isDetectingGPS}
      />

      {/* Real-time Side-by-Side Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        comparison={selectedComparison}
        isLoading={isComparing}
      />
    </div>
  );
};
