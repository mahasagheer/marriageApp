// src/slice/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = `${process.env.REACT_APP_API_URL}/userProfile`;

// GET /api/profiles  – all profiles
export const fetchProfiles = createAsyncThunk(
  "profiles/fetchAll",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API}/allProfiles`,{
        method:"GET",
        headers:{
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


// GET /api/profiles/:id  – single profile
export const fetchProfileById = createAsyncThunk(
  "profiles/fetchById",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}/${id}`,{
        method:"GET",
        headers:{
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


// GET /api/profiles/:id  – single profile
export const fetchProfileByuserId = createAsyncThunk(
  "profiles/fetchById",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}/user/${id}`,{
        method:"GET",
        headers:{
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


export const getTokenVerification = createAsyncThunk(
  "profiles/getTokenVerification",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/public/${token}`,{
        method:"GET",
      });
      const data = await response.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// POST /api/profiles – create profile
export const createProfile = createAsyncThunk(
  "profiles/create",
  async (profileData, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multi-part/form-data',

        },
        body: profileData 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create profile');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// POST /api/profiles – create profile
export const getSuccessfullyPaidUsers = createAsyncThunk(
  "profiles/getSuccessfullyPaidUsers",
  async (agencyId, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}/verified/${agencyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// PUT /api/profiles/:id  – update profile
export const updateProfile = createAsyncThunk(
  "profiles/update",
  async ({ id, updates }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
   
        try {
      const response = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multi-part/form-data',
        },
        body: updates 
      });
     
      const data=response.json()
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE /api/profiles/:id  – delete profile
export const deleteProfile = createAsyncThunk(
  "profiles/delete",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
   
    try {
      await fetch(`${API}/${id}`, {
        method:"DELETE",
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profiles",
  initialState: {
    list: [],       // all profiles
    current: null,  // profile being viewed / edited
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* fetchProfileById */
      .addCase(fetchProfileById.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.current = payload;
      })
      .addCase(fetchProfileById.rejected, (s, { payload }) => {
        s.status = "failed";
        s.error = payload;
      })

      /* createProfile */
      .addCase(createProfile.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(createProfile.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.list.unshift(payload); // add new one on top
      })
      .addCase(createProfile.rejected, (s, { payload }) => {
        s.status = "failed";
        s.error = payload;
      })

      /* updateProfile */
      .addCase(updateProfile.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.list = s.list.map((p) => (p._id === payload._id ? payload : p));
        if (s.current?._id === payload._id) s.current = payload;
      })

      /* deleteProfile */
      .addCase(deleteProfile.fulfilled, (s, { payload: id }) => {
        s.status = "succeeded";
        s.list = s.list.filter((p) => p._id !== id);
        if (s.current?._id === id) s.current = null;
      });
  },
});

export const { clearCurrent } = profileSlice.actions;
export default profileSlice.reducer;

