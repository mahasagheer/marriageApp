import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = process.env.REACT_APP_API_URL;

// Thunk to fetch messages for a booking/session
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/halls/messages/${bookingId}`);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch messages');
      return data.messages;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Thunk to send a message
export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async (msg, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/halls/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to send message');
      return data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Thunk to mark messages as read
export const markMessagesRead = createAsyncThunk(
  'chat/markMessagesRead',
  async ({ bookingId, reader }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/halls/messages/${bookingId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reader }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to mark messages as read');
      return { bookingId, reader };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Thunk to fetch unread message count for the owner
export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (ownerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/halls/messages/unread-count/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch unread count');
      return data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Thunk to fetch all chat sessions for a hall
export const fetchChatSessions = createAsyncThunk(
  'chat/fetchChatSessions',
  async (hallId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/halls/messages/all-sessions/${hallId}`);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch chat sessions');
      return data.sessions;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions: [],
    sessionsLoading: false,
    sessionsError: null,
    unreadCount: 0,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch messages';
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(markMessagesRead.fulfilled, (state, action) => {
        // Optionally update message read status in state.messages if needed
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchChatSessions.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(fetchChatSessions.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchChatSessions.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload || 'Failed to fetch chat sessions';
      });
  },
});

export const { setMessages, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
