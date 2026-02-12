import React from 'react';

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
  return (
    <div className={`mb-6 ${className}`}>
      {label != null && label !== '' && (
        <label htmlFor={id} className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2">
          {label}
          {required && <span className="text-danger dark:text-danger-dark"> *</span>}
        </label>
      )}
      {children}
      {error != null && error !== '' && (
        <p role="alert" className="text-sm text-dangerText dark:text-dangerText-dark mt-1">
          {error}
        </p>
      )}
      {hint != null && hint !== '' && (error == null || error === '') && (
        <p className="text-sm text-textMuted dark:text-textMuted-dark mt-1">{hint}</p>
      )}
    </div>
  );
};

export default FormField;
