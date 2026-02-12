import React from 'react';
import { useTranslation } from 'react-i18next';
import RuleForm from './RuleForm';
import type { RuleChainCreatePayload, RuleChainUpdatePayload } from '../../types/ruleEngine';
import Button from '../common/Button/Button';
import type { Sensor } from '../../types/sensor';
import type { Device, DeviceStateRecord } from '../../types/device';

interface RuleCreateProps {
  onSubmit: (data: RuleChainCreatePayload | RuleChainUpdatePayload) => Promise<void>;
  onFinish: () => void;
  isLoading?: boolean;
  ruleChainId: number | null;
  showNodeSection: boolean;
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

const RuleCreate: React.FC<RuleCreateProps> = ({
  onSubmit,
  onFinish,
  isLoading,
  ruleChainId,
  showNodeSection,
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

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-6 m-0">
        {showNodeSection ? t('ruleEngine.addNodes') : t('ruleEngine.createRuleChain')}
      </h1>
      <RuleForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        ruleChainId={ruleChainId || undefined}
        showNodeSection={showNodeSection}
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
      {showNodeSection && (
        <div className="mt-4">
          <Button type="button" variant="primary" onClick={onFinish} className="w-full">
            {t('ruleEngine.finish')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RuleCreate;
