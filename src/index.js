import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoute from './AppRoute';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authReducer from './api/authService';
import userReducer from './api/store/slices/userSlice';
import cartReducer from './api/store/slices/cartSlice';
import orderReducer from './api/store/slices/orderSlice'
import InitializeAuth from './InitializeAuth';
import homeReducer from './api/homeservice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    home: homeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <InitializeAuth>
        <AppRoute />
      </InitializeAuth>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
