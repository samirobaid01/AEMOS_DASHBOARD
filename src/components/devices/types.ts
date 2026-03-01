import type { Device, DeviceCapabilities, DeviceCreateRequest, DeviceUpdateRequest, DeviceStateRecord } from '../../types/device';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import type { FormErrors } from '../../types/ui';
import type { DeviceType } from '../../constants/device';

export interface DeviceStatePayload {
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string[];
}

export interface DeviceStateSelection {
  id: number;
  name: string;
  value: string;
  defaultValue: string;
  allowedValues: string[];
}

export type DeviceStateForClick = import('../../state/slices/deviceDetails.slice').DeviceState;

export interface DeviceDetailsProps {
  device: Device | null;
  organization: Organization | null;
  area: Area | null;
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  deleteModalOpen: boolean;
  onDelete: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
  onNavigateBack: () => void;
  onStateButtonClick: (state: DeviceStateForClick) => void;
  selectedState: DeviceStateSelection | null;
  onStateModalClose: () => void;
  onStateModalSave: (value: string) => void;
  isStateUpdating: boolean;
  isSocketConnected: boolean;
  socketError: Error | null;
}

export interface DeviceListProps {
  devices: Device[];
  filteredDevices: Device[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: DeviceType | '';
  setTypeFilter: (filter: DeviceType | '') => void;
  deviceTypes: DeviceType[];
  onAddDevice: () => void;
  isLoading: boolean;
  error: string | null;
  windowWidth: number;
}

export interface DeviceItemProps {
  device: Device;
  isMobile: boolean;
  className?: string;
}

export interface DeviceFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: DeviceType | '';
  setTypeFilter: (filter: DeviceType | '') => void;
  deviceTypes: DeviceType[];
  isMobile: boolean;
}

export interface DeviceCreateProps {
  currentStep: 1 | 2 | 3;
  formData: DeviceCreateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  error: string | null;
  organizations: Organization[];
  areas: Area[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onControlModesChange: (modes: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  createdDeviceId: number | null;
  statesError: string | null;
  statesLoading: boolean;
  onStatesNext: (payload: DeviceStatePayload) => void;
  onStatesFinish: (payload: DeviceStatePayload) => void;
  onStatesCancel: () => void;
  capabilities: DeviceCapabilities;
  capabilitiesSaving: boolean;
  capabilitiesError: string | null;
  onSaveCapabilities: () => void;
  onCapabilitiesClose: () => void;
}

export interface DeviceEditProps {
  formData: DeviceUpdateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  deviceName: string | undefined;
  organizations: Organization[];
  areas: Area[];
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onControlModesChange: (modes: string[]) => void;
}

export interface DeviceIdentityFormProps {
  formData: DeviceCreateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  error: string | null;
  organizations: Organization[];
  areas: Area[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onControlModesChange: (modes: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
  className?: string;
}

export interface DeviceStateManagerProps {
  states: DeviceStateRecord[];
  onAddState: (state: Omit<DeviceStateRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateState: (stateId: number, state: Partial<Omit<DeviceStateRecord, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  onDeactivateState: (stateId: number) => void;
  isLoading: boolean;
  error: string | null;
}

export interface DeviceStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateName: string;
  currentValue: string;
  defaultValue: string;
  allowedValues: string[];
  onSave: (value: string) => void;
  isLoading: boolean;
}

export interface DeviceStatesModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
  onNext: (payload: DeviceStatePayload) => void;
  onFinish: (payload: DeviceStatePayload) => void;
  onCancel: () => void;
}

export interface CapabilitiesSummaryModalProps {
  isOpen: boolean;
  capabilities: DeviceCapabilities | string;
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onClose: () => void;
}

export interface ErrorDisplayProps {
  errorMessage: string;
}
