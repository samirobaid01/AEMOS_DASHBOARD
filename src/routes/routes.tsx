import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Lazy load components
import { lazy, Suspense } from 'react';
import LoadingScreen from '../components/common/Loading/LoadingScreen';

// Auth
const Login = lazy(() => import('../containers/Auth/Login'));
const Signup = lazy(() => import('../containers/Auth/Signup'));
const ForgotPassword = lazy(() => import('../containers/Auth/ForgotPassword'));

// Dashboard
const Dashboard = lazy(() => import('../containers/Dashboard/Dashboard'));

// Organizations
const OrganizationList = lazy(() => import('../containers/Organizations/OrganizationList'));
const OrganizationCreate = lazy(() => import('../containers/Organizations/OrganizationCreate'));
const OrganizationEdit = lazy(() => import('../containers/Organizations/OrganizationEdit'));
const OrganizationDetails = lazy(() => import('../containers/Organizations/OrganizationDetails'));

// Areas
const AreaList = lazy(() => import('../containers/Areas/AreaList'));
const AreaCreate = lazy(() => import('../containers/Areas/AreaCreate'));
const AreaEdit = lazy(() => import('../containers/Areas/AreaEdit'));
const AreaDetails = lazy(() => import('../containers/Areas/AreaDetails'));

// Sensors
const SensorList = lazy(() => import('../containers/Sensors/SensorList'));
const SensorCreate = lazy(() => import('../containers/Sensors/SensorCreate'));
const SensorEdit = lazy(() => import('../containers/Sensors/SensorEdit'));
const SensorDetails = lazy(() => import('../containers/Sensors/SensorDetails'));

// Devices
const DeviceList = lazy(() => import('../containers/Devices/DeviceList'));
const DeviceCreate = lazy(() => import('../containers/Devices/DeviceCreate'));
const DeviceEdit = lazy(() => import('../containers/Devices/DeviceEdit'));
const DeviceDetails = lazy(() => import('../containers/Devices/DeviceDetails'));

// Profile and Settings
const Profile = lazy(() => import('../containers/Auth/Profile'));
const Settings = lazy(() => import('../containers/Dashboard/Settings'));

// Error pages
const NotFound = lazy(() => import('../components/common/Error/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* Organizations */}
        <Route
          path="/organizations"
          element={
            <PrivateRoute>
              <OrganizationList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/organizations/create"
          element={
            <PrivateRoute>
              <OrganizationCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/organizations/:id"
          element={
            <PrivateRoute>
              <OrganizationDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/organizations/:id/edit"
          element={
            <PrivateRoute>
              <OrganizationEdit />
            </PrivateRoute>
          }
        />
        
        {/* Areas */}
        <Route
          path="/areas"
          element={
            <PrivateRoute>
              <AreaList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/areas/create"
          element={
            <PrivateRoute>
              <AreaCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/areas/:id"
          element={
            <PrivateRoute>
              <AreaDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/areas/:id/edit"
          element={
            <PrivateRoute>
              <AreaEdit />
            </PrivateRoute>
          }
        />
        
        {/* Sensors */}
        <Route
          path="/sensors"
          element={
            <PrivateRoute>
              <SensorList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/sensors/create"
          element={
            <PrivateRoute>
              <SensorCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/sensors/:id"
          element={
            <PrivateRoute>
              <SensorDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/sensors/:id/edit"
          element={
            <PrivateRoute>
              <SensorEdit />
            </PrivateRoute>
          }
        />
        
        {/* Devices */}
        <Route
          path="/devices"
          element={
            <PrivateRoute>
              <DeviceList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/devices/create"
          element={
            <PrivateRoute>
              <DeviceCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/devices/:id"
          element={
            <PrivateRoute>
              <DeviceDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/devices/:id/edit"
          element={
            <PrivateRoute>
              <DeviceEdit />
            </PrivateRoute>
          }
        />
        
        {/* Profile and Settings */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 