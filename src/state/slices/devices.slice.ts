import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DeviceState, Device, DeviceCreateRequest, DeviceUpdateRequest, DeviceFilterParams } from '../../types/device';
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
export const fetchDevices = createAsyncThunk(
  'devices/fetchAll',
  async (params: DeviceFilterParams | undefined = undefined, { rejectWithValue }) => {
    try {
      return await devicesService.getDevices(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch devices');
    }
  }
);

export const fetchDeviceById = createAsyncThunk(
  'devices/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await devicesService.getDeviceById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch device');
    }
  }
);

export const fetchDevicesByOrganizationId = createAsyncThunk(
  'devices/fetchByOrganizationId',
  async (organizationId: number, { rejectWithValue }) => {
    try {
      return await devicesService.getDevicesByOrganizationId(organizationId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch devices by organization');
    }
  }
);

export const createDevice = createAsyncThunk(
  'devices/create',
  async (deviceData: DeviceCreateRequest, { rejectWithValue }) => {
    try {
      return await devicesService.createDevice(deviceData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create device');
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/update',
  async ({ id, deviceData }: { id: number; deviceData: DeviceUpdateRequest }, { rejectWithValue }) => {
    try {
      return await devicesService.updateDevice(id, deviceData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update device');
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await devicesService.deleteDevice(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete device');
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
    builder.addCase(fetchDevices.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(fetchDevices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Devices By Organization ID
    builder.addCase(fetchDevicesByOrganizationId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDevicesByOrganizationId.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(fetchDevicesByOrganizationId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Device By ID
    builder.addCase(fetchDeviceById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeviceById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedDevice = action.payload;
    });
    builder.addCase(fetchDeviceById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Device
    builder.addCase(createDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDevice.fulfilled, (state, action) => {
      state.loading = false;
      state.devices.push(action.payload);
    });
    builder.addCase(createDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Device
    builder.addCase(updateDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDevice.fulfilled, (state, action) => {
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
      state.error = action.payload as string;
    });

    // Delete Device
    builder.addCase(deleteDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDevice.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = state.devices.filter((device) => device.id !== action.payload);
      if (state.selectedDevice?.id === action.payload) {
        state.selectedDevice = null;
      }
    });
    builder.addCase(deleteDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
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