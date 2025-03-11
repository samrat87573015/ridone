import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

// Thunk to fetch data
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/home");
      return response.data; // Includes sliders, categories, products, blogs
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    sliders: [],
    testimonials: [],
    categories: [],
    products: [],
    blogs: [],
    siteinfos: [],
    sidebar: {},
    compaign: null, // Added missing field
    feature: [], // Added missing field
    loading: false,
    error: null,
    hasLoaded: false, // Flag to track data loading
  },
  reducers: {
    resetHomeData: (state) => {
      // Reset the entire state to initial values
      state.sliders = [];
      state.testimonials = [];
      state.categories = [];
      state.products = [];
      state.blogs = [];
      state.siteinfos = [];
      state.sidebar = {};
      state.compaign = null;
      state.feature = [];
      state.loading = false;
      state.error = null;
      state.hasLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = action.payload.sliders || [];
        state.testimonials = action.payload.testimonials || [];
        state.categories = action.payload.categories || [];
        state.products = action.payload.products || [];
        state.compaign = action.payload.compaign || null;
        state.feature = action.payload.featureProducts || [];
        state.blogs = action.payload.blogs || [];
        state.siteinfos = action.payload.siteinfos || [];
        state.sidebar = action.payload.sidebar || {};
        state.hasLoaded = true; // Mark as loaded
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default homeSlice.reducer;

// Export reset action
export const { resetHomeData } = homeSlice.actions;

// Selectors
export const selectHasLoaded = (state) => state.home.hasLoaded;
export const getslider = (state) => state.home.sliders;
export const getsidebar = (state) => state.home.sidebar;
export const gettestimonials = (state) => state.home.testimonials;
export const getCategorys = (state) => state.home.categories;
export const getProducts = (state) => state.home.products;
export const getCompaignProduct = (state) => state.home.compaign;
export const getBlogs = (state) => state.home.blogs;
export const selectLoading = (state) => state.home.loading;
export const selectError = (state) => state.home.error;
