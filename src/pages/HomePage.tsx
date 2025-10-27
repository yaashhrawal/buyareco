/**
 * buyareco Homepage
 * Minimalist design focused on P2P recommendation value proposition
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { initializeSEO } from '../utils/seo';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize SEO for homepage
    initializeSEO();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950">
      {/* Minimal Navigation */}
      <nav className="border-b border-primary-200 dark:border-primary-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-accent-500" />
              <span className="text-xl font-semibold tracking-tight text-primary-900 dark:text-white">
                buyareco
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/auth')}
                className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="px-5 py-2 text-sm font-medium bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-lg hover:bg-primary-800 dark:hover:bg-primary-100 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Minimal & Clean */}
      <main className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto py-20 md:py-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-900 dark:text-white mb-6 leading-tight">
            Get recommendations
            <br />
            from people who
            <br />
            <span className="text-accent-500">actually live there</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-600 dark:text-primary-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Traveling to a new city? Describe what you're looking for, and locals will suggest the perfect spots just for you.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={() => navigate('/feed')}
              className="px-8 py-4 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl font-medium hover:bg-primary-800 dark:hover:bg-primary-100 transition-all hover:shadow-lg inline-flex items-center gap-2"
            >
              Explore Feed
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/requests/new')}
              className="px-8 py-4 bg-white dark:bg-primary-900 text-primary-900 dark:text-white border border-primary-200 dark:border-primary-800 rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-800 transition-all inline-flex items-center gap-2"
            >
              Ask for Recommendations
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* How It Works - Minimal Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
            <motion.div
              className="p-8 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-2xl text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
                Travelers Ask
              </h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
                "I need a calm, aesthetic cafe in Udaipur's old city to work from. Any suggestions?"
              </p>
            </motion.div>

            <motion.div
              className="p-8 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-2xl text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
                Locals Suggest
              </h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
                "Try Jheel's Cafe near Lake Pichola. Peaceful vibe, great coffee, and perfect for working."
              </p>
            </motion.div>
          </div>

          {/* Stats - Simple Numbers */}
          <div className="flex flex-wrap items-center justify-center gap-12 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-900 dark:text-white mb-1">1,234</div>
              <div className="text-sm text-primary-500 dark:text-primary-500">Active Locals</div>
            </div>
            <div className="w-px h-12 bg-primary-200 dark:bg-primary-800" />
            <div>
              <div className="text-3xl font-bold text-primary-900 dark:text-white mb-1">5,678</div>
              <div className="text-sm text-primary-500 dark:text-primary-500">Recommendations</div>
            </div>
            <div className="w-px h-12 bg-primary-200 dark:bg-primary-800" />
            <div>
              <div className="text-3xl font-bold text-primary-900 dark:text-white mb-1">50+</div>
              <div className="text-sm text-primary-500 dark:text-primary-500">Cities</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer - Minimal */}
      <footer className="border-t border-primary-200 dark:border-primary-800 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-500" />
              <span className="text-sm font-medium text-primary-900 dark:text-white">buyareco</span>
            </div>
            <div className="text-sm text-primary-500 dark:text-primary-500">
              © 2025 buyareco. Connecting travelers with locals.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
