import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = `${process.env.REACT_APP_API_URL}/dashboard`;

export const fetchSummary = createAsyncThunk(
    'agencyDashboard/fetchSummary',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/summary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch summary');
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );




  export const fetchMiniCards = createAsyncThunk(
    'agencyDashboard/fetchMiniCards',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/mini-cards`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch summary');
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );

const agencyDashboardSlice = createSlice({
  name: "agencyDashboard",
  initialState: {
    summary: null,
    miniCards: [],
    monthlyTarget: { value: 0, target: 0 },
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
 
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary = action.payload.summary;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.status = "failed";    
        state.error = action.payload;
      })

     
  },
});

export const { clearAgencyDashboard } = agencyDashboardSlice.actions;
export default agencyDashboardSlice.reducer;
