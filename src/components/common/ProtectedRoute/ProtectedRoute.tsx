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

  // Helper to safely get component name
  const getComponentName = () => {
    if (React.isValidElement(children)) {
      const type = children.type;
      if (typeof type === 'function') {
        return type.name || 'UnnamedComponent';
      }
    }
    return 'Unknown';
  };

  console.log('ProtectedRoute: Starting permission check', {
    path: location.pathname,
    requiredPermission,
    requiredPermissions,
    anyPermission,
    component: getComponentName()
  });

  // System admins always have access
  if (isSystemAdmin()) {
    console.log('ProtectedRoute: User is system admin, granting access');
    return <>{children}</>;
  }

  // Check permissions
  let hasAccess = true;

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
    console.log(`ProtectedRoute: Checking single permission '${requiredPermission}'`, {
      hasAccess,
      path: location.pathname,
      component: getComponentName()
    });
  } else if (requiredPermissions.length > 0) {
    hasAccess = anyPermission 
      ? hasAnyPermission(requiredPermissions)
      : hasAllPermissions(requiredPermissions);
    console.log(`ProtectedRoute: Checking ${anyPermission ? 'any' : 'all'} permissions`, {
      hasAccess,
      requiredPermissions,
      path: location.pathname,
      component: getComponentName()
    });
  }

  // Render children if user has access, otherwise redirect
  if (hasAccess) {
    console.log('ProtectedRoute: Access granted, rendering children', {
      path: location.pathname,
      component: getComponentName()
    });
    return <>{children}</>;
  } else {
    console.log(`ProtectedRoute: Access denied, redirecting to ${fallbackPath}`, {
      path: location.pathname,
      component: getComponentName()
    });
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;

 