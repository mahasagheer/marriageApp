import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for adding a hall
export const addHall = createAsyncThunk(
  'halls/addHall',
  async (hallData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', hallData.name);
      formData.append('location', hallData.location);
      formData.append('description', hallData.description);
      formData.append('capacity', hallData.capacity);
      formData.append('price', hallData.price);
      if (hallData.images && hallData.images.length > 0) {
        hallData.images.forEach((file) => {
          formData.append('images', file);
        });
      }
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/halls/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to add hall');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching halls
export const fetchHalls = createAsyncThunk(
  'halls/fetchHalls',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/halls/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch halls');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for deleting a hall
export const deleteHall = createAsyncThunk(
  'halls/deleteHall',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/halls/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to delete hall');
      return { id };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const hallSlice = createSlice({
  name: 'halls',
  initialState: {
    loading: false,
    error: null,
    success: false,
    halls: [],
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addHall.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addHall.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.halls.push(action.payload);
      })
      .addCase(addHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add hall';
        state.success = false;
      })
      .addCase(fetchHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.halls = action.payload;
      })
      .addCase(fetchHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch halls';
      })
      .addCase(deleteHall.fulfilled, (state, action) => {
        state.halls = state.halls.filter(hall => hall._id !== action.payload.id);
      });
  },
});

export const { resetSuccess } = hallSlice.actions;
export default hallSlice.reducer; 