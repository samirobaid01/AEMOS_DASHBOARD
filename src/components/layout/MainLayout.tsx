import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clearCredentials, selectCurrentUser } from '../../state/slices/auth.slice';
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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    { name: t('navigation.telemetry'), path: '/telemetry', icon: '📊' },
    { name: t('navigation.organizations'), path: '/organizations', icon: '🚜' },
    { name: t('navigation.areas'), path: '/areas', icon: '🌾' },
    { name: t('navigation.sensors'), path: '/sensors', icon: '🌡️' },
    { name: t('navigation.devices'), path: '/devices', icon: '📡' },
    { name: t('navigation.rules'), path: '/rule-engine', icon: '⚡' },
    { name: t('navigation.settings'), path: '/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-textPrimary dark:text-textPrimary-dark">
      <div
        className={`fixed inset-0 bg-black/50 z-30 ${isMobile && sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] bg-card dark:bg-card-dark shadow-md z-40 border-r border-border dark:border-border-dark transition-transform duration-300 ease-in-out ${
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-border dark:border-border-dark">
            <span className="text-2xl mr-3">🌿</span>
            <h1 className="text-lg font-bold text-leaf-800 dark:text-leaf-200">
              AEMOS <span className="text-warning dark:text-warning-dark">Agriculture</span>
            </h1>
            {isMobile && (
              <Button
                type="button"
                variant="secondary"
                className="ml-auto p-2 min-w-0 text-textSecondary dark:text-textSecondary-dark"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-5 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center py-3 px-4 rounded-lg mb-2 font-medium no-underline transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark'
                }`}
              >
                <span className="mr-3 text-xl w-7 h-7 flex items-center justify-center">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border dark:border-border-dark p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-dark text-white flex items-center justify-center font-bold text-lg shrink-0">
                {getInitial(user?.userName)}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark truncate max-w-[160px]">
                  {user?.userName || user?.email || 'User'}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-1 text-sm font-medium text-primary dark:text-primary-dark bg-transparent border-0 p-0 min-w-0 hover:bg-transparent"
                  onClick={handleLogout}
                >
                  <svg className="mr-1 w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('auth.logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`min-h-screen transition-[padding] duration-300 ${
          isMobile ? 'pl-0' : 'pl-[260px]'
        } bg-background dark:bg-background-dark`}
      >
        {isMobile && (
          <header className="flex items-center h-16 bg-card dark:bg-card-dark shadow sticky top-0 z-10 text-textPrimary dark:text-textPrimary-dark">
            <Button
              type="button"
              variant="secondary"
              className="p-4 min-w-0 text-textSecondary dark:text-textSecondary-dark"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <div className="flex items-center justify-center flex-1">
              <span className="text-xl mr-2">🌿</span>
              <h1 className="text-base font-bold text-leaf-800 dark:text-leaf-200">
                AEMOS <span className="text-warning dark:text-warning-dark">Agriculture</span>
              </h1>
            </div>
            <div className="px-4">
              <OrganizationSelector />
            </div>
          </header>
        )}

        {!isMobile && (
          <div className="flex items-center justify-end h-16 pr-8 sticky top-0 z-10 bg-transparent">
            <OrganizationSelector />
          </div>
        )}

        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
