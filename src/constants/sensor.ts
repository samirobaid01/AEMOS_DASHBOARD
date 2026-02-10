export const ALLOWED_SENSOR_STATUSES = [
  'active',
  'inactive',
  'pending',
  'calibrating',
  'error',
  'disconnected',
  'retired',
] as const;

export type SensorStatus = (typeof ALLOWED_SENSOR_STATUSES)[number];
