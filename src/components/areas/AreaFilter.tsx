import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AreaFilterProps } from './types';

const inputClasses =
  'block w-full pl-10 pr-3 py-2 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';

const AreaFilter: React.FC<AreaFilterProps> = ({
  searchTerm,
  setSearchTerm,
  organizationFilter,
  setOrganizationFilter,
  organizations,
  windowWidth
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  return (
    <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-textMuted dark:text-textMuted-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className={inputClasses}
          placeholder={t('search_areas')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {organizations.length > 0 && (
        <div>
          <select
            className={selectClasses}
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
          >
            <option value="">{t('all_organizations')}</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AreaFilter;
