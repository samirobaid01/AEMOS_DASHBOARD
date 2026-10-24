import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NodeDialog from './NodeDialog';
import ActionDialog from './ActionDialog';
import NodeSummary from './NodeSummary';
import { useTranslation } from 'react-i18next';
import { ruleFormResolver } from '../../utils/validation/ruleFormValidation';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import FormField from '../common/FormField';
import type { RuleFormProps, RuleFormSubmitData } from './types';
import type { NodeCreatePayload, NodeUpdatePayload } from '../../types/ruleEngine';
import { parseNodeConfig, serializeNodeConfig } from '../../utils/ruleNodeConfig';

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
  nextNodeId?: number | null;
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
  onNextNodeChange,
  isLoading = false,
  showNodeSection = true,
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
      config: serializeNodeConfig(node.config),
      nextNodeId: node.nextNodeId,
    }));
  });

  // Sync local state with Redux state
  useEffect(() => {
    if (initialData?.nodes) {
      setNodes(initialData.nodes.map((node) => ({
        id: node.id,
        type: node.type as 'filter' | 'action',
        name: node.name,
        config: serializeNodeConfig(node.config),
        nextNodeId: node.nextNodeId
      })));
    }
  }, [initialData]);

  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  const handleNodeDialogOpen = (index: number | null) => {
    setCurrentNodeIndex(index);
    setIsNodeDialogOpen(true);
  };

  const handleActionDialogOpen = (index?: number) => {
    if (index !== undefined) {
      setCurrentNodeIndex(index);
    } else {
      setCurrentNodeIndex(null);
    }
    setIsActionDialogOpen(true);
  };

  const handleNodeDialogClose = () => {
    setIsNodeDialogOpen(false);
    setCurrentNodeIndex(null);
  };

  const handleActionDialogClose = () => {
    setIsActionDialogOpen(false);
    setCurrentNodeIndex(null);
  };

  const getInitialExpression = (index: number | null) => {
    if (index === null) return undefined;
    
    const node = nodes[index];
    if (!node) return undefined;

    if (node.type === 'filter') {
      let nodeConfig: unknown;

      try {
        nodeConfig = parseNodeConfig(node.config);
      } catch (e) {
        console.error('Failed to parse node config:', e);
      }

      if (nodeConfig && typeof nodeConfig === 'object' && 'type' in nodeConfig && 'expressions' in nodeConfig) {
        return {
          id: node.id,
          type: 'filter' as const,
          name: node.name || '',
          config: serializeNodeConfig(nodeConfig)
        };
      }

      const cfg = nodeConfig as Record<string, unknown> | undefined;
      const newConfig: ExpressionConfig = {
        type: 'AND',
        expressions: [{
          sourceType: (cfg?.sourceType as string) || 'sensor',
          UUID: (cfg?.UUID as string) || '',
          key: (cfg?.key as string) || '',
          operator: (cfg?.operator as string) || '==',
          value: (cfg?.value as string | number) ?? '',
          duration: (cfg?.duration as string) || ''
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

  const handleNodeSave = async (data: NodeCreatePayload & { expressions?: unknown[] }) => {
    if (data.ruleChainId) {
      await onNodeCreate(data);
      return;
    }

    const exprs = Array.isArray(data.expressions) ? data.expressions : [];
    if (!exprs.length) {
      return;
    }

    if (exprs.length === 1 &&
        typeof exprs[0] === 'object' && exprs[0] !== null &&
        'type' in (exprs[0] as Record<string, unknown>) &&
        (exprs[0] as Record<string, unknown>).type === 'AND' &&
        !((exprs[0] as Record<string, unknown>).expressions as unknown[])?.length) {
      return;
    }

    const expression = exprs[0] as Record<string, unknown>;
    let nodeData: NodeFormData;

    const exprList = Array.isArray(expression?.expressions) ? (expression.expressions as unknown[]) : [];
    if (exprList[0] && typeof exprList[0] === 'object' && 'sourceType' in (exprList[0] as Record<string, unknown>)) {
      const conditionData = exprList[0] as FilterConfig;
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
    if (!nodeId) return;

    try {
      await onNodeDelete(nodeId);
      setNodes(prev => prev.filter(node => node.id !== nodeId));
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  const getActionNodeData = (node: NodeFormData): ActionNodeData | undefined => {
    
    let config: ActionConfig | undefined;
    
    try {
      const parsed = parseNodeConfig<ActionConfig>(node.config);
      if (parsed && parsed.type === 'DEVICE_COMMAND' && parsed.command) {
        config = parsed;
      }
    } catch {
      if (typeof node.config === 'object' && node.config !== null && 'type' in node.config && (node.config as ActionConfig).type === 'DEVICE_COMMAND') {
        config = node.config as ActionConfig;
      }
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

  const handleActionSave = async (actionData: NodeUpdatePayload & { name?: string }) => {
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
              config: parseNodeConfig(serializeNodeConfig(actionData.config))
            };
            return newNodes;
          });
        }
      } else {
        if (onNodeCreate) {
          await onNodeCreate({ ...actionData, type: 'action', config: actionData.config ?? {} });
          
          const newNode: NodeFormData = {
            type: 'action',
            name: actionData.name || '',
            config: parseNodeConfig(serializeNodeConfig(actionData.config ?? {}))
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

  const handleMainFormSubmit = async (data: RuleFormSubmitData) => {
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
    <div>
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
                  key={node.id}
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

                  <NodeSummary config={node.config} />

                  {onNextNodeChange && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                        {t('ruleEngine.nextNode')}
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary"
                        value={node.nextNodeId == null ? '' : String(node.nextNodeId)}
                        onChange={async (e) => {
                          const next = e.target.value === '' ? null : Number(e.target.value);
                          setNodes(prev => prev.map((n, i) => i === index ? { ...n, nextNodeId: next } : n));
                          if (node.id != null) {
                            await onNextNodeChange(node.id, next);
                          }
                        }}
                      >
                        <option value="">— None —</option>
                        {nodes
                          .filter((_, i) => i !== index)
                          .map((n) => (
                            <option key={n.id} value={String(n.id)}>
                              {n.name || `${n.type} node ${n.id}`}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

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
                  setNodes(prev => prev.map(node =>
                    node.id === nodeId
                      ? { ...node, name: data.name, config: parseNodeConfig(serializeNodeConfig(data.config)) }
                      : node
                  ));
                  handleNodeDialogClose();
                }}
                ruleChainId={ruleChainId}
                mode={currentNodeIndex === null ? 'add' : 'edit'}
                initialExpression={getInitialExpression(currentNodeIndex)}
              />
            )}

            <ActionDialog
              open={isActionDialogOpen}
              onClose={handleActionDialogClose}
              onSave={handleActionSave}
              ruleChainId={ruleChainId || 0}
              mode={currentNodeIndex !== null ? 'edit' : 'add'}
              initialData={currentNodeIndex !== null && nodes[currentNodeIndex] ? getActionNodeData(nodes[currentNodeIndex]) : undefined}
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