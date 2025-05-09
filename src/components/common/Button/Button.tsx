import React from 'react';
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
  className = '',
  ...props
}) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  const getButtonStyle = () => {
    // Base styles
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: '1px',
      fontWeight: 500,
      borderRadius: '0.5rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'all 200ms',
      touchAction: 'manipulation',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    };
    
    // Size styles
    const sizeStyles = {
      sm: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.75rem',
      },
      md: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
      },
      lg: {
        padding: '0.625rem 1.25rem',
        fontSize: '1rem',
      }
    };
    
    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: isDark ? '#047857' : '#059669', // leaf-600/700
        color: 'white',
        borderColor: 'transparent',
      },
      secondary: {
        backgroundColor: isDark ? '#735236' : '#8c6544', // soil-600/700
        color: 'white',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: isDark ? '#b91c1c' : '#dc2626', // red-600/700
        color: 'white',
        borderColor: 'transparent',
      },
      outline: {
        backgroundColor: isDark ? 'rgba(80, 60, 45, 0.8)' : 'rgba(255, 255, 255, 0.9)', // bg-soil-900/80 or bg-white/90
        color: isDark ? '#e6d0b7' : '#735236', // text-soil-200 or text-soil-700
        borderColor: isDark ? '#735236' : '#d0b190', // border-soil-700 or border-soil-300
      }
    };
    
    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

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
      style={getButtonStyle()}
      data-tracking-id={trackingId}
      onClick={handleClick}
      {...props}
    >
      {isLoading && (
        <svg
          style={{
            animation: 'spin 1s linear infinite',
            marginLeft: '-0.25rem',
            marginRight: '0.5rem',
            height: size === 'sm' ? '0.875rem' : '1rem',
            width: size === 'sm' ? '0.875rem' : '1rem',
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            style={{ opacity: 0.25 }}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            style={{ opacity: 0.75 }}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {leftIcon && !isLoading && (
        <span style={{ marginRight: '0.5rem', flexShrink: 0 }}>
          {leftIcon}
        </span>
      )}
      
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {children}
      </span>
      
      {rightIcon && (
        <span style={{ marginLeft: '0.5rem', flexShrink: 0 }}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button; 