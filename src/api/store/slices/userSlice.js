import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

// Update Profile API
export const updateuser = createAsyncThunk(
  "user/update",
  async (userData, { rejectWithValue }) => {
    try {
      if (!userData || typeof userData !== "object") {
        return rejectWithValue("Invalid user data provided");
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axiosInstance.post("/account-setting", userData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

// Change Password API
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      if (!passwordData || !passwordData.currentPassword || !passwordData.newPassword) {
        return rejectWithValue("Invalid password data provided");
      }
      const response = await axiosInstance.post("/password-setting", passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

// Delete Account API
export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/delete-account");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Get User Data API
export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchAddresses = createAsyncThunk(
  "user/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/get-addresses");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAddress = createAsyncThunk(
  "user/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create-address", addressData);
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update-address", addressData);
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/delete-address", addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: {
      updateUser: false,
      changePassword: false,
      deleteAccount: false,
      getUserData: false,
      fetchAddresses: false,
      createAddress: false,
      updateAddress: false,
      deleteAddress: false,
    },
    error: null,
    addresses: [],
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Update User
      .addCase(updateuser.pending, (state) => {
        state.loading.updateUser = true;
      })
      .addCase(updateuser.fulfilled, (state, action) => {
        state.loading.updateUser = false;
        state.user = action.payload.user;
        state.error = false;
      })
      .addCase(updateuser.rejected, (state, action) => {
        state.loading.updateUser = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading.changePassword = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading.changePassword = false;
        state.error = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading.changePassword = false;
        state.error = action.payload;
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading.deleteAccount = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading.deleteAccount = false;
        state.user = null;
        state.error = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading.deleteAccount = false;
        state.error = action.payload;
      })
      // Get User Data
      .addCase(getUserData.pending, (state) => {
        state.loading.getUserData = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading.getUserData = false;
        state.user = action.payload;
        state.error = false;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading.getUserData = false;
        state.error = action.payload;
      })
      .addCase(fetchAddresses.pending, (state) => {
        state.loading.fetchAddresses = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading.fetchAddresses = false;
        state.addresses = Array.isArray(action.payload.address)
          ? action.payload.address
          : [];
        state.error = false;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading.fetchAddresses = false;
        state.error = action.payload;
        state.error = false;
      })
    // Create Address
    .addCase(createAddress.pending, (state) => {
      state.loading.createAddress = true;
    })
    .addCase(createAddress.fulfilled, (state, action) => {
      state.loading.createAddress = false;
      state.addresses.push(action.payload);
      state.error = false;
    })
    .addCase(createAddress.rejected, (state, action) => {
      state.loading.createAddress = false;
      state.error = action.payload;
      state.error = false;
    })
    // Update Address
    .addCase(updateAddress.pending, (state) => {
      state.loading.updateAddress = true;
    })
    .addCase(updateAddress.fulfilled, (state, action) => {
      state.loading.updateAddress = false;
      state.addresses = state.addresses.map((address) =>
        address.id === action.payload.id ? action.payload : address
      );
      state.error = false;
    })
    .addCase(updateAddress.rejected, (state, action) => {
      state.loading.updateAddress = false;
      state.error = action.payload;
      state.error = false;
    })
    .addCase(deleteAddress.pending, (state) => {
      state.loading.deleteAddress = true;
    })
    .addCase(deleteAddress.fulfilled, (state, action) => {
      state.loading.deleteAddress = false;
      state.addresses = Array.isArray(action.payload.address)
      ? action.payload.address
      : [];
      state.error = false;
    })
    .addCase(deleteAddress.rejected, (state, action) => {
      state.loading.deleteAddress = false;
      state.error = action.payload;
      state.error = false;
    });
    
  },
});

export const { logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
