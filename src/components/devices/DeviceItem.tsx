import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Device } from '../../types/device';
import type { DeviceStatus } from '../../constants/device';
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

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'active':
        return {
          bg: darkMode ? 'rgba(52, 211, 153, 0.2)' : '#dcfce7',
          text: darkMode ? '#34d399' : '#166534',
          dot: '#16a34a'
        };
      case 'inactive':
        return {
          bg: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
          text: darkMode ? '#ef4444' : '#b91c1c',
          dot: '#ef4444'
        };
      default:
        return {
          bg: darkMode ? 'rgba(234, 179, 8, 0.2)' : '#fef3c7',
          text: darkMode ? '#eab308' : '#92400e',
          dot: '#eab308'
        };
    }
  };

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case 'actuator':
        return darkMode ? colors.infoBackground : '#dbeafe';
      case 'sensor':
        return darkMode ? colors.successBackground : '#dcfce7';
      case 'gateway':
        return darkMode ? colors.warningBackground : '#fef3c7';
      case 'controller':
        return darkMode ? colors.infoBackground : '#e0e7ff';
      default:
        return darkMode ? colors.surfaceBackground : '#f3f4f6';
    }
  };

  const getDeviceTypeTextColor = (type: string) => {
    switch (type) {
      case 'actuator':
        return darkMode ? colors.infoText : '#1e40af';
      case 'sensor':
        return darkMode ? colors.successText : '#166534';
      case 'gateway':
        return darkMode ? colors.warningText : '#92400e';
      case 'controller':
        return darkMode ? colors.infoText : '#3730a3';
      default:
        return darkMode ? colors.textSecondary : '#4b5563';
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
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    marginBottom: '1rem',
    transition: 'all 0.15s ease-in-out'
  };

  const statusColors = getStatusColor(device.status);

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
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: darkMode ? colors.textPrimary : '#111827',
            margin: '0 0 0.5rem 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {device.name}
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: getDeviceTypeColor(device.deviceType),
              color: getDeviceTypeTextColor(device.deviceType),
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              display: 'inline-block'
            }}>
              {device.deviceType}
            </span>

            <span style={{
              fontSize: '0.75rem',
              backgroundColor: darkMode ? colors.infoBackground : '#dbeafe',
              color: darkMode ? colors.infoText : '#1e40af',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              display: 'inline-block'
            }}>
              {device.controlType}
            </span>

            {device.communicationProtocol && (
              <span style={{
                fontSize: '0.75rem',
                backgroundColor: darkMode ? colors.surfaceBackground : '#f3f4f6',
                color: darkMode ? colors.textSecondary : '#4b5563',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                display: 'inline-block'
              }}>
                {t(`devices.protocols.${device.communicationProtocol}`)}
              </span>
            )}
          </div>

          <p style={{
            fontSize: '0.875rem',
            color: darkMode ? colors.textMuted : '#6b7280',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {device.description || t('devices.no_description')}
          </p>
        </div>

        <div style={{
          marginTop: isMobile ? '0.75rem' : 0,
          marginLeft: isMobile ? 0 : '1rem',
          flexShrink: 0
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: statusColors.bg,
            color: statusColors.text
          }}>
            <span style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              backgroundColor: statusColors.dot,
              marginRight: '0.375rem'
            }}></span>
            {t(`devices.statuses.${device.status}`)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DeviceItem; 