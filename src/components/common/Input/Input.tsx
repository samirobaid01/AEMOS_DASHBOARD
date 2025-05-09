import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = true,
      leftIcon,
      rightIcon,
      className,
      id,
      required,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const baseClasses = 'block w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg shadow-sm appearance-none focus:outline-none transition-all duration-200 text-base sm:text-sm backdrop-blur-sm';

    const stateClasses = error
      ? 'border-red-300 text-red-900 placeholder-red-300 dark:border-red-600 dark:text-red-200 dark:placeholder-red-600 dark:bg-red-900/10'
      : 'border-soil-200 text-soil-800 placeholder-soil-400 dark:border-soil-700 dark:text-soil-200 dark:placeholder-soil-500 dark:bg-soil-800/80';

    const widthClass = fullWidth ? 'w-full' : '';
    
    const inputClasses = twMerge(
      baseClasses,
      stateClasses,
      widthClass,
      className
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Apply custom focus styling
      const isDarkMode = document.documentElement.classList.contains('dark');
      const element = e.target;
      
      if (error) {
        element.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(239, 83, 80, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`;
        element.style.borderColor = isDarkMode ? '#ef5350' : '#ef4444';
      } else {
        element.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
        element.style.borderColor = isDarkMode ? '#4d7efa' : '#3b82f6';
      }
      
      // Call the original onFocus if provided
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Reset styling on blur
      const isDarkMode = document.documentElement.classList.contains('dark');
      const element = e.target;
      
      element.style.boxShadow = 'none';
      
      if (error) {
        element.style.borderColor = isDarkMode ? '#ef5350' : '#ef4444';
      } else {
        element.style.borderColor = isDarkMode ? '#374151' : '#d1d5db';
      }
      
      // Call the original onBlur if provided
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''} max-w-full space-y-1.5`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs sm:text-sm font-medium text-soil-700 dark:text-soil-300 mb-1 transition-colors">
            {label}
            {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-soil-500 dark:text-soil-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} touch-manipulation`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-soil-500 dark:text-soil-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs sm:text-sm text-soil-500 dark:text-soil-400 transition-colors">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 