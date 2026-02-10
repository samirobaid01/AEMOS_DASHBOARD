import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Organization, OrganizationFilterParams } from '../../types/organization';
import OrganizationItem from './OrganizationItem';
import OrganizationFilter from './OrganizationFilter';
import EmptyState from './EmptyState';
import { useThemeColors } from '../../hooks/useThemeColors';
import Button from '../../components/common/Button/Button';

interface OrganizationListProps {
  organizations: Organization[];
  filteredOrganizations: Organization[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: OrganizationFilterParams['status'];
  setStatusFilter: (value: OrganizationFilterParams['status']) => void;
  onSubmitFilter: (e: React.FormEvent) => void;
  onClearFilter: () => void;
  onAddOrganization: () => void;
  isLoading: boolean;
  error: string | null;
  windowWidth: number;
}

const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  filteredOrganizations,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSubmitFilter,
  onClearFilter,
  onAddOrganization,
  isLoading,
  error,
  windowWidth
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    marginBottom: '1.5rem',
    gap: isMobile ? '1rem' : '0'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: colors.textPrimary,
    margin: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const errorStyle = {
    backgroundColor: colors.dangerBackground,
    padding: '1rem',
    borderRadius: '0.375rem',
    color: colors.dangerText,
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  };

  const AddIcon = () => (
    <svg 
      style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path 
        fillRule="evenodd" 
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  if (error) {
    return (
      <div style={{ padding: isMobile ? '1rem' : '1.5rem 2rem' }}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>{t('organizations.title')}</h1>
          <Button
            variant="primary"
            onClick={onAddOrganization}
            leftIcon={<AddIcon />}
          >
            {t('organizations.add')}
          </Button>
        </div>
        <div style={errorStyle}>
          <svg 
            style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '1rem' : '1.5rem 2rem' }}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>{t('organizations.title')}</h1>
        <Button
          variant="primary"
          onClick={onAddOrganization}
          leftIcon={<AddIcon />}
        >
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
          message={t('organizations.no_organizations_found')}
          description={t('organizations.no_organizations_found_description')}
          actionLabel={t('organizations.add')}
          onAction={onAddOrganization}
        />
      ) : (
        <div>
          {filteredOrganizations.map(organization => (
            <OrganizationItem 
              key={organization.id} 
              organization={organization}
              windowWidth={windowWidth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationList; 