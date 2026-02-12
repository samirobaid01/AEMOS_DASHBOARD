import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Sensor } from '../../types/sensor';
import EmptyState from '../common/EmptyState';
import SensorFilter from './SensorFilter';
import SensorItem from './SensorItem';
import Button from '../common/Button/Button';

interface SensorListProps {
  sensors: Sensor[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  sensorTypes: string[];
  onAddSensor: () => void;
  windowWidth: number;
}

const SensorList: React.FC<SensorListProps> = ({
  sensors,
  error,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  sensorTypes,
  onAddSensor,
  windowWidth
}) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <div className={`p-4 sm:p-6 lg:p-8 bg-background dark:bg-background-dark`}>
        <div className={`flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6`}>
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
            {t('sensors.title')}
          </h1>
          <Button type="button" onClick={onAddSensor}>
            {t('sensors.add')}
          </Button>
        </div>
        <div className="flex items-center p-4 rounded-md bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark text-sm font-medium mb-6">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      <div className={`flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6`}>
        <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
          {t('sensors.title')}
        </h1>
        <Button type="button" onClick={onAddSensor}>
          <svg className="w-4 h-4 mr-1.5 inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('sensors.add')}
        </Button>
      </div>

      <SensorFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sensorTypes={sensorTypes}
        windowWidth={windowWidth}
      />

      {sensors.length === 0 ? (
        <EmptyState
          title={t('sensors.noSensors')}
          description={t('sensors.no_sensors_found_description')}
          actionLabel={t('sensors.add')}
          onAction={onAddSensor}
        />
      ) : (
        <div>
          {sensors.map(sensor => (
            <SensorItem key={sensor.id} sensor={sensor} windowWidth={windowWidth} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SensorList;
