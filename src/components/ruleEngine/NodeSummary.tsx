import React from 'react';
import { parseNodeConfig } from '../../utils/ruleNodeConfig';

interface FilterExpression {
  sourceType?: string;
  UUID?: string;
  key?: string;
  operator?: string;
  value?: string | number;
  duration?: string | number;
}

interface FilterGroup {
  type?: 'AND' | 'OR';
  expressions?: Array<FilterExpression | FilterGroup>;
}

interface FilterConfig extends FilterGroup {
  type: 'AND' | 'OR';
}

interface ActionConfig {
  type: 'DEVICE_COMMAND';
  command: {
    deviceUuid: string;
    stateName: string;
    value: string;
    initiatedBy?: string;
  };
}

type NodeConfig = FilterConfig | ActionConfig | Record<string, unknown>;

function isActionConfig(cfg: NodeConfig): cfg is ActionConfig {
  return (cfg as ActionConfig).type === 'DEVICE_COMMAND';
}

function isFilterConfig(cfg: NodeConfig): cfg is FilterConfig {
  const t = (cfg as FilterConfig).type;
  return t === 'AND' || t === 'OR';
}

function renderExpression(expr: FilterExpression | FilterGroup, depth = 0): React.ReactNode {
  const group = expr as FilterGroup;
  if (group.type === 'AND' || group.type === 'OR') {
    return (
      <div key={depth} className={depth > 0 ? 'ml-3 border-l-2 border-border dark:border-border-dark pl-2' : undefined}>
        <span className="text-xs font-semibold text-primary dark:text-primary-dark uppercase mr-1">{group.type}</span>
        {group.expressions?.map((child, i) => (
          <div key={i}>{renderExpression(child as FilterExpression | FilterGroup, depth + 1)}</div>
        ))}
      </div>
    );
  }
  const cond = expr as FilterExpression;
  return (
    <div className="flex flex-wrap gap-1 items-center text-xs py-0.5">
      <span className="text-textMuted dark:text-textMuted-dark">{cond.sourceType}</span>
      <span className="font-mono text-textPrimary dark:text-textPrimary-dark">{cond.key || cond.UUID}</span>
      <span className="text-accent dark:text-accent-dark">{cond.operator}</span>
      <span className="font-semibold text-textPrimary dark:text-textPrimary-dark">{String(cond.value ?? '')}</span>
      {cond.duration != null && (
        <span className="text-textMuted dark:text-textMuted-dark">for {cond.duration}s</span>
      )}
    </div>
  );
}

interface NodeSummaryProps {
  config: string | object;
}

const NodeSummary: React.FC<NodeSummaryProps> = ({ config }) => {
  let parsed: NodeConfig;
  try {
    parsed = parseNodeConfig<NodeConfig>(config);
  } catch {
    return (
      <pre className="rounded bg-surfaceHover dark:bg-surfaceHover-dark border border-border dark:border-border-dark p-3 font-mono text-xs overflow-x-auto text-textPrimary dark:text-textPrimary-dark m-0">
        {typeof config === 'string' ? config : JSON.stringify(config, null, 2)}
      </pre>
    );
  }

  if (isActionConfig(parsed)) {
    const { command } = parsed;
    return (
      <div className="rounded border border-border dark:border-border-dark bg-surfaceHover dark:bg-surfaceHover-dark p-3 text-sm space-y-1">
        <div className="flex gap-2">
          <span className="text-textMuted dark:text-textMuted-dark w-24 shrink-0">Device</span>
          <span className="font-mono text-textPrimary dark:text-textPrimary-dark break-all">{command.deviceUuid || '—'}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-textMuted dark:text-textMuted-dark w-24 shrink-0">State</span>
          <span className="font-semibold text-textPrimary dark:text-textPrimary-dark">{command.stateName || '—'}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-textMuted dark:text-textMuted-dark w-24 shrink-0">Value</span>
          <span className="font-semibold text-textPrimary dark:text-textPrimary-dark">{command.value || '—'}</span>
        </div>
      </div>
    );
  }

  if (isFilterConfig(parsed)) {
    return (
      <div className="rounded border border-border dark:border-border-dark bg-surfaceHover dark:bg-surfaceHover-dark p-3 text-sm">
        {renderExpression(parsed)}
      </div>
    );
  }

  return (
    <pre className="rounded bg-surfaceHover dark:bg-surfaceHover-dark border border-border dark:border-border-dark p-3 font-mono text-xs overflow-x-auto text-textPrimary dark:text-textPrimary-dark m-0">
      {JSON.stringify(parsed, null, 2)}
    </pre>
  );
};

export default NodeSummary;
