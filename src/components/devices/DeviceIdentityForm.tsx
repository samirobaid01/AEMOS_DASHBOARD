import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import {
  ALLOWED_DEVICE_TYPES,
  ALLOWED_PROTOCOLS,
  ALLOWED_STATUSES,
  CONTROL_MODES,
} from '../../constants/device';
import FormField from '../common/FormField';
import FormActions from '../common/FormActions';
import Button from '../common/Button/Button';
import type { DeviceIdentityFormProps } from './types';

const inputClasses =
  'block w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';
const textareaClasses =
  'block w-full min-h-24 px-3 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y';

const DeviceIdentityForm: React.FC<DeviceIdentityFormProps> = ({
  formData,
  formErrors,
  isLoading,
  error,
  organizations,
  areas,
  onChange,
  onControlModesChange,
  onSubmit,
  onCancel,
  submitLabel,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className={cn('p-6', className)}>
      {error && (
        <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-3 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <FormField label={t('devices.name')} id="name" required error={formErrors.name}>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            className={inputClasses}
          />
        </FormField>

        <FormField label={t('devices.deviceType')} id="deviceType" required error={formErrors.deviceType}>
          <select
            id="deviceType"
            name="deviceType"
            value={formData.deviceType}
            onChange={onChange}
            required
            className={selectClasses}
          >
            <option value="">{t('devices.selectDeviceType')}</option>
            {ALLOWED_DEVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <FormField label={t('devices.selectProtocol')} id="communicationProtocol">
          <select
            id="communicationProtocol"
            name="communicationProtocol"
            value={formData.communicationProtocol ?? ''}
            onChange={onChange}
            className={selectClasses}
          >
            <option value="">{t('devices.selectProtocol')}</option>
            {ALLOWED_PROTOCOLS.map((protocol) => (
              <option key={protocol} value={protocol}>
                {protocol}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t('devices.status')} id="status" required>
          <select 
            id="status" 
            name="status" 
            value={formData.status}
            onChange={onChange}
            required
            className={selectClasses}
          >
            {ALLOWED_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <FormField label={t('devices.organization')} id="organizationId" required error={formErrors.organizationId}>
          <select
            id="organizationId"
            name="organizationId"
            value={formData.organizationId ?? ''}
            onChange={onChange}
            required
            className={selectClasses}
          >
            <option value="">{t('devices.selectOrganization')}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t('devices.area')} id="areaId" error={formErrors.areaId}>
          <select
            id="areaId"
            name="areaId"
            value={formData.areaId ?? ''}
            onChange={onChange}
            className={selectClasses}
          >
            <option value="">{t('devices.selectArea')}</option>
            {areas
              .filter((area) => !formData.organizationId || area.organizationId === formData.organizationId)
              .map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
          </select>
        </FormField>
      </div>

      <FormField label={t('devices.controlModes')} id="controlModes">
        <select
          id="controlModes"
          name="controlModes"
          multiple
          value={formData.controlModes ? formData.controlModes.split(',') : []}
          onChange={(e) => {
            const selectedModes = Array.from(e.target.selectedOptions, (option) => option.value);
            onControlModesChange(selectedModes);
          }}
          className={cn(selectClasses, 'h-24')}
        >
          {CONTROL_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="isCritical">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isCritical"
            name="isCritical"
            checked={formData.isCritical}
            onChange={onChange}
            className="w-4 h-4 mr-2 accent-primary dark:accent-primary-dark"
          />
          <label
            htmlFor="isCritical"
            className="text-sm text-textSecondary dark:text-textSecondary-dark cursor-pointer"
          >
            {t('devices.isCritical')}
          </label>
        </div>
      </FormField>

      <FormField label={t('devices.description')} id="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description ?? ''}
          onChange={onChange}
          className={textareaClasses}
        />
      </FormField>

      <FormActions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('creating') : submitLabel ?? t('next')}
        </Button>
      </FormActions>
    </form>
  );
};

export default DeviceIdentityForm;
