import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DeviceUpdateRequest } from '../../types/device';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import LoadingScreen from '../common/Loading/LoadingScreen';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import DynamicKeyValueInput from '../common/DynamicKeyValueInput/DynamicKeyValueInput';
import {
  ALLOWED_DEVICE_TYPES,
  ALLOWED_CONTROL_TYPES,
  ALLOWED_PROTOCOLS,
  ALLOWED_STATUSES,
  CONTROL_MODES,
  METADATA_SUGGESTED_KEYS,
  CAPABILITIES_SUGGESTED_KEYS
} from '../../constants/device';

interface DeviceEditProps {
  formData: DeviceUpdateRequest;
  formErrors: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  deviceName: string | undefined;
  organizations: Organization[];
  areas: Area[];
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onMetadataChange: (metadata: Record<string, any>) => void;
  onCapabilitiesChange: (capabilities: Record<string, any>) => void;
  onControlModesChange: (modes: string[]) => void;
}

const DeviceEdit: React.FC<DeviceEditProps> = ({
  formData,
  formErrors,
  isLoading,
  isSubmitting,
  error,
  deviceName,
  organizations,
  areas,
  onCancel,
  onSubmit,
  onChange,
  onMetadataChange,
  onCapabilitiesChange,
  onControlModesChange
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = window.innerWidth < 768;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!deviceName && !isLoading) {
    return (
      <div style={{ 
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        backgroundColor: darkMode ? colors.background : 'transparent'
      }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{
            backgroundColor: darkMode ? colors.warningBackground : '#fef3c7',
            color: darkMode ? colors.warningText : '#92400e',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>
            {t('device_not_found')}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={onCancel}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: darkMode ? colors.surfaceBackground : 'white',
                color: darkMode ? colors.textSecondary : '#4b5563',
                border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {t('back_to_devices')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formStyle = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    overflow: 'hidden'
  };

  const headerStyle = {
    backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
    padding: '1.5rem',
    borderBottom: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`
  };

  const headerTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    margin: 0
  };

  const headerDescriptionStyle = {
    fontSize: '0.875rem',
    color: darkMode ? colors.textSecondary : '#6b7280',
    marginTop: '0.5rem'
  };

  const bodyStyle = {
    padding: '1.5rem'
  };

  const fieldGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#374151',
    marginBottom: '0.5rem'
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
    outline: 'none'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    paddingRight: '2.5rem'
  };

  const checkboxWrapperStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const checkboxStyle = {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
    accentColor: darkMode ? '#4d7efa' : '#3b82f6'
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    gap: '0.75rem',
    flexDirection: isMobile ? 'column-reverse' as const : 'row' as const
  };

  const buttonStyle = (variant: 'primary' | 'secondary') => ({
    padding: '0.5rem 1rem',
    backgroundColor: variant === 'primary' 
      ? (darkMode ? '#4d7efa' : '#3b82f6')
      : (darkMode ? colors.surfaceBackground : 'white'),
    color: variant === 'primary'
      ? 'white'
      : (darkMode ? colors.textSecondary : '#4b5563'),
    border: variant === 'primary'
      ? 'none'
      : `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    opacity: isSubmitting ? 0.7 : 1,
    flexGrow: isMobile ? 1 : 0,
    minWidth: isMobile ? '0' : '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ 
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      backgroundColor: darkMode ? colors.background : 'transparent'
    }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <div style={formStyle}>
          <div style={headerStyle}>
            <h2 style={headerTitleStyle}>
              {t('edit_device')} - {deviceName}
            </h2>
            <p style={headerDescriptionStyle}>
              {t('devices.editDeviceDescription')}
            </p>
          </div>

          <form onSubmit={onSubmit} style={bodyStyle}>
            {error && (
              <div style={{
                backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
                color: darkMode ? colors.dangerText : '#b91c1c',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '1rem'
            }}>
              <div style={fieldGroupStyle}>
                <label htmlFor="name" style={labelStyle}>
                  {t("devices.name")} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
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
                {formErrors.name && (
                  <p style={{ 
                    color: darkMode ? colors.dangerText : '#b91c1c',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem'
                  }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div style={fieldGroupStyle}>
                <label htmlFor="deviceType" style={labelStyle}>
                  {t("devices.deviceType")} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
                </label>
                <select
                  id="deviceType"
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={onChange}
                  required
                  style={selectStyle}
                >
                  <option value="">{t("devices.selectDeviceType")}</option>
                  {ALLOWED_DEVICE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.deviceType && (
                  <p style={{ 
                    color: darkMode ? colors.dangerText : '#b91c1c',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem'
                  }}>
                    {formErrors.deviceType}
                  </p>
                )}
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '1rem'
            }}>
              <div style={fieldGroupStyle}>
                <label htmlFor="controlType" style={labelStyle}>
                  {t("devices.controlType")} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
                </label>
                <select
                  id="controlType"
                  name="controlType"
                  value={formData.controlType}
                  onChange={onChange}
                  required
                  style={selectStyle}
                >
                  <option value="">{t("devices.selectControlType")}</option>
                  {ALLOWED_CONTROL_TYPES.map(type => (
                    <option key={type} value={type}>
                      {t(`devices.controlTypes.${type}`)}
                    </option>
                  ))}
                </select>
                {formErrors.controlType && (
                  <p style={{ 
                    color: darkMode ? colors.dangerText : '#b91c1c',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem'
                  }}>
                    {formErrors.controlType}
                  </p>
                )}
              </div>

              <div style={fieldGroupStyle}>
                <label htmlFor="communicationProtocol" style={labelStyle}>
                  {t("devices.protocol")}
                </label>
                <select
                  id="communicationProtocol"
                  name="communicationProtocol"
                  value={formData.communicationProtocol}
                  onChange={onChange}
                  style={selectStyle}
                >
                  <option value="">{t("devices.selectProtocol")}</option>
                  {ALLOWED_PROTOCOLS.map(protocol => (
                    <option key={protocol} value={protocol}>
                      {protocol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '1rem'
            }}>
              <div style={fieldGroupStyle}>
                <label htmlFor="status" style={labelStyle}>
                  {t("devices.status")}
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  required
                  style={selectStyle}
                >
                  {ALLOWED_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {t(`devices.statuses.${status}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldGroupStyle}>
                <label htmlFor="organizationId" style={labelStyle}>
                  {t("devices.organization")} <span style={{ color: darkMode ? '#ef5350' : '#ef4444' }}>*</span>
                </label>
                <select
                  id="organizationId"
                  name="organizationId"
                  value={formData.organizationId || ""}
                  onChange={onChange}
                  required
                  style={selectStyle}
                >
                  <option value="">{t("devices.selectOrganization")}</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {formErrors.organizationId && (
                  <p style={{ 
                    color: darkMode ? colors.dangerText : '#b91c1c',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem'
                  }}>
                    {formErrors.organizationId}
                  </p>
                )}
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label htmlFor="areaId" style={labelStyle}>
                {t("devices.area")}
              </label>
              <select
                id="areaId"
                name="areaId"
                value={formData.areaId || ""}
                onChange={onChange}
                style={selectStyle}
              >
                <option value="">{t("devices.selectArea")}</option>
                {areas
                  .filter(area => !formData.organizationId || area.organizationId === formData.organizationId)
                  .map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
              </select>
              {formErrors.areaId && (
                <p style={{ 
                  color: darkMode ? colors.dangerText : '#b91c1c',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem'
                }}>
                  {formErrors.areaId}
                </p>
              )}
            </div>

            <div style={fieldGroupStyle}>
              <label htmlFor="description" style={labelStyle}>
                {t("devices.description")}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ""}
                onChange={onChange}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '6rem'
                }}
              />
            </div>

            {formData.controlType === 'range' && (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '1rem'
              }}>
                <div style={fieldGroupStyle}>
                  <label htmlFor="minValue" style={labelStyle}>
                    {t("devices.minValue")}
                  </label>
                  <input
                    type="number"
                    id="minValue"
                    name="minValue"
                    value={formData.minValue ?? ''}
                    onChange={onChange}
                    style={inputStyle}
                  />
                  {formErrors.minValue && (
                    <p style={{ 
                      color: darkMode ? colors.dangerText : '#b91c1c',
                      fontSize: '0.875rem',
                      marginTop: '0.25rem'
                    }}>
                      {formErrors.minValue}
                    </p>
                  )}
                </div>

                <div style={fieldGroupStyle}>
                  <label htmlFor="maxValue" style={labelStyle}>
                    {t("devices.maxValue")}
                  </label>
                  <input
                    type="number"
                    id="maxValue"
                    name="maxValue"
                    value={formData.maxValue ?? ''}
                    onChange={onChange}
                    style={inputStyle}
                  />
                  {formErrors.maxValue && (
                    <p style={{ 
                      color: darkMode ? colors.dangerText : '#b91c1c',
                      fontSize: '0.875rem',
                      marginTop: '0.25rem'
                    }}>
                      {formErrors.maxValue}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div style={fieldGroupStyle}>
              <label htmlFor="defaultState" style={labelStyle}>
                {t("devices.defaultState")}
              </label>
              <input
                type="text"
                id="defaultState"
                name="defaultState"
                value={formData.defaultState || ""}
                onChange={onChange}
                style={inputStyle}
              />
              {formErrors.defaultState && (
                <p style={{ 
                  color: darkMode ? colors.dangerText : '#b91c1c',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem'
                }}>
                  {formErrors.defaultState}
                </p>
              )}
            </div>

            <div style={fieldGroupStyle}>
              <label htmlFor="controlModes" style={labelStyle}>
                {t("devices.controlModes")}
              </label>
              <select
                id="controlModes"
                name="controlModes"
                multiple
                value={formData.controlModes ? formData.controlModes.split(',') : []}
                onChange={(e) => {
                  const selectedModes = Array.from(e.target.selectedOptions, option => option.value);
                  onControlModesChange(selectedModes);
                }}
                style={{
                  ...selectStyle,
                  height: '6rem'
                }}
              >
                {CONTROL_MODES.map(mode => (
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
                <label htmlFor="isCritical" style={{ 
                  fontSize: '0.875rem',
                  color: darkMode ? colors.textSecondary : '#374151'
                }}>
                  {t("devices.isCritical")}
                </label>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <DynamicKeyValueInput
                pairs={Object.entries(formData.metadata || {}).map(([key, value]) => ({ key, value }))}
                onChange={onMetadataChange}
                label={t("devices.metadata")}
                keyPlaceholder={t("devices.metadataKey")}
                valuePlaceholder={t("devices.metadataValue")}
                predefinedKeys={METADATA_SUGGESTED_KEYS}
                error={formErrors.metadata}
              />
            </div>

            <div style={fieldGroupStyle}>
              <DynamicKeyValueInput
                pairs={Object.entries(formData.capabilities || {}).map(([key, value]) => ({ key, value }))}
                onChange={onCapabilitiesChange}
                label={t("devices.capabilities")}
                keyPlaceholder={t("devices.capabilityKey")}
                valuePlaceholder={t("devices.capabilityValue")}
                predefinedKeys={CAPABILITIES_SUGGESTED_KEYS}
                error={formErrors.capabilities}
              />
            </div>

            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={onCancel}
                style={buttonStyle('secondary')}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode 
                    ? 'rgba(0, 0, 0, 0.1)' 
                    : '#f9fafb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode 
                    ? colors.surfaceBackground 
                    : 'white';
                }}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                style={buttonStyle('primary')}
                disabled={isSubmitting}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = darkMode 
                      ? '#5d8efa'
                      : '#2563eb';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = darkMode 
                      ? '#4d7efa'
                      : '#3b82f6';
                  }
                }}
              >
                {isSubmitting ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceEdit; 