import React from 'react';
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

  const handleSubmit = async (data: RuleChainCreatePayload) => {
    try {
      if(selectedOrganizationId){
        data.organizationId = selectedOrganizationId;
      }else{
        toastService.error('Please select an organization');
        return;
      }
      const result = await dispatch(createRule(data)).unwrap();
      toastService.success('Rule chain created successfully');
      navigate(`/rule-engine/${result.id}`);
    } catch (error) {
      toastService.error('Failed to create rule chain');
    }
  };

  if (!canCreate) {
    return <Navigate to="/rule-engine" replace />;
  }

  return (
    <RuleCreateComponent
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
};

export default RuleCreate; 