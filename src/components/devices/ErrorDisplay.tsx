import React from 'react';

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  const errorStyle = {
    backgroundColor: '#fee2e2',
    padding: '1rem',
    borderRadius: '0.375rem',
    color: '#b91c1c',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={errorStyle}>
      <svg 
        style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
          clipRule="evenodd" 
        />
      </svg>
      {errorMessage}
    </div>
  );
};

export default ErrorDisplay; 