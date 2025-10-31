// BuyaReco Type Definitions
// Based on competitive research report database schema

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type Vibe =
  | 'lowkey'
  | 'adventure'
  | 'romantic'
  | 'nightlife'
  | 'photogenic'
  | 'trending';

export type Category =
  | 'restaurant'
  | 'bar'
  | 'cafe'
  | 'attraction'
  | 'park'
  | 'beach'
  | 'museum'
  | 'nightclub'
  | 'viewpoint'
  | 'activity'
  | 'other';

export type PriceLevel = 1 | 2 | 3 | 4; // $, $$, $$$, $$$$

export type ExpertStatus = 'pending' | 'approved' | 'verified';

export type ListPrivacy = 'private' | 'public' | 'shared';

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  instagram_handle: string | null;
  city?: string; // Added for profile compatibility

  // Preferences (for travelers)
  preferred_vibes: Vibe[] | string[]; // Allow string[] for compatibility

  // Local expertise (for locals)
  is_local: boolean;
  local_cities: string[];
  years_in_city: number | null;
  expertise_tags: string[];

  // Reputation
  total_suggestions: number;
  helpful_suggestions: number;
  reputation_score?: number; // Added for profile compatibility
  suggestions_count?: number; // Alias for total_suggestions
  helpful_suggestions_count?: number; // Alias for helpful_suggestions
  response_rate: number;
  avg_rating: number | null;
  verified_local: boolean;

  // Activity
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  is_expert: boolean;
  saved_count: number;
  list_count: number;
  review_count: number;
}

export interface UserCard {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  instagram_handle: string | null;
  is_local: boolean;
  verified_local: boolean;
}

// ============================================================================
// LOCATION TYPES
// ============================================================================

export interface Location {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  vibes: Vibe[];
  category: Category;
  price_level: PriceLevel | null;
  rating: number | null;
  photos: string[];
  hours: OpeningHours | null;
  is_expert_pick: boolean;
  created_at: string;
}

export interface LocationWithDistance extends Location {
  distance?: number; // Distance in miles from user
}

export interface LocationCard {
  id: string;
  name: string;
  city: string;
  vibes: Vibe[];
  category: Category;
  price_level: PriceLevel | null;
  rating: number | null;
  thumbnail: string | null;
  is_expert_pick: boolean;
  save_count?: number;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // "09:00"
  close: string; // "22:00"
  is_closed?: boolean;
}

// ============================================================================
// SAVE/WISHLIST TYPES
// ============================================================================

export interface Save {
  id: string;
  user_id: string;
  location_id: string;
  created_at: string;
}

export interface SaveWithLocation extends Save {
  location: LocationCard;
}

// ============================================================================
// LIST/COLLECTION TYPES
// ============================================================================

export interface List {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  privacy: ListPrivacy;
  created_at: string;
}

export interface ListWithItems extends List {
  items: ListItem[];
  item_count: number;
}

export interface ListItem {
  id: string;
  list_id: string;
  location_id: string;
  added_by: string;
  created_at: string;
}

export interface ListItemWithLocation extends ListItem {
  location: LocationCard;
}

// ============================================================================
// EXPERT TYPES
// ============================================================================

export interface Expert {
  id: string;
  user_id: string;
  status: ExpertStatus;
  specialties: Vibe[];
  cities: string[];
  recommendation_count: number;
  average_rating: number | null;
  created_at: string;
}

export interface ExpertProfile extends Expert {
  user: User;
  bio?: string;
  verified_badge: boolean;
}

// ============================================================================
// REVIEW TYPES (Phase 2)
// ============================================================================

export interface Review {
  id: string;
  user_id: string;
  location_id: string;
  rating: number; // 1-5
  text: string | null;
  photos: string[];
  helpful_count: number;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  user: Pick<User, 'id' | 'name' | 'avatar_url'>;
}

// ============================================================================
// FOLLOW TYPES (Phase 2)
// ============================================================================

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// ============================================================================
// P2P RECOMMENDATION TYPES
// ============================================================================

export type RequestStatus = 'open' | 'resolved' | 'closed';

export interface RecommendationRequest {
  id: string;
  user_id: string;

  // Location details
  city: string;
  area: string | null;

  // Request details
  title: string;
  description: string;
  vibe_preferences: string[];
  place_type: string | null;

  // Constraints
  budget_level: PriceLevel | null;
  time_constraints: string | null;
  accessibility_needs: string | null;
  group_size: number | null;

  // Metadata
  status: RequestStatus;
  suggestions_count: number;
  views_count: number;
  image_url: string | null;
  expires_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface RecommendationRequestWithUser extends RecommendationRequest {
  requester: UserCard;
}

export interface CreateRequestData {
  city: string;
  area?: string;
  title: string;
  description: string;
  vibe_preferences: string[];
  place_type?: string;
  budget_level?: PriceLevel;
  time_constraints?: string;
  accessibility_needs?: string;
  group_size?: number;
  image_url?: string;
}

// ============================================================================
// SUGGESTION TYPES
// ============================================================================

export interface Suggestion {
  id: string;
  request_id: string;
  user_id: string;

  // Suggestion details
  place_name: string;
  place_address: string | null;
  place_latitude: number | null;
  place_longitude: number | null;
  google_place_id: string | null;
  location_id: string | null;

  // Why it matches
  recommendation_text: string;
  insider_tips: string | null;
  best_time_to_visit: string | null;
  photos: string[];

  // Feedback from traveler
  was_helpful: boolean | null;
  was_tried: boolean;
  rating: number | null; // 1-5
  traveler_feedback: string | null;

  // Metadata
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface SuggestionWithUser extends Suggestion {
  suggester: UserCard;
}

export interface CreateSuggestionData {
  request_id: string;
  place_name: string;
  place_address?: string;
  place_latitude?: number;
  place_longitude?: number;
  google_place_id?: string;
  location_id?: string;
  recommendation_text: string;
  insider_tips?: string;
  best_time_to_visit?: string;
  photos?: string[];
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface Message {
  id: string;
  request_id: string;
  suggestion_id: string | null;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageWithUsers extends Message {
  sender: UserCard;
  receiver: UserCard;
}

export interface CreateMessageData {
  request_id: string;
  suggestion_id?: string;
  receiver_id: string;
  content: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | 'new_request_in_city'
  | 'new_suggestion'
  | 'suggestion_helpful'
  | 'message_received'
  | 'suggestion_tried'
  | 'new_follower';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;

  // Related entities
  request_id: string | null;
  suggestion_id: string | null;
  message_id: string | null;
  from_user_id: string | null;

  is_read: boolean;
  created_at: string;
}

export interface NotificationWithUser extends Notification {
  from_user: UserCard | null;
}

// ============================================================================
// SAVED PLACES TYPES
// ============================================================================

export interface SavedPlace {
  id: string;
  user_id: string;
  suggestion_id: string | null;
  place_name: string;
  place_address: string | null;
  place_latitude: number | null;
  place_longitude: number | null;
  google_place_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface SavedPlaceWithSuggestion extends SavedPlace {
  suggestion: Suggestion | null;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface SearchFilters {
  query?: string;
  vibes?: Vibe[];
  city?: string;
  category?: Category;
  price_level?: PriceLevel[];
  rating_min?: number;
  distance_max?: number; // miles
  open_now?: boolean;
  expert_picks_only?: boolean;
}

export interface SearchResults {
  locations: LocationWithDistance[];
  total: number;
  page: number;
  has_more: boolean;
}

export interface AutocompleteResult {
  type: 'location' | 'city' | 'category';
  id: string;
  name: string;
  subtitle?: string;
  icon?: string;
}

// ============================================================================
// RECOMMENDATION TYPES
// ============================================================================

export interface RecommendationParams {
  user_id?: string;
  vibes?: Vibe[];
  city?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export type OAuthProvider = 'google' | 'apple';

// ============================================================================
// ONBOARDING TYPES
// ============================================================================

export interface OnboardingData {
  preferred_vibes: Vibe[];
  home_city?: string;
  interests?: Category[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// ============================================================================
// MAP TYPES
// ============================================================================

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  location: LocationCard;
}

export interface MapCluster {
  latitude: number;
  longitude: number;
  count: number;
  locations: LocationCard[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ViewMode = 'list' | 'map' | 'grid';

export type SortOption =
  | 'relevance'
  | 'distance'
  | 'rating'
  | 'price_low'
  | 'price_high'
  | 'newest';
