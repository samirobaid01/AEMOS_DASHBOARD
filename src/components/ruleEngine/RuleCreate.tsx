import React from 'react';
import { useTranslation } from 'react-i18next';
import RuleForm from './RuleForm';
import Button from '../common/Button/Button';
import RuleCreationStepper from './RuleCreationStepper';
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
}) => {
  const { t } = useTranslation();

  const steps = [
    { label: t('ruleEngine.createRuleChain') },
    { label: t('ruleEngine.addNodes') },
  ];

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <RuleCreationStepper steps={steps} currentStep={showNodeSection ? 1 : 0} />
      <RuleForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        ruleChainId={ruleChainId || undefined}
        showNodeSection={showNodeSection}
        onNodeDelete={onNodeDelete}
        onNodeCreate={onNodeCreate}
        onNodeUpdate={onNodeUpdate}
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
