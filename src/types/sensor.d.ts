export interface Sensor {
  id: number;
  name: string;
  areaId: number;
  type: string;
  status: boolean;
  description?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  area?: {
    id: number;
    name: string;
    organizationId: number;
  };
}

export interface SensorCreateRequest {
  name: string;
  areaId: number;
  type: string;
  status: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export interface SensorUpdateRequest {
  name?: string;
  areaId?: number;
  type?: string;
  status?: boolean;
  description?: string;
  metadata?: Record<string, any>;
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