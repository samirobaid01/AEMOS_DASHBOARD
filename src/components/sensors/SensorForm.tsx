import React from 'react';
import { useTranslation } from 'react-i18next';
import { ALLOWED_SENSOR_STATUSES } from '../../types/sensor';
import type { SensorCreateRequest, SensorUpdateRequest, TelemetryDatatype } from '../../types/sensor';
import FormField from '../common/FormField';
import FormActions from '../common/FormActions';
import Button from '../common/Button/Button';
import type { SensorFormProps, TelemetryRowPayload, TelemetryRowFormState } from './types';

export type { TelemetryRowPayload, TelemetryRowFormState };

const TELEMETRY_DATATYPES: TelemetryDatatype[] = ['float', 'int', 'string', 'boolean'];

const inputClasses =
  'block w-full px-3 py-2 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';
const textareaClasses =
  'block w-full min-h-24 px-3 py-2 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary resize-y';
const labelClasses = 'block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2';

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
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGenerateUuid = () => {
    setFormData({ ...formData, uuid: crypto.randomUUID?.() ?? '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData }, telemetryRows);
  };

  return (
    <div className={`bg-background dark:bg-background-dark ${isMobile ? 'p-4' : 'p-6 px-8'}`}>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border dark:border-border-dark bg-surfaceHover dark:bg-surfaceHover-dark">
            <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
              {isEditMode ? t('sensors.edit') : t('sensors.add')}
            </h2>
            <p className="text-sm text-textMuted dark:text-textMuted-dark mt-2 m-0">
              {isEditMode ? t('sensors.editSensorDescription') : t('sensors.addSensorDescription')}
            </p>
          </div>
          <div className="p-6">
            {error && (
              <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-3 rounded-md text-sm mb-6">
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
                className={inputClasses}
              />
            </FormField>

            {!isEditMode && (
              <FormField label={t('sensors.uuid')} id="uuid">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="uuid"
                    name="uuid"
                    value={formData.uuid ?? ''}
                    onChange={handleChange}
                    placeholder={t('sensors.uuidPlaceholder')}
                    className={`${inputClasses} flex-1`}
                  />
                  <Button type="button" size="sm" onClick={handleGenerateUuid} className="whitespace-nowrap">
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
                className={selectClasses}
              >
                <option value="" disabled>{t('sensors.selectArea')}</option>
                {Array.isArray(safeAreas) ? safeAreas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
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
                className={selectClasses}
              >
                {ALLOWED_SENSOR_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>

            <FormField label={t('sensors.description')} id="description">
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className={textareaClasses}
              />
            </FormField>

            <div className="mb-6">
              <label className={labelClasses}>
                {isEditMode ? t('sensors.telemetryData') : t('sensors.initialTelemetry')}
              </label>
              <p className="text-sm text-textMuted dark:text-textMuted-dark mt-0 mb-2">
                {isEditMode ? t('sensors.editTelemetryDescription') : t('sensors.initialTelemetryDescription')}
              </p>
              {telemetryError && (
                <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-3 rounded-md text-sm mb-3">
                  {telemetryError}
                </div>
              )}
              {telemetryRows.map((row, index) => (
                <div
                  key={`telemetry-row-${index}`}
                  className="flex items-end gap-3 mb-4"
                >
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`telemetryVariableName-${index}`} className={`${labelClasses} mb-1`}>
                      {t('sensors.variableName')}
                    </label>
                    <input
                      type="text"
                      id={`telemetryVariableName-${index}`}
                      value={row.variableName}
                      onChange={(e) => handleTelemetryRowChange(index, 'variableName', e.target.value)}
                      placeholder={t('sensors.variableNamePlaceholder')}
                      className={inputClasses}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`telemetryDatatype-${index}`} className={`${labelClasses} mb-1`}>
                      {t('sensors.datatype')}
                    </label>
                    <select
                      id={`telemetryDatatype-${index}`}
                      value={row.datatype}
                      onChange={(e) => handleTelemetryRowChange(index, 'datatype', e.target.value || '')}
                      className={selectClasses}
                    >
                      <option value="">{t('sensors.selectDatatype')}</option>
                      {TELEMETRY_DATATYPES.map((dt) => (
                        <option key={dt} value={dt}>{dt}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveTelemetryRow(index)}
                    title={t('sensors.removeTelemetry')}
                    className="h-9 shrink-0 min-w-8 p-1"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={handleAddTelemetryRow} variant="primary" className="mt-2">
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
