import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import hallReducer from './slice/hallSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    halls: hallReducer,
  },
}); 