import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../../context/ThemeContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { SelectOption } from '../../../types/ui';

export type { SelectOption };

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = true,
      options = [],
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const { darkMode } = useTheme();
    const colors = useThemeColors();

    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    const baseClasses = 'block w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg shadow-sm appearance-none focus:outline-none transition-all duration-200 text-base sm:text-sm backdrop-blur-sm';

    const stateClasses = error
      ? 'border-red-300 text-red-900 placeholder-red-300 dark:border-red-600 dark:text-red-200 dark:placeholder-red-600 dark:bg-red-900/10'
      : 'border-soil-200 text-soil-800 placeholder-soil-400 dark:border-soil-700 dark:text-soil-200 dark:placeholder-soil-500 dark:bg-soil-800/80';

    const widthClass = fullWidth ? 'w-full' : '';
    
    const selectClasses = twMerge(
      baseClasses,
      stateClasses,
      widthClass,
      'pr-10 bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]',
      className
    );

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      e.target.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
      e.target.style.borderColor = isDarkMode ? '#4d7efa' : '#3b82f6';
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      e.target.style.boxShadow = 'none';
      e.target.style.borderColor = error 
        ? (document.documentElement.classList.contains('dark') ? '#ef5350' : '#ef4444')
        : (document.documentElement.classList.contains('dark') ? '#374151' : '#d1d5db');
    };

    const selectStyle = {
      display: 'block',
      width: '100%',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      backgroundColor: darkMode ? colors.background : 'white',
      color: darkMode ? colors.textPrimary : '#111827',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 0.5rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.5rem 1.5rem',
      outline: 'none',
    } as React.CSSProperties;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} max-w-full space-y-1.5`}>
        {label && (
          <label htmlFor={selectId} className="block text-xs sm:text-sm font-medium text-soil-700 dark:text-soil-300 mb-1 transition-colors">
            {label}
            {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            style={selectStyle}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            // style={{
            //   backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`
            // }}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1 text-xs sm:text-sm text-soil-500 dark:text-soil-400 transition-colors">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 