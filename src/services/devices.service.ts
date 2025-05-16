import apiClient from './api/apiClient';
import type { Device, DeviceCreateRequest, DeviceUpdateRequest, DeviceFilterParams } from '../types/device';
import { withOrganizationId } from './api/organizationContext';

/**
 * Get all devices with optional filters
 */
export const getDevices = async (params?: DeviceFilterParams) => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get('/devices', { params: enhancedParams });
  return response.data.data.devices;
};

/**
 * Get device by ID
 */
export const getDeviceById = async (id: number) => {
  const params = withOrganizationId();
  const response = await apiClient.get(`/devices/${id}`, { params });
  console.log("Full API response:", response);
  console.log("Device response data:", response.data);
  
  const deviceData = response.data.data.device;
  console.log("Raw device from API:", deviceData);
  
  // Map the API response to match the Device interface
  const mappedDevice: Device = {
    id: deviceData.id,
    name: deviceData.name,
    serialNumber: deviceData.uuid || 'N/A',
    organizationId: deviceData.organizationId || 1,
    type: deviceData.type || 'Unknown',
    status: deviceData.status || false,
    firmware: deviceData.firmware,
    description: deviceData.description,
    configuration: deviceData.configuration || {},
    createdAt: deviceData.createdAt,
    updatedAt: deviceData.updatedAt
  };
  
  console.log("Mapped device:", mappedDevice);
  return mappedDevice;
};

/**
 * Create new device
 */
export const createDevice = async (deviceData: DeviceCreateRequest) => {
  const params = withOrganizationId();
  const response = await apiClient.post('/devices', deviceData, { params });
  return response.data.data.device;
};

/**
 * Update device
 */
export const updateDevice = async (id: number, deviceData: DeviceUpdateRequest) => {
  const params = withOrganizationId();
  const response = await apiClient.patch(`/devices/${id}`, deviceData, { params });
  return response.data.data.device;
};

/**
 * Delete device
 */
export const deleteDevice = async (id: number) => {
  const params = withOrganizationId();
  const response = await apiClient.delete(`/devices/${id}`, { params });
  return response.data;
};

/**
 * Get devices by organization ID
 */
export const getDevicesByOrganizationId = async (organizationId: number) => {
  const params = { organizationId };
  const response = await apiClient.get('/devices', { params });
  return response.data.data.devices;
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