import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`
      flex items-center p-4 mb-6 rounded-lg text-sm font-medium
      ${darkMode 
        ? 'bg-red-900/50 text-red-300 border border-red-800' 
        : 'bg-red-50 text-red-700 border border-red-100'}
    `}>
      <svg 
        className="w-5 h-5 mr-2 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
          clipRule="evenodd" 
        />
      </svg>
      <span className="flex-1">{errorMessage}</span>
    </div>
  );
};

export default ErrorDisplay; 