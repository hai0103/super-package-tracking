import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, ChevronDown } from 'lucide-react';
import { trackingService } from '../services/api';

const CARRIERS = [
    { id: 'auto', name: 'Tự động' },
    { id: 'ShopeeExpress', name: 'SPX Express' },
    { id: 'GHN', name: 'Giao Hàng Nhanh' },
    { id: 'GHTK', name: 'Giao Hàng Tiết Kiệm' },
    { id: 'ViettelPost', name: 'Viettel Post', disabled: true },
    { id: 'VietnamPost', name: 'Vietnam Post', disabled: true },
    { id: 'J&T', name: 'J&T Express', disabled: true },
];

const TrackingInput = ({ onSearch }) => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [carrier, setCarrier] = useState('auto');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingNumber.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            let searchCarrier = carrier;

            // 1. Detect carrier if auto
            if (searchCarrier === 'auto') {
                const detection = await trackingService.detectCarrier(trackingNumber);
                searchCarrier = detection.carrier;
            }

            // 2. Track package
            const result = await trackingService.trackPackage(trackingNumber, searchCarrier);

            onSearch(result, searchCarrier);
        } catch (err) {
            setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã vận đơn hoặc chọn đúng hãng vận chuyển.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg border-4 border-paw-pink-light relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Package className="w-24 h-24 rotate-12 text-gray-900 dark:text-white" />
                </div>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="bg-paw-pink/20 p-2.5 rounded-2xl dark:bg-paw-pink/10">
                        <Package className="w-7 h-7 text-paw-pink-dark dark:text-paw-pink" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tra cứu đơn hàng</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hỗ trợ GHN, SPX, GHTK, Viettel...</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative space-y-3 z-10">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative min-w-[140px]">
                            <select
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                className="w-full appearance-none px-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-paw-pink focus:ring-2 focus:ring-paw-pink/20 outline-none font-medium text-gray-700 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-paw-pink"
                            >
                                {CARRIERS.map(c => (
                                    <option key={c.id} value={c.id} disabled={c.disabled}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none dark:text-gray-300" />
                        </div>

                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Nhập mã vận đơn..."
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-paw-pink focus:ring-2 focus:ring-paw-pink/20 outline-none transition-all text-lg font-medium dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-paw-pink"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-paw-pink hover:bg-paw-pink-dark text-white rounded-2xl py-4 font-bold transition-all shadow-lg shadow-paw-pink/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none translate-y-0 hover:-translate-y-1 dark:bg-paw-pink-dark dark:hover:bg-paw-pink"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Search className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <>
                                <Search className="w-6 h-6" />
                                <span className="text-lg">Tra cứu ngay</span>
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-red-50 text-red-500 rounded-xl border border-red-100 flex items-start gap-3 dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-300"
                    >
                        <span className="text-xl">😿</span>
                        <span className="text-sm font-medium pt-0.5">{error}</span>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default TrackingInput;
