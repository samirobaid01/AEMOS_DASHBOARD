import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, updateUser } from '../../state/slices/auth.slice';
import usePermissions from '../../hooks/usePermissions';

// Function to update user in Redux with permissions
const AdminTools: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { isSystemAdmin } = usePermissions();

  // List of all possible permissions in the system
  const allPermissions = [
    'organization.view', 'organization.create', 'organization.update', 'organization.delete',
    'area.view', 'area.create', 'area.update', 'area.delete',
    'device.view', 'device.create', 'device.update', 'device.delete',
    'sensor.view', 'sensor.create', 'sensor.update', 'sensor.delete',
    'rule.view', 'rule.create', 'rule.update', 'rule.delete'
  ];

  // Initialize user with permissions if needed
  useEffect(() => {
    // Disabled auto-assignment since permissions come from login response
    // if (user && (!user.permissions || user.permissions.length === 0)) {
    //   console.log('AdminTools: User has no permissions, auto-assigning');
    //   const updatedUser = {
    //     ...user,
    //     permissions: allPermissions,
    //     roles: [...(user.roles || []), 'SystemAdmin']
    //   };
    //   dispatch(updateUser(updatedUser));
    // }
  }, [user, dispatch]);

  // Make user a system admin
  const makeSystemAdmin = () => {
    if (!user) return;
    
    // Create a new user object with SystemAdmin role
    const updatedUser = {
      ...user,
      roles: [...new Set([...(user.roles || []), 'SystemAdmin'])]
    };
    
    // Update Redux store directly
    dispatch(updateUser(updatedUser));
    
    // Show success message
    alert('User is now a System Admin');
  };

  // Grant all permissions to user
  const grantAllPermissions = () => {
    if (!user) return;
    
    // Create a new user object with all permissions
    const updatedUser = {
      ...user,
      permissions: [...new Set([...(user.permissions || []), ...allPermissions])]
    };
    
    // Update Redux store directly
    dispatch(updateUser(updatedUser));
    
    // Show success message
    alert('All permissions granted to user');
  };

  // Create complete user with all permissions (for new users)
  const quickFix = () => {
    // If no user exists, create a minimal one with permissions
    const updatedUser = user ? {
      ...user,
      permissions: allPermissions,
      roles: [...new Set([...(user.roles || []), 'SystemAdmin'])]
    } : {
      id: 1,
      email: 'admin@example.com',
      userName: 'Admin User',
      permissions: allPermissions,
      roles: ['SystemAdmin']
    };
    
    // This should update the Redux store immediately
    dispatch(updateUser(updatedUser));
    
    // Show confirmation
    alert('Quick fix applied! User now has all permissions.');
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    margin: '0.5rem',
    cursor: 'pointer',
    fontWeight: 500,
  };

  const warningButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',  // Red color for emergency fix
  };

  return (
    <div style={{
      margin: '1rem',
      padding: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      backgroundColor: '#f9fafb'
    }}>
      <h3 style={{ marginTop: 0 }}>Admin Tools</h3>
      <p>Current permissions: {user?.permissions?.join(', ') || 'None'}</p>
      <p>Current roles: {user?.roles?.join(', ') || 'None'}</p>
      <div>
        <button style={buttonStyle} onClick={makeSystemAdmin}>
          Make System Admin
        </button>
        <button style={buttonStyle} onClick={grantAllPermissions}>
          Grant All Permissions
        </button>
        <button style={warningButtonStyle} onClick={quickFix}>
          Quick Fix (Emergency)
        </button>
      </div>
    </div>
  );
};

export default AdminTools; 