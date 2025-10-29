-- ============================================================================
-- BuyaReco Migration to Unified Schema
-- This safely migrates from the old schema to the unified schema
-- Execute this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- UPDATE USERS TABLE (Add new columns for P2P features)
-- ============================================================================

-- Add new columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_local BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS local_cities TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS years_in_city INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise_tags TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_suggestions INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS helpful_suggestions INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS response_rate DECIMAL(5, 2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3, 2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_local BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add constraint if it doesn't exist
DO $$ BEGIN
  ALTER TABLE users ADD CONSTRAINT users_avg_rating_check CHECK (avg_rating >= 0 AND avg_rating <= 5);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_users_local_cities ON users USING GIN(local_cities);
CREATE INDEX IF NOT EXISTS idx_users_is_local ON users(is_local);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================================================
-- CREATE LOCATIONS TABLE (if it doesn't exist)
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

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Locations are publicly readable" ON locations;
CREATE POLICY "Locations are publicly readable"
  ON locations FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert locations" ON locations;
CREATE POLICY "Authenticated users can insert locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_vibes ON locations USING GIN(vibes);
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations(category);
CREATE INDEX IF NOT EXISTS idx_locations_rating ON locations(rating DESC);
CREATE INDEX IF NOT EXISTS idx_locations_expert_pick ON locations(is_expert_pick);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations(latitude, longitude);

-- ============================================================================
-- CREATE NEW P2P TABLES
-- ============================================================================

-- RECOMMENDATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS recommendation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  area TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  vibe_preferences TEXT[] DEFAULT '{}',
  place_type TEXT,
  budget_level INTEGER CHECK (budget_level >= 1 AND budget_level <= 4),
  time_constraints TEXT,
  accessibility_needs TEXT,
  group_size INTEGER,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
  suggestions_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  image_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE recommendation_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Open requests are publicly readable" ON recommendation_requests;
CREATE POLICY "Open requests are publicly readable"
  ON recommendation_requests FOR SELECT
  TO public
  USING (status = 'open' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create requests" ON recommendation_requests;
CREATE POLICY "Authenticated users can create requests"
  ON recommendation_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own requests" ON recommendation_requests;
CREATE POLICY "Users can update own requests"
  ON recommendation_requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_requests_city ON recommendation_requests(city);
CREATE INDEX IF NOT EXISTS idx_requests_status ON recommendation_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_user ON recommendation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_created ON recommendation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_vibe ON recommendation_requests USING GIN(vibe_preferences);

-- SUGGESTIONS TABLE
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES recommendation_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  place_address TEXT,
  place_latitude DECIMAL(10, 7),
  place_longitude DECIMAL(10, 7),
  google_place_id TEXT,
  location_id UUID REFERENCES locations(id),
  recommendation_text TEXT NOT NULL,
  insider_tips TEXT,
  best_time_to_visit TEXT,
  photos TEXT[] DEFAULT '{}',
  was_helpful BOOLEAN,
  was_tried BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  traveler_feedback TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Suggestions are publicly readable" ON suggestions;
CREATE POLICY "Suggestions are publicly readable"
  ON suggestions FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create suggestions" ON suggestions;
CREATE POLICY "Authenticated users can create suggestions"
  ON suggestions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own suggestions" ON suggestions;
CREATE POLICY "Users can update own suggestions"
  ON suggestions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Request owners can rate suggestions" ON suggestions;
CREATE POLICY "Request owners can rate suggestions"
  ON suggestions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM recommendation_requests
      WHERE recommendation_requests.id = suggestions.request_id
      AND recommendation_requests.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_suggestions_request ON suggestions(request_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_user ON suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_location ON suggestions(location_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_created ON suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_helpful ON suggestions(helpful_count DESC);

-- SAVED PLACES TABLE
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

ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own saved places" ON saved_places;
CREATE POLICY "Users can read own saved places"
  ON saved_places FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save places" ON saved_places;
CREATE POLICY "Users can save places"
  ON saved_places FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete saved places" ON saved_places;
CREATE POLICY "Users can delete saved places"
  ON saved_places FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_places_user ON saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_suggestion ON saved_places(suggestion_id);

-- MESSAGES TABLE
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

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own messages" ON messages;
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update received messages" ON messages;
CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE INDEX IF NOT EXISTS idx_messages_request ON messages(request_id);
CREATE INDEX IF NOT EXISTS idx_messages_suggestion ON messages(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- NOTIFICATIONS TABLE
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
  request_id UUID REFERENCES recommendation_requests(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

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
  SELECT user_id INTO request_owner_id
  FROM recommendation_requests
  WHERE id = NEW.request_id;

  SELECT name INTO suggester_name
  FROM users
  WHERE id = NEW.user_id;

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
-- VIEWS
-- ============================================================================

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
-- MIGRATION COMPLETE
-- ============================================================================
