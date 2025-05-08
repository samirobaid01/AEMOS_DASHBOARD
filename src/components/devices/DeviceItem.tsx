import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Device } from '../../types/device';

interface DeviceItemProps {
  device: Device;
  isMobile: boolean;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ device, isMobile }) => {
  const { t } = useTranslation();

  const deviceItemStyle = {
    display: 'block',
    padding: '1rem',
    borderRadius: '0.5rem',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    marginBottom: '0.75rem',
    textDecoration: 'none',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  };

  return (
    <Link 
      to={`/devices/${device.id}`} 
      style={deviceItemStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
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
            color: '#2563eb',
            margin: '0 0 0.5rem 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {device.name}
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '0.5rem',
          }}>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              marginRight: '0.5rem',
              display: 'inline-block',
            }}>
              {device.type}
            </span>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: 0,
            }}>
              {device.serialNumber}
            </p>
          </div>
          
          {device.firmware && (
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: 0,
            }}>
              {t('firmware')}: {device.firmware}
            </p>
          )}
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
            backgroundColor: device.status ? '#dcfce7' : '#fee2e2',
            color: device.status ? '#166534' : '#b91c1c',
          }}>
            <span style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              backgroundColor: device.status ? '#16a34a' : '#ef4444',
              marginRight: '0.375rem',
            }}></span>
            {device.status ? t('active') : t('inactive')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DeviceItem; 