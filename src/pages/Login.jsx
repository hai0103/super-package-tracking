import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, ArrowRight } from 'lucide-react';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                await register(phone, password);
            } else {
                await login(phone, password);
            }
            navigate('/');
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border-4 border-paw-pink/10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isRegister ? 'Tạo tài khoản mới' : 'Chào mừng trở lại!'}
                    </h1>
                    <p className="text-gray-500">
                        {isRegister ? 'Tham gia cùng SuperTracking để theo dõi đơn hàng dễ dàng hơn' : 'Đăng nhập để xem lịch sử tra cứu của bạn'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Số điện thoại</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-paw-pink focus:ring-2 focus:ring-paw-pink/20 outline-none transition-all"
                                placeholder="0912345678"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-paw-pink focus:ring-2 focus:ring-paw-pink/20 outline-none transition-all"
                                placeholder="••••••"
                            />
                        </div>
                        <p className="text-xs text-gray-400 ml-1 italic">* Mật khẩu không bắt buộc nếu bạn chưa đặt</p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-paw-pink hover:bg-paw-pink-dark text-white rounded-2xl font-bold text-lg shadow-lg shadow-paw-pink/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng ký ngay' : 'Đăng nhập')}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-paw-blue-dark hover:text-paw-blue font-bold text-sm"
                    >
                        {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
