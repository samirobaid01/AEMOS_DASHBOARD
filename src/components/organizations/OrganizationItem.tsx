import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Organization } from '../../types/organization';
import { useThemeColors } from '../../hooks/useThemeColors';
import Button from '../../components/common/Button/Button';

interface OrganizationItemProps {
  organization: Organization;
  windowWidth: number;
}

const OrganizationItem: React.FC<OrganizationItemProps> = ({ organization, windowWidth }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  // Icons for the buttons
  const EditIcon = () => (
    <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const ViewIcon = () => (
    <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  return (
    <div 
      style={{
        display: 'block',
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        marginBottom: '1rem',
        transition: 'all 0.2s',
        boxShadow: colors.cardShadow,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = colors.cardShadow;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Organization info */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: '1rem',
          flex: '1',
        }}>
          {/* Avatar */}
          <div style={{
            width: isMobile ? '3rem' : '3.5rem',
            height: isMobile ? '3rem' : '3.5rem',
            borderRadius: '50%',
            backgroundColor: colors.surfaceBackground,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
          }}>
            {organization.image ? (
              <img src={organization.image} alt={organization.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.textMuted }}>
                {organization.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Organization details */}
          <div style={{ 
            flex: '1', 
            minWidth: 0,
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: colors.info,
              margin: '0 0 0.25rem 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {organization.name}
            </h3>
            
            {organization.detail && (
              <p style={{
                fontSize: '0.875rem',
                color: colors.textMuted,
                margin: '0 0 0.5rem 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                lineHeight: 1.4,
              }}>
                {organization.detail}
              </p>
            )}
            
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? '0.25rem' : '1rem',
              fontSize: '0.75rem',
              color: colors.textMuted,
            }}>
              {organization.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{organization.email}</span>
                </div>
              )}
              
              {organization.contactNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{organization.contactNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Status and Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: isMobile ? 'center' : 'flex-end',
          justifyContent: 'center',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: organization.status === 'active' ? colors.successBackground : organization.status === 'inactive' ? colors.dangerBackground : colors.border,
            color: organization.status === 'active' ? colors.successText : organization.status === 'inactive' ? colors.dangerText : colors.textSecondary,
          }}>
            <span style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              backgroundColor: organization.status === 'active' ? colors.success : organization.status === 'inactive' ? colors.danger : colors.textMuted,
              marginRight: '0.375rem',
            }}></span>
            {t(organization.status)}
          </span>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem',
          }}>
            <Link to={`/organizations/${organization.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<EditIcon />}
              >
                {t('edit')}
              </Button>
            </Link>
            
            <Link to={`/organizations/${organization.id}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ViewIcon />}
              >
                {t('view')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationItem; 