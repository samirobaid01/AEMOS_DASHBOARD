import apiClient from './api/apiClient';
import type { Area, AreaCreateRequest, AreaUpdateRequest, AreaFilterParams } from '../types/area';

/**
 * Get all areas with optional filters
 */
export const getAreas = async (params?: AreaFilterParams) => {
  const response = await apiClient.get('/areas', { params });
  return response.data.data.areas;
};

/**
 * Get area by ID
 */
export const getAreaById = async (id: number) => {
  const response = await apiClient.get(`/areas/${id}`);
  return response.data.data.area;
};

/**
 * Get areas by organization ID
 */
export const getAreasByOrganizationId = async (organizationId: number) => {
  const response = await apiClient.get(`/areas/organization/${organizationId}`);
  return response.data.data.areas;
};

/**
 * Create new area
 */
export const createArea = async (areaData: AreaCreateRequest) => {
  const response = await apiClient.post('/areas', areaData);
  return response.data.data.area;
};

/**
 * Update area
 */
export const updateArea = async (id: number, areaData: AreaUpdateRequest) => {
  const response = await apiClient.patch(`/areas/${id}`, areaData);
  return response.data.data.area;
};

/**
 * Delete area
 */
export const deleteArea = async (id: number) => {
  const response = await apiClient.delete(`/areas/${id}`);
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