import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface EmptyStateProps {
  message: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      backgroundColor: darkMode ? colors.cardBackground : 'white',
      borderRadius: '0.5rem',
      boxShadow: darkMode 
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    }}>
      {icon ? (
        icon
      ) : (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      )}
      
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
        onClick={onAction}
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
          color: 'white',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#5d8efa' : '#2563eb';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#4d7efa' : '#3b82f6';
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EmptyState; 