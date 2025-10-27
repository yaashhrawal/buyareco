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
  avatar_url: string | null;
  preferred_vibes: Vibe[];
  created_at: string;
}

export interface UserProfile extends User {
  is_expert: boolean;
  saved_count: number;
  list_count: number;
  review_count: number;
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
