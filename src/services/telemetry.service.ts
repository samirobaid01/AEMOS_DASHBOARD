import apiClient from './api/apiClient';
import type { ApiDataWrapper } from '../types/api';
import type { TelemetryCreateRequest, TelemetryUpdateRequest, TelemetryVariable } from '../types/sensor';

export const createTelemetry = async (data: TelemetryCreateRequest): Promise<TelemetryVariable> => {
  const response = await apiClient.post<ApiDataWrapper<TelemetryVariable>>('/telemetry', data);
  return response.data.data;
};

export const updateTelemetry = async (id: number, data: TelemetryUpdateRequest): Promise<TelemetryVariable> => {
  const response = await apiClient.patch<ApiDataWrapper<TelemetryVariable>>(`/telemetry/${id}`, data);
  return response.data.data;
};

export default {
  createTelemetry,
  updateTelemetry,
};
