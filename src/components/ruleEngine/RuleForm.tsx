import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { RuleChain } from '../../types/ruleEngine';
import type { Device, DeviceStateRecord } from '../../types/device';
import type { Sensor } from '../../types/sensor';
import NodeDialog from './NodeDialog';
import ActionDialog from './ActionDialog';
import { useTranslation } from 'react-i18next';
import { ruleFormResolver } from '../../utils/validation/ruleFormValidation';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import FormField from '../common/FormField';

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
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId?: number | null;
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
  lastFetchedDeviceId = null,
  sensorDetails,
  onFetchSensorDetails,
  onFetchDeviceStates
}) => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<NodeFormData[]>(() => {
    if (!initialData?.nodes) {
      return [];
    }
    return initialData.nodes.map((node) => ({
      id: node.id,
      type: node.type as 'filter' | 'action',
      name: node.name,
      config: JSON.stringify(node.config),
    }));
  });

  // Sync local state with Redux state
  useEffect(() => {
    if (initialData?.nodes) {
      setNodes(initialData.nodes.map((node) => ({
        id: node.id,
        type: node.type as 'filter' | 'action',
        name: node.name,
        config: JSON.stringify(node.config),
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

  return (
    <div className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleMainFormSubmit)(e);
        }}
        className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm p-6"
        noValidate
      >
        <div className="mb-6">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={t('ruleEngine.ruleChainName')}
                error={errors.name?.message}
              />
            )}
          />
        </div>

        <div className="mb-6">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormField label={t('ruleEngine.ruleChainDescription')} id="rule-form-description">
                <textarea
                  {...field}
                  id="rule-form-description"
                  rows={3}
                  className="block w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm resize-y"
                />
                {errors.description?.message && (
                  <p className="mt-1 text-sm text-danger dark:text-danger-dark">{errors.description.message}</p>
                )}
              </FormField>
            )}
          />
        </div>

        {showNodeSection && ruleChainId && (
          <>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-2">
                Rule Chain Nodes
              </h2>

              {nodes.map((node, index) => (
                <div
                  key={index}
                  className="mb-4 rounded-lg border border-border dark:border-border-dark bg-surfaceHover dark:bg-surfaceHover-dark p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-medium text-textPrimary dark:text-textPrimary-dark">
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node {node.name}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => node.type === 'filter' ? handleNodeDialogOpen(index) : handleActionDialogOpen(index)}
                        title={t('common.edit')}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNodeDelete(node.id);
                        }}
                        title={t('common.delete')}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded bg-background dark:bg-background-dark p-3 font-mono text-sm overflow-x-auto">
                    <pre className="m-0">
                      {JSON.stringify(node.config, null, 2)}
                    </pre>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="flex justify-center my-4 text-textMuted dark:text-textMuted-dark">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNodeDialogOpen(null);
                  }}
                >
                  <svg className="w-4 h-4 mr-1.5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Node
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleActionDialogOpen();
                  }}
                >
                  <svg className="w-4 h-4 mr-1.5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
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
                  const configValue = typeof data.config === 'string'
                    ? JSON.parse(data.config)
                    : data.config;
                  setNodes(prev => prev.map(node =>
                    node.id === nodeId
                      ? { ...node, name: data.name, config: configValue }
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
              lastFetchedDeviceId={lastFetchedDeviceId ?? null}
              onFetchDeviceStates={onFetchDeviceStates}
            />
          </>
        )}

        {!ruleChainId && (
          <div className="mt-8">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full"
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