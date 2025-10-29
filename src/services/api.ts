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
  RecommendationRequest,
  RecommendationRequestWithUser,
  CreateRequestData,
  Suggestion,
  SuggestionWithUser,
  CreateSuggestionData,
  Message,
  MessageWithUsers,
  CreateMessageData,
  Notification,
  NotificationWithUser,
  SavedPlace,
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

    (data as Array<{ id: string; name: string; city: string; category: string }>)?.forEach((location) => {
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
  _userId?: string,
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
      .insert({ user_id: userId, location_id: locationId } as any)
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
      } as any)
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
    } as any);

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
      // @ts-ignore - Supabase type inference issue with partial updates
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
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// ============================================================================
// RECOMMENDATION REQUEST API
// ============================================================================

/**
 * Create a new recommendation request
 */
export const createRequest = async (
  userId: string,
  data: CreateRequestData
): Promise<RecommendationRequest | null> => {
  try {
    const { data: request, error } = await supabase
      .from('recommendation_requests')
      .insert({
        user_id: userId,
        ...data,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return request;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

/**
 * Get all open requests (with optional filters)
 */
export const getRequests = async (
  filters?: {
    city?: string;
    status?: 'open' | 'resolved' | 'closed';
    user_id?: string;
  },
  page: number = 1,
  limit: number = 20
): Promise<{ requests: RecommendationRequestWithUser[]; total: number; has_more: boolean }> => {
  try {
    let query = supabase
      .from('request_feed')
      .select('*', { count: 'exact' });

    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform view data to match RequestWithUser type
    const requests: RecommendationRequestWithUser[] = (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      city: row.city,
      area: row.area,
      title: row.title,
      description: row.description,
      vibe_preferences: row.vibe_preferences,
      place_type: row.place_type,
      budget_level: row.budget_level,
      time_constraints: row.time_constraints,
      accessibility_needs: row.accessibility_needs,
      group_size: row.group_size,
      status: row.status,
      suggestions_count: row.suggestions_count,
      views_count: row.views_count,
      image_url: row.image_url,
      expires_at: row.expires_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      requester: {
        id: row.user_id,
        name: row.requester_name,
        username: row.requester_username,
        avatar_url: row.requester_avatar,
        instagram_handle: row.requester_instagram,
        is_local: false,
        verified_local: false,
      },
    }));

    return {
      requests,
      total: count || 0,
      has_more: count ? offset + limit < count : false,
    };
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

/**
 * Get a single request by ID
 */
export const getRequestById = async (
  id: string
): Promise<RecommendationRequestWithUser | null> => {
  try {
    const { data, error } = await supabase
      .from('request_feed')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Transform view data
    return {
      id: data.id,
      user_id: data.user_id,
      city: data.city,
      area: data.area,
      title: data.title,
      description: data.description,
      vibe_preferences: data.vibe_preferences,
      place_type: data.place_type,
      budget_level: data.budget_level,
      time_constraints: data.time_constraints,
      accessibility_needs: data.accessibility_needs,
      group_size: data.group_size,
      status: data.status,
      suggestions_count: data.suggestions_count,
      views_count: data.views_count,
      image_url: data.image_url,
      expires_at: data.expires_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
      requester: {
        id: data.user_id,
        name: data.requester_name,
        username: data.requester_username,
        avatar_url: data.requester_avatar,
        instagram_handle: data.requester_instagram,
        is_local: false,
        verified_local: false,
      },
    };
  } catch (error) {
    console.error('Error fetching request:', error);
    throw error;
  }
};

/**
 * Update a request
 */
export const updateRequest = async (
  id: string,
  updates: Partial<CreateRequestData>
): Promise<RecommendationRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('recommendation_requests')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};

/**
 * Close a request (mark as resolved or closed)
 */
export const closeRequest = async (
  id: string,
  status: 'resolved' | 'closed' = 'closed'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('recommendation_requests')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error closing request:', error);
    throw error;
  }
};

// ============================================================================
// SUGGESTION API
// ============================================================================

/**
 * Create a new suggestion
 */
export const createSuggestion = async (
  userId: string,
  data: CreateSuggestionData
): Promise<Suggestion | null> => {
  try {
    const { data: suggestion, error } = await supabase
      .from('suggestions')
      .insert({
        user_id: userId,
        ...data,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return suggestion;
  } catch (error) {
    console.error('Error creating suggestion:', error);
    throw error;
  }
};

/**
 * Get suggestions for a request
 */
export const getSuggestionsForRequest = async (
  requestId: string
): Promise<SuggestionWithUser[]> => {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select(`
        *,
        suggester:users!user_id(id, name, username, avatar_url, instagram_handle, is_local, verified_local)
      `)
      .eq('request_id', requestId)
      .order('helpful_count', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

/**
 * Mark suggestion as helpful
 */
export const markSuggestionHelpful = async (
  suggestionId: string,
  isHelpful: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('suggestions')
      .update({ was_helpful: isHelpful })
      .eq('id', suggestionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking suggestion helpful:', error);
    throw error;
  }
};

/**
 * Rate a suggestion (only by request owner)
 */
export const rateSuggestion = async (
  suggestionId: string,
  rating: number,
  feedback?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('suggestions')
      .update({
        rating,
        traveler_feedback: feedback,
        was_tried: true,
      })
      .eq('id', suggestionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error rating suggestion:', error);
    throw error;
  }
};

// ============================================================================
// MESSAGE API
// ============================================================================

/**
 * Send a message
 */
export const sendMessage = async (
  senderId: string,
  data: CreateMessageData
): Promise<Message | null> => {
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        ...data,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Get messages for a request
 */
export const getMessagesForRequest = async (
  requestId: string
): Promise<MessageWithUsers[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(id, name, username, avatar_url, instagram_handle, is_local, verified_local),
        receiver:users!receiver_id(id, name, username, avatar_url, instagram_handle, is_local, verified_local)
      `)
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// ============================================================================
// NOTIFICATION API
// ============================================================================

/**
 * Get user's notifications
 */
export const getNotifications = async (
  userId: string,
  unreadOnly: boolean = false
): Promise<NotificationWithUser[]> => {
  try {
    let query = supabase
      .from('notifications')
      .select(`
        *,
        from_user:users!from_user_id(id, name, username, avatar_url, instagram_handle, is_local, verified_local)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data as any) || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// ============================================================================
// SAVED PLACES API
// ============================================================================

/**
 * Save a place from a suggestion
 */
export const savePlaceFromSuggestion = async (
  userId: string,
  suggestionId: string,
  notes?: string
): Promise<SavedPlace | null> => {
  try {
    // First get the suggestion details
    const { data: suggestion, error: suggError } = await supabase
      .from('suggestions')
      .select('place_name, place_address, place_latitude, place_longitude, google_place_id')
      .eq('id', suggestionId)
      .single();

    if (suggError) throw suggError;

    const { data, error } = await supabase
      .from('saved_places')
      .insert({
        user_id: userId,
        suggestion_id: suggestionId,
        place_name: suggestion.place_name,
        place_address: suggestion.place_address,
        place_latitude: suggestion.place_latitude,
        place_longitude: suggestion.place_longitude,
        google_place_id: suggestion.google_place_id,
        notes,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving place:', error);
    throw error;
  }
};

/**
 * Get user's saved places
 */
export const getSavedPlaces = async (userId: string): Promise<SavedPlace[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching saved places:', error);
    throw error;
  }
};

/**
 * Remove a saved place
 */
export const removeSavedPlace = async (
  userId: string,
  placeId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('saved_places')
      .delete()
      .eq('id', placeId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing saved place:', error);
    throw error;
  }
};
