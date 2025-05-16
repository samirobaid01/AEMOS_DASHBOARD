import apiClient from './api/apiClient';
import type { Area, AreaCreateRequest, AreaUpdateRequest, AreaFilterParams } from '../types/area';
import { withOrganizationId } from './api/organizationContext';

/**
 * Get all areas with optional filters
 */
export const getAreas = async (params?: AreaFilterParams) => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get('/areas', { params: enhancedParams });
  return response.data.data.areas;
};

/**
 * Get area by ID
 */
export const getAreaById = async (id: number, params?: Record<string, any>) => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get(`/areas/${id}`, { params: enhancedParams });
  return response.data.data.area;
};

/**
 * Get areas by organization ID
 */
export const getAreasByOrganizationId = async (organizationId: number) => {
  const params = { organizationId };
  const response = await apiClient.get(`/areas/organization/${organizationId}`, { params });
  return response.data.data.areas;
};

/**
 * Create new area
 */
export const createArea = async (areaData: AreaCreateRequest) => {
  const params = withOrganizationId();
  const response = await apiClient.post('/areas', areaData, { params });
  return response.data.data.area;
};

/**
 * Update area
 */
export const updateArea = async (id: number, areaData: AreaUpdateRequest) => {
  const params = withOrganizationId();
  const response = await apiClient.patch(`/areas/${id}`, areaData, { params });
  return response.data.data.area;
};

/**
 * Delete area
 */
export const deleteArea = async (id: number) => {
  const params = withOrganizationId();
  const response = await apiClient.delete(`/areas/${id}`, { params });
  return response.data;
};

const AreasService = {
  getAreas,
  getAreaById,
  getAreasByOrganizationId,
  createArea,
  updateArea,
  deleteArea,
};

export default AreasService; 