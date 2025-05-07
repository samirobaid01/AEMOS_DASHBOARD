import apiClient from './api/apiClient';
import type { Organization, OrganizationCreateRequest, OrganizationUpdateRequest, OrganizationFilterParams } from '../types/organization';

/**
 * Get all organizations with optional filters
 */
export const getOrganizations = async (params?: OrganizationFilterParams) => {
  const response = await apiClient.get('/organizations', { params });
  return response.data.data;
};

/**
 * Get organization by ID
 */
export const getOrganizationById = async (id: number) => {
  const response = await apiClient.get(`/organizations/${id}`);
  return response.data.data;
};

/**
 * Create new organization
 */
export const createOrganization = async (organizationData: OrganizationCreateRequest) => {
  const response = await apiClient.post('/organizations', organizationData);
  return response.data.data;
};

/**
 * Update organization
 */
export const updateOrganization = async (id: number, organizationData: OrganizationUpdateRequest) => {
  const response = await apiClient.patch(`/organizations/${id}`, organizationData);
  return response.data.data;
};

/**
 * Delete organization
 */
export const deleteOrganization = async (id: number) => {
  const response = await apiClient.delete(`/organizations/${id}`);
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