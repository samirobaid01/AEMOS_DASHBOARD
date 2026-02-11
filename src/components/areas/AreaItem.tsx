import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Area } from '../../types/area';
import { useThemeColors } from '../../hooks/useThemeColors';

interface AreaItemProps {
  area: Area;
  windowWidth: number;
}

const AreaItem: React.FC<AreaItemProps> = ({ area, windowWidth }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  return (
    <Link 
      to={`/areas/${area.id}`} 
      style={{
        display: 'block',
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        marginBottom: '0.75rem',
        textDecoration: 'none',
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
        alignItems: isMobile ? 'flex-start' : 'center',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.info,
            margin: '0 0 0.5rem 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {area.name}
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '0.5rem',
          }}>
            {area.organizationId && (
              <span style={{
                fontSize: '0.75rem',
                backgroundColor: colors.infoBackground,
                color: colors.infoText,
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                marginRight: '0.5rem',
                display: 'inline-block',
              }}>
                {area.organization?.name || t('organization')}
              </span>
            )}
          </div>
          
          <p style={{
            fontSize: '0.875rem',
            color: colors.textMuted,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {area.description || t('areas.noDescription')}
          </p>
        </div>
        
        <div style={{
          marginTop: isMobile ? '0.75rem' : 0,
          marginLeft: isMobile ? 0 : '1rem',
          flexShrink: 0,
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: area.status === 'active' ? colors.successBackground : area.status === 'inactive' ? colors.dangerBackground : colors.border,
            color: area.status === 'active' ? colors.successText : area.status === 'inactive' ? colors.dangerText : colors.textSecondary,
          }}>
            <span style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              backgroundColor: area.status === 'active' ? colors.success : area.status === 'inactive' ? colors.danger : colors.textMuted,
              marginRight: '0.375rem',
            }}></span>
            {t(area.status)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AreaItem; 