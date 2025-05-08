import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Device } from '../../types/device';
import DeviceItem from './DeviceItem';
import DeviceFilter from './DeviceFilter';
import EmptyState from './EmptyState';
import ErrorDisplay from './ErrorDisplay';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface DeviceListProps {
  devices: Device[];
  filteredDevices: Device[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  deviceTypes: string[];
  onAddDevice: () => void;
  isLoading: boolean;
  error: string | null;
  windowWidth: number;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  filteredDevices,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  deviceTypes,
  onAddDevice,
  isLoading,
  error,
  windowWidth
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    marginBottom: '1.5rem',
    gap: isMobile ? '1rem' : '0'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    margin: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  };

  if (error) {
    return <ErrorDisplay errorMessage={error} />;
  }

  return (
    <div style={{ 
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      backgroundColor: darkMode ? colors.background : 'transparent'
    }}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>{t('devices.title')}</h1>
        <button
          onClick={onAddDevice}
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#5d8efa' : '#2563eb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#4d7efa' : '#3b82f6';
          }}
        >
          <svg 
            style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {t('devices.add')}
        </button>
      </div>

      <DeviceFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        deviceTypes={deviceTypes}
        isMobile={isMobile}
      />

      {filteredDevices.length === 0 ? (
        <EmptyState 
          message={t('devices.noDevices')}
          description={t('devices.no_devices_found_description')}
          actionLabel={t('devices.add')}
          onAddDevice={onAddDevice} 
        />
      ) : (
        <div>
          {filteredDevices.map(device => (
            <DeviceItem 
              key={device.id} 
              device={device} 
              isMobile={isMobile} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceList; 