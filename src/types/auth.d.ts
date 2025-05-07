export interface User {
  id: number;
  email: string;
  userName: string;
  phoneNumber?: string;
  avatar?: string;
  notifyByEmail?: boolean;
  notifyBySMS?: boolean;
  notifyByMessage?: boolean;
  smsNumber?: string;
  detail?: string;
  // Add other user properties as needed
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  notifyByEmail?: boolean;
  notifyBySMS?: boolean;
  notifyByMessage?: boolean;
  smsNumber?: string;
  detail?: string;
  termsAndConditions: boolean;
  notifyUser?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
} 