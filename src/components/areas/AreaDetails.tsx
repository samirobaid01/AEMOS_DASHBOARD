import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Area } from '../../types/area';

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
  const isMobile = windowWidth < 768;

  if (!area) {
    return null;
  }

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
    color: '#111827',
    margin: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: isMobile ? 'wrap' as const : 'nowrap' as const,
    width: isMobile ? '100%' : 'auto'
  };

  const buttonStyle = (variant: 'primary' | 'secondary' | 'danger') => ({
    padding: '0.5rem 1rem',
    backgroundColor: 
      variant === 'primary' ? '#3b82f6' : 
      variant === 'danger' ? '#ef4444' : 
      'white',
    color: variant === 'secondary' ? '#4b5563' : 'white',
    border: variant === 'secondary' ? '1px solid #d1d5db' : 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexGrow: isMobile ? 1 : 0,
    minWidth: isMobile ? '0' : '5rem'
  });

  return (
    <div style={{ padding: isMobile ? '1rem' : '1.5rem 2rem' }}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem', color: '#4b5563' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 style={titleStyle}>
            {area.name}
          </h1>
        </div>

        <div style={buttonGroupStyle}>
          <button
            onClick={onEdit}
            style={buttonStyle('primary')}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            <svg style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('edit')}
          </button>
          <button
            onClick={onDelete}
            style={buttonStyle('danger')}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
            }}
          >
            <svg style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('delete')}
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>
                {t('area_information')}
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('area_name')}
                </p>
                <p style={{ fontSize: '1rem', color: '#111827', margin: 0 }}>
                  {area.name}
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('organization')}
                </p>
                <p style={{ fontSize: '1rem', color: '#111827', margin: 0 }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                  }}>
                    {area.organization?.name || t('none')}
                  </span>
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: '0 0 0.25rem 0' }}>
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
                    backgroundColor: area.status ? '#dcfce7' : '#fee2e2',
                    color: area.status ? '#166534' : '#b91c1c',
                  }}>
                    <span style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '50%',
                      backgroundColor: area.status ? '#16a34a' : '#ef4444',
                      marginRight: '0.375rem',
                    }}></span>
                    {area.status ? t('active') : t('inactive')}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>
                {t('areas.additional_details')}
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('common.description')}
                </p>
                <p style={{ fontSize: '1rem', color: '#111827', margin: 0, lineHeight: 1.5 }}>
                  {area.description || t('areas.no_description')}
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('areas.created_at')}
                </p>
                <p style={{ fontSize: '1rem', color: '#111827', margin: 0 }}>
                  {area.createdAt ? new Date(area.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetails; 