import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RuleChain, RuleEngineState, RuleChainCreatePayload, RuleChainUpdatePayload } from '../../types/ruleEngine';
import type { RootState } from '../store';
import RuleEngineService from '../../services/ruleEngineService';

// Initial state
const initialState: RuleEngineState = {
  rules: [],
  selectedRule: null,
  loading: false,
  error: null,
  filters: {
    search: '',
  },
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
  },
});

export const { setSearchFilter, clearSelectedRule, setSelectedRule } = ruleEngineSlice.actions;

// Selectors
export const selectRules = (state: RootState) => state.ruleEngine.rules;
export const selectSelectedRule = (state: RootState) => state.ruleEngine.selectedRule;
export const selectRuleEngineLoading = (state: RootState) => state.ruleEngine.loading;
export const selectRuleEngineError = (state: RootState) => state.ruleEngine.error;
export const selectRuleEngineSearchFilter = (state: RootState) => state.ruleEngine.filters.search;

export default ruleEngineSlice.reducer; 