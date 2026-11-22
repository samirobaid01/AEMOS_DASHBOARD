import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Activity,
  Building2,
  Map,
  Thermometer,
  Cpu,
  Zap,
  Settings,
  Leaf,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { clearCredentials, selectCurrentUser } from '../../state/slices/auth.slice';
import OrganizationSelector from '../common/OrganizationSelector/OrganizationSelector';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

  const navigation: NavItem[] = [
    { name: t('navigation.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('navigation.telemetry'), path: '/telemetry', icon: Activity },
    { name: t('navigation.organizations'), path: '/organizations', icon: Building2 },
    { name: t('navigation.areas'), path: '/areas', icon: Map },
    { name: t('navigation.sensors'), path: '/sensors', icon: Thermometer },
    { name: t('navigation.devices'), path: '/devices', icon: Cpu },
    { name: t('navigation.rules'), path: '/rule-engine', icon: Zap },
    { name: t('navigation.settings'), path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-textPrimary dark:text-textPrimary-dark">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      {/* Sidebar rail */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 z-40 flex flex-col bg-card dark:bg-card-dark border-r border-border dark:border-border-dark transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-border dark:border-border-dark">
          <div className="w-9 h-9 rounded-lg bg-leaf-600 text-white grid place-items-center shrink-0">
            <Leaf className="w-5 h-5" aria-hidden />
          </div>
          <h1 className="text-base font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark">
            AEMOS <span className="text-leaf-600 dark:text-leaf-400 font-semibold">Agri</span>
          </h1>
          <button
            type="button"
            aria-label={t('common.close', { defaultValue: 'Close' })}
            className="ml-auto md:hidden grid place-items-center w-9 h-9 rounded-lg text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  active
                    ? 'bg-leaf-600 text-white shadow-sm'
                    : 'text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark hover:text-textPrimary dark:hover:text-textPrimary-dark'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / logout */}
        <div className="border-t border-border dark:border-border-dark p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-leaf-600 text-white flex items-center justify-center font-semibold shrink-0">
              {getInitial(user?.userName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-textPrimary dark:text-textPrimary-dark truncate">
                {user?.userName || user?.email || 'User'}
              </p>
            </div>
            <button
              type="button"
              aria-label={t('auth.logout')}
              title={t('auth.logout')}
              className="grid place-items-center w-9 h-9 rounded-lg text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark hover:text-danger dark:hover:text-danger-dark transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" aria-hidden />
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="min-h-screen md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 h-16 px-4 md:px-6 bg-card/80 dark:bg-card-dark/80 backdrop-blur border-b border-border dark:border-border-dark">
          <button
            type="button"
            aria-label={t('common.menu', { defaultValue: 'Menu' })}
            className="md:hidden grid place-items-center w-10 h-10 -ml-1 rounded-lg text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" aria-hidden />
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-md bg-leaf-600 text-white grid place-items-center shrink-0">
              <Leaf className="w-4 h-4" aria-hidden />
            </div>
            <span className="text-sm font-bold text-textPrimary dark:text-textPrimary-dark">AEMOS</span>
          </div>

          <div className="ml-auto flex items-center">
            <OrganizationSelector />
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
