import React from 'react';
import { useTranslation } from 'react-i18next';
import DeviceItem from './DeviceItem';
import DeviceFilter from './DeviceFilter';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button/Button';
import ErrorDisplay from './ErrorDisplay';
import { cn } from '../../utils/cn';
import type { DeviceListProps } from './types';

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
    <div className={cn(
      'bg-background dark:bg-background-dark',
      isMobile ? 'p-4' : 'p-6 lg:p-8'
    )}>
      <div className={cn(
        'flex justify-between mb-6',
        isMobile ? 'flex-col items-start gap-4' : 'flex-row items-center'
      )}>
        <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
          {t('devices.title')}
        </h1>
        <Button
          type="button"
          onClick={onAddDevice}
          fullWidth={isMobile}
          className={isMobile ? 'w-full' : ''}
        >
          <svg
            className="w-4 h-4 mr-1.5"
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
          title={searchTerm || typeFilter ? t('devices.noDevicesFound') : t('devices.noDevices')}
          description={searchTerm || typeFilter
            ? t('devices.noDevicesFoundWithFilters')
            : t('devices.noDevicesDescription')
          }
          actionLabel={t('devices.add')}
          onAction={onAddDevice}
        />
      ) : (
        <div className="flex flex-col gap-4">
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