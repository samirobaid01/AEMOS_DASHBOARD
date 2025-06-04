import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import LoadingScreen from './components/common/Loading/LoadingScreen';
import './i18n/i18n';
import { ThemeProvider } from './context/ThemeContext';
import { WalkthroughProvider } from './context/WalkthroughContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load routes
const AppRoutes = lazy(() => import('./routes/routes'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <WalkthroughProvider>
            <Router>
              <Suspense fallback={<LoadingScreen />}>
                <div className="h-full w-full">
                  <AppRoutes />
                </div>
              </Suspense>
            </Router>
          </WalkthroughProvider>
        </ThemeProvider>
        <ToastContainer />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
