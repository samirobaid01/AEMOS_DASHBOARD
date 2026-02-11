import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
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

export const createDeviceStateInstance = createAsyncThunk<
  unknown,
  CreateDeviceStateInstancePayload,
  { rejectValue: ApiRejectPayload }
>(
  'deviceStateInstances/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createDeviceStateInstanceService(payload);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue({
        message: getErrorMessage(error, 'Failed to create device state instance'),
      });
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
        state.error = action.payload?.message ?? null;
      });
  }
});

// Selectors
export const selectDeviceStateInstancesLoading = (state: RootState) => state.deviceStateInstances.loading;
export const selectDeviceStateInstancesError = (state: RootState) => state.deviceStateInstances.error;
export const selectDeviceStateInstancesLastUpdated = (state: RootState) => state.deviceStateInstances.lastUpdated;

export const { clearError } = deviceStateInstancesSlice.actions;

export default deviceStateInstancesSlice.reducer; 