import apiClient from './api/apiClient';
import type { ApiDataWrapper, ApiDeleteResponse } from '../types/api';
import type { Organization, OrganizationCreateRequest, OrganizationUpdateRequest, OrganizationFilterParams } from '../types/organization';
import { store } from '../state/store';

/**
 * Get all organizations with optional filters
 */
export const getOrganizations = async (params?: OrganizationFilterParams): Promise<Organization[]> => {
  const response = await apiClient.get<ApiDataWrapper<{ organizations: Organization[] }>>('/organizations', { params });
  return response.data.data.organizations;
};

/**
 * Get organization by ID
 */
export const getOrganizationById = async (id: number): Promise<Organization> => {
  const organizationId = id;
  const response = await apiClient.get<ApiDataWrapper<{ organization: Organization }>>(`/organizations/${id}`, {
    params: { organizationId }
  });
  return response.data.data.organization;
};

/**
 * Create new organization
 */
export const createOrganization = async (organizationData: OrganizationCreateRequest): Promise<Organization> => {
  const response = await apiClient.post<ApiDataWrapper<{ organization: Organization }>>('/organizations', organizationData);
  return response.data.data.organization;
};

/**
 * Update organization
 */
export const updateOrganization = async (id: number, organizationData: OrganizationUpdateRequest): Promise<Organization> => {
  const organizationId = id;
  const response = await apiClient.patch<ApiDataWrapper<{ organization: Organization }>>(`/organizations/${id}`, organizationData, {
    params: { organizationId }
  });
  return response.data.data.organization;
};

/**
 * Delete organization
 */
export const deleteOrganization = async (id: number): Promise<ApiDeleteResponse> => {
  const organizationId = id;
  const response = await apiClient.delete<ApiDeleteResponse>(`/organizations/${id}`, {
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