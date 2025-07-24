import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL}/chat`;

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const GetSession = createAsyncThunk(
  'chat/getSession',
  async ({  agencyId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, agencyId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch session');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ReadMessages = createAsyncThunk(
  'chat/read-msg',
  async ({  sessionId, reader }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId,reader }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch session');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchSessions = createAsyncThunk(
  'chat/fetchSession',
  async ({  role, id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/sessions/unread-agency/${role}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch session');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ sessionId }, { getState }) => {
    const token = getState().auth.token;
    const { data } = await axios.get(`${API}/messages/${sessionId}`, getAuthConfig(token));
    return data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload, { getState }) => {
    const token = getState().auth.token;
    const { data } = await axios.post(`${API}/messages`, payload, getAuthConfig(token));
    return data;
  }
);


const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions: [],
    current: null, // selected session
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearMessages(state) {
      state.messages = [];
    },
    setCurrentSession(state, action) {
      state.current = action.payload;
    },
    // setMessages(state, action) {
    //   state.messages = action.payload;
    // },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
    
    .addCase(GetSession.fulfilled, (state, action) => {
          state.sessions.push(action.payload); // or filter + push if you want to avoid duplicates
    })
      // Fetch Sessions
      .addCase(fetchSessions.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchSessions.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.sessions = payload;
      })
      .addCase(fetchSessions.rejected, (s, { payload }) => {
        s.status = 'failed';
        s.error = payload;
      })

      // Fetch Messages
      .addCase(fetchMessages.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchMessages.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.messages = payload;
      })
      .addCase(fetchMessages.rejected, (s, { payload }) => {
        s.status = 'failed';
        s.error = payload;
      })

      // Send Message
      .addCase(sendMessage.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(sendMessage.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.messages.push(payload);
      })
      .addCase(sendMessage.rejected, (s, { payload }) => {
        s.status = 'failed';
        s.error = payload;
      });
  },
});

export const { clearMessages, setCurrentSession } = chatSlice.actions;
export default chatSlice.reducer;
