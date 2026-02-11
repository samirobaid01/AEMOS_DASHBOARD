import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Area } from '../../types/area';
import Button from '../../components/common/Button/Button';
import { useThemeColors } from '../../hooks/useThemeColors';

interface AreaDetailsProps {
  area: Area | null;
  isLoading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  windowWidth: number;
}

const AreaDetails: React.FC<AreaDetailsProps> = ({
  area,
  isLoading,
  error,
  onEdit,
  onDelete,
  onBack,
  windowWidth
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: colors.textMuted }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: colors.dangerBackground,
        color: colors.dangerText, 
        borderRadius: '0.5rem', 
        marginBottom: '1rem' 
      }}>
        {error}
      </div>
    );
  }

  if (!area) {
    return null;
  }

  return (
    <div style={{ padding: isMobile ? '1rem' : '1.5rem 2rem' }}>
      <div style={{ maxWidth: '65rem', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="outline" onClick={onBack}>
            {t('common.back')}
          </Button>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={onEdit}>
              {t('common.edit')}
            </Button>
            <Button variant="danger" onClick={onDelete}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: colors.cardBackground,
          borderRadius: '0.5rem',
          boxShadow: colors.cardShadow,
          border: `1px solid ${colors.cardBorder}`,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem' }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: colors.textPrimary, 
              marginTop: 0, 
              marginBottom: '1.5rem'
            }}>
              {area.name}
            </h1>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
              gap: '2rem'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  color: colors.textPrimary, 
                  margin: '0 0 1rem 0'
                }}>
                  {t('areas.description')}
                </h2>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: colors.textMuted, 
                    margin: '0 0 0.25rem 0'
                  }}>
                    {t('common.organizations')}
                  </p>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: colors.textPrimary, 
                    margin: 0
                  }}>
                    {area.organization?.name || '-'}
                  </p>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: colors.textMuted, 
                    margin: '0 0 0.25rem 0'
                  }}>
                    {t('status')}
                  </p>
                  <p style={{ fontSize: '1rem', margin: 0 }}>
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
                  </p>
                </div>
              </div>
            
              <div>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  color: colors.textPrimary, 
                  margin: '0 0 1rem 0'
                }}>
                  {t('areas.additionalDetails')}
                </h2>
              
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: colors.textMuted, 
                    margin: '0 0 0.25rem 0'
                  }}>
                    {t('common.description')}
                  </p>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: colors.textPrimary, 
                    margin: 0, 
                    lineHeight: 1.5
                  }}>
                    {area.description || t('areas.noDescription')}
                  </p>
                </div>
              
                <div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: colors.textMuted, 
                    margin: '0 0 0.25rem 0'
                  }}>
                    {t('areas.created_at')}
                  </p>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: colors.textPrimary, 
                    margin: 0
                  }}>
                    {area.createdAt ? new Date(area.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetails;