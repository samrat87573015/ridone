import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axiosInstance"
import { toast } from "react-toastify"

// Async Thunks
export const getWishlist = createAsyncThunk("wishlist/getWishlist", async (_, { getState }) => {
  const state = getState()
  const user_id = state.user.user?.id
  if (!user_id) throw new Error("User not logged in")

  console.log("Fetching wishlist for user ID:", user_id)

  try {
    const response = await axiosInstance.get(`/get-wishlist`, { params: { user_id } })
    console.log("Wishlist fetched:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    throw error
  }
})

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product_id, { getState, rejectWithValue }) => {
    const state = getState()
    const userId = state.user.user?.id

    if (!userId) {
      toast.error("Please login to add product to wishlist")
      return rejectWithValue("User not logged in")
    }

    console.log("Entire State:", state)
    const wishlist = state.wishlist.items
    console.log("Wishlist Items:", wishlist)

    const existingItem = wishlist.find((item) => item.id === product_id || item.product_id === product_id)
    console.log("Existing Item:", existingItem)

    if (existingItem) {
      toast.info("Product is already in your wishlist ✅")
      return rejectWithValue("Product already added")
    }

    try {
      const response = await axiosInstance.post(`/add-to-wishlist`, { userId, product_id })
      toast.success("Product added to wishlist")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add product to wishlist")
    }
  },
)

export const deleteWishlist = createAsyncThunk("wishlist/deleteWishlist", async (id, { getState }) => {
  const state = getState()
  const user_id = state.user.user?.id
  if (!user_id) throw new Error("User not logged in")

  try {
    await axiosInstance.delete(`/delete-wishlist/${id}`)
    console.log("Deleted wishlist item with ID:", id)
    return id
  } catch (error) {
    console.error("Error deleting wishlist item:", error)
    throw error
  }
})

// Wishlist Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.fulfilled, (state, action) => {
        console.log("Wishlist fetched successfully:", action.payload)
        state.items = action.payload
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        console.log("Adding product to wishlist:", action.payload)
        state.items.push(action.payload)
      })
      .addCase(deleteWishlist.fulfilled, (state, action) => {
        console.log("Removing product from wishlist with ID:", action.payload)
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

// Selectors
export const selectWishlist = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length

export default wishlistSlice.reducer

