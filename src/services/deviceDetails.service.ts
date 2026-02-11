import apiClient from './api/apiClient';
import type { ApiDataWrapper } from '../types/api';
import type { DeviceDetails, DeviceState } from '../state/slices/deviceDetails.slice';
import {
  ALLOWED_DEVICE_TYPES,
  ALLOWED_CONTROL_TYPES,
  ALLOWED_PROTOCOLS,
  type DeviceStatus,
  type DeviceType,
  type ControlType,
  type CommunicationProtocol
} from '../constants/device';

interface DeviceDetailsApiPayload {
  device: Record<string, unknown>;
  minValue?: number | null;
  maxValue?: number | null;
}

const validateStatus = (status: string): DeviceStatus => {
  const validStatuses: DeviceStatus[] = ['active', 'inactive', 'pending'];
  return validStatuses.includes(status as DeviceStatus)
    ? (status as DeviceStatus)
    : 'inactive';
};

const validateDeviceType = (type: string): DeviceType => {
  return ALLOWED_DEVICE_TYPES.includes(type as DeviceType)
    ? (type as DeviceType)
    : 'actuator';
};

const validateControlType = (type: string): ControlType => {
  return ALLOWED_CONTROL_TYPES.includes(type as ControlType)
    ? (type as ControlType)
    : 'binary';
};

const validateCommunicationProtocol = (value: string | undefined): CommunicationProtocol | undefined => {
  if (value == null || value === '') return undefined;
  return ALLOWED_PROTOCOLS.includes(value as CommunicationProtocol)
    ? (value as CommunicationProtocol)
    : undefined;
};

export const getDeviceDetails = async (deviceId: number, organizationId: number): Promise<DeviceDetails> => {
  const response = await apiClient.get<ApiDataWrapper<DeviceDetailsApiPayload>>(`/devices/${deviceId}`, {
    params: { organizationId }
  });
  const deviceData = response.data.data;
  const device = deviceData.device as Record<string, unknown>;
  return {
    id: device.id as number,
    name: device.name as string,
    description: device.description as string | undefined,
    status: validateStatus(device.status as string),
    uuid: device.uuid as string | undefined,
    organizationId: device.organizationId as number,
    deviceType: validateDeviceType(device.deviceType as string),
    controlType: validateControlType(device.controlType as string),
    minValue: deviceData.minValue,
    maxValue: deviceData.maxValue,
    defaultState: device.defaultState as string | undefined,
    communicationProtocol: validateCommunicationProtocol(device.communicationProtocol as string | undefined),
    isCritical: (device.isCritical as boolean) || false,
    metadata: (device.metadata as Record<string, unknown>) || {},
    capabilities: (device.capabilities as Record<string, unknown>) || {},
    areaId: device.areaId as number | undefined,
    controlModes: device.controlModes as string | undefined,
    createdAt: device.createdAt as string,
    updatedAt: device.updatedAt as string,
    states: (device.states as DeviceState[]) || []
  };
};

export const updateDeviceState = async (
  deviceId: number,
  stateId: number,
  value: string,
  organizationId: number
): Promise<DeviceState> => {
  const response = await apiClient.patch<ApiDataWrapper<DeviceState>>(
    `/devices/${deviceId}/states/${stateId}`,
    { value, organizationId }
  );
  return response.data.data;
};

const deviceDetailsService = {
  getDeviceDetails,
  updateDeviceState
};

export default deviceDetailsService; 