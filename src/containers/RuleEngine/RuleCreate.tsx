import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { createRule, selectRuleEngineLoading } from '../../state/slices/ruleEngine.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import type { AppDispatch } from '../../state/store';
import type { RuleChainCreatePayload } from '../../types/ruleEngine';
import {selectSelectedOrganizationId} from '../../state/slices/auth.slice';
import { RuleCreate as RuleCreateComponent } from '../../components/ruleEngine';
import { toastService } from '../../services/toastService';

const RuleCreate: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { canCreate } = useRuleEnginePermissions();
  const loading = useSelector(selectRuleEngineLoading);
  const selectedOrganizationId = useSelector(selectSelectedOrganizationId);
  const [createdRuleId, setCreatedRuleId] = useState<number | null>(null);

  const handleSubmit = async (data: RuleChainCreatePayload) => {
    try {
      if(selectedOrganizationId){
        data.organizationId = selectedOrganizationId;
      }else{
        toastService.error('Please select an organization');
        return;
      }
      const result = await dispatch(createRule(data)).unwrap();
      setCreatedRuleId(result.id);
      toastService.success('Rule chain created successfully');
      // Don't navigate immediately, let the user add nodes first
      // navigate(`/rule-engine/${result.id}`);
    } catch (error) {
      toastService.error('Failed to create rule chain');
    }
  };

  const handleFinish = () => {
    if (createdRuleId) {
      navigate(`/rule-engine/${createdRuleId}`);
    }
  };

  if (!canCreate) {
    return <Navigate to="/rule-engine" replace />;
  }

  return (
    <RuleCreateComponent
      onSubmit={handleSubmit}
      onFinish={handleFinish}
      isLoading={loading}
      ruleChainId={createdRuleId}
      showNodeSection={!!createdRuleId}
    />
  );
};

export default RuleCreate; 