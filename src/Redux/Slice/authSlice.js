import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI } from '../../../Services/allAPI/';

export const loginUser = createAsyncThunk('auth/loginUser', async (reqBody, { rejectWithValue }) => {
  try {
    const response = await loginAPI(reqBody);
    const { token, currentUser } = response.data;
    if (!token || !currentUser) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("username", currentUser.name);

    return { token, currentUser };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: sessionStorage.getItem("token") || null,
    currentUser: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.currentUser;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default authSlice.reducer;
