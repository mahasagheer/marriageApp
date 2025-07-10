import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import hallReducer from './slice/hallSlice';
import menuReducer from './slice/menuSlice';
import decorationReducer from './slice/decorationSlice';
import chatReducer from './slice/chatSlice';
import bookingReducer from './slice/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    halls: hallReducer,
    menus: menuReducer,
    decorations: decorationReducer,
    chat: chatReducer,
    bookings: bookingReducer, // <-- add this line

  },
}); 