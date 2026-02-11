import apiClient from './api/apiClient';
import type { ApiDataWrapper, ApiDeleteResponse } from '../types/api';
import type { Area, AreaCreateRequest, AreaUpdateRequest, AreaFilterParams } from '../types/area';
import { withOrganizationId } from './api/organizationContext';

/**
 * Get all areas with optional filters
 */
export const getAreas = async (params?: AreaFilterParams): Promise<Area[]> => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get<ApiDataWrapper<{ areas: Area[] }>>('/areas', { params: enhancedParams });
  return response.data.data.areas;
};

/**
 * Get area by ID
 */
export const getAreaById = async (id: number, params?: Record<string, unknown>): Promise<Area> => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get<ApiDataWrapper<{ area: Area }>>(`/areas/${id}`, { params: enhancedParams });
  return response.data.data.area;
};

/**
 * Get areas by organization ID
 */
export const getAreasByOrganizationId = async (organizationId: number): Promise<Area[]> => {
  const params = { organizationId };
  const response = await apiClient.get<ApiDataWrapper<{ areas: Area[] }>>(`/areas/organization/${organizationId}`, { params });
  return response.data.data.areas;
};

/**
 * Create new area
 */
export const createArea = async (areaData: AreaCreateRequest): Promise<Area> => {
  const params = withOrganizationId();
  const response = await apiClient.post<ApiDataWrapper<{ area: Area }>>('/areas', areaData, { params });
  return response.data.data.area;
};

/**
 * Update area
 */
export const updateArea = async (id: number, areaData: AreaUpdateRequest): Promise<Area> => {
  const params = withOrganizationId();
  const response = await apiClient.patch<ApiDataWrapper<{ area: Area }>>(`/areas/${id}`, areaData, { params });
  return response.data.data.area;
};

/**
 * Delete area
 */
export const deleteArea = async (id: number): Promise<ApiDeleteResponse> => {
  const params = withOrganizationId();
  const response = await apiClient.delete<ApiDeleteResponse>(`/areas/${id}`, { params });
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