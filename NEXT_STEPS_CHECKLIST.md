# buyareco - Next Steps Checklist

**Current Status:** ✅ UI Complete | ⏳ Backend: Ready to implement

---

## 🎯 Quick Start (Do This First!)

### [ ] 1. Set Up Supabase (30 minutes)

**Action Items:**
- [ ] Go to https://supabase.com and create account
- [ ] Create new project called "buyarego"
- [ ] Save the database password somewhere safe
- [ ] Copy API credentials:
  - Project URL
  - Anon public key
- [ ] Create `.env` file in project root
- [ ] Add credentials to `.env`:
  ```
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=your-key-here
  ```

---

### [ ] 2. Run Database Schema (15 minutes)

**Action Items:**
- [ ] Open Supabase dashboard
- [ ] Click "SQL Editor" in sidebar
- [ ] Open file `supabase-schema-p2p.sql` in your project
- [ ] Copy entire contents
- [ ] Paste in SQL Editor
- [ ] Click "Run" button
- [ ] Verify success (should see "Success. No rows returned")
- [ ] Go to "Table Editor" and verify tables exist:
  - users
  - recommendation_requests
  - suggestions
  - messages
  - notifications
  - saved_places
  - follows

---

### [ ] 3. Enable Authentication (30 minutes)

**Action Items:**
- [ ] In Supabase, go to Authentication → Providers
- [ ] Email: Already enabled ✅
- [ ] Google OAuth:
  - [ ] Enable Google provider
  - [ ] Go to https://console.cloud.google.com
  - [ ] Create OAuth credentials
  - [ ] Copy Client ID and Secret to Supabase
- [ ] Phone (optional for now):
  - [ ] Can skip for MVP
  - [ ] Add later with Twilio

---

## 📝 Week 1: Core Backend Integration

### [ ] 4. Connect Authentication (4 hours)

**Files to update:**
- [ ] `src/services/supabase.ts` - Add credentials
- [ ] `src/contexts/AuthContext.tsx` - Create auth context
- [ ] `src/pages/AuthPage.tsx` - Connect real auth
- [ ] `src/main.tsx` - Wrap app with AuthProvider

**Test:**
- [ ] Sign up with email works
- [ ] Sign in with email works
- [ ] Google sign-in works
- [ ] User redirects to onboarding

---

### [ ] 5. Connect Onboarding (2 hours)

**Files to update:**
- [ ] `src/pages/OnboardingPage.tsx` - Save profile to database

**Test:**
- [ ] Can select traveler/local role
- [ ] Can fill local profile
- [ ] Can add Instagram handle
- [ ] Data saves to `users` table
- [ ] Redirects to feed after completion

---

### [ ] 6. Request Creation (2 hours)

**Files to update:**
- [ ] `src/pages/NewRequestPage.tsx` - Submit to database

**Test:**
- [ ] Can create request
- [ ] Request appears in `recommendation_requests` table
- [ ] Redirects to feed
- [ ] Shows success message

---

### [ ] 7. Feed Data Loading (3 hours)

**Files to update:**
- [ ] `src/pages/FeedPage.tsx` - Fetch real requests

**Test:**
- [ ] Feed loads real requests
- [ ] Can swipe through requests
- [ ] Shows correct user info
- [ ] Shows suggestion count

---

### [ ] 8. Suggestion Submission (2 hours)

**Files to update:**
- [ ] `src/pages/FeedPage.tsx` - Submit suggestions

**Test:**
- [ ] Can submit suggestion
- [ ] Suggestion saves to database
- [ ] Shows success message
- [ ] Suggestion count updates

---

## 🚀 Week 2: Enhanced Features

### [ ] 9. User Profiles

- [ ] Create profile page
- [ ] Show user's requests
- [ ] Show user's suggestions
- [ ] Display reputation stats
- [ ] Edit profile functionality

---

### [ ] 10. Request Detail Page

- [ ] View single request
- [ ] See all suggestions
- [ ] Chat with suggester
- [ ] Mark helpful suggestions
- [ ] Save suggestions

---

### [ ] 11. Notifications

- [ ] Real-time notifications
- [ ] Notification badge
- [ ] Notification list
- [ ] Mark as read

---

### [ ] 12. Search & Filters

- [ ] Search by city
- [ ] Filter by vibe
- [ ] Filter by place type
- [ ] Sort options

---

## 🎨 Week 3: Polish & Deploy

### [ ] 13. Image Upload

- [ ] Create Supabase storage bucket
- [ ] Add image upload to suggestions
- [ ] Add avatar upload to profile
- [ ] Optimize images

---

### [ ] 14. Error Handling

- [ ] Add error boundaries
- [ ] Better error messages
- [ ] Offline handling
- [ ] Loading states everywhere

---

### [ ] 15. Testing

- [ ] Test on mobile devices
- [ ] Test all auth flows
- [ ] Test edge cases
- [ ] Performance testing
- [ ] SEO verification

---

### [ ] 16. Deployment

- [ ] Set up Vercel account
- [ ] Connect GitHub repo
- [ ] Deploy to production
- [ ] Add custom domain
- [ ] Set environment variables
- [ ] Test production build

---

## 📊 Success Metrics

Track these once live:
- [ ] User signups per day
- [ ] Requests created per day
- [ ] Suggestions submitted per day
- [ ] Response time (request → first suggestion)
- [ ] User retention (day 1, 7, 30)

---

## 🎯 MVP Definition (Minimum to launch)

**Must Have:**
- ✅ User can sign up/login
- ✅ User can create request
- ✅ User can browse requests
- ✅ Local can submit suggestion
- ✅ Basic notifications
- ✅ Mobile responsive

**Nice to Have (Add Later):**
- Chat system
- Image uploads
- Advanced search
- Analytics dashboard
- Push notifications

---

## 📞 Need Help?

**Resources:**
- Full guide: See `IMPLEMENTATION_GUIDE.md`
- Database schema: `supabase-schema-p2p.sql`
- Design docs: `GENZ_FEATURES.md`

**Common Issues:**
1. Auth not working → Check `.env` file
2. Database errors → Check RLS policies
3. CORS errors → Check Supabase URL
4. Can't see data → Check Table Editor

---

## ✅ Quick Test Commands

```bash
# Check environment variables
cat .env

# Restart dev server
npm run dev

# Check TypeScript errors
npx tsc --noEmit

# Check for console errors
# Open browser DevTools (F12) → Console tab
```

---

## 🎉 You're Ready When...

- [ ] Users can sign up
- [ ] Users can post requests
- [ ] Locals can see and respond
- [ ] Feed shows real data
- [ ] Works on mobile
- [ ] No major bugs
- [ ] Deployed to public URL

---

**Start with Step 1 (Supabase Setup) and work your way down!** 🚀

Each checkbox you complete gets you closer to a real, working app that people can use.

**Estimated total time:** 2-3 weeks (working part-time)
**Current progress:** 40% complete (UI done!)
