import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface DashboardHeaderProps {
  title: string;
  icon?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  icon = '🌱' 
}) => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  return (
    <div 
      className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center mb-6"
      data-walkthrough="dashboard-header"
    >
      <h1 style={{
        fontSize: 'calc(1.5rem + 0.5vw)',
        fontWeight: 'bold',
        color: darkMode ? colors.textPrimary : '#111827',
        marginTop: 0,
        marginBottom: 'calc(1.5rem + 1vw)',
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
        paddingBottom: '1rem'
      }}>
        <span style={{ 
          fontSize: 'calc(1.25rem + 0.5vw)',
          marginRight: '0.75rem' 
        }}>{icon}</span> {title}
      </h1>
    </div>
  );
};

export default DashboardHeader; 