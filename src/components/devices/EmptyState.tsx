import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface EmptyStateProps {
  message: string;
  description: string;
  actionLabel: string;
  onAddDevice: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message,
  description,
  actionLabel,
  onAddDevice 
}) => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
  };

  return (
    <div style={emptyStateStyle}>
      <svg
        style={{
          width: '3rem',
          height: '3rem',
          color: darkMode ? colors.textMuted : '#9ca3af',
          marginBottom: '1rem'
        }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      
      <h3 style={{
        marginTop: '0.5rem',
        fontSize: '1rem',
        fontWeight: 500,
        color: darkMode ? colors.textPrimary : '#111827',
        textAlign: 'center'
      }}>
        {message}
      </h3>
      
      <p style={{
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: darkMode ? colors.textMuted : '#6b7280',
        maxWidth: '20rem',
        textAlign: 'center'
      }}>
        {description}
      </p>
      
      <button 
        onClick={onAddDevice}
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EmptyState; 