import React from 'react';
import { useThemeColors } from '../../hooks/useThemeColors';
import Button from '../common/Button/Button';

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
  const colors = useThemeColors();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      backgroundColor: colors.cardBackground,
      borderRadius: '0.5rem',
      boxShadow: colors.cardShadow,
      border: `1px solid ${colors.cardBorder}`,
    }}>
      {icon ? (
        icon
      ) : (
        <svg
          style={{
            width: '3rem',
            height: '3rem',
            color: colors.textMuted,
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
      )}
      
      <h3 style={{
        marginTop: '0.5rem',
        fontSize: '1rem',
        fontWeight: 500,
        color: colors.textPrimary,
        textAlign: 'center'
      }}>
        {message}
      </h3>
      
      <p style={{
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: colors.textMuted,
        maxWidth: '20rem',
        textAlign: 'center'
      }}>
        {description}
      </p>
      
      <Button type="button" onClick={onAction} style={{ marginTop: '1.5rem' }}>
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState; 