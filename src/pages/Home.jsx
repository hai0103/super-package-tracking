import React, { useState, useEffect } from 'react';
import TrackingInput from '../components/TrackingInput';
import WatchedList from '../components/WatchedList';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userService, trackingService } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSearch = async (data, carrier) => {
        // Save to localStorage
        const saved = JSON.parse(localStorage.getItem('watchedItems') || '[]');
        const newItems = [data, ...saved.filter(item => item.trackingNumber !== data.trackingNumber)].slice(0, 10);
        localStorage.setItem('watchedItems', JSON.stringify(newItems));

        // Sync to backend if logged in
        if (user && user.userId) {
            try {
                await userService.addToHistory(user.userId, data.trackingNumber, carrier || data.carrier, data);
            } catch (err) {
                console.error('Failed to sync history:', err);
            }
        }

        window.dispatchEvent(new Event('watchedItemsUpdated'));

        // Navigate to Result Page with carrier param
        const carrierParam = carrier || data.carrier || 'auto';
        navigate(`/result/${data.trackingNumber}?carrier=${carrierParam}`, { state: { data } });
    };

    const handleViewDetails = (savedItem) => {
        navigate(`/result/${savedItem.trackingNumber}?carrier=${savedItem.carrier || 'auto'}`, { state: { data: savedItem } });
    };

    // Handle navigation from other pages
    useEffect(() => {
        if (location.state?.trackingNumber) {
            if (location.state.data) {
                handleViewDetails(location.state.data);
            } else {
                const carrier = location.state.carrier || 'auto';
                navigate(`/result/${location.state.trackingNumber}?carrier=${carrier}`, { state: { carrier } });
            }
        }
    }, [location.state]);

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2 mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight dark:text-white"
                >
                    {user ? `Xin chào, ${user.phoneNumber}!` : 'Tra cứu vận đơn'} <br />
                    <span className="text-paw-pink text-3xl md:text-4xl block mt-2">Đơn hàng ở đâu rồi?</span>
                </motion.h1>
            </div>

            <TrackingInput onSearch={handleSearch} />

            <WatchedList onViewDetails={handleViewDetails} />
        </div>
    );
};

export default Home;
