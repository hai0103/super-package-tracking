import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial load from local storage
    useEffect(() => {
        const checkUser = () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Sync settings (Theme) from DB when user changes (login or load)
    useEffect(() => {
        const loadSettings = async () => {
            if (user) {
                try {
                    const settings = await userService.getSettings(user.userId);
                    if (settings.themeMode) {
                        if (settings.themeMode === 'dark') {
                            document.documentElement.classList.add('dark');
                            localStorage.setItem('theme', 'dark');
                        } else {
                            document.documentElement.classList.remove('dark');
                            localStorage.setItem('theme', 'light');
                        }
                    }
                } catch (err) {
                    console.error("Failed to sync user settings:", err);
                }
            }
        };
        loadSettings();
    }, [user]);

    const login = async (phone, password) => {
        const data = await authService.login(phone, password);
        setUser(data);
        return data;
    };

    const register = async (phone, password) => {
        const data = await authService.register(phone, password);
        setUser(data);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        // Optional: Reset to system theme or light mode on logout
        // document.documentElement.classList.remove('dark');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
