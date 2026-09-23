import {
  LocationCell,
  SearchResultSummary,
  PriceComparison,
  RefreshCellResponse,
  PlatformMetadata,
  PlatformId
} from '@uae-food-compare/shared';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },

  async getPlatforms(): Promise<Record<PlatformId, PlatformMetadata>> {
    const res = await fetch(`${API_BASE}/platforms`);
    if (!res.ok) throw new Error('Failed to fetch platforms');
    const data = await res.json();
    return data.platforms;
  },

  async getSeedLocations(): Promise<LocationCell[]> {
    const res = await fetch(`${API_BASE}/locations/seeds`);
    if (!res.ok) throw new Error('Failed to fetch seed locations');
    const data = await res.json();
    return data.locations;
  },

  async resolveLocation(lat?: number, lng?: number, geohash?: string): Promise<LocationCell> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    if (geohash) params.append('geohash', geohash);

    const res = await fetch(`${API_BASE}/locations/resolve?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to resolve location');
    const data = await res.json();
    return data.location;
  },

  async search(
    query: string,
    geohash: string,
    lat?: number,
    lng?: number,
    cuisine?: string
  ): Promise<SearchResultSummary[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (geohash) params.append('geohash', geohash);
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    if (cuisine) params.append('cuisine', cuisine);

    const res = await fetch(`${API_BASE}/search?${params.toString()}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return data.results;
  },

  async compare(
    menuItemId: string,
    geohash: string,
    lat?: number,
    lng?: number
  ): Promise<PriceComparison> {
    const params = new URLSearchParams({ menuItemId, geohash });
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());

    const res = await fetch(`${API_BASE}/compare?${params.toString()}`);
    if (!res.ok) throw new Error('Comparison failed');
    const data = await res.json();
    return data.comparison;
  },

  async refreshCell(geohash: string, lat?: number, lng?: number): Promise<RefreshCellResponse> {
    const res = await fetch(`${API_BASE}/refresh-cell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ geohash, lat, lng })
    });
    if (!res.ok) throw new Error('Manual refresh failed');
    const data = await res.json();
    return data.result;
  }
};
