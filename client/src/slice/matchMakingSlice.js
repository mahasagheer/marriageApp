// features/matchmaking/matchmakingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API = `${process.env.REACT_APP_API_URL}/match-preference`

// GET /api/Prefernece/:id  – single Prefernece profile
export const getPreferences = createAsyncThunk(
  "Prefernece/getPreferences",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// POST /api/Preference – create Preference
export const createPreference = createAsyncThunk(
  "Preference/create",
  async (preferenceData, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferenceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create Preference profile');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// PUT /api/Preference/:id  – update Preference
export const updatePreference = createAsyncThunk(
  "Preference/update",
  async (updates , { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(updates)
      });

      const data = response.json()
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);




const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState: {
    preferenceData: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetMatchmakingState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Preferences
      .addCase(getPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferenceData = action.payload;
      })
      .addCase(getPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch preferences';
      })

      // Save Preferences
      .addCase(createPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preferenceData = action.payload;
        state.success = true;
      })
      .addCase(createPreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to save preferences';
      });
  }
});

export const { resetMatchmakingState } = matchmakingSlice.actions;
export default matchmakingSlice.reducer;