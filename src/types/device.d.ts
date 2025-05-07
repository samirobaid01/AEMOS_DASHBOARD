export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  organizationId: number;
  type: string;
  status: boolean;
  firmware?: string;
  description?: string;
  configuration?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  organization?: {
    id: number;
    name: string;
  };
}

export interface DeviceCreateRequest {
  name: string;
  serialNumber: string;
  organizationId: number;
  type: string;
  status: boolean;
  firmware?: string;
  description?: string;
  configuration?: Record<string, any>;
}

export interface DeviceUpdateRequest {
  name?: string;
  serialNumber?: string;
  organizationId?: number;
  type?: string;
  status?: boolean;
  firmware?: string;
  description?: string;
  configuration?: Record<string, any>;
}

export interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
}

export interface DeviceFilterParams {
  search?: string;
  status?: boolean;
  organizationId?: number;
  type?: string;
  page?: number;
  limit?: number;
} 