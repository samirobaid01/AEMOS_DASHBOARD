import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clearCredentials, selectCurrentUser } from '../../state/slices/auth.slice';
import type { User } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';
import OrganizationSelector from '../common/OrganizationSelector/OrganizationSelector';
import Button from '../common/Button/Button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const user = useAppSelector(selectCurrentUser);
  const isMobile = windowWidth < 768;
  const { darkMode } = useTheme();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const navigation = [
    { name: t('navigation.dashboard'), path: '/dashboard', icon: '🌱' },
    { name: t('navigation.organizations'), path: '/organizations', icon: '🚜' },
    { name: t('navigation.areas'), path: '/areas', icon: '🌾' },
    { name: t('navigation.sensors'), path: '/sensors', icon: '🌡️' },
    { name: t('navigation.devices'), path: '/devices', icon: '📡' },
    { name: t('navigation.rules'), path: '/rule-engine', icon: '⚡' },
    { name: t('navigation.settings'), path: '/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Theme-aware styles
  const sidebarStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    bottom: 0,
    width: '260px',
    backgroundColor: darkMode ? '#111827' : 'white',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    zIndex: 40,
    transform: (isMobile && !sidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 300ms ease-in-out',
    borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
  };

  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 30,
    display: (isMobile && sidebarOpen) ? 'block' : 'none',
  };

  const getNavItemStyle = (isActiveItem: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '8px',
    fontWeight: 500,
    color: isActiveItem 
      ? 'white' 
      : darkMode ? '#d1d5db' : '#4b5563',
    backgroundColor: isActiveItem 
      ? '#16a34a' 
      : 'transparent',
    transition: 'all 200ms',
    textDecoration: 'none'
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: darkMode ? '#111827' : '#f0f9f0',
      color: darkMode ? '#f9fafb' : 'inherit'
    }}>
      {/* Mobile sidebar overlay */}
      <div 
        style={overlayStyle}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar (mobile & desktop) */}
      <div style={sidebarStyle}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column' as const, 
          height: '100%' 
        }}>
          {/* Logo section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px', 
            borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` 
          }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>🌿</span>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#166534' 
            }}>
              AEMOS <span style={{ color: darkMode ? '#f59e0b' : '#b45309' }}>Agriculture</span>
            </h1>
            
            {/* Mobile close button - only visible on mobile */}
            {isMobile && (
              <Button
                type="button"
                variant="secondary"
                style={{ marginLeft: 'auto', padding: '0.5rem', minWidth: 'auto', color: darkMode ? '#d1d5db' : 'inherit' }}
                onClick={() => setSidebarOpen(false)}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>

          {/* Navigation links */}
          <nav style={{ 
            flex: '1 1 auto', 
            overflowY: 'auto' as const, 
            padding: '20px 16px' 
          }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                style={getNavItemStyle(isActive(item.path))}
                onMouseOver={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f0f9f0';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px'
                }}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div style={{ 
            borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, 
            padding: '16px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {getInitial(user?.userName)}
              </div>
              <div style={{ marginLeft: '12px' }}>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: darkMode ? '#d1d5db' : '#4b5563',
                  maxWidth: '160px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap' as const
                }}>
                  {user?.userName || user?.email || 'User'}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  style={{
                    marginTop: '4px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#16a34a',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    minWidth: 'auto',
                  }}
                  onClick={handleLogout}
                >
                  <svg style={{ marginRight: '4px', width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('auth.logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div style={{
        paddingLeft: isMobile ? 0 : '260px',
        minHeight: '100vh',
        transition: 'padding-left 300ms ease-in-out',
        backgroundColor: darkMode ? '#111827' : '#f0f9f0',
      }}>
        {/* Mobile top bar - only visible on mobile */}
        {isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            backgroundColor: darkMode ? '#1f2937' : 'white',
            boxShadow: darkMode 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            position: 'sticky' as const,
            top: 0,
            zIndex: 10,
            color: darkMode ? '#d1d5db' : 'inherit'
          }}>
            <Button
              type="button"
              variant="secondary"
              style={{ padding: '16px', minWidth: 'auto', color: darkMode ? '#d1d5db' : '#4b5563' }}
              onClick={() => setSidebarOpen(true)}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>🌿</span>
              <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534' }}>
                AEMOS <span style={{ color: darkMode ? '#f59e0b' : '#b45309' }}>Agriculture</span>
              </h1>
            </div>
            
            {/* Organization Selector for Mobile */}
            <div style={{ padding: '0 16px' }}>
              <OrganizationSelector />
            </div>
          </div>
        )}

        {/* Desktop header with organization selector - only visible on desktop */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '64px',
            padding: '0 32px',
            backgroundColor: 'transparent',
            position: 'sticky' as const,
            top: 0,
            zIndex: 10,
          }}>
            <OrganizationSelector />
          </div>
        )}

        {/* Main content */}
        <main style={{ padding: isMobile ? '24px' : '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 