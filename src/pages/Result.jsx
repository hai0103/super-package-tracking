import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import TrackingResult from '../components/TrackingResult';
import { trackingService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { trackingNumber: paramTrackingNumber } = useParams();
    const [searchParams] = useSearchParams();

    const [result, setResult] = useState(location.state?.data || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Watch state
    const [isWatched, setIsWatched] = useState(false);
    const [watchLoading, setWatchLoading] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        console.log('ResultPage useEffect state', location.state, user);
        const initData = async () => {
            // 1. If data passed via state (from Home/History interactions), use it directly
            if (location.state?.data) {
                setResult(location.state.data);
                setLoading(false);
                return;
            }

            // 2. If no tracking number in URL and no state, show prompt
            if (!paramTrackingNumber) {
                setLoading(false);
                return;
            }

            // 3. Otherwise, fetch data from API (direct URL access or refresh)
            setLoading(true);
            setError('');

            try {
                let carrier = searchParams.get('carrier');
                const carrierFromState = location.state?.carrier;
                const finalCarrier = carrier || carrierFromState;

                // If carrier not provided in URL/State, try auto detection
                let searchCarrier = finalCarrier;
                if (!searchCarrier || searchCarrier === 'auto') {
                    const detection = await trackingService.detectCarrier(paramTrackingNumber);
                    searchCarrier = detection.carrier;
                }

                const data = await trackingService.trackPackage(paramTrackingNumber, searchCarrier);
                setResult(data);
            } catch (err) {
                console.error('Track error:', err);
                setError('Không thể tải thông tin đơn hàng. Vui lòng kiểm tra lại thông tin và thử lại.');
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, [paramTrackingNumber, location.state, searchParams]);

    // Check Watched Status
    useEffect(() => {
        const checkWatchedStatus = async () => {
            const trackingNum = result?.trackingNumber || paramTrackingNumber;
            if (user && trackingNum) {
                try {
                    const { isWatched } = await userService.checkWatched(user.userId, trackingNum);
                    setIsWatched(isWatched);
                } catch (err) {
                    console.error("Failed to check watched status", err);
                }
            }
        };
        checkWatchedStatus();
    }, [user, result, paramTrackingNumber]);

    const handleToggleWatch = async () => {
        if (!user) {
            if (window.confirm('Bạn cần đăng nhập để theo dõi đơn hàng. Chuyển đến trang đăng nhập?')) {
                navigate('/login');
            }
            return;
        }

        const trackingNum = result?.trackingNumber || paramTrackingNumber;
        if (!trackingNum) return;

        setWatchLoading(true);
        try {
            if (isWatched) {
                await userService.removeFromWatched(user.userId, trackingNum);
                setIsWatched(false);
            } else {
                await userService.addToWatched(user.userId, trackingNum, result?.carrier || 'auto');
                setIsWatched(true);
            }
        } catch (err) {
            console.error('Failed to toggle watch:', err);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setWatchLoading(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-paw-pink border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium dark:text-gray-400">Đang tải thông tin...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="p-8 text-center max-w-lg mx-auto">
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
                    <p className="text-red-500 font-bold mb-4 dark:text-red-400">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-white text-gray-700 rounded-xl font-bold shadow-sm hover:shadow-md transition-all dark:bg-gray-800 dark:text-gray-200"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    // Empty State
    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-6 dark:bg-gray-800">
                    <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2 dark:text-white">Chưa có thông tin vận đơn</h2>
                <p className="text-gray-500 mb-6 dark:text-gray-400">Vui lòng nhập mã vận đơn để tra cứu</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-paw-pink text-white rounded-xl font-bold hover:bg-paw-pink-dark transition-colors shadow-lg shadow-paw-pink/30"
                >
                    Tra cứu ngay
                </button>
            </div>
        );
    }

    // Success State
    return (
        <div className="max-w-3xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-500 hover:text-paw-pink transition-colors font-bold px-2 py-1 dark:text-gray-400 dark:hover:text-paw-pink"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
            </motion.div>

            <TrackingResult
                data={result}
                isWatched={isWatched}
                onToggleWatch={handleToggleWatch}
                watchLoading={watchLoading}
            />
        </div>
    );
};

export default ResultPage;
