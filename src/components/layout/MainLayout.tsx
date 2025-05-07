import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../state/store';
import { clearCredentials, selectCurrentUser } from '../../state/slices/auth.slice';
import type { User } from '../../types/auth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const navigation = [
    { name: t('dashboard'), path: '/dashboard', icon: '📊' },
    { name: t('organizations'), path: '/organizations', icon: '🏢' },
    { name: t('areas'), path: '/areas', icon: '📍' },
    { name: t('sensors'), path: '/sensors', icon: '🔌' },
    { name: t('devices'), path: '/devices', icon: '📱' },
  ];

  const userNavigation = [
    { name: t('profile'), path: '/profile' },
    { name: t('settings'), path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center px-4">
                <h1 className="text-xl font-bold text-blue-600">AEMOS</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group flex items-center px-2 py-3 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-4 h-6 w-6 text-center">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div className="inline-block h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.userName || ''} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-xl font-medium">
                        {getInitial(user?.userName)}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.userName || user?.email || 'User'}
                    </p>
                    <button
                      type="button"
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      {t('sign_out')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:flex md:flex-col md:w-64 md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">AEMOS</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <span className="mr-3 h-6 w-6 text-center">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="inline-block h-9 w-9 rounded-full bg-gray-100 overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.userName || ''} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-lg font-medium">
                      {getInitial(user?.userName)}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.userName || user?.email || 'User'}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    {t('sign_out')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">{t('open_sidebar')}</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 