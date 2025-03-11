// src/services/api.service.js

import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// // Add request interceptor (optional)
// apiClient.interceptors.request.use(
//     (config) => {
//         // You can add auth headers here if needed
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Add response interceptor (optional)
// apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Handle common errors here
//         if (error.response?.status === 401) {
//             // Handle unauthorized
//             localStorage.removeItem('token');
//             // Redirect to login if needed
//         }
//         return Promise.reject(error);
//     }
// );

export default apiClient;