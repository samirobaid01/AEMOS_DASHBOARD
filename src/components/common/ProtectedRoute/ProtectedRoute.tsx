import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import usePermissions from '../../../hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  anyPermission?: boolean;
  fallbackPath?: string;
}

/**
 * ProtectedRoute component that checks user permissions before rendering children
 * 
 * @param children The component to render if user has permission
 * @param requiredPermission Single permission required to access the route
 * @param requiredPermissions Array of permissions required to access the route
 * @param anyPermission If true, user only needs one of the requiredPermissions (OR logic)
 *                     If false, user needs all requiredPermissions (AND logic)
 * @param fallbackPath Path to redirect to if not authorized, defaults to /dashboard
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  anyPermission = false,
  fallbackPath = '/dashboard'
}) => {
  const location = useLocation();
  const { hasPermission, hasAnyPermission, hasAllPermissions, isSystemAdmin } = usePermissions();

  console.log('ProtectedRoute: Checking permissions');
  console.log('ProtectedRoute: Current path =', location.pathname);
  console.log('ProtectedRoute: requiredPermission =', requiredPermission);
  console.log('ProtectedRoute: requiredPermissions =', requiredPermissions);
  console.log('ProtectedRoute: anyPermission =', anyPermission);

  // System admins always have access
  if (isSystemAdmin()) {
    console.log('ProtectedRoute: User is system admin, granting access');
    return <>{children}</>;
  }

  // Check permissions
  let hasAccess = true;

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
    console.log(`ProtectedRoute: Checking single permission '${requiredPermission}', hasAccess = ${hasAccess}`);
  } else if (requiredPermissions.length > 0) {
    hasAccess = anyPermission 
      ? hasAnyPermission(requiredPermissions)
      : hasAllPermissions(requiredPermissions);
    console.log(`ProtectedRoute: Checking ${anyPermission ? 'any' : 'all'} permissions, hasAccess = ${hasAccess}`);
  }

  // Render children if user has access, otherwise redirect
  if (hasAccess) {
    console.log('ProtectedRoute: Access granted, rendering children');
    return <>{children}</>;
  } else {
    console.log(`ProtectedRoute: Access denied, redirecting to ${fallbackPath}`);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;

 