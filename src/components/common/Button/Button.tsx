import React from 'react';
import { twMerge } from 'tailwind-merge';
import MixpanelService from '../../../services/mixpanel.service';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  trackingId?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  trackingId,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-lg shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 touch-manipulation';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-leaf-500 to-leaf-600 text-white border-transparent hover:from-leaf-600 hover:to-leaf-700 focus:ring-leaf-400 dark:from-leaf-600 dark:to-leaf-700 dark:hover:from-leaf-700 dark:hover:to-leaf-800',
    secondary: 'bg-gradient-to-r from-soil-500 to-soil-600 text-white border-transparent hover:from-soil-600 hover:to-soil-700 focus:ring-soil-400 dark:from-soil-600 dark:to-soil-700 dark:hover:from-soil-700 dark:hover:to-soil-800',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent hover:from-red-600 hover:to-red-700 focus:ring-red-400 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800',
    outline: 'bg-white/90 backdrop-blur-sm text-soil-700 border-soil-300 hover:bg-leaf-50 focus:ring-leaf-400 dark:bg-soil-900/80 dark:text-soil-200 dark:border-soil-700 dark:hover:bg-soil-800/90',
  };

  const sizeClasses = {
    sm: 'px-3 sm:px-3.5 py-1.5 sm:py-1.5 text-xs',
    md: 'px-4 sm:px-5 py-2 sm:py-2.5 text-sm',
    lg: 'px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-60 cursor-not-allowed hover:shadow-none' : '';

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    disabledClass,
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track click event if trackingId is provided
    if (trackingId) {
      MixpanelService.track(`Button Click: ${trackingId}`);
    }
    
    // Call the original onClick handler if provided
    props.onClick?.(e);
  };

  // Custom hover effect handlers like in SensorForm
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      const target = e.currentTarget;
      if (variant === 'primary') {
        target.style.boxShadow = '0 0 0 3px rgba(77, 126, 250, 0.3)';
      } else if (variant === 'secondary') {
        target.style.boxShadow = '0 0 0 3px rgba(120, 113, 108, 0.3)';
      } else if (variant === 'danger') {
        target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.3)';
      } else if (variant === 'outline') {
        target.style.boxShadow = '0 0 0 3px rgba(77, 126, 250, 0.2)';
      }
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      e.currentTarget.style.boxShadow = '';
    }
  };

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={classes}
      data-tracking-id={trackingId}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2 sm:mr-2.5 flex-shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {rightIcon && <span className="ml-2 sm:ml-2.5 flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button; 