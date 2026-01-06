import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, Package, Clock, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Tra cứu', icon: Search },
        { path: '/watched', label: 'Theo dõi', icon: Package },
        { path: '/history', label: 'Lịch sử', icon: Clock },
        { path: user ? '/profile' : '/login', label: user ? 'Tôi' : 'Đăng nhập', icon: user ? User : LogIn },
    ];

    return (
        <div className="min-h-screen bg-paw-print-bg dark:bg-gray-900 transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-paw-pink/10 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-3xl">📦</span>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-paw-pink to-paw-blue leading-tight">
                                SuperTracking
                            </span>
                            <span className="text-xs text-gray-400 font-medium dark:text-gray-500">Tra cứu vận đơn toàn năng</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-paw-pink' : 'text-gray-500 hover:text-paw-pink-light dark:text-gray-400 dark:hover:text-paw-pink-light'}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 pb-32">
                {children}
            </main>

            {/* Bottom Navigation for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe-area shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 transition-colors duration-300">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-paw-pink' : 'text-gray-400 dark:text-gray-600'}`}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-1.5 rounded-xl ${isActive ? 'bg-paw-pink/10 dark:bg-paw-pink/20' : 'bg-transparent'}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.div>
                                <span className="text-[10px] font-bold">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Layout;
