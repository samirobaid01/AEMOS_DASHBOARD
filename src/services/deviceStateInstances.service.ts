import apiClient from './api/apiClient';
import type { ApiDataWrapper } from '../types/api';

export interface CreateDeviceStateInstancePayload {
  deviceUuid: string;
  stateName: string;
  value: string;
  initiatedBy: 'user' | 'device';
}

export interface DeviceStateInstanceResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const createDeviceStateInstance = async (
  payload: CreateDeviceStateInstancePayload
): Promise<DeviceStateInstanceResponse> => {
  try {
    const response = await apiClient.post<ApiDataWrapper<unknown>>('/device-state-instances', payload);
    return {
      success: true,
      message: 'Device state instance created successfully',
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create device state instance'
    };
  }
};

const deviceStateInstancesService = {
  createDeviceStateInstance
};

export default deviceStateInstancesService; 