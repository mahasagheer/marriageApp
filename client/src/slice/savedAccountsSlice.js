import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL}/saved-accounts`;
const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


export const createAccount = createAsyncThunk(
    'chat/createPayment',
    async (payload, { getState }) => {
      const token = getState().auth.token;
      const { data } = await axios.post(`${API}/`, payload, getAuthConfig(token));
      return data;
    }
  );
  
  export const fetchAccounts = createAsyncThunk(
    'chat/fetchSession',
    async (id , { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/${id}`, {
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