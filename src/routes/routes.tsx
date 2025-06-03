import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Lazy load components
import { lazy, Suspense } from 'react';
import LoadingScreen from '../components/common/Loading/LoadingScreen';

// Debug Tools
const SocketTester = lazy(() => import('../components/common/SocketTester'));
const DeviceStateTest = lazy(() => import('../components/common/DeviceStateTest'));

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

// Rule Engine
const RuleList = lazy(() => import('../containers/RuleEngine/RuleList'));
const RuleCreate = lazy(() => import('../containers/RuleEngine/RuleCreate'));
const RuleEdit = lazy(() => import('../containers/RuleEngine/RuleEdit'));
const RuleDetails = lazy(() => import('../containers/RuleEngine/RuleDetails'));

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
            <PrivateRoute requiredPermission="organization.view">
              <OrganizationList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/organizations/create"
          element={
            <PrivateRoute requiredPermission="organization.create">
              <OrganizationCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/organizations/:id"
          element={
            <PrivateRoute requiredPermission="organization.view">
              <OrganizationDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/organizations/:id/edit"
          element={
            <PrivateRoute requiredPermission="organization.update">
              <OrganizationEdit />
            </PrivateRoute>
          }
        />
        
        {/* Areas */}
        <Route
          path="/areas"
          element={
            <PrivateRoute requiredPermission="area.view">
              <AreaList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/areas/create"
          element={
            <PrivateRoute requiredPermission="area.create">
              <AreaCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/areas/:id"
          element={
            <PrivateRoute requiredPermission="area.view">
              <AreaDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/areas/:id/edit"
          element={
            <PrivateRoute requiredPermission="area.update">
              <AreaEdit />
            </PrivateRoute>
          }
        />
        
        {/* Sensors */}
        <Route
          path="/sensors"
          element={
            <PrivateRoute requiredPermission="sensor.view">
              <SensorList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/sensors/create"
          element={
            <PrivateRoute requiredPermission="sensor.create">
              <SensorCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/sensors/:id"
          element={
            <PrivateRoute requiredPermission="sensor.view">
              <SensorDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/sensors/:id/edit"
          element={
            <PrivateRoute requiredPermission="sensor.update">
              <SensorEdit />
            </PrivateRoute>
          }
        />
        
        {/* Devices */}
        <Route
          path="/devices"
          element={
            <PrivateRoute requiredPermission="device.view">
              <DeviceList />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/devices/create"
          element={
            <PrivateRoute requiredPermission="device.create">
              <DeviceCreate />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/devices/:id"
          element={
            <PrivateRoute requiredPermission="device.view">
              <DeviceDetails />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/devices/:id/edit"
          element={
            <PrivateRoute requiredPermission="device.update">
              <DeviceEdit />
            </PrivateRoute>
          }
        />

        {/* Rule Engine */}
        <Route
          path="/rule-engine"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PrivateRoute requiredPermission="rule.view">
                <RuleList />
              </PrivateRoute>
            </Suspense>
          }
        />
        
        <Route
          path="/rule-engine/create"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PrivateRoute requiredPermission="rule.create">
                <RuleCreate />
              </PrivateRoute>
            </Suspense>
          }
        />
        
        <Route
          path="/rule-engine/:id"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PrivateRoute requiredPermission="rule.view">
                <RuleDetails />
              </PrivateRoute>
            </Suspense>
          }
        />
        
        <Route
          path="/rule-engine/:id/edit"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PrivateRoute requiredPermission="rule.update">
                <RuleEdit />
              </PrivateRoute>
            </Suspense>
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
        
        {/* Debug Tools */}
        <Route
          path="/debug/socket-tester"
          element={
            <PrivateRoute>
              <SocketTester />
            </PrivateRoute>
          }
        />
        <Route
          path="/debug/device-state-test"
          element={
            <PrivateRoute>
              <DeviceStateTest />
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