import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SensorItemProps } from './types';

const SensorItem: React.FC<SensorItemProps> = ({ sensor, windowWidth }) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  return (
    <Link
      to={`/sensors/${sensor.id}`}
      className="no-underline text-inherit block"
    >
      <div className="flex flex-col sm:flex-row sm:items-center items-start p-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm dark:shadow-md mb-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-lg">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-textPrimary dark:text-textPrimary-dark m-0 mb-2 truncate">
            {sensor.name}
          </h3>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-infoBg dark:bg-infoBg-dark text-infoText dark:text-infoText-dark inline-block">
              {sensor.type}
            </span>
            {sensor.area && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark inline-block">
                {sensor.area.name}
              </span>
            )}
          </div>
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 truncate">
            {sensor.description || t('sensors.noDescription')}
          </p>
        </div>
        <div className={`flex-shrink-0 ${isMobile ? 'mt-3 ml-0' : 'mt-0 ml-4'}`}>
          <span
            className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${
              sensor.status
                ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
                : 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                sensor.status ? 'bg-success dark:bg-success-dark' : 'bg-danger dark:bg-danger-dark'
              }`}
            />
            {sensor.status ? t('active') : t('inactive')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SensorItem;
