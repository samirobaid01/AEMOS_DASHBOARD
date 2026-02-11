import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { RootState } from '../store';
import type { RuleChain, RuleChainCreatePayload, RuleChainUpdatePayload } from '../../types/ruleEngine';
import type { Sensor } from '../../types/sensor';
import type { Device, DeviceStateRecord } from '../../types/device';
import RuleEngineService from '../../services/ruleEngineService';

interface RuleEngineState {
  rules: RuleChain[];
  selectedRule: RuleChain | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
  };
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId: number | null;
  sensorDetails: { [uuid: string]: Sensor };
}

// Initial state
const initialState: RuleEngineState = {
  rules: [],
  selectedRule: null,
  loading: false,
  error: null,
  filters: {
    search: '',
  },
  sensors: [],
  devices: [],
  deviceStates: [],
  lastFetchedDeviceId: null,
  sensorDetails: {},
};

// Async thunks
export const fetchRules = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.getRules>>,
  void,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      return await RuleEngineService.getRules();
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch rules') });
    }
  }
);

export const fetchRuleDetails = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.getRuleDetails>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/fetchRuleDetails',
  async (ruleId, { rejectWithValue }) => {
    try {
      return await RuleEngineService.getRuleDetails(ruleId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch rule details') });
    }
  }
);

export const createRule = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.createRule>>,
  RuleChainCreatePayload,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/createRule',
  async (payload, { rejectWithValue }) => {
    try {
      return await RuleEngineService.createRule(payload);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create rule') });
    }
  }
);

export const updateRule = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.updateRule>>,
  { id: number; payload: RuleChainUpdatePayload },
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/updateRule',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await RuleEngineService.updateRule(id, payload);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update rule') });
    }
  }
);

export const deleteRule = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/deleteRule',
  async (ruleId, { rejectWithValue }) => {
    try {
      await RuleEngineService.deleteRule(ruleId);
      return ruleId;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to delete rule') });
    }
  }
);

export const createRuleNode = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.createRuleNode>>,
  { ruleChainId: number; type: string; name: string; config: string; nextNodeId: number | null },
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/createRuleNode',
  async (payload, { rejectWithValue }) => {
    try {
      return await RuleEngineService.createRuleNode(payload);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create rule node') });
    }
  }
);

export const updateRuleNode = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.updateRuleNode>>,
  { nodeId: number; payload: { name: string; config: string; nextNodeId?: number | null } },
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/updateRuleNode',
  async ({ nodeId, payload }, { rejectWithValue }) => {
    try {
      return await RuleEngineService.updateRuleNode(nodeId, payload);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update rule node') });
    }
  }
);

export const deleteRuleNode = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/deleteRuleNode',
  async (nodeId, { rejectWithValue }) => {
    try {
      await RuleEngineService.deleteRuleNode(nodeId);
      return nodeId;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to delete rule node') });
    }
  }
);

export const fetchSensors = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.fetchSensors>>,
  void,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/fetchSensors',
  async (_, { rejectWithValue }) => {
    try {
      return await RuleEngineService.fetchSensors();
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch sensors') });
    }
  }
);

export const fetchSensorDetails = createAsyncThunk<
  { uuid: string; sensorDetails: Sensor },
  number,
  { rejectValue: ApiRejectPayload; state: RootState }
>(
  'ruleEngine/fetchSensorDetails',
  async (sensorId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const sensor = state.ruleEngine.sensors.find(s => s.id === sensorId);
      const sensorDetails = await RuleEngineService.fetchSensorDetails(sensorId);
      return {
        uuid: sensor?.uuid || '',
        sensorDetails
      };
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch sensor details') });
    }
  }
);

export const fetchDevices = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.fetchDevices>>,
  void,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      return await RuleEngineService.fetchDevices();
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch devices') });
    }
  }
);

export const fetchDeviceStates = createAsyncThunk<
  Awaited<ReturnType<typeof RuleEngineService.fetchDeviceStates>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'ruleEngine/fetchDeviceStates',
  async (deviceId, { rejectWithValue }) => {
    try {
      return await RuleEngineService.fetchDeviceStates(deviceId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch device states') });
    }
  }
);

// Slice
const ruleEngineSlice = createSlice({
  name: 'ruleEngine',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    clearSelectedRule: (state) => {
      state.selectedRule = null;
    },
    setSelectedRule: (state, action: PayloadAction<RuleChain>) => {
      state.selectedRule = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Rules
    builder.addCase(fetchRules.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRules.fulfilled, (state, action: PayloadAction<RuleChain[]>) => {
      state.loading = false;
      state.rules = action.payload;
    });
    builder.addCase(fetchRules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Rule Details
    builder.addCase(fetchRuleDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRuleDetails.fulfilled, (state, action: PayloadAction<RuleChain>) => {
      state.loading = false;
      state.selectedRule = action.payload;
    });
    builder.addCase(fetchRuleDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Create Rule
    builder.addCase(createRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRule.fulfilled, (state, action: PayloadAction<RuleChain>) => {
      state.loading = false;
      state.rules.push(action.payload);
    });
    builder.addCase(createRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Update Rule
    builder.addCase(updateRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRule.fulfilled, (state, action: PayloadAction<RuleChain>) => {
      state.loading = false;
      const index = state.rules.findIndex((rule) => rule.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
      if (state.selectedRule?.id === action.payload.id) {
        state.selectedRule = action.payload;
      }
    });
    builder.addCase(updateRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Delete Rule
    builder.addCase(deleteRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRule.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.rules = state.rules.filter((rule) => rule.id !== action.payload);
      if (state.selectedRule?.id === action.payload) {
        state.selectedRule = null;
      }
    });
    builder.addCase(deleteRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Create Rule Node
    builder.addCase(createRuleNode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRuleNode.fulfilled, (state, action) => {
      state.loading = false;
      if (state.selectedRule?.nodes) {
        state.selectedRule.nodes.push(action.payload);
      }
    });
    builder.addCase(createRuleNode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Update Rule Node
    builder.addCase(updateRuleNode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRuleNode.fulfilled, (state, action) => {
      state.loading = false;
      if (state.selectedRule?.nodes) {
        const index = state.selectedRule.nodes.findIndex(node => node.id === action.payload.id);
        if (index !== -1) {
          state.selectedRule.nodes[index] = action.payload;
        }
      }
    });
    builder.addCase(updateRuleNode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Sensors
    builder.addCase(fetchSensors.pending, (state) => {
      console.log('fetchSensors: pending');
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSensors.fulfilled, (state, action) => {
      console.log('fetchSensors: fulfilled', action.payload);
      state.loading = false;
      state.sensors = action.payload;
    });
    builder.addCase(fetchSensors.rejected, (state, action) => {
      console.log('fetchSensors: rejected', action.payload);
      state.loading = false;
      state.error = action.payload?.message ?? null;
      state.sensors = []; // Initialize to empty array on error
    });

    // Fetch Devices
    builder.addCase(fetchDevices.pending, (state) => {
      console.log('fetchDevices: pending');
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDevices.fulfilled, (state, action) => {
      console.log('fetchDevices: fulfilled', action.payload);
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(fetchDevices.rejected, (state, action) => {
      console.log('fetchDevices: rejected', action.payload);
      state.loading = false;
      state.error = action.payload?.message ?? null;
      state.devices = []; // Initialize to empty array on error
    });

    // Fetch Device States (do not set global loading; dialog has its own loading state)
    builder.addCase(fetchDeviceStates.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchDeviceStates.fulfilled, (state, action) => {
      state.lastFetchedDeviceId = action.meta.arg;
      state.deviceStates = action.payload;
    });
    builder.addCase(fetchDeviceStates.rejected, (state, action) => {
      state.error = action.payload?.message ?? null;
    });

    // Fetch Sensor Details (do not set global loading; UI that uses sensor details has its own loading state)
    builder.addCase(fetchSensorDetails.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchSensorDetails.fulfilled, (state, action) => {
      const { uuid, sensorDetails } = action.payload;
      if (uuid) {
        state.sensorDetails[uuid] = sensorDetails;
      }
    });
    builder.addCase(fetchSensorDetails.rejected, (state, action) => {
      state.error = action.payload?.message ?? null;
    });
  },
});

export const { setSearchFilter, clearSelectedRule, setSelectedRule } = ruleEngineSlice.actions;

// Selectors
export const selectRules = (state: RootState) => state.ruleEngine.rules;
export const selectSelectedRule = (state: RootState) => state.ruleEngine.selectedRule;
export const selectRuleEngineLoading = (state: RootState) => state.ruleEngine.loading;
export const selectRuleEngineError = (state: RootState) => state.ruleEngine.error;
export const selectRuleEngineSearchFilter = (state: RootState) => state.ruleEngine.filters.search;
export const selectSensors = (state: RootState) => state.ruleEngine.sensors;
export const selectDevices = (state: RootState) => state.ruleEngine.devices;
export const selectDeviceStates = (state: RootState) => state.ruleEngine.deviceStates;
export const selectLastFetchedDeviceId = (state: RootState) => state.ruleEngine.lastFetchedDeviceId;
export const selectSensorDetails = (state: RootState) => state.ruleEngine.sensorDetails;

export default ruleEngineSlice.reducer; 