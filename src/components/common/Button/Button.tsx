import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
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
  icon?: React.ReactNode;
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
  icon,
  ...props
}) => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  const getVariantStyles = (): React.CSSProperties => {
    const variants = {
      primary: {
        backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
        color: 'white',
        hoverBg: darkMode ? '#5d8efa' : '#2563eb',
        border: 'none'
      },
      secondary: {
        backgroundColor: darkMode ? colors.surfaceBackground : 'white',
        color: darkMode ? colors.textSecondary : '#4b5563',
        hoverBg: darkMode ? 'rgba(0, 0, 0, 0.1)' : '#f3f4f6',
        border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`
      },
      danger: {
        backgroundColor: darkMode ? '#ef5350' : '#ef4444',
        color: 'white',
        hoverBg: darkMode ? '#f44336' : '#dc2626',
        border: 'none'
      },
      outline: {
        backgroundColor: darkMode ? 'rgba(80, 60, 45, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        color: darkMode ? '#e6d0b7' : '#735236',
        borderColor: darkMode ? '#735236' : '#d0b190',
      }
    };

    return variants[variant];
  };

  const getSizeStyles = (): React.CSSProperties => {
    const sizes = {
      sm: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem'
      },
      md: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem'
      },
      lg: {
        padding: '0.625rem 1.25rem',
        fontSize: '1rem'
      }
    };

    return sizes[size];
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.375rem',
    fontWeight: 500,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: disabled || isLoading ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
    gap: '0.5rem',
    ...getVariantStyles(),
    ...getSizeStyles()
  };

  const spinnerStyle: React.CSSProperties = {
    width: size === 'sm' ? '1rem' : '1.25rem',
    height: size === 'sm' ? '1rem' : '1.25rem',
    border: '2px solid',
    borderColor: 'currentColor currentColor currentColor transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block'
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
      style={baseStyle}
      data-tracking-id={trackingId}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span style={spinnerStyle} />
      ) : (
        <>
          {icon && <span>{icon}</span>}
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
        </>
      )}
    </button>
  );
};

export default Button; 