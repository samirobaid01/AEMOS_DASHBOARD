import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Device } from '../../types/device';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface DeviceItemProps {
  device: Device;
  isMobile: boolean;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ device, isMobile }) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();

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

  const deviceCardStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    alignItems: isMobile ? 'flex-start' : 'center',
    padding: '1rem',
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    borderLeft: '4px solid',
    borderLeftColor: device.status ? '#10b981' : '#ef4444',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    marginBottom: '1rem',
    transition: 'all 0.15s ease-in-out',
  };

  return (
    <Link 
      to={`/devices/${device.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
      }}
    >
      <div 
        style={deviceCardStyle}
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
        <div style={{
          flex: 1,
          marginBottom: isMobile ? '1rem' : 0,
          marginRight: isMobile ? 0 : '1rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: darkMode ? colors.textPrimary : '#111827',
            margin: 0,
            marginBottom: '0.25rem'
          }}>
            {device.name}
          </h3>
          
          <p style={{
            fontSize: '0.875rem',
            color: darkMode ? colors.textSecondary : '#4b5563',
            margin: 0
          }}>
            SN: {device.serialNumber || 'N/A'}
          </p>
          
          {device.type && (
            <p style={{
              fontSize: '0.75rem',
              color: darkMode ? colors.textMuted : '#6b7280',
              margin: '0.25rem 0'
            }}>
              Type: {device.type}
            </p>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: isMobile ? 'flex-start' : 'center'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: getStatusColor(device.status),
            color: getStatusTextColor(device.status)
          }}>
            {device.status ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DeviceItem; 