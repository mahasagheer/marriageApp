import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = process.env.REACT_APP_API_URL;

// Async thunk for creating a decoration
export const createDecoration = createAsyncThunk(
  'decorations/createDecoration',
  async (decorationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/decorations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(decorationData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create decoration');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching decorations by hall
export const fetchDecorationsByHall = createAsyncThunk(
  'decorations/fetchDecorationsByHall',
  async (hallId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/decorations/hall/${hallId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch decorations');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for updating a decoration
export const updateDecoration = createAsyncThunk(
  'decorations/updateDecoration',
  async ({ decorationId, decorationData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/decorations/${decorationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(decorationData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update decoration');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for deleting a decoration
export const deleteDecoration = createAsyncThunk(
  'decorations/deleteDecoration',
  async (decorationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/decorations/${decorationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to delete decoration');
      return { decorationId };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for changing decoration status
export const changeDecorationStatus = createAsyncThunk(
  'decorations/changeDecorationStatus',
  async ({ decorationId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/decorations/${decorationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to change decoration status');
      return data.decoration;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const decorationSlice = createSlice({
  name: 'decorations',
  initialState: {
    loading: false,
    error: null,
    success: false,
    decorations: [],
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDecoration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDecoration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.decorations.push(action.payload);
      })
      .addCase(createDecoration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create decoration';
        state.success = false;
      })
      .addCase(fetchDecorationsByHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDecorationsByHall.fulfilled, (state, action) => {
        state.loading = false;
        state.decorations = action.payload;
      })
      .addCase(fetchDecorationsByHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch decorations';
      })
      .addCase(updateDecoration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDecoration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.decorations = state.decorations.map(decoration => 
          decoration._id === action.payload._id ? action.payload : decoration
        );
      })
      .addCase(updateDecoration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update decoration';
        state.success = false;
      })
      .addCase(deleteDecoration.fulfilled, (state, action) => {
        state.decorations = state.decorations.filter(decoration => decoration._id !== action.payload.decorationId);
      })
      .addCase(changeDecorationStatus.fulfilled, (state, action) => {
        state.decorations = state.decorations.map(decoration => decoration._id === action.payload._id ? action.payload : decoration);
        state.success = true;
        state.error = null;
      })
      .addCase(changeDecorationStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to change decoration status';
        state.success = false;
      });
  },
});

export const { resetSuccess, resetError } = decorationSlice.actions;
export default decorationSlice.reducer; 