import { createSlice } from '@reduxjs/toolkit';

// Retrieve authentication state from localStorage, ensuring a default value
const savedAuth = localStorage.getItem('authData');
const initialAuthState = savedAuth
  ? JSON.parse(savedAuth)
  : { isAuth: false, username: '', role: null, clockInTime: '' };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.clockInTime = action.payload.clockInTime;

      // Save authentication data to localStorage
      localStorage.setItem('authData', JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuth = false;
      state.username = '';
      state.role = null;
      state.clockInTime = '';

      // Clear authentication data from localStorage
      localStorage.removeItem('authData');
    },
  },
});

export const authactions = authSlice.actions;
export default authSlice.reducer;
