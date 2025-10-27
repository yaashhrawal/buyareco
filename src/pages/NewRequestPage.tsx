/**
 * New Recommendation Request Page
 * For travelers to create a request for local recommendations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Send, X } from 'lucide-react';
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

const PLACE_TYPES = [
  'cafe',
  'restaurant',
  'bar',
  'park',
  'workspace',
  'museum',
  'gallery',
  'market',
  'viewpoint',
  'other',
];

export default function NewRequestPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    city: '',
    area: '',
    title: '',
    description: '',
    vibes: [] as string[],
    placeType: '',
    budgetLevel: 2,
    groupSize: 1,
    timeConstraints: '',
  });

  const handleVibeToggle = (vibe: string) => {
    setFormData((prev) => ({
      ...prev,
      vibes: prev.vibes.includes(vibe)
        ? prev.vibes.filter((v) => v !== vibe)
        : [...prev.vibes, vibe],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.city.trim()) {
      toast.error('Please enter a city');
      setIsSubmitting(false);
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please describe what you are looking for');
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Submit to Supabase
      console.log('Submitting request:', formData);

      toast.success('Request posted! Locals will start suggesting soon.');
      navigate('/requests');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to post request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primary-950">
      {/* Header */}
      <header className="border-b border-primary-200 dark:border-primary-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-6 py-12">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-2">
            Ask for Recommendations
          </h1>
          <p className="text-primary-600 dark:text-primary-400 mb-8">
            Describe what you're looking for, and locals will suggest perfect spots.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g., Udaipur, Paris, Tokyo"
                  className="w-full px-4 py-3 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                  Area / Neighborhood <span className="text-primary-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g., Old City, Downtown, Near Lake Pichola"
                  className="w-full px-4 py-3 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                Quick Summary <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Calm aesthetic cafe to work from"
                className="w-full px-4 py-3 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you're looking for... What's your ideal vibe? Any specific requirements?"
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all resize-none"
                required
              />
            </div>

            {/* Vibes */}
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-white mb-3">
                Vibes <span className="text-primary-400">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_OPTIONS.map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => handleVibeToggle(vibe)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.vibes.includes(vibe)
                        ? 'bg-accent-500 text-white'
                        : 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-white hover:bg-primary-200 dark:hover:bg-primary-700'
                    }`}
                  >
                    {vibe}
                    {formData.vibes.includes(vibe) && <X className="inline-block w-4 h-4 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Place Type */}
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                Type of Place
              </label>
              <select
                value={formData.placeType}
                onChange={(e) => setFormData({ ...formData, placeType: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
              >
                <option value="">Any type</option>
                {PLACE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget & Group Size */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                  Budget
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, budgetLevel: level })}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        formData.budgetLevel === level
                          ? 'bg-accent-500 text-white'
                          : 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-white hover:bg-primary-200 dark:hover:bg-primary-700'
                      }`}
                    >
                      {'$'.repeat(level)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                  Group Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.groupSize}
                  onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                />
              </div>
            </div>

            {/* Time Constraints */}
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-white mb-2">
                Time / Schedule <span className="text-primary-400">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.timeConstraints}
                onChange={(e) => setFormData({ ...formData, timeConstraints: e.target.value })}
                placeholder="e.g., Weekends only, Evening hours, Open now"
                className="w-full px-4 py-3 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white dark:bg-primary-900 text-primary-900 dark:text-white border border-primary-200 dark:border-primary-800 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-lg font-medium hover:bg-primary-800 dark:hover:bg-primary-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Posting...' : 'Post Request'}
                {!isSubmitting && <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
