import React from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationItem from './OrganizationItem';
import OrganizationFilter from './OrganizationFilter';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button/Button';
import type { OrganizationListProps } from './types';

const AddIcon = () => (
  <svg className="w-4 h-4 mr-1.5 inline" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

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

  if (error) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        <div className={`flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6`}>
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">{t('organizations.title')}</h1>
          <Button variant="primary" onClick={onAddOrganization} leftIcon={<AddIcon />}>
            {t('organizations.add')}
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
        <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">{t('organizations.title')}</h1>
        <Button variant="primary" onClick={onAddOrganization} leftIcon={<AddIcon />}>
          {t('organizations.add')}
        </Button>
      </div>
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
