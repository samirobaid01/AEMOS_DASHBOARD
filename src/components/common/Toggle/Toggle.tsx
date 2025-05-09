import React from 'react';

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

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  // Label row style
  const labelRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  // Label style
  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    marginRight: '0.75rem',
    color: isDarkMode ? '#d0b190' : '#735236', // dark:text-soil-300 : text-soil-700
    transition: 'color 0.2s ease',
  };

  // Toggle button container style
  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    height: '1.5rem',
    width: '2.75rem',
    alignItems: 'center',
    borderRadius: '9999px',
    transition: 'background-color 0.2s ease',
    backgroundColor: isChecked 
      ? (isDarkMode ? '#047857' : '#059669') // dark:bg-leaf-700 : bg-leaf-600
      : (isDarkMode ? '#735236' : '#d0b190'), // dark:bg-soil-600 : bg-soil-300
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  // Toggle button dot/knob style
  const toggleKnobStyle: React.CSSProperties = {
    display: 'inline-block',
    height: '1rem',
    width: '1rem',
    transform: isChecked ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
    borderRadius: '9999px',
    backgroundColor: 'white',
    transition: 'transform 0.2s ease',
  };

  // Helper text style
  const helperTextStyle: React.CSSProperties = {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: isDarkMode ? '#b49470' : '#a27b54', // dark:text-soil-400 : text-soil-500
    transition: 'color 0.2s ease',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={labelRowStyle}>
        {label && (
          <label 
            htmlFor={toggleId}
            style={labelStyle}
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
          style={toggleStyle}
        >
          <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
            {isChecked ? 'Enabled' : 'Disabled'}
          </span>
          <span
            style={toggleKnobStyle}
          />
        </button>
      </div>
      {helperText && (
        <p style={helperTextStyle}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Toggle; 