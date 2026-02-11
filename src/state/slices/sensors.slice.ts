import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SensorState,
  Sensor,
  SensorCreateRequest,
  SensorUpdateRequest,
  SensorFilterParams,
  TelemetryCreateRequest,
  TelemetryUpdateRequest,
} from '../../types/sensor';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { RootState } from '../store';
import * as sensorsService from '../../services/sensors.service';
import * as telemetryService from '../../services/telemetry.service';

// Initial state
const initialState: SensorState = {
  sensors: [],
  selectedSensor: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSensors = createAsyncThunk<
  Awaited<ReturnType<typeof sensorsService.getSensors>>,
  SensorFilterParams | undefined,
  { rejectValue: ApiRejectPayload }
>(
  'sensors/fetchAll',
  async (params = undefined, { rejectWithValue }) => {
    try {
      return await sensorsService.getSensors(params);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch sensors') });
    }
  }
);

export const fetchSensorById = createAsyncThunk<
  Awaited<ReturnType<typeof sensorsService.getSensorById>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'sensors/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await sensorsService.getSensorById(id);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch sensor') });
    }
  }
);

export const fetchSensorsByAreaId = createAsyncThunk<
  Awaited<ReturnType<typeof sensorsService.getSensorsByAreaId>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'sensors/fetchByAreaId',
  async (areaId, { rejectWithValue }) => {
    try {
      return await sensorsService.getSensorsByAreaId(areaId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch sensors by area') });
    }
  }
);

export const fetchSensorsByOrganizationId = createAsyncThunk<
  Awaited<ReturnType<typeof sensorsService.getSensorsByOrganizationId>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'sensors/fetchByOrganizationId',
  async (organizationId, { rejectWithValue }) => {
    try {
      return await sensorsService.getSensorsByOrganizationId(organizationId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch sensors by organization') });
    }
  }
);

export const createSensor = createAsyncThunk<
  Awaited<ReturnType<typeof sensorsService.createSensor>>,
  SensorCreateRequest,
  { rejectValue: ApiRejectPayload }
>(
  'sensors/create',
  async (sensorData, { rejectWithValue }) => {
    try {
      return await sensorsService.createSensor(sensorData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create sensor') });
    }
  }
);

export const updateSensor = createAsyncThunk<
  Awaited<ReturnType<typeof sensorsService.updateSensor>>,
  { id: number; sensorData: SensorUpdateRequest },
  { rejectValue: ApiRejectPayload }
>(
  'sensors/update',
  async ({ id, sensorData }, { rejectWithValue }) => {
    try {
      return await sensorsService.updateSensor(id, sensorData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update sensor') });
    }
  }
);

export const deleteSensor = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'sensors/delete',
  async (id, { rejectWithValue }) => {
    try {
      await sensorsService.deleteSensor(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to delete sensor') });
    }
  }
);

export const createTelemetry = createAsyncThunk<
  Awaited<ReturnType<typeof telemetryService.createTelemetry>>,
  TelemetryCreateRequest,
  { rejectValue: ApiRejectPayload }
>(
  'sensors/createTelemetry',
  async (data, { rejectWithValue }) => {
    try {
      return await telemetryService.createTelemetry(data);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create telemetry') });
    }
  }
);

export const updateTelemetry = createAsyncThunk<
  Awaited<ReturnType<typeof telemetryService.updateTelemetry>>,
  { id: number; data: TelemetryUpdateRequest },
  { rejectValue: ApiRejectPayload }
>(
  'sensors/updateTelemetry',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await telemetryService.updateTelemetry(id, data);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update telemetry') });
    }
  }
);

// Slice
const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    clearSelectedSensor: (state) => {
      state.selectedSensor = null;
    },
    setSelectedSensor: (state, action: PayloadAction<Sensor>) => {
      state.selectedSensor = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Sensors
    builder.addCase(fetchSensors.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSensors.fulfilled, (state, action: PayloadAction<Sensor[]>) => {
      state.loading = false;
      state.sensors = action.payload;
    });
    builder.addCase(fetchSensors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Sensors By Organization ID
    builder.addCase(fetchSensorsByOrganizationId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSensorsByOrganizationId.fulfilled, (state, action: PayloadAction<Sensor[]>) => {
      state.loading = false;
      state.sensors = action.payload;
    });
    builder.addCase(fetchSensorsByOrganizationId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Sensors By Area ID
    builder.addCase(fetchSensorsByAreaId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSensorsByAreaId.fulfilled, (state, action: PayloadAction<Sensor[]>) => {
      state.loading = false;
      state.sensors = action.payload;
    });
    builder.addCase(fetchSensorsByAreaId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Sensor By ID
    builder.addCase(fetchSensorById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSensorById.fulfilled, (state, action: PayloadAction<Sensor>) => {
      state.loading = false;
      state.selectedSensor = action.payload;
    });
    builder.addCase(fetchSensorById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Create Sensor
    builder.addCase(createSensor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSensor.fulfilled, (state, action: PayloadAction<Sensor>) => {
      state.loading = false;
      state.sensors.push(action.payload);
    });
    builder.addCase(createSensor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Update Sensor
    builder.addCase(updateSensor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSensor.fulfilled, (state, action: PayloadAction<Sensor>) => {
      state.loading = false;
      const index = state.sensors.findIndex((sensor) => sensor.id === action.payload.id);
      if (index !== -1) {
        state.sensors[index] = action.payload;
      }
      if (state.selectedSensor?.id === action.payload.id) {
        state.selectedSensor = action.payload;
      }
    });
    builder.addCase(updateSensor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Delete Sensor
    builder.addCase(deleteSensor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSensor.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.sensors = state.sensors.filter((sensor) => sensor.id !== action.payload);
      if (state.selectedSensor?.id === action.payload) {
        state.selectedSensor = null;
      }
    });
    builder.addCase(deleteSensor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });
  },
});

export const { clearSelectedSensor, setSelectedSensor } = sensorsSlice.actions;

// Selectors
export const selectSensors = (state: RootState) => state.sensors.sensors;
export const selectSelectedSensor = (state: RootState) => state.sensors.selectedSensor;
export const selectSensorsLoading = (state: RootState) => state.sensors.loading;
export const selectSensorsError = (state: RootState) => state.sensors.error;

export default sensorsSlice.reducer; 