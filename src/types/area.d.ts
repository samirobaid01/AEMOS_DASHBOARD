export interface Area {
  id: number;
  name: string;
  organizationId: number;
  description?: string;
  status: string;
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
  status: string;
}

export interface AreaUpdateRequest {
  name?: string;
  organizationId: number;
  description?: string;
  status?: string;
}

export interface AreaState {
  areas: Area[];
  selectedArea: Area | null;
  loading: boolean;
  error: string | null;
}

export interface AreaFilterParams {
  search?: string;
  status?: boolean;
  organizationId?: number;
  page?: number;
  limit?: number;
} 