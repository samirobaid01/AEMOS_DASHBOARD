import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button/Button';

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

  return (
    <div className={`
      flex flex-col items-center justify-center p-12
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      rounded-lg shadow-sm border
    `}>
      <svg
        className={`w-12 h-12 mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
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
      
      <h3 className={`
        mt-2 text-base font-medium text-center
        ${darkMode ? 'text-gray-100' : 'text-gray-900'}
      `}>
        {message}
      </h3>
      
      <p className={`
        mt-2 text-sm text-center max-w-sm
        ${darkMode ? 'text-gray-400' : 'text-gray-600'}
      `}>
        {description}
      </p>
      
      <Button type="button" onClick={onAddDevice} className="mt-6">
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState; 