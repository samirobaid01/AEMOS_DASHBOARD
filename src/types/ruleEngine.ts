// Import external types first
import type { Sensor } from './sensor';
import type { Device, DeviceState } from './device';

// Export them immediately
export type { Sensor, Device, DeviceState };

// Then define and export local types
export interface RuleNode {
  id: number;
  type: string;
  name?: string;
  config: string;
  nextNodeId: number | null;
}

export interface RuleChain {
  id: number;
  name: string;
  description: string;
  nodes: RuleNode[];
  createdAt: string;
  updatedAt: string;
}

export interface RuleChainCreatePayload {
  name: string;
  description: string;
  nodes?: RuleNode[];
}

export interface RuleChainUpdatePayload {
  name?: string;
  description?: string;
  nodes?: RuleNode[];
}

// Finally define the state that uses all the types
export interface RuleEngineState {
  rules: RuleChain[];
  selectedRule: RuleChain | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
  };
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceState[];
  sensorDetails: Sensor | null;
} 