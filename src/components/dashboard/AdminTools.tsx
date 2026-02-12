import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { selectCurrentUser, updateUser } from '../../state/slices/auth.slice';
import usePermissions from '../../hooks/usePermissions';
import Button from '../common/Button/Button';

const allPermissions = [
  'organization.view', 'organization.create', 'organization.update', 'organization.delete',
  'area.view', 'area.create', 'area.update', 'area.delete',
  'device.view', 'device.create', 'device.update', 'device.delete',
  'sensor.view', 'sensor.create', 'sensor.update', 'sensor.delete',
  'rule.view', 'rule.create', 'rule.update', 'rule.delete'
];

const AdminTools: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  usePermissions();

  useEffect(() => {}, [user, dispatch]);

  const makeSystemAdmin = () => {
    if (!user) return;
    dispatch(updateUser({
      ...user,
      roles: [...new Set([...(user.roles || []), 'SystemAdmin'])]
    }));
    alert('User is now a System Admin');
  };

  const grantAllPermissions = () => {
    if (!user) return;
    dispatch(updateUser({
      ...user,
      permissions: [...new Set([...(user.permissions || []), ...allPermissions])]
    }));
    alert('All permissions granted to user');
  };

  const quickFix = () => {
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
    dispatch(updateUser(updatedUser));
    alert('Quick fix applied! User now has all permissions.');
  };

  return (
    <div className="m-4 p-4 rounded-lg border border-border dark:border-border-dark bg-surfaceHover dark:bg-surfaceHover-dark">
      <h3 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0 mb-2">
        Admin Tools
      </h3>
      <p className="text-sm text-textSecondary dark:text-textSecondary-dark m-0">
        Current permissions: {user?.permissions?.join(', ') || 'None'}
      </p>
      <p className="text-sm text-textSecondary dark:text-textSecondary-dark m-0 mb-3">
        Current roles: {user?.roles?.join(', ') || 'None'}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={makeSystemAdmin}>
          Make System Admin
        </Button>
        <Button type="button" onClick={grantAllPermissions}>
          Grant All Permissions
        </Button>
        <Button type="button" variant="danger" onClick={quickFix}>
          Quick Fix (Emergency)
        </Button>
      </div>
    </div>
  );
};

export default AdminTools;
