import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginRequest, LoginResponse, SignupRequest, User } from '../../types/auth';
import type { RootState } from '../store';
import * as authService from '../../services/auth.service';
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../config';

// Storage key for selected organization
const SELECTED_ORG_KEY = 'selected_organization_id';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  selectedOrganizationId: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      return await authService.signup(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Check if user is already logged in (from localStorage)
const checkInitialAuth = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  const selectedOrganizationId = localStorage.getItem(SELECTED_ORG_KEY);
  const userJson = localStorage.getItem('user');
  let user = null;
  
  try {
    if (userJson) {
      user = JSON.parse(userJson);
      console.log('Auth slice: Loaded user from localStorage:', user);
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
  }
  
  if (token && refreshToken) {
    return {
      isAuthenticated: true,
      token,
      refreshToken,
      user,
      selectedOrganizationId: selectedOrganizationId ? parseInt(selectedOrganizationId, 10) : null,
    };
  }
  return {
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    user: null,
    selectedOrganizationId: null,
  };
};

// Apply initial auth state from localStorage
const authInitialState = {
  ...initialState,
  ...checkInitialAuth(),
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refreshToken);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.selectedOrganizationId = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(SELECTED_ORG_KEY);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      console.log('Auth slice: updateUser action received', action.payload);
      state.user = action.payload;
    },
    setSelectedOrganization: (state, action: PayloadAction<number>) => {
      state.selectedOrganizationId = action.payload;
      localStorage.setItem(SELECTED_ORG_KEY, action.payload.toString());
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.selectedOrganizationId = null;
    });
    
    // Fetch User Profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCredentials, clearCredentials, setSelectedOrganization, updateUser } = authSlice.actions;

// Selectors with type assertions
export const selectCurrentUser = (state: RootState) => (state as any).auth.user as User | null;
export const selectIsAuthenticated = (state: RootState) => (state as any).auth.isAuthenticated as boolean;
export const selectAuthLoading = (state: RootState) => (state as any).auth.loading as boolean;
export const selectAuthError = (state: RootState) => (state as any).auth.error as string | null;
export const selectSelectedOrganizationId = (state: RootState) => (state as any).auth.selectedOrganizationId as number | null;

// Permission check helper
export const hasPermission = (state: RootState, permission: string): boolean => {
  const user = selectCurrentUser(state);
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

export default authSlice.reducer; 