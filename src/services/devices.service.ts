import apiClient from './api/apiClient';
import type { Device, DeviceCreateRequest, DeviceUpdateRequest, DeviceFilterParams } from '../types/device';

/**
 * Get all devices with optional filters
 */
export const getDevices = async (params?: DeviceFilterParams) => {
  const response = await apiClient.get('/devices', { params });
  return response.data.data;
};

/**
 * Get device by ID
 */
export const getDeviceById = async (id: number) => {
  const response = await apiClient.get(`/devices/${id}`);
  return response.data.data;
};

/**
 * Create new device
 */
export const createDevice = async (deviceData: DeviceCreateRequest) => {
  const response = await apiClient.post('/devices', deviceData);
  return response.data.data;
};

/**
 * Update device
 */
export const updateDevice = async (id: number, deviceData: DeviceUpdateRequest) => {
  const response = await apiClient.patch(`/devices/${id}`, deviceData);
  return response.data.data;
};

/**
 * Delete device
 */
export const deleteDevice = async (id: number) => {
  const response = await apiClient.delete(`/devices/${id}`);
  return response.data;
};

/**
 * Get devices by organization ID
 */
export const getDevicesByOrganizationId = async (organizationId: number) => {
  const response = await apiClient.get('/devices', { params: { organizationId } });
  return response.data.data;
};

const DevicesService = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDevicesByOrganizationId,
};

export default DevicesService; 