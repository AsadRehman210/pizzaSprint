import axios from "axios";
import {
  BASE_URL,
  UNAUTHORIZED,
  NETWORK_ERROR,
  FORBIDDEN_ERROR,
} from "../global/Config";
import { toast } from "react-toastify";
import { addToken, clearAuthState } from "../redux/slice/authSlice";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let alertShown = false;
let navigationRef = null;

export const setNavigation = (navigate) => {
  navigationRef = navigate;
};

const getStore = () => import("../redux/store/store").then((mod) => mod.store);

export const setupInterceptors = (navigate) => {
  setNavigation(navigate);

  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const store = await getStore();
        const token = store.getState().auth.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => {
      if (response?.data?.token) {
        getStore().then((store) => {
          store.dispatch(addToken(response.data.token));
        });
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const store = await getStore();

      if (error.message === "Network Error") {
        if (!alertShown && !navigator.onLine) {
          alertShown = true;
          toast.error(NETWORK_ERROR);
          setTimeout(() => (alertShown = false), 5000);
        }
        return Promise.reject(error);
      }

      // Handle 403 Forbidden errors
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        store.dispatch(clearAuthState());

        if (navigationRef) {
          navigationRef("/");
        }

        if (!alertShown) {
          alertShown = true;
          toast.error(FORBIDDEN_ERROR);
          setTimeout(() => (alertShown = false), 5000);
        }
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        store.dispatch(clearAuthState());

        if (navigationRef) {
          navigationRef("/");
        }

        if (!alertShown) {
          alertShown = true;
          toast.error(UNAUTHORIZED);
          setTimeout(() => (alertShown = false), 5000);
        }
      }

      if (error.response?.data?.message && !alertShown) {
        alertShown = true;
        toast.error(error.response.data.message);
        setTimeout(() => (alertShown = false), 5000);
      }

      return Promise.reject(error);
    }
  );
};

export const getRequestMethod = async (endpoint, headers = {}) => {
  try {
    const response = await apiClient.get(endpoint, { headers });
    return response.data;
  } catch (error) {
    if ([401, 403].includes(error.response?.status)) {
      throw new Error("Authentication error");
    }
    throw error;
  }
};

export const postRequestMethod = async (endpoint, data, headers = {}) => {
  try {
    const response = await apiClient.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    if ([401, 403].includes(error.response?.status)) {
      throw new Error("Authentication error");
    }
    throw error;
  }
};

export const putRequestMethod = async (endpoint, data, headers = {}) => {
  try {
    const response = await apiClient.put(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    if ([401, 403].includes(error.response?.status)) {
      throw new Error("Authentication error");
    }
    throw error;
  }
};

export const deleteRequestMethod = async (endpoint, headers = {}) => {
  try {
    const response = await apiClient.delete(endpoint, { headers });
    return response.data;
  } catch (error) {
    if ([401, 403].includes(error.response?.status)) {
      throw new Error("Authentication error");
    }
    throw error;
  }
};

export default apiClient;
