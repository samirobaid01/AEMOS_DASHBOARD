import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Plus, AlertCircle } from 'lucide-react';
import DeviceItem from './DeviceItem';
import DeviceFilter from './DeviceFilter';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button/Button';
import type { DeviceListProps } from './types';

const DeviceList: React.FC<DeviceListProps> = ({
  filteredDevices,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  deviceTypes,
  onAddDevice,
  error,
  windowWidth,
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  const PageHeader = (
    <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Cpu className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 flex items-center gap-2">
            {t('devices.title')}
            {filteredDevices.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 tabular-nums">
                {filteredDevices.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mt-0.5">
            {t('devices.subtitle', { defaultValue: 'Monitor and manage your devices' })}
          </p>
        </div>
      </div>
      <Button type="button" variant="primary" onClick={onAddDevice} leftIcon={<Plus className="w-4 h-4" />}>
        {t('devices.add')}
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        {PageHeader}
        <div className="flex items-center gap-2 p-4 rounded-xl bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      {PageHeader}

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
          description={
            searchTerm || typeFilter
              ? t('devices.noDevicesFoundWithFilters')
              : t('devices.noDevicesDescription')
          }
          actionLabel={t('devices.add')}
          onAction={onAddDevice}
        />
      ) : (
        <div>
          {filteredDevices.map((device) => (
            <DeviceItem key={device.id} device={device} isMobile={isMobile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceList;
