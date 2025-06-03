import { useSelector } from 'react-redux';
import { selectCurrentUser, selectSelectedOrganizationId } from '../state/slices/auth.slice';
import type { RootState } from '../state/store';
import { createSelector } from '@reduxjs/toolkit';

// Memoized selector for permissions
const selectPermissions = createSelector(
  [(state: RootState) => state.auth.permissions],
  (permissions) => permissions || []
);

export const usePermissions = () => {
  const user = useSelector(selectCurrentUser);
  const selectedOrganizationId = useSelector(selectSelectedOrganizationId);
  const permissions = useSelector(selectPermissions);

  console.log('usePermissions: Checking permissions', {
    availablePermissions: permissions,
    userPermissions: user?.permissions
  });

  /**
   * Check if the user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    const result = permissions.includes(permission);
    console.log(`usePermissions: Checking permission '${permission}', result: ${result}`);
    return result;
  };

  /**
   * Check if the user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    const result = permissions.some(permission => hasPermission(permission));
    console.log(`usePermissions: Checking any permissions [${permissions.join(', ')}], result: ${result}`);
    return result;
  };

  /**
   * Check if the user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    const result = permissions.every(permission => hasPermission(permission));
    console.log(`usePermissions: Checking all permissions [${permissions.join(', ')}], result: ${result}`);
    return result;
  };

  /**
   * Check if the user is a System Admin
   */
  const isSystemAdmin = (): boolean => {
    if (!user || !user.roles) {
      return false;
    }
    const result = user.roles.includes('SystemAdmin');
    console.log(`usePermissions: Checking if system admin, result: ${result}`);
    return result;
  };

  /**
   * Get the current selected organization ID
   */
  const getSelectedOrganizationId = (): number => {
    return selectedOrganizationId || 1; // Default to 1 if none selected
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSystemAdmin,
    getSelectedOrganizationId,
    selectedOrganizationId
  };
};

export default usePermissions; 