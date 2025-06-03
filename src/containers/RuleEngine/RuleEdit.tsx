import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { fetchRuleDetails, updateRule, selectSelectedRule, selectRuleEngineLoading } from '../../state/slices/ruleEngine.slice';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import type { AppDispatch } from '../../state/store';
import type { RuleChainUpdatePayload } from '../../types/ruleEngine';
import RuleForm from '../../components/ruleEngine/RuleForm';
import { toastService } from '../../services/toastService';
import { Box, Typography, CircularProgress } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Rule form validation
export const ruleFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

export const ruleFormResolver = yupResolver(ruleFormSchema);

// Node form types
export interface FilterConfig {
  sourceType: string;
  UUID: string;
  key: string;
  operator: ">" | "<" | "=" | ">=";
  value: number;
}

export interface ActionConfig {
  deviceUuid: string;
  stateName: string;
  stateValue: string;
}

export interface NodeFormData {
  type: "filter" | "action";
  config: FilterConfig | ActionConfig;
}

export const defaultNodeFormValues = {
  type: "filter" as const,
  config: {
    sourceType: "",
    UUID: "",
    key: "",
    operator: ">" as const,
    value: 0,
    deviceUuid: "",
    stateName: "",
    stateValue: "",
  },
};

// Node configuration validation schema
export const nodeValidationSchema = yup.object({
  type: yup.string().oneOf(['filter', 'action']).required(),
  config: yup.lazy((value) => {
    if (value?.type === 'filter') {
      return yup.object({
        sourceType: yup.string().required('Source type is required'),
        UUID: yup.string().required('UUID is required'),
        key: yup.string().required('Key is required'),
        operator: yup.string().oneOf(['>', '<', '=', '>=']).required('Operator is required'),
        value: yup.number().required('Value is required'),
      });
    }
    return yup.object({
      deviceUuid: yup.string().required('Device UUID is required'),
      stateName: yup.string().required('State name is required'),
      stateValue: yup.string().required('State value is required'),
    });
  }),
});

// Form resolver
export const nodeFormResolver = yupResolver(nodeValidationSchema);

// Helper function to format node data for API
export const formatNodeData = (data: NodeFormData) => {
  if (data.type === "filter") {
    const config = data.config as FilterConfig;
    return {
      type: data.type,
      config: {
        sourceType: config.sourceType,
        UUID: config.UUID,
        key: config.key,
        operator: config.operator,
        value: config.value,
      },
    };
  } else {
    const config = data.config as ActionConfig;
    return {
      type: data.type,
      config: {
        type: "DEVICE_COMMAND",
        command: {
          deviceUuid: config.deviceUuid,
          stateName: config.stateName,
          value: config.stateValue,
          initiatedBy: "device",
        },
      },
    };
  }
};

const RuleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { canUpdate } = useRuleEnginePermissions();

  const selectedRule = useSelector(selectSelectedRule);
  const loading = useSelector(selectRuleEngineLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchRuleDetails(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleSubmit = async (data: RuleChainUpdatePayload) => {
    try {
      if (!id) {
        throw new Error('Rule ID is required');
      }

      const result = await dispatch(updateRule({
        id: parseInt(id),
        payload: data,
      })).unwrap();

      toastService.success('Rule chain updated successfully');
      navigate(`/rule-engine/${result.id}`);
    } catch (error) {
      toastService.error('Failed to update rule chain');
      console.error('Failed to update rule chain:', error);
    }
  };

  if (!canUpdate) {
    return <Navigate to="/rule-engine" replace />;
  }

  if (!selectedRule) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Edit Rule Chain
      </Typography>
      <RuleForm
        initialData={selectedRule}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </Box>
  );
};

export default RuleEdit; 