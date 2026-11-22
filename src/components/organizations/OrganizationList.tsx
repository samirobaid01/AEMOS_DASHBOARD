import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Plus, AlertCircle } from 'lucide-react';
import OrganizationItem from './OrganizationItem';
import OrganizationFilter from './OrganizationFilter';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button/Button';
import type { OrganizationListProps } from './types';

const OrganizationList: React.FC<OrganizationListProps> = ({
  filteredOrganizations,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSubmitFilter,
  onClearFilter,
  onAddOrganization,
  error,
  windowWidth
}) => {
  const { t } = useTranslation();

  const PageHeader = (
    <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Building2 className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 flex items-center gap-2">
            {t('organizations.title')}
            {filteredOrganizations.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 tabular-nums">
                {filteredOrganizations.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mt-0.5">
            {t('organizations.subtitle', { defaultValue: 'Manage your organizations' })}
          </p>
        </div>
      </div>
      <Button type="button" variant="primary" onClick={onAddOrganization} leftIcon={<Plus className="w-4 h-4" />}>
        {t('organizations.add')}
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
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
      <OrganizationFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSubmit={onSubmitFilter}
        onClear={onClearFilter}
        windowWidth={windowWidth}
      />
      {filteredOrganizations.length === 0 ? (
        <EmptyState
          title={t('organizations.no_organizations_found')}
          description={t('organizations.no_organizations_found_description')}
          actionLabel={t('organizations.add')}
          onAction={onAddOrganization}
        />
      ) : (
        <div>
          {filteredOrganizations.map((organization) => (
            <OrganizationItem key={organization.id} organization={organization} windowWidth={windowWidth} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationList;
