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

// Async thunk for updating a hall
export const updateHall = createAsyncThunk(
  'halls/updateHall',
  async ({ id, hallData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (hallData.name) formData.append('name', hallData.name);
      if (hallData.location) formData.append('location', hallData.location);
      if (hallData.description) formData.append('description', hallData.description);
      if (hallData.capacity) formData.append('capacity', hallData.capacity);
      if (hallData.price) formData.append('price', hallData.price);
      if (hallData.images && hallData.images.length > 0) {
        hallData.images.forEach((file) => {
          formData.append('images', file);
        });
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/halls/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update hall');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching a single hall
export const fetchSingleHall = createAsyncThunk(
  'halls/fetchSingleHall',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/halls/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch hall');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching all available dates for the current owner
export const fetchOwnerAvailableDates = createAsyncThunk(
  'halls/fetchOwnerAvailableDates',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/sample/owner/available-dates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch available dates');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for updating an available date
export const updateHallAvailableDate = createAsyncThunk(
  'halls/updateHallAvailableDate',
  async ({ id, date }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/sample/available-dates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to update date');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for adding available dates to a hall
export const addAvailableDates = createAsyncThunk(
  'halls/addAvailableDates',
  async ({ hallId, dates }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/halls/${hallId}/available-dates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dates }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to add available dates');
      return data;
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
    singleHall: null,
    ownerAvailableDates: [],
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
      })
      .addCase(updateHall.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateHall.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.halls = state.halls.map(hall => hall._id === action.payload._id ? action.payload : hall);
      })
      .addCase(updateHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update hall';
        state.success = false;
      })
      .addCase(fetchSingleHall.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleHall = null;
      })
      .addCase(fetchSingleHall.fulfilled, (state, action) => {
        state.loading = false;
        state.singleHall = action.payload;
      })
      .addCase(fetchSingleHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch hall';
        state.singleHall = null;
      })
      .addCase(fetchOwnerAvailableDates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerAvailableDates.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerAvailableDates = action.payload;
      })
      .addCase(fetchOwnerAvailableDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch available dates';
      });
  },
});

export const { resetSuccess } = hallSlice.actions;
export default hallSlice.reducer; 