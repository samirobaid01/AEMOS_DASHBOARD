import React, { useEffect } from 'react';
import { useAppDispatch } from '../../state/store';
import { fetchDeviceStates } from '../../state/slices/deviceStates.slice';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Cpu, Pencil, Trash2, AlertCircle, Zap, Settings } from 'lucide-react';
import LoadingScreen from '../common/Loading/LoadingScreen';
import type { DeviceStatus } from '../../constants/device';
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

  useEffect(() => {
    if (device?.id && device?.organizationId) {
      dispatch(fetchDeviceStates({ deviceId: device.id, organizationId: device.organizationId }));
    }
  }, [device?.id, device?.organizationId, dispatch]);

  const getStatusClasses = (status: DeviceStatus) => {
    const statusMap: Record<DeviceStatus, { bg: string; text: string; dot: string }> = {
      active: {
        bg: 'bg-successBg dark:bg-successBg-dark',
        text: 'text-successText dark:text-successText-dark',
        dot: 'bg-success dark:bg-success-dark'
      },
      inactive: {
        bg: 'bg-dangerBg dark:bg-dangerBg-dark',
        text: 'text-dangerText dark:text-dangerText-dark',
        dot: 'bg-danger dark:bg-danger-dark'
      },
      pending: {
        bg: 'bg-warningBg dark:bg-warningBg-dark',
        text: 'text-warningText dark:text-warningText-dark',
        dot: 'bg-warning dark:bg-warning-dark'
      },
      maintenance: {
        bg: 'bg-warningBg dark:bg-warningBg-dark',
        text: 'text-warningText dark:text-warningText-dark',
        dot: 'bg-warning dark:bg-warning-dark'
      },
      faulty: {
        bg: 'bg-dangerBg dark:bg-dangerBg-dark',
        text: 'text-dangerText dark:text-dangerText-dark',
        dot: 'bg-danger dark:bg-danger-dark'
      },
      retired: {
        bg: 'bg-ink-100 dark:bg-ink-800',
        text: 'text-ink-600 dark:text-ink-300',
        dot: 'bg-ink-400 dark:bg-ink-500'
      }
    };
    return statusMap[status];
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        <div className="w-full">
          <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-4 rounded-lg text-sm mb-4">
            {error}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onNavigateBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        <div className="w-full">
          <div className="bg-warningBg dark:bg-warningBg-dark text-warningText dark:text-warningText-dark p-4 rounded-lg text-sm mb-4">
            {t('devices.detail.deviceNotFound')}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onNavigateBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const statusClasses = getStatusClasses(device.status);

  const renderDeviceInfo = () => {
    return (
      <Card className="mb-6" contentClassName="p-0">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
            {t('devices.detail.deviceInfo')}
          </h2>
        </div>
        <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
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
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses.bg} ${statusClasses.text}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${statusClasses.dot}`}></span>
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
          <div className="md:col-span-2">
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
          <div className="md:col-span-2">
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
            <div className="md:col-span-2">
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
      <Card className="mb-6" contentClassName="p-0">
        <div className="flex justify-between items-start p-6 pb-0 flex-col gap-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0 flex items-center">
            {t('devices.detail.deviceStatus')}
            {isSocketConnected && (
              <span className="inline-flex items-center ml-3 text-xs font-medium bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-success dark:bg-success-dark mr-1.5 animate-pulse"></span>
                {t('devices.detail.socketConnected')}
              </span>
            )}
          </h2>
          {import.meta.env.DEV && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/debug/device-state-test')}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
              className="whitespace-nowrap text-xs"
            >
              {t('devices.detail.testSocket')}
            </Button>
          )}
        </div>

        {socketError && (
          <div className="mx-6 mt-4 p-3 bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark rounded-md text-sm">
            {t('devices.detail.socketError')}: {socketError.message}
          </div>
        )}

        <div className="grid gap-4 p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {device.states.map((state) => {
            const currentValue = state.instances[0]?.value || state.defaultValue;

            return (
              <div key={state.id} className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4">
                <div className="flex justify-between items-center mb-3 gap-2">
                  <span className="text-sm font-medium text-textPrimary dark:text-textPrimary-dark truncate">
                    {state.stateName}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onStateButtonClick(state)}
                    leftIcon={<Settings className="w-3.5 h-3.5" />}
                    className="shrink-0"
                  >
                    {t('devices.detail.updateState')}
                  </Button>
                </div>
                <div className="p-3 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark text-center">
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
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      <div className="w-full">
        <div className="flex flex-col gap-4 mb-6">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onNavigateBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="self-start"
          >
            {t('common.back')}
          </Button>

          <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
                <Cpu className="w-6 h-6" aria-hidden />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 truncate">
                  {device.name}
                </h1>
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                    {device.deviceType}
                  </span>
                  <span className={`inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium ${statusClasses.bg} ${statusClasses.text}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${statusClasses.dot}`} />
                    {t(`devices.statuses.${device.status}`)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to={`/devices/${device.id}/edit`} className="no-underline">
                <Button type="button" variant="primary" leftIcon={<Pencil className="w-4 h-4" />}>
                  {t('devices.detail.edit')}
                </Button>
              </Link>
              <Button
                type="button"
                variant="danger"
                onClick={onOpenDeleteModal}
                leftIcon={<Trash2 className="w-4 h-4" />}
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
              <div className="w-10 h-10 bg-dangerBg dark:bg-dangerBg-dark text-danger dark:text-danger-dark rounded-full grid place-items-center mb-4">
                <AlertCircle className="w-6 h-6" aria-hidden />
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
