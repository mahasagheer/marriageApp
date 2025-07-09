import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch chat messages for a booking
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (bookingId) => {
    const res = await fetch(`http://localhost:5000/api/halls/messages/${bookingId}`);
    const data = await res.json();
    return data.messages;
  }
);

// Send a chat message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (msg) => {
    const res = await fetch('http://localhost:5000/api/halls/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    const data = await res.json();
    return data.message;
  }
);

// Mark messages as read
export const markMessagesRead = createAsyncThunk(
  'chat/markMessagesRead',
  async ({ bookingId, reader }) => {
    await fetch(`http://localhost:5000/api/halls/messages/${bookingId}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reader }),
    });
    return { bookingId, reader };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
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
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { addMessage, setMessages, clearMessages } = chatSlice.actions;
export default chatSlice.reducer; 