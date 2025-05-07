import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);

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
    { name: t('dashboard'), path: '/dashboard', icon: '🌱' },
    { name: t('organizations'), path: '/organizations', icon: '🚜' },
    { name: t('areas'), path: '/areas', icon: '🌾' },
    { name: t('sensors'), path: '/sensors', icon: '🌡️' },
    { name: t('devices'), path: '/devices', icon: '📡' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-leaf-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-soil-800 bg-opacity-75 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-5 border-b border-leaf-100">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌿</span>
              <h1 className="text-xl font-bold text-leaf-600">AEMOS <span className="text-wheat-500">Agriculture</span></h1>
            </div>
            <button
              type="button"
              className="text-soil-500 hover:text-soil-700"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 space-y-1 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg transition duration-200 ${
                    isActive(item.path)
                      ? 'bg-leaf-500 text-white'
                      : 'text-soil-700 hover:bg-leaf-50 hover:text-leaf-600'
                  }`}
                >
                  <span className={`mr-4 h-6 w-6 flex items-center justify-center text-xl ${
                    isActive(item.path) ? 'text-white' : 'text-leaf-500'
                  }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-leaf-100 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-leaf-600 flex items-center justify-center text-white text-lg font-bold">
                  {getInitial(user?.userName)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-soil-800 truncate max-w-[180px]">
                  {user?.userName || user?.email || 'User'}
                </p>
                <button
                  type="button"
                  className="mt-1 text-sm font-medium text-leaf-600 hover:text-leaf-700 flex items-center"
                  onClick={handleLogout}
                >
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('sign_out')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-xl">
          <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-leaf-100 px-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌿</span>
              <h1 className="text-xl font-bold text-leaf-600">AEMOS <span className="text-wheat-500">Agriculture</span></h1>
            </div>
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-2 flex-1 space-y-1 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition duration-200 ${
                    isActive(item.path)
                      ? 'bg-leaf-500 text-white'
                      : 'text-soil-700 hover:bg-leaf-50 hover:text-leaf-600'
                  }`}
                >
                  <span className={`mr-3 h-6 w-6 flex items-center justify-center text-xl ${
                    isActive(item.path) ? 'text-white' : 'text-leaf-500'
                  }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex flex-shrink-0 border-t border-leaf-100 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-leaf-600 flex items-center justify-center text-white text-lg font-bold">
                  {getInitial(user?.userName)}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-soil-800 truncate">
                  {user?.userName || user?.email || 'User'}
                </p>
                <button
                  type="button"
                  className="mt-1 text-xs font-medium text-leaf-600 hover:text-leaf-700 flex items-center"
                  onClick={handleLogout}
                >
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('sign_out')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm md:hidden">
          <button
            type="button"
            className="border-r border-leaf-100 px-4 text-soil-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-leaf-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">{t('open_sidebar')}</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌿</span>
              <h1 className="text-lg font-bold text-leaf-600">AEMOS <span className="text-wheat-500">Agriculture</span></h1>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-leaf-50">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <div className="bg-white p-6 rounded-xl shadow-soft border border-leaf-100">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 