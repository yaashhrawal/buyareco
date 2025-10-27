/**
 * Utility helper functions
 */

import type { Vibe, PriceLevel, Category } from '../types';

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Format price level as dollar signs
 */
export const formatPriceLevel = (level: PriceLevel | null): string => {
  if (!level) return '-';
  return '$'.repeat(level);
};

/**
 * Format rating as stars
 */
export const formatRating = (rating: number | null): string => {
  if (!rating) return 'No rating';
  return `${rating.toFixed(1)} ⭐`;
};

/**
 * Format distance in miles
 */
export const formatDistance = (miles: number): string => {
  if (miles < 0.1) return 'Nearby';
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`;
  return `${miles.toFixed(1)} mi`;
};

/**
 * Format large numbers (e.g., 1000 → 1K)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

// ============================================================================
// VIBE HELPERS
// ============================================================================

/**
 * Get vibe display name
 */
export const getVibeDisplayName = (vibe: Vibe): string => {
  const names: Record<Vibe, string> = {
    lowkey: 'Lowkey',
    adventure: 'Adventure',
    romantic: 'Romantic',
    nightlife: 'Nightlife',
    photogenic: 'Photogenic',
    trending: 'Trending',
  };
  return names[vibe];
};

/**
 * Get vibe color gradient
 */
export const getVibeGradient = (vibe: Vibe): string => {
  const gradients: Record<Vibe, string> = {
    lowkey: 'from-sky-400 to-blue-600',
    adventure: 'from-orange-400 to-red-600',
    romantic: 'from-pink-400 to-rose-600',
    nightlife: 'from-purple-400 to-indigo-600',
    photogenic: 'from-amber-400 to-yellow-600',
    trending: 'from-emerald-400 to-green-600',
  };
  return gradients[vibe];
};

/**
 * Get vibe emoji
 */
export const getVibeEmoji = (vibe: Vibe): string => {
  const emojis: Record<Vibe, string> = {
    lowkey: '😌',
    adventure: '🏔️',
    romantic: '💕',
    nightlife: '🎉',
    photogenic: '📸',
    trending: '🔥',
  };
  return emojis[vibe];
};

// ============================================================================
// CATEGORY HELPERS
// ============================================================================

/**
 * Get category display name
 */
export const getCategoryDisplayName = (category: Category): string => {
  const names: Record<Category, string> = {
    restaurant: 'Restaurant',
    bar: 'Bar',
    cafe: 'Café',
    attraction: 'Attraction',
    park: 'Park',
    beach: 'Beach',
    museum: 'Museum',
    nightclub: 'Nightclub',
    viewpoint: 'Viewpoint',
    activity: 'Activity',
    other: 'Other',
  };
  return names[category];
};

/**
 * Get category icon (emoji)
 */
export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    restaurant: '🍽️',
    bar: '🍸',
    cafe: '☕',
    attraction: '🎭',
    park: '🌳',
    beach: '🏖️',
    museum: '🏛️',
    nightclub: '💃',
    viewpoint: '🌅',
    activity: '🎯',
    other: '📍',
  };
  return icons[category];
};

// ============================================================================
// SEARCH HELPERS
// ============================================================================

/**
 * Sanitize search query to prevent SQL injection
 * Escapes special characters used in Supabase queries
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query) return '';
  // Escape special characters: %, _, and comma
  return query.replace(/[%_,]/g, '\\$&').trim();
};

/**
 * Debounce function for search input
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Highlight search query in text
 */
export const highlightQuery = (text: string, query: string): string => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// ============================================================================
// GEOLOCATION HELPERS
// ============================================================================

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Get user's current location
 */
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
};

// ============================================================================
// URL HELPERS
// ============================================================================

/**
 * Build search URL with filters
 */
export const buildSearchUrl = (params: {
  query?: string;
  vibes?: Vibe[];
  city?: string;
  category?: Category;
}): string => {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('q', params.query);
  if (params.vibes && params.vibes.length > 0) {
    searchParams.set('vibes', params.vibes.join(','));
  }
  if (params.city) searchParams.set('city', params.city);
  if (params.category) searchParams.set('category', params.category);
  return `/search?${searchParams.toString()}`;
};

/**
 * Parse vibes from URL parameter
 */
export const parseVibesFromUrl = (vibesParam: string | null): Vibe[] => {
  if (!vibesParam) return [];
  return vibesParam.split(',').filter((v) => isValidVibe(v)) as Vibe[];
};

const isValidVibe = (value: string): value is Vibe => {
  return ['lowkey', 'adventure', 'romantic', 'nightlife', 'photogenic', 'trending'].includes(
    value
  );
};

// ============================================================================
// IMAGE HELPERS
// ============================================================================

/**
 * Get first photo or placeholder
 */
export const getLocationThumbnail = (photos: string[]): string => {
  return photos[0] || 'https://via.placeholder.com/400x300?text=No+Image';
};

/**
 * Generate Unsplash placeholder based on category
 */
export const getPlaceholderImage = (category: Category): string => {
  const keywords: Record<Category, string> = {
    restaurant: 'restaurant,food',
    bar: 'bar,cocktail',
    cafe: 'cafe,coffee',
    attraction: 'landmark,attraction',
    park: 'park,nature',
    beach: 'beach,ocean',
    museum: 'museum,art',
    nightclub: 'nightclub,party',
    viewpoint: 'viewpoint,cityscape',
    activity: 'activity,adventure',
    other: 'city,urban',
  };
  const width = 400;
  const height = 300;
  return `https://source.unsplash.com/${width}x${height}/?${keywords[category]}`;
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength with detailed feedback
 * @returns Object with validation result and error message if invalid
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

/**
 * Check if password meets minimum strength requirements (for backwards compatibility)
 */
export const isStrongPassword = (password: string): boolean => {
  return validatePassword(password).valid;
};

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

/**
 * Save to local storage with JSON serialization
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load from local storage with JSON deserialization
 */
export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Remove from local storage
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// ============================================================================
// ARRAY HELPERS
// ============================================================================

/**
 * Shuffle array (Fisher-Yates)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random items from array
 */
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
};

/**
 * Group array by key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item],
    };
  }, {} as Record<string, T[]>);
};
