import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = `${process.env.REACT_APP_API_URL}/visibility`;

export const getVisibility = createAsyncThunk(
  'visibility/getVisibility',
  async ({ agencyId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/matrix/${agencyId}/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// POST /api/agency – create Agency
export const createVisibilty = createAsyncThunk(
  "visibility/create",
  async ({agencyId, visibilityData}, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API}/update/${agencyId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({visibilityData})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create agency profile');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const publicProfileVisibilty = createAsyncThunk(
  "visibility/publicProfileVisibilty",
  async ({agencyId, profileId}, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    console.log(agencyId,profileId)
    try {
      const response = await fetch(`${API}/make-profile-public/${agencyId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create agency profile');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const privateProfileVisibilty = createAsyncThunk(
  "visibility/privateProfileVisibilty",
  async ({agencyId, profileId}, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API}/make-profile-private/${agencyId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create agency profile');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProfileVisibility = createAsyncThunk(
  "visibility/fetchProfileVisibility",
  async ({userId,agencyId}, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API}/is-public/${userId}/${agencyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch visibility");
      }

      return data.isPublic;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchPublicProfiles = createAsyncThunk(
  "visibility/fetchPublicProfiles",
  async ({agencyId}, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API}/public-profiles/${agencyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch public profiles");
      }

      return data.profiles;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const visbilitySlice = createSlice({
  name: 'visibility',
  initialState: {
    sessions: [],
    current: null, // selected session
    messages: [],
    status: 'idle',
    error: null,
  },
 
  extraReducers: (builder) => {
    builder

      .addCase(getVisibility.fulfilled, (state, action) => {
        state.sessions.push(action.payload); // or filter + push if you want to avoid duplicates
      })
      // Fetch Sessions
      .addCase(createVisibilty.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(createVisibilty.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.sessions = payload;
      })
      .addCase(createVisibilty.rejected, (s, { payload }) => {
        s.status = 'failed';
        s.error = payload;
      })

  },
});

export default visbilitySlice.reducer;
