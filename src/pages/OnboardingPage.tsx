/**
 * Onboarding Page
 * Users select roles and build their profile
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plane,
  Home,
  Users,
  Instagram,
  ArrowRight,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

type OnboardingStep = 'role' | 'local-setup' | 'instagram' | 'interests';

const CITIES = [
  'Udaipur',
  'Jaipur',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Goa',
  'Kerala',
  'Varanasi',
  'Agra',
  'Rishikesh',
];

const EXPERTISE_TAGS = [
  'cafes',
  'restaurants',
  'nightlife',
  'culture',
  'food',
  'art',
  'music',
  'nature',
  'adventure',
  'shopping',
  'photography',
  'history',
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('role');
  const [isTraveler, setIsTraveler] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  // Local profile data
  const [localProfile, setLocalProfile] = useState({
    cities: [] as string[],
    yearsInCity: 5,
    expertise: [] as string[],
    bio: '',
    instagramHandle: '',
  });

  const handleRoleSelect = (role: 'traveler' | 'local' | 'both') => {
    if (role === 'traveler') {
      setIsTraveler(true);
      setIsLocal(false);
      // Skip local setup
      setStep('instagram');
    } else if (role === 'local') {
      setIsTraveler(false);
      setIsLocal(true);
      setStep('local-setup');
    } else {
      setIsTraveler(true);
      setIsLocal(true);
      setStep('local-setup');
    }
  };

  const toggleCity = (city: string) => {
    setLocalProfile((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };

  const toggleExpertise = (tag: string) => {
    setLocalProfile((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(tag)
        ? prev.expertise.filter((t) => t !== tag)
        : [...prev.expertise, tag],
    }));
  };

  const handleComplete = async () => {
    try {
      // TODO: Save to Supabase
      console.log('Onboarding complete:', {
        isTraveler,
        isLocal,
        localProfile,
      });

      toast.success('Welcome to buyareco! 🎉');
      navigate('/feed');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete setup');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-6 h-6 text-accent-500" />
            <span className="text-lg font-semibold text-primary-900 dark:text-white">buyareco</span>
          </div>
          <div className="flex gap-2">
            {['role', 'local-setup', 'instagram'].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s === step || (s === 'local-setup' && !isLocal)
                    ? 'bg-accent-500'
                    : 'bg-primary-200 dark:bg-primary-800'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-3">
                  How do you want to use buyareco?
                </h1>
                <p className="text-primary-600 dark:text-primary-400">
                  You can always change this later
                </p>
              </div>

              <div className="space-y-4">
                {/* Traveler */}
                <button
                  onClick={() => handleRoleSelect('traveler')}
                  className="w-full p-6 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-2xl hover:border-accent-500 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plane className="w-7 h-7 text-accent-600 dark:text-accent-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
                        I'm a Traveler
                      </h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        I want to get recommendations from locals when I travel
                      </p>
                    </div>
                  </div>
                </button>

                {/* Local */}
                <button
                  onClick={() => handleRoleSelect('local')}
                  className="w-full p-6 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-2xl hover:border-accent-500 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Home className="w-7 h-7 text-accent-600 dark:text-accent-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
                        I'm a Local
                      </h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        I want to share my city's hidden gems with travelers
                      </p>
                    </div>
                  </div>
                </button>

                {/* Both */}
                <button
                  onClick={() => handleRoleSelect('both')}
                  className="w-full p-6 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">Both!</h3>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                          Recommended
                        </span>
                      </div>
                      <p className="text-sm text-white/90">
                        Get recommendations when traveling AND share local knowledge
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Local Setup */}
          {step === 'local-setup' && (
            <motion.div
              key="local-setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-3">
                  Build Your Local Profile
                </h1>
                <p className="text-primary-600 dark:text-primary-400">
                  Help travelers know your expertise
                </p>
              </div>

              {/* Cities */}
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-3">
                  Which cities do you know well? <span className="text-accent-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        localProfile.cities.includes(city)
                          ? 'bg-accent-500 text-white'
                          : 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-white hover:bg-primary-200 dark:hover:bg-primary-800'
                      }`}
                    >
                      {city}
                      {localProfile.cities.includes(city) && <Check className="inline-block w-4 h-4 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Years in city */}
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-3">
                  How long have you lived there?
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={localProfile.yearsInCity}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, yearsInCity: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-accent-500">{localProfile.yearsInCity}</span>
                  <span className="text-sm text-primary-600 dark:text-primary-400 ml-2">years</span>
                </div>
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-3">
                  What are you an expert in?
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleExpertise(tag)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        localProfile.expertise.includes(tag)
                          ? 'bg-accent-500 text-white'
                          : 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-white hover:bg-primary-200 dark:hover:bg-primary-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-3">
                  Tell travelers about yourself
                </label>
                <textarea
                  value={localProfile.bio}
                  onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                  placeholder="I've lived in Udaipur for 25 years and love showing people the hidden cafes and sunset spots..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-all resize-none"
                />
              </div>

              <button
                onClick={() => setStep('instagram')}
                disabled={localProfile.cities.length === 0}
                className="w-full px-6 py-4 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl font-semibold hover:bg-primary-800 dark:hover:bg-primary-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step 3: Instagram */}
          {step === 'instagram' && (
            <motion.div
              key="instagram"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-3">
                  Link Your Instagram
                </h1>
                <p className="text-primary-600 dark:text-primary-400">
                  Show travelers you're genuine (optional but recommended)
                </p>
              </div>

              <div className="p-6 bg-primary-50 dark:bg-primary-900 rounded-2xl border-2 border-primary-200 dark:border-primary-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900 dark:text-white">
                      Why link Instagram?
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Build trust with your profile
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-primary-600 dark:text-primary-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-500" />
                    Verify you're a real person
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-500" />
                    Show your vibe and style
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-500" />
                    Get more trust from travelers
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-3">
                  Instagram Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">@</span>
                  <input
                    type="text"
                    value={localProfile.instagramHandle}
                    onChange={(e) =>
                      setLocalProfile({ ...localProfile, instagramHandle: e.target.value })
                    }
                    placeholder="yourusername"
                    className="w-full pl-8 pr-4 py-3 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleComplete}
                  className="flex-1 px-6 py-4 bg-white dark:bg-primary-900 text-primary-900 dark:text-white border-2 border-primary-200 dark:border-primary-800 rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-800 transition-all"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 px-6 py-4 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl font-semibold hover:bg-primary-800 dark:hover:bg-primary-100 transition-all inline-flex items-center justify-center gap-2"
                >
                  Complete Setup
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
