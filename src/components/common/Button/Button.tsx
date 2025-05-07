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
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

  const variantClasses = {
    primary: 'bg-leaf-600 text-white border-transparent hover:bg-leaf-700 focus:ring-leaf-500',
    secondary: 'bg-soil-600 text-white border-transparent hover:bg-soil-700 focus:ring-soil-500',
    danger: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500',
    outline: 'bg-white text-soil-700 border-soil-300 hover:bg-leaf-50 focus:ring-leaf-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

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

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={classes}
      data-tracking-id={trackingId}
      onClick={handleClick}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 