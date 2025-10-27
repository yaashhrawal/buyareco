# BuyaReco Quick Start Guide

**Get up and running in 5 minutes**

## ⚡ Fastest Path to Running App

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Wait ~2 minutes for initialization

### 3. Set Up Database
1. In Supabase dashboard, click **SQL Editor** (📝 icon)
2. Create new query
3. Copy-paste entire contents of `supabase-schema.sql`
4. Click **RUN**
5. Verify success: Go to **Table Editor**, should see 8 tables

### 4. Create `.env` File
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co  # From Supabase Settings > API
VITE_SUPABASE_ANON_KEY=eyJxxx...             # From Supabase Settings > API
```

### 5. Start App
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ✅ Test Checklist

- [ ] App loads without errors
- [ ] Can navigate to /login page
- [ ] Can sign up with email
- [ ] New user appears in Supabase **Authentication** > **Users**
- [ ] New user profile created in **users** table

---

## 🎯 What Works Right Now

| Feature | Status |
|---------|--------|
| Landing page | ✅ Works |
| Sign up / Login | ✅ Works (after OAuth setup) |
| Search page UI | ✅ Works (no data yet) |
| Vibe filtering | ✅ Works (no data yet) |
| Database schema | ✅ Ready |
| API layer | ✅ Ready |

---

## 🚧 What Needs Data/Work

| Feature | What's Missing |
|---------|----------------|
| Search results | Need to seed location data |
| Location details | Need to build detail page |
| Save locations | Works but needs UI button |
| Map view | Needs map library (Mapbox) |
| Autocomplete | Needs dropdown component |

---

## 🔧 Common Issues

### "Missing Supabase environment variables"
- Check `.env` file exists in project root
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Restart dev server: `npm run dev`

### OAuth login doesn't work
- Google/Apple OAuth requires additional setup
- See [SETUP.md](./SETUP.md) Section 3
- Email login works without OAuth

### Database tables not created
- Re-run `supabase-schema.sql` in SQL Editor
- Check for SQL errors in output
- Verify you're in correct Supabase project

---

## 📚 Full Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's built, what's next
- **[COMPETITIVE_RESEARCH_REPORT.md](./COMPETITIVE_RESEARCH_REPORT.md)** - Feature specs

---

## 🎨 Key Pages

| URL | Description | Status |
|-----|-------------|--------|
| `/` | Landing page | ✅ Complete |
| `/search` | Search results | 🟡 UI only |
| `/search?vibes=lowkey,romantic` | Filtered search | 🟡 UI only |
| `/login` | Authentication | ✅ Complete |
| `/signup` | Registration | ✅ Complete |

---

## 🗂️ Project Structure

```
src/
├── pages/           → Full page components
├── components/      → Reusable UI components (add as needed)
├── hooks/           → React Query hooks
├── services/        → API and Supabase
├── types/           → TypeScript definitions
└── utils/           → Helper functions
```

---

## 💻 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript checks
npx tsc --noEmit
```

---

## 🎯 Next Immediate Steps

1. **Add sample location data** to test search
   - Go to Supabase **Table Editor** > **locations**
   - Click **Insert** > **Insert row**
   - Add a few test locations

2. **Create LocationCard component**
   - `src/components/location/LocationCard.tsx`
   - Display location name, city, vibes, rating

3. **Build LocationDetail page**
   - `src/pages/LocationDetailPage.tsx`
   - Show full location information

4. **Wire up save button**
   - Use `useSaveLocation()` hook from `src/hooks/useSaves.ts`

---

## 🆘 Need Help?

- **Setup issues?** → See [SETUP.md](./SETUP.md)
- **What's implemented?** → See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Feature specs?** → See [COMPETITIVE_RESEARCH_REPORT.md](./COMPETITIVE_RESEARCH_REPORT.md)

---

## 🚀 Happy Coding!

The foundation is solid. Start building features and iterate based on user feedback.
