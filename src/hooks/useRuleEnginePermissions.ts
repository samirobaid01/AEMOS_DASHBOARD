import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState } from '../state/store';

export const RULE_ENGINE_PERMISSIONS = {
  CREATE: 'rule.create',
  DELETE: 'rule.delete',
  UPDATE: 'rule.update',
  VIEW: 'rule.view',
} as const;

export type RuleEnginePermission = typeof RULE_ENGINE_PERMISSIONS[keyof typeof RULE_ENGINE_PERMISSIONS];

// Single selector for all permissions
const selectAuthPermissions = (state: RootState) => state.auth.permissions || [];

export const useRuleEnginePermissions = () => {
  // Get permissions array once
  const permissions = useSelector(selectAuthPermissions);

  // Compute all permission checks in one memo
  return useMemo(() => ({
    canCreate: permissions.includes(RULE_ENGINE_PERMISSIONS.CREATE),
    canUpdate: permissions.includes(RULE_ENGINE_PERMISSIONS.UPDATE),
    canDelete: permissions.includes(RULE_ENGINE_PERMISSIONS.DELETE),
    canView: permissions.includes(RULE_ENGINE_PERMISSIONS.VIEW),
    hasAnyPermission: [
      RULE_ENGINE_PERMISSIONS.VIEW,
      RULE_ENGINE_PERMISSIONS.CREATE,
      RULE_ENGINE_PERMISSIONS.UPDATE,
      RULE_ENGINE_PERMISSIONS.DELETE,
    ].some(permission => permissions.includes(permission))
  }), [permissions]);
}; 