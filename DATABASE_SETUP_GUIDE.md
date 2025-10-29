# BuyaReco Database Setup Guide

## Overview

This guide walks you through setting up the complete BuyaReco database in Supabase with the unified schema that includes:
- **Location database** (restaurants, cafes, places)
- **P2P recommendation system** (requests & suggestions)
- **User profiles** (travelers & locals)
- **Messaging & notifications**
- **Social features** (follows, reviews, lists)

## Schema File

**Use this file:** `supabase-schema-unified.sql`

This consolidates the previous two schemas:
- ~~`supabase-schema.sql`~~ (location-focused - deprecated)
- ~~`supabase-schema-p2p.sql`~~ (P2P-focused - deprecated)

## Database Tables

### Core Tables (15 total)

1. **users** - Extended user profiles with local expertise & reputation
2. **locations** - Place database (restaurants, cafes, etc.)
3. **recommendation_requests** - Traveler requests for recommendations
4. **suggestions** - Local responses to requests
5. **saves** - User wishlist for locations
6. **saved_places** - Saved places from suggestions
7. **messages** - In-app messaging between travelers & locals
8. **notifications** - Real-time notification system
9. **experts** - Verified local expert program
10. **reviews** - User reviews of locations
11. **lists** - Custom place collections
12. **list_items** - Items in custom lists
13. **follows** - User following system

### Key Features

#### Row Level Security (RLS)
- ✅ Enabled on all tables
- ✅ User-scoped access policies
- ✅ Public read for open data
- ✅ Secure write operations

#### Triggers & Automation
- ✅ Auto-create user profile on signup
- ✅ Auto-update suggestion counts
- ✅ Auto-create notifications
- ✅ Auto-update user reputation stats
- ✅ Auto-update `updated_at` timestamps

#### Views
- ✅ `request_feed` - Request feed with user details
- ✅ `user_reputation` - Local expert reputation levels

## Setup Steps

### 1. Create Supabase Project

```bash
1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization
4. Set project name: "buyareco" or "buyareco-prod"
5. Generate strong database password (save it!)
6. Select region closest to your users
7. Choose plan (Free tier is fine for MVP)
8. Click "Create new project"
```

Wait 2-3 minutes for project to initialize.

### 2. Execute Unified Schema

```bash
1. In Supabase Dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy entire contents of supabase-schema-unified.sql
4. Paste into SQL Editor
5. Click "Run" (bottom right)
6. Wait for execution (should take 5-10 seconds)
7. Verify success: Check "Table Editor" - should see 13 tables
```

**Verification Checklist:**
- [ ] 13 tables created
- [ ] RLS enabled on all tables
- [ ] Triggers created (5 total)
- [ ] Views created (2 total)
- [ ] Extensions enabled (uuid-ossp, pgcrypto)

### 3. Configure Authentication

#### Email/Password Auth
```bash
1. Go to "Authentication" → "Providers"
2. Email provider should be enabled by default
3. Settings to configure:
   - ✅ Enable email confirmations (recommended)
   - ✅ Set "Confirm email" to required
   - ✅ Set email templates (optional - customize welcome email)
```

#### Phone Auth (Optional)
```bash
1. Go to "Authentication" → "Providers"
2. Click "Phone"
3. Enable phone provider
4. Choose SMS provider:
   - Twilio (recommended)
   - MessageBird
   - Vonage
5. Add provider credentials
```

#### Google OAuth
```bash
1. Create Google Cloud Project: https://console.cloud.google.com
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - https://<your-project-ref>.supabase.co/auth/v1/callback
5. Copy Client ID and Client Secret
6. In Supabase Dashboard:
   - Go to "Authentication" → "Providers"
   - Enable "Google"
   - Paste Client ID and Secret
   - Save
```

#### Apple OAuth (Optional)
```bash
1. Go to Apple Developer Account
2. Create App ID and Services ID
3. Configure Sign in with Apple
4. Add redirect URL from Supabase
5. Generate private key
6. In Supabase Dashboard:
   - Enable "Apple"
   - Add credentials
```

#### Instagram OAuth (Custom - Future)
Instagram doesn't have standard OAuth. You'll need:
1. Instagram Basic Display API or Facebook Login
2. Custom implementation in your app

### 4. Set Up Storage (for photos)

```bash
1. Go to "Storage" in Supabase Dashboard
2. Create buckets:

   Bucket: "avatars"
   - Public: Yes
   - File size limit: 2MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

   Bucket: "location-photos"
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

   Bucket: "suggestion-photos"
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

   Bucket: "request-images"
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

3. Configure RLS policies for each bucket (allow authenticated uploads)
```

### 5. Get API Credentials

```bash
1. Go to "Settings" → "API"
2. Copy these values:

   ✅ Project URL: https://<project-ref>.supabase.co
   ✅ Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

3. Create .env file in your project root:
```

```bash
# .env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# OAuth (if configured)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id

# App URL
VITE_APP_URL=http://localhost:5173

# Map API (future)
VITE_MAPBOX_TOKEN=your_mapbox_token
```

**⚠️ IMPORTANT:** Never commit `.env` to git! It's already in `.gitignore`.

### 6. Seed Initial Data (Optional)

For testing, you can add sample data:

```sql
-- Sample locations
INSERT INTO locations (name, description, address, city, latitude, longitude, vibes, category, price_level, rating, is_expert_pick)
VALUES
  (
    'The Artisan Cafe',
    'Cozy cafe with amazing coffee and laptop-friendly atmosphere',
    '123 Lake Palace Rd, Udaipur',
    'Udaipur',
    24.5854,
    73.7125,
    ARRAY['calm', 'aesthetic', 'productive'],
    'cafe',
    2,
    4.5,
    true
  ),
  (
    'Sunset Terrace Restaurant',
    'Rooftop dining with stunning lake views',
    '456 City Palace Rd, Udaipur',
    'Udaipur',
    24.5767,
    73.6836,
    ARRAY['romantic', 'photogenic', 'upscale'],
    'restaurant',
    3,
    4.8,
    true
  );

-- Note: For actual users, they'll be created automatically via the trigger
-- when users sign up through authentication
```

### 7. Test Database Connection

```bash
# In your terminal (in buyareco directory)
npm run dev

# Test that Supabase connection works:
# 1. Go to http://localhost:5173/signup
# 2. Try creating an account
# 3. Check Supabase Dashboard → Authentication → Users
# 4. You should see new user appear
# 5. Check Table Editor → users table
# 6. User profile should be auto-created (via trigger)
```

## Database Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                 │
│  - Basic profile (name, email, avatar)                      │
│  - Local expertise (is_local, cities, expertise_tags)       │
│  - Reputation (total_suggestions, helpful_suggestions)      │
└────────┬────────────────────────────────────────────────────┘
         │
         ├─── recommendation_requests (travelers ask)
         │         │
         │         └─── suggestions (locals respond)
         │                  │
         │                  └─── messages (follow-up chat)
         │
         ├─── locations (place database)
         │         │
         │         ├─── saves (wishlist)
         │         ├─── reviews (user reviews)
         │         └─── list_items (custom collections)
         │
         ├─── saved_places (from suggestions)
         ├─── notifications (real-time alerts)
         ├─── follows (social connections)
         └─── experts (verified local program)
```

## Next Steps After Setup

1. ✅ Schema executed
2. ✅ Authentication configured
3. ✅ Storage buckets created
4. ✅ Environment variables set
5. 🔄 **Update TypeScript types** (next task)
6. 🔄 **Create API service methods** for requests/suggestions
7. 🔄 **Connect UI to database**
8. 🔄 **Test all features**

## Troubleshooting

### Error: "relation already exists"
- **Cause:** Running schema multiple times
- **Fix:** Drop existing tables first or create new project

### Error: "permission denied for schema public"
- **Cause:** RLS policy issue
- **Fix:** Check RLS policies are correctly set

### Error: "could not connect to server"
- **Cause:** Wrong Supabase URL or network issue
- **Fix:** Verify VITE_SUPABASE_URL in .env

### Trigger not firing
- **Cause:** Trigger may not be created
- **Fix:** Re-run trigger creation SQL commands

### Users not auto-creating profiles
- **Cause:** `handle_new_user()` trigger not working
- **Fix:**
  ```sql
  -- Check if trigger exists
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

  -- If missing, re-run the trigger creation from schema
  ```

## Support

- **Supabase Docs:** https://supabase.com/docs
- **BuyaReco Issues:** https://github.com/your-repo/issues
- **Supabase Discord:** https://discord.supabase.com

---

**Database Version:** 1.0 Unified
**Last Updated:** 2025-10-29
**Status:** Ready for implementation
