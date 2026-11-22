import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, ArrowLeft } from 'lucide-react';
import DeviceIdentityForm from './DeviceIdentityForm';
import DeviceStatesModal from './DeviceStatesModal';
import CapabilitiesSummaryModal from './CapabilitiesSummaryModal';
import Button from '../common/Button/Button';
import { useGoBack } from '../../hooks/useGoBack';
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
  const goBack = useGoBack('/devices');

  return (
    <div className="bg-background dark:bg-background-dark p-4 sm:py-6 sm:px-8">
      <div className="w-full">
        {currentStep === 1 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={goBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="mb-4"
          >
            {t('common.back')}
          </Button>
        )}
        {currentStep === 1 && (
          <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 p-6 border-b border-border dark:border-border-dark">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
                <Cpu className="w-5 h-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0">
                  {t('devices.newDevice.new')}
                </h2>
                <p className="text-sm text-textMuted dark:text-textMuted-dark mt-0.5 m-0">
                  {t('devices.newDevice.newDeviceDescription')}
                </p>
              </div>
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
