import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import LoadingScreen from './components/common/Loading/LoadingScreen';
import './i18n/i18n';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load routes
const AppRoutes = lazy(() => import('./routes/routes'));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <div className="h-full w-full">
              <AppRoutes />
            </div>
          </Suspense>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
