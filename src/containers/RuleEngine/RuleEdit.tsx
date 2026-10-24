import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/store';
import {
  fetchRuleDetails,
  selectSelectedRule,
  selectRuleEngineLoading,
  selectRuleEngineError,
  updateRule,
  deleteRuleNode,
  createRuleNode,
  updateRuleNode,
  fetchSensors,
  fetchDevices,
} from '../../state/slices/ruleEngine.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import RuleForm from '../../components/ruleEngine/RuleForm';
import { toastService } from '../../services/toastService';
import { useTranslation } from 'react-i18next';
import type { RuleChainUpdatePayload } from '../../types/ruleEngine';
import type { RuleFormSubmitData } from '../../components/ruleEngine/types';
import type { NodeCreatePayload, NodeUpdatePayload } from '../../types/ruleEngine';

const RuleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { canUpdate } = useRuleEnginePermissions();

  const selectedRule = useAppSelector(selectSelectedRule);
  const loading = useAppSelector(selectRuleEngineLoading);
  const error = useAppSelector(selectRuleEngineError);

  useEffect(() => {
    if (id) {
      dispatch(fetchRuleDetails(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchSensors()).unwrap(),
          dispatch(fetchDevices()).unwrap()
        ]);
      } catch (error) {
        console.error('Error loading sensors or devices:', error);
        toastService.error(t('common.errorLoadingData'));
      }
    };

    loadData();
  }, [dispatch]);

  const handleSubmit = async (data: RuleFormSubmitData) => {
    if (!id || !selectedRule) return;

    try {
      const payload: RuleChainUpdatePayload = {
        organizationId: selectedRule.organizationId,
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      };
      await dispatch(updateRule({ id: parseInt(id), payload })).unwrap();
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

  const handleNodeCreate = async (data: NodeCreatePayload) => {
    try {
      if (!id) return;
      
      await dispatch(createRuleNode({
        ruleChainId: parseInt(id),
        type: data.type ?? 'filter',
        name: data.name ?? '',
        config: typeof data.config === 'string' ? data.config : JSON.stringify(data.config ?? {}),
        nextNodeId: null
      })).unwrap();
      
      toastService.success(t('ruleEngine.nodeCreateSuccess'));
    } catch (error) {
      console.error('Error creating node:', error);
      toastService.error(t('ruleEngine.nodeCreateError'));
    }
  };

  const handleNodeUpdate = async (nodeId: number, data: NodeUpdatePayload) => {
    try {
      const currentNode = selectedRule?.nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      const rawConfig = currentNode.config;
      const currentConfig = typeof rawConfig === 'string'
        ? JSON.parse(rawConfig)
        : (rawConfig as Record<string, unknown>);
      const nextNodeId = currentConfig?.nextNodeId;

      await dispatch(updateRuleNode({ 
        nodeId, 
        payload: {
          name: data.name ?? '',
          config: typeof data.config === 'string' ? data.config : JSON.stringify(data.config ?? {}),
          ...(nextNodeId !== undefined ? { nextNodeId } : {})
        }
      })).unwrap();
      
      // Refresh rule details to get updated state
      if (id) {
        await dispatch(fetchRuleDetails(parseInt(id))).unwrap();
      }
      
      toastService.success(t('ruleEngine.nodeUpdateSuccess'));
    } catch (error) {
      console.error('Error updating node:', error);
      toastService.error(t('ruleEngine.nodeUpdateError'));
    }
  };

  const handleNextNodeChange = async (nodeId: number, nextNodeId: number | null) => {
    try {
      const currentNode = selectedRule?.nodes.find(n => n.id === nodeId);
      if (!currentNode) return;
      await dispatch(updateRuleNode({
        nodeId,
        payload: {
          name: currentNode.name ?? '',
          config: typeof currentNode.config === 'string' ? currentNode.config : JSON.stringify(currentNode.config ?? {}),
          nextNodeId,
        }
      })).unwrap();
      if (id) {
        await dispatch(fetchRuleDetails(parseInt(id))).unwrap();
      }
      toastService.success(t('ruleEngine.nodeUpdateSuccess'));
    } catch (error) {
      console.error('Error updating next node:', error);
      toastService.error(t('ruleEngine.nodeUpdateError'));
    }
  };

  if (!canUpdate) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <RuleForm
        initialData={selectedRule || undefined}
        ruleChainId={id ? parseInt(id) : undefined}
        onSubmit={handleSubmit}
        isLoading={loading}
        showNodeSection={true}
        onNodeDelete={handleNodeDelete}
        onNodeCreate={handleNodeCreate}
        onNodeUpdate={handleNodeUpdate}
        onNextNodeChange={handleNextNodeChange}
      />
    </>
  );
};

export default RuleEdit; 