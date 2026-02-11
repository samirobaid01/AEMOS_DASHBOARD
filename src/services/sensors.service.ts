import apiClient from './api/apiClient';
import type { ApiDataWrapper, ApiDeleteResponse } from '../types/api';
import type { Sensor, SensorCreateRequest, SensorUpdateRequest, SensorFilterParams } from '../types/sensor';
import { withOrganizationId } from './api/organizationContext';

/**
 * Get all sensors with optional filters
 */
export const getSensors = async (params?: SensorFilterParams): Promise<Sensor[]> => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get<ApiDataWrapper<{ sensors: Sensor[] }>>('/sensors', { params: enhancedParams });
  return response.data.data.sensors;
};

/**
 * Get sensor by ID
 */
export const getSensorById = async (id: number): Promise<Sensor> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<{ sensor: Sensor }>>(`/sensors/${id}`, { params });
  return response.data.data.sensor;
};

/**
 * Get sensors by organization ID
 */
export const getSensorsByOrganizationId = async (organizationId: number): Promise<Sensor[]> => {
  const params = withOrganizationId({ organizationId });
  const response = await apiClient.get<ApiDataWrapper<{ sensors: Sensor[] }>>(`/sensors/organization/${organizationId}`, { params });
  return response.data.data.sensors;
};

/**
 * Create new sensor
 */
export const createSensor = async (sensorData: SensorCreateRequest): Promise<Sensor> => {
  const params = withOrganizationId();
  const response = await apiClient.post<ApiDataWrapper<{ sensor: Sensor }>>('/sensors', sensorData, { params });
  return response.data.data.sensor;
};

/**
 * Update sensor
 */
export const updateSensor = async (id: number, sensorData: SensorUpdateRequest): Promise<Sensor> => {
  const params = withOrganizationId();
  const response = await apiClient.patch<ApiDataWrapper<{ sensor: Sensor }>>(`/sensors/${id}`, sensorData, { params });
  return response.data.data.sensor;
};

/**
 * Delete sensor
 */
export const deleteSensor = async (id: number): Promise<ApiDeleteResponse> => {
  const params = withOrganizationId();
  const response = await apiClient.delete<ApiDeleteResponse>(`/sensors/${id}`, { params });
  return response.data;
};

/**
 * Get sensors by area ID
 */
export const getSensorsByAreaId = async (areaId: number): Promise<Sensor[]> => {
  const params = withOrganizationId({ areaId });
  const response = await apiClient.get<ApiDataWrapper<{ sensors: Sensor[] }>>('/sensors', { params });
  return response.data.data.sensors;
};

const SensorsService = {
  getSensors,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor,
  getSensorsByAreaId,
};

export default SensorsService; 