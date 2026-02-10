export interface Sensor {
  id: number;
  uuid?: string;
  name: string;
  areaId: number;
  type: string;
  status: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  area?: {
    id: number;
    name: string;
    organizationId: number;
  };
  TelemetryData?: TelemetryVariable[];
}

import type { SensorStatus } from '../constants/sensor';

export type { SensorStatus };

export type TelemetryDatatype = 'float' | 'int' | 'string' | 'boolean';

export interface TelemetryCreateRequest {
  variableName: string;
  datatype: TelemetryDatatype;
  sensorId: number;
}

export interface TelemetryUpdateRequest {
  variableName?: string;
  datatype?: TelemetryDatatype;
}

export interface TelemetryVariable {
  id: number;
  variableName: string;
  datatype: string;
  sensorId: number;
}

export interface SensorCreateRequest {
  name: string;
  areaId: number;
  status: SensorStatus | string;
  uuid?: string;
  description?: string;
}

export interface SensorUpdateRequest {
  name?: string;
  areaId?: number;
  status?: SensorStatus | string;
  description?: string;
  uuid?: string;
}

export interface SensorState {
  sensors: Sensor[];
  selectedSensor: Sensor | null;
  loading: boolean;
  error: string | null;
}

export interface SensorFilterParams {
  search?: string;
  status?: boolean;
  areaId?: number;
  type?: string;
  page?: number;
  limit?: number;
} 