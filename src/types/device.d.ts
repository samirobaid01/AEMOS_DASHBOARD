import type {
  CommunicationProtocol,
  ControlMode,
  DeviceStatus,
  DeviceType,
} from '../constants/device';

export type { ControlType } from '../constants/device';
import type { DeviceState as DeviceStateType } from '../state/slices/deviceDetails.slice';

export interface DeviceCapabilityState {
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string[];
}

export type DeviceCapabilities = Record<string, DeviceCapabilityState>;

export interface DeviceStateRecord {
  id: number;
  deviceId?: number;
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string[];
  createdAt?: string;
  updatedAt?: string;
  status?: 'active' | 'inactive' | 'suspended';
  device?: { name: string; uuid: string };
}

export interface Device {
  id: number;
  name: string;
  description?: string;
  status: DeviceStatus;
  uuid?: string;
  organizationId: number;
  deviceType: DeviceType;
  communicationProtocol?: CommunicationProtocol;
  isCritical: boolean;
  capabilities?: DeviceCapabilities;
  areaId?: number;
  controlModes?: string;
  createdAt?: string;
  updatedAt?: string;
  states?: DeviceStateType[];
  controlType?: string;
  defaultState?: string;
  minValue?: number | null;
  maxValue?: number | null;
}

export interface DeviceCreateRequest {
  name: string;
  description?: string;
  status: DeviceStatus;
  organizationId: number;
  deviceType: DeviceType;
  communicationProtocol?: CommunicationProtocol;
  isCritical: boolean;
  capabilities?: DeviceCapabilities;
  areaId?: number;
  controlModes?: string;
  uuid?: string;
}

export interface DeviceUpdateRequest {
  name?: string;
  description?: string;
  status?: DeviceStatus;
  organizationId: number;
  deviceType?: DeviceType;
  communicationProtocol?: CommunicationProtocol;
  isCritical?: boolean;
  capabilities?: DeviceCapabilities;
  areaId?: number;
  controlModes?: string;
  uuid?: string;
}

export interface DeviceFilters {
  organizationId?: number;
  areaId?: number;
  status?: DeviceStatus;
  deviceType?: DeviceType;
  search?: string;
}

export interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
}

export interface DeviceFilterParams {
  organizationId?: number;
  areaId?: number;
  status?: DeviceStatus;
  deviceType?: DeviceType;
  search?: string;
} 