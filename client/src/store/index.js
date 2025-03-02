import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; // Import thunk as a named import
import authSlice from './auth-slice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
}); 

export default store;