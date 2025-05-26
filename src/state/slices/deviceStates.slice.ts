import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import * as deviceStatesService from '../../services/deviceStates.service';

export interface DeviceState {
  id: number;
  deviceId?: number;
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string[];
  createdAt: string;
  updatedAt: string;
  status?: 'active' | 'inactive' | 'suspended';
  device?: {
    name: string;
    uuid: string;
  };
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
      console.log('DeviceStates: Making API call', { deviceId, organizationId });
      const result = await deviceStatesService.getDeviceStates(deviceId, organizationId);
      console.log('DeviceStates: API response', result);
      return result;
    } catch (error: any) {
      console.error('DeviceStates: API error', error);
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

export const updateDeviceState = createAsyncThunk(
  'deviceStates/update',
  async ({ 
    deviceId, 
    stateId, 
    state 
  }: { 
    deviceId: number; 
    stateId: number; 
    state: Partial<Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>>
  }, { rejectWithValue }) => {
    try {
      return await deviceStatesService.updateDeviceState(deviceId, stateId, state);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update device state');
    }
  }
);

export const deactivateDeviceState = createAsyncThunk(
  'deviceStates/deactivate',
  async ({ deviceId, stateId }: { deviceId: number; stateId: number }, { rejectWithValue }) => {
    try {
      return await deviceStatesService.deactivateDeviceState(deviceId, stateId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate device state');
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
      console.log('DeviceStates: Fetch pending');
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeviceStates.fulfilled, (state, action) => {
      console.log('DeviceStates: Fetch fulfilled, updating state with payload:', action.payload);
      state.loading = false;
      state.states = action.payload;
      console.log('DeviceStates: State updated, new states:', state.states);
    });
    builder.addCase(fetchDeviceStates.rejected, (state, action) => {
      console.log('DeviceStates: Fetch rejected', action.payload);
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Device State
    builder.addCase(createDeviceState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDeviceState.fulfilled, (state, action) => {
      console.log('DeviceStates: Create fulfilled, adding state:', action.payload);
      state.loading = false;
      state.states.push(action.payload);
    });
    builder.addCase(createDeviceState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Device State
    builder.addCase(updateDeviceState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDeviceState.fulfilled, (state, action) => {
      console.log('DeviceStates: Update fulfilled, updating state:', action.payload);
      state.loading = false;
      const index = state.states.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.states[index] = action.payload;
      }
    });
    builder.addCase(updateDeviceState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Deactivate Device State
    builder.addCase(deactivateDeviceState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deactivateDeviceState.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.states = state.states.filter(s => s.id !== action.payload.stateId);
      }
    });
    builder.addCase(deactivateDeviceState.rejected, (state, action) => {
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