import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod } from "../../api/index";
import { urls } from "../../global/Config";

const initialState = {
  status: false,
  loading: false,
  token: "",
  isAuthenticated: false,
  menu: [],
  restaurantInfo: null,
  error: null,
  isDelivery: true,
  DeliveryArea: null,
};

export const Login = createAsyncThunk(
  "auth/Login",
  async (body, { rejectWithValue }) => {
    try {
      const response = await postRequestMethod(urls.login, body);
      if (!response?.token) {
        throw new Error("Token missing in response");
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const Menu = createAsyncThunk(
  "auth/Menu",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        throw new Error("JWT Token not found");
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await getRequestMethod(urls.menu, headers);

      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      if (error.message.includes("Authentication error")) {
        dispatch(clearAuthState());
      }
      return rejectWithValue(error.message || "Failed to fetch menu");
    }
  }
);

export const RestaurantInfo = createAsyncThunk(
  "auth/RestaurantInfo",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        throw new Error("JWT Token not found");
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await getRequestMethod(urls.restaurant_inf, headers);

      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      if (error.message.includes("Authentication error")) {
        dispatch(clearAuthState());
      }
      return rejectWithValue(
        error.message || "Failed to fetch restaurant info"
      );
    }
  }
);

export const DeliveryArea = createAsyncThunk(
  "auth/DeliveryArea",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        throw new Error("JWT Token not found");
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await getRequestMethod(urls.delivery_area, headers);

      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      if (error.message.includes("Authentication error")) {
        dispatch(clearAuthState());
      }
      return rejectWithValue(
        error.message || "Failed to fetch restaurant info"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.token = "";
      state.isAuthenticated = false;
      state.loading = false;
      state.menu = [];
      state.restaurantInfo = null;
      state.error = null;
    },
    addToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setDeliveryMode: (state, action) => {
      state.isDelivery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(Login.rejected, (state, action) => {
        state.token = "";
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Menu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Menu.fulfilled, (state, action) => {
        state.menu = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(Menu.rejected, (state, action) => {
        state.menu = [];
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(RestaurantInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RestaurantInfo.fulfilled, (state, action) => {
        state.restaurantInfo = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(RestaurantInfo.rejected, (state, action) => {
        state.restaurantInfo = null;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(DeliveryArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeliveryArea.fulfilled, (state, action) => {
        state.DeliveryArea = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(DeliveryArea.rejected, (state, action) => {
        state.DeliveryArea = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthState, addToken, setAuthenticated, setDeliveryMode } =
  authSlice.actions;

export const showToken = (state) => state.auth.token;
export const showMenu = (state) => state.auth.menu;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const showLoading = (state) => state.auth.loading;
export const showRestaurantInfo = (state) => state.auth.restaurantInfo;
export const selectAuthError = (state) => state.auth.error;
export const selectDeliveryStatus = (state) => state.auth.isDelivery;
export const selectDeliveryArea = (state) => state.auth.DeliveryArea;

export default authSlice.reducer;
