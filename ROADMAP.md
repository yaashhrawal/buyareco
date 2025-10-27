# buyareco Roadmap

## Vision
buyareco connects travelers with locals for authentic, personalized recommendations. Travelers describe their vibe and preferences, and locals who know the city share hidden gems and perfect spots.

---

## Phase 1: Core Peer-to-Peer Recommendation System 🎯

### 1.1 Recommendation Request System
- [ ] **Create Request Flow**
  - Form to post recommendation requests
  - Fields: location/city, vibe preferences, type of place, specific needs
  - Optional: time constraints, budget, accessibility needs

- [ ] **Request Feed for Locals**
  - Browse open requests for cities where user has local knowledge
  - Filter by vibe, place type, urgency
  - Show traveler's preferences clearly

- [ ] **Request Matching**
  - Notify relevant locals when new requests posted
  - Match based on city, local's expertise, vibe alignment

### 1.2 Suggestion/Response System
- [ ] **Submit Suggestions**
  - Locals can respond to requests with personalized recommendations
  - Include: place name, why it matches the vibe, insider tips
  - Attach location/map pins
  - Add photos (optional)

- [ ] **Suggestion Interactions**
  - Travelers can thank, save, or ask follow-up questions
  - Rating system for helpful suggestions
  - Mark suggestions as "tried" with feedback

### 1.3 Communication System
- [ ] **In-App Messaging**
  - Direct chat between traveler and local
  - Context: attached to specific request/suggestion
  - Follow-up questions and clarifications

- [ ] **Notifications**
  - New requests in your city (for locals)
  - New suggestions on your request (for travelers)
  - Messages and follow-ups

### 1.4 User Profiles & Trust
- [ ] **Local Credentials**
  - "Local for X years" badge
  - Cities where user has local knowledge
  - Expertise tags (cafes, nightlife, culture, food, etc.)

- [ ] **Reputation System**
  - Rating/reviews for suggestions
  - Helpful count, response rate
  - Verified local status

- [ ] **Dual Roles**
  - Users can be both travelers and locals
  - Toggle between "seeking recommendations" and "offering suggestions"

---

## Phase 2: Enhanced Discovery Features

### 2.1 Vibe-Based Search
- [ ] AI-powered vibe interpretation
- [ ] Smart filtering by mood, aesthetic, purpose
- [ ] Vibe tags: calm, aesthetic, vibrant, cozy, productive, romantic, etc.

### 2.2 Place Database
- [ ] Integration with Google Places API
- [ ] User-submitted hidden gems
- [ ] Rich place details: photos, hours, vibe tags
- [ ] Community-curated place information

### 2.3 Personal Collections
- [ ] Save places to custom lists
- [ ] Share lists with friends
- [ ] Collaborative trip planning
- [ ] Export to other apps/maps

---

## Phase 3: Social & Community

### 3.1 Social Features
- [ ] Follow other users (travelers and locals)
- [ ] See friends' saved places
- [ ] Share trip experiences
- [ ] Photo stories from visited places

### 3.2 Community Building
- [ ] Local expert verification program
- [ ] Community guidelines and moderation
- [ ] Featured locals of the month
- [ ] Success stories (great recommendations)

---

## Phase 4: Advanced Features

### 4.1 Smart Recommendations
- [ ] AI learning from user preferences
- [ ] Personalized suggestion matching
- [ ] Similar vibe recommendations
- [ ] "People like you also enjoyed..."

### 4.2 Trip Planning Tools
- [ ] Multi-day itinerary builder
- [ ] Route optimization
- [ ] Weather-based suggestions
- [ ] Peak times and crowd insights

### 4.3 Monetization (Optional)
- [ ] Premium local expert consultations
- [ ] Featured suggestions (for businesses)
- [ ] Travel guides by verified locals
- [ ] Partnership with local businesses

---

## Technical Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- React Router
- State Management: React Context/Zustand

### Backend
- Node.js + Express
- Database: PostgreSQL/MongoDB
- Real-time: Socket.io (for chat)
- Authentication: JWT/OAuth

### Third-Party Services
- Google Maps Platform (Maps, Places, Geocoding)
- Firebase/Supabase (Auth, Realtime DB)
- Cloudinary (Image hosting)
- SendGrid (Email notifications)

---

## Current Status
**Phase:** Initial Development
**Focus:** Building core peer-to-peer recommendation request/suggestion flow

## Next Steps
1. Set up user authentication system
2. Build recommendation request creation UI
3. Create local's suggestion submission flow
4. Implement basic matching and notifications
5. Add in-app messaging for follow-ups
