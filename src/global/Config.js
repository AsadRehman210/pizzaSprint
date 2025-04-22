export const STORE_KEY = process.env.REACT_APP_STORE_KEY;
export const BASE_URL = process.env.REACT_APP_API_URL;

// Add urls for apis globally
export const urls = {
  login: "/api/login_check",
  menu: "/api/v1/menu",
  restaurant_inf: "/api/v1/restaurant",
  delivery_area: "/api/v1/delivery/area",
};
// Global status codes for apis response
export const SUCCESS = 200;
export const UPDATED = 204;
export const FAILED = 400;
export const EXIST = 409;
export const NOT_EXIST = 404;
export const EXCEPTION = 500;
export const UNAUTHORIZED = 401;
export const NO_ACCESS = 403;
export const TO0_MANY_CODE = 429;
export const TOO_MANY_REQUEST = "Request failed with status code 429";
export const FORBIDDEN_ERROR =
  "Access denied. You don't have permission to access this resource.";

export const NETWORK_ERROR =
  "Network error: Please check your internet connection.";
export const SESSION_ERROR =
  "Your session has expired. Please log in again to continue.";

export const REGISTER_EMAIL_CODE_MESSAGE =
  "Please enter the 6-digit code that has been sent to your email.";
