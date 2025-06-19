import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosConfig";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch user"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await api.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Registration failed"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/users/${userId}/update-with-profile`,
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to update user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    token: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      state.token = null;
      state.error = null;
      state.updateError = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedUser = action.payload.data.user;
        const updatedProfile =
          action.payload.data.owner_profile ||
          action.payload.data.student_profile ||
          {};

        state.data = {
          ...state.data,
          ...updatedUser,
          owner_profile: state.data?.owner_profile
            ? { ...state.data.owner_profile, ...updatedProfile }
            : updatedProfile,
          student_profile: state.data?.student_profile
            ? { ...state.data.student_profile, ...updatedProfile }
            : updatedProfile,
        };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
