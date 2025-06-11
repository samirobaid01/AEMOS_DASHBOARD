import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  createRule, 
  selectRuleEngineLoading,
  createRuleNode,
  updateRuleNode,
  deleteRuleNode,
  fetchSensors,
  fetchDevices,
  fetchDeviceStates,
  fetchSensorDetails,
  selectSensors,
  selectDevices,
  selectDeviceStates,
  selectSensorDetails
} from '../../state/slices/ruleEngine.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import type { AppDispatch } from '../../state/store';
import type { RuleChainCreatePayload } from '../../types/ruleEngine';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import { RuleCreate as RuleCreateComponent } from '../../components/ruleEngine';
import { toastService } from '../../services/toastService';
import { useTranslation } from 'react-i18next';

const RuleCreate: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { canCreate } = useRuleEnginePermissions();
  const loading = useSelector(selectRuleEngineLoading);
  const selectedOrganizationId = useSelector(selectSelectedOrganizationId);
  const [createdRuleId, setCreatedRuleId] = useState<number | null>(null);

  // Select sensors and devices from state
  const sensors = useSelector(selectSensors);
  const devices = useSelector(selectDevices);
  const deviceStates = useSelector(selectDeviceStates);
  const sensorDetails = useSelector(selectSensorDetails);

  // Fetch sensors and devices when component mounts
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
  }, [dispatch, t]);

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
    } catch (error) {
      toastService.error('Failed to create rule chain');
    }
  };

  const handleFinish = () => {
    if (createdRuleId) {
      navigate(`/rule-engine/${createdRuleId}`);
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
    try {
      if (!createdRuleId) return;
      
      await dispatch(createRuleNode({
        ruleChainId: createdRuleId,
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
      await dispatch(updateRuleNode({ 
        nodeId, 
        payload: {
          name: data.name,
          config: data.config
        }
      })).unwrap();
      
      toastService.success(t('ruleEngine.nodeUpdateSuccess'));
    } catch (error) {
      console.error('Error updating node:', error);
      toastService.error(t('ruleEngine.nodeUpdateError'));
    }
  };

  const handleFetchSensorDetails = async (sensorId: number) => {
    try {
      await dispatch(fetchSensorDetails(sensorId)).unwrap();
    } catch (error) {
      console.error('Error fetching sensor details:', error);
      toastService.error(t('ruleEngine.fetchSensorDetailsError'));
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
      onNodeDelete={handleNodeDelete}
      onNodeCreate={handleNodeCreate}
      onNodeUpdate={handleNodeUpdate}
      sensors={sensors}
      devices={devices}
      deviceStates={deviceStates}
      sensorDetails={sensorDetails}
      onFetchSensorDetails={handleFetchSensorDetails}
      onFetchDeviceStates={handleFetchDeviceStates}
    />
  );
};

export default RuleCreate; 