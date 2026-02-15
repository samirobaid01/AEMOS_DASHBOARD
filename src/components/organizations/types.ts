import type { Organization, OrganizationFilterParams, OrganizationCreateRequest, OrganizationUpdateRequest } from '../../types/organization';
import type { Area } from '../../types/area';
import type { Device } from '../../types/device';
import type { Sensor } from '../../types/sensor';
import type { FormErrors } from '../../types/ui';

export interface OrganizationListProps {
  organizations: Organization[];
  filteredOrganizations: Organization[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: OrganizationFilterParams['status'];
  setStatusFilter: (value: OrganizationFilterParams['status']) => void;
  onSubmitFilter: (e: React.FormEvent) => void;
  onClearFilter: () => void;
  onAddOrganization: () => void;
  isLoading: boolean;
  error: string | null;
  windowWidth: number;
}

export interface OrganizationItemProps {
  organization: Organization;
  windowWidth: number;
}

export interface OrganizationFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: OrganizationFilterParams['status'];
  setStatusFilter: (value: OrganizationFilterParams['status']) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  windowWidth: number;
}

export interface OrganizationDetailsProps {
  organization: Organization | null;
  areas: Area[];
  devices: Device[];
  sensors: Sensor[];
  isLoading: boolean;
  error: string | null;
  deleteModalOpen: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onDelete: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
}

export interface OrganizationCreateProps {
  formData: OrganizationCreateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

export interface OrganizationEditProps {
  formData: OrganizationUpdateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  organizationName?: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}
