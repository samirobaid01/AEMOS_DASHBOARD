import React from 'react';
import { useThemeColors } from '../../../hooks/useThemeColors';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  hint,
  id,
  className = '',
  children,
}) => {
  const colors = useThemeColors();

  const rootStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.textSecondary,
    marginBottom: '0.5rem',
  };

  const requiredStyle: React.CSSProperties = {
    color: colors.danger,
  };

  const errorStyle: React.CSSProperties = {
    color: colors.dangerText,
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  };

  const hintStyle: React.CSSProperties = {
    color: colors.textMuted,
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  };

  return (
    <div style={rootStyle} className={className}>
      {label != null && label !== '' && (
        <label htmlFor={id} style={labelStyle}>
          {label}
          {required && <span style={requiredStyle}> *</span>}
        </label>
      )}
      {children}
      {error != null && error !== '' && (
        <p role="alert" style={errorStyle}>
          {error}
        </p>
      )}
      {hint != null && hint !== '' && (error == null || error === '') && (
        <p style={hintStyle}>{hint}</p>
      )}
    </div>
  );
};

export default FormField;
