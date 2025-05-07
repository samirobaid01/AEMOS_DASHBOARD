import apiClient from './api/apiClient';
import type { LoginRequest, LoginResponse, SignupRequest, User } from '../types/auth';
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../config';

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data.data;
};

/**
 * Signup user
 */
export const signup = async (userData: SignupRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data.data;
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/reset-password', { token, password });
  return response.data;
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/verify-email', { token });
  return response.data;
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string) => {
  const response = await apiClient.post('/auth/refresh-token', { refreshToken });
  return response.data;
};

/**
 * Get token from local storage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Set token in local storage
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/**
 * Get refresh token from local storage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Set refresh token in local storage
 */
export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
};

const AuthService = {
  login,
  signup,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
};

export default AuthService; 