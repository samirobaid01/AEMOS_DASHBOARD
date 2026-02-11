import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DeviceUpdateRequest, DeviceCreateRequest } from '../../types/device';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import type { FormErrors } from '../../types/ui';
import LoadingScreen from '../common/Loading/LoadingScreen';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import DeviceIdentityForm from './DeviceIdentityForm';

interface DeviceEditProps {
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
  onControlModesChange,
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!deviceName && !isLoading) {
    return (
      <div
        style={{
          padding: isMobile ? '1rem' : '1.5rem 2rem',
          backgroundColor: darkMode ? colors.background : 'transparent',
        }}
      >
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: darkMode ? colors.warningBackground : '#fef3c7',
              color: darkMode ? colors.warningText : '#92400e',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            {t('devices.deviceNotFound')}
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
                cursor: 'pointer',
              }}
            >
              {t('devices.backToDevices')}
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

  const identityFormData: DeviceCreateRequest = {
    name: formData.name ?? '',
    description: formData.description ?? '',
    status: formData.status ?? 'pending',
    organizationId: formData.organizationId ?? 0,
    deviceType: formData.deviceType ?? 'actuator',
    communicationProtocol: formData.communicationProtocol,
    isCritical: formData.isCritical ?? false,
    areaId: formData.areaId
  };

  return (
    <div
      style={{
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        backgroundColor: darkMode ? colors.background : 'transparent',
      }}
    >
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <div style={formStyle}>
          <div style={headerStyle}>
            <h2 style={headerTitleStyle}>
              {t('devices.edit')} - {deviceName}
            </h2>
            <p style={headerDescriptionStyle}>{t('devices.editDeviceDescription')}</p>
          </div>
          <div style={bodyStyle}>
            <DeviceIdentityForm
              formData={identityFormData}
              formErrors={formErrors}
              isLoading={isSubmitting}
              error={error}
              organizations={organizations}
              areas={areas}
              onChange={onChange}
              onControlModesChange={onControlModesChange}
              onSubmit={onSubmit}
              onCancel={onCancel}
              submitLabel={t('common.save')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceEdit;
