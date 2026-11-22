import React from 'react';
import { useTranslation } from 'react-i18next';
import FormField from '../common/FormField';
import type { AreaFilterProps } from './types';

const AreaFilter: React.FC<AreaFilterProps> = ({
  searchTerm,
  setSearchTerm,
  organizationFilter,
  setOrganizationFilter,
  organizations,
}) => {
  const { t } = useTranslation();

  const inputClasses =
    'w-full px-3 py-2 text-sm text-textPrimary dark:text-textPrimary-dark bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark shadow-sm outline-none focus:ring-2 focus:ring-primary';
  const selectClasses =
    'w-full px-3 py-2 pr-10 text-sm text-textPrimary dark:text-textPrimary-dark bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark shadow-sm outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm">
      <div className="flex flex-col flex-1">
        <FormField label={t('common.search')} id="areaSearch">
          <input
            id="areaSearch"
            type="text"
            placeholder={t('search_areas')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClasses}
          />
        </FormField>
      </div>
      {organizations.length > 0 && (
        <div className="flex flex-col flex-1">
          <FormField label={t('areas.organization', { defaultValue: 'Organization' })} id="areaOrganizationFilter">
            <select
              id="areaOrganizationFilter"
              value={organizationFilter}
              onChange={(e) => setOrganizationFilter(e.target.value)}
              className={selectClasses}
            >
              <option value="">{t('all_organizations')}</option>
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      )}
    </div>
  );
};

export default AreaFilter;
