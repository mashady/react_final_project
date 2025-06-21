import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";
import {
  startToggle,
  completeToggle,
  toggleFailed,
  setError,
  setLoading,
  setWishlist,
} from "./wishlistSlice";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wishlist");
      const data = response.data.data?.data || [];
      return Array.isArray(data) ? data : [data];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const toggleWishlistItem =
  (propertyId) => async (dispatch, getState) => {
    try {
      const { items } = getState().wishlist;
      const currentStatus = items.some((item) => item.id === propertyId);

      dispatch(startToggle(propertyId));

      const response = await api.post(`/wishlist/toggle/${propertyId}`);
      const serverStatus = response.data?.is_in_wishlist;

      if (typeof serverStatus !== "boolean") {
        throw new Error("Invalid server response format");
      }

      dispatch(
        completeToggle({
          propertyId,
          isInWishlist: serverStatus,
        })
      );

      return response.data.message;
    } catch (err) {
      dispatch(toggleFailed(propertyId));
      dispatch(setError(err.message || "Failed to update wishlist"));
      throw err;
    }
  };
