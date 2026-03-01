import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DeviceCreateRequest } from '../../types/device';
import LoadingScreen from '../common/Loading/LoadingScreen';
import { cn } from '../../utils/cn';
import Card from '../common/Card/Card';
import Button from '../common/Button/Button';
import DeviceIdentityForm from './DeviceIdentityForm';
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!deviceName && !isLoading) {
    return (
      <div className={cn(
        'bg-background dark:bg-background-dark',
        isMobile ? 'p-4' : 'p-6 lg:p-8'
      )}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-warningBg dark:bg-warningBg-dark text-warningText dark:text-warningText-dark p-4 rounded-lg text-sm">
            {t('devices.deviceNotFound')}
          </div>
          <div className="mt-4">
            <Button type="button" variant="secondary" onClick={onCancel} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
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
    <div className={cn(
      'bg-background dark:bg-background-dark',
      isMobile ? 'p-4' : 'p-6 lg:p-8'
    )}>
      <div className="max-w-3xl mx-auto">
        <Card contentClassName="p-0">
          <div className="bg-surface dark:bg-surface-dark p-6 border-b border-border dark:border-border-dark">
            <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
              {t('devices.edit')} - {deviceName}
            </h2>
            <p className="text-sm text-textSecondary dark:text-textSecondary-dark mt-2 m-0">
              {t('devices.editDeviceDescription')}
            </p>
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
        </Card>
      </div>
    </div>
  );
};

export default DeviceEdit;
