import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
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
export const fetchRules = createAsyncThunk(
  'ruleEngine/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      return await RuleEngineService.getRules();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rules');
    }
  }
);

export const fetchRuleDetails = createAsyncThunk(
  'ruleEngine/fetchRuleDetails',
  async (ruleId: number, { rejectWithValue }) => {
    try {
      const result = await RuleEngineService.getRuleDetails(ruleId);
      console.log('RuleEngine - Fetched rule details:', {
        ruleId,
        result,
        hasNodes: !!result?.nodes,
        nodes: result?.nodes
      });
      return result;
    } catch (error: any) {
      console.error('RuleEngine - Error fetching rule details:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rule details');
    }
  }
);

export const createRule = createAsyncThunk(
  'ruleEngine/createRule',
  async (payload: RuleChainCreatePayload, { rejectWithValue }) => {
    try {
      return await RuleEngineService.createRule(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rule');
    }
  }
);

export const updateRule = createAsyncThunk(
  'ruleEngine/updateRule',
  async ({ id, payload }: { id: number; payload: RuleChainUpdatePayload }, { rejectWithValue }) => {
    try {
      return await RuleEngineService.updateRule(id, payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rule');
    }
  }
);

export const deleteRule = createAsyncThunk(
  'ruleEngine/deleteRule',
  async (ruleId: number, { rejectWithValue }) => {
    try {
      await RuleEngineService.deleteRule(ruleId);
      return ruleId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rule');
    }
  }
);

export const createRuleNode = createAsyncThunk(
  'ruleEngine/createRuleNode',
  async (payload: {
    ruleChainId: number;
    type: string;
    name: string;
    config: string;
    nextNodeId: number | null;
  }, { rejectWithValue }) => {
    try {
      return await RuleEngineService.createRuleNode(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rule node');
    }
  }
);

export const updateRuleNode = createAsyncThunk(
  'ruleEngine/updateRuleNode',
  async ({ nodeId, payload }: { 
    nodeId: number;
    payload: {
      name: string;
      config: string;
      nextNodeId?: number | null;
    }
  }, { rejectWithValue }) => {
    try {
      return await RuleEngineService.updateRuleNode(nodeId, payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rule node');
    }
  }
);

export const deleteRuleNode = createAsyncThunk(
  'ruleEngine/deleteRuleNode',
  async (nodeId: number, { rejectWithValue }) => {
    try {
      await RuleEngineService.deleteRuleNode(nodeId);
      return nodeId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rule node');
    }
  }
);

export const fetchSensors = createAsyncThunk(
  'ruleEngine/fetchSensors',
  async (_, { rejectWithValue }) => {
    try {
      return await RuleEngineService.fetchSensors();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sensors');
    }
  }
);

export const fetchSensorDetails = createAsyncThunk(
  'ruleEngine/fetchSensorDetails',
  async (sensorId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const sensor = state.ruleEngine.sensors.find(s => s.id === sensorId);
      const sensorDetails = await RuleEngineService.fetchSensorDetails(sensorId);
      
      return {
        uuid: sensor?.uuid || '',
        sensorDetails
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sensor details');
    }
  }
);

export const fetchDevices = createAsyncThunk(
  'ruleEngine/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      return await RuleEngineService.fetchDevices();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch devices');
    }
  }
);

export const fetchDeviceStates = createAsyncThunk(
  'ruleEngine/fetchDeviceStates',
  async (deviceId: number, { rejectWithValue }) => {
    try {
      return await RuleEngineService.fetchDeviceStates(deviceId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch device states');
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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
      state.error = action.payload as string;
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