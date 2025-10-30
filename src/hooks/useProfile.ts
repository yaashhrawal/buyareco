/**
 * User profile React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../services/api';
import type { User } from '../types';
import toast from 'react-hot-toast';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const profileKeys = {
  all: ['profiles'] as const,
  detail: (userId: string) => ['profiles', 'detail', userId] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get user profile by ID
 */
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<User> }) =>
      updateUserProfile(userId, updates),
    onSuccess: (data, variables) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(profileKeys.detail(variables.userId), data);
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(variables.userId) });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    },
  });
};
