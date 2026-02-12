import React from 'react';
import { useTranslation } from 'react-i18next';
import FormField from '../common/FormField';
import type { SensorFilterProps } from './types';

const SensorFilter: React.FC<SensorFilterProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  sensorTypes,
  windowWidth
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  const inputClasses =
    'w-full px-3 py-2 text-sm text-textPrimary dark:text-textPrimary-dark bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark shadow-sm outline-none focus:ring-2 focus:ring-primary';
  const selectClasses =
    'w-full px-3 py-2 pr-10 text-sm text-textPrimary dark:text-textPrimary-dark bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark shadow-sm outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';

  return (
    <div
      className={`flex gap-4 mb-6 p-4 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm ${
        isMobile ? 'flex-col' : 'flex-row'
      }`}
    >
      <div className="flex flex-col flex-1">
        <FormField label={t('common.search')} id="sensorSearch">
          <input
            id="sensorSearch"
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClasses}
          />
        </FormField>
      </div>
      <div className="flex flex-col flex-1">
        <FormField label={t('sensors.type')} id="sensorTypeFilter">
          <select
            id="sensorTypeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={selectClasses}
          >
            <option value="">{t('common.all')}</option>
            {sensorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
};

export default SensorFilter;
