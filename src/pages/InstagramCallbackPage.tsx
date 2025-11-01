/**
 * Instagram OAuth Callback Page
 * Handles redirect from Instagram after user authorization
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Instagram, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { completeInstagramConnection } from '../services/instagram';
import { useAuth } from '../hooks/useAuth';

export default function InstagramCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your Instagram...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if user is logged in
        if (!user) {
          throw new Error('You must be logged in to connect Instagram');
        }

        // Get authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || 'Instagram authorization failed');
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Complete the Instagram connection
        setMessage('Fetching your photos...');
        const result = await completeInstagramConnection(user.id, code);

        // Success!
        setStatus('success');
        setMessage(`Connected @${result.username} with ${result.photoCount} photos!`);
        toast.success('Instagram connected successfully!');

        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);

      } catch (error: any) {
        console.error('Instagram callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to connect Instagram');
        toast.error(error.message || 'Failed to connect Instagram');

        // Redirect to profile after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, user, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Instagram className="w-10 h-10 text-white" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <X className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
          {status === 'loading' && 'Connecting Instagram'}
          {status === 'success' && 'Instagram Connected!'}
          {status === 'error' && 'Connection Failed'}
        </h2>
        <p className="text-primary-600 dark:text-primary-400 mb-8">{message}</p>

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="inline-block w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
        )}

        {/* Manual redirect button */}
        {status !== 'loading' && (
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl font-medium hover:bg-primary-800 dark:hover:bg-primary-100 transition-all"
          >
            Go to Profile
          </button>
        )}
      </div>
    </div>
  );
}
