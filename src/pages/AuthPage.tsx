/**
 * Modern Authentication Page
 * Multiple auth providers: Google, Email, Phone, Instagram
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone, Instagram, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { signUpWithEmail, signInWithEmail, signInWithOAuth } from '../services/supabase';

type AuthMode = 'signin' | 'signup';
type AuthMethod = 'email' | 'phone' | 'google' | 'instagram';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
  });

  const handleAuth = async (authMethod: AuthMethod) => {
    setIsLoading(true);

    try {
      if (authMethod === 'google') {
        // Google OAuth
        const { error } = await signInWithOAuth('google');
        if (error) throw error;
        // User will be redirected to Google, then back to app
        return;
      } else if (authMethod === 'instagram') {
        // Instagram not natively supported by Supabase
        // For now, show a message. Can be implemented with custom backend
        toast('Instagram login coming soon! Use Google or Email for now.', {
          icon: '📸',
          duration: 4000,
        });
        setIsLoading(false);
        return;
      } else if (authMethod === 'email') {
        // Email/Password authentication validation
        if (!formData.email || !formData.password) {
          toast.error('Please enter email and password');
          setIsLoading(false);
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error('Please enter a valid email address');
          setIsLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        if (mode === 'signup') {
          // Validate name for signup
          if (!formData.name || formData.name.trim().length < 2) {
            toast.error('Please enter your full name');
            setIsLoading(false);
            return;
          }

          // Sign up
          const { data, error } = await signUpWithEmail(
            formData.email.trim(),
            formData.password,
            formData.name.trim()
          );

          if (error) throw error;

          if (data?.user?.identities?.length === 0) {
            // Email already exists
            toast.error('This email is already registered. Try signing in instead.');
            setIsLoading(false);
            return;
          }

          // Check if email confirmation is required
          if (data?.user && !data?.session) {
            toast.success('Account created! Check your email to verify before signing in.', {
              duration: 6000,
            });
          } else {
            toast.success('Account created successfully!');
          }

          navigate('/onboarding');
        } else {
          // Sign in
          const { error } = await signInWithEmail(formData.email.trim(), formData.password);
          if (error) throw error;
          toast.success('Welcome back!');
          navigate('/feed');
        }
      } else if (authMethod === 'phone') {
        // Phone auth - Supabase supports this but needs Twilio setup
        toast('Phone authentication coming soon! Use email or Google for now.', {
          icon: '📱',
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('Auth error:', error);

      // Handle specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Please verify your email before signing in');
      } else {
        toast.error(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-accent-500" />
            <span className="text-2xl font-bold text-primary-900 dark:text-white">buyareco</span>
          </div>
          <p className="text-primary-600 dark:text-primary-400">
            {mode === 'signup' ? 'Join the community' : 'Welcome back'}
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          className="flex bg-primary-100 dark:bg-primary-900 rounded-xl p-1 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-primary-800 text-primary-900 dark:text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              mode === 'signin'
                ? 'bg-white dark:bg-primary-800 text-primary-900 dark:text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400'
            }`}
          >
            Sign In
          </button>
        </motion.div>

        {/* Social Auth Buttons */}
        <motion.div
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Google */}
          <button
            onClick={() => handleAuth('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl font-medium text-primary-900 dark:text-white hover:border-accent-500 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Instagram */}
          <button
            onClick={() => handleAuth('instagram')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Instagram className="w-5 h-5" />
            Continue with Instagram
          </button>
        </motion.div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-200 dark:border-primary-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-primary-950 text-primary-500">or</span>
          </div>
        </div>

        {/* Method Selector */}
        <motion.div
          className="flex gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              method === 'email'
                ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 border-2 border-accent-500'
                : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-2 border-transparent'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">Email</span>
          </button>
          <button
            onClick={() => setMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              method === 'phone'
                ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 border-2 border-accent-500'
                : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-2 border-transparent'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Phone</span>
          </button>
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={method}
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth(method);
            }}
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-all"
                  required
                />
              </div>
            )}

            {/* Email or Phone */}
            {method === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-all"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-all"
                  required
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 bg-white dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-all"
                required
              />
              {mode === 'signup' && (
                <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                  At least 6 characters required
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl font-semibold hover:bg-primary-800 dark:hover:bg-primary-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* Benefits (signup only) */}
        {mode === 'signup' && (
          <motion.div
            className="mt-8 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 text-sm text-primary-600 dark:text-primary-400">
              <div className="flex-shrink-0 w-5 h-5 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-accent-600 dark:text-accent-400" />
              </div>
              <span>Ask for recommendations anywhere in the world</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-primary-600 dark:text-primary-400">
              <div className="flex-shrink-0 w-5 h-5 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-accent-600 dark:text-accent-400" />
              </div>
              <span>Share your local expertise and build reputation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-primary-600 dark:text-primary-400">
              <div className="flex-shrink-0 w-5 h-5 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-accent-600 dark:text-accent-400" />
              </div>
              <span>Connect with travelers and locals worldwide</span>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
