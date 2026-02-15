import type { SelectOption } from './ui';

export type ConfigField =
  | { type: 'number'; key: string; label?: string; min?: number; max?: number }
  | { type: 'select'; key: string; label?: string; options: SelectOption[] }
  | { type: 'sensorKey'; key: string; label?: string }
  | { type: 'deviceKey'; key: string; label?: string }
  | { type: 'text'; key: string; label?: string; placeholder?: string }
  | { type: 'duration'; key: string; label?: string }
  | { type: 'operator'; key: string; label?: string; options: SelectOption[] }
  | { type: 'boolean'; key: string; label?: string };

export interface RuleNodeDefinition {
  type: 'filter' | 'action';
  label: string;
  icon?: string;
  configSchema: ConfigField[];
}

export interface RuleNode {
  id: number;
  ruleChainId: number;
  type: 'filter' | 'action';
  name: string;
  config: string;
  nextNodeId: number | null;
}

export interface RuleChain {
  id: number;
  organizationId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodes: RuleNode[];
}

export interface RuleChainCreatePayload {
  name: string;
  description: string;
  organizationId: number;
}

export interface RuleChainUpdatePayload extends Partial<RuleChainCreatePayload> {
  organizationId: number;
}

export interface RuleEngineState {
  rules: RuleChain[];
  selectedRule: RuleChain | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
  };
}

export interface DeviceCommandConfig {
  deviceUuid: string;
  stateName: string;
  value: string;
  initiatedBy: 'device';
}

export interface ActionNodeConfig {
  type: 'DEVICE_COMMAND';
  command: DeviceCommandConfig;
}

export interface NodeCreatePayload {
  ruleChainId?: number;
  id?: number;
  name?: string;
  type?: 'filter' | 'action';
  config?: string | Record<string, unknown>;
  nextNodeId?: number | null;
}

export interface NodeUpdatePayload {
  name?: string;
  type?: 'filter' | 'action';
  config?: string | Record<string, unknown>;
} 