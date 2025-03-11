import axios from 'axios';
import { store } from './store';  // Import your Redux store
import { refreshToken, resetAuth } from './authService';  // Import actions to handle token refresh

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/', // Your backend API URL https://admin.beautycraft.xyz/api/v1
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle authentication token for each request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle 401 Unauthorized errors globally
let isRefreshing = false; // Track if a refresh token request is already in progress
let failedRequestsQueue = []; // Queue of failed requests waiting for the token refresh

axiosInstance.interceptors.response.use(
  response => response, // If response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // Only handle token refresh logic if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already in progress, add the current request to the queue to retry after refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }

      // If no refresh is in progress, start the token refresh process
      isRefreshing = true;

      try {
        // Attempt to refresh the token using the refreshToken action
        const { payload: newToken } = await store.dispatch(refreshToken());

        // If the token refresh is successful, retry all the failed requests
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;

        failedRequestsQueue.forEach(({ resolve }) => resolve(newToken)); // Retry the requests
        failedRequestsQueue = []; // Clear the queue

        // Set the new token in the original request and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        // If refresh fails, reset auth state and clear the queue
        store.dispatch(resetAuth());
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page
        failedRequestsQueue.forEach(({ reject }) => reject(error)); // Reject all failed requests
        failedRequestsQueue = [];
        return Promise.reject(error);
      } finally {
        isRefreshing = false; // Reset refresh state
      }
    }

    return Promise.reject(error); // If error is not 401, just reject it
  }
);

export default axiosInstance;
