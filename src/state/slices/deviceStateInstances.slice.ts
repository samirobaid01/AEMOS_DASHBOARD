import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { createDeviceStateInstance as createDeviceStateInstanceService, 
  type CreateDeviceStateInstancePayload } from '../../services/deviceStateInstances.service';

interface DeviceStateInstancesState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DeviceStateInstancesState = {
  loading: false,
  error: null,
  lastUpdated: null
};

export const createDeviceStateInstance = createAsyncThunk(
  'deviceStateInstances/create',
  async (payload: CreateDeviceStateInstancePayload, { rejectWithValue }) => {
    try {
      const response = await createDeviceStateInstanceService(payload);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create device state instance');
    }
  }
);

const deviceStateInstancesSlice = createSlice({
  name: 'deviceStateInstances',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDeviceStateInstance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeviceStateInstance.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createDeviceStateInstance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      });
  }
});

// Selectors
export const selectDeviceStateInstancesLoading = (state: RootState) => state.deviceStateInstances.loading;
export const selectDeviceStateInstancesError = (state: RootState) => state.deviceStateInstances.error;
export const selectDeviceStateInstancesLastUpdated = (state: RootState) => state.deviceStateInstances.lastUpdated;

export const { clearError } = deviceStateInstancesSlice.actions;

export default deviceStateInstancesSlice.reducer; 