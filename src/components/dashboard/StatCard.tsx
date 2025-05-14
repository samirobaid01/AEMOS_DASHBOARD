import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import usePermissions from '../../hooks/usePermissions';

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
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const getBackgroundColor = () => {
    return darkMode ? colors.cardBackground : 'white';
  };

  const getBorderColor = () => {
    return `border-${darkMode ? colors.border : '#e5e7eb'}`;
  };

  // Handle click and check permissions
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log(`StatCard: Trying to navigate to: ${path}`);
    
    // Check for required permissions based on path
    let requiredPermission = null;
    
    if (path === '/organizations') {
      requiredPermission = 'organization.view';
    } else if (path === '/areas') {
      requiredPermission = 'area.view';
    } else if (path === '/devices') {
      requiredPermission = 'device.view';
    } else if (path === '/sensors') {
      requiredPermission = 'sensor.view';
    }
    
    if (requiredPermission) {
      console.log(`StatCard: Checking permission: ${requiredPermission}`);
      const hasAccess = hasPermission(requiredPermission);
      console.log(`StatCard: Has access: ${hasAccess}`);
      
      if (!hasAccess) {
        console.log(`StatCard: Permission denied for ${path}`);
        alert(`You don't have permission to access ${name}. Required permission: ${requiredPermission}`);
        return;
      }
    }
    
    // If we have permission or no permission check is needed, navigate
    console.log(`StatCard: Navigating to ${path}`);
    navigate(path);
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        display: 'flex',
        overflow: 'hidden',
        borderRadius: '0.75rem',
        border: '1px solid',
        borderColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
        boxShadow: darkMode 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s',
        transform: 'translateY(0)',
        textDecoration: 'none',
        height: '100%',
        cursor: 'pointer',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = darkMode 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = darkMode 
          ? colors.primary
          : borderColor.replace('border-', '');
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = darkMode 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = getBorderColor();
      }}
      className={`p-6 rounded-lg shadow ${getBackgroundColor()} ${getBorderColor()}`}
      data-walkthrough="stat-card"
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
              color: darkMode ? colors.textMuted : '#6B7280',
              marginTop: 0,
              marginBottom: '0.5rem',
            }}>{name}</h3>
            <p style={{
              fontSize: 'calc(1.5rem + 0.25vw)',
              fontWeight: 'bold',
              color: darkMode ? colors.textPrimary : '#111827',
              margin: 0,
            }}>{count}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 