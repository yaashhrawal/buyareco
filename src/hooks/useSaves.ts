/**
 * Save/Wishlist-related React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveLocation,
  unsaveLocation,
  getSavedLocations,
  isLocationSaved,
} from '../services/api';
import toast from 'react-hot-toast';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const saveKeys = {
  all: ['saves'] as const,
  user: (userId: string) => ['saves', 'user', userId] as const,
  check: (userId: string, locationId: string) =>
    ['saves', 'check', userId, locationId] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get user's saved locations
 */
export const useSavedLocations = (userId: string) => {
  return useQuery({
    queryKey: saveKeys.user(userId),
    queryFn: () => getSavedLocations(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Check if a location is saved
 */
export const useIsLocationSaved = (userId: string, locationId: string) => {
  return useQuery({
    queryKey: saveKeys.check(userId, locationId),
    queryFn: () => isLocationSaved(userId, locationId),
    enabled: !!userId && !!locationId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Save a location mutation
 */
export const useSaveLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, locationId }: { userId: string; locationId: string }) =>
      saveLocation(userId, locationId),
    onSuccess: (data, variables) => {
      // Invalidate saved locations query
      queryClient.invalidateQueries({ queryKey: saveKeys.user(variables.userId) });
      // Update the check query
      queryClient.setQueryData(
        saveKeys.check(variables.userId, variables.locationId),
        true
      );
      toast.success('Location saved!');
    },
    onError: (error) => {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    },
  });
};

/**
 * Unsave a location mutation
 */
export const useUnsaveLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, locationId }: { userId: string; locationId: string }) =>
      unsaveLocation(userId, locationId),
    onSuccess: (data, variables) => {
      // Invalidate saved locations query
      queryClient.invalidateQueries({ queryKey: saveKeys.user(variables.userId) });
      // Update the check query
      queryClient.setQueryData(
        saveKeys.check(variables.userId, variables.locationId),
        false
      );
      toast.success('Location removed from saves');
    },
    onError: (error) => {
      console.error('Error unsaving location:', error);
      toast.error('Failed to remove location');
    },
  });
};

/**
 * Toggle save status (convenience hook)
 */
export const useToggleSave = () => {
  const saveMutation = useSaveLocation();
  const unsaveMutation = useUnsaveLocation();

  return {
    toggleSave: async (userId: string, locationId: string, isSaved: boolean) => {
      if (isSaved) {
        await unsaveMutation.mutateAsync({ userId, locationId });
      } else {
        await saveMutation.mutateAsync({ userId, locationId });
      }
    },
    isLoading: saveMutation.isPending || unsaveMutation.isPending,
  };
};
