-- ============================================================================
-- SUPABASE AUTHENTICATION SETUP
-- Run this SQL in your Supabase SQL Editor to enable proper user signup
-- ============================================================================

-- Step 1: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  instagram_handle TEXT,
  city TEXT,

  -- Instagram Integration
  instagram_access_token TEXT,
  instagram_user_id TEXT,
  instagram_username TEXT,
  instagram_token_expires_at TIMESTAMP WITH TIME ZONE,
  instagram_photos TEXT[],

  -- Preferences
  preferred_vibes TEXT[] DEFAULT '{}',

  -- Local expertise
  is_local BOOLEAN DEFAULT false,
  local_cities TEXT[] DEFAULT '{}',
  years_in_city INTEGER,
  expertise_tags TEXT[] DEFAULT '{}',

  -- Reputation
  total_suggestions INTEGER DEFAULT 0,
  helpful_suggestions INTEGER DEFAULT 0,
  response_rate DECIMAL DEFAULT 0,
  avg_rating DECIMAL,
  verified_local BOOLEAN DEFAULT false,

  -- Timestamps
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies for users table
-- Allow users to read all profiles
CREATE POLICY "Users can view all profiles"
  ON public.users
  FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (needed for trigger)
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 4: Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_instagram_user_id ON public.users(instagram_user_id);

-- Step 7: Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.users;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify the setup worked:
-- ============================================================================

-- Check if trigger exists
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check if function exists
-- SELECT * FROM pg_proc WHERE proname = 'handle_new_user';

-- Check if policies exist
-- SELECT * FROM pg_policies WHERE tablename = 'users';

-- ============================================================================
-- DONE!
-- Your Supabase authentication should now work properly.
-- Users will automatically get a profile created when they sign up.
-- ============================================================================
