import type { RuleChain } from '../../types/ruleEngine';
import type { Device, DeviceStateRecord } from '../../types/device';
import type { Sensor } from '../../types/sensor';
import type { NodeCreatePayload, NodeUpdatePayload } from '../../types/ruleEngine';

export interface RuleFormSubmitData {
  name?: string;
  description?: string;
  organizationId?: number;
  nodes?: unknown;
}

export interface NodeDialogInitialExpression {
  id?: number;
  name?: string;
  type?: 'filter' | 'action';
  sourceType?: string;
  UUID?: string;
  key?: string;
  operator?: string;
  value?: string | number;
  duration?: string | number;
  config?: string;
}

export interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: NodeCreatePayload) => void;
  onUpdate?: (nodeId: number, data: NodeUpdatePayload) => void;
  ruleChainId?: number;
  mode: 'add' | 'edit';
  initialExpression?: NodeDialogInitialExpression;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}

export interface ActionDialogInitialData {
  type: 'action';
  name?: string;
  config: {
    type: 'DEVICE_COMMAND';
    command: {
      deviceUuid: string;
      stateName: string;
      value: string;
      initiatedBy: 'device';
    };
  };
}

export interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: NodeCreatePayload | NodeUpdatePayload) => void;
  ruleChainId: number;
  mode?: 'add' | 'edit';
  initialData?: ActionDialogInitialData;
  devices: Device[];
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId: number | null;
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}

export interface RuleFormProps {
  initialData?: RuleChain;
  ruleChainId?: number;
  onSubmit: (data: RuleFormSubmitData) => Promise<void>;
  onNodeDelete: (nodeId: number) => Promise<void>;
  onNodeCreate: (data: NodeCreatePayload) => Promise<void>;
  onNodeUpdate: (nodeId: number, data: NodeUpdatePayload) => Promise<void>;
  isLoading?: boolean;
  showNodeSection?: boolean;
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId?: number | null;
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}

export interface RuleDetailsProps {
  rule: RuleChain | null;
  isLoading: boolean;
  error?: string | null;
  onBack?: () => void;
  onEdit: (ruleId: number) => void;
  onDelete: (ruleId: number) => Promise<void>;
  onNextNodeChange: (nodeId: number, nextNodeId: number | null) => Promise<void>;
  windowWidth?: number;
}

export interface RuleListProps {
  rules: RuleChain[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddRule: () => void;
  windowWidth?: number;
}

export interface RuleItemProps {
  rule: RuleChain;
  windowWidth: number;
}

export interface RuleFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  windowWidth?: number;
}

export interface RuleCreateProps {
  onSubmit: (data: RuleFormSubmitData) => Promise<void>;
  onFinish: () => void;
  isLoading?: boolean;
  ruleChainId: number | null;
  showNodeSection: boolean;
  onNodeDelete: (nodeId: number) => Promise<void>;
  onNodeCreate: (data: NodeCreatePayload) => Promise<void>;
  onNodeUpdate: (nodeId: number, data: NodeUpdatePayload) => Promise<void>;
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId: number | null;
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}

export interface RuleEditProps {
  rule: RuleChain | null;
  isLoading: boolean;
  error?: string | null;
  onSubmit: (data: RuleFormSubmitData) => Promise<void>;
  windowWidth?: number;
  ruleChainId: number;
  onNodeDelete: (nodeId: number) => Promise<void>;
  onNodeCreate: (data: NodeCreatePayload) => Promise<void>;
  onNodeUpdate: (nodeId: number, data: NodeUpdatePayload) => Promise<void>;
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId: number | null;
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}
