# BuyaReco Setup Guide

This guide will walk you through setting up the BuyaReco application from scratch.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- Git installed
- A code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name:** BuyaReco (or whatever you prefer)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier is fine for development
4. Click "Create new project" and wait for it to initialize (~2 minutes)

#### Get Your Supabase Credentials

1. In your Supabase project dashboard, click the **Settings** icon (⚙️) in the sidebar
2. Go to **API** section
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

#### Create Environment Variables File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

#### Run Database Migrations

1. In your Supabase dashboard, go to the **SQL Editor** (📝 icon in sidebar)
2. Click "New Query"
3. Open the `supabase-schema.sql` file from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click "Run" to execute the schema creation
6. You should see "Success. No rows returned" (this is expected)

**Verify the tables were created:**
- Go to **Table Editor** in Supabase sidebar
- You should see these tables:
  - `users`
  - `locations`
  - `saves`
  - `experts`
  - `reviews`
  - `lists`
  - `list_items`
  - `follows`

### 3. Configure OAuth (Optional but Recommended)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Set **Application Type** to "Web application"
7. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**
9. In Supabase dashboard, go to **Authentication** → **Providers**
10. Enable **Google** provider
11. Paste your Client ID and Client Secret
12. Save

#### Apple OAuth (Optional)

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Create a new **Services ID**
3. Configure **Sign in with Apple**
4. Add redirect URLs in Supabase format
5. In Supabase dashboard, enable **Apple** provider
6. Enter your Apple credentials
7. Save

### 4. Start Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## 📁 Project Structure

```
buyareco/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── location/      # Location-related components
│   │   ├── search/        # Search components
│   │   └── shared/        # Shared/common components
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx   # Landing page ✅
│   │   ├── SearchPage.tsx # Search results ✅
│   │   ├── LoginPage.tsx  # Login page ✅
│   │   └── SignUpPage.tsx # Sign up page ✅
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication hooks ✅
│   │   ├── useLocations.ts # Location data hooks ✅
│   │   └── useSaves.ts    # Save/wishlist hooks ✅
│   ├── services/          # API services
│   │   ├── supabase.ts    # Supabase client ✅
│   │   └── api.ts         # API functions ✅
│   ├── types/             # TypeScript types
│   │   ├── index.ts       # Main types ✅
│   │   └── database.ts    # Database types ✅
│   ├── utils/             # Utility functions
│   ├── main.tsx           # App entry point ✅
│   └── index.css          # Global styles ✅
├── supabase-schema.sql    # Database schema ✅
├── .env.example           # Environment variables template ✅
└── package.json           # Dependencies
```

## 🎨 What's Implemented

### ✅ Core Infrastructure
- [x] Project structure and folder organization
- [x] TypeScript types for all data models
- [x] Supabase client configuration
- [x] React Query setup for data fetching
- [x] React Router for navigation
- [x] Toast notifications (react-hot-toast)
- [x] Database schema with RLS policies

### ✅ Pages
- [x] **HomePage** - Beautiful landing page with vibe selector
- [x] **SearchPage** - Location search with filters (UI only)
- [x] **LoginPage** - Email + OAuth authentication
- [x] **SignUpPage** - User registration

### ✅ Features
- [x] Authentication flow (Google, Apple, Email)
- [x] Vibe-based filtering UI
- [x] Search interface
- [x] Responsive design
- [x] Dark theme with glass morphism

### ✅ Hooks & Services
- [x] `useAuth` - Authentication state management
- [x] `useLocations` - Location search and details
- [x] `useSaves` - Save/wishlist functionality
- [x] API service layer with Supabase queries

## 🚧 What's Next (MVP Roadmap)

### High Priority
1. **Location Card Component** - Design and build the location card UI
2. **Location Detail Page** - Full page with photos, description, map
3. **Search Functionality** - Wire up autocomplete and filtering
4. **Save/Wishlist Integration** - Connect UI to backend
5. **Onboarding Flow** - Collect user preferences after signup

### Medium Priority
6. **Map View** - Integrate Mapbox/Leaflet for map display
7. **Expert Verification UI** - Admin panel for approving experts
8. **User Profile Page** - View and edit user settings
9. **Seed Location Data** - Add sample locations for testing

### Phase 2 Features (Post-MVP)
- AI-powered recommendations
- User reviews and ratings
- Photo uploads
- Custom lists/collections
- Expert profiles and following
- Social activity feed

## 🗄️ Database Schema Overview

### Core Tables

**users** - User profiles
- Linked to Supabase Auth
- Stores preferred vibes, name, avatar

**locations** - Places and venues
- Full text search enabled
- Vibe tags, categories, ratings
- Geographic coordinates for mapping

**saves** - User wishlists
- Many-to-many relationship: user ↔ location
- Unique constraint prevents duplicates

**experts** - Verified local experts
- Status: pending, approved, verified
- Specialties and cities

**lists** - Custom collections
- Public, private, or shared visibility
- User-created location lists

**reviews** - User ratings (Phase 2)
- 1-5 star ratings
- Text and photos

## 🔐 Security (Row Level Security)

All tables have RLS (Row Level Security) policies enabled:

- **Users:** Can only read/update their own data
- **Locations:** Publicly readable, authenticated writes
- **Saves:** Users can only manage their own saves
- **Lists:** Privacy settings control visibility
- **Reviews:** Public reads, authenticated writes

## 🧪 Testing the Setup

### 1. Test Authentication

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:5173`
3. Click "Get Started" or "Sign In"
4. Try signing up with email
5. Check Supabase **Authentication** → **Users** to see new user

### 2. Test Database Access

Open your browser console and run:

```javascript
// This should work if Supabase is configured correctly
fetch('http://localhost:5173/search?vibes=lowkey')
```

### 3. Check Environment Variables

```bash
# In the terminal:
npm run dev

# If you see this error:
# "Missing Supabase environment variables"
# → Check your .env file
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

- Check that `.env` exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env`

### "Failed to fetch" or CORS errors

- Verify Supabase URL is correct
- Check that Supabase project is not paused (free tier pauses after inactivity)
- Go to Supabase dashboard and wake up project

### OAuth login doesn't work

- Check redirect URLs in OAuth provider settings
- Verify OAuth credentials in Supabase **Authentication** → **Providers**
- Make sure provider is enabled in Supabase

### Database tables not created

- Re-run the `supabase-schema.sql` in SQL Editor
- Check for error messages in SQL Editor
- Verify you're using the correct Supabase project

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Competitive Research Report](./COMPETITIVE_RESEARCH_REPORT.md) - Feature specifications

## 🆘 Need Help?

- Check the [Troubleshooting](#-troubleshooting) section above
- Review the [Competitive Research Report](./COMPETITIVE_RESEARCH_REPORT.md) for feature specs
- Open an issue in the project repository

## 🎯 Next Steps

Once setup is complete:

1. **Add Sample Data** - Create test locations in Supabase
2. **Test Search** - Try searching for locations
3. **Build Components** - Start with LocationCard component
4. **Implement Features** - Follow the MVP roadmap above

Happy coding! 🚀
