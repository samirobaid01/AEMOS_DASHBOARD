export const ALLOWED_STATUSES = ['active', 'inactive', 'pending'] as const;

export const ALLOWED_DEVICE_TYPES = [
  'actuator',
  'sensor',
  'gateway',
  'controller',
  'display'
] as const;

export const ALLOWED_CONTROL_TYPES = [
  'binary',
  'range',
  'multi-state',
  'continuous'
] as const;

export const ALLOWED_PROTOCOLS = [
  'wifi',
  'bluetooth',
  'zigbee',
  'zwave',
  'mqtt',
  'modbus',
  'bacnet'
] as const;

export const CONTROL_MODES = [
  'manual',
  'remote',
  'sensor',
  'scheduled',
  'automated'
] as const;

export const METADATA_SUGGESTED_KEYS = [
  'manufacturer',
  'model',
  'firmwareVersion',
  'installationDate',
  'location',
  'serialNumber'
] as const;

export const CAPABILITIES_SUGGESTED_KEYS = [
  'canSwitch',
  'canSetTemperature',
  'temperatureRange',
  'fanSpeeds',
  'modes',
  'supportedOperations'
] as const;

export type DeviceStatus = typeof ALLOWED_STATUSES[number];
export type DeviceType = typeof ALLOWED_DEVICE_TYPES[number];
export type ControlType = typeof ALLOWED_CONTROL_TYPES[number];
export type CommunicationProtocol = typeof ALLOWED_PROTOCOLS[number];
export type ControlMode = typeof CONTROL_MODES[number]; 