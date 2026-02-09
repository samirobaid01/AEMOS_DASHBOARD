export const ALLOWED_STATUSES = ['active', 'inactive', 'pending', 'maintenance', 'faulty', 'retired'] as const;

export const ALLOWED_DEVICE_TYPES = [
  'actuator',
  'controller',
  'gateway',
  'sensor_hub',
  'hybrid',
] as const;

export const ALLOWED_CONTROL_TYPES = ['binary', 'percentage', 'multistate', 'custom'] as const;

export const ALLOWED_PROTOCOLS = [
  'wifi',
  'ble',
  'lorawan',
  'zigbee',
  'modbus',
  'mqtt',
  'http',
  'coap',
] as const;

export const CONTROL_MODES = [
  'manual',
  'remote',
  'sensor',
  'scheduled',
  'automated',
] as const;

export const DEVICE_STATE_UI_TYPES = ['boolean', 'enum', 'range'] as const;

export type DeviceStatus = (typeof ALLOWED_STATUSES)[number];
export type DeviceType = (typeof ALLOWED_DEVICE_TYPES)[number];
export type ControlType = (typeof ALLOWED_CONTROL_TYPES)[number];
export type CommunicationProtocol = (typeof ALLOWED_PROTOCOLS)[number];
export type ControlMode = (typeof CONTROL_MODES)[number];
export type DeviceStateUIType = (typeof DEVICE_STATE_UI_TYPES)[number]; 