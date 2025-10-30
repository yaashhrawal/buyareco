/**
 * Recommendation Request React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequest, getRequests, getRequestById } from '../services/api';
import type { CreateRequestData } from '../types';
import toast from 'react-hot-toast';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const requestKeys = {
  all: ['requests'] as const,
  list: (filters?: any) => ['requests', 'list', filters] as const,
  detail: (id: string) => ['requests', 'detail', id] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get all requests with optional filters
 */
export const useRequests = (
  filters?: {
    city?: string;
    status?: 'open' | 'resolved' | 'closed';
    user_id?: string;
  },
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: requestKeys.list({ filters, page, limit }),
    queryFn: () => getRequests(filters, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get a single request by ID
 */
export const useRequest = (id: string) => {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: () => getRequestById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Create a new recommendation request
 */
export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: CreateRequestData }) =>
      createRequest(userId, data),
    onSuccess: () => {
      // Invalidate all request lists
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      toast.success('Request posted! Locals will start suggesting soon.');
    },
    onError: (error: any) => {
      console.error('Failed to create request:', error);
      toast.error('Failed to post request. Please try again.');
    },
  });
};
