import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { OrganizationState, Organization, OrganizationCreateRequest, OrganizationUpdateRequest, OrganizationFilterParams } from '../../types/organization';
import type { RootState } from '../store';
import * as organizationsService from '../../services/organizations.service';

// Initial state
const initialState: OrganizationState = {
  organizations: [],
  selectedOrganization: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchAll',
  async (params: OrganizationFilterParams | undefined = undefined, { rejectWithValue }) => {
    try {
      return await organizationsService.getOrganizations(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
    }
  }
);

export const fetchOrganizationById = createAsyncThunk(
  'organizations/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await organizationsService.getOrganizationById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization');
    }
  }
);

export const createOrganization = createAsyncThunk(
  'organizations/create',
  async (organizationData: OrganizationCreateRequest, { rejectWithValue }) => {
    try {
      return await organizationsService.createOrganization(organizationData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create organization');
    }
  }
);

export const updateOrganization = createAsyncThunk(
  'organizations/update',
  async ({ id, organizationData }: { id: number; organizationData: OrganizationUpdateRequest }, { rejectWithValue }) => {
    try {
      return await organizationsService.updateOrganization(id, organizationData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update organization');
    }
  }
);

export const deleteOrganization = createAsyncThunk(
  'organizations/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await organizationsService.deleteOrganization(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete organization');
    }
  }
);

// Slice
const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
    },
    setSelectedOrganization: (state, action: PayloadAction<Organization>) => {
      state.selectedOrganization = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Organizations
    builder.addCase(fetchOrganizations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrganizations.fulfilled, (state, action) => {
      state.loading = false;
      state.organizations = action.payload;
    });
    builder.addCase(fetchOrganizations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Organization By ID
    builder.addCase(fetchOrganizationById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrganizationById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrganization = action.payload;
    });
    builder.addCase(fetchOrganizationById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Organization
    builder.addCase(createOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrganization.fulfilled, (state, action) => {
      state.loading = false;
      state.organizations.push(action.payload);
    });
    builder.addCase(createOrganization.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Organization
    builder.addCase(updateOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrganization.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.organizations.findIndex((org) => org.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
      if (state.selectedOrganization?.id === action.payload.id) {
        state.selectedOrganization = action.payload;
      }
    });
    builder.addCase(updateOrganization.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Organization
    builder.addCase(deleteOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteOrganization.fulfilled, (state, action) => {
      state.loading = false;
      state.organizations = state.organizations.filter((org) => org.id !== action.payload);
      if (state.selectedOrganization?.id === action.payload) {
        state.selectedOrganization = null;
      }
    });
    builder.addCase(deleteOrganization.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSelectedOrganization, setSelectedOrganization } = organizationsSlice.actions;

// Selectors
export const selectOrganizations = (state: RootState) => state.organizations.organizations;
export const selectSelectedOrganization = (state: RootState) => state.organizations.selectedOrganization;
export const selectOrganizationsLoading = (state: RootState) => state.organizations.loading;
export const selectOrganizationsError = (state: RootState) => state.organizations.error;

export default organizationsSlice.reducer; 