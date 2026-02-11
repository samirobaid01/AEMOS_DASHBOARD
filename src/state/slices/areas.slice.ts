import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AreaState, Area, AreaCreateRequest, AreaUpdateRequest, AreaFilterParams } from '../../types/area';
import type { ApiRejectPayload } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { RootState } from '../store';
import * as areasService from '../../services/areas.service';

// Initial state
const initialState: AreaState = {
  areas: [],
  selectedArea: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAreas = createAsyncThunk<
  Awaited<ReturnType<typeof areasService.getAreas>>,
  AreaFilterParams | undefined,
  { rejectValue: ApiRejectPayload }
>(
  'areas/fetchAll',
  async (params = undefined, { rejectWithValue }) => {
    try {
      return await areasService.getAreas(params);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch areas') });
    }
  }
);

export const fetchAreaById = createAsyncThunk<
  Awaited<ReturnType<typeof areasService.getAreaById>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'areas/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await areasService.getAreaById(id);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch area') });
    }
  }
);

export const fetchAreasByOrganizationId = createAsyncThunk<
  Awaited<ReturnType<typeof areasService.getAreasByOrganizationId>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'areas/fetchByOrganizationId',
  async (organizationId, { rejectWithValue }) => {
    try {
      return await areasService.getAreasByOrganizationId(organizationId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch areas by organization') });
    }
  }
);

export const createArea = createAsyncThunk<
  Awaited<ReturnType<typeof areasService.createArea>>,
  AreaCreateRequest,
  { rejectValue: ApiRejectPayload }
>(
  'areas/create',
  async (areaData, { rejectWithValue }) => {
    try {
      return await areasService.createArea(areaData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to create area') });
    }
  }
);

export const updateArea = createAsyncThunk<
  Awaited<ReturnType<typeof areasService.updateArea>>,
  { id: number; areaData: AreaUpdateRequest },
  { rejectValue: ApiRejectPayload }
>(
  'areas/update',
  async ({ id, areaData }, { rejectWithValue }) => {
    try {
      return await areasService.updateArea(id, areaData);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to update area') });
    }
  }
);

export const deleteArea = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'areas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await areasService.deleteArea(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to delete area') });
    }
  }
);

// Slice
const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    clearSelectedArea: (state) => {
      state.selectedArea = null;
    },
    setSelectedArea: (state, action: PayloadAction<Area>) => {
      state.selectedArea = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Areas
    builder.addCase(fetchAreas.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAreas.fulfilled, (state, action: PayloadAction<Area[]>) => {
      state.loading = false;
      state.areas = action.payload;
    });
    builder.addCase(fetchAreas.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Areas By Organization ID
    builder.addCase(fetchAreasByOrganizationId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAreasByOrganizationId.fulfilled, (state, action: PayloadAction<Area[]>) => {
      state.loading = false;
      state.areas = action.payload;
    });
    builder.addCase(fetchAreasByOrganizationId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Fetch Area By ID
    builder.addCase(fetchAreaById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAreaById.fulfilled, (state, action: PayloadAction<Area>) => {
      state.loading = false;
      state.selectedArea = action.payload;
    });
    builder.addCase(fetchAreaById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Create Area
    builder.addCase(createArea.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createArea.fulfilled, (state, action: PayloadAction<Area>) => {
      state.loading = false;
      state.areas.push(action.payload);
    });
    builder.addCase(createArea.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Update Area
    builder.addCase(updateArea.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateArea.fulfilled, (state, action: PayloadAction<Area>) => {
      state.loading = false;
      const index = state.areas.findIndex((area) => area.id === action.payload.id);
      if (index !== -1) {
        state.areas[index] = action.payload;
      }
      if (state.selectedArea?.id === action.payload.id) {
        state.selectedArea = action.payload;
      }
    });
    builder.addCase(updateArea.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });

    // Delete Area
    builder.addCase(deleteArea.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteArea.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.areas = state.areas.filter((area) => area.id !== action.payload);
      if (state.selectedArea?.id === action.payload) {
        state.selectedArea = null;
      }
    });
    builder.addCase(deleteArea.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? null;
    });
  },
});

export const { clearSelectedArea, setSelectedArea } = areasSlice.actions;

// Selectors
export const selectAreas = (state: RootState) => state.areas.areas;
export const selectSelectedArea = (state: RootState) => state.areas.selectedArea;
export const selectAreasLoading = (state: RootState) => state.areas.loading;
export const selectAreasError = (state: RootState) => state.areas.error;

export default areasSlice.reducer; 