# buyareco - Real World Implementation Guide

**Goal:** Make buyareco fully functional with backend integration
**Timeline:** 2-3 weeks for MVP
**Status:** UI Complete ✅ | Backend: Ready to implement

---

## 📋 Phase 1: Backend Setup (Week 1)

### Step 1.1: Create Supabase Project (30 min)

1. **Sign up for Supabase**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign in with GitHub

2. **Create New Project**
   - Organization: Create new or use existing
   - Project name: `buyarego` or `buyarego-prod`
   - Database password: Generate strong password (save it!)
   - Region: Choose closest to your users
   - Pricing: Start with Free tier

3. **Save Credentials**
   ```bash
   # Create .env file
   cp .env.example .env
   ```

   Add to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Get API Keys**
   - Go to Project Settings → API
   - Copy `Project URL` → VITE_SUPABASE_URL
   - Copy `anon public` key → VITE_SUPABASE_ANON_KEY

---

### Step 1.2: Execute Database Schema (15 min)

1. **Open SQL Editor**
   - In Supabase dashboard
   - Click "SQL Editor" in left sidebar

2. **Run P2P Schema**
   - Copy entire `supabase-schema-p2p.sql` file
   - Paste into SQL editor
   - Click "Run"
   - Wait for success message

3. **Verify Tables**
   - Go to "Table Editor"
   - You should see:
     - users
     - recommendation_requests
     - suggestions
     - messages
     - notifications
     - saved_places
     - follows

---

### Step 1.3: Configure Authentication (30 min)

1. **Enable Auth Providers**
   - Go to Authentication → Providers

2. **Email Auth** (Already enabled)
   - ✅ Enable Email provider
   - Configure email templates (optional)

3. **Google OAuth**
   - Enable Google provider
   - Get credentials from Google Cloud Console:
     - Go to https://console.cloud.google.com
     - Create new project or use existing
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URI from Supabase
   - Paste Client ID and Secret in Supabase

4. **Phone Auth**
   - Enable Phone provider
   - Choose SMS provider (Twilio recommended)
   - Add Twilio credentials

5. **Instagram OAuth** (Advanced)
   - Will set up later with custom flow
   - Instagram doesn't have simple OAuth in Supabase

---

### Step 1.4: Update Supabase Client (15 min)

**File:** `src/services/supabase.ts`

Update it to use your credentials:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 📋 Phase 2: Authentication Integration (Week 1)

### Step 2.1: Connect Auth Page (2 hours)

**File:** `src/pages/AuthPage.tsx`

Replace the TODO comments with real auth:

```typescript
const handleAuth = async (authMethod: AuthMethod) => {
  setIsLoading(true);

  try {
    if (authMethod === 'google') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`
        }
      });
      if (error) throw error;
    }
    else if (authMethod === 'email') {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name
            }
          }
        });
        if (error) throw error;
        toast.success('Check your email to verify your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        navigate('/onboarding');
      }
    }
    else if (authMethod === 'phone') {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formData.phone
      });
      if (error) throw error;
      toast.success('Check your phone for the code!');
      // Show OTP input (need to add UI for this)
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    toast.error(error.message || 'Authentication failed');
  } finally {
    setIsLoading(false);
  }
};
```

---

### Step 2.2: Create Auth Context (1 hour)

**File:** `src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

Wrap your app in `main.tsx`:
```typescript
import { AuthProvider } from './contexts/AuthContext';

// Inside createRoot:
<AuthProvider>
  <QueryClientProvider client={queryClient}>
    {/* rest of app */}
  </QueryClientProvider>
</AuthProvider>
```

---

### Step 2.3: Connect Onboarding (2 hours)

**File:** `src/pages/OnboardingPage.tsx`

```typescript
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const handleComplete = async () => {
  const { user } = useAuth();
  if (!user) return;

  try {
    // Update user profile
    const { error } = await supabase
      .from('users')
      .update({
        is_traveler: isTraveler,
        is_local: isLocal,
        local_cities: localProfile.cities,
        years_in_city: localProfile.yearsInCity,
        expertise_tags: localProfile.expertise,
        bio: localProfile.bio,
        instagram_handle: localProfile.instagramHandle
      })
      .eq('id', user.id);

    if (error) throw error;

    toast.success('Profile complete! 🎉');
    navigate('/feed');
  } catch (error) {
    console.error('Onboarding error:', error);
    toast.error('Failed to save profile');
  }
};
```

---

## 📋 Phase 3: Core Features Integration (Week 2)

### Step 3.1: Request Creation (2 hours)

**File:** `src/pages/NewRequestPage.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  const { user } = useAuth();
  if (!user) {
    toast.error('Please sign in first');
    navigate('/auth');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('recommendation_requests')
      .insert({
        user_id: user.id,
        city: formData.city,
        area: formData.area,
        title: formData.title,
        description: formData.description,
        vibe_preferences: formData.vibes,
        place_type: formData.placeType,
        budget_level: formData.budgetLevel,
        group_size: formData.groupSize,
        time_constraints: formData.timeConstraints,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;

    toast.success('Request posted! Locals will start suggesting soon.');
    navigate('/feed');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to post request');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### Step 3.2: Feed Data Loading (3 hours)

**File:** `src/pages/FeedPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadRequests();
}, []);

const loadRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('recommendation_requests')
      .select(`
        *,
        requester:users!user_id (
          name,
          username,
          avatar_url,
          instagram_handle
        ),
        suggestions:suggestions (count)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    setRequests(data || []);
  } catch (error) {
    console.error('Error loading requests:', error);
    toast.error('Failed to load requests');
  } finally {
    setLoading(false);
  }
};

// Use real data
const currentRequest = requests[currentIndex];
```

---

### Step 3.3: Suggestion Submission (2 hours)

```typescript
const submitSuggestion = async () => {
  const { user } = useAuth();
  if (!user) {
    toast.error('Please sign in first');
    return;
  }

  if (!suggestionText.trim()) {
    toast.error('Please write a suggestion');
    return;
  }

  try {
    const { error } = await supabase
      .from('suggestions')
      .insert({
        request_id: currentRequest.id,
        user_id: user.id,
        place_name: 'Place name here', // Add input field
        recommendation_text: suggestionText,
      });

    if (error) throw error;

    toast.success('Suggestion sent! 🎉');
    setShowSuggestionForm(false);
    setSuggestionText('');

    // Reload requests to update count
    loadRequests();
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to send suggestion');
  }
};
```

---

## 📋 Phase 4: Advanced Features (Week 3)

### Step 4.1: Real-Time Notifications

```typescript
// In AuthContext or separate hook
useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        toast.success(payload.new.title);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);
```

---

### Step 4.2: Image Upload (Suggestions)

```typescript
// Install: npm install @supabase/storage-js

const handleImageUpload = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `suggestions/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
```

---

### Step 4.3: Instagram OAuth (Advanced)

This requires Meta App setup:

1. Go to https://developers.facebook.com
2. Create app → Type: Consumer
3. Add Instagram Basic Display
4. Configure OAuth redirect URI
5. Implement custom OAuth flow

Or use simpler approach: Just ask for Instagram handle (no OAuth).

---

## 📋 Phase 5: Deployment (Week 3)

### Step 5.1: Environment Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

---

### Step 5.2: Domain & DNS

1. **Custom Domain**
   - Buy domain (buyarego.com)
   - Add to Vercel
   - Configure DNS

2. **SSL Certificate**
   - Automatic with Vercel

---

### Step 5.3: Production Checklist

- [ ] Test all auth flows
- [ ] Test request creation
- [ ] Test suggestion submission
- [ ] Test real-time updates
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Test on mobile devices
- [ ] SEO verification
- [ ] Performance optimization
- [ ] Security audit

---

## 🔧 Quick Start Command

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
EOF

# 3. Start dev server
npm run dev

# 4. In another terminal, open Supabase Studio
npx supabase start
```

---

## 📚 Resources

### Documentation:
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Supabase Database:** https://supabase.com/docs/guides/database
- **React Query:** https://tanstack.com/query/latest
- **Framer Motion:** https://www.framer.com/motion/

### Tutorials:
- Supabase + React: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- OAuth Setup: https://supabase.com/docs/guides/auth/social-login

---

## 🚨 Common Issues & Solutions

### Issue: CORS errors
**Solution:** Check Supabase URL is correct, ensure RLS policies are set

### Issue: Auth not persisting
**Solution:** Check localStorage, verify JWT tokens, check session management

### Issue: Real-time not working
**Solution:** Enable Realtime in Supabase, check RLS policies

### Issue: Images not uploading
**Solution:** Create storage bucket, set public permissions

---

## 💡 Pro Tips

1. **Start with Email Auth** - Easiest to implement, add others later
2. **Test RLS Policies** - Use Supabase SQL editor to test queries
3. **Use React Query** - Already set up, great for caching
4. **Mobile First** - Test on real devices, not just browser
5. **Incremental Deployment** - Deploy early, deploy often

---

## 📊 Timeline Summary

| Week | Focus | Deliverable |
|------|-------|-------------|
| Week 1 | Backend Setup + Auth | Users can sign up/in |
| Week 2 | Core Features | Users can post/view requests |
| Week 3 | Polish + Deploy | Live production app |

---

## 🎯 Next Immediate Steps

**RIGHT NOW:**
1. Create Supabase account
2. Create new project
3. Get API keys
4. Add to `.env` file
5. Run database schema
6. Test auth in browser

**THEN:**
1. Integrate AuthPage
2. Test Google sign-in
3. Complete onboarding flow
4. Connect Feed to real data

---

**Questions? Issues? Let's tackle them one by one!** 🚀
