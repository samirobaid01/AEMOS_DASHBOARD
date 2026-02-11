import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginRequest, LoginResponse, SignupRequest, User } from '../../types/auth';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { RootState } from '../store';
import * as authService from '../../services/auth.service';
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../config';

// Constants for localStorage keys
const USER_STORAGE_KEY = 'user';
const SELECTED_ORG_KEY = 'organizationId';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  selectedOrganizationId: null,
  permissions: [],
};

// Async thunks
export const login = createAsyncThunk<
  Awaited<ReturnType<typeof authService.login>>,
  LoginRequest,
  { rejectValue: ApiRejectPayload }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Login failed') });
    }
  }
);

export const signup = createAsyncThunk<
  Awaited<ReturnType<typeof authService.signup>>,
  SignupRequest,
  { rejectValue: ApiRejectPayload }
>(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.signup(userData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Signup failed') });
    }
  }
);

export const logout = createAsyncThunk<
  boolean,
  void,
  { rejectValue: ApiRejectPayload }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Logout failed') });
    }
  }
);

export const fetchUserProfile = createAsyncThunk<
  Awaited<ReturnType<typeof authService.getCurrentUser>>,
  void,
  { rejectValue: ApiRejectPayload }
>(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch user profile') });
    }
  }
);

// Check if user is already logged in (from localStorage)
const checkInitialAuth = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  const selectedOrganizationId = localStorage.getItem(SELECTED_ORG_KEY);
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  let user = null;
  
  try {
    if (userJson) {
      user = JSON.parse(userJson);
      console.log('Auth slice: Initial auth check - User permissions:', user?.permissions);
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
  }
  
  if (token && refreshToken) {
    const authState = {
      isAuthenticated: true,
      token,
      refreshToken,
      user,
      selectedOrganizationId: selectedOrganizationId ? parseInt(selectedOrganizationId, 10) : null,
      permissions: user?.permissions || [],
    };
    console.log('Auth slice: Initial auth state:', authState);
    return authState;
  }
  return {
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    user: null,
    selectedOrganizationId: null,
    permissions: [],
  };
};

// Apply initial auth state from localStorage
const authInitialState = {
  ...initialState,
  ...checkInitialAuth(),
};

// Helper to save user to localStorage
const saveUserToLocalStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    console.log('Auth slice: Saving user permissions to localStorage:', user?.permissions);
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
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
      state.permissions = action.payload.user?.permissions || [];
      console.log('Auth slice: Setting credentials with permissions:', state.permissions);
      localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refreshToken);
      saveUserToLocalStorage(action.payload.user);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.selectedOrganizationId = null;
      state.permissions = [];
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(SELECTED_ORG_KEY);
      saveUserToLocalStorage(null);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.permissions = action.payload?.permissions || [];
      console.log('Auth slice: Updating user with permissions:', state.permissions);
      saveUserToLocalStorage(action.payload);
    },
    setSelectedOrganization: (state, action: PayloadAction<number>) => {
      console.log('Auth slice: setSelectedOrganization action received', action.payload);
      state.selectedOrganizationId = action.payload;
      localStorage.setItem(SELECTED_ORG_KEY, action.payload.toString());
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<Awaited<ReturnType<typeof authService.login>>>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.permissions = action.payload.permissions || [];
      saveUserToLocalStorage({
        ...action.payload.user,
        permissions: action.payload.permissions
      });
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action: PayloadAction<Awaited<ReturnType<typeof authService.signup>>>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.permissions = action.payload.permissions || [];
      saveUserToLocalStorage({
        ...action.payload.user,
        permissions: action.payload.permissions
      });
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.selectedOrganizationId = null;
      // Remove user from localStorage on logout
      saveUserToLocalStorage(null);
    });
    
    // Fetch User Profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      saveUserToLocalStorage(action.payload);
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });
  },
});

export const { setCredentials, clearCredentials, setSelectedOrganization, updateUser, setError, clearError } = authSlice.actions;

// Selectors
const selectAuth = (state: RootState) => state.auth;

export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectAuthToken = createSelector(
  [selectAuth],
  (auth) => auth.token
);

export const selectSelectedOrganizationId = createSelector(
  [selectAuth],
  (auth) => auth.selectedOrganizationId
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

// Permission check helper
export const hasPermission = createSelector(
  [selectCurrentUser, (_state: RootState, permission: string) => permission],
  (user, permission): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }
);

export default authSlice.reducer; 