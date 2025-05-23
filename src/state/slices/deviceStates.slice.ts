import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import * as deviceStatesService from '../../services/deviceStates.service';

export interface DeviceState {
  id: number;
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string[];
  createdAt: string;
  updatedAt: string;
}

interface DeviceStatesState {
  states: DeviceState[];
  loading: boolean;
  error: string | null;
}

const initialState: DeviceStatesState = {
  states: [],
  loading: false,
  error: null
};

export const fetchDeviceStates = createAsyncThunk(
  'deviceStates/fetchByDeviceId',
  async ({ deviceId, organizationId }: { deviceId: number; organizationId: number }, { rejectWithValue }) => {
    try {
      return await deviceStatesService.getDeviceStates(deviceId, organizationId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch device states');
    }
  }
);

export const createDeviceState = createAsyncThunk(
  'deviceStates/create',
  async ({ deviceId, state }: { deviceId: number; state: Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'> }, { rejectWithValue }) => {
    try {
      return await deviceStatesService.createDeviceState(deviceId, state);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create device state');
    }
  }
);

const deviceStatesSlice = createSlice({
  name: 'deviceStates',
  initialState,
  reducers: {
    clearDeviceStates: (state) => {
      state.states = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Device States
    builder.addCase(fetchDeviceStates.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeviceStates.fulfilled, (state, action) => {
      state.loading = false;
      state.states = action.payload;
    });
    builder.addCase(fetchDeviceStates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Device State
    builder.addCase(createDeviceState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDeviceState.fulfilled, (state, action) => {
      state.loading = false;
      state.states.push(action.payload);
    });
    builder.addCase(createDeviceState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearDeviceStates } = deviceStatesSlice.actions;

export const selectDeviceStates = (state: RootState) => state.deviceStates.states;
export const selectDeviceStatesLoading = (state: RootState) => state.deviceStates.loading;
export const selectDeviceStatesError = (state: RootState) => state.deviceStates.error;

export default deviceStatesSlice.reducer; 