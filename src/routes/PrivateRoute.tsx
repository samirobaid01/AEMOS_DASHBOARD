import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../state/slices/auth.slice';
import type { ReactNode } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

interface PrivateRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  anyPermission?: boolean;
}

const PrivateRoute = ({ 
  children, 
  requiredPermission, 
  requiredPermissions,
  anyPermission
}: PrivateRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  console.log('PrivateRoute: Checking authentication');
  console.log('PrivateRoute: isAuthenticated =', isAuthenticated);
  console.log('PrivateRoute: requiredPermission =', requiredPermission);
  console.log('PrivateRoute: requiredPermissions =', requiredPermissions);
  console.log('PrivateRoute: anyPermission =', anyPermission);
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    console.log('PrivateRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // If permissions are specified, use the ProtectedRoute component
  if (requiredPermission || (requiredPermissions && requiredPermissions.length > 0)) {
    console.log('PrivateRoute: Using ProtectedRoute for permission checking');
    return (
      <MainLayout>
        <ProtectedRoute
          requiredPermission={requiredPermission}
          requiredPermissions={requiredPermissions}
          anyPermission={anyPermission}
        >
          {children}
        </ProtectedRoute>
      </MainLayout>
    );
  }
  
  // Otherwise, just render the children
  console.log('PrivateRoute: No permissions required, rendering children directly');
  return <MainLayout>{children}</MainLayout>;
};

export default PrivateRoute; 