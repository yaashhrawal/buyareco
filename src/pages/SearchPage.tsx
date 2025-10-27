/**
 * Search Results Page
 * Displays filtered location results with list/map views
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin as MapIcon, List as ListIcon, Grid as GridIcon, AlertCircle, Database } from 'lucide-react';
import { useSearchLocations } from '../hooks/useLocations';
import { isSupabaseConfigured } from '../services/supabase';
import type { SearchFilters, Vibe, ViewMode } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Parse filters from URL
  const filters: SearchFilters = {
    query: searchParams.get('q') || undefined,
    vibes: searchParams.get('vibes')?.split(',') as Vibe[] || undefined,
    city: searchParams.get('city') || undefined,
  };

  const [page, setPage] = useState(1);

  // Fetch locations using React Query
  const { data, isLoading, error } = useSearchLocations(filters, page, 20);

  useEffect(() => {
    // Reset page when filters change
    setPage(1);
  }, [searchParams]);

  const handleSearchChange = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <MapIcon className="w-6 h-6 text-primary-400" />
              <span className="text-lg font-bold text-gradient hidden sm:block">BuyaReco</span>
            </Link>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search locations..."
                defaultValue={filters.query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-neutral-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="List View"
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Map View"
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Button */}
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Active Filters */}
          {filters.vibes && filters.vibes.length > 0 && (
            <div className="flex gap-2 mt-4">
              {filters.vibes.map((vibe) => (
                <span
                  key={vibe}
                  className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                >
                  {vibe}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-neutral-400">Searching for vibes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-strong rounded-2xl p-12 text-center">
              {!isSupabaseConfigured ? (
                <>
                  <Database className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                  <h2 className="text-2xl font-bold mb-3 text-white">Supabase Setup Required</h2>
                  <p className="text-neutral-300 mb-6">
                    To use search and data features, you need to configure Supabase.
                  </p>
                  <div className="bg-neutral-900/50 rounded-xl p-6 mb-6 text-left">
                    <p className="text-sm text-neutral-400 mb-4">Quick setup steps:</p>
                    <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
                      <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">supabase.com</a></li>
                      <li>Copy your project URL and anon key</li>
                      <li>Create a <code className="bg-neutral-800 px-2 py-1 rounded">.env</code> file in the project root</li>
                      <li>Run the SQL from <code className="bg-neutral-800 px-2 py-1 rounded">supabase-schema.sql</code></li>
                    </ol>
                  </div>
                  <a
                    href="/QUICK_START.md"
                    target="_blank"
                    className="inline-block btn-primary"
                  >
                    View Setup Guide
                  </a>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <h2 className="text-2xl font-bold mb-3 text-white">Error Loading Results</h2>
                  <p className="text-neutral-300 mb-6">
                    There was an error loading the search results. Please try again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Refresh Page
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        {data && !isLoading && (
          <>
            <div className="mb-6">
              <p className="text-neutral-400">
                Found <span className="text-white font-semibold">{data.total}</span> locations
              </p>
            </div>

            {/* Results Grid/List */}
            {data.locations.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {data.locations.map((location) => (
                  <div
                    key={location.id}
                    className="glass rounded-xl p-6 card-hover cursor-pointer"
                  >
                    <h3 className="text-xl font-bold mb-2">{location.name}</h3>
                    <p className="text-neutral-400 mb-4">{location.city}</p>
                    <div className="flex gap-2 flex-wrap">
                      {location.vibes.map((vibe) => (
                        <span
                          key={vibe}
                          className="px-2 py-1 bg-neutral-800 rounded-full text-xs"
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="glass-strong rounded-2xl p-12 text-center">
                  <MapIcon className="w-16 h-16 mx-auto mb-4 text-neutral-500" />
                  <h2 className="text-2xl font-bold mb-3 text-white">No Locations Found</h2>
                  <p className="text-neutral-300 mb-6">
                    {!isSupabaseConfigured ? (
                      <>The location database needs to be set up. Follow the setup guide to add locations.</>
                    ) : (
                      <>Try adjusting your filters or search in a different area.</>
                    )}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/" className="btn-secondary">
                      Back to Home
                    </Link>
                    {!isSupabaseConfigured && (
                      <a
                        href="/QUICK_START.md"
                        target="_blank"
                        className="btn-primary"
                      >
                        Setup Guide
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {data.has_more && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-primary"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
