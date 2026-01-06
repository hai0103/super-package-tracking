import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Archive, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const data = await userService.getHistory(user.userId);
                const sorted = data.sort((a, b) => new Date(b.searchedAt) - new Date(a.searchedAt));
                setHistory(sorted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const handleItemClick = (item) => {
        // Navigate directly to result page with carrier param
        navigate(`/result/${item.trackingNumber}?carrier=${item.carrier || 'auto'}`, {
            state: {
                data: item.trackingData
            }
        });
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
                <div className="bg-gray-100 p-4 rounded-full mb-4 dark:bg-gray-800">
                    <Archive className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2 dark:text-gray-200">Đăng nhập để xem lịch sử</h2>
                <p className="text-gray-500 mb-6 dark:text-gray-400">Lưu lại mọi đơn hàng bạn đã tra cứu</p>
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
                <Clock className="w-7 h-7 text-paw-pink" />
                Lịch sử tra cứu
            </h1>

            {loading ? (
                <div className="text-center py-10 text-gray-400">Đang tải lịch sử...</div>
            ) : history.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Bạn chưa tra cứu đơn hàng nào</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleItemClick(item)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-paw-pink/50 transition-colors group dark:bg-gray-800 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xs dark:bg-gray-700 dark:text-gray-300">
                                    {item.carrier}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white group-hover:text-paw-pink transition-colors">{item.trackingNumber}</p>
                                    <p className="text-xs text-gray-400">{new Date(item.searchedAt).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-paw-pink transition-colors" />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
