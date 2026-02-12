import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../state/store';
import i18n from '../../i18n/i18n';
import { useTheme } from '../../context/ThemeContext';
import { useWalkthrough } from '../../context/WalkthroughContext';
import Toggle from '../../components/common/Toggle';
import Button from '../../components/common/Button/Button';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const { isWalkthroughEnabled, toggleWalkthroughEnabled, resetCompletedWalkthroughs } = useWalkthrough();
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

  // Theme styles based on dark mode
  const getThemeStyles = () => {
    return {
      containerStyle: {
        padding: '1.5rem 1rem',
        backgroundColor: darkMode ? '#111827' : '#f0f9f0',
        color: darkMode ? '#f9fafb' : '#1f2937',
      },
      headerStyle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: darkMode ? '#f9fafb' : '#1f2937',
        marginBottom: '1.5rem',
      },
      cardStyle: {
        backgroundColor: darkMode ? '#1f2937' : 'white',
        boxShadow: darkMode 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      },
      sectionStyle: {
        padding: '1.5rem',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      },
      sectionTitleStyle: {
        fontSize: '1.125rem',
        fontWeight: 500,
        color: darkMode ? '#f9fafb' : '#1f2937',
        marginBottom: '1rem',
      },
    };
  };

  const styles = getThemeStyles();

  const languageGridStyle = {
    display: 'grid',
    gridTemplateColumns: windowWidth >= 640 ? 'repeat(2, 1fr)' : '1fr',
    gap: '1rem',
  };

  return (
    <div style={styles.containerStyle}>
      <h1 style={styles.headerStyle}>{t('settings.title')}</h1>
      
      <div style={styles.cardStyle}>
        {/* Language Section */}
        <div style={styles.sectionStyle}>
          <h2 style={styles.sectionTitleStyle}>{t('language')}</h2>
          <div style={languageGridStyle}>
            <Button
              type="button"
              variant={language === 'en' ? 'primary' : 'secondary'}
              onClick={() => handleLanguageChange('en')}
            >
              <span style={{ marginRight: '0.5rem' }}>🇺🇸</span> English
            </Button>
            <Button
              type="button"
              variant={language === 'es' ? 'primary' : 'secondary'}
              onClick={() => handleLanguageChange('es')}
            >
              <span style={{ marginRight: '0.5rem' }}>🇪🇸</span> Español
            </Button>
          </div>
        </div>
        
        {/* Theme Section */}
        <div style={styles.sectionStyle}>
          <h2 style={styles.sectionTitleStyle}>{t('theme')}</h2>
          <Toggle
            label={t('dark_mode')}
            isChecked={darkMode}
            onChange={toggleDarkMode}
          />
        </div>
        
        {/* Walkthrough Section */}
        <div style={styles.sectionStyle}>
          <h2 style={styles.sectionTitleStyle}>{t('walkthrough')}</h2>
          <Toggle
            label={t('enable_walkthrough')}
            isChecked={isWalkthroughEnabled}
            onChange={toggleWalkthroughEnabled}
            helperText={t('walkthrough_description')}
          />
          <div style={{ marginTop: '1rem' }}>
            <Button
              type="button"
              onClick={() => {
                resetCompletedWalkthroughs();
                alert('Walkthroughs have been reset. You will see them again on your next visit.');
              }}
            >
              Reset Walkthroughs
            </Button>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div style={styles.sectionStyle}>
          <h2 style={styles.sectionTitleStyle}>{t('notifications')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? '#d1d5db' : '#4b5563' }}>
                  {t('email_notifications')}
                </div>
                <div style={{ fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
                  {t('email_notifications_desc')}
                </div>
              </div>
              <Toggle isChecked={notifications.email} onChange={() => handleNotificationChange('email')} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? '#d1d5db' : '#4b5563' }}>
                  {t('sms_notifications')}
                </div>
                <div style={{ fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
                  {t('sms_notifications_desc')}
                </div>
              </div>
              <Toggle isChecked={notifications.sms} onChange={() => handleNotificationChange('sms')} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: darkMode ? '#d1d5db' : '#4b5563' }}>
                  {t('app_notifications')}
                </div>
                <div style={{ fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
                  {t('app_notifications_desc')}
                </div>
              </div>
              <Toggle isChecked={notifications.app} onChange={() => handleNotificationChange('app')} />
            </div>
          </div>
        </div>
        
        {/* Account Section */}
        <div style={styles.sectionStyle}>
          <h2 style={styles.sectionTitleStyle}>{t('account')}</h2>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button type="button">
              {t('change_password')}
            </Button>
            <Button type="button" variant="danger">
              {t('delete_account')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 