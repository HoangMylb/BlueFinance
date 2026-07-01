import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { ProfileApi, UserProfileDto } from '../../services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Check local storage for existing session
const savedUser = localStorage.getItem('fin_user');
const savedAuth = localStorage.getItem('fin_auth');

const initialState: AuthState = {
  isAuthenticated: savedAuth === 'true',
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async () => {
  const dto = await ProfileApi.get();
  return dto;
});

export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async (data: Partial<UserProfileDto>) => {
  const dto = await ProfileApi.update(data);
  return dto;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('fin_auth', 'true');
      localStorage.setItem('fin_user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('fin_auth');
      localStorage.removeItem('fin_user');
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('fin_user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfileDto>) => {
        if (state.user) {
          state.user = { ...state.user, name: action.payload.name, email: action.payload.email, avatarUrl: action.payload.avatarUrl };
          localStorage.setItem('fin_user', JSON.stringify(state.user));
        }
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfileDto>) => {
        if (state.user) {
          state.user = { ...state.user, name: action.payload.name, email: action.payload.email, avatarUrl: action.payload.avatarUrl };
          localStorage.setItem('fin_user', JSON.stringify(state.user));
        }
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
