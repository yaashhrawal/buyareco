# Fix: Email/Password Signup Not Working

## Problem
Users can't sign up with email and password on BuyaReco.

## Root Cause
Two main issues:
1. **Missing Database Trigger** - No user profile is created automatically when someone signs up
2. **Email Confirmation** - Supabase requires email verification by default

---

## Solution (3 Steps - Takes 5 minutes)

### Step 1: Run SQL Migration

1. **Go to your Supabase Dashboard:**
   - Navigate to: https://supabase.com/dashboard/project/fkomcelowqptiurppeia
   - Click on **"SQL Editor"** in the left sidebar

2. **Copy and paste this SQL:**
   - Open the file: `supabase-auth-setup.sql`
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click **"Run"**

   ✅ This creates:
   - Users table (if missing)
   - Automatic profile creation trigger
   - Row Level Security policies
   - Proper indexes

### Step 2: Configure Email Settings (Optional but Recommended)

**Option A: Disable Email Confirmation (For Testing)**

Good for development/testing, but NOT for production:

1. Go to: **Authentication** → **Settings**
2. Find **"Enable email confirmations"**
3. **Toggle it OFF**
4. Click **Save**

Now users can sign up and sign in immediately without verifying email.

**Option B: Keep Email Confirmation (Recommended for Production)**

If you want to keep email verification enabled:

1. Keep **"Enable email confirmations"** ON
2. Users will receive an email after signup
3. They must click the verification link
4. Then they can sign in

For a better user experience with email confirmation:
- Set up custom SMTP (Gmail, SendGrid, etc.)
- Customize email templates
- Add a "Resend verification email" feature

### Step 3: Test Signup

1. **Go to your app:** http://localhost:5173/auth
2. **Click "Sign Up"**
3. **Fill in:**
   - Name: Test User
   - Email: test@example.com
   - Password: Password123!
4. **Click "Create Account"**

**If email confirmation is OFF:**
- You'll be redirected to `/onboarding`
- You can immediately sign in

**If email confirmation is ON:**
- Check your email inbox
- Click verification link
- Then go back and sign in

---

## Common Errors & Fixes

### Error: "User already registered"
**Cause:** Email already exists in database

**Fix:**
- Use a different email, OR
- Go to Supabase → Authentication → Users
- Delete the existing user
- Try again

### Error: "Invalid email or password"
**Cause:** Password doesn't meet requirements

**Fix:**
- Password must be at least 6 characters
- Try: `Password123!`

### Error: "Email not confirmed"
**Cause:** Email confirmation is enabled but user hasn't verified

**Fix:**
- Check email for verification link
- OR disable email confirmation (see Step 2)

### Error: "Failed to fetch"
**Cause:** Supabase credentials might be wrong

**Fix:**
- Check `.env.local` file
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart dev server: `npm run dev`

---

## Verify Everything is Working

Run these SQL queries in Supabase SQL Editor to check:

```sql
-- 1. Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- Should return 1 row

-- 2. Check if function exists
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
-- Should return 1 row

-- 3. Check if users table exists
SELECT * FROM information_schema.tables WHERE table_name = 'users';
-- Should return 1 row

-- 4. Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'users';
-- Should return 3 rows (SELECT, UPDATE, INSERT)
```

---

## Production Checklist

Before launching to production:

- [ ] Re-enable email confirmation
- [ ] Set up custom SMTP (professional emails)
- [ ] Customize email templates
- [ ] Set up password reset flow
- [ ] Add "Resend verification email" feature
- [ ] Configure rate limiting
- [ ] Set up monitoring/alerts

---

## Still Not Working?

1. **Check browser console** for errors:
   - Open DevTools (F12)
   - Go to Console tab
   - Try signing up again
   - Share any error messages

2. **Check Supabase logs:**
   - Go to Supabase Dashboard
   - Click "Logs" → "Auth Logs"
   - See if signup attempts appear

3. **Verify environment variables:**
   ```bash
   # Check your .env.local file
   cat .env.local
   ```
   Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

4. **Restart everything:**
   ```bash
   # Kill dev server
   # Restart
   npm run dev
   ```

---

## Quick Test Script

Want to test programmatically? Open browser console on http://localhost:5173 and run:

```javascript
// Test signup
const testSignup = async () => {
  const { signUpWithEmail } = await import('./src/services/supabase.js');
  const result = await signUpWithEmail('test@example.com', 'Password123!', 'Test User');
  console.log('Signup result:', result);
};
testSignup();
```

---

**Created:** 2025-11-08
**Issue:** Email/Password signup not working
**Status:** Fixed ✅ (after running SQL migration)
