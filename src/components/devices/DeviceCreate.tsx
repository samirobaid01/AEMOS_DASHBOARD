import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import Card from '../common/Card/Card';
import DeviceIdentityForm from './DeviceIdentityForm';
import DeviceStatesModal from './DeviceStatesModal';
import CapabilitiesSummaryModal from './CapabilitiesSummaryModal';
import type { DeviceCreateProps } from './types';

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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={cn(
      'bg-background dark:bg-background-dark',
      isMobile ? 'p-4' : 'p-6 lg:p-8'
    )}>
      <div className="max-w-3xl mx-auto">
        {currentStep === 1 && (
          <Card contentClassName="p-0">
            <div className="bg-surface dark:bg-surface-dark p-6 border-b border-border dark:border-border-dark">
              <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
                {t('devices.newDevice.new')}
              </h2>
              <p className="text-sm text-textSecondary dark:text-textSecondary-dark mt-2 m-0">
                {t('devices.newDevice.newDeviceDescription')}
              </p>
            </div>
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
          </Card>
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
