import apiClient from './api/apiClient';
import type { DeviceDetails, DeviceState } from '../state/slices/deviceDetails.slice';
import type { DeviceStatus, DeviceType, ControlType } from '../constants/device';

const validateStatus = (status: string): DeviceStatus => {
  const validStatuses: DeviceStatus[] = ['active', 'inactive', 'pending'];
  return validStatuses.includes(status as DeviceStatus) 
    ? (status as DeviceStatus) 
    : 'inactive';
};

const validateDeviceType = (type: string): DeviceType => {
  const validTypes: DeviceType[] = ['actuator', 'sensor', 'gateway', 'controller', 'display'];
  return validTypes.includes(type as DeviceType)
    ? (type as DeviceType)
    : 'actuator';
};

const validateControlType = (type: string): ControlType => {
  const validTypes: ControlType[] = ['binary', 'range', 'multi-state', 'continuous'];
  return validTypes.includes(type as ControlType)
    ? (type as ControlType)
    : 'binary';
};

export const getDeviceDetails = async (deviceId: number, organizationId: number): Promise<DeviceDetails> => {
  const response = await apiClient.get(`/devices/${deviceId}`, {
    params: { organizationId }
  });
  
  const deviceData = response.data.data;
  console.log('DeviceDetails response', deviceData);
  console.log('id', deviceData.device.id);
  console.log('name', deviceData.device.name);
  console.log('description', deviceData.device.description);
  console.log('status', deviceData.device.status);
  console.log('uuid', deviceData.device.uuid);
  console.log('organizationId', deviceData.device.organizationId);
  console.log('deviceType', deviceData.device.deviceType);
  
  return {
    id: deviceData.device.id,
    name: deviceData.device.name,
    description: deviceData.device.description,
    status: validateStatus(deviceData.device.status),
    uuid: deviceData.device.uuid,
    organizationId: deviceData.device.organizationId,
    deviceType: validateDeviceType(deviceData.device.deviceType),
    controlType: validateControlType(deviceData.device.controlType),
    minValue: deviceData.minValue,
    maxValue: deviceData.maxValue,
    defaultState: deviceData.device.defaultState,
    communicationProtocol: deviceData.device.communicationProtocol,
    isCritical: deviceData.device.isCritical || false,
    metadata: deviceData.device.metadata || {},
    capabilities: deviceData.device.capabilities || {},
    areaId: deviceData.device.areaId,
    controlModes: deviceData.device.controlModes,
    createdAt: deviceData.device.createdAt,
    updatedAt: deviceData.device.updatedAt,
    states: deviceData.device.states || []
  };
};

export const updateDeviceState = async (
  deviceId: number,
  stateId: number,
  value: string,
  organizationId: number
): Promise<DeviceState> => {
  const response = await apiClient.patch(
    `/devices/${deviceId}/states/${stateId}`,
    { value, organizationId }
  );
  return response.data;
};

const deviceDetailsService = {
  getDeviceDetails,
  updateDeviceState
};

export default deviceDetailsService; 