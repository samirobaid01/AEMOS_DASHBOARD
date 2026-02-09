import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DeviceCreateRequest } from '../../types/device.d';
import type { Organization } from '../../types/organization.d';
import type { Area } from '../../types/area.d';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import DeviceIdentityForm from './DeviceIdentityForm';
import DeviceStatesModal, { type DeviceStatePayload } from './DeviceStatesModal';
import CapabilitiesSummaryModal from './CapabilitiesSummaryModal';
import type { DeviceCapabilities } from '../../types/device.d';

interface DeviceCreateProps {
  currentStep: 1 | 2 | 3;
  formData: DeviceCreateRequest;
  formErrors: Record<string, string>;
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

const DeviceCreate: React.FC<DeviceCreateProps> = ({
  currentStep,
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
  createdDeviceId,
  statesError,
  statesLoading,
  onStatesNext,
  onStatesFinish,
  onStatesCancel,
  capabilities,
  capabilitiesSaving,
  capabilitiesError,
  onSaveCapabilities,
  onCapabilitiesClose,
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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

  return (
    <div
      style={{
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        backgroundColor: darkMode ? colors.background : 'transparent',
      }}
    >
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        {currentStep === 1 && (
          <div style={formStyle}>
            <div style={headerStyle}>
              <h2 style={headerTitleStyle}>{t('devices.newDevice.new')}</h2>
              <p style={headerDescriptionStyle}>{t('devices.newDevice.newDeviceDescription')}</p>
            </div>
            <div style={bodyStyle}>
              <DeviceIdentityForm
                formData={formData}
                formErrors={formErrors}
                isLoading={isLoading}
                error={error}
                organizations={organizations}
                areas={areas}
                onChange={onChange}
                onControlModesChange={onControlModesChange}
                onSubmit={onSubmit}
                onCancel={onCancel}
                submitLabel={t('common.next')}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && createdDeviceId !== null && (
          <DeviceStatesModal
            isOpen={true}
            isSubmitting={statesLoading}
            error={statesError}
            onNext={onStatesNext}
            onFinish={onStatesFinish}
            onCancel={onStatesCancel}
          />
        )}

        {currentStep === 3 && (
          <CapabilitiesSummaryModal
            isOpen={true}
            capabilities={capabilities}
            isSaving={capabilitiesSaving}
            error={capabilitiesError}
            onSave={onSaveCapabilities}
            onClose={onCapabilitiesClose}
          />
        )}
      </div>
    </div>
  );
};

export default DeviceCreate;
