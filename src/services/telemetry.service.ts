import apiClient from './api/apiClient';
import type { TelemetryCreateRequest, TelemetryUpdateRequest } from '../types/sensor';

export const createTelemetry = async (data: TelemetryCreateRequest) => {
  const response = await apiClient.post('/telemetry', data);
  return response.data.data;
};

export const updateTelemetry = async (id: number, data: TelemetryUpdateRequest) => {
  const response = await apiClient.patch(`/telemetry/${id}`, data);
  return response.data.data;
};

export default {
  createTelemetry,
  updateTelemetry,
};
