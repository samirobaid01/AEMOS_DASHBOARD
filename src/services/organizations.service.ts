import apiClient from './api/apiClient';
import type { Organization, OrganizationCreateRequest, OrganizationUpdateRequest, OrganizationFilterParams } from '../types/organization';
import { store } from '../state/store';

/**
 * Get all organizations with optional filters
 */
export const getOrganizations = async (params?: OrganizationFilterParams) => {
  const response = await apiClient.get('/organizations', { params });
  return response.data.data.organizations;
};

/**
 * Get organization by ID
 */
export const getOrganizationById = async (id: number) => {
  const state = store.getState();
  const organizationId = id;
  const response = await apiClient.get(`/organizations/${id}`, {
    params: { organizationId }
  });
  return response.data.data.organization;
};

/**
 * Create new organization
 */
export const createOrganization = async (organizationData: OrganizationCreateRequest) => {
  const response = await apiClient.post('/organizations', organizationData);
  return response.data.data.organization;
};

/**
 * Update organization
 */
export const updateOrganization = async (id: number, organizationData: OrganizationUpdateRequest) => {
  const organizationId = id;
  const response = await apiClient.patch(`/organizations/${id}`, organizationData, {
    params: { organizationId }
  });
  return response.data.data.organization;
};

/**
 * Delete organization
 */
export const deleteOrganization = async (id: number) => {
  const organizationId = id;
  const response = await apiClient.delete(`/organizations/${id}`, {
    params: { organizationId }
  });
  return response.data;
};

const OrganizationsService = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};

export default OrganizationsService; 