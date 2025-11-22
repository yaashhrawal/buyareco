import { motion, type PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Star, Info } from 'lucide-react';
import { useState } from 'react';

interface Location {
    id: string;
    name: string;
    image: string;
    rating: number;
    vibes: string[];
    distance?: string;
    description: string;
}

interface SwipeCardProps {
    data: Location;
    onSwipe: (direction: 'left' | 'right') => void;
    active: boolean;
}

export default function SwipeCard({ data, onSwipe, active }: SwipeCardProps) {
    const [exitX, setExitX] = useState(0);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            setExitX(200);
            onSwipe('right');
        } else if (info.offset.x < -100) {
            setExitX(-200);
            onSwipe('left');
        }
    };

    if (!active) return null;

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0.5, y: 0 }}
            animate={{ scale: 1, opacity: 1, x: exitX }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute inset-0 w-full h-full bg-white dark:bg-primary-900 rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing border border-primary-200 dark:border-primary-800"
        >
            {/* Image Section */}
            <div className="relative h-3/4">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Overlays for Swipe Feedback */}
                <motion.div
                    style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
                    className="absolute top-8 left-8 border-4 border-green-500 rounded-xl px-4 py-2 -rotate-12"
                >
                    <span className="text-green-500 font-bold text-4xl uppercase tracking-wider">Like</span>
                </motion.div>

                <motion.div
                    style={{ opacity: useTransform(x, [0, -100], [0, 1]) }}
                    className="absolute top-8 right-8 border-4 border-red-500 rounded-xl px-4 py-2 rotate-12"
                >
                    <span className="text-red-500 font-bold text-4xl uppercase tracking-wider">Nope</span>
                </motion.div>

                {/* Card Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{data.name}</h2>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-accent-500" />
                        <span className="font-medium">{data.distance || '2.5 km away'}</span>
                        <span className="mx-2">•</span>
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{data.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.vibes.map(vibe => (
                            <span key={vibe} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                                {vibe}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="h-1/4 p-6 flex flex-col justify-between bg-white dark:bg-primary-900">
                <p className="text-primary-600 dark:text-primary-300 line-clamp-2">
                    {data.description}
                </p>
                <div className="flex justify-center pt-2">
                    <button className="p-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-500 hover:bg-primary-200 transition-colors">
                        <Info className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
