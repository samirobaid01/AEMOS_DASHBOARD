import type { TelemetryVariable } from '../../types/sensor';
import type { DeviceState } from '../../state/slices/deviceDetails.slice';

export type EntityType = 'sensor' | 'device';

export interface MonitoredEntity {
  id: string;
  type: EntityType;
  entityId: number;
  uuid?: string;
  name: string;
  areaName: string;
  organizationName: string;
  telemetryVariables?: TelemetryVariable[];
  states?: DeviceState[];
}

export interface TelemetryValue {
  value: string | number | boolean;
  timestamp: string;
  isNew: boolean;
}

export interface EntityTelemetryData {
  connected: boolean;
  lastUpdate: string | null;
  values: Record<string, TelemetryValue>;
}

export interface TelemetryData {
  [entityId: string]: EntityTelemetryData;
}

export interface TelemetryFiltersProps {
  selectedOrgId: number | null;
  selectedAreaId: number | null;
  selectedSensorId: number | null;
  selectedDeviceId: number | null;
  organizations: Array<{ id: number; name: string }>;
  areas: Array<{ id: number; name: string; organizationId: number }>;
  sensors: Array<{ id: number; name: string; areaId?: number; description?: string; TelemetryData?: Array<{ id: number; variableName: string; datatype: string }> }>;
  devices: Array<{ id: number; name: string; uuid: string; areaId?: number; description?: string; states?: Array<{ id: number; stateName: string; dataType: string }> }>;
  onOrgChange: (orgId: number | null) => void;
  onAreaChange: (areaId: number | null) => void;
  onSensorChange: (sensorId: number | null) => void;
  onDeviceChange: (deviceId: number | null) => void;
  onAddEntity: () => void;
  canAdd: boolean;
  isLoading?: boolean;
}

export interface TelemetryTableProps {
  monitoredEntities: MonitoredEntity[];
  telemetryData: TelemetryData;
  onRemoveEntity: (entityId: string) => void;
  windowWidth: number;
}

export interface TelemetryRowProps {
  entity: MonitoredEntity;
  telemetryData: EntityTelemetryData;
  onRemove: (entityId: string) => void;
  isMobile: boolean;
}

export interface TelemetryDashboardProps {
  monitoredEntities: MonitoredEntity[];
  telemetryData: TelemetryData;
  organizations: Array<{ id: number; name: string }>;
  areas: Array<{ id: number; name: string; organizationId: number }>;
  sensors: Array<{ id: number; name: string; areaId?: number; description?: string; TelemetryData?: TelemetryVariable[] }>;
  devices: Array<{ id: number; name: string; uuid: string; areaId?: number; description?: string; states?: Array<{ id: number; stateName: string; dataType: string }> }>;
  selectedOrgId: number | null;
  selectedAreaId: number | null;
  selectedSensorId: number | null;
  selectedDeviceId: number | null;
  onOrgChange: (orgId: number | null) => void;
  onAreaChange: (areaId: number | null) => void;
  onSensorChange: (sensorId: number | null) => void;
  onDeviceChange: (deviceId: number | null) => void;
  onAddEntity: () => void;
  onRemoveEntity: (entityId: string) => void;
  windowWidth: number;
  isLoading?: boolean;
}
