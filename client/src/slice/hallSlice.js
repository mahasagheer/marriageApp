import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = process.env.REACT_APP_API_URL;

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
      if (hallData.phone) formData.append('phone', hallData.phone);
      if (hallData.facilities && hallData.facilities.length > 0) {
        hallData.facilities.forEach((facility) => {
          formData.append('facilities', facility);
        });
      }
      if (hallData.images && hallData.images.length > 0) {
        hallData.images.forEach((file) => {
          formData.append('images', file);
        });
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/halls/`, {
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
      const response = await fetch(`${apiUrl}/halls/`, {
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

// Async thunk for changing hall status
export const changeHallStatus = createAsyncThunk(
  'halls/changeHallStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/halls/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to change status');
      return data.hall;
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
      if (hallData.phone) formData.append('phone', hallData.phone);
      if (hallData.facilities && hallData.facilities.length > 0) {
        hallData.facilities.forEach((facility) => {
          formData.append('facilities', facility);
        });
      }
      if (hallData.images && hallData.images.length > 0) {
        hallData.images.forEach((file) => {
          formData.append('images', file);
        });
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/halls/${id}`, {
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
      const response = await fetch(`${apiUrl}/halls/${id}`, {
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
      const response = await fetch(`${apiUrl}/sample/owner/available-dates`, {
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
      const response = await fetch(`${apiUrl}/sample/available-dates/${id}`, {
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
      const response = await fetch(`${apiUrl}/halls/${hallId}/available-dates`, {
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

// Async thunk for searching halls
export const searchHalls = createAsyncThunk(
  'halls/searchHalls',
  async ({ name, location }, { rejectWithValue }) => {
    try {
      let url = `${apiUrl}/halls/search?`;
      if (name) url += `name=${encodeURIComponent(name)}&`;
      if (location) url += `location=${encodeURIComponent(location)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to search halls');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching public hall details (with menus and decorations)
export const fetchPublicHallDetails = createAsyncThunk(
  'halls/fetchPublicHallDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/halls/public/${id}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch public hall details');
      return data; // expects { hall, menus, decorations }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Thunk to fetch both bookings and available dates for a hall and merge for calendar
export const fetchHallCalendarData = createAsyncThunk(
  'halls/fetchHallCalendarData',
  async (hallId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // Fetch bookings
      const bookingsRes = await fetch(`${apiUrl}/halls/${hallId}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
      const bookingsData = await bookingsRes.json();
      // Always treat as array
      const bookingsArr = Array.isArray(bookingsData) ? bookingsData : bookingsData.bookings || [];
      // Fetch available dates
      const datesRes = await fetch(`${apiUrl}/halls/${hallId}/available-dates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!datesRes.ok) throw new Error('Failed to fetch available dates');
      const datesData = await datesRes.json();
      // Map bookings to calendar events with status
      const bookingEvents = bookingsArr.map(booking => {
        const dateObj = new Date(booking.bookingDate);
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          id: booking._id,
          title: `${booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Booking'}${booking.guestName ? ' - ' + booking.guestName : ''}${booking.guestEmail ? ' (' + booking.guestEmail + ')' : ''}${timeStr ? ' (' + timeStr + ')' : ''}`,
          start: dateObj,
          end: dateObj,
          status: booking.status,
          time: timeStr,
          allDay: false,
          raw: booking,
        };
      });
      // Map available dates to calendar events
      const availableEvents = datesData.map(dateObj => ({
        id: dateObj._id,
        title: dateObj.isBooked ? 'Reserved' : 'Available',
        start: new Date(dateObj.date),
        end: new Date(dateObj.date),
        isBooked: dateObj.isBooked,
        allDay: true,
        raw: dateObj,
      }));
      // Merge: if a booking exists for a date, use the booking event; else, use available event
      const mergedEvents = [
        ...bookingEvents,
        ...availableEvents.filter(av => !bookingEvents.some(be => be.start.toDateString() === av.start.toDateString() && be.time === av.time)),
      ];
      return { hallId, events: mergedEvents };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const addAvailableDate = createAsyncThunk(
  'halls/addAvailableDate',
  async ({ hallId, date, isBooked }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/halls/${hallId}/available-dates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dates: [date], isBooked }),
      });
      if (!res.ok) throw new Error('Failed to add date');
      return { hallId };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateAvailableDate = createAsyncThunk(
  'halls/updateAvailableDate',
  async ({ dateId, isBooked }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/sample/available-dates/${dateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBooked }),
      });
      if (!res.ok) throw new Error('Failed to update date');
      return { dateId };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for associating a manager with a hall
export const associateManager = createAsyncThunk(
  'halls/associateManager',
  async ({ hallId, managerId, department, tasks }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/halls/${hallId}/associate-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ managerId, department, tasks }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to associate manager');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching halls assigned to the manager
export const fetchManagerHalls = createAsyncThunk(
  'halls/fetchManagerHalls',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/halls/manager/halls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch manager halls');
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
    searchResults: [],
    publicHall: null,
    publicMenus: [],
    publicDecorations: [],
    publicLoading: false,
    publicError: null,
    hallCalendarEvents: {}, // { [hallId]: [events] }
    hallCalendarLoading: {}, // { [hallId]: bool }
    hallCalendarError: {}, // { [hallId]: string }
    addDateLoading: false,
    addDateError: null,
    updateDateLoading: false,
    updateDateError: null,
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
      .addCase(changeHallStatus.fulfilled, (state, action) => {
        state.halls = state.halls.map(hall => hall._id === action.payload._id ? action.payload : hall);
        state.success = true;
        state.error = null;
      })
      .addCase(changeHallStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to change hall status';
        state.success = false;
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
      })
      .addCase(searchHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searchResults = [];
      })
      .addCase(searchHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search halls';
        state.searchResults = [];
      })
      .addCase(fetchPublicHallDetails.pending, (state) => {
        state.publicLoading = true;
        state.publicError = null;
        state.publicHall = null;
        state.publicMenus = [];
        state.publicDecorations = [];
      })
      .addCase(fetchPublicHallDetails.fulfilled, (state, action) => {
        state.publicLoading = false;
        state.publicError = null;
        state.publicHall = action.payload.hall;
        state.publicMenus = action.payload.menus;
        state.publicDecorations = action.payload.decorations;
      })
      .addCase(fetchPublicHallDetails.rejected, (state, action) => {
        state.publicLoading = false;
        state.publicError = action.payload || 'Failed to fetch public hall details';
        state.publicHall = null;
        state.publicMenus = [];
        state.publicDecorations = [];
      })
      .addCase(fetchHallCalendarData.pending, (state, action) => {
        const hallId = action.meta.arg;
        state.hallCalendarLoading[hallId] = true;
        state.hallCalendarError[hallId] = null;
      })
      .addCase(fetchHallCalendarData.fulfilled, (state, action) => {
        const { hallId, events } = action.payload;
        state.hallCalendarLoading[hallId] = false;
        state.hallCalendarEvents[hallId] = events;
        state.hallCalendarError[hallId] = null;
      })
      .addCase(fetchHallCalendarData.rejected, (state, action) => {
        const hallId = action.meta.arg;
        state.hallCalendarLoading[hallId] = false;
        state.hallCalendarError[hallId] = action.payload || 'Failed to fetch calendar data';
      })
      .addCase(addAvailableDate.pending, (state) => {
        state.addDateLoading = true;
        state.addDateError = null;
      })
      .addCase(addAvailableDate.fulfilled, (state) => {
        state.addDateLoading = false;
        state.addDateError = null;
      })
      .addCase(addAvailableDate.rejected, (state, action) => {
        state.addDateLoading = false;
        state.addDateError = action.payload || 'Failed to add date';
      })
      .addCase(updateAvailableDate.pending, (state) => {
        state.updateDateLoading = true;
        state.updateDateError = null;
      })
      .addCase(updateAvailableDate.fulfilled, (state) => {
        state.updateDateLoading = false;
        state.updateDateError = null;
      })
      .addCase(updateAvailableDate.rejected, (state, action) => {
        state.updateDateLoading = false;
        state.updateDateError = action.payload || 'Failed to update date';
      })
      .addCase(associateManager.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(associateManager.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        // Optionally update halls if needed
      })
      .addCase(associateManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to associate manager';
        state.success = false;
      })
      .addCase(fetchManagerHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.halls = action.payload;
      })
      .addCase(fetchManagerHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch manager halls';
      });
  },
});

export const { resetSuccess } = hallSlice.actions;
export default hallSlice.reducer; 