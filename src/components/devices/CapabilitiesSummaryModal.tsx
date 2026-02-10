import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { DeviceCapabilities } from '../../types/device';

interface CapabilitiesSummaryModalProps {
  isOpen: boolean;
  capabilities: DeviceCapabilities | string;
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onClose: () => void;
}

const CapabilitiesSummaryModal: React.FC<CapabilitiesSummaryModalProps> = ({
  isOpen,
  capabilities,
  isSaving,
  error,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const displayJson =
    typeof capabilities === 'string'
      ? capabilities
      : JSON.stringify(capabilities, null, 2);

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: darkMode ? colors.cardBackground : 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          width: isMobile ? '90%' : '32rem',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
        }}
      >
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: darkMode ? colors.textPrimary : '#111827',
            marginBottom: '1rem',
          }}
        >
          {t('devices.capabilities.title')}
        </h3>

        {error && (
          <div
            style={{
              backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
              color: darkMode ? colors.dangerText : '#b91c1c',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <pre
          style={{
            flex: 1,
            overflow: 'auto',
            margin: 0,
            padding: '1rem',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
            color: darkMode ? colors.textPrimary : '#111827',
            borderRadius: '0.375rem',
            border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          {displayJson || '{}'}
        </pre>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
              backgroundColor: darkMode ? colors.surfaceBackground : 'white',
              color: darkMode ? colors.textSecondary : '#4b5563',
            }}
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
              color: 'white',
            }}
          >
            {isSaving
              ? t('devices.capabilities.saving')
              : t('devices.capabilities.saveCapabilities')}
          </button>
        </div>
      </div>
    </>
  );
};

export default CapabilitiesSummaryModal;
