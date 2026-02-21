import React, { useEffect } from 'react';
import { useAppDispatch } from '../../state/store';
import { fetchDeviceStates } from '../../state/slices/deviceStates.slice';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../common/Loading/LoadingScreen';
import type { DeviceStatus } from '../../constants/device';
import { cn } from '../../utils/cn';
import Card from '../common/Card/Card';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import DeviceStateModal from './DeviceStateModal';
import type { DeviceDetailsProps } from './types';

const DeviceDetails: React.FC<DeviceDetailsProps> = ({
  device,
  organization,
  area,
  isLoading,
  error,
  isDeleting,
  deleteModalOpen,
  onDelete,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onNavigateBack,
  onStateButtonClick,
  selectedState,
  onStateModalClose,
  onStateModalSave,
  isStateUpdating,
  isSocketConnected,
  socketError
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (device?.id && device?.organizationId) {
      dispatch(fetchDeviceStates({ deviceId: device.id, organizationId: device.organizationId }));
    }
  }, [device?.id, device?.organizationId, dispatch]);

  const getStatusClasses = (status: DeviceStatus) => {
    const statusMap: Record<DeviceStatus, { bg: string; text: string; dot: string }> = {
      active: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-600'
      },
      inactive: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500'
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500'
      },
      maintenance: {
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        text: 'text-orange-700 dark:text-orange-400',
        dot: 'bg-orange-600'
      },
      faulty: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500'
      },
      retired: {
        bg: 'bg-gray-100 dark:bg-gray-800/20',
        text: 'text-gray-700 dark:text-gray-400',
        dot: 'bg-gray-600'
      }
    };
    return statusMap[status];
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className={cn(
        'bg-background dark:bg-background-dark',
        isMobile ? 'p-4' : 'p-6 lg:p-8'
      )}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-4 rounded-lg text-sm mb-4">
            {error}
          </div>
          <Button type="button" variant="secondary" onClick={onNavigateBack} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className={cn(
        'bg-background dark:bg-background-dark',
        isMobile ? 'p-4' : 'p-6 lg:p-8'
      )}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-warningBg dark:bg-warningBg-dark text-warningText dark:text-warningText-dark p-4 rounded-lg text-sm mb-4">
            {t('devices.detail.deviceNotFound')}
          </div>
          <Button type="button" variant="secondary" onClick={onNavigateBack} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const statusClasses = getStatusClasses(device.status);

  const renderDeviceInfo = () => {
    return (
      <Card className="mb-6">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-0">
            {t('devices.detail.deviceInfo')}
          </h2>
        </div>
        <div className={cn(
          'p-6 grid gap-6',
          isMobile ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          <div>
            <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
              {t('devices.detail.deviceName')}
            </div>
            <div className="text-base text-textPrimary dark:text-textPrimary-dark">{device.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
              {t('devices.detail.deviceType')}
            </div>
            <div className="text-base text-textPrimary dark:text-textPrimary-dark">{device.deviceType}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
              {t('devices.detail.controlType')}
            </div>
            <div className="text-base text-textPrimary dark:text-textPrimary-dark">{device.controlType}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
              {t('devices.detail.status')}
            </div>
            <span className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              statusClasses.bg,
              statusClasses.text
            )}>
              <span className={cn('w-2 h-2 rounded-full mr-1.5', statusClasses.dot)}></span>
              {t(`devices.statuses.${device.status}`)}
            </span>
          </div>
          {device.communicationProtocol && (
            <div>
              <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                {t('devices.detail.protocol')}
              </div>
              <div className="text-base text-textPrimary dark:text-textPrimary-dark">
                {device.communicationProtocol}
              </div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
              {t('devices.detail.critical')}
            </div>
            <div className="text-base text-textPrimary dark:text-textPrimary-dark">
              {device.isCritical ? t('yes') : t('no')}
            </div>
          </div>
          <div className={isMobile ? '' : 'col-span-2'}>
            <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
              {t('devices.detail.organization')}
            </div>
            <div className="text-base text-textPrimary dark:text-textPrimary-dark">
              {organization ? (
                <Link to={`/organizations/${organization.id}`} className="text-primary dark:text-primary-dark hover:underline">
                  {organization.name}
                </Link>
              ) : (
                t('devices.detail.noOrganization')
              )}
            </div>
          </div>
          <div className={isMobile ? '' : 'col-span-2'}>
            <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
              {t('devices.detail.area')}
            </div>
            <div className="text-base text-textPrimary dark:text-textPrimary-dark">
              {area ? (
                <Link to={`/areas/${area.id}`} className="text-primary dark:text-primary-dark hover:underline">
                  {area.name}
                </Link>
              ) : (
                t('devices.detail.noArea')
              )}
            </div>
          </div>
          {device.description && (
            <div className={isMobile ? '' : 'col-span-2'}>
              <div className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                {t('devices.detail.description')}
              </div>
              <div className="text-base text-textPrimary dark:text-textPrimary-dark">{device.description}</div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderDeviceStates = () => {
    if (!device.states || device.states.length === 0) {
      return null;
    }

    return (
      <Card className="mb-6">
        <div className={cn(
          'flex justify-between items-start p-6 pb-0',
          isMobile ? 'flex-col gap-4' : 'flex-row'
        )}>
          <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-0">
            {t('devices.detail.deviceStatus')}
            {isSocketConnected && (
              <span className="inline-flex items-center ml-3 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-600 mr-1.5 animate-pulse"></span>
                {t('devices.detail.socketConnected')}
              </span>
            )}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/debug/device-state-test')}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('devices.detail.testSocket')}
          </Button>
        </div>

        {socketError && (
          <div className="mx-6 mt-4 p-3 bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark rounded-md text-sm">
            {t('devices.detail.socketError')}: {socketError.message}
          </div>
        )}

        <div className={cn(
          'grid gap-4 p-6',
          isMobile ? 'grid-cols-1' : 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]'
        )}>
          {device.states.map((state) => {
            const currentValue = state.instances[0]?.value || state.defaultValue;

            return (
              <div key={state.id} className="bg-surface dark:bg-surface-dark rounded-lg p-4 border border-border dark:border-border-dark">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-textPrimary dark:text-textPrimary-dark">
                    {state.stateName}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onStateButtonClick(state)}
                  >
                    {t('devices.detail.updateState')}
                  </Button>
                </div>
                <div className="p-2 bg-surface dark:bg-gray-700 rounded text-center">
                  <div className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark">
                    {currentValue}
                  </div>
                  <div className="text-xs text-textMuted dark:text-textMuted-dark mt-1">
                    {t('devices.detail.defaultValue')}: {state.defaultValue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className={cn(
      'bg-background dark:bg-background-dark',
      isMobile ? 'p-4' : 'p-6 lg:p-8'
    )}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onNavigateBack}
            className="flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back')}
          </Button>
          
          <div className={cn(
            'flex justify-between',
            isMobile ? 'flex-col items-start gap-4' : 'flex-row items-center'
          )}>
            <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
              {device.name}
            </h1>
            <div className={cn(
              'flex gap-2',
              isMobile ? 'flex-wrap w-full' : 'flex-nowrap'
            )}>
              <Link to={`/devices/${device.id}/edit`} className={cn(isMobile && 'flex-1', 'no-underline')}>
                <Button type="button" variant="primary" fullWidth={isMobile}>
                  {t('devices.detail.edit')}
                </Button>
              </Link>
              <Button
                type="button"
                variant="danger"
                onClick={onOpenDeleteModal}
                className={isMobile ? 'flex-1' : ''}
              >
                {t('devices.detail.delete')}
              </Button>
            </div>
          </div>
        </div>

        {renderDeviceInfo()}
        {renderDeviceStates()}

        {deleteModalOpen && (
          <Modal
            isOpen={deleteModalOpen}
            onClose={onCloseDeleteModal}
            title={t('devices.detail.deleteDevice')}
          >
            <div className="mb-6">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                {t('devices.detail.deleteConfirmation')}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={onCloseDeleteModal}
                disabled={isDeleting}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={onDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t('deleting') : t('devices.detail.confirmDelete')}
              </Button>
            </div>
          </Modal>
        )}

        {selectedState && (
          <DeviceStateModal
            isOpen={true}
            onClose={onStateModalClose}
            stateName={selectedState.name}
            currentValue={selectedState.value}
            defaultValue={selectedState.defaultValue}
            allowedValues={selectedState.allowedValues}
            onSave={onStateModalSave}
            isLoading={isStateUpdating}
          />
        )}
      </div>
    </div>
  );
};

export default DeviceDetails;
