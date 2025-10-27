# Swipe-to-Discover Feature Specification
## BuyaReco's Killer Feature for MVP

**Priority:** HIGH - Week 1-2 Implementation
**Wow Factor:** 🔥🔥🔥🔥🔥 (10/10)
**Investor Impact:** Major differentiator

---

## 🎯 What Makes This Special

**The Problem:**
- Scrolling through lists is boring
- Users get decision paralysis with too many options
- No engagement, just functional browsing

**Our Solution:**
- Tinder-style swiping for locations
- One card at a time = focused decision
- Addictive, gamified experience
- Fun to use, easy to share

**Competitive Advantage:**
- **Zero** travel/location apps have this
- Proven pattern (Tinder = 75M users)
- Creates muscle memory (swipe = save)
- Instagram story-like engagement

---

## 📱 User Experience Flow

### Entry Points

**1. From Home Page:**
```
User taps a vibe → "Lowkey"
→ Shows: "Swipe through 20 lowkey spots near you"
→ [Start Swiping] button
→ Full-screen swipe interface
```

**2. From Search Results:**
```
User searches "Brooklyn + Romantic"
→ Toggle: [List View] [Swipe View] ← New option
→ Tap Swipe View
→ Same full-screen interface
```

**3. Quick Action (Power User Feature):**
```
Bottom nav: [Swipe] icon (playing card emoji 🃏)
→ Instantly shows random picks from favorite vibes
```

---

## 🎨 Visual Design Specification

### Card Design

```
┌─────────────────────────────────────┐
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │    [Location Photo]         │   │
│   │    Full bleed, 16:9         │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   Sunset Rooftop Bar                │
│   Brooklyn, NY · 0.8 mi             │
│                                     │
│   ✨ Romantic  📸 Photogenic        │
│   🌙 Nightlife                      │
│                                     │
│   ⭐ 4.8 · $$$                      │
│   💬 "Perfect first date spot"      │
│                                     │
│   ──────────────────────────────    │
│                                     │
│   [❌ Skip]        [❤️ Save]        │
│                                     │
└─────────────────────────────────────┘
```

### Detailed Measurements

- **Card Width:** 90% of screen (5% margin each side)
- **Card Height:** 75vh (scrollable content)
- **Photo Height:** 50% of card
- **Corner Radius:** 24px (generous, modern)
- **Shadow:** 0 20px 40px rgba(0,0,0,0.4) (dramatic depth)
- **Padding:** 24px internal
- **Button Size:** 72px diameter (easy thumb reach)
- **Button Spacing:** 48px apart

### Color System

**Default State:**
- Background: Dark gradient (neutral-950 → neutral-900)
- Card: White with 95% opacity
- Text: Dark gray (#1a1a1a)
- Vibes: Color-coded chips (see roadmap doc)

**Swipe Left (Skip) Animation:**
- Card tints red (rgba(239, 68, 68, 0.3))
- ❌ Icon grows 1.5x
- Card rotates -15deg

**Swipe Right (Save) Animation:**
- Card tints green (rgba(34, 197, 94, 0.3))
- ❤️ Icon grows 1.5x, pulses
- Card rotates +15deg
- Confetti burst on release

---

## 🎬 Animation Specifications

### 1. Card Entry Animation
```typescript
// When new card appears
{
  initial: {
    scale: 0.8,
    opacity: 0,
    y: 50
  },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0
  },
  transition: {
    type: "spring",
    stiffness: 200,
    damping: 20
  }
}
```

### 2. Swipe Gesture Animation
```typescript
// While dragging
{
  x: dragPosition.x,
  rotate: dragPosition.x / 20, // Subtle rotation
  opacity: 1 - Math.abs(dragPosition.x) / 300
}
```

### 3. Snap-Back Animation
```typescript
// When released without threshold
{
  x: 0,
  rotate: 0,
  opacity: 1,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
}
```

### 4. Success Animation (Saved)
```typescript
// When swiped right past threshold
{
  x: window.innerWidth + 100,
  rotate: 25,
  opacity: 0,
  scale: 0.8,
  transition: {
    duration: 0.3,
    ease: "easeOut"
  },
  // Then trigger confetti
  onComplete: () => triggerConfetti()
}
```

---

## ⚙️ Technical Implementation

### Tech Stack

**Libraries:**
- `framer-motion` (already installed) - For gestures and animations
- `react-use-gesture` - For advanced swipe detection
- `canvas-confetti` - For celebration effects
- `react-spring` - For physics-based animations (optional enhancement)

### Component Structure

```
SwipeDiscovery/
├── SwipeContainer.tsx       # Main wrapper, manages state
├── SwipeCard.tsx            # Individual card component
├── SwipeControls.tsx        # Bottom buttons (skip/save)
├── SwipeProgress.tsx        # "5 of 20 cards remaining"
├── SwipeEmpty.tsx           # Empty state when done
└── hooks/
    ├── useSwipeGesture.ts   # Custom hook for swipe logic
    └── useSwipeQueue.ts     # Manages card queue and prefetching
```

### Core Logic

```typescript
// src/components/swipe/SwipeContainer.tsx

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { useSwipeQueue } from './hooks/useSwipeQueue';
import SwipeCard from './SwipeCard';

interface SwipeContainerProps {
  vibes?: string[];
  city?: string;
  limit?: number;
}

export default function SwipeContainer({ vibes, city, limit = 20 }: SwipeContainerProps) {
  const {
    cards,
    currentIndex,
    isLoading,
    fetchMore,
    removeCard
  } = useSwipeQueue({ vibes, city, limit });

  const currentCard = cards[currentIndex];

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Save location
      await saveLocation(currentCard.id);
      showToast('❤️ Saved!');
      triggerHaptic('success');
    }

    removeCard(currentIndex);

    // Prefetch more cards when running low
    if (cards.length - currentIndex < 5) {
      fetchMore();
    }
  };

  const { bind, swipeState } = useSwipeGesture({
    onSwipeLeft: () => handleSwipe('left'),
    onSwipeRight: () => handleSwipe('right'),
    threshold: 150, // px to trigger swipe
  });

  if (isLoading) return <SwipeLoading />;
  if (!currentCard) return <SwipeEmpty onRestart={fetchMore} />;

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-neutral-950 to-neutral-900">
      {/* Progress indicator */}
      <SwipeProgress current={currentIndex + 1} total={limit} />

      {/* Card stack (show next 2 cards behind) */}
      <AnimatePresence>
        {cards.slice(currentIndex, currentIndex + 3).map((card, idx) => (
          <SwipeCard
            key={card.id}
            location={card}
            isTop={idx === 0}
            zIndex={3 - idx}
            bind={idx === 0 ? bind : undefined}
            swipeState={idx === 0 ? swipeState : undefined}
          />
        ))}
      </AnimatePresence>

      {/* Manual controls */}
      <SwipeControls
        onSkip={() => handleSwipe('left')}
        onSave={() => handleSwipe('right')}
      />
    </div>
  );
}
```

### Swipe Gesture Hook

```typescript
// src/components/swipe/hooks/useSwipeGesture.ts

import { useSpring } from 'framer-motion';
import { useDrag } from 'react-use-gesture';

interface UseSwipeGestureProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 150
}: UseSwipeGestureProps) {
  const [{ x, rotate, opacity }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    opacity: 1
  }));

  const bind = useDrag(({ down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2; // Fast swipe
    const dir = xDir < 0 ? 'left' : 'right';

    if (!down && trigger && Math.abs(mx) > threshold) {
      // Swipe complete - animate off screen
      const exitX = dir === 'right' ? window.innerWidth : -window.innerWidth;

      api.start({
        x: exitX,
        rotate: dir === 'right' ? 25 : -25,
        opacity: 0,
        config: { duration: 300 },
        onRest: () => {
          // Callback when animation finishes
          dir === 'right' ? onSwipeRight() : onSwipeLeft();
          // Reset for next card
          api.start({ x: 0, rotate: 0, opacity: 1, immediate: true });
        }
      });
    } else if (down) {
      // While dragging
      api.start({
        x: mx,
        rotate: mx / 20,
        opacity: 1 - Math.abs(mx) / 300,
        immediate: true
      });
    } else {
      // Snap back
      api.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        config: { tension: 300, friction: 30 }
      });
    }
  });

  return {
    bind,
    swipeState: { x, rotate, opacity }
  };
}
```

### Card Queue Hook

```typescript
// src/components/swipe/hooks/useSwipeQueue.ts

import { useState, useEffect } from 'react';
import { useSearchLocations } from '@/hooks/useLocations';
import type { Location } from '@/types';

interface UseSwipeQueueProps {
  vibes?: string[];
  city?: string;
  limit: number;
}

export function useSwipeQueue({ vibes, city, limit }: UseSwipeQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Location[]>([]);

  const { data, isLoading, fetchNextPage } = useSearchLocations(
    { vibes, city },
    1,
    limit
  );

  useEffect(() => {
    if (data?.locations) {
      setCards(data.locations);
    }
  }, [data]);

  const removeCard = (index: number) => {
    setCurrentIndex(prev => prev + 1);
  };

  const fetchMore = async () => {
    await fetchNextPage();
  };

  return {
    cards,
    currentIndex,
    isLoading,
    fetchMore,
    removeCard
  };
}
```

---

## 📊 Analytics Events to Track

```typescript
// Track user behavior for optimization

analytics.track('swipe_session_started', {
  vibes: selectedVibes,
  city: userCity,
  total_cards: cardCount
});

analytics.track('card_swiped', {
  direction: 'right' | 'left',
  location_id: cardId,
  time_spent_viewing: durationInSeconds,
  swipe_speed: velocity
});

analytics.track('swipe_session_completed', {
  total_swiped: count,
  saved_count: savedCount,
  skipped_count: skippedCount,
  completion_rate: savedCount / count,
  average_time_per_card: avgTime
});
```

---

## 🎮 Haptic Feedback Patterns

```typescript
// Mobile vibration patterns for tactile feedback

// Light tap when card starts moving
if (Math.abs(dragX) > 10) {
  navigator.vibrate(10); // 10ms light vibration
}

// Success pattern when saved
if (swipeDirection === 'right') {
  navigator.vibrate([50, 100, 50]); // Double pulse
}

// Quick buzz when skipped
if (swipeDirection === 'left') {
  navigator.vibrate(30); // Single short buzz
}

// Celebration when completing a set
if (completedAllCards) {
  navigator.vibrate([100, 50, 100, 50, 200]); // Victory pattern
}
```

---

## 🎨 Empty States

### All Cards Swiped
```
┌─────────────────────────────────────┐
│                                     │
│         🎉                          │
│                                     │
│    You've seen them all!            │
│                                     │
│    You saved 7 amazing spots        │
│    and skipped 13 others            │
│                                     │
│    [View Saved Places]              │
│    [Get More Recommendations]       │
│                                     │
└─────────────────────────────────────┘
```

### No More Cards in Area
```
┌─────────────────────────────────────┐
│                                     │
│         🗺️                          │
│                                     │
│    No more spots nearby             │
│                                     │
│    Try expanding your search area   │
│    or changing your vibes           │
│                                     │
│    [Search Another Area]            │
│    [Try Different Vibes]            │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚀 Performance Optimization

### Image Preloading
```typescript
// Preload next 3 card images
useEffect(() => {
  const nextCards = cards.slice(currentIndex + 1, currentIndex + 4);
  nextCards.forEach(card => {
    const img = new Image();
    img.src = card.photos[0];
  });
}, [currentIndex, cards]);
```

### Lazy Loading
```typescript
// Only render visible + next 2 cards
const visibleCards = cards.slice(
  Math.max(0, currentIndex - 1),
  currentIndex + 3
);
```

### Animation Frame Throttling
```typescript
// Throttle drag updates to 60fps
const throttledUpdate = useCallback(
  throttle((x, rotate) => {
    api.start({ x, rotate });
  }, 16), // ~60fps
  []
);
```

---

## 🧪 Testing Checklist

### Gesture Testing
- [ ] Swipe right saves location
- [ ] Swipe left skips location
- [ ] Partial swipe snaps back
- [ ] Fast swipe triggers earlier
- [ ] Buttons work same as swipe
- [ ] Works with mouse (desktop)
- [ ] Works with touch (mobile)
- [ ] Works with trackpad gestures

### Animation Testing
- [ ] Smooth 60fps during drag
- [ ] No jank on card entry
- [ ] Confetti appears on save
- [ ] Haptic feedback works (mobile)
- [ ] Progress updates correctly
- [ ] Empty state appears correctly

### Edge Cases
- [ ] Last card behavior
- [ ] No cards available
- [ ] Network error mid-swipe
- [ ] User logs out mid-session
- [ ] Rapid swiping (stress test)
- [ ] Orientation change (mobile)

---

## 🎯 Success Metrics

**Week 1 Goals:**
- ✅ 80%+ users complete first swipe session
- ✅ Average 15+ cards viewed per session
- ✅ 40%+ save rate (users save 40% of cards)
- ✅ <1% abandon rate mid-session

**Week 2 Goals:**
- ✅ 50%+ users return for second swipe session
- ✅ 5+ sessions per week (daily habit forming)
- ✅ Average time per card: 3-5 seconds (engagement sweet spot)
- ✅ 25%+ share swipe session results

---

## 💡 Future Enhancements (Post-MVP)

### Version 1.1
- Double-tap card to see more details
- Swipe up for "Tell me more" (AI description)
- Swipe down to see similar spots
- Card flip animation for back side info

### Version 1.2
- Multiplayer mode (swipe with friends, find matches)
- Vibe-specific card designs (romantic cards look different)
- Animated backgrounds based on vibe
- Sound effects (optional, toggleable)

### Version 2.0
- AR mode (point camera, swipe real world)
- Voice commands ("Alexa, show me romantic spots")
- Smart watch integration (swipe on wrist)
- TV mode (swipe with remote on AppleTV)

---

## 📱 Mobile-First Considerations

### Thumb Zone Optimization
```
┌─────────────────────────────────────┐
│  [Easy reach - info display]        │ ← Top 25%
│                                     │
│  [Natural hold - card area]         │ ← Middle 50%
│                                     │
│  [Easy reach - actions]             │ ← Bottom 25%
│    [❌ Skip]        [❤️ Save]       │
└─────────────────────────────────────┘
```

### One-Handed Usage
- Primary actions in bottom 1/3
- Card content scrollable but starts above fold
- No critical UI in top corners (hard to reach)

### Battery Efficiency
- Use CSS transforms (GPU accelerated)
- Throttle animations to 60fps
- Pause animations when app backgrounded
- Limit particle effects to 50 confetti pieces

---

## 🎬 Demo Script for Investors

**Show, don't tell (30 seconds):**

1. Open app on phone
2. "Watch this" → Tap "Romantic" vibe
3. Swipe left on 2 cards (fast)
4. Swipe right on perfect spot → Confetti bursts
5. "That's how fast you discover places now"
6. Show saved location instantly appears
7. "Our users are discovering 10x more places because it's this fun"

**Key talking points:**
- "Zero competitors have this"
- "Tinder proved swipe = addictive"
- "15 places discovered in 60 seconds"
- "40% save rate vs 5% click-through on lists"

---

## ✅ Implementation Checklist

### Week 1: Core Functionality
- [ ] SwipeContainer component with gesture detection
- [ ] Card stack visual (3 cards visible)
- [ ] Basic swipe left/right logic
- [ ] Save integration (heart button)
- [ ] Progress indicator
- [ ] Empty states

### Week 2: Polish & Wow
- [ ] Smooth animations (spring physics)
- [ ] Haptic feedback on mobile
- [ ] Confetti celebration effect
- [ ] Card preloading for performance
- [ ] Analytics events
- [ ] Bug fixes and edge cases

**Total Development Time:** 10-12 days
**Resources Needed:** 1 frontend developer
**Dependencies:** Framer Motion (already installed)

---

**This is our secret weapon. Ship it first, ship it fast, ship it beautifully.** 🚀

---

**Document Version:** 1.0
**Priority:** CRITICAL PATH
**Due Date:** End of Week 2
