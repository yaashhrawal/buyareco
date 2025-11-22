/**
 * buyareco Homepage
 * Vibe-centric landing page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles, Search } from 'lucide-react';
import VibeSelector from '../components/shared/VibeSelector';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const handleVibeToggle = (vibeId: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibeId)
        ? prev.filter(id => id !== vibeId)
        : [...prev, vibeId]
    );
  };

  const handleExplore = () => {
    if (selectedVibes.length > 0) {
      // Pass selected vibes to feed or swipe page via state or query params
      navigate(`/feed?vibes=${selectedVibes.join(',')}`);
    } else {
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-primary-100 dark:border-primary-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-accent-500 p-1.5 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary-900 dark:text-white">
                buyareco
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="text-sm font-medium text-primary-600 dark:text-primary-300 hover:text-primary-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="px-5 py-2.5 text-sm font-medium bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl hover:bg-primary-800 dark:hover:bg-primary-100 transition-all shadow-lg shadow-primary-900/20 dark:shadow-white/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-12 pb-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Match your vibe with locals</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary-900 dark:text-white mb-8 leading-tight">
              Discover places that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-purple-600">
                match your vibe
              </span>
            </h1>

            <p className="text-xl text-primary-600 dark:text-primary-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop relying on paid promotions. Connect with locals who share your taste and get authentic recommendations.
            </p>
          </motion.div>

          {/* Vibe Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/50 dark:bg-primary-900/50 backdrop-blur-xl border border-primary-200 dark:border-primary-800 rounded-3xl p-8 shadow-2xl shadow-primary-900/5 dark:shadow-black/20"
          >
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-6">
              How are you feeling today?
            </h3>

            <VibeSelector
              selectedVibes={selectedVibes}
              onToggle={handleVibeToggle}
              className="mb-8"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-8 py-4 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/30 flex items-center justify-center gap-2 group"
              >
                <Search className="w-5 h-5" />
                Find Matches
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features / Social Proof */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Real Connections",
              desc: "Connect with verified locals, not bots or paid influencers."
            },
            {
              title: "Vibe Matching",
              desc: "Our algorithm matches you with people who share your taste."
            },
            {
              title: "Live Reviews",
              desc: "Get real-time updates and honest feedback on places."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-6 rounded-2xl bg-primary-50 dark:bg-primary-800/50 border border-primary-100 dark:border-primary-800"
            >
              <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-primary-600 dark:text-primary-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
