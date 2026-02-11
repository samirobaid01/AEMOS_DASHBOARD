import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { OrganizationState, Organization, OrganizationCreateRequest, OrganizationUpdateRequest, OrganizationFilterParams } from '../../types/organization';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
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
export const fetchOrganizations = createAsyncThunk<
  Awaited<ReturnType<typeof organizationsService.getOrganizations>>,
  OrganizationFilterParams | undefined,
  { rejectValue: ApiRejectPayload }
>(
  'organizations/fetchAll',
  async (params = undefined, { rejectWithValue }) => {
    try {
      return await organizationsService.getOrganizations(params);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch organizations') });
    }
  }
);

export const fetchOrganizationById = createAsyncThunk<
  Awaited<ReturnType<typeof organizationsService.getOrganizationById>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'organizations/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await organizationsService.getOrganizationById(id);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch organization') });
    }
  }
);

export const createOrganization = createAsyncThunk<
  Awaited<ReturnType<typeof organizationsService.createOrganization>>,
  OrganizationCreateRequest,
  { rejectValue: ApiRejectPayload }
>(
  'organizations/create',
  async (organizationData, { rejectWithValue }) => {
    try {
      return await organizationsService.createOrganization(organizationData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create organization') });
    }
  }
);

export const updateOrganization = createAsyncThunk<
  Awaited<ReturnType<typeof organizationsService.updateOrganization>>,
  { id: number; organizationData: OrganizationUpdateRequest },
  { rejectValue: ApiRejectPayload }
>(
  'organizations/update',
  async ({ id, organizationData }, { rejectWithValue }) => {
    try {
      return await organizationsService.updateOrganization(id, organizationData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update organization') });
    }
  }
);

export const deleteOrganization = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'organizations/delete',
  async (id, { rejectWithValue }) => {
    try {
      await organizationsService.deleteOrganization(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to delete organization') });
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
    builder.addCase(fetchOrganizations.fulfilled, (state, action: PayloadAction<Organization[]>) => {
      state.loading = false;
      state.organizations = action.payload;
    });
    builder.addCase(fetchOrganizations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Organization By ID
    builder.addCase(fetchOrganizationById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrganizationById.fulfilled, (state, action: PayloadAction<Organization>) => {
      state.loading = false;
      state.selectedOrganization = action.payload;
    });
    builder.addCase(fetchOrganizationById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Create Organization
    builder.addCase(createOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrganization.fulfilled, (state, action: PayloadAction<Organization>) => {
      state.loading = false;
      state.organizations.push(action.payload);
    });
    builder.addCase(createOrganization.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Update Organization
    builder.addCase(updateOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrganization.fulfilled, (state, action: PayloadAction<Organization>) => {
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
      state.error = action.payload?.message ?? null;
    });

    // Delete Organization
    builder.addCase(deleteOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteOrganization.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.organizations = state.organizations.filter((org) => org.id !== action.payload);
      if (state.selectedOrganization?.id === action.payload) {
        state.selectedOrganization = null;
      }
    });
    builder.addCase(deleteOrganization.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
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