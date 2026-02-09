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
  
  const deviceData = response.data.data.device;
  
  // Map the API response to match the Device interface
  const mappedDevice: Device = {
    id: deviceData.id,
    name: deviceData.name,
    description: deviceData.description,
    status: deviceData.status || 'inactive',
    uuid: deviceData.uuid,
    organizationId: deviceData.organizationId,
    deviceType: deviceData.deviceType || 'actuator',
    controlType: deviceData.controlType || 'binary',
    minValue: deviceData.minValue,
    maxValue: deviceData.maxValue,
    defaultState: deviceData.defaultState,
    communicationProtocol: deviceData.communicationProtocol,
    isCritical: deviceData.isCritical || false,
    capabilities: deviceData.capabilities || {},
    areaId: deviceData.areaId,
    controlModes: deviceData.controlModes,
    createdAt: deviceData.createdAt,
    updatedAt: deviceData.updatedAt,
    states: deviceData.states || []
  };
  
  return mappedDevice;
};

/**
 * Create a new device. Returns the created device (with id) for use in Step 2.
 */
export const createDevice = async (deviceData: DeviceCreateRequest) => {
  const enhancedData = withOrganizationId(deviceData);
  const response = await apiClient.post('/devices', enhancedData);
  const created = response.data?.data?.device ?? response.data?.device ?? response.data;
  return typeof created?.id === 'number' ? created : response.data;
};

/**
 * Update an existing device
 */
export const updateDevice = async (id: number, deviceData: DeviceUpdateRequest) => {
  const enhancedData = withOrganizationId(deviceData);
  const response = await apiClient.patch(`/devices/${id}`, enhancedData);
  return response.data;
};

/**
 * Delete a device
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