import React from 'react';
import { useTranslation } from 'react-i18next';
import FormField from '../common/FormField';
import type { OrganizationFilterParams } from '../../types/organization';
import type { OrganizationFilterProps } from './types';

const OrganizationFilter: React.FC<OrganizationFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  const { t } = useTranslation();

  const inputClasses =
    'w-full px-3 py-2 text-sm text-textPrimary dark:text-textPrimary-dark bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark shadow-sm outline-none focus:ring-2 focus:ring-primary';
  const selectClasses =
    'w-full px-3 py-2 pr-10 text-sm text-textPrimary dark:text-textPrimary-dark bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark shadow-sm outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm">
      <div className="flex flex-col flex-1">
        <FormField label={t('common.search')} id="organizationSearch">
          <input
            id="organizationSearch"
            type="text"
            placeholder={t('search_organizations')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClasses}
          />
        </FormField>
      </div>
      <div className="flex flex-col flex-1">
        <FormField label={t('status')} id="organizationStatusFilter">
          <select
            id="organizationStatusFilter"
            className={selectClasses}
            value={statusFilter ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setStatusFilter(value === '' ? undefined : (value as OrganizationFilterParams['status']));
            }}
          >
            <option value="">{t('all')}</option>
            <option value="active">{t('active')}</option>
            <option value="inactive">{t('inactive')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="suspended">{t('suspended')}</option>
            <option value="archived">{t('archived')}</option>
          </select>
        </FormField>
      </div>
    </div>
  );
};

export default OrganizationFilter;
