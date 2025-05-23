import React from 'react';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface StateDropdownProps {
  id: string;
  name: string;
  label: string;
  value: string;
  defaultValue: string;
  allowedValues: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StateDropdown: React.FC<StateDropdownProps> = ({
  id,
  name,
  label,
  value,
  defaultValue,
  allowedValues,
  onChange
}) => {
  const colors = useThemeColors();

  const styles = {
    container: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: '0.5rem',
    },
    select: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surfaceBackground,
      color: colors.textPrimary,
      fontSize: '0.875rem',
      appearance: 'none' as const,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.5rem center',
      backgroundSize: '1.5em 1.5em',
    },
  };

  return (
    <div style={styles.container}>
      <label htmlFor={id} style={styles.label}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value || defaultValue}
        onChange={onChange}
        style={styles.select}
      >
        {allowedValues.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StateDropdown; 