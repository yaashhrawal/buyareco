/**
 * Location-related React Query hooks
 */

import { useQuery } from '@tanstack/react-query';
import {
  searchLocations,
  getLocationById,
  getAutocompleteSuggestions,
  getRecommendations,
} from '../services/api';
import type { SearchFilters } from '../types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const locationKeys = {
  all: ['locations'] as const,
  search: (filters: SearchFilters, page: number) =>
    ['locations', 'search', filters, page] as const,
  detail: (id: string) => ['locations', 'detail', id] as const,
  autocomplete: (query: string) => ['locations', 'autocomplete', query] as const,
  recommendations: (userId?: string, vibes?: string[], city?: string) =>
    ['locations', 'recommendations', userId, vibes, city] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Search locations with filters
 */
export const useSearchLocations = (
  filters: SearchFilters,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: locationKeys.search(filters, page),
    queryFn: () => searchLocations(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

/**
 * Get location details by ID
 */
export const useLocation = (id: string) => {
  return useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: () => getLocationById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get autocomplete suggestions
 */
export const useAutocomplete = (query: string) => {
  return useQuery({
    queryKey: locationKeys.autocomplete(query),
    queryFn: () => getAutocompleteSuggestions(query),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get recommended locations
 */
export const useRecommendations = (
  userId?: string,
  vibes?: string[],
  city?: string,
  limit: number = 20
) => {
  return useQuery({
    queryKey: locationKeys.recommendations(userId, vibes, city),
    queryFn: () => getRecommendations(userId, vibes, city, limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
