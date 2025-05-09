import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface AreaFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  organizationFilter: string;
  setOrganizationFilter: (value: string) => void;
  organizations: string[];
  windowWidth: number;
}

const AreaFilter: React.FC<AreaFilterProps> = ({
  searchTerm,
  setSearchTerm,
  organizationFilter,
  setOrganizationFilter,
  organizations,
  windowWidth
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
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
        </div>
        <input
          type="text"
          style={{
            display: 'block',
            width: '100%',
            padding: '0.5rem 0.75rem 0.5rem 2.5rem',
            borderRadius: '0.375rem',
            border: `1px solid ${colors.border}`,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            backgroundColor: colors.surfaceBackground,
            color: colors.textPrimary,
            outline: 'none',
          }}
          placeholder={t('search_areas')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
            e.target.style.borderColor = colors.primary;
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.borderColor = colors.border;
          }}
        />
      </div>
      
      {organizations.length > 0 && (
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
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = colors.primary;
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = colors.border;
            }}
          >
            <option value="">{t('all_organizations')}</option>
            {organizations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AreaFilter; 