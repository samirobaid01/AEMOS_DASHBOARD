import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import type { RuleChain } from '../../types/ruleEngine';
import NodeDialog from './NodeDialog';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { ruleFormResolver } from '../../containers/RuleEngine/RuleEdit';

interface RuleFormProps {
  initialData?: RuleChain;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

interface NodeFormData {
  type: 'filter' | 'action';
  config: {
    sourceType?: 'sensor';
    UUID?: string;
    key?: string;
    operator?: '>' | '<' | '=' | '>=';
    value?: number;
    type?: 'DEVICE_COMMAND';
    command?: {
      deviceUuid: string;
      stateName: string;
      value: string;
      initiatedBy: 'device';
    };
  };
}

const RuleForm: React.FC<RuleFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<NodeFormData[]>(() => {
    console.log('RuleForm - Initialization Data:', {
      initialData,
      nodes: initialData?.nodes,
      hasNodes: !!initialData?.nodes,
    });

    if (!initialData?.nodes) {
      console.log('RuleForm - No nodes found, returning empty array');
      return [];
    }

    console.log('RuleForm - Processing nodes:', initialData.nodes);
    return initialData.nodes.map((node) => {
      console.log('RuleForm - Processing node:', node);
      return {
        type: node.type,
        config: JSON.parse(node.config),
      };
    });
  });

  // Add effect to log when props change
  useEffect(() => {
    console.log('RuleForm - Props updated:', {
      initialData,
      isLoading,
    });
  }, [initialData, isLoading]);

  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: ruleFormResolver,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const handleNodeDialogOpen = (index: number | null) => {
    setCurrentNodeIndex(index);
    setIsNodeDialogOpen(true);
  };

  const handleNodeDialogClose = () => {
    setIsNodeDialogOpen(false);
    setCurrentNodeIndex(null);
  };

  const handleNodeSave = (nodeData: NodeFormData) => {
    if (currentNodeIndex === null) {
      setNodes([...nodes, nodeData]);
    } else {
      const newNodes = [...nodes];
      newNodes[currentNodeIndex] = nodeData;
      setNodes(newNodes);
    }
    handleNodeDialogClose();
  };

  const handleNodeDelete = (index: number) => {
    setNodes(nodes.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: any) => {
    const formattedNodes = nodes.map((node, index) => ({
      type: node.type,
      config: JSON.stringify(node.config),
      nextNodeId: index < nodes.length - 1 ? index + 1 : null,
    }));

    await onSubmit({
      ...data,
      nodes: formattedNodes,
    });
  };

  const formStyle = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    padding: '1.5rem',
  };

  const formGroupStyle = {
    marginBottom: '1.5rem',
  };

  const nodeListStyle = {
    marginTop: '1.5rem',
  };

  const nodeItemStyle = {
    marginBottom: '1rem',
    backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
    borderRadius: '0.5rem',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    padding: '1rem',
  };

  const nodeHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const nodeActionsStyle = {
    display: 'flex',
    gap: '0.5rem',
  };

  const nodeConfigStyle = {
    backgroundColor: darkMode ? colors.background : '#f3f4f6',
    borderRadius: '0.375rem',
    padding: '0.75rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    overflowX: 'auto' as const,
  };

  const arrowStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '1rem 0',
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <form onSubmit={handleSubmit(handleFormSubmit)} style={formStyle}>
        <div style={formGroupStyle}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('ruleEngine.ruleChainName')}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
        </div>

        <div style={formGroupStyle}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label={t('ruleEngine.ruleChainDescription')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </div>

        <div style={nodeListStyle}>
          <Typography variant="h6" gutterBottom>
            Rule Chain Nodes
          </Typography>

          {nodes.map((node, index) => (
            <div key={index} style={nodeItemStyle}>
              <div style={nodeHeaderStyle}>
                <Typography variant="subtitle1">
                  {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
                </Typography>
                <div style={nodeActionsStyle}>
                  <IconButton
                    size="small"
                    onClick={() => handleNodeDialogOpen(index)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleNodeDelete(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>

              <div style={nodeConfigStyle}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(node.config, null, 2)}
                </pre>
              </div>

              {index < nodes.length - 1 && (
                <div style={arrowStyle}>
                  <ArrowDownwardIcon color="action" />
                </div>
              )}
            </div>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleNodeDialogOpen(null)}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Node
          </Button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? t('ruleEngine.saving') : initialData ? t('ruleEngine.updateRuleChain') : t('ruleEngine.createRuleChain')}
          </Button>
        </div>
      </form>

      <NodeDialog
        open={isNodeDialogOpen}
        onClose={handleNodeDialogClose}
        onSave={handleNodeSave}
        initialData={currentNodeIndex !== null ? nodes[currentNodeIndex] : undefined}
      />
    </div>
  );
};

export default RuleForm; 