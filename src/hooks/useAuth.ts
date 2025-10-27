/**
 * Authentication React Query hooks
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithOAuth,
  signOut,
  getCurrentUser,
  onAuthStateChange,
} from '../services/supabase';
import { createUserProfile } from '../services/api';
import toast from 'react-hot-toast';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const authKeys = {
  user: ['auth', 'user'] as const,
  session: ['auth', 'session'] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const { user, error } = await getCurrentUser();
      if (error) throw error;
      return user;
    },
    staleTime: Infinity, // User info rarely changes
    retry: false,
  });
};

/**
 * Auth state listener hook
 */
export const useAuthState = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = onAuthStateChange(async (event, session) => {
      if (import.meta.env.DEV) {
        console.log('Auth event:', event);
      }

      if (session?.user) {
        // Update user query cache
        queryClient.setQueryData(authKeys.user, session.user);
      } else {
        // Clear user query cache
        queryClient.setQueryData(authKeys.user, null);
      }

      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const { data: user } = useCurrentUser();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};

/**
 * Sign up mutation
 */
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => {
      const { data, error } = await signUpWithEmail(email, password, name);
      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        await createUserProfile(
          data.user.id,
          data.user.email!,
          name,
          data.user.user_metadata?.avatar_url
        );
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data.user);
      toast.success('Account created! Please check your email to verify.');
      navigate('/onboarding');
    },
    onError: (error: any) => {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    },
  });
};

/**
 * Sign in mutation
 */
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await signInWithEmail(email, password);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data.user);
      toast.success('Welcome back!');
      navigate('/search');
    },
    onError: (error: any) => {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    },
  });
};

/**
 * OAuth sign in mutation
 */
export const useOAuthSignIn = () => {
  return useMutation({
    mutationFn: async (provider: 'google' | 'apple') => {
      const { data, error } = await signInWithOAuth(provider);
      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      console.error('OAuth error:', error);
      toast.error(error.message || 'Failed to sign in with OAuth');
    },
  });
};

/**
 * Sign out mutation
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { error } = await signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      queryClient.setQueryData(authKeys.user, null);
      toast.success('Signed out successfully');
      navigate('/');
    },
    onError: (error: any) => {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    },
  });
};

/**
 * Protected route helper
 */
export const useRequireAuth = () => {
  const { user, isLoading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Please sign in to continue');
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return { user, isLoading };
};
