import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import i18n from '../../i18n/i18n';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  useEffect(() => {
    // Load user preferences from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const containerStyle = {
    padding: '1.5rem 1rem',
  };

  const headerStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '1.5rem',
  };

  const cardStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  };

  const sectionStyle = {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  };

  const sectionTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: '#1f2937',
    marginBottom: '1rem',
  };

  const languageButtonStyle = (isActive: boolean) => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isActive ? '#3b82f6' : '#f3f4f6',
    color: isActive ? 'white' : '#1f2937',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  });

  const languageGridStyle = {
    display: 'grid',
    gridTemplateColumns: windowWidth >= 640 ? 'repeat(2, 1fr)' : '1fr',
    gap: '1rem',
  };

  const toggleWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const toggleLabelStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#4b5563',
    marginRight: '0.5rem',
  };

  const toggleSwitchStyle = (isActive: boolean) => ({
    width: '2.75rem',
    height: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '9999px',
    padding: '0.25rem',
    transition: 'background-color 0.2s',
    backgroundColor: isActive ? '#3b82f6' : '#d1d5db',
    cursor: 'pointer',
  });

  const toggleKnobStyle = (isActive: boolean) => ({
    backgroundColor: 'white',
    width: '1rem',
    height: '1rem',
    borderRadius: '9999px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transform: isActive ? 'translateX(1.25rem)' : 'translateX(0)',
    transition: 'transform 0.2s',
  });

  const notificationItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  };

  const notificationTextWrapperStyle = {
    flex: 1,
  };

  const notificationTitleStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#4b5563',
  };

  const notificationDescStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
  };

  const buttonStyle = (colorScheme: 'blue' | 'red') => ({
    padding: '0.5rem 1rem',
    backgroundColor: colorScheme === 'blue' ? '#3b82f6' : '#ef4444',
    color: 'white',
    borderRadius: '0.375rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginRight: colorScheme === 'blue' ? '1rem' : 0,
  });

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>{t('settings')}</h1>
      
      <div style={cardStyle}>
        {/* Language Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('language')}</h2>
          <div style={languageGridStyle}>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              style={languageButtonStyle(language === 'en')}
            >
              <span style={{ marginRight: '0.5rem' }}>🇺🇸</span> English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('es')}
              style={languageButtonStyle(language === 'es')}
            >
              <span style={{ marginRight: '0.5rem' }}>🇪🇸</span> Español
            </button>
          </div>
        </div>
        
        {/* Theme Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('theme')}</h2>
          <div style={toggleWrapperStyle}>
            <span style={toggleLabelStyle}>{t('dark_mode')}</span>
            <button 
              type="button"
              onClick={handleDarkModeToggle}
              style={toggleSwitchStyle(darkMode)}
            >
              <span style={toggleKnobStyle(darkMode)} />
            </button>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('notifications')}</h2>
          <div>
            <div style={notificationItemStyle}>
              <div style={notificationTextWrapperStyle}>
                <h3 style={notificationTitleStyle}>{t('email_notifications')}</h3>
                <p style={notificationDescStyle}>{t('email_notifications_desc')}</p>
              </div>
              <button 
                type="button"
                onClick={() => handleNotificationChange('email')}
                style={toggleSwitchStyle(notifications.email)}
              >
                <span style={toggleKnobStyle(notifications.email)} />
              </button>
            </div>
            <div style={notificationItemStyle}>
              <div style={notificationTextWrapperStyle}>
                <h3 style={notificationTitleStyle}>{t('sms_notifications')}</h3>
                <p style={notificationDescStyle}>{t('sms_notifications_desc')}</p>
              </div>
              <button 
                type="button"
                onClick={() => handleNotificationChange('sms')}
                style={toggleSwitchStyle(notifications.sms)}
              >
                <span style={toggleKnobStyle(notifications.sms)} />
              </button>
            </div>
            <div style={notificationItemStyle}>
              <div style={notificationTextWrapperStyle}>
                <h3 style={notificationTitleStyle}>{t('app_notifications')}</h3>
                <p style={notificationDescStyle}>{t('app_notifications_desc')}</p>
              </div>
              <button 
                type="button"
                onClick={() => handleNotificationChange('app')}
                style={toggleSwitchStyle(notifications.app)}
              >
                <span style={toggleKnobStyle(notifications.app)} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Account Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('account')}</h2>
          <div style={{ marginTop: '0.75rem' }}>
            <button 
              type="button" 
              style={buttonStyle('blue')}
            >
              {t('change_password')}
            </button>
            <button 
              type="button" 
              style={buttonStyle('red')}
            >
              {t('delete_account')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 