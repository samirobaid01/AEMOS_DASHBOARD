import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ToggleProps {
  label?: string;
  isChecked: boolean;
  onChange: () => void;
  disabled?: boolean;
  id?: string;
  helperText?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  isChecked,
  onChange,
  disabled = false,
  id,
  helperText,
  className,
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange();
      }
    }
  };

  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className={twMerge("flex flex-col", className)}>
      <div className="flex items-center">
        {label && (
          <label 
            htmlFor={toggleId}
            className="text-sm font-medium text-soil-700 dark:text-soil-300 mr-3 transition-colors"
          >
            {label}
          </label>
        )}
        <button
          type="button"
          role="switch"
          id={toggleId}
          aria-checked={isChecked}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={disabled ? undefined : onChange}
          onKeyDown={handleKeyDown}
          className={twMerge(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
            isChecked 
              ? "bg-leaf-600 dark:bg-leaf-700" 
              : "bg-soil-300 dark:bg-soil-600",
            disabled 
              ? "opacity-50 cursor-not-allowed" 
              : "cursor-pointer",
            isChecked && !disabled 
              ? "focus:ring-leaf-500" 
              : "focus:ring-soil-500"
          )}
          style={{
            boxShadow: disabled 
              ? 'none' 
              : (document.activeElement === document.getElementById(toggleId) 
                ? `0 0 0 3px ${isDarkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}` 
                : 'none')
          }}
        >
          <span className="sr-only">{isChecked ? 'Enabled' : 'Disabled'}</span>
          <span
            className={twMerge(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              isChecked ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-soil-500 dark:text-soil-400 transition-colors">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Toggle; 