import apiClient from './api/apiClient';
import type { DeviceState } from '../state/slices/deviceStates.slice';

/**
 * Get all states for a device
 */
export const getDeviceStates = async (deviceId: number, organizationId: number) => {
  const response = await apiClient.get(`/device-states/device/${deviceId}`, {
    params: { organizationId }
  });
  
  // Parse allowedValues from JSON string to array
  const states = response.data.data.map((state: any) => ({
    ...state,
    allowedValues: JSON.parse(state.allowedValues)
  }));
  
  return states;
};

/**
 * Create a new device state
 */
export const createDeviceState = async (
  deviceId: number,
  state: Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>
) => {
  // For create, we send allowedValues as is (array)
  const response = await apiClient.post(`/device-states/device/${deviceId}`, state);
  
  const createdState = response.data.data;
  return {
    ...createdState,
    allowedValues: Array.isArray(createdState.allowedValues) 
      ? createdState.allowedValues 
      : JSON.parse(createdState.allowedValues)
  };
};

/**
 * Update an existing device state
 */
export const updateDeviceState = async (
  deviceId: number,
  stateId: number,
  state: Partial<Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  // Send allowedValues as is (array) - don't stringify
  const dataToSend = {
    ...state,
    // If allowedValues is a string, parse it, otherwise use as is
    allowedValues: typeof state.allowedValues === 'string' 
      ? JSON.parse(state.allowedValues) 
      : state.allowedValues
  };
  
  const response = await apiClient.patch(`/device-states/${stateId}`, dataToSend);
  const updatedState = response.data.data.state;
  
  return {
    ...updatedState,
    allowedValues: Array.isArray(updatedState.allowedValues) 
      ? updatedState.allowedValues 
      : JSON.parse(updatedState.allowedValues)
  };
};

/**
 * Deactivate a device state
 */
export const deactivateDeviceState = async (
  deviceId: number,
  stateId: number
) => {
  const response = await apiClient.delete(`/device-states/${stateId}`);
  return { stateId, success: response.data.status === 'success' };
};