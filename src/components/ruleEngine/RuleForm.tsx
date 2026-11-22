import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NodeDialog from './NodeDialog';
import ActionDialog from './ActionDialog';
import NodeSummary from './NodeSummary';
import { useTranslation } from 'react-i18next';
import { Zap, Plus, Trash2, Pencil, ChevronRight } from 'lucide-react';
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

const textareaClasses =
  'block w-full min-h-24 px-3 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';

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
        className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden"
        noValidate
      >
        <div className="flex items-center gap-3 p-6 border-b border-border dark:border-border-dark">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
            <Zap className="w-5 h-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0">
              {t('ruleEngine.ruleChainDetails', { defaultValue: 'Rule Chain Details' })}
            </h2>
            <p className="text-sm text-textMuted dark:text-textMuted-dark mt-0.5 m-0">
              {t('ruleEngine.ruleChainDetailsSubtitle', { defaultValue: 'Name your rule chain and build its conditions and actions.' })}
            </p>
          </div>
        </div>
        <div className="p-6">
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
                  className={textareaClasses}
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
                {t('ruleEngine.ruleChainNodes', { defaultValue: 'Rule Chain Nodes' })}
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
                        variant="secondary"
                        size="sm"
                        onClick={() => node.type === 'filter' ? handleNodeDialogOpen(index) : handleActionDialogOpen(index)}
                        title={t('common.edit')}
                        aria-label={t('common.edit')}
                        className="p-2"
                      >
                        <Pencil className="w-4 h-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNodeDelete(node.id);
                        }}
                        title={t('common.delete')}
                        aria-label={t('common.delete')}
                        className="p-2 text-danger hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden />
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
                        className={selectClasses}
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
                      <ChevronRight className="w-6 h-6 rotate-90" aria-hidden />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNodeDialogOpen(null);
                  }}
                >
                  {t('ruleEngine.addNode', { defaultValue: 'Add Node' })}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleActionDialogOpen();
                  }}
                >
                  {t('ruleEngine.addAction', { defaultValue: 'Add Action' })}
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
        </div>
      </form>
    </div>
  );
};

export default RuleForm; 