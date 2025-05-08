import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  name: string;
  count: number;
  path: string;
  icon: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  name,
  count,
  path,
  icon,
  color,
  textColor,
  bgColor,
  borderColor,
}) => {
  return (
    <Link 
      to={path}
      style={{
        display: 'flex',
        overflow: 'hidden',
        borderRadius: '0.75rem',
        border: '1px solid',
        borderColor: '#e5e7eb',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        transform: 'translateY(0)',
        textDecoration: 'none',
        height: '100%',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = borderColor.replace('border-', '');
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      <div style={{ 
        width: '8px', 
        backgroundColor: color.replace('bg-', ''),
      }}></div>
      <div style={{ 
        padding: '1.25rem',
        width: '100%',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            flexShrink: 0,
            borderRadius: '0.5rem',
            padding: '0.625rem',
            backgroundColor: color.replace('bg-', ''),
            color: 'white',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
          }}>
            {icon}
          </div>
          <div style={{
            marginLeft: '1.25rem',
            flex: 1,
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6B7280',
              marginTop: 0,
              marginBottom: '0.5rem',
            }}>{name}</h3>
            <p style={{
              fontSize: 'calc(1.5rem + 0.25vw)',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
            }}>{count}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StatCard; 