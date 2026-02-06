export interface Device {
  id: number;
  uuid: string;
  name: string;
  capabilities: Record<string, any>;
  status: string;
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