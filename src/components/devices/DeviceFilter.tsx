import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface DeviceFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  deviceTypes: string[];
  isMobile: boolean;
}

const DeviceFilter: React.FC<DeviceFilterProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  deviceTypes,
  isMobile
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  const filterContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: darkMode ? colors.surfaceBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#4b5563',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: darkMode ? colors.textPrimary : '#111827',
    backgroundColor: darkMode ? colors.background : 'white',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    width: '100%',
    outline: 'none',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  };

  return (
    <div style={filterContainerStyle}>
      <div style={inputGroupStyle}>
        <label htmlFor="deviceSearch" style={labelStyle}>
          {t('common.search')}
        </label>
        <input
          id="deviceSearch"
          type="text"
          placeholder={t('devices.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={inputGroupStyle}>
        <label htmlFor="deviceTypeFilter" style={labelStyle}>
          {t('devices.type')}
        </label>
        <select
          id="deviceTypeFilter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="">{t('common.all')}</option>
          {deviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DeviceFilter; 