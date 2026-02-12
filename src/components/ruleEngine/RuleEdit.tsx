import React from 'react';
import { useTranslation } from 'react-i18next';
import RuleForm from './RuleForm';
import type { RuleChain, RuleChainUpdatePayload } from '../../types/ruleEngine';
import type { Sensor } from '../../types/sensor';
import type { Device, DeviceStateRecord } from '../../types/device';

interface RuleEditProps {
  rule: RuleChain | null;
  isLoading: boolean;
  error?: string | null;
  onSubmit: (data: RuleChainUpdatePayload) => Promise<void>;
  windowWidth?: number;
  ruleChainId: number;
  onNodeDelete: (nodeId: number) => Promise<void>;
  onNodeCreate: (data: any) => Promise<void>;
  onNodeUpdate: (nodeId: number, data: any) => Promise<void>;
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId: number | null;
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}

const RuleEdit: React.FC<RuleEditProps> = ({
  rule,
  isLoading,
  error,
  onSubmit,
  windowWidth = window.innerWidth,
  ruleChainId,
  onNodeDelete,
  onNodeCreate,
  onNodeUpdate,
  sensors,
  devices,
  deviceStates,
  lastFetchedDeviceId,
  sensorDetails,
  onFetchSensorDetails,
  onFetchDeviceStates
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div
          className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-primary-dark animate-spin"
          aria-hidden
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-[800px] mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
        <p className="text-dangerText dark:text-dangerText-dark my-4 m-0">
          {error}
        </p>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className={`max-w-[800px] mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
        <p className="text-textSecondary dark:text-textSecondary-dark my-4 m-0">
          {t('rules.notFound')}
        </p>
      </div>
    );
  }

  return (
    <div className={`max-w-[800px] mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
      <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-6 m-0">
        {t('rules.edit')}: {rule.name}
      </h1>
      <RuleForm
        initialData={rule}
        onSubmit={onSubmit}
        isLoading={isLoading}
        ruleChainId={ruleChainId}
        showNodeSection={true}
        onNodeDelete={onNodeDelete}
        onNodeCreate={onNodeCreate}
        onNodeUpdate={onNodeUpdate}
        sensors={sensors}
        devices={devices}
        deviceStates={deviceStates}
        lastFetchedDeviceId={lastFetchedDeviceId}
        sensorDetails={sensorDetails}
        onFetchSensorDetails={onFetchSensorDetails}
        onFetchDeviceStates={onFetchDeviceStates}
      />
    </div>
  );
};

export default RuleEdit;
