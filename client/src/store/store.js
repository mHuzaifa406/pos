import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Ensure 'auth' key is correctly assigned
  },
});

export default store;
