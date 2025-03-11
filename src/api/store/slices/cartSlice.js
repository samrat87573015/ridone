import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosInstance';
import { getUserData } from './userSlice';
// Generate a unique guest ID for non-logged-in users


export const generateGuestId = () => {
  const storedGuestId = localStorage.getItem('guestId');
  if (storedGuestId) return storedGuestId;
  const newGuestId = `guest_${Date.now()}`;
  localStorage.setItem('guestId', newGuestId);
  return newGuestId;
};

// Helper: Merge cart items
const mergeCartItems = (existingItems, newItems) => {
  const mergedItems = [...existingItems];

  newItems.forEach(newItem => {
    const attributeKey = newItem.attributes
      ? newItem.attributes.map(attr => `${attr.attribute_name}:${attr.attribute_option}`).join('|')
      : '';

    const existingItemIndex = mergedItems.findIndex(item =>
      item.product.id === newItem.product_id &&
      item.attributeKey === attributeKey
    );

    if (existingItemIndex !== -1) {
      // Update quantity, preferring server-side quantity if available
      mergedItems[existingItemIndex].quantity = newItem.quantity || mergedItems[existingItemIndex].quantity;
    } else {
      mergedItems.push({
        ...newItem,
        attributeKey,
        addedAt: newItem.addedAt || new Date().toISOString()
      });
    }
  });

  return mergedItems;
};

// Helper: Calculate cart totals
const calculateCartTotals = (items) => {
  return {
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    total: items.reduce((sum, item) => {
      const price = parseFloat(item.product.price);
      const campaignDiscount = item.discount_value || 0;
      const finalPrice = campaignDiscount 
        ? price - (price * campaignDiscount / 100) 
        : price;
      return sum + (finalPrice * item.quantity);
    }, 0).toFixed(2)
  };
};

export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async ({ firstLoad = false } = {}, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(getUserData());
      const state = getState(); // Access the Redux state
      const userId = state.user?.user?.id; // Fetch user ID from user slice
      const token = localStorage.getItem("token");
      const guestId = generateGuestId(); // Generate or fetch the guest ID
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // Always ensure either userId or guestId is passed
      const params = { user_id: userId || guestId };

      const response = await axiosInstance.get("/get-cart-items", { headers, params });

      // Close the cart sidebar only if it's the first load
      if (firstLoad) {
        dispatch(setActiveCart(false));
      }

      return response.data || [];
    } catch (error) {
      console.error("Fetch cart error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch cart data");
    }
  }
);

// Sync Cart Thunk
export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async ({ cartId, attributeKey, quantity, productId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cartItems = state.cart.items;
      const token = localStorage.getItem('token');
      const guestId = generateGuestId();

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Prepare the payload with productId, attributeKey, and quantity
      const syncPayload = {
        cart_id: cartId,   // Map productId to cart_id
        quantity: quantity,   // Quantity from the arguments
        // attribute_values: attributeKey || [],  // attributeKey or an empty array if not provided
        product_id: productId,
        user_id: token ? undefined : guestId  // Include guestId if the user is not logged in
      };

      const response = await axiosInstance.post('/cart/sync', syncPayload, { headers });

      return {
        serverItems: response.data || [],
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Cart sync error:', error);
      return rejectWithValue(error.response?.data || 'Failed to sync cart');
    }
  }
);

// Sync Cart Thunk
export const addCartBackend = createAsyncThunk(
  'cart/addCarttobackend',
  async (items, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cartItems = state.cart.items;
      const token = localStorage.getItem('token');
      const guestId = generateGuestId();

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Prepare the payload with all relevant fields from the cart item
      const syncPayload = {
        ...items,
        user_id:state.user?.user?.id || guestId
      };
      console.log("Sync Payload:", syncPayload); // Debug: Verify payload structure
      const response = await axiosInstance.post('/add-to-cart', syncPayload, { headers });

      return {
        serverItems: response.data || [],
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Cart add error:', error);
      return rejectWithValue(error.response?.data.data.message || 'Failed to add cart');
    }
  }
);

// Initialize Cart Thunk
export const initializeCart = createAsyncThunk(
  'cart/initializeCart',
  async (_, { dispatch }) => {
    try {
      await dispatch(syncCart()).unwrap();
      await dispatch(fetchCartData()).unwrap();
    } catch (error) {
      console.error('Cart initialization failed:', error);
    }
  }
);

// Remove Cart Item Thunk
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId, cartId, attributeKey }, { getState, rejectWithValue, dispatch }) => {
    try {
      dispatch(getUserData()); // Ensure user data is fetched
      
      const state = getState();
      const token = localStorage.getItem("token");
      const userId = state.user?.user?.id;
      let guestId = localStorage.getItem("guestId");

      // If guestId is not set, generate & store it
      if (!guestId) {
        guestId = generateGuestId();
        localStorage.setItem("guestId", guestId);
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // API call to remove the item
      const response = await axiosInstance.delete(`/cart/remove`, {
        headers,
        data: {
          user_id: token ? userId : guestId,
          cart_id: cartId,
        },
      });

      return { productId, attributeKey };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove cart item");
    }
  }
);




const deduplicateCartItems = (items) => {
  return [...new Map(
    items.map((item) => [item.product_id + (item.attributeKey || ""), item])
  ).values()];
};


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
    lastSync: null,
    initialized: false,
    activecart: false,
    syncStatus: 'idle'
  },
  reducers: {
    // Add to Cart Action
    addToCart: {
      reducer: (state, action) => {
        const { product, quantity, selectedAttributes, error } = action.payload;
    
        if (error) {
          state.error = error;
          return;
        }
    


        // Generate attributeKey in addToCart reducer
        const attributeKey = selectedAttributes
        ? selectedAttributes.map(attr => `${attr.attribute_name}:${attr.attribute_option}`).join('|')
        : '';

    
        const existingItemIndex = state.items.findIndex(item =>
          item.product.id === product.id && item.attributeKey === attributeKey
        );
    
        if (existingItemIndex !== -1) {
          // Update existing item quantity and attributes
          state.items[existingItemIndex].quantity = Math.max(
            1,
            state.items[existingItemIndex].quantity + quantity
          );
          state.items[existingItemIndex].attributes = selectedAttributes || state.items[existingItemIndex].attributes;
        } else {
          // Add a new item to the cart
          state.items.push({
            id: null,
            product_id: product.id,
            quantity: Math.max(1, quantity),
            campaign_id: product.product_campaign?.campaign_id || null,
            discount_value: product.product_campaign?.discount || null,
            product: {
              id: product.id,
              product_name: product.product_name,
              price: product.price,
              free_delivary: product.free_delivary,
              featured_image: product.featured_image
            },
            attributes: selectedAttributes,
            attributeKey,
            addedAt: new Date().toISOString()
          });
        }
    
        // Recalculate totals
        const { itemCount, total } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
        state.activecart = true;
        state.error = null;
        state.syncStatus = 'needs-sync';
      },
      prepare: (payload) => {
        const { product, quantity, selectedAttributes } = payload;
        const sanitizedQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    
        // Validate attributes
        if (product.attributes && product.attributes.length > 0) {
          if (!selectedAttributes || selectedAttributes.length === 0) {
            return { payload: { error: 'Please select required attributes before adding to cart' } };
          }
    
          const missingAttributes = product.attributes.filter(attr =>
            !selectedAttributes.some(sel => sel.attribute_name === attr.name)
          );
    
          if (missingAttributes.length > 0) {
            return { payload: { error: `Please select ${missingAttributes.map(attr => attr.name).join(', ')}` } };
          }
        }
    
        return { 
          payload: { 
            product, 
            quantity: sanitizedQuantity, 
            selectedAttributes 
          } 
        };
      }
    }
    ,
    

    // Remove from Cart Action
    removeFromCart: (state, action) => {
      const { productId, attributeKey = '' } = action.payload;
    
      // Find and remove the item locally
      state.items = state.items.filter(item => {
        if (!attributeKey) return item.product.id !== productId;
        return !(item.product.id === productId && item.attributeKey === attributeKey);
      });
    
      // Recalculate totals
      const { itemCount, total } = calculateCartTotals(state.items);
      state.itemCount = itemCount;
      state.total = total;
      state.activecart = state.items.length > 0;
      state.syncStatus = 'needs-sync';
    },

    // Update Quantity Action
    updateQuantity: (state, action) => {
      const { productId, attributeKey = '', quantity } = action.payload;
    
      const itemIndex = state.items.findIndex(item =>
        item.product.id === productId && item.attributeKey === attributeKey
      );
    
      if (itemIndex !== -1) {
        const updatedQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    
        // Update the state immutably
        state.items = state.items.map((item, index) =>
          index === itemIndex
            ? { ...item, quantity: updatedQuantity }
            : item
        );
    

        const { itemCount, total } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
        state.syncStatus = 'synced';
      }
    },

    // Clear Cart Action
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.lastSync = new Date().toISOString();
      state.error = null;
      state.activecart = false;
      state.syncStatus = 'needs-sync';
    },

    // Update Cart from Server
    updateCartFromServer: (state, action) => {
      const serverItems = action.payload;
      
      // Merge server items with local cart
      const mergedItems = mergeCartItems(state.items, serverItems);
      
      state.items = mergedItems;
      
      // Recalculate totals
      const { itemCount, total } = calculateCartTotals(mergedItems);
      state.itemCount = itemCount;
      state.total = total;
      state.activecart = mergedItems.length > 0;
      state.lastSync = new Date().toISOString();
      state.syncStatus = 'synced';
    },

    // Set Active Cart
    setActiveCart: (state, action) => {
      console.log(action.payload)
      state.activecart = action.payload;
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart Data Handlers
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        const fetchedItems = (action.payload || []).map(item => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          campaign_id: item.campaign_id,
          discount_value: item.discount_value,
          product: item.product,
          attributes: item.attributes,
          attributeKey: item.attributes
            ? item.attributes.map(attr => `${attr.attribute_name}:${attr.attribute_option}`).join('|')
            : '',
          addedAt: new Date().toISOString()
        }));
  
        // Fix: Ensure unique cart items (remove duplicates)
        state.items = deduplicateCartItems(fetchedItems);
  
        const { itemCount, total } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      // Sync Cart Handlers
      .addCase(syncCart.pending, (state) => {
        state.loading = true;
        state.syncStatus = 'syncing';
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSync = action.payload.lastSync;
        state.syncStatus = 'synced';
        
        // Fix: Deduplicate items after sync
        if (action.payload.serverItems) {
          state.items = deduplicateCartItems(action.payload.serverItems);
          
          const { itemCount, total } = calculateCartTotals(state.items);
          state.itemCount = itemCount;
          state.total = total;
        }
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.loading = false;
        state.syncStatus = 'sync-failed';
        state.error = action.payload;
      })
  
      // Initialize Cart Handlers
      .addCase(initializeCart.fulfilled, (state) => {
        state.initialized = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const serverItems = action.payload.serverItems || [];
        state.items = deduplicateCartItems(serverItems); 
      
        const { itemCount, total } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
        state.syncStatus = 'synced';
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload; // Handle error
      });
      
  }
  
});

// Export Actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setActiveCart,
  updateCartFromServer,
  clearError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartInitialized = (state) => state.cart.initialized;
export const selectCartSyncStatus = (state) => state.cart.syncStatus;
export const selectActiveCart = (state) => state.cart.activecart;

export default cartSlice.reducer;
