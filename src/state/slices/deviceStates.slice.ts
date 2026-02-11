import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { RootState } from '../store';
import type { DeviceStateRecord } from '../../types/device';
import * as deviceStatesService from '../../services/deviceStates.service';

export type DeviceState = DeviceStateRecord;

interface DeviceStatesState {
  states: DeviceStateRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: DeviceStatesState = {
  states: [],
  loading: false,
  error: null
};

export const fetchDeviceStates = createAsyncThunk<
  Awaited<ReturnType<typeof deviceStatesService.getDeviceStates>>,
  { deviceId: number; organizationId: number },
  { rejectValue: ApiRejectPayload }
>(
  'deviceStates/fetchByDeviceId',
  async ({ deviceId, organizationId }, { rejectWithValue }) => {
    try {
      const result = await deviceStatesService.getDeviceStates(deviceId, organizationId);
      return result;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch device states') });
    }
  }
);

export const createDeviceState = createAsyncThunk<
  Awaited<ReturnType<typeof deviceStatesService.createDeviceState>>,
  { deviceId: number; state: Omit<DeviceStateRecord, 'id' | 'createdAt' | 'updatedAt'> },
  { rejectValue: ApiRejectPayload }
>(
  'deviceStates/create',
  async ({ deviceId, state }, { rejectWithValue }) => {
    try {
      return await deviceStatesService.createDeviceState(deviceId, state);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create device state') });
    }
  }
);

export const updateDeviceState = createAsyncThunk<
  Awaited<ReturnType<typeof deviceStatesService.updateDeviceState>>,
  { deviceId: number; stateId: number; state: Partial<Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>> },
  { rejectValue: ApiRejectPayload }
>(
  'deviceStates/update',
  async ({ deviceId, stateId, state }, { rejectWithValue }) => {
    try {
      return await deviceStatesService.updateDeviceState(deviceId, stateId, state);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update device state') });
    }
  }
);

export const deactivateDeviceState = createAsyncThunk<
  Awaited<ReturnType<typeof deviceStatesService.deactivateDeviceState>>,
  { deviceId: number; stateId: number },
  { rejectValue: ApiRejectPayload }
>(
  'deviceStates/deactivate',
  async ({ deviceId, stateId }, { rejectWithValue }) => {
    try {
      return await deviceStatesService.deactivateDeviceState(deviceId, stateId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to deactivate device state') });
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
    builder.addCase(fetchDeviceStates.fulfilled, (state, action: PayloadAction<DeviceStateRecord[]>) => {
      state.loading = false;
      state.states = action.payload;
    });
    builder.addCase(fetchDeviceStates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Create Device State
    builder.addCase(createDeviceState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDeviceState.fulfilled, (state, action: PayloadAction<DeviceStateRecord>) => {
      state.loading = false;
      state.states.push(action.payload);
    });
    builder.addCase(createDeviceState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Update Device State
    builder.addCase(updateDeviceState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDeviceState.fulfilled, (state, action: PayloadAction<DeviceStateRecord>) => {
      state.loading = false;
      const index = state.states.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.states[index] = action.payload;
      }
    });
    builder.addCase(updateDeviceState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Deactivate Device State
    builder.addCase(deactivateDeviceState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deactivateDeviceState.fulfilled, (state, action: PayloadAction<{ success: boolean; stateId: number }>) => {
      state.loading = false;
      if (action.payload.success) {
        state.states = state.states.filter(s => s.id !== action.payload.stateId);
      }
    });
    builder.addCase(deactivateDeviceState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });
  }
});

export const { clearDeviceStates } = deviceStatesSlice.actions;

export const selectDeviceStates = (state: RootState) => state.deviceStates.states;
export const selectDeviceStatesLoading = (state: RootState) => state.deviceStates.loading;
export const selectDeviceStatesError = (state: RootState) => state.deviceStates.error;

export default deviceStatesSlice.reducer; 