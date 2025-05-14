import apiClient from './api/apiClient';
import type { Sensor, SensorCreateRequest, SensorUpdateRequest, SensorFilterParams } from '../types/sensor';
import { withOrganizationId } from './api/organizationContext';

/**
 * Get all sensors with optional filters
 */
export const getSensors = async (params?: SensorFilterParams) => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get('/sensors', { params: enhancedParams });
  return response.data.data.sensors;
};

/**
 * Get sensor by ID
 */
export const getSensorById = async (id: number) => {
  const params = withOrganizationId();
  const response = await apiClient.get(`/sensors/${id}`, { params });
  return response.data.data.sensor;
};

/**
 * Create new sensor
 */
export const createSensor = async (sensorData: SensorCreateRequest) => {
  const params = withOrganizationId();
  const response = await apiClient.post('/sensors', sensorData, { params });
  return response.data.data.sensor;
};

/**
 * Update sensor
 */
export const updateSensor = async (id: number, sensorData: SensorUpdateRequest) => {
  const params = withOrganizationId();
  const response = await apiClient.patch(`/sensors/${id}`, sensorData, { params });
  return response.data.data.sensor;
};

/**
 * Delete sensor
 */
export const deleteSensor = async (id: number) => {
  const params = withOrganizationId();
  const response = await apiClient.delete(`/sensors/${id}`, { params });
  return response.data;
};

/**
 * Get sensors by area ID
 */
export const getSensorsByAreaId = async (areaId: number) => {
  const params = withOrganizationId({ areaId });
  const response = await apiClient.get('/sensors', { params });
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