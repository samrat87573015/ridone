import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance'; // Make sure axiosInstance is correctly imported.
import { getUserData, logout } from './store/slices/userSlice';
import { FOCUSABLE_SELECTOR } from '@testing-library/user-event/dist/utils';

// Login Action
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      if (response) {
        localStorage.setItem('token', response.data); // Store token
        await dispatch(getUserData()); // Get user data
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Register Action
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/register', userData);
      if (response.data.data) {
        localStorage.setItem('token', response.data.data); // Store token
        await dispatch(getUserData()); // Get user data
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Logout Action
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/logout');
      localStorage.removeItem('token');
      dispatch(logout()); // Reset user data after logout
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Token Refresh Action
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/refresh');
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token); // Store new token
        return response.data.access_token;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    error: null,
    isAuthenticated: Boolean(localStorage.getItem('token')),
    initialized: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    isAuth: (state,action) => {
      state.isAuthenticated = action.payload;
      state.initialized = true;
    },
    resetAuth: (state) => {
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.initialized = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling login state
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      // Handling register state
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      })
      // Handling logout state
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.initialized = true;
        localStorage.removeItem('token');
      })
      // Handling token refresh state
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
      });
  },
});

export const { clearError, resetAuth,isAuth } = authSlice.actions;
export default authSlice.reducer;
