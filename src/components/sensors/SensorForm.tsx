import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ALLOWED_SENSOR_STATUSES } from '../../types/sensor';
import type { Sensor, SensorCreateRequest, SensorUpdateRequest, TelemetryDatatype } from '../../types/sensor';
import FormField from '../common/FormField';
import FormActions from '../common/FormActions';
import Button from '../common/Button/Button';

export interface TelemetryRowPayload {
  id?: number;
  variableName: string;
  datatype: TelemetryDatatype;
}

interface Area {
  id: number;
  name: string;
  organizationId: number;
}

export interface TelemetryRowFormState {
  id?: number;
  variableName: string;
  datatype: TelemetryDatatype | '';
}

interface SensorFormProps {
  sensor?: Sensor | null;
  areas: Area[];
  isLoading: boolean;
  error: string | null;
  telemetryError?: string | null;
  onSubmit: (data: SensorCreateRequest | SensorUpdateRequest, telemetryRows?: TelemetryRowFormState[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  windowWidth: number;
  isEditMode?: boolean;
}

const TELEMETRY_DATATYPES: TelemetryDatatype[] = ['float', 'int', 'string', 'boolean'];

const SensorForm: React.FC<SensorFormProps> = ({
  sensor,
  areas = [],
  error,
  telemetryError = null,
  onSubmit,
  onCancel,
  isSubmitting,
  windowWidth,
  isEditMode = false,
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;
  const safeAreas = Array.isArray(areas) ? areas : [];

  const [formData, setFormData] = React.useState<SensorCreateRequest | SensorUpdateRequest>({
    name: sensor?.name || '',
    areaId: sensor?.areaId || (safeAreas.length > 0 ? safeAreas[0].id : 0),
    status: sensor?.status !== undefined ? sensor.status : 'pending',
    description: sensor?.description || '',
    uuid: sensor?.uuid || '',
  });

  const [telemetryRows, setTelemetryRows] = React.useState<TelemetryRowFormState[]>([
    { variableName: '', datatype: '' },
  ]);

  React.useEffect(() => {
    if (isEditMode && sensor) {
      setFormData((prev) => ({
        ...prev,
        name: sensor.name ?? prev.name,
        areaId: sensor.areaId ?? prev.areaId,
        status: sensor.status !== undefined ? sensor.status : prev.status,
        description: sensor.description ?? prev.description,
        uuid: sensor.uuid ?? prev.uuid,
      }));
    }
  }, [isEditMode, sensor?.id, sensor?.name, sensor?.areaId, sensor?.status, sensor?.description, sensor?.uuid]);

  React.useEffect(() => {
    if (isEditMode && sensor?.TelemetryData?.length) {
      const rows = sensor.TelemetryData.map((t) => ({
        id: t.id,
        variableName: t.variableName,
        datatype: (t.datatype as TelemetryDatatype) || '',
      }));
      setTelemetryRows([...rows, { variableName: '', datatype: '' }]);
    }
  }, [isEditMode, sensor?.TelemetryData]);

  const handleAddTelemetryRow = () => {
    setTelemetryRows((prev) => [...prev, { variableName: '', datatype: '' }]);
  };

  const handleRemoveTelemetryRow = (index: number) => {
    setTelemetryRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleTelemetryRowChange = (index: number, field: 'variableName' | 'datatype', value: string) => {
    setTelemetryRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGenerateUuid = () => {
    setFormData({
      ...formData,
      uuid: crypto.randomUUID?.() ?? '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData }, telemetryRows);
  };

  const formStyle = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    overflow: 'hidden',
  };

  const headerStyle = {
    backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
    padding: '1.5rem',
    borderBottom: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
  };

  const headerTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    margin: 0,
  };

  const headerDescriptionStyle = {
    fontSize: '0.875rem',
    color: darkMode ? colors.textSecondary : '#6b7280',
    marginTop: '0.5rem',
  };

  const bodyStyle = {
    padding: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#374151',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827',
    outline: 'none',
  };

  const selectStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    outline: 'none',
  } as React.CSSProperties;

  const textareaStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827',
    outline: 'none',
    minHeight: '6rem',
    resize: 'vertical' as const,
  };

  const errorMessageStyle = {
    backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
    color: darkMode ? colors.dangerText : '#b91c1c',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
  };

  const metadataItemStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  };

  const metadataButtonStyle = {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'center' as const,
    backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
    color: 'white',
    border: 'none',
    marginTop: '0.5rem',
  };

  return (
    <div style={{ 
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      backgroundColor: darkMode ? colors.background : 'transparent'  
    }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <div style={formStyle}>
          <div style={headerStyle}>
            <h2 style={headerTitleStyle}>
              {isEditMode ? t('sensors.edit') : t('sensors.add')}
            </h2>
            <p style={headerDescriptionStyle}>
              {isEditMode ? t('sensors.editSensorDescription') : t('sensors.addSensorDescription')}
            </p>
          </div>

          <div style={bodyStyle}>
            {error && (
              <div style={errorMessageStyle}>
                {error}
              </div>
            )}

            <FormField label={t('sensors.name')} id="name" required>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                  e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
                }}
              />
            </FormField>

            {!isEditMode && (
              <FormField label={t('sensors.uuid')} id="uuid">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    id="uuid"
                    name="uuid"
                    value={formData.uuid ?? ''}
                    onChange={handleChange}
                    placeholder={t('sensors.uuidPlaceholder')}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                      e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateUuid}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {t('sensors.generateUuid')}
                  </Button>
                </div>
              </FormField>
            )}

            <FormField label={t('sensors.area')} id="areaId" required>
              <select
                id="areaId"
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                required
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                  e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
                }}
              >
                <option value="" disabled>
                  {t('sensors.selectArea')}
                </option>
                {Array.isArray(safeAreas) ? safeAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                )) : null}
              </select>
            </FormField>

            <FormField label={t('sensors.status')} id="status" required>
              <select
                id="status"
                name="status"
                value={formData.status ?? 'pending'}
                onChange={handleChange}
                required
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                  e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
                }}
              >
                {ALLOWED_SENSOR_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label={t('sensors.description')} id="description">
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                style={textareaStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                  e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
                }}
              />
            </FormField>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                {isEditMode ? t('sensors.telemetryData') : t('sensors.initialTelemetry')}
              </label>
              <p style={headerDescriptionStyle}>
                {isEditMode ? t('sensors.editTelemetryDescription') : t('sensors.initialTelemetryDescription')}
              </p>
                {telemetryError && (
                  <div style={{ ...errorMessageStyle, marginBottom: '0.75rem' }}>{telemetryError}</div>
                )}
                {telemetryRows.map((row, index) => (
                  <div key={index} style={{ ...metadataItemStyle, alignItems: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label htmlFor={`telemetryVariableName-${index}`} style={{ ...labelStyle, marginBottom: '0.25rem' }}>
                        {t('sensors.variableName')}
                      </label>
                      <input
                        type="text"
                        id={`telemetryVariableName-${index}`}
                        value={row.variableName}
                        onChange={(e) => handleTelemetryRowChange(index, 'variableName', e.target.value)}
                        placeholder={t('sensors.variableNamePlaceholder')}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                          e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = 'none';
                          e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label htmlFor={`telemetryDatatype-${index}`} style={{ ...labelStyle, marginBottom: '0.25rem' }}>
                        {t('sensors.datatype')}
                      </label>
                      <select
                        id={`telemetryDatatype-${index}`}
                        value={row.datatype}
                        onChange={(e) => handleTelemetryRowChange(index, 'datatype', e.target.value || '')}
                        style={selectStyle}
                        onFocus={(e) => {
                          e.target.style.boxShadow = `0 0 0 3px ${darkMode ? 'rgba(77, 126, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                          e.target.style.borderColor = darkMode ? '#4d7efa' : '#3b82f6';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = 'none';
                          e.target.style.borderColor = darkMode ? colors.border : '#d1d5db';
                        }}
                      >
                        <option value="">{t('sensors.selectDatatype')}</option>
                        {TELEMETRY_DATATYPES.map((dt) => (
                          <option key={dt} value={dt}>
                            {dt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveTelemetryRow(index)}
                      title={t('sensors.removeTelemetry')}
                      style={{
                        height: '2.25rem',
                        flexShrink: 0,
                        minWidth: '2rem',
                        padding: '0.25rem',
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={handleAddTelemetryRow} style={metadataButtonStyle}>
                  {t('sensors.addTelemetry')}
                </Button>
              </div>

            <FormActions>
              <Button type="button" variant="secondary" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? t('updating')
                    : t('creating')
                  : isEditMode
                  ? t('common.update')
                  : t('common.create_new')
                }
              </Button>
            </FormActions>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SensorForm; 