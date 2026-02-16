import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
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
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const bodyStyle = { padding: '1.5rem' };

  const inputStyle = {
    display: 'block' as const,
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
    ...inputStyle,
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    paddingRight: '2.5rem',
  };

  const checkboxWrapperStyle = { display: 'flex', alignItems: 'center' as const };

  const checkboxStyle = {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
    accentColor: darkMode ? '#4d7efa' : '#3b82f6',
  };

  return (
    <form onSubmit={onSubmit} style={bodyStyle}>
            {error && (
              <div
                style={{
                  backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
                  color: darkMode ? colors.dangerText : '#b91c1c',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <FormField label={t('devices.name')} id="name" required error={formErrors.name}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  style={inputStyle}
                />
              </FormField>

              <FormField label={t('devices.deviceType')} id="deviceType" required error={formErrors.deviceType}>
                <select
                  id="deviceType"
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={onChange}
                  required
                  style={selectStyle}
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

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <FormField label={t('devices.selectProtocol')} id="communicationProtocol">
                <select
                  id="communicationProtocol"
                  name="communicationProtocol"
                  value={formData.communicationProtocol ?? ''}
                  onChange={onChange}
                  style={selectStyle}
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
                <select id="status" name="status" value={formData.status} onChange={onChange} required style={selectStyle}>
                  {ALLOWED_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <FormField label={t('devices.organization')} id="organizationId" required error={formErrors.organizationId}>
                <select
                  id="organizationId"
                  name="organizationId"
                  value={formData.organizationId ?? ''}
                  onChange={onChange}
                  required
                  style={selectStyle}
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
                  style={selectStyle}
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
                style={{ ...selectStyle, height: '6rem' }}
              >
                {CONTROL_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="isCritical">
              <div style={checkboxWrapperStyle}>
                <input
                  type="checkbox"
                  id="isCritical"
                  name="isCritical"
                  checked={formData.isCritical}
                  onChange={onChange}
                  style={checkboxStyle}
                />
                <label
                  htmlFor="isCritical"
                  style={{ fontSize: '0.875rem', color: darkMode ? colors.textSecondary : '#374151' }}
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
                style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '6rem' }}
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
