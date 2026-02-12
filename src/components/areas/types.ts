import type { Area, AreaCreateRequest, AreaUpdateRequest } from '../../types/area';
import type { Organization } from '../../types/organization';
import type { FormErrors } from '../../types/ui';

export interface AreaListProps {
  areas: Area[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  organizationFilter: string;
  setOrganizationFilter: (value: string) => void;
  organizations: string[];
  onAddArea: () => void;
  windowWidth: number;
}

export interface AreaListComponentProps {
  areas: Area[];
  filteredAreas: Area[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  organizationFilter: string;
  setOrganizationFilter: (filter: string) => void;
  organizations: string[];
  onAddArea: () => void;
  isLoading: boolean;
  error: string | null;
  windowWidth: number;
}

export interface AreaItemProps {
  area: Area;
  windowWidth: number;
}

export interface AreaFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  organizationFilter: string;
  setOrganizationFilter: (value: string) => void;
  organizations: string[];
  windowWidth: number;
}

export interface AreaDetailsProps {
  area: Area | null;
  isLoading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  windowWidth: number;
}

export interface AreaFormOrganization {
  id: number;
  name: string;
}

export interface ExtendedAreaCreateRequest extends AreaCreateRequest {
  parentAreaId?: number;
}

export interface ExtendedAreaUpdateRequest extends AreaUpdateRequest {
  parentAreaId?: number;
}

export interface AreaFormProps {
  area?: Area | null;
  organizations: AreaFormOrganization[];
  parentAreas?: Area[];
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: ExtendedAreaCreateRequest | ExtendedAreaUpdateRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  windowWidth: number;
  isEditMode?: boolean;
}

export interface AreaCreateProps {
  formData: AreaCreateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  error: string | null;
  organizations: Organization[];
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

export interface AreaEditProps {
  formData: AreaUpdateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  areaName?: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}
