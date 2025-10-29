-- ============================================================================
-- BuyaReco Unified Database Schema
-- Combines location discovery + P2P recommendation system
-- Execute this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE (Extended for both travelers and locals)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  instagram_handle TEXT,

  -- Local expertise (for locals offering recommendations)
  is_local BOOLEAN DEFAULT FALSE,
  local_cities TEXT[] DEFAULT '{}', -- Cities where user is a local
  years_in_city INTEGER, -- Years lived in primary city
  expertise_tags TEXT[] DEFAULT '{}', -- cafes, nightlife, culture, food, etc.

  -- Preferences (for travelers)
  preferred_vibes TEXT[] DEFAULT '{}', -- User's preferred vibes

  -- Reputation system
  total_suggestions INTEGER DEFAULT 0,
  helpful_suggestions INTEGER DEFAULT 0,
  response_rate DECIMAL(5, 2) DEFAULT 0, -- Percentage
  avg_rating DECIMAL(3, 2) CHECK (avg_rating >= 0 AND avg_rating <= 5),
  verified_local BOOLEAN DEFAULT FALSE,

  -- Activity
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Everyone can read public user profiles
CREATE POLICY "User profiles are publicly readable"
  ON users FOR SELECT
  TO public
  USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own data (on signup)
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_local_cities ON users USING GIN(local_cities);
CREATE INDEX IF NOT EXISTS idx_users_is_local ON users(is_local);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================================================
-- LOCATIONS TABLE (Place database - restaurants, cafes, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  vibes TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  photos TEXT[] DEFAULT '{}',
  hours JSONB,
  google_place_id TEXT,
  is_expert_pick BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Everyone can read locations
CREATE POLICY "Locations are publicly readable"
  ON locations FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert locations
CREATE POLICY "Authenticated users can insert locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_vibes ON locations USING GIN(vibes);
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations(category);
CREATE INDEX IF NOT EXISTS idx_locations_rating ON locations(rating DESC);
CREATE INDEX IF NOT EXISTS idx_locations_expert_pick ON locations(is_expert_pick);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations(latitude, longitude);

-- ============================================================================
-- RECOMMENDATION REQUESTS TABLE (Travelers asking for suggestions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS recommendation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Location details
  city TEXT NOT NULL,
  area TEXT, -- Specific neighborhood or area

  -- Request details
  title TEXT NOT NULL, -- e.g., "Need a calm aesthetic cafe in old city"
  description TEXT NOT NULL,
  vibe_preferences TEXT[] DEFAULT '{}', -- calm, aesthetic, vibrant, cozy, etc.
  place_type TEXT, -- cafe, restaurant, bar, park, etc.

  -- Constraints
  budget_level INTEGER CHECK (budget_level >= 1 AND budget_level <= 4),
  time_constraints TEXT, -- "weekend only", "evening", etc.
  accessibility_needs TEXT,
  group_size INTEGER,

  -- Metadata
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
  suggestions_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  image_url TEXT, -- Background/header image for the request
  expires_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE recommendation_requests ENABLE ROW LEVEL SECURITY;

-- Everyone can read open requests
CREATE POLICY "Open requests are publicly readable"
  ON recommendation_requests FOR SELECT
  TO public
  USING (status = 'open' OR auth.uid() = user_id);

-- Authenticated users can create requests
CREATE POLICY "Authenticated users can create requests"
  ON recommendation_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own requests
CREATE POLICY "Users can update own requests"
  ON recommendation_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_requests_city ON recommendation_requests(city);
CREATE INDEX IF NOT EXISTS idx_requests_status ON recommendation_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_user ON recommendation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_created ON recommendation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_vibe ON recommendation_requests USING GIN(vibe_preferences);

-- ============================================================================
-- SUGGESTIONS TABLE (Locals responding to requests)
-- ============================================================================

CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES recommendation_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Suggestion details
  place_name TEXT NOT NULL,
  place_address TEXT,
  place_latitude DECIMAL(10, 7),
  place_longitude DECIMAL(10, 7),
  google_place_id TEXT,
  location_id UUID REFERENCES locations(id), -- Optional: link to existing location

  -- Why it matches
  recommendation_text TEXT NOT NULL,
  insider_tips TEXT,
  best_time_to_visit TEXT,
  photos TEXT[] DEFAULT '{}',

  -- Feedback from traveler
  was_helpful BOOLEAN,
  was_tried BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  traveler_feedback TEXT,

  -- Metadata
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Everyone can read suggestions for public requests
CREATE POLICY "Suggestions are publicly readable"
  ON suggestions FOR SELECT
  TO public
  USING (true);

-- Authenticated users can create suggestions
CREATE POLICY "Authenticated users can create suggestions"
  ON suggestions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own suggestions
CREATE POLICY "Users can update own suggestions"
  ON suggestions FOR UPDATE
  USING (auth.uid() = user_id);

-- Request owners can rate suggestions
CREATE POLICY "Request owners can rate suggestions"
  ON suggestions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM recommendation_requests
      WHERE recommendation_requests.id = suggestions.request_id
      AND recommendation_requests.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suggestions_request ON suggestions(request_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_user ON suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_location ON suggestions(location_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_created ON suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_helpful ON suggestions(helpful_count DESC);

-- ============================================================================
-- SAVES TABLE (Wishlist - for locations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Enable Row Level Security
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

-- Users can read their own saves
CREATE POLICY "Users can read own saves"
  ON saves FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own saves
CREATE POLICY "Users can create own saves"
  ON saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saves
CREATE POLICY "Users can delete own saves"
  ON saves FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saves_user ON saves(user_id);
CREATE INDEX IF NOT EXISTS idx_saves_location ON saves(location_id);

-- ============================================================================
-- SAVED PLACES TABLE (From suggestions - for P2P recommended places)
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE SET NULL,

  place_name TEXT NOT NULL,
  place_address TEXT,
  place_latitude DECIMAL(10, 7),
  place_longitude DECIMAL(10, 7),
  google_place_id TEXT,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

-- Users can read their own saved places
CREATE POLICY "Users can read own saved places"
  ON saved_places FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save places
CREATE POLICY "Users can save places"
  ON saved_places FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their saved places
CREATE POLICY "Users can delete saved places"
  ON saved_places FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saved_places_user ON saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_suggestion ON saved_places(suggestion_id);

-- ============================================================================
-- MESSAGES TABLE (Follow-up conversations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES recommendation_requests(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages they sent or received
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can mark their received messages as read
CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_request ON messages(request_id);
CREATE INDEX IF NOT EXISTS idx_messages_suggestion ON messages(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN (
    'new_request_in_city',
    'new_suggestion',
    'suggestion_helpful',
    'message_received',
    'suggestion_tried',
    'new_follower'
  )),

  title TEXT NOT NULL,
  body TEXT NOT NULL,

  -- Related entities
  request_id UUID REFERENCES recommendation_requests(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can create notifications (for triggers)
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- EXPERTS TABLE (Verified local experts program)
-- ============================================================================

CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'verified')),
  specialties TEXT[] DEFAULT '{}',
  cities TEXT[] DEFAULT '{}',
  recommendation_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) CHECK (average_rating >= 0 AND average_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved/verified experts
CREATE POLICY "Approved experts are publicly readable"
  ON experts FOR SELECT
  USING (status IN ('approved', 'verified'));

-- Users can read their own expert status
CREATE POLICY "Users can read own expert status"
  ON experts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can apply to become experts
CREATE POLICY "Users can create expert application"
  ON experts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_experts_user ON experts(user_id);
CREATE INDEX IF NOT EXISTS idx_experts_status ON experts(status);

-- ============================================================================
-- REVIEWS TABLE (User reviews of locations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  photos TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read reviews
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  TO public
  USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_location ON reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);

-- ============================================================================
-- LISTS TABLE (Custom Collections/Custom Lists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  privacy TEXT NOT NULL DEFAULT 'private' CHECK (privacy IN ('private', 'public', 'shared')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Users can read their own lists
CREATE POLICY "Users can read own lists"
  ON lists FOR SELECT
  USING (auth.uid() = user_id);

-- Everyone can read public lists
CREATE POLICY "Public lists are readable"
  ON lists FOR SELECT
  USING (privacy = 'public');

-- Users can create their own lists
CREATE POLICY "Users can create own lists"
  ON lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own lists
CREATE POLICY "Users can update own lists"
  ON lists FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own lists
CREATE POLICY "Users can delete own lists"
  ON lists FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lists_user ON lists(user_id);
CREATE INDEX IF NOT EXISTS idx_lists_privacy ON lists(privacy);

-- ============================================================================
-- LIST ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, location_id)
);

-- Enable Row Level Security
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

-- Users can read items in their own lists
CREATE POLICY "Users can read items in own lists"
  ON list_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = list_items.list_id
      AND lists.user_id = auth.uid()
    )
  );

-- Everyone can read items in public lists
CREATE POLICY "Public list items are readable"
  ON list_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = list_items.list_id
      AND lists.privacy = 'public'
    )
  );

-- Users can add items to their own lists
CREATE POLICY "Users can add items to own lists"
  ON list_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = list_items.list_id
      AND lists.user_id = auth.uid()
    )
  );

-- Users can delete items from their own lists
CREATE POLICY "Users can delete items from own lists"
  ON list_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = list_items.list_id
      AND lists.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_list_items_list ON list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_list_items_location ON list_items(location_id);

-- ============================================================================
-- FOLLOWS TABLE (User following system)
-- ============================================================================

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable Row Level Security
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Everyone can read follows
CREATE POLICY "Users can read follows"
  ON follows FOR SELECT
  TO public
  USING (true);

-- Users can create their own follows
CREATE POLICY "Users can create own follows"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can delete their own follows
CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update suggestion count on request
CREATE OR REPLACE FUNCTION public.update_request_suggestion_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recommendation_requests
  SET suggestions_count = (
    SELECT COUNT(*) FROM suggestions
    WHERE request_id = NEW.request_id
  )
  WHERE id = NEW.request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update suggestion count
DROP TRIGGER IF EXISTS on_suggestion_created ON suggestions;
CREATE TRIGGER on_suggestion_created
  AFTER INSERT ON suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_request_suggestion_count();

-- Function to create notification when new suggestion is added
CREATE OR REPLACE FUNCTION public.notify_new_suggestion()
RETURNS TRIGGER AS $$
DECLARE
  request_owner_id UUID;
  suggester_name TEXT;
BEGIN
  -- Get request owner
  SELECT user_id INTO request_owner_id
  FROM recommendation_requests
  WHERE id = NEW.request_id;

  -- Get suggester name
  SELECT name INTO suggester_name
  FROM users
  WHERE id = NEW.user_id;

  -- Create notification
  INSERT INTO notifications (user_id, type, title, body, request_id, suggestion_id, from_user_id)
  VALUES (
    request_owner_id,
    'new_suggestion',
    'New recommendation!',
    suggester_name || ' suggested ' || NEW.place_name || ' for your request',
    NEW.request_id,
    NEW.id,
    NEW.user_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new suggestion notification
DROP TRIGGER IF EXISTS on_suggestion_notify ON suggestions;
CREATE TRIGGER on_suggestion_notify
  AFTER INSERT ON suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_suggestion();

-- Function to update user stats when suggestion is rated helpful
CREATE OR REPLACE FUNCTION public.update_user_stats_on_helpful()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.was_helpful = true AND (OLD.was_helpful IS NULL OR OLD.was_helpful = false) THEN
    UPDATE users
    SET helpful_suggestions = helpful_suggestions + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating user stats
DROP TRIGGER IF EXISTS on_suggestion_helpful ON suggestions;
CREATE TRIGGER on_suggestion_helpful
  AFTER UPDATE ON suggestions
  FOR EACH ROW
  WHEN (NEW.was_helpful IS DISTINCT FROM OLD.was_helpful)
  EXECUTE FUNCTION public.update_user_stats_on_helpful();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_requests_updated_at ON recommendation_requests;
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON recommendation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_suggestions_updated_at ON suggestions;
CREATE TRIGGER update_suggestions_updated_at
  BEFORE UPDATE ON suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for request feed with user details
CREATE OR REPLACE VIEW request_feed AS
SELECT
  r.*,
  u.name as requester_name,
  u.username as requester_username,
  u.avatar_url as requester_avatar,
  u.instagram_handle as requester_instagram
FROM recommendation_requests r
JOIN users u ON r.user_id = u.id
WHERE r.status = 'open'
ORDER BY r.created_at DESC;

-- View for user reputation
CREATE OR REPLACE VIEW user_reputation AS
SELECT
  u.id,
  u.name,
  u.username,
  u.avatar_url,
  u.is_local,
  u.local_cities,
  u.years_in_city,
  u.expertise_tags,
  u.total_suggestions,
  u.helpful_suggestions,
  u.response_rate,
  u.avg_rating,
  u.verified_local,
  CASE
    WHEN u.helpful_suggestions >= 50 AND u.avg_rating >= 4.5 THEN 'expert'
    WHEN u.helpful_suggestions >= 20 AND u.avg_rating >= 4.0 THEN 'experienced'
    WHEN u.helpful_suggestions >= 5 THEN 'contributor'
    ELSE 'newcomer'
  END as reputation_level
FROM users u
WHERE u.is_local = true;

-- ============================================================================
-- INITIAL SETUP COMPLETE
-- ============================================================================

-- After running this schema:
-- 1. Configure authentication in Supabase Dashboard
-- 2. Enable email/password auth
-- 3. Configure OAuth providers (Google, Apple, Instagram)
-- 4. Set up storage buckets for photos
-- 5. Add sample data for testing
