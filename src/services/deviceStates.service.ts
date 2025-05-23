import apiClient from './api/apiClient';
import type { DeviceState } from '../state/slices/deviceStates.slice';

/**
 * Get all states for a device
 */
export const getDeviceStates = async (deviceId: number, organizationId: number) => {
  const response = await apiClient.get(`/device-states/device/${deviceId}`, {
    params: { organizationId }
  });
  return response.data.data.states;
};

/**
 * Create a new device state
 */
export const createDeviceState = async (
  deviceId: number,
  state: Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const response = await apiClient.post(`/device-states/device/${deviceId}`, state);
  return response.data.data.state;
}; 