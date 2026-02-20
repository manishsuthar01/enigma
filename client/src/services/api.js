import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const scanContract = async (contractText) => {
    try {
        const response = await axios.post(`${API_URL}/scan`, { contractText });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'An error occurred during analysis';
    }
};
