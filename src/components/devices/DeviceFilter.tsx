import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { DeviceType } from '../../constants/device';

interface DeviceFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: DeviceType | '';
  setTypeFilter: (filter: DeviceType | '') => void;
  deviceTypes: DeviceType[];
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

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`
  };

  const fieldGroupStyle = {
    flex: 1
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#374151',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827',
    outline: 'none'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    paddingRight: '2.5rem'
  };

  return (
    <div style={containerStyle}>
      <div style={fieldGroupStyle}>
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
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
            e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
          }}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="deviceTypeFilter" style={labelStyle}>
          {t('devices.type')}
        </label>
        <select
          id="deviceTypeFilter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as DeviceType | '')}
          style={selectStyle}
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
            e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
          }}
        >
          <option value="">{t('common.all')}</option>
          {deviceTypes.map((type) => (
            <option key={type} value={type}>
              {t(`devices.types.${type}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DeviceFilter; 

