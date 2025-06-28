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
import type { Device, DeviceState } from '../../types/device';
import type { Sensor } from '../../types/sensor';
import NodeDialog from './NodeDialog';
import ActionDialog from './ActionDialog';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { ruleFormResolver } from '../../utils/validation/ruleFormValidation';

interface RuleFormProps {
  initialData?: RuleChain;
  ruleChainId?: number;
  onSubmit: (data: any) => Promise<void>;
  onNodeDelete: (nodeId: number) => Promise<void>;
  onNodeCreate: (data: any) => Promise<void>;
  onNodeUpdate: (nodeId: number, data: any) => Promise<void>;
  isLoading?: boolean;
  showNodeSection?: boolean;
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceState[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}

interface FilterConfig {
  sourceType: string;
  UUID: string;
  key: string;
  operator: string;
  value: string | number;
  duration: string;
}

interface DeviceCommand {
  deviceUuid: string;
  stateName: string;
  value: string;
  initiatedBy: 'device';
}

interface ActionConfig {
  type: 'DEVICE_COMMAND';
  command: DeviceCommand;
}

interface ExpressionConfig {
  type: 'AND' | 'OR';
  expressions: FilterConfig[];
}

type NodeConfig = 
  | string 
  | ExpressionConfig 
  | ActionConfig 
  | {
      sourceType?: string;
      UUID?: string;
      key?: string;
      operator?: string;
      value?: string | number;
    };

interface NodeFormData {
  id?: number;
  name?: string;
  type: 'filter' | 'action';
  config: NodeConfig;
}

interface ActionNodeData {
  type: 'action';
  name?: string;
  config: ActionConfig;
}

const RuleForm: React.FC<RuleFormProps> = ({
  initialData,
  ruleChainId,
  onSubmit,
  onNodeDelete,
  onNodeCreate,
  onNodeUpdate,
  isLoading = false,
  showNodeSection = true,
  sensors,
  devices,
  deviceStates,
  sensorDetails,
  onFetchSensorDetails,
  onFetchDeviceStates
}) => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<NodeFormData[]>(() => {
    if (!initialData?.nodes) {
      return [];
    }
    return initialData.nodes.map((node) => ({
      id: node.id,
      type: node.type as 'filter' | 'action',
      name: node.name,
      config: JSON.parse(node.config),
    }));
  });

  // Sync local state with Redux state
  useEffect(() => {
    if (initialData?.nodes) {
      setNodes(initialData.nodes.map((node) => ({
        id: node.id,
        type: node.type as 'filter' | 'action',
        name: node.name,
        config: JSON.parse(node.config),
        nextNodeId: node.nextNodeId
      })));
    }
  }, [initialData]);

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

    console.log('Getting initial expression for node:', node);

    if (node.type === 'filter') {
      let nodeConfig: any;
      
      // If config is a string, try to parse it
      if (typeof node.config === 'string') {
        try {
          nodeConfig = JSON.parse(node.config);
        } catch (e) {
          console.error('Failed to parse node config:', e);
        }
      } else {
        nodeConfig = node.config;
      }

      console.log('Node config:', nodeConfig);

      // If the config is already in the correct format, use it directly
      if (nodeConfig && typeof nodeConfig === 'object' && 'type' in nodeConfig && 'expressions' in nodeConfig) {
        console.log('Using existing config object:', nodeConfig);
        return {
          id: node.id,
          type: 'filter' as const,
          name: node.name || '',
          config: JSON.stringify(nodeConfig)
        };
      }

      // Otherwise, create a new config object
      console.log('Creating new config object from node:', node);
      const newConfig: ExpressionConfig = {
        type: 'AND',
        expressions: [{
          sourceType: nodeConfig?.sourceType || 'sensor',
          UUID: nodeConfig?.UUID || '',
          key: nodeConfig?.key || '',
          operator: nodeConfig?.operator || '==',
          value: nodeConfig?.value || '',
          duration: nodeConfig?.duration || ''
        }]
      };

      return {
        id: node.id,
        type: 'filter' as const,
        name: node.name || '',
        config: JSON.stringify(newConfig)
      };
    }
    return undefined;
  };

  const handleNodeSave = async (data: any) => {
    console.log('Saving node data:', data);
    
    // If it's a new node being created
    if (data.ruleChainId) {
      await onNodeCreate(data);
      return;
    }

    // For existing nodes or other cases
    if (!data?.expressions?.length) {
      console.log('No expressions to save');
      return;
    }

    // Check if it's just an empty AND group
    if (data.expressions.length === 1 && 
        'type' in data.expressions[0] && 
        data.expressions[0].type === 'AND' && 
        !data.expressions[0].expressions?.length) {
      console.log('Empty AND group, not saving');
      return;
    }

    const expression = data.expressions[0];
    let nodeData: NodeFormData;

    if ('expressions' in expression && expression.expressions[0] && 'sourceType' in expression.expressions[0]) {
      // It's a ConditionData wrapped in an AND group
      const conditionData = expression.expressions[0];
      nodeData = {
        id: data.id,
        name: data.name,
        type: 'filter',
        config: {
          sourceType: conditionData.sourceType === 'sensor' ? 'sensor' : undefined,
          UUID: conditionData.UUID,
          key: conditionData.key,
          operator: conditionData.operator as '>' | '<' | '=' | '>=',
          value: typeof conditionData.value === 'number' ? conditionData.value : undefined
        }
      };
    } else {
      // It's a GroupData
      nodeData = {
        id: data.id,
        name: data.name,
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

  const handleNodeDelete = async (nodeId: number | undefined) => {
    console.log('Attempting to delete node:', nodeId);
    if (!nodeId) {
      console.error('Cannot delete node: no node ID provided');
      return;
    }

    try {
      await onNodeDelete(nodeId);
      setNodes(prev => prev.filter(node => node.id !== nodeId));
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  const getActionNodeData = (node: NodeFormData): ActionNodeData | undefined => {
    
    let config: ActionConfig | undefined;
    
    // Parse config if it's a string
    if (typeof node.config === 'string') {
      try {
        const parsed = JSON.parse(node.config);
        if (parsed.type === 'DEVICE_COMMAND' && parsed.command) {
          config = parsed as ActionConfig;
        }
      } catch (e) {
        console.error('Failed to parse action node config:', e);
      }
    }
    // Use config directly if it's an object
    else if (typeof node.config === 'object' && 'type' in node.config && node.config.type === 'DEVICE_COMMAND') {
      config = node.config as ActionConfig;
    }
    
    if (config) {
      return {
        type: 'action',
        name: node.name,
        config
      };
    }

    return undefined;
  };

  const handleActionSave = async (actionData: any) => {
    console.log('Saving action data:', actionData);
    
    try {
      if (currentNodeIndex !== null) {
        // Edit mode - update existing node via API
        const existingNode = nodes[currentNodeIndex];
        if (existingNode?.id && onNodeUpdate) {
          await onNodeUpdate(existingNode.id, {
            name: actionData.name || '',
            config: actionData.config
          });
          
          // Update local state after successful API call
          setNodes(prev => {
            const newNodes = [...prev];
            newNodes[currentNodeIndex] = {
              ...existingNode,
              name: actionData.name || '',
              config: JSON.parse(actionData.config)
            };
            return newNodes;
          });
        }
      } else {
        // Add mode - create new node via API
        console.log("creating new node via API");
        if (onNodeCreate) {
          await onNodeCreate(actionData);
          
          // Add to local state after successful API call
          const newNode: NodeFormData = {
            type: 'action',
            name: actionData.name || '',
            config: JSON.parse(actionData.config)
          };
          setNodes(prev => [...prev, newNode]);
        }
      }
      
      handleActionDialogClose();
    } catch (error) {
      console.error('Error saving action node:', error);
      // Keep dialog open on error so user can retry
    }
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
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node {node.name}
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
                          handleNodeDelete(node.id);
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
                onUpdate={async (nodeId, data) => {
                  await onNodeUpdate(nodeId, data);
                  // Update local state after successful update
                  setNodes(prev => prev.map(node => 
                    node.id === nodeId 
                      ? {
                          ...node,
                          name: data.name,
                          config: JSON.parse(data.config)
                        }
                      : node
                  ));
                  handleNodeDialogClose();
                }}
                ruleChainId={ruleChainId}
                mode={currentNodeIndex === null ? 'add' : 'edit'}
                initialExpression={getInitialExpression(currentNodeIndex)}
                sensors={sensors}
                devices={devices}
                sensorDetails={sensorDetails}
                onFetchSensorDetails={onFetchSensorDetails}
              />
            )}

            <ActionDialog
              open={isActionDialogOpen}
              onClose={handleActionDialogClose}
              onSave={handleActionSave}
              ruleChainId={ruleChainId || 0}
              mode={currentNodeIndex !== null ? 'edit' : 'add'}
              initialData={currentNodeIndex !== null && nodes[currentNodeIndex] ? getActionNodeData(nodes[currentNodeIndex]) : undefined}
              devices={devices}
              deviceStates={deviceStates}
              onFetchDeviceStates={onFetchDeviceStates}
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