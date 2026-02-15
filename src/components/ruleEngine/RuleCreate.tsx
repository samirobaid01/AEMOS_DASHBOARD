import React from 'react';
import { useTranslation } from 'react-i18next';
import RuleForm from './RuleForm';
import Button from '../common/Button/Button';
import type { RuleCreateProps } from './types';

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
