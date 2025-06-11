import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { 
  fetchRuleDetails, 
  selectSelectedRule, 
  selectRuleEngineLoading, 
  selectRuleEngineError,
  deleteRule,
  updateRuleNode
} from '../../state/slices/ruleEngine.slice';
import { selectAuthToken } from '../../state/slices/auth.slice';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import type { AppDispatch } from '../../state/store';
import { RuleDetails as RuleDetailsComponent } from '../../components/ruleEngine';
import { toastService } from '../../services/toastService';
import { useTranslation } from 'react-i18next';

const RuleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { canView } = useRuleEnginePermissions();

  const selectedRule = useSelector(selectSelectedRule);
  const loading = useSelector(selectRuleEngineLoading);
  const error = useSelector(selectRuleEngineError);
  const token = useSelector(selectAuthToken);
  const organizationId = useSelector(selectSelectedOrganizationId);

  useEffect(() => {
    if (id) {
      dispatch(fetchRuleDetails(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleEdit = (ruleId: number) => {
    navigate(`/rule-engine/${ruleId}/edit`);
  };

  const handleDelete = async (ruleId: number) => {
    try {
      await dispatch(deleteRule(ruleId)).unwrap();
      toastService.success(t('ruleEngine.deleteSuccess'));
      navigate('/rule-engine');
    } catch (error) {
      toastService.error(t('ruleEngine.deleteError'));
      console.error('Failed to delete rule chain:', error);
    }
  };

  const handleNextNodeChange = async (nodeId: number, nextNodeId: number | null) => {
    try {
      const currentNode = selectedRule?.nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      await dispatch(updateRuleNode({
        nodeId,
        payload: {
          type: currentNode.type,
          config: currentNode.config,
          nextNodeId
        }
      })).unwrap();

      toastService.success(t('ruleEngine.nodeUpdateSuccess'));
    } catch (error) {
      console.error('Error updating next node:', error);
      toastService.error(t('ruleEngine.nodeUpdateError'));
    }
  };

  const handleBack = () => {
    navigate('/rule-engine');
  };

  if (!canView) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <RuleDetailsComponent
      rule={selectedRule}
      isLoading={loading}
      error={error}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNextNodeChange={handleNextNodeChange}
    />
  );
};

export default RuleDetails; 