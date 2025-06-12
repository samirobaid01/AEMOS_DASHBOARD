export interface Device {
  id: number;
  uuid: string;
  name: string;
  capabilities: Record<string, any>;
}

export interface DeviceState {
  id: number;
  deviceId: number;
  stateName: string;
  allowedValues: string;
  dataType: string;
  defaultValue: string;
  status: string;
} 