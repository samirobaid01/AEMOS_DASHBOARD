// Color tokens for light and dark modes
export const lightTheme = {
  // Base colors
  background: '#f0f9f0',
  surfaceBackground: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  divider: '#e5e7eb',
  
  // Component specific
  cardBackground: '#ffffff',
  cardBorder: '#e5e7eb',
  cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  
  // Header and navigation
  headerBackground: '#ffffff',
  sidebarBackground: '#ffffff',
  sidebarItemHover: '#f0f9f0',
  sidebarItemActive: '#16a34a',
  sidebarItemActiveText: '#ffffff',
  sidebarItemText: '#4b5563',
  
  // Buttons
  buttonPrimary: '#3b82f6',
  buttonPrimaryHover: '#2563eb',
  buttonPrimaryText: '#ffffff',
  
  // Status colors
  success: '#16a34a',
  successBackground: '#c6f6d5',
  successText: '#22543d',
  danger: '#ef4444',
  dangerBackground: '#fed7d7',
  dangerText: '#822727',
  warning: '#eab308',
  warningBackground: '#fefcbf',
  warningText: '#744210',
  info: '#3b82f6',
  infoBackground: '#e1effe',
  infoText: '#1e40af',
  
  // Brand colors
  primary: '#16a34a',
  primaryLight: '#f0f9f0',
  secondary: '#b45309',
};

export const darkTheme = {
  // Base colors
  background: '#111827',
  surfaceBackground: '#1f2937',
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  border: '#374151',
  divider: '#374151',
  
  // Component specific
  cardBackground: '#1f2937',
  cardBorder: '#374151',
  cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  
  // Header and navigation
  headerBackground: '#1f2937',
  sidebarBackground: '#111827',
  sidebarItemHover: '#374151',
  sidebarItemActive: '#16a34a',
  sidebarItemActiveText: '#ffffff',
  sidebarItemText: '#d1d5db',
  
  // Buttons
  buttonPrimary: '#3b82f6',
  buttonPrimaryHover: '#2563eb',
  buttonPrimaryText: '#ffffff',
  
  // Status colors
  success: '#10b981',
  successBackground: '#064e3b',
  successText: '#d1fae5',
  danger: '#ef4444',
  dangerBackground: '#7f1d1d',
  dangerText: '#fee2e2',
  warning: '#f59e0b',
  warningBackground: '#78350f',
  warningText: '#fef3c7',
  info: '#3b82f6',
  infoBackground: '#1e3a8a',
  infoText: '#dbeafe',
  
  // Brand colors
  primary: '#16a34a',
  primaryLight: '#064e3b',
  secondary: '#f59e0b',
};

// Helper function to get current theme colors
export const getThemeColors = (isDarkMode: boolean) => {
  return isDarkMode ? darkTheme : lightTheme;
}; 