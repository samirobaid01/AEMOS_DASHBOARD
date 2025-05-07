// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/';

// Environment configuration
export const ENV = import.meta.env.MODE || 'development';
export const IS_PROD = ENV === 'production';
export const IS_DEV = ENV === 'development';
export const IS_TEST = ENV === 'test';

// Feature flags
export const ENABLE_MIXPANEL = true;
export const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '';

// i18n configuration
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'es'];

// Auth configuration
export const TOKEN_STORAGE_KEY = 'aemos_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'aemos_refresh_token';
export const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// Other app configuration
export const APP_NAME = 'AEMOS Dashboard';
export const APP_VERSION = '1.0.0';

// API timeout (in milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1; 