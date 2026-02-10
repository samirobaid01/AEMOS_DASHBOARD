export type {
  Sensor,
  SensorCreateRequest,
  SensorUpdateRequest,
  SensorFilterParams,
  SensorState,
  TelemetryVariable,
  TelemetryCreateRequest,
  TelemetryUpdateRequest,
  TelemetryDatatype,
  SensorStatus,
} from './sensor.d';

import type { SensorStatus } from './sensor.d';

export const ALLOWED_SENSOR_STATUSES: readonly SensorStatus[] = [
  'active',
  'inactive',
  'pending',
  'calibrating',
  'error',
  'disconnected',
  'retired',
]; 