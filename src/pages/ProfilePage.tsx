/**
 * Profile Page
 * User profile view and edit page
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Award,
  Star,
  MessageCircle,
  Edit2,
  Camera,
  Instagram,
  Check,
  X,
  ThumbsUp,
  Users,
} from 'lucide-react';
import { useUserProfile, useUpdateProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const VIBE_OPTIONS = [
  'calm',
  'aesthetic',
  'vibrant',
  'cozy',
  'productive',
  'romantic',
  'adventurous',
  'cultural',
  'social',
  'peaceful',
];

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Use current user's ID if no userId provided
  const profileUserId = userId || currentUser?.id || '';

  const { data: profile, isLoading } = useUserProfile(profileUserId);
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    city: '',
    instagram_handle: '',
    preferred_vibes: [] as string[],
  });

  const isOwnProfile = currentUser?.id === profileUserId;

  // Initialize edit form when profile loads
  const handleStartEdit = () => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        instagram_handle: profile.instagram_handle || '',
        preferred_vibes: profile.preferred_vibes || [],
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!profileUserId) return;

    try {
      await updateProfileMutation.mutateAsync({
        userId: profileUserId,
        updates: editForm,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const toggleVibe = (vibe: string) => {
    setEditForm((prev) => ({
      ...prev,
      preferred_vibes: prev.preferred_vibes.includes(vibe)
        ? prev.preferred_vibes.filter((v) => v !== vibe)
        : [...prev.preferred_vibes, vibe],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-primary-600 dark:text-primary-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary-950 flex items-center justify-center p-6">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-primary-400" />
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
            User Not Found
          </h2>
          <p className="text-primary-600 dark:text-primary-400 mb-6">
            The profile you're looking for doesn't exist
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950">
      {/* Header */}
      <header className="border-b border-primary-200 dark:border-primary-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            {isOwnProfile && !isEditing && (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-lg font-medium hover:bg-primary-800 dark:hover:bg-primary-100 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-white dark:bg-primary-900 text-primary-900 dark:text-white border border-primary-200 dark:border-primary-800 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-lg font-medium hover:bg-primary-800 dark:hover:bg-primary-100 transition-all disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-2xl p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-primary-200 dark:bg-primary-700 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-full flex items-center justify-center hover:bg-primary-800 dark:hover:bg-primary-100 transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        placeholder="Your city"
                        className="px-4 py-3 bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                      <input
                        type="text"
                        value={editForm.instagram_handle}
                        onChange={(e) =>
                          setEditForm({ ...editForm, instagram_handle: e.target.value })
                        }
                        placeholder="Instagram handle"
                        className="px-4 py-3 bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">
                      {profile.name || 'Anonymous User'}
                    </h1>
                    {profile.bio && (
                      <p className="text-primary-600 dark:text-primary-400 mb-4 leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {profile.city && (
                        <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.city}</span>
                        </div>
                      )}
                      {profile.instagram_handle && (
                        <a
                          href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          <span>{profile.instagram_handle}</span>
                        </a>
                      )}
                      {profile.is_local && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full font-medium">
                          <Award className="w-4 h-4" />
                          <span>Local Expert</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-primary-200 dark:border-primary-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-900 dark:text-white mb-1">
                  {profile.reputation_score || 0}
                </div>
                <div className="text-sm text-primary-500 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4" />
                  Reputation
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-900 dark:text-white mb-1">
                  {profile.suggestions_count || 0}
                </div>
                <div className="text-sm text-primary-500 flex items-center justify-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  Suggestions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-900 dark:text-white mb-1">
                  {profile.helpful_suggestions_count || 0}
                </div>
                <div className="text-sm text-primary-500 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" />
                  Helpful
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preferred Vibes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-2xl p-8 mb-6"
          >
            <h2 className="text-xl font-bold text-primary-900 dark:text-white mb-4">
              Preferred Vibes
            </h2>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {VIBE_OPTIONS.map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleVibe(vibe)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      editForm.preferred_vibes.includes(vibe)
                        ? 'bg-accent-500 text-white'
                        : 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-white hover:bg-primary-200 dark:hover:bg-primary-700'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            ) : profile.preferred_vibes && profile.preferred_vibes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.preferred_vibes.map((vibe) => (
                  <span
                    key={vibe}
                    className="px-4 py-2 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-primary-600 dark:text-primary-400">
                No preferred vibes selected yet
              </p>
            )}
          </motion.div>

          {/* Actions (for other users' profiles) */}
          {!isOwnProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              <button
                onClick={() => toast.info('Messaging feature coming soon!')}
                className="flex-1 px-6 py-3 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-xl font-medium hover:bg-primary-800 dark:hover:bg-primary-100 transition-all inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
