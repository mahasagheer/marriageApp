import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import hallReducer from './slice/hallSlice';
import menuReducer from './slice/menuSlice';
import decorationReducer from './slice/decorationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    halls: hallReducer,
    menus: menuReducer,
    decorations: decorationReducer,
  },
}); 