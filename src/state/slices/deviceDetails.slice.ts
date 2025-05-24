import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import deviceDetailsService from '../../services/deviceDetails.service';
import type { 
  DeviceStatus, 
  DeviceType, 
  ControlType, 
  CommunicationProtocol 
} from '../../constants/device';

export interface DeviceStateInstance {
  id?: number;
  deviceStateId?: number;
  value: string;
  fromTimestamp?: string;
  toTimestamp?: string | null;
  initiatedBy?: string;
  initiatorId?: number;
}

export interface DeviceState {
  id: number;
  deviceId: number;
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string;
  createdAt: string;
  instances: DeviceStateInstance[];
}

export interface DeviceDetails {
  id: number;
  name: string;
  description?: string;
  status: DeviceStatus;
  uuid?: string;
  organizationId: number;
  deviceType: DeviceType;
  controlType: ControlType;
  minValue?: number | null;
  maxValue?: number | null;
  defaultState?: string;
  communicationProtocol?: CommunicationProtocol;
  isCritical: boolean;
  metadata?: Record<string, any>;
  capabilities?: Record<string, any>;
  areaId?: number;
  controlModes?: string;
  createdAt: string;
  updatedAt: string;
  states: DeviceState[];
}

interface DeviceDetailsState {
  data: DeviceDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeviceDetailsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDeviceDetails = createAsyncThunk(
  'deviceDetails/fetchDeviceDetails',
  async ({ deviceId, organizationId }: { deviceId: number; organizationId: number }) => {
    return await deviceDetailsService.getDeviceDetails(deviceId, organizationId);
  }
);

export const updateDeviceState = createAsyncThunk(
  'deviceDetails/updateDeviceState',
  async ({ 
    deviceId, 
    stateId, 
    value,
    organizationId 
  }: { 
    deviceId: number; 
    stateId: number; 
    value: string;
    organizationId: number;
  }) => {
    return await deviceDetailsService.updateDeviceState(deviceId, stateId, value, organizationId);
  }
);

const deviceDetailsSlice = createSlice({
  name: 'deviceDetails',
  initialState,
  reducers: {
    clearDeviceDetails: (state) => {
      state.data = null;
      state.error = null;
    },
    updateDeviceStateLocally: (state, action: PayloadAction<{ stateId: number; value: string }>) => {
      if (state.data?.states) {
        const { stateId, value } = action.payload;
        const stateIndex = state.data.states.findIndex(s => s.id === stateId);
        if (stateIndex !== -1) {
          // Update the state's current value
          if (!state.data.states[stateIndex].instances) {
            state.data.states[stateIndex].instances = [];
          }
          if (state.data.states[stateIndex].instances.length === 0) {
            state.data.states[stateIndex].instances.push({
              value,
              fromTimestamp: new Date().toISOString()
            });
          } else {
            state.data.states[stateIndex].instances[0].value = value;
            state.data.states[stateIndex].instances[0].fromTimestamp = new Date().toISOString();
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('DeviceDetails payload', action.payload);
        console.log('DeviceDetails state', state.data);
      })
      .addCase(fetchDeviceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch device details';
      })
      .addCase(updateDeviceState.fulfilled, (state, action) => {
        if (state.data && state.data.states) {
          const updatedState = action.payload;
          const stateIndex = state.data.states.findIndex(s => s.id === updatedState.id);
          if (stateIndex !== -1) {
            state.data.states[stateIndex] = updatedState;
          }
        }
      });
  },
});

export const { clearDeviceDetails, updateDeviceStateLocally } = deviceDetailsSlice.actions;

export const selectDeviceDetails = (state: RootState) => state.deviceDetails.data;
export const selectDeviceDetailsLoading = (state: RootState) => state.deviceDetails.loading;
export const selectDeviceDetailsError = (state: RootState) => state.deviceDetails.error;

export default deviceDetailsSlice.reducer; 