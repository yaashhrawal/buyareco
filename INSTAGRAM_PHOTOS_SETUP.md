# Instagram Photo Integration Setup Guide

This guide explains how to set up Instagram photo integration for BuyaReco profiles - allowing users to display their top 6 Instagram photos (similar to Hinge).

## What You Get

✨ **Hinge-style Instagram Integration:**
- Users can connect their Instagram account
- Displays top 6 photos in a beautiful 3x2 grid
- Photos are cached for performance
- Click to expand photos in full screen
- Auto-updates to keep photos fresh
- Easy disconnect option

---

## How It Works

```
User clicks "Connect Instagram"
    ↓
Instagram OAuth Authorization
    ↓
Exchange code for long-lived token (60 days)
    ↓
Fetch user's top 6 photos
    ↓
Save photos to database (cached)
    ↓
Display in beautiful grid on profile
```

---

## Setup Steps

### Step 1: Create Facebook App (Required for Instagram Basic Display)

Instagram Basic Display API requires a Facebook App:

1. **Go to [Facebook Developers](https://developers.facebook.com/)**

2. **Create a New App:**
   - Click "Create App"
   - Choose "Consumer" type
   - Fill in details:
     - App Name: **BuyaReco**
     - App Contact Email: your email
   - Click "Create App"

### Step 2: Set Up Instagram Basic Display

1. **In your Facebook App dashboard:**
   - Scroll down to "Add Products"
   - Find **"Instagram Basic Display"**
   - Click **"Set Up"**

2. **Configure Basic Display Settings:**
   - Go to "Instagram Basic Display" → "Basic Display"
   - Click "Create New App"
   - Fill in:
     - Display Name: **BuyaReco**
     - Valid OAuth Redirect URIs:
       ```
       http://localhost:5173/instagram/callback
       https://your-production-domain.com/instagram/callback
       ```
     - Deauthorize Callback URL:
       ```
       https://your-production-domain.com/api/instagram/deauth
       ```
     - Data Deletion Request URL:
       ```
       https://your-production-domain.com/api/instagram/delete
       ```
   - Click "Save Changes"

3. **Get Your Credentials:**
   - Still in "Instagram Basic Display" settings
   - Copy:
     - **Instagram App ID**
     - **Instagram App Secret** (click "Show" to reveal)

### Step 3: Add Yourself as Tester

During development, you need to add Instagram accounts as testers:

1. **In your Facebook App:**
   - Go to "Roles" → "Instagram Testers"
   - Click "Add Instagram Testers"
   - Enter your Instagram username
   - Click "Submit"

2. **Accept the Tester Invitation:**
   - Go to your Instagram app (mobile or web)
   - Go to Settings → Apps and Websites → Tester Invites
   - Accept the invitation from BuyaReco

### Step 4: Configure Environment Variables

Add to your `.env.local` file:

```env
# Instagram Basic Display API
VITE_INSTAGRAM_APP_ID=your_instagram_app_id_here
VITE_INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
```

**Important:** Replace with your actual credentials from Step 2.

### Step 5: Update Supabase Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Add Instagram columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS instagram_access_token TEXT,
ADD COLUMN IF NOT EXISTS instagram_user_id TEXT,
ADD COLUMN IF NOT EXISTS instagram_username TEXT,
ADD COLUMN IF NOT EXISTS instagram_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS instagram_photos TEXT[];

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_instagram_user_id ON users(instagram_user_id);

-- Add comment for documentation
COMMENT ON COLUMN users.instagram_photos IS 'Cached top 6 Instagram photos (URLs)';
```

### Step 6: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Sign in to your BuyaReco account**

3. **Go to your profile page** (`/profile`)

4. **Click "Connect Instagram":**
   - You'll be redirected to Instagram
   - Authorize the app
   - You'll be redirected back to your profile
   - Your top 6 photos should appear!

5. **Test the features:**
   - Click photos to view full size
   - Try disconnecting Instagram
   - Reconnect to see photos update

---

## Token Management

### Long-Lived Tokens (60 Days)

- The integration automatically exchanges short-lived tokens for long-lived ones
- Long-lived tokens last 60 days
- Tokens should be refreshed before expiry

### Auto-Refresh (Recommended)

You can set up a cron job to refresh tokens:

```typescript
// Example: src/jobs/refreshInstagramTokens.ts
import { supabase } from '../services/supabase';
import { refreshAccessToken, shouldRefreshToken } from '../services/instagram';

export async function refreshExpiring Tokens() {
  // Get users with Instagram connected and tokens expiring soon
  const { data: users } = await supabase
    .from('users')
    .select('id, instagram_access_token, instagram_token_expires_at')
    .not('instagram_access_token', 'is', null);

  for (const user of users || []) {
    if (shouldRefreshToken(user.instagram_token_expires_at)) {
      try {
        const { access_token, expires_in } = await refreshAccessToken(
          user.instagram_access_token
        );

        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

        await supabase
          .from('users')
          .update({
            instagram_access_token: access_token,
            instagram_token_expires_at: expiresAt.toISOString(),
          })
          .eq('id', user.id);

        console.log(`Refreshed token for user ${user.id}`);
      } catch (error) {
        console.error(`Failed to refresh token for user ${user.id}:`, error);
      }
    }
  }
}
```

---

## UI Features

### Empty State (No Photos Connected)
- Shows beautiful Instagram gradient icon
- Clear call-to-action button
- Explains the benefits

### Connected State
- 3x2 photo grid (Hinge-style)
- Username with link to Instagram
- Disconnect option for profile owner
- Click to expand photos
- Automatic placeholder for missing photos

### Photo Modal
- Full-screen photo viewer
- Click outside to close
- Smooth animations
- Blurred background

---

## Customization

### Change Number of Photos

In [instagram.ts](src/services/instagram.ts):

```typescript
// Default is 6 (3x2 grid)
const media = await fetchInstagramMedia(longToken, 12); // Now fetches 12
```

Then update [InstagramPhotoGrid.tsx](src/components/InstagramPhotoGrid.tsx):

```typescript
// Change grid layout
<div className="grid grid-cols-4 gap-2">  // 4 columns for 12 photos
  {/* ... */}
</div>
```

### Styling

All styles are in [InstagramPhotoGrid.tsx](src/components/InstagramPhotoGrid.tsx) using Tailwind CSS:
- Modify grid layout (`grid grid-cols-3`)
- Change colors (`bg-gradient-to-tr from-yellow-400...`)
- Adjust spacing (`gap-2`)
- Update animations (Framer Motion)

---

## Troubleshooting

### "Instagram App ID not configured"
- Make sure you've added `VITE_INSTAGRAM_APP_ID` to `.env.local`
- Restart your dev server after adding environment variables

### "Invalid redirect URI"
- Check that your redirect URI in Facebook App matches exactly:
  `http://localhost:5173/instagram/callback`
- No trailing slashes
- Must use http (not https) for localhost

### "Instagram user not found" or "User not authorized"
- Make sure you've added yourself as an Instagram Tester
- Accept the invitation in Instagram app/website
- Try disconnecting and reconnecting

### Photos not loading
- Check browser console for errors
- Verify Instagram URLs are accessible
- Some videos might not have thumbnails
- Check Instagram API rate limits

### Token expired
- Tokens last 60 days
- Set up auto-refresh (see Token Management)
- Users can reconnect manually

---

## Security Considerations

### Token Storage
- ✅ Tokens stored in database (server-side)
- ✅ Not exposed to client JavaScript
- ✅ Encrypted at rest by Supabase
- ❌ Don't log tokens
- ❌ Don't share tokens in error messages

### Photo Caching
- Photos are cached as URLs (public)
- Original photos remain on Instagram
- Cached URLs may expire
- Consider periodic refresh

### Privacy
- Users control what they share
- Easy disconnect option
- Clear data deletion process
- Comply with Instagram's Terms

---

## Production Checklist

Before launching to production:

- [ ] Configure production redirect URI in Facebook App
- [ ] Add production domain to Instagram Basic Display settings
- [ ] Set up token refresh cron job
- [ ] Implement data deletion callback endpoint
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Test with multiple accounts
- [ ] Review Instagram Platform Terms
- [ ] Add rate limiting
- [ ] Set up backup/restore for tokens
- [ ] Document user privacy policy

---

## API Limits

Instagram Basic Display API limits:
- **Rate Limit:** 200 requests per hour per user
- **Token Lifespan:** 60 days (long-lived)
- **Media Limit:** Up to 10,000 media items
- **Renewal:** Tokens can be refreshed indefinitely

---

## Files Added/Modified

### New Files:
- [src/services/instagram.ts](src/services/instagram.ts) - Instagram API integration
- [src/components/InstagramPhotoGrid.tsx](src/components/InstagramPhotoGrid.tsx) - Photo grid UI
- [src/pages/InstagramCallbackPage.tsx](src/pages/InstagramCallbackPage.tsx) - OAuth callback handler

### Modified Files:
- [src/types/index.ts](src/types/index.ts) - Added Instagram fields to User type
- [src/pages/ProfilePage.tsx](src/pages/ProfilePage.tsx) - Integrated Instagram grid
- [src/main.tsx](src/main.tsx) - Added Instagram callback route
- [.env.local](.env.local) - Added Instagram environment variables

---

## Support & Resources

- **Instagram Basic Display API Docs:** https://developers.facebook.com/docs/instagram-basic-display-api
- **Facebook Developers:** https://developers.facebook.com/
- **Supabase Docs:** https://supabase.com/docs
- **BuyaReco Issues:** https://github.com/yaashhrawal/buyareco/issues

---

**Last Updated:** 2025-11-01
**Feature:** Instagram Photo Integration (Hinge-style)
