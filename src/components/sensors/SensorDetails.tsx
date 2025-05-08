import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Sensor } from '../../types/sensor';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface SensorDetailsProps {
  sensor: Sensor | null;
  isLoading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  windowWidth: number;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({
  sensor,
  isLoading,
  error,
  onEdit,
  onDelete,
  onBack,
  windowWidth
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  if (!sensor) {
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
    color: darkMode ? colors.textPrimary : '#111827',
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
      variant === 'primary' ? (darkMode ? '#4d7efa' : '#3b82f6') : 
      variant === 'danger' ? (darkMode ? '#ef5350' : '#ef4444') : 
      darkMode ? colors.surfaceBackground : 'white',
    color: variant === 'secondary' ? darkMode ? colors.textSecondary : '#4b5563' : 'white',
    border: variant === 'secondary' ? `1px solid ${darkMode ? colors.border : '#d1d5db'}` : 'none',
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
    <div style={{ 
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      backgroundColor: darkMode ? colors.background : 'transparent' 
    }}>
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
              e.currentTarget.style.backgroundColor = darkMode ? colors.surfaceBackground : '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem', color: darkMode ? colors.textSecondary : '#4b5563' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 style={titleStyle}>
            {sensor.name}
          </h1>
        </div>

        <div style={buttonGroupStyle}>
          <button
            onClick={onEdit}
            style={buttonStyle('primary')}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#5d8efa' : '#2563eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#4d7efa' : '#3b82f6';
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
              e.currentTarget.style.backgroundColor = darkMode ? '#f44336' : '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#ef5350' : '#ef4444';
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
        backgroundColor: darkMode ? colors.cardBackground : 'white',
        borderRadius: '0.5rem',
        boxShadow: darkMode 
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: darkMode ? colors.textPrimary : '#111827', margin: '0 0 1rem 0' }}>
                {t('sensor_information')}
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? colors.textSecondary : '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('sensor_name')}
                </p>
                <p style={{ fontSize: '1rem', color: darkMode ? colors.textPrimary : '#111827', margin: 0 }}>
                  {sensor.name}
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? colors.textSecondary : '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('sensor_type')}
                </p>
                <p style={{ fontSize: '1rem', color: darkMode ? colors.textPrimary : '#111827', margin: 0 }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    backgroundColor: darkMode ? colors.infoBackground : '#dbeafe',
                    color: darkMode ? colors.infoText : '#1e40af',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                  }}>
                    {sensor.type}
                  </span>
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? colors.textSecondary : '#6b7280', margin: '0 0 0.25rem 0' }}>
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
                    backgroundColor: sensor.status 
                      ? darkMode ? colors.successBackground : '#dcfce7' 
                      : darkMode ? colors.dangerBackground : '#fee2e2',
                    color: sensor.status 
                      ? darkMode ? colors.successText : '#166534' 
                      : darkMode ? colors.dangerText : '#b91c1c',
                  }}>
                    <span style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '50%',
                      backgroundColor: sensor.status ? '#16a34a' : '#ef4444',
                      marginRight: '0.375rem',
                    }}></span>
                    {sensor.status ? t('active') : t('inactive')}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: darkMode ? colors.textPrimary : '#111827', margin: '0 0 1rem 0' }}>
                {t('additional_details')}
              </h2>
              
              {sensor.area && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? colors.textSecondary : '#6b7280', margin: '0 0 0.25rem 0' }}>
                    {t('area')}
                  </p>
                  <p style={{ fontSize: '1rem', color: darkMode ? colors.textPrimary : '#111827', margin: 0 }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      backgroundColor: darkMode ? colors.successBackground : '#dcfce7',
                      color: darkMode ? colors.successText : '#166534',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                    }}>
                      {sensor.area.name}
                    </span>
                  </p>
                </div>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? colors.textSecondary : '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('description')}
                </p>
                <p style={{ fontSize: '1rem', color: darkMode ? colors.textPrimary : '#111827', margin: 0, lineHeight: 1.5 }}>
                  {sensor.description || t('no_description')}
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? colors.textSecondary : '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {t('created_at')}
                </p>
                <p style={{ fontSize: '1rem', color: darkMode ? colors.textPrimary : '#111827', margin: 0 }}>
                  {sensor.createdAt ? new Date(sensor.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </div>
          
          {sensor.metadata && Object.keys(sensor.metadata).length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: darkMode ? colors.textPrimary : '#111827', margin: '0 0 1rem 0' }}>
                {t('metadata')}
              </h2>
              <div style={{
                border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
                borderRadius: '0.375rem',
                overflow: 'hidden',
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem',
                }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb', 
                      borderBottom: `1px solid ${darkMode ? colors.border : '#e5e7eb'}` 
                    }}>
                      <th style={{ 
                        padding: '0.75rem 1rem', 
                        textAlign: 'left', 
                        fontWeight: 500, 
                        color: darkMode ? colors.textSecondary : '#6b7280' 
                      }}>{t('property')}</th>
                      <th style={{ 
                        padding: '0.75rem 1rem', 
                        textAlign: 'left', 
                        fontWeight: 500, 
                        color: darkMode ? colors.textSecondary : '#6b7280' 
                      }}>{t('value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sensor.metadata).map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: `1px solid ${darkMode ? colors.border : '#e5e7eb'}` }}>
                        <td style={{ 
                          padding: '0.75rem 1rem', 
                          fontWeight: 500, 
                          color: darkMode ? colors.textPrimary : '#111827' 
                        }}>{key}</td>
                        <td style={{ 
                          padding: '0.75rem 1rem', 
                          color: darkMode ? colors.textSecondary : '#4b5563' 
                        }}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorDetails; 