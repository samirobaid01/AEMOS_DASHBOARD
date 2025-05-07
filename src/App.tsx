import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import LoadingScreen from './components/common/Loading/LoadingScreen';
import './i18n/i18n';

// Lazy load routes
const AppRoutes = lazy(() => import('./routes/routes'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <div className="min-h-screen bg-leaf-50">
            <AppRoutes />
          </div>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
