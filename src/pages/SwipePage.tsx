/**
 * Swipe Page
 * Tinder-like interface for discovering places
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Heart, X } from 'lucide-react';
import SwipeCard from '../components/shared/SwipeCard';
import toast from 'react-hot-toast';

// Mock data for places
const MOCK_PLACES = [
    {
        id: '1',
        name: 'Jheel\'s Ginger Coffee Bar',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        vibes: ['Cozy', 'Lake View', 'Work Friendly'],
        distance: '0.5 km away',
        description: 'Best spot for morning coffee with a view of Lake Pichola. Great wifi and power outlets.'
    },
    {
        id: '2',
        name: 'Upre by 1559 AD',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=1000&auto=format&fit=crop',
        rating: 4.6,
        vibes: ['Romantic', 'Fine Dining', 'Rooftop'],
        distance: '1.2 km away',
        description: 'Perfect for a romantic dinner date. The view of the City Palace at night is breathtaking.'
    },
    {
        id: '3',
        name: 'Grasswood Cafe',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop',
        rating: 4.5,
        vibes: ['Healthy', 'Vegan', 'Casual'],
        distance: '0.8 km away',
        description: 'Amazing smoothie bowls and avocado toast. Very chill vibe with live music on weekends.'
    }
];

export default function SwipePage() {
    const navigate = useNavigate();
    const [places, setPlaces] = useState(MOCK_PLACES);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'right') {
            toast.success('Saved to your list! 💖');
        }

        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 200);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 p-4 shadow-sm flex items-center justify-between z-10">
                <button onClick={() => navigate('/feed')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Discover Places</h1>
                <div className="w-10" /> {/* Spacer */}
            </header>

            {/* Swipe Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative">
                <div className="w-full max-w-md h-[600px] relative">
                    {places.map((place, index) => (
                        <SwipeCard
                            key={place.id}
                            data={place}
                            active={index === currentIndex}
                            onSwipe={handleSwipe}
                        />
                    ))}

                    {currentIndex >= places.length && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">That's all for now!</h2>
                            <p className="text-gray-500 mb-8">Check back later for more recommendations.</p>
                            <button
                                onClick={() => {
                                    setPlaces([...MOCK_PLACES]);
                                    setCurrentIndex(0);
                                }}
                                className="px-6 py-3 bg-accent-500 text-white rounded-full font-bold hover:bg-accent-600 transition-colors flex items-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Start Over
                            </button>
                        </div>
                    )}
                </div>

                {/* Controls */}
                {currentIndex < places.length && (
                    <div className="flex items-center gap-8 mt-8">
                        <button
                            onClick={() => handleSwipe('left')}
                            className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <button
                            onClick={() => handleSwipe('right')}
                            className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-green-500 hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
                        >
                            <Heart className="w-8 h-8 fill-current" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
