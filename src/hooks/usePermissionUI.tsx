import React, { ReactNode } from 'react';
import { usePermissions } from './usePermissions';

/**
 * Hook to control UI elements based on user permissions
 */
export const usePermissionUI = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isSystemAdmin } = usePermissions();

  /**
   * Component to conditionally render children based on permission
   */
  const PermissionGuard: React.FC<{
    permission?: string;
    permissions?: string[];
    anyPermission?: boolean;
    children: ReactNode;
    fallback?: ReactNode;
  }> = ({ 
    permission, 
    permissions, 
    anyPermission = false,
    children,
    fallback = null 
  }) => {
    // System admins always have access
    if (isSystemAdmin()) {
      return <>{children}</>;
    }

    let hasAccess = true;

    if (permission) {
      hasAccess = hasPermission(permission);
    } else if (permissions && permissions.length > 0) {
      hasAccess = anyPermission 
        ? hasAnyPermission(permissions)
        : hasAllPermissions(permissions);
    }

    return hasAccess ? <>{children}</> : <>{fallback}</>;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSystemAdmin,
    PermissionGuard
  };
};

export default usePermissionUI; 