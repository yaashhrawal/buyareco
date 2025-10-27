/**
 * API Service Layer
 * Wraps Supabase queries for locations, saves, lists, etc.
 */

import { supabase } from './supabase';
import { sanitizeSearchQuery } from '../utils/helpers';
import type {
  Location,
  SearchFilters,
  SearchResults,
  Save,
  SaveWithLocation,
  List,
  AutocompleteResult,
  User,
} from '../types';

// ============================================================================
// LOCATION API
// ============================================================================

/**
 * Search locations with filters
 */
export const searchLocations = async (
  filters: SearchFilters,
  page: number = 1,
  limit: number = 20
): Promise<SearchResults> => {
  try {
    let query = supabase
      .from('locations')
      .select('*', { count: 'exact' });

    // Apply text search (sanitized to prevent SQL injection)
    if (filters.query) {
      const sanitized = sanitizeSearchQuery(filters.query);
      query = query.or(
        `name.ilike.%${sanitized}%,description.ilike.%${sanitized}%,city.ilike.%${sanitized}%`
      );
    }

    // Apply vibe filters
    if (filters.vibes && filters.vibes.length > 0) {
      query = query.overlaps('vibes', filters.vibes);
    }

    // Apply city filter
    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Apply price level filter
    if (filters.price_level && filters.price_level.length > 0) {
      query = query.in('price_level', filters.price_level);
    }

    // Apply rating filter
    if (filters.rating_min) {
      query = query.gte('rating', filters.rating_min);
    }

    // Apply expert picks filter
    if (filters.expert_picks_only) {
      query = query.eq('is_expert_pick', true);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) throw error;

    return {
      locations: data || [],
      total: count || 0,
      page,
      has_more: count ? offset + limit < count : false,
    };
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

/**
 * Get a single location by ID
 */
export const getLocationById = async (id: string): Promise<Location | null> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

/**
 * Get autocomplete suggestions for search
 */
export const getAutocompleteSuggestions = async (
  query: string
): Promise<AutocompleteResult[]> => {
  try {
    if (!query || query.length < 2) return [];

    // Search for locations and cities (sanitized to prevent SQL injection)
    const sanitized = sanitizeSearchQuery(query);
    const { data, error } = await supabase
      .from('locations')
      .select('id, name, city, category')
      .or(`name.ilike.%${sanitized}%,city.ilike.%${sanitized}%`)
      .limit(10);

    if (error) throw error;

    // Transform to autocomplete results
    const results: AutocompleteResult[] = [];
    const cities = new Set<string>();

    data?.forEach((location) => {
      // Add location result
      results.push({
        type: 'location',
        id: location.id,
        name: location.name,
        subtitle: location.city,
      });

      // Add unique city
      if (!cities.has(location.city)) {
        cities.add(location.city);
        results.push({
          type: 'city',
          id: location.city,
          name: location.city,
          subtitle: 'City',
        });
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  } catch (error) {
    console.error('Error fetching autocomplete:', error);
    return [];
  }
};

/**
 * Get recommended locations based on user preferences
 */
export const getRecommendations = async (
  userId?: string,
  vibes?: string[],
  city?: string,
  limit: number = 20
): Promise<Location[]> => {
  try {
    let query = supabase
      .from('locations')
      .select('*')
      .limit(limit);

    // Filter by vibes if provided
    if (vibes && vibes.length > 0) {
      query = query.overlaps('vibes', vibes);
    }

    // Filter by city if provided
    if (city) {
      query = query.eq('city', city);
    }

    // Order by rating and expert picks
    query = query.order('is_expert_pick', { ascending: false });
    query = query.order('rating', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

// ============================================================================
// SAVE/WISHLIST API
// ============================================================================

/**
 * Save a location to user's wishlist
 */
export const saveLocation = async (
  userId: string,
  locationId: string
): Promise<Save | null> => {
  try {
    const { data, error } = await supabase
      .from('saves')
      .insert({ user_id: userId, location_id: locationId })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};

/**
 * Unsave a location from user's wishlist
 */
export const unsaveLocation = async (
  userId: string,
  locationId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('saves')
      .delete()
      .eq('user_id', userId)
      .eq('location_id', locationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error unsaving location:', error);
    throw error;
  }
};

/**
 * Get user's saved locations
 */
export const getSavedLocations = async (
  userId: string
): Promise<SaveWithLocation[]> => {
  try {
    const { data, error } = await supabase
      .from('saves')
      .select(
        `
        *,
        location:locations(*)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    throw error;
  }
};

/**
 * Check if a location is saved by user
 */
export const isLocationSaved = async (
  userId: string,
  locationId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('saves')
      .select('id')
      .eq('user_id', userId)
      .eq('location_id', locationId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
    return !!data;
  } catch (error) {
    console.error('Error checking if location is saved:', error);
    return false;
  }
};

// ============================================================================
// LIST API
// ============================================================================

/**
 * Create a new list
 */
export const createList = async (
  userId: string,
  name: string,
  description?: string,
  privacy: 'private' | 'public' | 'shared' = 'private'
): Promise<List | null> => {
  try {
    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: userId,
        name,
        description,
        privacy,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

/**
 * Get user's lists
 */
export const getUserLists = async (userId: string): Promise<List[]> => {
  try {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};

/**
 * Add location to list
 */
export const addLocationToList = async (
  listId: string,
  locationId: string,
  userId: string
): Promise<void> => {
  try {
    const { error } = await supabase.from('list_items').insert({
      list_id: listId,
      location_id: locationId,
      added_by: userId,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding location to list:', error);
    throw error;
  }
};

/**
 * Remove location from list
 */
export const removeLocationFromList = async (
  listId: string,
  locationId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('list_id', listId)
      .eq('location_id', locationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing location from list:', error);
    throw error;
  }
};

// ============================================================================
// USER API
// ============================================================================

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Create user profile (called after auth signup)
 */
export const createUserProfile = async (
  userId: string,
  email: string,
  name?: string,
  avatarUrl?: string,
  preferredVibes?: string[]
): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        name,
        avatar_url: avatarUrl,
        preferred_vibes: preferredVibes || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};
