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
import type { DeviceCreateRequest } from '../../types/device';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import type { FormErrors } from '../../types/ui';

interface DeviceIdentityFormProps {
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
}

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

  const fieldGroupStyle = { marginBottom: '1.5rem' };

  const labelStyle = {
    display: 'block' as const,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#374151',
    marginBottom: '0.5rem',
  };

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

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'flex-end' as const,
    marginTop: '2rem',
    gap: '0.75rem',
    flexDirection: isMobile ? ('column-reverse' as const) : ('row' as const),
  };

  const buttonStyle = (variant: 'primary' | 'secondary') => ({
    padding: '0.5rem 1rem',
    backgroundColor:
      variant === 'primary'
        ? darkMode
          ? '#4d7efa'
          : '#3b82f6'
        : darkMode
          ? colors.surfaceBackground
          : 'white',
    color: variant === 'primary' ? 'white' : darkMode ? colors.textSecondary : '#4b5563',
    border: variant === 'primary' ? 'none' : `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.7 : 1,
    flexGrow: isMobile ? 1 : 0,
    minWidth: isMobile ? '0' : '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const errorStyle = {
    color: darkMode ? colors.dangerText : '#b91c1c',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
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
              <div style={fieldGroupStyle}>
                <label htmlFor="name" style={labelStyle}>
                  {t('devices.name')} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  style={inputStyle}
                />
                {formErrors.name && <p style={errorStyle}>{formErrors.name}</p>}
              </div>

              <div style={fieldGroupStyle}>
                <label htmlFor="deviceType" style={labelStyle}>
                  {t('devices.deviceType')} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
                </label>
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
                {formErrors.deviceType && <p style={errorStyle}>{formErrors.deviceType}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <div style={fieldGroupStyle}>
                <label htmlFor="communicationProtocol" style={labelStyle}>
                  {t('devices.selectProtocol')}
                </label>
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
              </div>

              <div style={fieldGroupStyle}>
                <label htmlFor="status" style={labelStyle}>
                  {t('devices.status')} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
                </label>
                <select id="status" name="status" value={formData.status} onChange={onChange} required style={selectStyle}>
                  {ALLOWED_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <div style={fieldGroupStyle}>
                <label htmlFor="organizationId" style={labelStyle}>
                  {t('devices.organization')} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
                </label>
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
                {formErrors.organizationId && <p style={errorStyle}>{formErrors.organizationId}</p>}
              </div>

              <div style={fieldGroupStyle}>
                <label htmlFor="areaId" style={labelStyle}>
                  {t('devices.area')}
                </label>
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
                {formErrors.areaId && <p style={errorStyle}>{formErrors.areaId}</p>}
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label htmlFor="controlModes" style={labelStyle}>
                {t('devices.controlModes')}
              </label>
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
            </div>

            <div style={fieldGroupStyle}>
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
            </div>

            <div style={fieldGroupStyle}>
              <label htmlFor="description" style={labelStyle}>
                {t('devices.description')}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description ?? ''}
                onChange={onChange}
                style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '6rem' }}
              />
            </div>

            <div style={buttonGroupStyle}>
              <button type="button" onClick={onCancel} style={buttonStyle('secondary')}>
                {t('cancel')}
              </button>
              <button type="submit" disabled={isLoading} style={buttonStyle('primary')}>
                {isLoading ? t('creating') : submitLabel ?? t('next')}
              </button>
            </div>
    </form>
  );
};

export default DeviceIdentityForm;
