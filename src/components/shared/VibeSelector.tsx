import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const VIBES = [
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'bg-blue-100 text-blue-700' },
    { id: 'aesthetic', label: 'Aesthetic', emoji: '✨', color: 'bg-purple-100 text-purple-700' },
    { id: 'vibrant', label: 'Vibrant', emoji: '⚡', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'cozy', label: 'Cozy', emoji: '☕', color: 'bg-orange-100 text-orange-700' },
    { id: 'productive', label: 'Productive', emoji: '💻', color: 'bg-slate-100 text-slate-700' },
    { id: 'romantic', label: 'Romantic', emoji: '💖', color: 'bg-pink-100 text-pink-700' },
    { id: 'adventurous', label: 'Adventurous', emoji: '🏔️', color: 'bg-green-100 text-green-700' },
    { id: 'cultural', label: 'Cultural', emoji: '🏛️', color: 'bg-amber-100 text-amber-700' },
    { id: 'social', label: 'Social', emoji: '🥂', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'luxury', label: 'Luxury', emoji: '💎', color: 'bg-emerald-100 text-emerald-700' },
];

interface VibeSelectorProps {
    selectedVibes: string[];
    onToggle: (vibeId: string) => void;
    className?: string;
}

export default function VibeSelector({ selectedVibes, onToggle, className = '' }: VibeSelectorProps) {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${className}`}>
            {VIBES.map((vibe) => {
                const isSelected = selectedVibes.includes(vibe.id);
                return (
                    <motion.button
                        key={vibe.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggle(vibe.id)}
                        className={`
              relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
              ${isSelected
                                ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                                : 'border-transparent bg-white dark:bg-primary-800 hover:border-primary-200 dark:hover:border-primary-700'
                            }
            `}
                    >
                        <span className="text-2xl">{vibe.emoji}</span>
                        <span className={`text-sm font-medium ${isSelected ? 'text-accent-700 dark:text-accent-400' : 'text-primary-600 dark:text-primary-400'}`}>
                            {vibe.label}
                        </span>
                        {isSelected && (
                            <div className="absolute top-2 right-2">
                                <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
