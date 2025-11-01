/**
 * Auth Callback Page
 * Handles OAuth redirect callbacks from providers (Google, Facebook, etc.)
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/auth');
          return;
        }

        if (session) {
          // Check if this is a new user (first time login)
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!profile) {
            // New user - go to onboarding
            toast.success('Welcome to BuyaReco!');
            navigate('/onboarding');
          } else {
            // Existing user - go to feed
            toast.success('Welcome back!');
            navigate('/feed');
          }
        } else {
          // No session - redirect to auth page
          navigate('/auth');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast.error('Something went wrong. Please try again.');
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="w-8 h-8 text-accent-500 animate-pulse" />
          <span className="text-2xl font-bold text-primary-900 dark:text-white">buyareco</span>
        </div>
        <div className="inline-block w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-primary-600 dark:text-primary-400">Completing sign in...</p>
      </div>
    </div>
  );
}
