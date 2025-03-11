const productSlice = createSlice({
    name: 'products',
    initialState: {
      items: [],
      loading: false,
      error: null,
      selectedProduct: null,
    },
    reducers: {
      setProducts: (state, action) => {
        state.items = action.payload;
      },
      setSelectedProduct: (state, action) => {
        state.selectedProduct = action.payload;
      },
    },
  });
  
  // store/index.js
  import { configureStore } from '@reduxjs/toolkit';
  import { userSlice } from './slices/userSlice';
  import { cartSlice } from './slices/cartSlice';
  import { productSlice } from './slices/productSlice';
  
  export const store = configureStore({
    reducer: {
      user: userSlice.reducer,
      cart: cartSlice.reducer,
      products: productSlice.reducer,
    },
  });