import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SensorState, Sensor, SensorCreateRequest, SensorUpdateRequest, SensorFilterParams } from '../../types/sensor';
import type { RootState } from '../store';
import * as sensorsService from '../../services/sensors.service';

// Initial state
const initialState: SensorState = {
  sensors: [],
  selectedSensor: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSensors = createAsyncThunk(
  'sensors/fetchAll',
  async (params: SensorFilterParams | undefined = undefined, { rejectWithValue }) => {
    try {
      return await sensorsService.getSensors(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sensors');
    }
  }
);

export const fetchSensorById = createAsyncThunk(
  'sensors/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await sensorsService.getSensorById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sensor');
    }
  }
);

export const fetchSensorsByAreaId = createAsyncThunk(
  'sensors/fetchByAreaId',
  async (areaId: number, { rejectWithValue }) => {
    try {
      return await sensorsService.getSensorsByAreaId(areaId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sensors by area');
    }
  }
);

export const createSensor = createAsyncThunk(
  'sensors/create',
  async (sensorData: SensorCreateRequest, { rejectWithValue }) => {
    try {
      return await sensorsService.createSensor(sensorData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create sensor');
    }
  }
);

export const updateSensor = createAsyncThunk(
  'sensors/update',
  async ({ id, sensorData }: { id: number; sensorData: SensorUpdateRequest }, { rejectWithValue }) => {
    try {
      return await sensorsService.updateSensor(id, sensorData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update sensor');
    }
  }
);

export const deleteSensor = createAsyncThunk(
  'sensors/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await sensorsService.deleteSensor(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete sensor');
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
    builder.addCase(fetchSensors.fulfilled, (state, action) => {
      state.loading = false;
      state.sensors = action.payload;
    });
    builder.addCase(fetchSensors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Sensors By Area ID
    builder.addCase(fetchSensorsByAreaId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSensorsByAreaId.fulfilled, (state, action) => {
      state.loading = false;
      state.sensors = action.payload;
    });
    builder.addCase(fetchSensorsByAreaId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Sensor By ID
    builder.addCase(fetchSensorById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSensorById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedSensor = action.payload;
    });
    builder.addCase(fetchSensorById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Sensor
    builder.addCase(createSensor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSensor.fulfilled, (state, action) => {
      state.loading = false;
      state.sensors.push(action.payload);
    });
    builder.addCase(createSensor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Sensor
    builder.addCase(updateSensor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSensor.fulfilled, (state, action) => {
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
      state.error = action.payload as string;
    });

    // Delete Sensor
    builder.addCase(deleteSensor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSensor.fulfilled, (state, action) => {
      state.loading = false;
      state.sensors = state.sensors.filter((sensor) => sensor.id !== action.payload);
      if (state.selectedSensor?.id === action.payload) {
        state.selectedSensor = null;
      }
    });
    builder.addCase(deleteSensor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
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