import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DeviceType } from '../../constants/device';
import FormField from '../common/FormField';
import type { DeviceFilterProps } from './types';

const inputClasses =
  'block w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';

const DeviceFilter: React.FC<DeviceFilterProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  deviceTypes,
  isMobile
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex gap-4 mb-6 p-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm ${isMobile ? 'flex-col' : 'flex-row'}`}
    >
      <div className="flex-1">
        <FormField label={t('common.search')} id="deviceSearch">
          <input
            id="deviceSearch"
            type="text"
            placeholder={t('devices.searchDevice')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClasses}
          />
        </FormField>
      </div>

      <div className="flex-1">
        <FormField label={t('devices.type')} id="deviceTypeFilter">
          <select
            id="deviceTypeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DeviceType | '')}
            className={selectClasses}
          >
            <option value="">{t('common.all')}</option>
            {deviceTypes.map((type) => (
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

export default DeviceFilter;
