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
import ActionDialog from './ActionDialog';
import type { ConditionData, GroupData } from './NodeDialog';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { ruleFormResolver } from '../../containers/RuleEngine/RuleEdit';

interface RuleFormProps {
  initialData?: RuleChain;
  ruleChainId?: number;
  jwtToken?: string;
  organizationId?: number;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  showNodeSection?: boolean;
}

interface FilterConfig {
  type: 'filter';
  config: {
    sourceType?: 'sensor';
    UUID?: string;
    key?: string;
    operator?: '>' | '<' | '=' | '>=';
    value?: number;
  };
}

interface DeviceCommand {
  deviceUuid: string;
  stateName: string;
  value: string;
  initiatedBy: 'device';
}

interface ActionConfig {
  type: 'action';
  config: {
    type: 'DEVICE_COMMAND';
    command: DeviceCommand;
  };
}

type NodeFormData = FilterConfig | ActionConfig;

const RuleForm: React.FC<RuleFormProps> = ({
  initialData,
  ruleChainId,
  jwtToken,
  organizationId,
  onSubmit,
  isLoading = false,
  showNodeSection = true,
}) => {
  console.log('RuleForm props:', { ruleChainId, organizationId });
  
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<NodeFormData[]>(() => {
    if (!initialData?.nodes) {
      return [];
    }
    return initialData.nodes.map((node) => ({
      type: node.type,
      config: JSON.parse(node.config),
    }));
  });

  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  const handleNodeDialogOpen = (index: number | null) => {
    console.log('Opening node dialog with index:', index);
    setCurrentNodeIndex(index);
    setIsNodeDialogOpen(true);
  };

  const handleActionDialogOpen = (index?: number) => {
    console.log('Opening action dialog with index:', index);
    if (index !== undefined) {
      // Edit mode
      console.log('Edit mode - setting current node index:', index);
      console.log('Current node data:', nodes[index]);
      setCurrentNodeIndex(index);
    } else {
      // Add mode - reset current node index
      console.log('Add mode - resetting current node index');
      setCurrentNodeIndex(null);
    }
    setIsActionDialogOpen(true);
  };

  const handleNodeDialogClose = () => {
    console.log('Closing node dialog');
    setIsNodeDialogOpen(false);
    setCurrentNodeIndex(null);
  };

  const handleActionDialogClose = () => {
    console.log('Closing action dialog');
    setIsActionDialogOpen(false);
    setCurrentNodeIndex(null);
  };

  const getInitialExpression = (index: number | null) => {
    if (index === null) return undefined;
    
    const node = nodes[index];
    if (!node) return undefined;

    if (node.type === 'filter') {
      return {
        type: 'filter' as const,
        sourceType: node.config.sourceType || 'sensor',
        UUID: node.config.UUID || '',
        key: node.config.key || '',
        operator: node.config.operator || '==',
        value: node.config.value || ''
      };
    }
    return undefined;
  };

  const handleNodeSave = (data: { expressions: Array<ConditionData | GroupData> }) => {
    console.log('Saving node data:', data);
    if (!data.expressions.length) {
      console.log('No expressions to save');
      return;
    }

    // Check if it's just an empty AND group
    if (data.expressions.length === 1 && 
        'type' in data.expressions[0] && 
        data.expressions[0].type === 'AND' && 
        data.expressions[0].expressions.length === 0) {
      console.log('Empty AND group, not saving');
      return;
    }

    const expression = data.expressions[0];
    let nodeData: NodeFormData;

    if ('sourceType' in expression) {
      // It's a ConditionData
      nodeData = {
        type: 'filter',
        config: {
          sourceType: expression.sourceType === 'sensor' ? 'sensor' : undefined,
          UUID: expression.UUID,
          key: expression.key,
          operator: expression.operator as '>' | '<' | '=' | '>=',
          value: typeof expression.value === 'number' ? expression.value : undefined
        }
      };
    } else {
      // It's a GroupData
      nodeData = {
        type: 'action',
        config: {
          type: 'DEVICE_COMMAND',
          command: {
            deviceUuid: '',
            stateName: '',
            value: '',
            initiatedBy: 'device'
          }
        }
      };
    }
    
    console.log('Processed node data:', nodeData);
    if (currentNodeIndex === null) {
      setNodes(prev => [...prev, nodeData]);
    } else {
      setNodes(prev => {
        const newNodes = [...prev];
        newNodes[currentNodeIndex] = nodeData;
        return newNodes;
      });
    }
  };

  const handleNodeDelete = (index: number) => {
    setNodes(prev => prev.filter((_, i) => i !== index));
  };

  const getActionNodeData = (node: NodeFormData): ActionConfig | undefined => {
    console.log('Getting action node data from:', node);
    if (node.type === 'action') {
      // The node has a nested config structure: config.config.command
      const nestedConfig = node.config as any;
      const commandData = nestedConfig.config?.command;

      console.log('Nested config:', nestedConfig);
      console.log('Extracted command data:', commandData);

      if (commandData) {
        const actionData: ActionConfig = {
          type: 'action',
          config: {
            type: 'DEVICE_COMMAND',
            command: {
              deviceUuid: commandData.deviceUuid,
              stateName: commandData.stateName,
              value: commandData.value,
              initiatedBy: 'device'
            }
          }
        };
        console.log('Transformed action data:', actionData);
        return actionData;
      }
    }
    return undefined;
  };

  const handleActionSave = (actionData: any) => {
    console.log('Saving action data:', actionData);
    const newNode: ActionConfig = {
      type: 'action',
      config: {
        type: 'DEVICE_COMMAND',
        command: actionData.config.command
      }
    };
    
    if (currentNodeIndex !== null) {
      // Edit mode - update existing node
      setNodes(prev => {
        const newNodes = [...prev];
        newNodes[currentNodeIndex] = newNode;
        return newNodes;
      });
    } else {
      // Add mode - add new node
      setNodes(prev => [...prev, newNode]);
    }
    handleActionDialogClose();
  };

  const handleMainFormSubmit = async (data: any) => {
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
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleMainFormSubmit)(e);
        }} 
        style={formStyle}
        noValidate
      >
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

        {showNodeSection && ruleChainId && (
          <>
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
                        onClick={() => node.type === 'filter' ? handleNodeDialogOpen(index) : handleActionDialogOpen(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNodeDelete(index);
                        }}
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNodeDialogOpen(null);
                  }}
                  fullWidth
                >
                  Add Node
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleActionDialogOpen();
                  }}
                  fullWidth
                >
                  Add Action
                </Button>
              </div>
            </div>

            {isNodeDialogOpen && (
              <NodeDialog
                open={isNodeDialogOpen}
                onClose={handleNodeDialogClose}
                onSave={(data) => {
                  handleNodeSave(data);
                  handleNodeDialogClose();
                }}
                ruleChainId={ruleChainId}
                jwtToken={jwtToken}
                organizationId={organizationId}
                mode={currentNodeIndex === null ? 'add' : 'edit'}
                initialExpression={getInitialExpression(currentNodeIndex)}
              />
            )}

            <ActionDialog
              open={isActionDialogOpen}
              onClose={handleActionDialogClose}
              onSave={handleActionSave}
              ruleChainId={ruleChainId}
              jwtToken={jwtToken}
              organizationId={organizationId}
              mode={currentNodeIndex !== null ? 'edit' : 'add'}
              initialData={currentNodeIndex !== null && nodes[currentNodeIndex] ? getActionNodeData(nodes[currentNodeIndex]) : undefined}
            />
          </>
        )}

        {!ruleChainId && (
          <div style={{ marginTop: '2rem' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? t('ruleEngine.saving') : t('ruleEngine.createRuleChain')}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RuleForm; 