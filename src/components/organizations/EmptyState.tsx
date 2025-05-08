import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  actionLabel,
  onAction
}) => {
  const { t } = useTranslation();

  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
  };

  return (
    <div style={emptyStateStyle}>
      <svg
        style={{
          width: '3rem',
          height: '3rem',
          color: '#9ca3af',
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      
      <h3 style={{
        marginTop: '0.5rem',
        fontSize: '1rem',
        fontWeight: 500,
        color: '#111827',
        textAlign: 'center'
      }}>
        {message || t('no_organizations_found')}
      </h3>
      
      <p style={{
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: '#6b7280',
        maxWidth: '20rem',
        textAlign: 'center'
      }}>
        {description || t('no_organizations_found_description')}
      </p>
      
      {onAction && (
        <button 
          onClick={onAction}
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
          {actionLabel || t('organizations.add')}
        </button>
      )}
    </div>
  );
};

export default EmptyState; 