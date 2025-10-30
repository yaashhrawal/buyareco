/**
 * Browse Requests Page
 * For locals to browse and respond to recommendation requests
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, MessageCircle, Clock, Users, Filter, Search } from 'lucide-react';
import { useRequests } from '../hooks/useRequests';
import { formatDistanceToNow } from '../utils/helpers';

export default function BrowseRequestsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  // Fetch requests with filters
  const { data, isLoading } = useRequests(
    {
      city: selectedCity !== 'all' ? selectedCity : undefined,
      status: 'open',
    },
    1,
    20
  );

  const requests = data?.requests || [];

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
      {/* Header */}
      <header className="bg-white dark:bg-primary-900 border-b border-primary-200 dark:border-primary-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-500" />
              <span className="text-lg font-semibold text-primary-900 dark:text-white">buyareco</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests..."
                className="w-full pl-12 pr-4 py-3 bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
              />
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
              >
                <option value="all">All Cities</option>
                <option value="udaipur">Udaipur</option>
                <option value="jaipur">Jaipur</option>
                <option value="delhi">Delhi</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-white mb-2">
            Help Travelers Discover Your City
          </h1>
          <p className="text-primary-600 dark:text-primary-400">
            Share your local knowledge and suggest perfect spots
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-primary-600 dark:text-primary-400">Loading requests...</p>
          </div>
        )}

        {/* Requests List */}
        {!isLoading && requests.length > 0 && (
          <div className="space-y-4 max-w-4xl">
            {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/requests/${request.id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-1">
                    {request.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-primary-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {request.city}
                        {request.area && ` • ${request.area}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(request.created_at))}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full text-sm font-medium">
                  <MessageCircle className="w-4 h-4" />
                  <span>{request.suggestions_count}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-primary-600 dark:text-primary-400 mb-4 line-clamp-2">
                {request.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {request.vibe_preferences?.map((vibe) => (
                  <span
                    key={vibe}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                  >
                    {vibe}
                  </span>
                ))}
                {request.place_type && (
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                    {request.place_type}
                  </span>
                )}
                {request.budget_level && (
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                    {'$'.repeat(request.budget_level)}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-primary-200 dark:border-primary-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-200 dark:bg-primary-700 rounded-full flex items-center justify-center overflow-hidden">
                    {request.requester?.avatar_url ? (
                      <img
                        src={request.requester.avatar_url}
                        alt={request.requester.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-primary-900 dark:text-white">
                    {request.requester?.name || 'Anonymous'}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/requests/${request.id}/suggest`);
                  }}
                  className="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
                >
                  Suggest a Place
                </button>
              </div>
            </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && requests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
              No requests yet
            </h3>
            <p className="text-primary-600 dark:text-primary-400">
              Check back soon for travelers looking for recommendations
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
