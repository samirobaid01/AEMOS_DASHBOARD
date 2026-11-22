import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronRight } from 'lucide-react';
import type { OrganizationItemProps } from './types';

const OrganizationItem: React.FC<OrganizationItemProps> = React.memo(({ organization }) => {
  const { t } = useTranslation();

  const statusStyles =
    organization.status === 'active'
      ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
      : organization.status === 'inactive'
        ? 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
        : 'bg-border dark:bg-border-dark text-textSecondary dark:text-textSecondary-dark';

  const dotStyles =
    organization.status === 'active'
      ? 'bg-success dark:bg-success-dark'
      : organization.status === 'inactive'
        ? 'bg-danger dark:bg-danger-dark'
        : 'bg-textMuted dark:bg-textMuted-dark';

  return (
    <Link to={`/organizations/${organization.id}`} className="no-underline text-inherit block">
      <div className="group flex flex-col sm:flex-row sm:items-center items-start gap-4 p-4 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm mb-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-leaf-300 dark:hover:border-leaf-600">
        {/* Icon tile */}
        <div className="shrink-0 w-11 h-11 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Building2 className="w-5 h-5" aria-hidden />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-textPrimary dark:text-textPrimary-dark m-0 mb-1.5 truncate">
            {organization.name}
          </h3>
          {(organization.email || organization.contactNumber) && (
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              {organization.email && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 inline-block">
                  {organization.email}
                </span>
              )}
              {organization.contactNumber && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-leaf-50 dark:bg-leaf-900/40 text-leaf-700 dark:text-leaf-300 inline-block">
                  {organization.contactNumber}
                </span>
              )}
            </div>
          )}
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 truncate">
            {organization.detail || t('organizations.noDescription', { defaultValue: 'No description' })}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-1 sm:mt-0">
          <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${statusStyles}`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${dotStyles}`} />
            {t(organization.status)}
          </span>
          <ChevronRight
            className="hidden sm:block w-4 h-4 text-textMuted dark:text-textMuted-dark opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
});

export default OrganizationItem;
