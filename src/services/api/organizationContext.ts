import { store } from '../../state/store';

/**
 * Get the currently selected organization ID from the Redux store
 * @returns The selected organization ID or 1 as default
 */
export const getSelectedOrganizationId = (): number => {
  const state = store.getState();
  return state.auth?.selectedOrganizationId || 1;
};

/**
 * Add the selected organization ID to API parameters
 * @param params Existing query parameters (optional)
 * @returns The parameters with the selected organization ID added
 */
export const withOrganizationId = (params: Record<string, any> = {}): Record<string, any> => {
  if (!params.organizationId) {
    return {
      ...params,
      organizationId: getSelectedOrganizationId()
    };
  }
  return params;
}; 