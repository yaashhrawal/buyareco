/**
 * Message-related React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  sendMessage,
  getMessagesForRequest,
  markMessageAsRead,
} from '../services/api';
import type { CreateMessageData } from '../types';
import toast from 'react-hot-toast';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const messageKeys = {
  all: ['messages'] as const,
  forRequest: (requestId: string) => ['messages', 'request', requestId] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get messages for a specific request
 */
export const useMessagesForRequest = (requestId: string) => {
  return useQuery({
    queryKey: messageKeys.forRequest(requestId),
    queryFn: () => getMessagesForRequest(requestId),
    enabled: !!requestId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time feel
    staleTime: 0, // Always fetch fresh data
  });
};

/**
 * Send a new message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ senderId, data }: { senderId: string; data: CreateMessageData }) =>
      sendMessage(senderId, data),
    onSuccess: (_data, variables) => {
      // Invalidate messages for this request
      queryClient.invalidateQueries({
        queryKey: messageKeys.forRequest(variables.data.request_id),
      });
    },
    onError: (error: any) => {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    },
  });
};

/**
 * Mark a message as read
 */
export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => markMessageAsRead(messageId),
    onSuccess: () => {
      // Invalidate all message queries to update read status
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
    onError: (error: any) => {
      console.error('Failed to mark message as read:', error);
    },
  });
};
