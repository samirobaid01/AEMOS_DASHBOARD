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

function parseAllowedValues(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  }
  return [];
}

/**
 * Update an existing device state.
 * API returns { status, data: state } or sometimes { status, data: { data: state } }.
 */
export const updateDeviceState = async (
  _deviceId: number,
  stateId: number,
  state: Partial<Omit<DeviceStateRecord, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<DeviceStateRecord> => {
  const dataToSend = {
    ...state,
    allowedValues: state.allowedValues == null ? undefined : parseAllowedValues(state.allowedValues)
  };
  const response = await apiClient.patch<ApiDataWrapper<DeviceStateRecordApi>>(`/device-states/${stateId}`, dataToSend);
  const data = response.data.data;
  const raw = (data && typeof data === 'object' && 'data' in data ? (data as { data: DeviceStateRecordApi }).data : data) as DeviceStateRecordApi;
  if (!raw || typeof raw !== 'object' || !('id' in raw)) {
    throw new Error('Invalid response: device state not returned');
  }
  return {
    ...raw,
    allowedValues: parseAllowedValues(raw.allowedValues)
  } as DeviceStateRecord;
};

/**
 * Deactivate a device state
 */
export const deactivateDeviceState = async (
  _deviceId: number,
  stateId: number
): Promise<{ stateId: number; success: boolean }> => {
  const response = await apiClient.delete<ApiDeleteResponse & { status?: string }>(`/device-states/${stateId}`);
  return { stateId, success: response.data.status === 'success' };
};