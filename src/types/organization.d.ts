export interface Organization {
  id: number;
  name: string;
  parentId?: number | null;
  status: boolean;
  detail?: string;
  paymentMethods?: string;
  image?: string;
  address?: string;
  zip?: string;
  email?: string;
  isParent?: boolean;
  contactNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationCreateRequest {
  name: string;
  parentId?: number | null;
  status: boolean;
  detail?: string;
  paymentMethods?: string;
  image?: string;
  address?: string;
  zip?: string;
  email?: string;
  isParent?: boolean;
  contactNumber?: string;
}

export interface OrganizationUpdateRequest {
  name?: string;
  parentId?: number | null;
  status?: boolean;
  detail?: string;
  paymentMethods?: string;
  image?: string;
  address?: string;
  zip?: string;
  email?: string;
  isParent?: boolean;
  contactNumber?: string;
}

export interface OrganizationState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  loading: boolean;
  error: string | null;
}

export interface OrganizationFilterParams {
  search?: string;
  status?: boolean;
  parentId?: number;
  isParent?: boolean;
  page?: number;
  limit?: number;
} 