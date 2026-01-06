import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Trash2 } from 'lucide-react';

const WatchedList = ({ onViewDetails }) => {
    const [watchedItems, setWatchedItems] = useState([]);

    useEffect(() => {
        // Load from localStorage (mock implementation)
        // In a real app, you might sync this with the backend 'user/history' endpoint
        const loadItems = () => {
            const items = JSON.parse(localStorage.getItem('watchedItems') || '[]');
            setWatchedItems(items);
        };
        loadItems();

        // Listen for storage updates
        window.addEventListener('storage', loadItems);
        window.addEventListener('watchedItemsUpdated', loadItems); // Custom event
        return () => {
            window.removeEventListener('storage', loadItems);
            window.removeEventListener('watchedItemsUpdated', loadItems);
        };
    }, []);

    const handleDelete = (e, trackingNumber) => {
        e.stopPropagation();
        const newItems = watchedItems.filter(item => item.trackingNumber !== trackingNumber);
        localStorage.setItem('watchedItems', JSON.stringify(newItems));
        setWatchedItems(newItems);
    };

    if (watchedItems.length === 0) return null;

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <h3 className="text-lg font-bold text-gray-700 mb-4 px-2">Đã xem gần đây</h3>
            <div className="space-y-3">
                {watchedItems.map((item, index) => (
                    <motion.div
                        key={item.trackingNumber}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onViewDetails(item)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer group dark:bg-gray-800 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-paw-blue-light/10 rounded-xl flex items-center justify-center text-xl">
                                📦
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">{item.trackingNumber}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{item.carrier}</span>
                                    <span>•</span>
                                    <span className="truncate max-w-[150px]">{item.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => handleDelete(e, item.trackingNumber)}
                                className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default WatchedList;
