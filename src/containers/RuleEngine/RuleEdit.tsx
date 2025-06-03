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