import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Sensor } from '../../types/sensor';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface SensorItemProps {
  sensor: Sensor;
  windowWidth: number;
}

const SensorItem: React.FC<SensorItemProps> = ({ sensor, windowWidth }) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  // Function to determine the status color
  const getStatusColor = (status: boolean) => {
    if (status) {
      return darkMode ? colors.successBackground : '#dcfce7';
    } else {
      return darkMode ? colors.dangerBackground : '#fee2e2';
    }
  };

  // Function to determine the status text color
  const getStatusTextColor = (status: boolean) => {
    if (status) {
      return darkMode ? colors.successText : '#166534';
    } else {
      return darkMode ? colors.dangerText : '#991b1b';
    }
  };

  const sensorCardStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    alignItems: isMobile ? 'flex-start' : 'center',
    padding: '1rem',
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    marginBottom: '1rem',
    transition: 'all 0.15s ease-in-out',
  };

  return (
    <Link 
      to={`/sensors/${sensor.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
      }}
    >
      <div 
        style={sensorCardStyle}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = darkMode 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = darkMode 
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: darkMode ? colors.textPrimary : '#111827',
            margin: '0 0 0.5rem 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {sensor.name}
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '0.5rem',
          }}>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: darkMode ? colors.infoBackground : '#dbeafe',
              color: darkMode ? colors.infoText : '#1e40af',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              marginRight: '0.5rem',
              display: 'inline-block',
            }}>
              {sensor.type}
            </span>
            
            {sensor.area && (
              <span style={{
                fontSize: '0.75rem',
                backgroundColor: darkMode ? colors.successBackground : '#dcfce7',
                color: darkMode ? colors.successText : '#166534',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                display: 'inline-block',
              }}>
                {sensor.area.name}
              </span>
            )}
          </div>
          
          <p style={{
            fontSize: '0.875rem',
            color: darkMode ? colors.textMuted : '#6b7280',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {sensor.description || t('no_description')}
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
            backgroundColor: getStatusColor(sensor.status),
            color: getStatusTextColor(sensor.status),
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
        </div>
      </div>
    </Link>
  );
};

export default SensorItem; 