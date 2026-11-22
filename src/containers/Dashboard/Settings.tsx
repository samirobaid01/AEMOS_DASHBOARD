import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Languages, Moon, Compass, Bell, UserCog } from 'lucide-react';
import i18n from '../../i18n/i18n';
import { useTheme } from '../../context/ThemeContext';
import { useWalkthrough } from '../../context/WalkthroughContext';
import Toggle from '../../components/common/Toggle';
import Button from '../../components/common/Button/Button';

const Settings = () => {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { isWalkthroughEnabled, toggleWalkthroughEnabled, resetCompletedWalkthroughs } = useWalkthrough();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true,
  });

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const notificationRows: { key: keyof typeof notifications; title: string; desc: string }[] = [
    { key: 'email', title: t('email_notifications'), desc: t('email_notifications_desc') },
    { key: 'sms', title: t('sms_notifications'), desc: t('sms_notifications_desc') },
    { key: 'app', title: t('app_notifications'), desc: t('app_notifications_desc') },
  ];

  const sectionClass = 'p-6 border-b border-border dark:border-border-dark last:border-0';
  const sectionTitleClass = 'flex items-center gap-2 text-base font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0';

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark min-h-[calc(100vh-60px)]">
      <div className="w-full">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
            <SettingsIcon className="w-5 h-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0">
              {t('settings.title')}
            </h1>
            <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mt-0.5">
              {t('settings.subtitle', { defaultValue: 'Manage your preferences and account' })}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          {/* Language */}
          <div className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Languages className="w-4 h-4 text-textMuted dark:text-textMuted-dark" aria-hidden />
              {t('language')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button type="button" variant={language === 'en' ? 'primary' : 'secondary'} onClick={() => handleLanguageChange('en')}>
                <span className="mr-2">🇺🇸</span> English
              </Button>
              <Button type="button" variant={language === 'es' ? 'primary' : 'secondary'} onClick={() => handleLanguageChange('es')}>
                <span className="mr-2">🇪🇸</span> Español
              </Button>
            </div>
          </div>

          {/* Theme */}
          <div className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Moon className="w-4 h-4 text-textMuted dark:text-textMuted-dark" aria-hidden />
              {t('theme')}
            </h2>
            <Toggle label={t('dark_mode')} isChecked={darkMode} onChange={toggleDarkMode} />
          </div>

          {/* Walkthrough */}
          <div className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Compass className="w-4 h-4 text-textMuted dark:text-textMuted-dark" aria-hidden />
              {t('walkthrough')}
            </h2>
            <Toggle
              label={t('enable_walkthrough')}
              isChecked={isWalkthroughEnabled}
              onChange={toggleWalkthroughEnabled}
              helperText={t('walkthrough_description')}
            />
            <div className="mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  resetCompletedWalkthroughs();
                  alert('Walkthroughs have been reset. You will see them again on your next visit.');
                }}
              >
                {t('settings.resetWalkthroughs', { defaultValue: 'Reset Walkthroughs' })}
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Bell className="w-4 h-4 text-textMuted dark:text-textMuted-dark" aria-hidden />
              {t('notifications')}
            </h2>
            <div className="flex flex-col gap-5">
              {notificationRows.map((row) => (
                <div key={row.key} className="flex justify-between items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark">{row.title}</div>
                    <div className="text-sm text-textMuted dark:text-textMuted-dark mt-1">{row.desc}</div>
                  </div>
                  <Toggle isChecked={notifications[row.key]} onChange={() => handleNotificationChange(row.key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <UserCog className="w-4 h-4 text-textMuted dark:text-textMuted-dark" aria-hidden />
              {t('account')}
            </h2>
            <div className="mt-1 flex gap-3 flex-wrap">
              <Button type="button" variant="secondary">{t('change_password')}</Button>
              <Button type="button" variant="danger">{t('delete_account')}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
