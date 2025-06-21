import { createSlice } from "@reduxjs/toolkit";
import { fetchWishlist } from "./wishlistThunks";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
    pendingToggles: {},
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    addToWishlist: (state, action) => {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    startToggle: (state, action) => {
      state.pendingToggles[action.payload] = true;
    },
    completeToggle: (state, action) => {
      const { propertyId, isInWishlist } = action.payload;
      delete state.pendingToggles[propertyId];

      if (isInWishlist) {
        if (!state.items.some((item) => item.id === propertyId)) {
          state.items.push({ id: propertyId });
        }
      } else {
        state.items = state.items.filter((item) => item.id !== propertyId);
      }
    },
    toggleFailed: (state, action) => {
      delete state.pendingToggles[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  setLoading,
  setError,
  startToggle,
  completeToggle,
  toggleFailed,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
