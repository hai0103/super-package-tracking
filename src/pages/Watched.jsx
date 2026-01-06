import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Watched = () => {
    const { user } = useAuth();
    const [watched, setWatched] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchWatched = async () => {
        try {
            const data = await userService.getWatched(user.userId);
            setWatched(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        fetchWatched();
    }, [user]);

    const handleUnwatch = async (e, trackingNumber) => {
        e.stopPropagation();
        if (!window.confirm('Bạn có chắc muốn bỏ theo dõi đơn hàng này?')) return;

        try {
            await userService.removeFromWatched(user.userId, trackingNumber);
            setWatched(prev => prev.filter(item => item.trackingNumber !== trackingNumber));
        } catch (err) {
            console.error('Failed to unwatch:', err);
        }
    };

    const handleItemClick = (item) => {
        // Navigate directly to result page with carrier param
        navigate(`/result/${item.trackingNumber}?carrier=${item.carrier || 'auto'}`, {
            state: {
                data: item.trackingData,
                carrier: item.carrier
            }
        });
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
                <div className="bg-gray-100 p-4 rounded-full mb-4 dark:bg-gray-800">
                    <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2 dark:text-gray-200">Đăng nhập để theo dõi</h2>
                <p className="text-gray-500 mb-6 dark:text-gray-400">Xem tiến độ các đơn hàng quan trọng của bạn</p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-paw-pink text-white rounded-xl font-bold hover:bg-paw-pink-dark transition-colors"
                >
                    Đăng nhập ngay
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 dark:text-white">
                <Package className="w-7 h-7 text-paw-pink" />
                Đang theo dõi
            </h1>

            {loading ? (
                <div className="text-center py-10 text-gray-400">Đang tải danh sách...</div>
            ) : watched.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Bạn chưa theo dõi đơn hàng nào</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {watched.map((item, index) => (
                        <motion.div
                            key={item.trackingNumber}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleItemClick(item)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer group dark:bg-gray-800 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-paw-blue-light/10 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-800 dark:text-white">{item.trackingNumber}</p>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 dark:bg-gray-700 dark:text-gray-300">{item.carrier}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[200px]">
                                        {item.trackingData ? item.trackingData.status : 'Đang cập nhật...'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleUnwatch(e, item.trackingNumber)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 dark:hover:bg-red-900/20"
                                    title="Bỏ theo dõi"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watched;
