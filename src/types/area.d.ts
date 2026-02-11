export type AreaStatus = 'active' | 'inactive' | 'under_review' | 'archived';

export interface Area {
  id: number;
  name: string;
  organizationId: number;
  description?: string;
  status: AreaStatus;
  createdAt?: string;
  updatedAt?: string;
  organization?: {
    id: number;
    name: string;
  };
}

export interface AreaCreateRequest {
  name: string;
  organizationId: number;
  description?: string;
  status: AreaStatus;
}

export interface AreaUpdateRequest {
  name?: string;
  organizationId: number;
  description?: string;
  status?: AreaStatus;
}

export interface AreaState {
  areas: Area[];
  selectedArea: Area | null;
  loading: boolean;
  error: string | null;
}

export interface AreaFilterParams {
  search?: string;
  status?: AreaStatus;
  organizationId?: number;
  page?: number;
  limit?: number;
} 