/**
 * Feed Page - Swipe/Reel Interface
 * Modern Gen Z interface for browsing recommendation requests
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import {
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  User,
  Clock,
  TrendingUp,
  Home,
  Send,
  X,
  Instagram,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data - will be replaced with real data
const MOCK_REQUESTS = [
  {
    id: '1',
    title: 'Calm aesthetic cafe to work from',
    description:
      "Need a peaceful cafe with good WiFi in Udaipur's old city. Looking for that aesthetic vibe where I can work on my laptop for 3-4 hours. Budget-friendly would be great!",
    city: 'Udaipur',
    area: 'Old City',
    vibes: ['calm', 'aesthetic', 'productive'],
    requester: {
      name: 'Abhi',
      username: 'abhi_traveler',
      avatar: null,
      instagramHandle: 'abhi.travels',
    },
    suggestionsCount: 3,
    createdAt: '2h ago',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=1200&fit=crop',
  },
  {
    id: '2',
    title: 'Best sunrise viewpoint for photography',
    description:
      'Visiting Jaipur next week and want to catch an epic sunrise with my camera. Where do locals go? Looking for something less touristy but still accessible.',
    city: 'Jaipur',
    area: null,
    vibes: ['adventure', 'photogenic', 'peaceful'],
    requester: {
      name: 'Sarah Chen',
      username: 'sarahwanders',
      avatar: null,
      instagramHandle: 'sarahcaptures',
    },
    suggestionsCount: 7,
    createdAt: '5h ago',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=1200&fit=crop',
  },
  {
    id: '3',
    title: 'Authentic street food spot',
    description:
      "I'm done with tourist traps! Where do locals actually eat? Looking for the best street food in Delhi - the real deal, not the sanitized version. My stomach can handle it 😄",
    city: 'Delhi',
    area: 'Old Delhi',
    vibes: ['authentic', 'food', 'adventure'],
    requester: {
      name: 'Marco',
      username: 'marco_eats',
      avatar: null,
      instagramHandle: 'marco.foodie',
    },
    suggestionsCount: 12,
    createdAt: '1d ago',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1200&fit=crop',
  },
];

export default function FeedPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentRequest = MOCK_REQUESTS[currentIndex];

  // Swipe handlers
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (velocity < 0 || offset < 0) {
        // Swipe up - next request
        nextRequest();
      } else {
        // Swipe down - previous request
        previousRequest();
      }
    } else {
      // Return to center
      controls.start({ y: 0 });
    }
  };

  const nextRequest = () => {
    if (currentIndex < MOCK_REQUESTS.length - 1) {
      controls.start({ y: -window.innerHeight, transition: { duration: 0.3 } }).then(() => {
        setCurrentIndex(currentIndex + 1);
        controls.set({ y: 0 });
      });
    }
  };

  const previousRequest = () => {
    if (currentIndex > 0) {
      controls.start({ y: window.innerHeight, transition: { duration: 0.3 } }).then(() => {
        setCurrentIndex(currentIndex - 1);
        controls.set({ y: 0 });
      });
    }
  };

  const handleLike = () => {
    toast.success('Added to your favorites!');
  };

  const handleSuggest = () => {
    setShowSuggestionForm(true);
  };

  const submitSuggestion = () => {
    if (!suggestionText.trim()) {
      toast.error('Please write a suggestion');
      return;
    }

    // TODO: Submit to backend
    toast.success('Suggestion sent! 🎉');
    setShowSuggestionForm(false);
    setSuggestionText('');
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') nextRequest();
      if (e.key === 'ArrowDown') previousRequest();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-white" />
            <span className="text-lg font-semibold text-white">buyareco</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/requests/new')}
              className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-white/30 transition-all"
            >
              + Ask
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Scroll Hints */}
      <div className="absolute top-20 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={previousRequest}
          disabled={currentIndex === 0}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all disabled:opacity-30"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={nextRequest}
          disabled={currentIndex === MOCK_REQUESTS.length - 1}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all disabled:opacity-30"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content - Swipeable */}
      <motion.div
        ref={containerRef}
        className="h-full"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentRequest.image}
            alt={currentRequest.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-end px-6 pb-24">
          {/* Location Tag */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-4 self-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <MapPin className="w-4 h-4" />
            <span>
              {currentRequest.city}
              {currentRequest.area && ` • ${currentRequest.area}`}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {currentRequest.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-white/90 text-base mb-4 line-clamp-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentRequest.description}
          </motion.p>

          {/* Vibes */}
          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {currentRequest.vibes.map((vibe) => (
              <span
                key={vibe}
                className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium"
              >
                #{vibe}
              </span>
            ))}
          </motion.div>

          {/* User Info */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{currentRequest.requester.name}</span>
                {currentRequest.requester.instagramHandle && (
                  <a
                    href={`https://instagram.com/${currentRequest.requester.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Clock className="w-3 h-3" />
                <span>{currentRequest.createdAt}</span>
                <span>•</span>
                <span>{currentRequest.suggestionsCount} suggestions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons - Right Side */}
      <div className="absolute right-6 bottom-32 z-40 flex flex-col gap-6">
        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all">
            <Heart className="w-6 h-6 text-white group-hover:fill-white" />
          </div>
          <span className="text-white text-xs font-medium">Save</span>
        </button>

        {/* Suggest */}
        <button
          onClick={handleSuggest}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 hover:scale-110 transition-all shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Suggest</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Share</span>
        </button>
      </div>

      {/* Suggestion Form Modal */}
      {showSuggestionForm && (
        <motion.div
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowSuggestionForm(false)}
        >
          <motion.div
            className="w-full bg-white dark:bg-primary-900 rounded-t-3xl p-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary-900 dark:text-white">
                Suggest a Place
              </h3>
              <button
                onClick={() => setShowSuggestionForm(false)}
                className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-700 transition-all"
              >
                <X className="w-5 h-5 text-primary-900 dark:text-white" />
              </button>
            </div>

            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="Suggest a place and tell them why it's perfect..."
              rows={6}
              className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-800 border-2 border-primary-200 dark:border-primary-700 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-all resize-none mb-4"
              autoFocus
            />

            <button
              onClick={submitSuggestion}
              className="w-full px-6 py-4 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all inline-flex items-center justify-center gap-2"
            >
              Send Suggestion
              <Send className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 z-40 px-6 py-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-white">
            <Home className="w-6 h-6" />
            <span className="text-xs">Feed</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Trending</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Chats</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
