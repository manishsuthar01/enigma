import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const scanContract = async (contractText) => {
    try {
        const response = await axios.post(`${API_URL}/scan`, { contractText });
        return response.data;
    } catch (error) {
        console.error('Scan API Error:', error);
        throw error.response?.data?.error || 'An error occurred during analysis';
    }
};

export const generateContract = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/generate`, payload);
        return response.data;
    } catch (error) {
        console.error('Generate API Error:', error);
        throw error.response?.data?.error || 'An error occurred during generation';
    }
};

