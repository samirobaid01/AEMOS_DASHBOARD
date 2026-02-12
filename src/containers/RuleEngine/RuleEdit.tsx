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
  fetchDeviceStates,
  fetchSensorDetails,
  selectSensors,
  selectDevices,
  selectDeviceStates,
  selectLastFetchedDeviceId,
  selectSensorDetails,
} from '../../state/slices/ruleEngine.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import RuleForm from '../../components/ruleEngine/RuleForm';
import NodeDialog from '../../components/ruleEngine/NodeDialog';
import ActionDialog from '../../components/ruleEngine/ActionDialog';
import { toastService } from '../../services/toastService';
import { useTranslation } from 'react-i18next';

const RuleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { canUpdate } = useRuleEnginePermissions();

  const selectedRule = useAppSelector(selectSelectedRule);
  const loading = useAppSelector(selectRuleEngineLoading);
  const error = useAppSelector(selectRuleEngineError);
  const sensors = useAppSelector(selectSensors);
  const devices = useAppSelector(selectDevices);
  const deviceStates = useAppSelector(selectDeviceStates);
  const lastFetchedDeviceId = useAppSelector(selectLastFetchedDeviceId);
  const sensorDetails = useAppSelector(selectSensorDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchRuleDetails(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Starting to fetch sensors and devices...');
        const [sensorsResult, devicesResult] = await Promise.all([
          dispatch(fetchSensors()).unwrap(),
          dispatch(fetchDevices()).unwrap()
        ]);
        console.log('Fetch completed:', { sensorsResult, devicesResult });
      } catch (error) {
        console.error('Error loading sensors or devices:', error);
        toastService.error(t('common.errorLoadingData'));
      }
    };

    loadData();
  }, [dispatch]);

  useEffect(() => {
    console.log('Sensors state updated:', { 
      sensorCount: sensors?.length,
      sensors,
      loading,
      error 
    });
  }, [sensors, loading, error]);

  useEffect(() => {
    console.log('Devices state updated:', { 
      deviceCount: devices?.length,
      devices,
      loading,
      error 
    });
  }, [devices, loading, error]);

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

  const handleNodeCreate = async (data: any) => {
    console.log("called handleNodeCreate from container");
    try {
      if (!id) return;
      
      await dispatch(createRuleNode({
        ruleChainId: parseInt(id),
        type: data.type,
        name: data.name,
        config: data.config,
        nextNodeId: null
      })).unwrap();
      
      toastService.success(t('ruleEngine.nodeCreateSuccess'));
    } catch (error) {
      console.error('Error creating node:', error);
      toastService.error(t('ruleEngine.nodeCreateError'));
    }
  };

  const handleNodeUpdate = async (nodeId: number, data: any) => {
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
          name: data.name,
          config: data.config,
          ...(nextNodeId !== undefined ? { nextNodeId } : {})  // Only include nextNodeId if it exists
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

  const handleFetchDeviceStates = async (deviceId: number) => {
    try {
      await dispatch(fetchDeviceStates(deviceId)).unwrap();
    } catch (error) {
      console.error('Error fetching device states:', error);
      toastService.error(t('ruleEngine.fetchDeviceStatesError'));
    }
  };

  const handleFetchSensorDetails = async (sensorId: number) => {
    try {
      console.log("called fetch sensor detail from container");
      await dispatch(fetchSensorDetails(sensorId)).unwrap();
    } catch (error) {
      console.error('Error fetching sensor details:', error);
      toastService.error(t('ruleEngine.fetchSensorDetailsError'));
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
        sensors={sensors}
        devices={devices}
        deviceStates={deviceStates}
        lastFetchedDeviceId={lastFetchedDeviceId}
        sensorDetails={sensorDetails}
        onFetchSensorDetails={handleFetchSensorDetails}
        onFetchDeviceStates={handleFetchDeviceStates}
      />
      <NodeDialog
        open={false} // Control this with state if needed
        onClose={() => {}} // Add close handler if needed
        onSave={handleNodeCreate}
        onUpdate={handleNodeUpdate}
        sensors={sensors}
        devices={devices}
        onFetchSensorDetails={handleFetchSensorDetails}
        sensorDetails={sensorDetails}
        mode="add"
      />
      <ActionDialog
        open={false}
        onClose={() => {}}
        onSave={handleNodeCreate}
        devices={devices}
        deviceStates={deviceStates}
        lastFetchedDeviceId={lastFetchedDeviceId}
        onFetchDeviceStates={handleFetchDeviceStates}
        mode="add"
        ruleChainId={id ? parseInt(id) : 0}
      />
    </>
  );
};

export default RuleEdit; 