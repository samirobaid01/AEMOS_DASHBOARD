import apiClient from './api/apiClient';
import type { ApiDataWrapper, ApiDeleteResponse } from '../types/api';
import type { Device, DeviceCreateRequest, DeviceUpdateRequest, DeviceFilterParams } from '../types/device';
import { withOrganizationId } from './api/organizationContext';

/**
 * Get all devices with optional filters
 */
export const getDevices = async (params?: DeviceFilterParams): Promise<Device[]> => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get<ApiDataWrapper<{ devices: Device[] }>>('/devices', { params: enhancedParams });
  return response.data.data.devices;
};

/**
 * Get device by ID
 */
export const getDeviceById = async (id: number): Promise<Device> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<{ device: Device }>>(`/devices/${id}`, { params });
  const deviceData = response.data.data.device;
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
export const createDevice = async (deviceData: DeviceCreateRequest): Promise<Device> => {
  const enhancedData = withOrganizationId(deviceData);
  const response = await apiClient.post<ApiDataWrapper<{ device: Device }>>('/devices', enhancedData);
  const created = response.data?.data?.device ?? (response.data as unknown as { device?: Device })?.device ?? response.data as unknown as Device;
  return typeof created?.id === 'number' ? created : (response.data as unknown as Device);
};

/**
 * Update an existing device
 */
export const updateDevice = async (id: number, deviceData: DeviceUpdateRequest): Promise<Device> => {
  const enhancedData = withOrganizationId(deviceData);
  const response = await apiClient.patch<ApiDataWrapper<{ device: Device }>>(`/devices/${id}`, enhancedData);
  return response.data.data.device;
};

/**
 * Delete a device
 */
export const deleteDevice = async (id: number): Promise<ApiDeleteResponse> => {
  const params = withOrganizationId();
  const response = await apiClient.delete<ApiDeleteResponse>(`/devices/${id}`, { params });
  return response.data;
};

/**
 * Get devices by organization ID
 */
export const getDevicesByOrganizationId = async (organizationId: number): Promise<Device[]> => {
  const params = { organizationId };
  const response = await apiClient.get<ApiDataWrapper<{ devices: Device[] }>>('/devices', { params });
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