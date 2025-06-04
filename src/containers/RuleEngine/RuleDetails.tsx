import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import { fetchRuleDetails, selectSelectedRule, selectRuleEngineLoading, selectRuleEngineError } from '../../state/slices/ruleEngine.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import type { AppDispatch } from '../../state/store';
import { RuleDetails as RuleDetailsComponent } from '../../components/ruleEngine';

const RuleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { canView } = useRuleEnginePermissions();

  const selectedRule = useSelector(selectSelectedRule);
  const loading = useSelector(selectRuleEngineLoading);
  const error = useSelector(selectRuleEngineError);

  useEffect(() => {
    if (id) {
      dispatch(fetchRuleDetails(parseInt(id)));
    }
  }, [dispatch, id]);

  if (!canView) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <RuleDetailsComponent
      rule={selectedRule}
      isLoading={loading}
      error={error}
    />
  );
};

export default RuleDetails; 