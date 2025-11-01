/**
 * Instagram Photo Grid Component
 * Displays user's top 6 Instagram photos in a grid (similar to Hinge)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, X, ExternalLink, Loader2 } from 'lucide-react';

interface InstagramPhotoGridProps {
  photos: string[] | null;
  username?: string | null;
  isOwnProfile?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  isConnecting?: boolean;
}

export default function InstagramPhotoGrid({
  photos,
  username,
  isOwnProfile = false,
  onConnect,
  onDisconnect,
  isConnecting = false,
}: InstagramPhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Handle image load error
  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  // No photos connected
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-4">
          <Instagram className="w-5 h-5 text-primary-900 dark:text-white" />
          <h3 className="text-lg font-bold text-primary-900 dark:text-white">Instagram</h3>
        </div>

        {isOwnProfile ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
              Connect Your Instagram
            </h4>
            <p className="text-primary-600 dark:text-primary-400 mb-6 max-w-sm mx-auto">
              Showcase your favorite moments and let people see your vibe through your photos
            </p>
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Instagram className="w-5 h-5" />
                  Connect Instagram
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-primary-500 dark:text-primary-400">
              No Instagram photos connected yet
            </p>
          </div>
        )}
      </div>
    );
  }

  // Display top 6 photos
  const displayPhotos = photos.slice(0, 6);

  return (
    <div className="bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Instagram className="w-5 h-5 text-primary-900 dark:text-white" />
          <h3 className="text-lg font-bold text-primary-900 dark:text-white">Instagram</h3>
          {username && (
            <a
              href={`https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              @{username}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {isOwnProfile && onDisconnect && (
          <button
            onClick={onDisconnect}
            className="text-sm text-primary-500 hover:text-red-500 transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>

      {/* Photo Grid (3x2 layout like Hinge) */}
      <div className="grid grid-cols-3 gap-2">
        {displayPhotos.map((photo, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedPhoto(photo)}
            className="aspect-square bg-primary-100 dark:bg-primary-800 rounded-lg overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent-500"
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
          >
            {!imageErrors.has(index) ? (
              <img
                src={photo}
                alt={`Instagram photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(index)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Instagram className="w-8 h-8 text-primary-400" />
              </div>
            )}
          </motion.button>
        ))}

        {/* Fill empty slots if less than 6 photos */}
        {displayPhotos.length < 6 &&
          Array.from({ length: 6 - displayPhotos.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center"
            >
              <Instagram className="w-8 h-8 text-primary-300 dark:text-primary-600" />
            </div>
          ))}
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedPhoto}
                alt="Instagram photo"
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info text */}
      {isOwnProfile && (
        <p className="text-xs text-primary-500 dark:text-primary-400 mt-4 text-center">
          Your top 6 photos from Instagram • Updates automatically
        </p>
      )}
    </div>
  );
}
