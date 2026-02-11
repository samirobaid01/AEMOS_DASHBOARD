import apiClient from './api/apiClient';
import type { ApiDataWrapper, ApiDeleteResponse } from '../types/api';
import type { RuleChain, RuleChainCreatePayload, RuleChainUpdatePayload, RuleNode } from '../types/ruleEngine';
import type { Device, DeviceStateRecord } from '../types/device';
import type { Sensor } from '../types/sensor';
import { withOrganizationId } from './api/organizationContext';

interface DeviceStateRecordApi extends Omit<DeviceStateRecord, 'allowedValues'> {
  allowedValues: string;
}

type RuleChainsPayload = { rules?: RuleChain[]; ruleChains?: RuleChain[] } | RuleChain[];

/**
 * Get all rule chains
 * Supports: { data: RuleChain[] } | { data: { rules: RuleChain[] } } | { data: { ruleChains: RuleChain[] } }
 */
export const getRules = async (): Promise<RuleChain[]> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<RuleChainsPayload>>('/rule-chains', { params });
  const data = response.data.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as { rules?: RuleChain[]; ruleChains?: RuleChain[] };
    if (Array.isArray(obj.rules)) return obj.rules;
    if (Array.isArray(obj.ruleChains)) return obj.ruleChains;
  }
  return [];
};

/**
 * Get rule chain by ID
 */
export const getRuleDetails = async (ruleId: number): Promise<RuleChain> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<RuleChain>>(`/rule-chains/${ruleId}`, { params });
  return response.data.data;
};

/**
 * Create new rule chain
 */
export const createRule = async (payload: RuleChainCreatePayload): Promise<RuleChain> => {
  const params = withOrganizationId();
  const response = await apiClient.post<ApiDataWrapper<RuleChain>>('/rule-chains', payload, { params });
  return response.data.data;
};

/**
 * Update rule chain
 */
export const updateRule = async (ruleId: number, payload: RuleChainUpdatePayload): Promise<RuleChain> => {
  const params = withOrganizationId();
  const response = await apiClient.patch<ApiDataWrapper<RuleChain>>(`/rule-chains/${ruleId}`, payload, { params });
  return response.data.data;
};

/**
 * Delete rule chain
 */
export const deleteRule = async (ruleId: number): Promise<ApiDeleteResponse> => {
  const params = withOrganizationId();
  const response = await apiClient.delete<ApiDeleteResponse>(`/rule-chains/${ruleId}`, { params });
  return response.data;
};

/**
 * Update rule node
 */
export const updateRuleNode = async (nodeId: number, payload: {
  name: string;
  config: string;
}): Promise<RuleNode> => {
  const params = withOrganizationId();
  const response = await apiClient.patch<ApiDataWrapper<RuleNode>>(`/rule-chains/nodes/${nodeId}`, payload, { params });
  return response.data.data;
};

/**
 * Delete rule node
 */
export const deleteRuleNode = async (nodeId: number): Promise<ApiDeleteResponse> => {
  const params = withOrganizationId();
  const response = await apiClient.delete<ApiDeleteResponse>(`/rule-chains/nodes/${nodeId}`, { params });
  return response.data;
};

/**
 * Create rule node
 */
export const createRuleNode = async (payload: {
  ruleChainId: number;
  type: string;
  name: string;
  config: string;
  nextNodeId: number | null;
}): Promise<RuleNode> => {
  const params = withOrganizationId();
  const response = await apiClient.post<ApiDataWrapper<RuleNode>>('/rule-chains/nodes', payload, { params });
  return response.data.data;
};

/**
 * Fetch sensors
 */
export const fetchSensors = async (): Promise<Sensor[]> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<{ sensors: Sensor[] }>>('/sensors', { params });
  return response.data.data.sensors;
};

/**
 * Fetch sensor details
 */
export const fetchSensorDetails = async (sensorId: number): Promise<Sensor> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<{ sensor: Sensor }>>(`/sensors/${sensorId}`, { params });
  return response.data.data.sensor;
};

/**
 * Fetch devices
 */
export const fetchDevices = async (): Promise<Device[]> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<{ devices: Device[] }>>('/devices', { params });
  return response.data.data.devices;
};

/**
 * Fetch device states
 */
export const fetchDeviceStates = async (deviceId: number): Promise<DeviceStateRecord[]> => {
  const params = withOrganizationId();
  const response = await apiClient.get<ApiDataWrapper<DeviceStateRecordApi[]>>(`/device-states/device/${deviceId}`, { params });
  const raw = response.data?.data;
  if (!Array.isArray(raw)) return [];
  const states = raw.map((state: DeviceStateRecordApi) => ({
    ...state,
    allowedValues: typeof state.allowedValues === 'string'
      ? (() => { try { return JSON.parse(state.allowedValues) as string[]; } catch { return []; } })()
      : Array.isArray(state.allowedValues) ? state.allowedValues : []
  }));
  return states;
};

const RuleEngineService = {
  getRules,
  getRuleDetails,
  createRule,
  updateRule,
  deleteRule,
  updateRuleNode,
  deleteRuleNode,
  createRuleNode,
  fetchSensors,
  fetchSensorDetails,
  fetchDevices,
  fetchDeviceStates,
};

export default RuleEngineService; 