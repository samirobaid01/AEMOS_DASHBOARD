import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, AlertCircle, Thermometer } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import SensorFilter from './SensorFilter';
import SensorItem from './SensorItem';
import Button from '../common/Button/Button';
import type { SensorListProps } from './types';

const SensorList: React.FC<SensorListProps> = ({
  sensors,
  error,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  sensorTypes,
  onAddSensor,
  windowWidth,
}) => {
  const { t } = useTranslation();

  const PageHeader = (
    <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Thermometer className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 flex items-center gap-2">
            {t('sensors.title')}
            {sensors.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 tabular-nums">
                {sensors.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mt-0.5">
            {t('sensors.subtitle', { defaultValue: 'Monitor and manage your sensors' })}
          </p>
        </div>
      </div>
      <Button type="button" variant="primary" onClick={onAddSensor} leftIcon={<Plus className="w-4 h-4" />}>
        {t('sensors.add')}
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-background dark:bg-background-dark">
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
          {sensors.map((sensor) =>
            sensor.status === 'active' ? (
              <SensorItem key={sensor.id} sensor={sensor} windowWidth={windowWidth} />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
};

export default SensorList;
