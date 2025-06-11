import apiClient from './api/apiClient';
import type { RuleChain, RuleChainCreatePayload, RuleChainUpdatePayload } from '../types/ruleEngine';
import { withOrganizationId } from './api/organizationContext';

/**
 * Get all rule chains
 */
export const getRules = async () => {
  const params = withOrganizationId();
  const response = await apiClient.get('/rule-chains', { params });
  console.log('getRules: Response', response.data.data.rules);
  return response.data.data;
};

/**
 * Get rule chain by ID
 */
export const getRuleDetails = async (ruleId: number) => {
  const params = withOrganizationId();
  console.log('RuleEngineService - Fetching rule details:', { ruleId, params });
  const response = await apiClient.get(`/rule-chains/${ruleId}`, { params });
  console.log('RuleEngineService - Rule details response:', {
    status: response.status,
    data: response.data,
    ruleData: response.data.data,
    hasNodes: !!response.data.data?.nodes
  });
  return response.data.data;
};

/**
 * Create new rule chain
 */
export const createRule = async (payload: RuleChainCreatePayload) => {
  const params = withOrganizationId();
  const response = await apiClient.post('/rule-chains', payload, { params });
  return response.data.data;
};

/**
 * Update rule chain
 */
export const updateRule = async (ruleId: number, payload: RuleChainUpdatePayload) => {
  const params = withOrganizationId();
  const response = await apiClient.patch(`/rule-chains/${ruleId}`, payload, { params });
  return response.data.data;
};

/**
 * Delete rule chain
 */
export const deleteRule = async (ruleId: number) => {
  const params = withOrganizationId();
  const response = await apiClient.delete(`/rule-chains/${ruleId}`, { params });
  return response.data;
};

/**
 * Update rule node
 */
export const updateRuleNode = async (nodeId: number, payload: {
  type: string;
  config: string;
  nextNodeId: number | null;
}) => {
  const params = withOrganizationId();
  const response = await apiClient.patch(`/rule-chains/nodes/${nodeId}`, payload, { params });
  return response.data.data;
};

/**
 * Delete rule node
 */
export const deleteRuleNode = async (nodeId: number) => {
  const params = withOrganizationId();
  const response = await apiClient.delete(`/rule-chains/nodes/${nodeId}`, { params });
  return response.data;
};

const RuleEngineService = {
  getRules,
  getRuleDetails,
  createRule,
  updateRule,
  deleteRule,
  updateRuleNode,
  deleteRuleNode,
};

export default RuleEngineService; 