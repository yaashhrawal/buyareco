/**
 * Instagram Basic Display API Integration
 * Allows users to connect their Instagram and display photos
 */

import { supabase } from './supabase';

// Instagram API configuration
const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID || '';
const INSTAGRAM_APP_SECRET = import.meta.env.VITE_INSTAGRAM_APP_SECRET || '';
const REDIRECT_URI = `${window.location.origin}/instagram/callback`;

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramProfile {
  id: string;
  username: string;
  media_count: number;
  account_type: string;
}

// ============================================================================
// OAUTH FLOW
// ============================================================================

/**
 * Start Instagram OAuth flow
 * Redirects user to Instagram authorization page
 */
export const connectInstagram = () => {
  const authUrl = new URL('https://api.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', INSTAGRAM_APP_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'user_profile,user_media');
  authUrl.searchParams.set('response_type', 'code');

  // Redirect to Instagram
  window.location.href = authUrl.toString();
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForToken = async (code: string) => {
  try {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_message || 'Failed to exchange code for token');
    }

    return {
      access_token: data.access_token,
      user_id: data.user_id,
    };
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Exchange short-lived token for long-lived token (60 days)
 */
export const getLongLivedToken = async (shortLivedToken: string) => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/access_token?` +
      `grant_type=ig_exchange_token&` +
      `client_secret=${INSTAGRAM_APP_SECRET}&` +
      `access_token=${shortLivedToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get long-lived token');
    }

    return {
      access_token: data.access_token,
      expires_in: data.expires_in, // Usually 5184000 seconds (60 days)
    };
  } catch (error) {
    console.error('Error getting long-lived token:', error);
    throw error;
  }
};

// ============================================================================
// API CALLS
// ============================================================================

/**
 * Fetch user's Instagram profile
 */
export const fetchInstagramProfile = async (accessToken: string): Promise<InstagramProfile> => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    throw error;
  }
};

/**
 * Fetch user's Instagram media (photos/videos)
 * @param limit - Number of media items to fetch (max 25)
 */
export const fetchInstagramMedia = async (
  accessToken: string,
  limit: number = 6
): Promise<InstagramMedia[]> => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?` +
      `fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&` +
      `limit=${limit}&` +
      `access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch media');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
};

/**
 * Refresh long-lived token (should be done before it expires)
 */
export const refreshAccessToken = async (accessToken: string) => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/refresh_access_token?` +
      `grant_type=ig_refresh_token&` +
      `access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to refresh token');
    }

    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Save Instagram connection to database
 */
export const saveInstagramConnection = async (
  userId: string,
  accessToken: string,
  instagramUserId: string,
  username: string,
  expiresIn: number
) => {
  try {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    // Instagram fields will be added to database schema - using type assertion
    const { error } = await (supabase
      .from('users') as any)
      .update({
        instagram_access_token: accessToken,
        instagram_user_id: instagramUserId,
        instagram_username: username,
        instagram_token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving Instagram connection:', error);
    throw error;
  }
};

/**
 * Save Instagram photos to database (for caching)
 */
export const saveInstagramPhotos = async (userId: string, photos: InstagramMedia[]) => {
  try {
    const photoUrls = photos.map(photo =>
      photo.media_type === 'VIDEO' ? photo.thumbnail_url : photo.media_url
    ).filter(Boolean);

    // Instagram fields will be added to database schema - using type assertion
    const { error } = await (supabase
      .from('users') as any)
      .update({
        instagram_photos: photoUrls,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving Instagram photos:', error);
    throw error;
  }
};

/**
 * Disconnect Instagram from user account
 */
export const disconnectInstagram = async (userId: string) => {
  try {
    // Instagram fields will be added to database schema - using type assertion
    const { error } = await (supabase
      .from('users') as any)
      .update({
        instagram_access_token: null,
        instagram_user_id: null,
        instagram_username: null,
        instagram_token_expires_at: null,
        instagram_photos: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error disconnecting Instagram:', error);
    throw error;
  }
};

/**
 * Check if Instagram token needs refresh (within 7 days of expiry)
 */
export const shouldRefreshToken = (expiresAt: string): boolean => {
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  return daysUntilExpiry <= 7;
};

// ============================================================================
// COMPLETE FLOW HELPERS
// ============================================================================

/**
 * Complete Instagram connection flow
 * Call this after receiving the OAuth code
 */
export const completeInstagramConnection = async (userId: string, code: string) => {
  try {
    // 1. Exchange code for short-lived token
    const { access_token: shortToken, user_id: igUserId } = await exchangeCodeForToken(code);

    // 2. Exchange for long-lived token
    const { access_token: longToken, expires_in } = await getLongLivedToken(shortToken);

    // 3. Fetch profile to get username
    const profile = await fetchInstagramProfile(longToken);

    // 4. Save to database
    await saveInstagramConnection(userId, longToken, igUserId, profile.username, expires_in);

    // 5. Fetch and save top 6 photos
    const media = await fetchInstagramMedia(longToken, 6);
    await saveInstagramPhotos(userId, media);

    return {
      success: true,
      username: profile.username,
      photoCount: media.length,
    };
  } catch (error) {
    console.error('Error completing Instagram connection:', error);
    throw error;
  }
};
