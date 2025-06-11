import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import { 
  fetchRuleDetails, 
  selectSelectedRule, 
  selectRuleEngineLoading, 
  selectRuleEngineError,
  updateRule,
  deleteRuleNode
} from '../../state/slices/ruleEngine.slice';
import { selectAuthToken } from '../../state/slices/auth.slice';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import type { AppDispatch } from '../../state/store';
import RuleForm from '../../components/ruleEngine/RuleForm';
import { toastService } from '../../services/toastService';
import { useTranslation } from 'react-i18next';

const RuleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { canUpdate } = useRuleEnginePermissions();

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

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
      await dispatch(updateRule({ id: parseInt(id), payload: data })).unwrap();
      toastService.success(t('ruleEngine.updateSuccess'));
    } catch (error) {
      toastService.error(t('ruleEngine.updateError'));
      console.error('Failed to update rule chain:', error);
    }
  };

  const handleNodeDelete = async (nodeId: number) => {
    try {
      await dispatch(deleteRuleNode(nodeId)).unwrap();
      toastService.success(t('ruleEngine.nodeDeleteSuccess'));
    } catch (error) {
      console.error('Error deleting node:', error);
      toastService.error(t('ruleEngine.nodeDeleteError'));
    }
  };

  if (!canUpdate) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <RuleForm
      initialData={selectedRule || undefined}
      ruleChainId={id ? parseInt(id) : undefined}
      onSubmit={handleSubmit}
      isLoading={loading}
      showNodeSection={true}
      onNodeDelete={handleNodeDelete}
    />
  );
};

export default RuleEdit; 