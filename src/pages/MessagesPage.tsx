/**
 * Messages Page
 * P2P messaging interface for travelers and locals
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  MapPin,
  Clock,
  User,
  MessageCircle,
  CheckCheck,
  Check,
} from 'lucide-react';
import { useMessagesForRequest, useSendMessage, useMarkMessageAsRead } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from '../utils/helpers';
import type { MessageWithUsers } from '../types';

export default function MessagesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('request') || '';

  const { user } = useAuth();
  const { data: messages, isLoading } = useMessagesForRequest(requestId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessageAsRead();

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      // Mark unread messages as read
      const unreadMessages = messages.filter(
        (msg) => !msg.is_read && msg.receiver_id === user?.id
      );
      unreadMessages.forEach((msg) => {
        markAsReadMutation.mutate(msg.id);
      });
    }
  }, [messages, user?.id, markAsReadMutation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user || !requestId) return;

    // Determine receiver from the conversation
    const lastMessage = messages?.[messages.length - 1];
    const receiverId = lastMessage
      ? lastMessage.sender_id === user.id
        ? lastMessage.receiver_id
        : lastMessage.sender_id
      : '';

    if (!receiverId) {
      console.error('Cannot determine receiver');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        senderId: user.id,
        data: {
          request_id: requestId,
          receiver_id: receiverId,
          content: newMessage.trim(),
        },
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (msgs: MessageWithUsers[]) => {
    const groups: { [key: string]: MessageWithUsers[] } = {};

    msgs.forEach((msg) => {
      const date = new Date(msg.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  const messageGroups = messages ? groupMessagesByDate(messages) : {};

  // Determine conversation partner
  const conversationPartner = messages?.[0]
    ? messages[0].sender_id === user?.id
      ? messages[0].receiver
      : messages[0].sender
    : null;

  if (!requestId) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary-950 flex items-center justify-center p-6">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary-400" />
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
            No Conversation Selected
          </h2>
          <p className="text-primary-600 dark:text-primary-400 mb-6">
            Select a conversation from your messages to start chatting
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-primary-200 dark:border-primary-800 bg-white dark:bg-primary-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            {conversationPartner && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-200 dark:bg-primary-700 rounded-full flex items-center justify-center">
                  {conversationPartner.avatar_url ? (
                    <img
                      src={conversationPartner.avatar_url}
                      alt={conversationPartner.name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-primary-900 dark:text-white">
                    {conversationPartner.name || 'Anonymous'}
                  </h2>
                  {conversationPartner.is_local && (
                    <p className="text-xs text-primary-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Local Expert
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-primary-50 dark:bg-primary-950">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-primary-600 dark:text-primary-400">Loading messages...</p>
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(messageGroups).map(([date, msgs]) => (
                <div key={date}>
                  {/* Date Divider */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="px-4 py-1 bg-primary-200 dark:bg-primary-800 rounded-full text-xs font-medium text-primary-600 dark:text-primary-400">
                      {date}
                    </div>
                  </div>

                  {/* Messages */}
                  <AnimatePresence>
                    {msgs.map((message, index) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      const showAvatar =
                        index === msgs.length - 1 ||
                        msgs[index + 1]?.sender_id !== message.sender_id;

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex gap-3 mb-4 ${
                            isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          {/* Avatar */}
                          <div className="w-8 h-8 flex-shrink-0">
                            {showAvatar && (
                              <div className="w-full h-full bg-primary-200 dark:bg-primary-700 rounded-full flex items-center justify-center">
                                {message.sender.avatar_url ? (
                                  <img
                                    src={message.sender.avatar_url}
                                    alt={message.sender.name || 'User'}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`max-w-[70%] ${
                              isOwnMessage ? 'items-end' : 'items-start'
                            } flex flex-col`}
                          >
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                isOwnMessage
                                  ? 'bg-primary-900 dark:bg-primary-600 text-white'
                                  : 'bg-white dark:bg-primary-800 text-primary-900 dark:text-white border border-primary-200 dark:border-primary-700'
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                            </div>

                            {/* Timestamp and Read Status */}
                            <div
                              className={`flex items-center gap-1 mt-1 px-2 ${
                                isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                              }`}
                            >
                              <div className="flex items-center gap-1 text-xs text-primary-500">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {formatDistanceToNow(new Date(message.created_at))}
                                </span>
                              </div>
                              {isOwnMessage && (
                                <div className="text-primary-500">
                                  {message.is_read ? (
                                    <CheckCheck className="w-4 h-4" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="text-center py-20">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary-400" />
              <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
                No messages yet
              </h3>
              <p className="text-primary-600 dark:text-primary-400">
                Start the conversation by sending a message
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-primary-200 dark:border-primary-800 bg-white dark:bg-primary-900">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
              disabled={sendMessageMutation.isPending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="px-6 py-3 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl font-medium hover:bg-primary-800 dark:hover:bg-primary-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
