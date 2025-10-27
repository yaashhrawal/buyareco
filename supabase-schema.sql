-- BuyaReco Database Schema
-- Based on competitive research report recommendations
-- Execute this in your Supabase SQL Editor

-- ============================================================================
-- ENABLE UUID EXTENSION
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  preferred_vibes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own data (on signup)
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- LOCATIONS TABLE
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

-- Only authenticated users can insert (for future UGC)
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
-- SAVES TABLE (Wishlist)
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
-- EXPERTS TABLE
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
-- REVIEWS TABLE (Phase 2)
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
-- LISTS TABLE (Collections/Custom Lists)
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
-- FOLLOWS TABLE (User following experts/other users)
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

-- Users can read their own follows
CREATE POLICY "Users can read own follows"
  ON follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

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
-- FUNCTIONS
-- ============================================================================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
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

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- You can add sample locations here for testing
-- Example:
/*
INSERT INTO locations (name, description, address, city, latitude, longitude, vibes, category, price_level, rating, photos, is_expert_pick)
VALUES
  (
    'Sunset Rooftop Bar',
    'Amazing sunset views with craft cocktails',
    '123 Main St, Brooklyn, NY 11201',
    'Brooklyn',
    40.6938,
    -73.9900,
    ARRAY['romantic', 'photogenic', 'nightlife'],
    'bar',
    3,
    4.5,
    ARRAY['https://example.com/photo1.jpg'],
    true
  );
*/
