import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DeviceState, Device, DeviceCreateRequest, DeviceUpdateRequest, DeviceFilterParams } from '../../types/device';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { RootState } from '../store';
import * as devicesService from '../../services/devices.service';

function toNormalized(devices: Device[]): { byId: Record<string, Device>; allIds: string[] } {
  const byId: Record<string, Device> = {};
  const allIds: string[] = [];
  for (const d of devices) {
    const id = String(d.id);
    byId[id] = d;
    allIds.push(id);
  }
  return { byId, allIds };
}

const initialState: DeviceState = {
  byId: {},
  allIds: [],
  selectedDevice: null,
  loading: false,
  error: null,
};

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
    builder.addCase(fetchDevices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDevices.fulfilled, (state, action: PayloadAction<Device[]>) => {
      state.loading = false;
      const { byId, allIds } = toNormalized(action.payload);
      state.byId = byId;
      state.allIds = allIds;
    });
    builder.addCase(fetchDevices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    builder.addCase(fetchDevicesByOrganizationId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDevicesByOrganizationId.fulfilled, (state, action: PayloadAction<Device[]>) => {
      state.loading = false;
      const { byId, allIds } = toNormalized(action.payload);
      state.byId = byId;
      state.allIds = allIds;
    });
    builder.addCase(fetchDevicesByOrganizationId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    builder.addCase(fetchDeviceById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeviceById.fulfilled, (state, action: PayloadAction<Device>) => {
      state.loading = false;
      state.selectedDevice = action.payload;
      const id = String(action.payload.id);
      state.byId[id] = action.payload;
      if (!state.allIds.includes(id)) {
        state.allIds.push(id);
      }
    });
    builder.addCase(fetchDeviceById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    builder.addCase(createDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDevice.fulfilled, (state, action: PayloadAction<Device>) => {
      state.loading = false;
      const id = String(action.payload.id);
      state.byId[id] = action.payload;
      state.allIds.push(id);
    });
    builder.addCase(createDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    builder.addCase(updateDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDevice.fulfilled, (state, action: PayloadAction<Device>) => {
      state.loading = false;
      const id = String(action.payload.id);
      state.byId[id] = action.payload;
      if (state.selectedDevice?.id === action.payload.id) {
        state.selectedDevice = action.payload;
      }
    });
    builder.addCase(updateDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    builder.addCase(deleteDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDevice.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      const id = String(action.payload);
      delete state.byId[id];
      state.allIds = state.allIds.filter((x) => x !== id);
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

export const selectDevices = (state: RootState): Device[] =>
  state.devices.allIds
    .map((id) => state.devices.byId[id])
    .filter((d): d is Device => d != null);
export const selectSelectedDevice = (state: RootState) => state.devices.selectedDevice;
export const selectDevicesLoading = (state: RootState) => state.devices.loading;
export const selectDevicesError = (state: RootState) => state.devices.error;

export default devicesSlice.reducer;
