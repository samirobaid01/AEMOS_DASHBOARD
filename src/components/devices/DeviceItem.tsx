import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { DeviceStatus } from '../../constants/device';
import Card from '../common/Card/Card';
import { cn } from '../../utils/cn';
import type { DeviceItemProps } from './types';

const DeviceItem: React.FC<DeviceItemProps> = React.memo(({ device, isMobile, className }) => {
  const { t } = useTranslation();

  const getStatusClasses = (status: DeviceStatus) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20',
          text: 'text-green-700 dark:text-green-400',
          dot: 'bg-green-600'
        };
      case 'inactive':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          text: 'text-red-700 dark:text-red-400',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          text: 'text-yellow-700 dark:text-yellow-400',
          dot: 'bg-yellow-500'
        };
    }
  };

  const getDeviceTypeClasses = (type: string) => {
    switch (type) {
      case 'actuator':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'sensor':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'gateway':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'controller':
        return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const statusClasses = getStatusClasses(device.status);

  return (
    <Link 
      to={`/devices/${device.id}`}
      className="block no-underline text-inherit"
    >
      <Card 
        className={cn(
          'hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150 mb-4',
          className
        )}
        contentClassName="p-4"
      >
        <div className={cn(
          'flex',
          isMobile ? 'flex-col items-start' : 'flex-row items-center'
        )}>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-textPrimary dark:text-textPrimary-dark mb-2 truncate m-0">
              {device.name}
            </h3>

            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full inline-block',
                getDeviceTypeClasses(device.deviceType)
              )}>
                {device.deviceType}
              </span>

              <span className="text-xs px-2 py-0.5 rounded-full inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                {device.controlType}
              </span>

              {device.communicationProtocol && (
                <span className="text-xs px-2 py-0.5 rounded-full inline-block bg-surface dark:bg-surface-dark text-textSecondary dark:text-textSecondary-dark">
                  {device.communicationProtocol}
                </span>
              )}
            </div>

            <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 truncate">
              {device.description || t('devices.noDescription')}
            </p>
          </div>

          <div className={cn(
            'flex-shrink-0',
            isMobile ? 'mt-3' : 'ml-4'
          )}>
            <span className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              statusClasses.bg,
              statusClasses.text
            )}>
              <span className={cn(
                'w-2 h-2 rounded-full mr-1.5',
                statusClasses.dot
              )}></span>
              {t(`devices.statuses.${device.status}`)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
});

DeviceItem.displayName = 'DeviceItem';

export default DeviceItem; 