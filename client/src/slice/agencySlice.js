// src/slice/AgencySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = `${process.env.REACT_APP_API_URL}/agency`;


// GET /api/agency/:id  – single agency profile
export const fetchAgencyById = createAsyncThunk(
  "agency/fetchById",
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


// GET /api/agency – agencies 
export const fetchAgencies = createAsyncThunk(
  "agency/all",
  async (_,{ rejectWithValue }) => {
    const token = localStorage.getItem('token');
console.log("agency")
    try {
      const response = await fetch(`${API}`, {
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


// GET /api/agency/:id  – single Agency
export const fetchAgencyByuserId = createAsyncThunk(
  "agency/fetchById",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API}/profile/${id}`, {
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

// POST /api/agency – create Agency
export const createAgency = createAsyncThunk(
  "agency/create",
  async (profileData, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
console.log(profileData)
    try {
      const response = await fetch(`${API}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: profileData
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

// PUT /api/agency/:id  – update Agency
export const updateAgency = createAsyncThunk(
  "agency/update",
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

      const data = response.json()
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE /api/agency/:id  – delete Agency
export const deleteAgency = createAsyncThunk(
  "agency/delete",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const AgencySlice = createSlice({
  name: "agency",
  initialState: {
    list: [],       // all agency
    current: null,  // Agency being viewed / edited
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

      /* fetchAgencyById */
      .addCase(fetchAgencyById.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchAgencyById.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.current = payload;
      })
      .addCase(fetchAgencyById.rejected, (s, { payload }) => {
        s.status = "failed";
        s.error = payload;
      })

      /* fetchAgencyById */
      .addCase(fetchAgencies.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchAgencies.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.current = payload;
      })
      .addCase(fetchAgencies.rejected, (s, { payload }) => {
        s.status = "failed";
        s.error = payload;
      })


      /* createAgency */
      .addCase(createAgency.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(createAgency.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.list.unshift(payload); // add new one on top
      })
      .addCase(createAgency.rejected, (s, { payload }) => {
        s.status = "failed";
        s.error = payload;
      })

      /* updateAgency */
      .addCase(updateAgency.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.list = s.list.map((p) => (p._id === payload._id ? payload : p));
        if (s.current?._id === payload._id) s.current = payload;
      })

      /* deleteAgency */
      .addCase(deleteAgency.fulfilled, (s, { payload: id }) => {
        s.status = "succeeded";
        s.list = s.list.filter((p) => p._id !== id);
        if (s.current?._id === id) s.current = null;
      });
  },
});

export const { clearCurrent } = AgencySlice.actions;
export default AgencySlice.reducer;

