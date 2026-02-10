import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';
import Input from '../../components/common/Input/Input';
import type { OrganizationFilterParams } from '../../types/organization';

interface OrganizationFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: OrganizationFilterParams['status'];
  setStatusFilter: (value: OrganizationFilterParams['status']) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  windowWidth: number;
}

const OrganizationFilter: React.FC<OrganizationFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSubmit,
  onClear,
  windowWidth
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;
  const inputStyle = {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    width: '100%',
    outline: 'none',
  };


  const SearchIcon = () => (
    <svg 
      style={{
        width: '1.25rem',
        height: '1.25rem',
        color: colors.textMuted
      }}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20" 
      fill="currentColor" 
      aria-hidden="true"
    >
      <path 
        fillRule="evenodd" 
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <Input
        leftIcon={<SearchIcon />}
        placeholder={t('search_organizations')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={inputStyle}
      />
      
      <div>
        <select
          style={{
            display: 'block',
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: `1px solid ${colors.border}`,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            backgroundColor: colors.surfaceBackground,
            color: colors.textPrimary,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5rem 1.5rem',
            outline: 'none',
          }}
          value={statusFilter ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            setStatusFilter(value === '' ? undefined : value as OrganizationFilterParams['status']);
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
            e.target.style.borderColor = colors.primary;
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.borderColor = colors.border;
          }}
        >
          <option value="">{t('all')}</option>
          <option value="active">{t('active')}</option>
          <option value="inactive">{t('inactive')}</option>
          <option value="pending">{t('pending')}</option>
          <option value="suspended">{t('suspended')}</option>
          <option value="archived">{t('archived')}</option>
        </select>
      </div>
    </div>
  );
};

export default OrganizationFilter; 