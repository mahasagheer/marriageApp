import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = process.env.REACT_APP_API_URL;

// Async thunk for creating a menu
export const createMenu = createAsyncThunk(
  'menus/createMenu',
  async (menuData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/menus/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create menu');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching menus by hall
export const fetchMenusByHall = createAsyncThunk(
  'menus/fetchMenusByHall',
  async (hallId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/menus/hall/${hallId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch menus');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for updating a menu
export const updateMenu = createAsyncThunk(
  'menus/updateMenu',
  async ({ menuId, menuData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/menus/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update menu');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for deleting a menu
export const deleteMenu = createAsyncThunk(
  'menus/deleteMenu',
  async (menuId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/menus/${menuId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to delete menu');
      return { menuId };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for changing menu status
export const changeMenuStatus = createAsyncThunk(
  'menus/changeMenuStatus',
  async ({ menuId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/menus/${menuId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to change menu status');
      return data.menu;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const menuSlice = createSlice({
  name: 'menus',
  initialState: {
    loading: false,
    error: null,
    success: false,
    menus: [],
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
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.menus.push(action.payload);
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create menu';
        state.success = false;
      })
      .addCase(fetchMenusByHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenusByHall.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
      })
      .addCase(fetchMenusByHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch menus';
      })
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.menus = state.menus.map(menu => 
          menu._id === action.payload._id ? action.payload : menu
        );
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update menu';
        state.success = false;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.menus = state.menus.filter(menu => menu._id !== action.payload.menuId);
      })
      .addCase(changeMenuStatus.fulfilled, (state, action) => {
        state.menus = state.menus.map(menu => menu._id === action.payload._id ? action.payload : menu);
        state.success = true;
        state.error = null;
      })
      .addCase(changeMenuStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to change menu status';
        state.success = false;
      });
  },
});

export const { resetSuccess, resetError } = menuSlice.actions;
export default menuSlice.reducer; 