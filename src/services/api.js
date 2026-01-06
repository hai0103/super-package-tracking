import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const trackingService = {
    detectCarrier: async (trackingNumber) => {
        try {
            const response = await api.post('/tracking/detect', { trackingNumber });
            return response.data;
        } catch (error) {
            console.error('Error detecting carrier:', error);
            throw error;
        }
    },

    trackPackage: async (trackingNumber, carrier) => {
        try {
            const response = await api.post('/tracking/track', { trackingNumber, carrier });
            return response.data;
        } catch (error) {
            console.error('Error tracking package:', error);
            throw error;
        }
    },

    getCarrierIcon: (carrierName) => {
        return carrierName;
    }
};

export const authService = {
    login: async (phoneNumber, password) => {
        try {
            const response = await api.post('/auth/login', { phoneNumber, password });
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Login failed';
        }
    },

    register: async (phoneNumber, password) => {
        try {
            const response = await api.post('/auth/register', { phoneNumber, password });
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Registration failed';
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export const userService = {
    getHistory: async (userId) => {
        const response = await api.get(`/user/${userId}/history`);
        return response.data;
    },

    addToHistory: async (userId, trackingNumber, carrier, trackingData) => {
        const response = await api.post(`/user/${userId}/history`, {
            trackingNumber, carrier, trackingData
        });
        return response.data;
    },

    getWatched: async (userId) => {
        const response = await api.get(`/user/${userId}/watched`);
        return response.data;
    },

    addToWatched: async (userId, trackingNumber, carrier) => {
        const response = await api.post(`/user/${userId}/watched`, {
            trackingNumber, carrier
        });
        return response.data;
    },

    removeFromWatched: async (userId, trackingNumber) => {
        const response = await api.delete(`/user/${userId}/watched/${trackingNumber}`);
        return response.data;
    },

    checkWatched: async (userId, trackingNumber) => {
        const response = await api.get(`/user/${userId}/watched/${trackingNumber}/check`);
        return response.data;
    },

    getSettings: async (userId) => {
        const response = await api.get(`/user/${userId}/settings`);
        return response.data;
    },

    updateSettings: async (userId, settings) => {
        const response = await api.put(`/user/${userId}/settings`, settings);
        return response.data;
    }
};
