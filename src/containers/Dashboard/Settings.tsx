import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../state/store';
import i18n from '../../i18n/i18n';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true
  });

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

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t('settings')}</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden divide-y divide-gray-200">
        {/* Language Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('language')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-md flex items-center ${
                language === 'en' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">🇺🇸</span> English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('es')}
              className={`px-4 py-2 rounded-md flex items-center ${
                language === 'es' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">🇪🇸</span> Español
            </button>
          </div>
        </div>
        
        {/* Theme Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('theme')}</h2>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">{t('dark_mode')}</span>
            <button 
              type="button"
              onClick={handleDarkModeToggle}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                darkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span 
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('notifications')}</h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">{t('email_notifications')}</h3>
                <p className="text-sm text-gray-500">{t('email_notifications_desc')}</p>
              </div>
              <button 
                type="button"
                onClick={() => handleNotificationChange('email')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.email ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">{t('sms_notifications')}</h3>
                <p className="text-sm text-gray-500">{t('sms_notifications_desc')}</p>
              </div>
              <button 
                type="button"
                onClick={() => handleNotificationChange('sms')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.sms ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.sms ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">{t('app_notifications')}</h3>
                <p className="text-sm text-gray-500">{t('app_notifications_desc')}</p>
              </div>
              <button 
                type="button"
                onClick={() => handleNotificationChange('app')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.app ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.app ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
            </li>
          </ul>
        </div>
        
        {/* Account Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('account')}</h2>
          <div className="space-y-3">
            <button 
              type="button" 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('change_password')}
            </button>
            <button 
              type="button" 
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-4"
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