import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { User, LogOut, Moon, Sun } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(false);

    // Initialize theme from system, local storage, or backend
    useEffect(() => {
        const initTheme = async () => {
            // 1. Check current DOM status (set by local storage/system)
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);

            // 2. If logged in, fetch from backend to sync
            if (user) {
                try {
                    const settings = await userService.getSettings(user.userId);
                    if (settings.themeMode) {
                        const backendDark = settings.themeMode === 'dark';
                        if (backendDark !== isDark) {
                            setDarkMode(backendDark);
                            if (backendDark) {
                                document.documentElement.classList.add('dark');
                                localStorage.setItem('theme', 'dark');
                            } else {
                                document.documentElement.classList.remove('dark');
                                localStorage.setItem('theme', 'light');
                            }
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch settings:", err);
                }
            }
        };
        initTheme();
    }, [user]);

    const toggleTheme = async () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        // Update DOM and Local Storage
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        // Sync to Backend
        if (user) {
            try {
                await userService.updateSettings(user.userId, {
                    themeMode: newMode ? 'dark' : 'light'
                });
            } catch (err) {
                console.error("Failed to save settings:", err);
            }
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-md mx-auto pt-8">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300"
            >
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-paw-pink-light to-paw-blue-light opacity-20"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto p-1 shadow-lg mb-4 dark:bg-gray-700 transition-colors duration-300">
                        <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-600 transition-colors duration-300">
                            <User className="w-10 h-10 text-gray-400 dark:text-gray-300" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-1 dark:text-white">{user.phoneNumber}</h1>
                    <p className="text-gray-500 text-sm mb-8 dark:text-gray-400">Thành viên SuperTracking</p>

                    <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl dark:bg-gray-700/50 transition-colors duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-xl text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 transition-colors duration-300">
                                    {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </div>
                                <span className="font-medium text-gray-700 dark:text-gray-200">Giao diện tối</span>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${darkMode ? 'bg-paw-pink' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-2xl text-red-500 transition-colors dark:bg-red-900/10 dark:hover:bg-red-900/20"
                        >
                            <div className="p-2 bg-white rounded-xl dark:bg-gray-800 transition-colors duration-300">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <span className="font-bold">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            <p className="text-center text-gray-400 text-xs mt-8">
                Phiên bản 1.1.0 (Web)
            </p>
        </div>
    );
};

export default Profile;
