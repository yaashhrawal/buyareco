# Authentication Setup Guide

This guide explains how to enable **Email/Password**, **Google**, and **Instagram/Facebook** login for BuyaReco.

## Current Status

✅ **Email/Password Authentication** - Ready to use
⚠️ **Google OAuth** - Needs configuration in Supabase Dashboard
⚠️ **Instagram/Facebook** - Needs configuration in Supabase Dashboard

---

## 1. Email/Password Authentication

### ✅ Already Working!

Email/password auth is already configured and ready to use. No additional setup needed.

**How it works:**
- Users can sign up with email and password
- They receive a verification email from Supabase
- After verification, they can sign in

**Test it:**
1. Go to `/auth` in your app
2. Enter email, password, and name
3. Click "Create Account"
4. Check email for verification link
5. After verification, sign in

---

## 2. Google OAuth Setup

### Step 1: Create Google OAuth Client

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create or Select a Project:**
   - Click the project dropdown at the top
   - Click "New Project" or select existing project
   - Name it "BuyaReco" (or your preferred name)

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" user type
   - Fill in required info:
     - App name: **BuyaReco**
     - User support email: your email
     - Developer contact: your email
   - Add scopes (optional for now):
     - `userinfo.email`
     - `userinfo.profile`
   - Add test users (your email) if needed
   - Click "Save and Continue"

5. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: "BuyaReco Web"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     https://fkomcelowqptiurppeia.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     https://fkomcelowqptiurppeia.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these next)

### Step 2: Configure Google in Supabase

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard/project/fkomcelowqptiurppeia)**
2. **Navigate to:** Authentication → Providers
3. **Find Google** and click to expand
4. **Enable the toggle**
5. **Paste your credentials:**
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
6. **Click "Save"**

### Step 3: Test Google Login

1. Go to `/auth` in your app
2. Click "Continue with Google"
3. You'll be redirected to Google sign-in
4. After signing in, you'll be redirected back to your app
5. You should see "Welcome to BuyaReco!" and be at `/onboarding`

---

## 3. Facebook Login (Instagram Alternative)

### Why Facebook instead of Instagram?

Instagram doesn't provide direct OAuth for websites. Since Instagram is owned by Meta (Facebook), users can log in with their Facebook account, which is linked to their Instagram.

### Step 1: Create Facebook App

1. **Go to [Facebook Developers](https://developers.facebook.com/)**
2. **Click "My Apps" → "Create App"**
3. **Select "Consumer" as app type**
4. **Fill in details:**
   - App Name: **BuyaReco**
   - App Contact Email: your email
   - Choose a Business Account (or skip)
5. **Click "Create App"**

### Step 2: Add Facebook Login Product

1. In your app dashboard, find **"Facebook Login"**
2. Click **"Set Up"**
3. Select **"Web"** as platform
4. Enter your site URL: `http://localhost:5173`
5. **Configure Settings:**
   - Go to "Facebook Login" → "Settings"
   - **Valid OAuth Redirect URIs:**
     ```
     https://fkomcelowqptiurppeia.supabase.co/auth/v1/callback
     ```
   - Click "Save Changes"

### Step 3: Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy:
   - **App ID** (this is your Client ID)
   - **App Secret** (click "Show" to reveal)

### Step 4: Configure Facebook in Supabase

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard/project/fkomcelowqptiurppeia)**
2. **Navigate to:** Authentication → Providers
3. **Find Facebook** and click to expand
4. **Enable the toggle**
5. **Paste your credentials:**
   - Facebook Client ID: (your App ID)
   - Facebook Secret: (your App Secret)
6. **Click "Save"**

### Step 5: Update Your Code

Replace Instagram button with Facebook in [AuthPage.tsx](src/pages/AuthPage.tsx):

```tsx
// Change the Instagram button onClick handler:
onClick={() => handleAuth('facebook')}  // instead of 'instagram'

// Or update the auth logic to use Facebook when Instagram is clicked
```

### Step 6: Test Facebook Login

1. Go to `/auth` in your app
2. Click the Instagram/Facebook button
3. You'll be redirected to Facebook
4. After signing in, you'll be redirected back to your app

---

## 4. Email Configuration (Optional but Recommended)

By default, Supabase sends emails from their domain. For a professional look:

### Set up Custom SMTP

1. **Go to Supabase Dashboard** → Authentication → Email Templates
2. **Click "SMTP Settings"**
3. **Configure with your email provider:**
   - Gmail (not recommended for production)
   - SendGrid (recommended - free tier available)
   - Mailgun
   - AWS SES

---

## 5. Security Checklist

Before going to production:

- [ ] Set up custom email domain (SMTP)
- [ ] Add production URL to OAuth redirect URIs
- [ ] Enable email verification requirement
- [ ] Set up RLS (Row Level Security) policies in Supabase
- [ ] Configure session timeout settings
- [ ] Add rate limiting for auth endpoints
- [ ] Review Supabase Auth policies

---

## 6. Testing Checklist

### Email/Password Auth
- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Sign in with verified email
- [ ] Try signing in with wrong password
- [ ] Try signing up with existing email

### Google OAuth
- [ ] Click "Continue with Google"
- [ ] Successfully redirected to Google
- [ ] Grant permissions
- [ ] Redirected back to app
- [ ] User session created
- [ ] Profile data populated

### Facebook OAuth (if configured)
- [ ] Click "Continue with Facebook"
- [ ] Successfully redirected to Facebook
- [ ] Grant permissions
- [ ] Redirected back to app
- [ ] User session created
- [ ] Profile data populated

---

## 7. Troubleshooting

### "Invalid redirect URI"
- Check that redirect URIs in Google/Facebook match Supabase exactly
- Must be: `https://fkomcelowqptiurppeia.supabase.co/auth/v1/callback`

### "Google OAuth not working"
- Make sure Google+ API is enabled
- Check that OAuth consent screen is configured
- Verify Client ID and Secret are correct in Supabase

### "Email not sending"
- Check spam folder
- Verify email is not on suppression list
- Consider setting up custom SMTP

### "Session not persisting"
- Check browser localStorage
- Make sure `detectSessionInUrl: true` is set (already configured)
- Clear browser cache and try again

---

## 8. Environment Variables

Make sure you have these in `.env.local` (or `.env`):

```env
VITE_SUPABASE_URL=https://fkomcelowqptiurppeia.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_APP_URL=http://localhost:5173
```

For production, add:
```env
VITE_APP_URL=https://your-production-domain.com
```

---

## 9. Next Steps

1. **Configure Google OAuth** (most important for your use case)
2. **Decide on Instagram strategy:**
   - Option A: Use Facebook Login (easier)
   - Option B: Remove Instagram button for now
   - Option C: Build custom Instagram OAuth (advanced, requires backend)
3. **Test all authentication flows**
4. **Set up custom email** (optional but professional)
5. **Add password reset functionality** (already built, just needs testing)

---

## Need Help?

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Google OAuth Setup**: https://supabase.com/docs/guides/auth/social-login/auth-google
- **Facebook Login Setup**: https://supabase.com/docs/guides/auth/social-login/auth-facebook

---

**Created**: 2025-11-01
**BuyaReco Auth System**
