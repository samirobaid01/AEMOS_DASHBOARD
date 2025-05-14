import { useSelector } from 'react-redux';
import { selectCurrentUser, selectSelectedOrganizationId } from '../state/slices/auth.slice';

export const usePermissions = () => {
  const user = useSelector(selectCurrentUser);
  const selectedOrganizationId = useSelector(selectSelectedOrganizationId);

  // Debug log on hook initialization
  console.log('usePermissions: User permissions:', user?.permissions);
  console.log('usePermissions: User roles:', user?.roles);

  /**
   * Check if the user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) {
      console.log(`usePermissions: No user or permissions found for permission check: ${permission}`);
      return false;
    }
    const result = user.permissions.includes(permission);
    console.log(`usePermissions: Checking permission: ${permission}, result: ${result}`);
    return result;
  };

  /**
   * Check if the user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      console.log(`usePermissions: No user or permissions found for any permission check: ${permissions.join(', ')}`);
      return false;
    }
    const result = permissions.some(permission => user.permissions?.includes(permission));
    console.log(`usePermissions: Checking any permissions: [${permissions.join(', ')}], result: ${result}`);
    return result;
  };

  /**
   * Check if the user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      console.log(`usePermissions: No user or permissions found for all permissions check: ${permissions.join(', ')}`);
      return false;
    }
    const result = permissions.every(permission => user.permissions?.includes(permission));
    console.log(`usePermissions: Checking all permissions: [${permissions.join(', ')}], result: ${result}`);
    return result;
  };

  /**
   * Check if the user is a System Admin
   */
  const isSystemAdmin = (): boolean => {
    if (!user || !user.roles) {
      console.log(`usePermissions: No user or roles found for system admin check`);
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
    console.log(`usePermissions: Getting selected organization ID: ${selectedOrganizationId || 1}`);
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