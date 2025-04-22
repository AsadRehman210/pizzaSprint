import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { STORE_KEY } from "../../global/Config.js";
import authReducer from "../slice/authSlice.js";

// Import slices
import pizzaReducer from "../slice/pizzaSlice.js";

// Create the encryptor for secure storage
const encryptor = encryptTransform({
  secretKey: STORE_KEY, // Replace with your actual secret key
  onError: function (error) {
    console.error("Encryption error:", error);
  },
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["pizza", "auth"],
  transforms: [encryptor],
};

// Combine reducers
const rootReducer = combineReducers({
  pizza: pizzaReducer,
  auth: authReducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks for redux-persist
    }),
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
