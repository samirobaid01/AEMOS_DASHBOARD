import type { Sensor, SensorCreateRequest, SensorUpdateRequest, TelemetryDatatype } from '../../types/sensor';

export interface SensorListProps {
  sensors: Sensor[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  sensorTypes: string[];
  onAddSensor: () => void;
  windowWidth: number;
}

export interface SensorItemProps {
  sensor: Sensor;
  windowWidth: number;
}

export interface SensorFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  sensorTypes: string[];
  windowWidth: number;
}

export interface SensorDetailsProps {
  sensor: Sensor | null;
  isLoading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  windowWidth: number;
}

export interface TelemetryRowPayload {
  id?: number;
  variableName: string;
  datatype: TelemetryDatatype;
}

export interface SensorFormArea {
  id: number;
  name: string;
  organizationId: number;
}

export interface TelemetryRowFormState {
  id?: number;
  variableName: string;
  datatype: TelemetryDatatype | '';
}

export interface SensorFormProps {
  sensor?: Sensor | null;
  areas: SensorFormArea[];
  isLoading: boolean;
  error: string | null;
  telemetryError?: string | null;
  onSubmit: (data: SensorCreateRequest | SensorUpdateRequest, telemetryRows?: TelemetryRowFormState[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  windowWidth: number;
  isEditMode?: boolean;
}
