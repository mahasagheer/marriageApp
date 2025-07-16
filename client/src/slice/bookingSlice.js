import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = process.env.REACT_APP_API_URL;

// Fetch all bookings for the owner
export const fetchOwnerBookings = createAsyncThunk(
  'bookings/fetchOwnerBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/halls/owner/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch bookings');
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch a single booking by id
export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/halls/bookings/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch booking');
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Update booking status (approve/reject)
export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/halls/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to update status');
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch all bookings for admin
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/bookings/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch bookings');
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch manager bookings
export const fetchManagerBookings = createAsyncThunk(
  'bookings/fetchManagerBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/halls/manager/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch bookings');
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch bookings for current user (role-based)
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/booking`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch bookings');
      // The new endpoint returns an array
      return Array.isArray(data) ? data : data.bookings || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch payment info for a booking
export const fetchPaymentByBookingId = createAsyncThunk(
  'bookings/fetchPaymentByBookingId',
  async (bookingId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/booking/payment/by-booking/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch payment');
      return data.payment;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Manager shares payment number
export const sharePaymentNumber = createAsyncThunk(
  'bookings/sharePaymentNumber',
  async ({ bookingId, paymentNumber }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/booking/${bookingId}/share-payment-number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentNumber })
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to share payment number');
      return data.payment;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Manager verifies or rejects payment
export const verifyPayment = createAsyncThunk(
  'bookings/verifyPayment',
  async ({ paymentId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/booking/payment/${paymentId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to verify payment');
      return data.payment;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    actionStatus: {}, // { [bookingId]: 'loading' | 'error' | status }
    selectedBooking: null,
    selectedBookingLoading: false,
    selectedBookingError: null,
  },
  reducers: {
    clearSelectedBooking(state) {
      state.selectedBooking = null;
      state.selectedBookingLoading = false;
      state.selectedBookingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchOwnerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      })
      // Fetch all bookings for admin
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      })
      // Fetch manager bookings
      .addCase(fetchManagerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchManagerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      })
      // Fetch single booking
      .addCase(fetchBookingById.pending, (state) => {
        state.selectedBookingLoading = true;
        state.selectedBookingError = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.selectedBookingLoading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.selectedBookingLoading = false;
        state.selectedBookingError = action.payload || 'Failed to fetch booking';
      })
      // Update booking status
      .addCase(updateBookingStatus.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.actionStatus[id] = 'loading';
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.actionStatus[id] = status;
        // Update the booking in the list
        const idx = state.bookings.findIndex(b => b._id === id);
        if (idx !== -1) state.bookings[idx].status = status;
        // Also update selectedBooking if open
        if (state.selectedBooking && state.selectedBooking._id === id) {
          state.selectedBooking.status = status;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.actionStatus[id] = 'error';
      })
      // Fetch bookings for current user (role-based)
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      });
  },
});

export const { clearSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer; 