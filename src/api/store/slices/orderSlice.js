import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosInstance';
import { generateGuestId } from './cartSlice';





export const saveIncompleteOrder = createAsyncThunk(
  "orders/saveIncompleteOrder",
  async ({ items, userDetails, deliveryCharge }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Prepare payload
      const payload = {
        items,
        userDetails,
        delivery_charge: deliveryCharge,
      };

      // Make API request
      const response = await axiosInstance.post("/orders/incomplete", payload, {
        headers,
      });
      return response.data; // Assuming response includes order details or confirmation
    } catch (error) {
      console.error("Failed to save incomplete order:", error);
      return rejectWithValue(error.response?.data || "Failed to save order");
    }
  }
);


export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    {
      items,
      isDirectOrder = false,
      userDetails,
      Delivary_charge,
      Order_status,
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = localStorage.getItem("token");
      const guestId = generateGuestId();
      const userId = state.user?.user?.id || guestId;

      // Force items to be an array, with extra defensive checks
      let itemsArray;
      if (Array.isArray(items)) {
        itemsArray = items;
      } else if (items && typeof items === 'object') {
        itemsArray = [items];
      } else {
        console.error("Items is neither an array nor an object:", items);
        return rejectWithValue("Invalid items format");
      }

      // Transform items with extra safeguards
      const transformedItems = itemsArray.map((item) => {
        //console.log("Processing item:", item);
        
        const basePrice = parseFloat(item.product?.price || 0);
        const quantity = parseInt(item.quantity || 1, 10);
        const itemTotal = basePrice * quantity;

        const campaignDiscount = item.discount_value
          ? parseFloat(item.discount_value) * quantity
          : 0;
        const couponDiscount = item.coupon_discount
          ? parseFloat(item.coupon_discount) * quantity
          : 0;
        const finalPrice = itemTotal - campaignDiscount - couponDiscount;

        // Handle different attribute formats based on order type
        let attributeOptionId;
        
        if (isDirectOrder) {
          // For direct orders, use the attributeOptionId directly if it exists
          if (item.attributeOptionId) {
            attributeOptionId = item.attributeOptionId;
          } 
          // Fallback: try to extract from attribute_values if available
          else if (Array.isArray(item.attribute_values)) {
            attributeOptionId = item.attribute_values.join(",");
          }
          // Fallback: extract IDs from attributes array
          else if (Array.isArray(item.attributes)) {
            attributeOptionId = item.attributes.map(attr => attr.id).join(",");
          }
          else {
            attributeOptionId = "";
          }
        } else {
          // For cart orders, extract product_attr_id from attributes
          if (Array.isArray(item.attributes)) {
            attributeOptionId = item.attributes
              .map((attr) => attr.product_attr_id)
              .filter(Boolean)
              .join(",");
          } else {
            attributeOptionId = "";
          }
        }

        return {
          product_id: item.product_id,
          quantity: quantity,
          individual_price: basePrice,
          total: finalPrice,
          attributes: item.attributes || [],
          attributeOptionId: attributeOptionId,
          campaign_discount: campaignDiscount,
          coupon_discount: couponDiscount,
          original_price: itemTotal,
        };
      });

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Calculate order totals
      const orderTotals = transformedItems.reduce(
        (acc, item) => ({
          subtotal: acc.subtotal + item.original_price,
          totalCampaignDiscount:
            acc.totalCampaignDiscount + item.campaign_discount,
          totalCouponDiscount: acc.totalCouponDiscount + item.coupon_discount,
        }),
        { subtotal: 0, totalCampaignDiscount: 0, totalCouponDiscount: 0 }
      );

      // Create the final order payload
      const orderPayload = {
        items: transformedItems,
        user_id: userId,
        user_name: userDetails?.name,
        address: userDetails?.address || "",
        select_area: userDetails?.area || "",
        phone_number: userDetails?.phone || "",
        alternative_phone_number: userDetails?.alternativePhone || "",
        note: userDetails?.note || "",
        order_status: Order_status,
        order_type: "checkout",
        payment_status: userDetails?.payment_status || "Pending",
        delivery: userDetails?.paymentType || "cashon",
        delivery_charge: Delivary_charge || 0,
        shipping_price: userDetails?.shippingPrice || 0,
        subtotal: orderTotals.subtotal,
        total_campaign_discount: orderTotals.totalCampaignDiscount,
        total_coupon_discount: orderTotals.totalCouponDiscount,
        final_total:
          orderTotals.subtotal -
          orderTotals.totalCampaignDiscount -
          orderTotals.totalCouponDiscount +
          (Delivary_charge || 0),
        is_direct_order: isDirectOrder,
        incomplete_order_id: state.order?.incompleteOrder?.id || 0,
      };

      console.log("Final order payload:", orderPayload);
      localStorage.setItem("orderpayload", JSON.stringify(orderPayload));

      // Set the API endpoint
      const apiEndpoint = "/create-order";

      // Make the POST request
      const response = await axiosInstance.post(apiEndpoint, orderPayload, {
        headers,
      });
      localStorage.setItem("latestOrder", JSON.stringify(response.data));

      // Return the response data
      return response.data;
    } catch (error) {
      console.error("Order creation error:", error);
      return rejectWithValue(error.response?.data || "Failed to create order");
    }
  }
);




// Fetch Orders
export const informations = createAsyncThunk(
  'orders/informations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axiosInstance.get('/informations',{headers});

      return response.data;
    } catch (error) {
      console.error('Fetch orders error:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Fetch Orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = localStorage.getItem('token');
      const guestId = generateGuestId();

      const userId = state.user?.user?.id || guestId;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axiosInstance.get('/order-get', {
        headers,
        params: { user_id: userId },
      });

      return response.data;
    } catch (error) {
      console.error('Fetch orders error:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);
// Function to load directOrderItems from localStorage
const loadDirectOrderItems = () => {
  try {
    const savedItems = localStorage.getItem('directOrderItems');
    return JSON.parse(savedItems);
  } catch (error) {
    return [];
  }
};


export const checkcoupon = createAsyncThunk(
  'orders/coupon',
  async (data, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('token');
      const state = getState();
      
      // Ensure product_ids are properly extracted
      const productIds = state.cart.items 
        ? state.cart.items.map(item => item.product.id)
        : (state.order.directOrderItems 
          ? (Array.isArray(state.order.directOrderItems) 
            ? state.order.directOrderItems.map(item => item.product.id) 
            : [state.order.directOrderItems.product.id])
          : []);

      // Merge provided product_ids with extracted product_ids
      const mergedProductIds = [...new Set([...data.product_ids, ...productIds])];

      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      };

      // Send request to check the coupon with merged product_ids
      const response = await axiosInstance.post('/check-coupon', {
        ...data,
        product_ids: mergedProductIds
      }, { headers });

      return response.data;
    } catch (error) {
      console.error('Coupon check error:', error);

      const errorMessage =
        error.response?.data?.error || 'Failed to verify the coupon';
      
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    currentOrderpayload: null,
    loading: false,
    deliveryCharge: 0,
    sitedata: [],
    error: null,
    couponResponse: null, // Add a new state to store coupon response
    isDirectOrder: localStorage.getItem('directOrderItems') ? true : false,
    directOrderItems: loadDirectOrderItems(),
    incompleteOrder: null, // Add state to track incomplete orders
  },
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.currentOrderpayload = null;
      state.isDirectOrder = false;
      state.directOrderItems = [];
      localStorage.removeItem('directOrderItems'); // Clear from localStorage as well
    },
    setDirectOrder(state, action) {
      state.isDirectOrder = true;
      state.directOrderItems = action.payload; // Store direct order items
      localStorage.setItem('directOrderItems', JSON.stringify(action.payload));
    },
    resetDirectOrder(state) {
      state.isDirectOrder = false;
      state.directOrderItems = []; // Clear direct order items
      localStorage.removeItem('directOrderItems'); // Clear from localStorage as well
    },
    setDelivaryCost(state,action) {

      state.deliveryCharge = action.payload;
      
    },
    resetCoupon(state) {
      state.couponResponse = null;
      // Reset any coupon-related modifications to items
      if (Array.isArray(state.directOrderItems)) {
        state.directOrderItems = state.directOrderItems.map(item => {
          const { coupon_discount, coupon_id, aftercouponprice, ...rest } = item;
          return rest;
        });
      } else if (state.directOrderItems) {
        const { coupon_discount, coupon_id, aftercouponprice, ...rest } = state.directOrderItems;
        state.directOrderItems = rest;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Coupon handling
      .addCase(checkcoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponResponse = null;
      })
      .addCase(checkcoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponResponse = action.payload; // Store full coupon response
        
        // Extract product discounts from the action payload
        const productDiscounts = action.payload.product_discounts || [];
      
        // Enhanced discount application logic
        const applyDiscount = (item) => {
          // Find matching discount for the item
          const discountDetail = productDiscounts.find(
            (discount) => discount.product_id === item.product.id
          );
    
          // If a discount is found, update the item
          if (discountDetail) {
            return {
              ...item,
              coupon_discount: discountDetail.discount_amount,
              coupon_id: discountDetail.id,
              aftercouponprice: discountDetail.final_price,
            };
          }
    
          // If no discount is found, return the item unchanged
          return item;
        };
    
        // Handle both array and single item scenarios
        if (Array.isArray(state.directOrderItems)) {
          state.directOrderItems = state.directOrderItems.map(applyDiscount);
        } else if (state.directOrderItems) {
          state.directOrderItems = applyDiscount(state.directOrderItems);
        }
      })
      .addCase(checkcoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.couponResponse = null;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = JSON.parse(localStorage.getItem('orderpayload'));
        state.currentOrderpayload = action.payload;
        state.incompleteOrder = action.payload;
        localStorage.setItem('guestId', action.payload.user_identifier);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch informations
      .addCase(informations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(informations.fulfilled, (state, action) => {
        state.loading = false;
        state.sitedata = (action.payload?.data && Array.isArray(action.payload.data) && action.payload.data.length > 0) 
  ? action.payload.data[0] 
  : [];

      
      })
      .addCase(informations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.deliveryCharge = 0;
      })
      .addCase(saveIncompleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveIncompleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.incompleteOrder = action.payload; // Track saved incomplete order data
      })
      .addCase(saveIncompleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { 
  clearCurrentOrder, 
  setDirectOrder, 
  resetDirectOrder, 
  setDelivaryCost,
  resetCoupon // Add the new action
} = orderSlice.actions;

export default orderSlice.reducer;