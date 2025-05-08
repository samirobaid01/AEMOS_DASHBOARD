import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/theme';

/**
 * Hook to access theme colors based on current theme setting
 * @returns An object with all theme colors for the current theme
 */
export const useThemeColors = () => {
  const { darkMode } = useTheme();
  return getThemeColors(darkMode);
}; 