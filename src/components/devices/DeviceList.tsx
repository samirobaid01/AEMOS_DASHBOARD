import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Device } from '../../types/device';
import type { DeviceType } from '../../constants/device';
import DeviceItem from './DeviceItem';
import DeviceFilter from './DeviceFilter';
import EmptyState from './EmptyState';
import Button from '../common/Button/Button';
import ErrorDisplay from './ErrorDisplay';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface DeviceListProps {
  devices: Device[];
  filteredDevices: Device[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: DeviceType | '';
  setTypeFilter: (filter: DeviceType | '') => void;
  deviceTypes: DeviceType[];
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

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <ErrorDisplay errorMessage={error} />
      </div>
    );
  }

  if (isLoading && devices.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      backgroundColor: darkMode ? colors.background : 'transparent'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' as const : 'row' as const,
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '1.5rem',
        gap: isMobile ? '1rem' : '0'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: darkMode ? colors.textPrimary : '#111827',
          margin: 0
        }}>
          {t('devices.title')}
        </h1>
        <Button
          type="button"
          onClick={onAddDevice}
          fullWidth={isMobile}
          style={isMobile ? { width: '100%' } : undefined}
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
        </Button>
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
          message={searchTerm || typeFilter ? t('devices.noDevicesFound') : t('devices.noDevices')}
          description={searchTerm || typeFilter 
            ? t('devices.noDevicesFoundWithFilters')
            : t('devices.noDevicesDescription')
          }
          actionLabel={t('devices.add')}
          onAddDevice={onAddDevice} 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
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