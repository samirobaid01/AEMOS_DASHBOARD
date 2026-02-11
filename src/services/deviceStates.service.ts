import apiClient from './api/apiClient';
import type { ApiDataWrapper, ApiDeleteResponse } from '../types/api';
import type { DeviceStateRecord } from '../types/device';

interface DeviceStateRecordApi extends Omit<DeviceStateRecord, 'allowedValues'> {
  allowedValues: string;
}

/**
 * Get all states for a device
 */
export const getDeviceStates = async (deviceId: number, organizationId: number): Promise<DeviceStateRecord[]> => {
  const response = await apiClient.get<ApiDataWrapper<DeviceStateRecordApi[]>>(`/device-states/device/${deviceId}`, {
    params: { organizationId }
  });
  const states = response.data.data.map((state: DeviceStateRecordApi) => ({
    ...state,
    allowedValues: JSON.parse(state.allowedValues) as string[]
  }));
  return states;
};

/**
 * Create a new device state
 */
export const createDeviceState = async (
  deviceId: number,
  state: Omit<DeviceStateRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DeviceStateRecord> => {
  const response = await apiClient.post<ApiDataWrapper<DeviceStateRecordApi>>(`/device-states/device/${deviceId}`, state);
  const createdState = response.data.data;
  return {
    ...createdState,
    allowedValues: Array.isArray(createdState.allowedValues)
      ? createdState.allowedValues as string[]
      : JSON.parse(createdState.allowedValues) as string[]
  };
};

/**
 * Update an existing device state
 */
export const updateDeviceState = async (
  deviceId: number,
  stateId: number,
  state: Partial<Omit<DeviceStateRecord, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<DeviceStateRecord> => {
  const dataToSend = {
    ...state,
    allowedValues: typeof state.allowedValues === 'string'
      ? JSON.parse(state.allowedValues)
      : state.allowedValues
  };
  const response = await apiClient.patch<ApiDataWrapper<{ state: DeviceStateRecordApi }>>(`/device-states/${stateId}`, dataToSend);
  const updatedState = response.data.data.state;
  return {
    ...updatedState,
    allowedValues: Array.isArray(updatedState.allowedValues)
      ? updatedState.allowedValues as string[]
      : JSON.parse(updatedState.allowedValues) as string[]
  };
};

/**
 * Deactivate a device state
 */
export const deactivateDeviceState = async (
  deviceId: number,
  stateId: number
): Promise<{ stateId: number; success: boolean }> => {
  const response = await apiClient.delete<ApiDeleteResponse & { status?: string }>(`/device-states/${stateId}`);
  return { stateId, success: response.data.status === 'success' };
};