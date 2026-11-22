import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ErrorDisplayProps } from './types';

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  return (
    <div className={cn(
      'flex items-center p-4 mb-6 rounded-lg text-sm font-medium',
      'bg-dangerBg dark:bg-dangerBg-dark',
      'text-dangerText dark:text-dangerText-dark',
      'border border-border dark:border-border-dark'
    )}>
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden />
      <span className="flex-1">{errorMessage}</span>
    </div>
  );
};

export default ErrorDisplay;
