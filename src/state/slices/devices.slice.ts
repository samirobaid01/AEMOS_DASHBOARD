import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DeviceState, Device, DeviceCreateRequest, DeviceUpdateRequest, DeviceFilterParams } from '../../types/device';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { RootState } from '../store';
import * as devicesService from '../../services/devices.service';

// Initial state
const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchDevices = createAsyncThunk<
  Awaited<ReturnType<typeof devicesService.getDevices>>,
  DeviceFilterParams | undefined,
  { rejectValue: ApiRejectPayload }
>(
  'devices/fetchAll',
  async (params = undefined, { rejectWithValue }) => {
    try {
      return await devicesService.getDevices(params);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch devices') });
    }
  }
);

export const fetchDeviceById = createAsyncThunk<
  Awaited<ReturnType<typeof devicesService.getDeviceById>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'devices/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await devicesService.getDeviceById(id);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch device') });
    }
  }
);

export const fetchDevicesByOrganizationId = createAsyncThunk<
  Awaited<ReturnType<typeof devicesService.getDevicesByOrganizationId>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'devices/fetchByOrganizationId',
  async (organizationId, { rejectWithValue }) => {
    try {
      return await devicesService.getDevicesByOrganizationId(organizationId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch devices by organization') });
    }
  }
);

export const createDevice = createAsyncThunk<
  Awaited<ReturnType<typeof devicesService.createDevice>>,
  DeviceCreateRequest,
  { rejectValue: ApiRejectPayload }
>(
  'devices/create',
  async (deviceData, { rejectWithValue }) => {
    try {
      return await devicesService.createDevice(deviceData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create device') });
    }
  }
);

export const updateDevice = createAsyncThunk<
  Awaited<ReturnType<typeof devicesService.updateDevice>>,
  { id: number; deviceData: DeviceUpdateRequest },
  { rejectValue: ApiRejectPayload }
>(
  'devices/update',
  async ({ id, deviceData }, { rejectWithValue }) => {
    try {
      return await devicesService.updateDevice(id, deviceData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update device') });
    }
  }
);

export const deleteDevice = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'devices/delete',
  async (id, { rejectWithValue }) => {
    try {
      await devicesService.deleteDevice(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to delete device') });
    }
  }
);

// Slice
const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    clearSelectedDevice: (state) => {
      state.selectedDevice = null;
    },
    setSelectedDevice: (state, action: PayloadAction<Device>) => {
      state.selectedDevice = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Devices
    builder.addCase(fetchDevices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDevices.fulfilled, (state, action: PayloadAction<Device[]>) => {
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(fetchDevices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Devices By Organization ID
    builder.addCase(fetchDevicesByOrganizationId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDevicesByOrganizationId.fulfilled, (state, action: PayloadAction<Device[]>) => {
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(fetchDevicesByOrganizationId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Device By ID
    builder.addCase(fetchDeviceById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeviceById.fulfilled, (state, action: PayloadAction<Device>) => {
      state.loading = false;
      state.selectedDevice = action.payload;
    });
    builder.addCase(fetchDeviceById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Create Device
    builder.addCase(createDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDevice.fulfilled, (state, action: PayloadAction<Device>) => {
      state.loading = false;
      state.devices.push(action.payload);
    });
    builder.addCase(createDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Update Device
    builder.addCase(updateDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDevice.fulfilled, (state, action: PayloadAction<Device>) => {
      state.loading = false;
      const index = state.devices.findIndex((device) => device.id === action.payload.id);
      if (index !== -1) {
        state.devices[index] = action.payload;
      }
      if (state.selectedDevice?.id === action.payload.id) {
        state.selectedDevice = action.payload;
      }
    });
    builder.addCase(updateDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Delete Device
    builder.addCase(deleteDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDevice.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.devices = state.devices.filter((device) => device.id !== action.payload);
      if (state.selectedDevice?.id === action.payload) {
        state.selectedDevice = null;
      }
    });
    builder.addCase(deleteDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });
  },
});

export const { clearSelectedDevice, setSelectedDevice } = devicesSlice.actions;

// Selectors
export const selectDevices = (state: RootState) => state.devices.devices;
export const selectSelectedDevice = (state: RootState) => state.devices.selectedDevice;
export const selectDevicesLoading = (state: RootState) => state.devices.loading;
export const selectDevicesError = (state: RootState) => state.devices.error;

export default devicesSlice.reducer; 