import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, ArrowLeft } from 'lucide-react';
import type { DeviceCreateRequest } from '../../types/device';
import LoadingScreen from '../common/Loading/LoadingScreen';
import Button from '../common/Button/Button';
import DeviceIdentityForm from './DeviceIdentityForm';
import { useGoBack } from '../../hooks/useGoBack';
import type { DeviceEditProps } from './types';

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
  const goBack = useGoBack('/devices');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!deviceName && !isLoading) {
    return (
      <div className="bg-background dark:bg-background-dark p-4 sm:py-6 sm:px-8">
        <div className="w-full">
          <div className="bg-warningBg dark:bg-warningBg-dark text-warningText dark:text-warningText-dark p-4 rounded-lg text-sm">
            {t('devices.deviceNotFound')}
          </div>
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              {t('common.back')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="bg-background dark:bg-background-dark p-4 sm:py-6 sm:px-8">
      <div className="w-full">
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
        <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-border dark:border-border-dark">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
              <Cpu className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0">
                {t('devices.edit')} - {deviceName}
              </h2>
              <p className="text-sm text-textMuted dark:text-textMuted-dark mt-0.5 m-0">
                {t('devices.editDeviceDescription')}
              </p>
            </div>
          </div>
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
  );
};

export default DeviceEdit;
