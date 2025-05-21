import type { 
  DeviceStatus, 
  DeviceType, 
  ControlType, 
  CommunicationProtocol,
  ControlMode 
} from '../constants/device';

export interface Device {
  id: number;
  name: string;
  description?: string;
  status: DeviceStatus;
  uuid?: string;
  organizationId: number;
  deviceType: DeviceType;
  controlType: ControlType;
  minValue?: number | null;
  maxValue?: number | null;
  defaultState?: string;
  communicationProtocol?: CommunicationProtocol;
  isCritical: boolean;
  metadata?: Record<string, any>;
  capabilities?: Record<string, any>;
  areaId?: number;
  controlModes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCreateRequest {
  name: string;
  description?: string;
  status: DeviceStatus;
  organizationId: number;
  deviceType: DeviceType;
  controlType: ControlType;
  minValue?: number | null;
  maxValue?: number | null;
  defaultState?: string;
  communicationProtocol?: CommunicationProtocol;
  isCritical: boolean;
  metadata?: Record<string, any>;
  capabilities?: Record<string, any>;
  areaId?: number;
  controlModes?: string;
}

export interface DeviceUpdateRequest {
  name?: string;
  description?: string;
  status?: DeviceStatus;
  organizationId: number;
  deviceType?: DeviceType;
  controlType?: ControlType;
  minValue?: number | null;
  maxValue?: number | null;
  defaultState?: string;
  communicationProtocol?: CommunicationProtocol;
  isCritical?: boolean;
  metadata?: Record<string, any>;
  capabilities?: Record<string, any>;
  areaId?: number;
  controlModes?: string;
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