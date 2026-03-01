import type { TelemetryVariable, Sensor } from '../../types/sensor';
import type { Device } from '../../types/device';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
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
  organizations: Pick<Organization, 'id' | 'name'>[];
  areas: Pick<Area, 'id' | 'name' | 'organizationId'>[];
  sensors: Pick<Sensor, 'id' | 'name' | 'areaId' | 'description' | 'TelemetryData' | 'status'>[];
  devices: Pick<Device, 'id' | 'name' | 'uuid' | 'areaId' | 'description' | 'states'>[];
  onOrgChange: (orgId: number | null) => void;
  onAreaChange: (areaId: number | null) => void;
  onSensorChange: (sensorId: number | null) => void;
  onDeviceChange: (deviceId: number | null) => void;
  onClearFilters: () => void;
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
  organizations: Pick<Organization, 'id' | 'name'>[];
  areas: Pick<Area, 'id' | 'name' | 'organizationId'>[];
  sensors: Pick<Sensor, 'id' | 'name' | 'areaId' | 'description' | 'TelemetryData' | 'status'>[];
  devices: Pick<Device, 'id' | 'name' | 'uuid' | 'areaId' | 'description' | 'states'>[];
  selectedOrgId: number | null;
  selectedAreaId: number | null;
  selectedSensorId: number | null;
  selectedDeviceId: number | null;
  onOrgChange: (orgId: number | null) => void;
  onAreaChange: (areaId: number | null) => void;
  onSensorChange: (sensorId: number | null) => void;
  onDeviceChange: (deviceId: number | null) => void;
  onClearFilters: () => void;
  onAddEntity: () => void;
  onRemoveEntity: (entityId: string) => void;
  windowWidth: number;
  isLoading?: boolean;
}
