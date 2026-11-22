import React from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Cpu, X } from 'lucide-react';
import { Card, StatusDot, Sparkline } from '../ui';
import { cn } from '../../utils/cn';
import { formatTelemetryValue, extractEntityVariables, toNumeric } from '../../utils/telemetryFormat';
import type { TelemetryHistory } from '../../hooks/useTelemetryHistory';
import type { MonitoredEntity, EntityTelemetryData } from './types';

export interface SensorWidgetCardProps {
  entity: MonitoredEntity;
  data: EntityTelemetryData;
  history: TelemetryHistory;
  onRemove: (id: string) => void;
}

/** Pick a sparkline color from the variable name. */
const sparkColor = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('temp')) return '#059669'; // leaf
  if (n.includes('moist') || n.includes('humid')) return '#0284c7'; // sky
  if (n.includes('battery')) return '#bc6817'; // wheat
  return '#0ea5e9';
};

/** A dense per-entity widget: header + variable mini-tiles (value + sparkline) + footer. */
const SensorWidgetCard: React.FC<SensorWidgetCardProps> = ({ entity, data, history, onRemove }) => {
  const { t } = useTranslation();
  const variables = extractEntityVariables(entity, data);
  const Icon = entity.type === 'device' ? Cpu : Thermometer;
  const iconWrap = entity.type === 'device'
    ? 'bg-leaf-50 text-leaf-600 dark:bg-leaf-900/40 dark:text-leaf-300'
    : 'bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300';

  const tileCols = variables.length <= 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-ink-100 dark:border-ink-700 flex items-center gap-2">
        <span className={cn('w-8 h-8 rounded-lg grid place-items-center shrink-0', iconWrap)}>
          <Icon className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-ink-800 dark:text-ink-100 truncate">{entity.name}</div>
          <div className="text-xs text-ink-400 dark:text-ink-500 truncate">{entity.areaName}</div>
        </div>
        <StatusDot
          className="ml-auto shrink-0"
          status={data.connected ? 'online' : 'offline'}
          pulse={data.connected}
          label={data.connected ? t('telemetry.connected', 'Live') : t('telemetry.disconnected', 'Offline')}
        />
        <button
          type="button"
          onClick={() => onRemove(entity.id)}
          title={t('telemetry.removeEntity', 'Remove')}
          className="ml-1 shrink-0 w-7 h-7 grid place-items-center rounded-md text-ink-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {variables.length === 0 ? (
        <div className="p-4 text-sm text-ink-400 dark:text-ink-500">{t('telemetry.awaitingData', 'Awaiting data…')}</div>
      ) : (
        <div className={cn('p-3 grid gap-2', tileCols)}>
          {variables.map((v) => {
            const numeric = toNumeric(v.value);
            const series = history[`${entity.id}:${v.id}`];
            return (
              <div
                key={`${entity.id}-${v.id}`}
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  v.isNew ? 'bg-leaf-50 dark:bg-leaf-900/30 ring-1 ring-leaf-300 dark:ring-leaf-700' : 'bg-ink-50 dark:bg-ink-900/40',
                )}
              >
                <div className="text-[11px] text-ink-500 dark:text-ink-400 truncate" title={v.name}>{v.name}</div>
                <div className="text-lg font-bold tabular-nums text-ink-900 dark:text-ink-50 truncate">
                  {formatTelemetryValue(v.value, v.name, t('common.yes', 'Yes'), t('common.no', 'No'))}
                </div>
                {numeric !== null && series && series.length >= 2 ? (
                  <Sparkline data={series.map((p) => p.value)} color={sparkColor(v.name)} />
                ) : (
                  <div className="h-5" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-auto px-4 py-2 border-t border-ink-100 dark:border-ink-700 text-[11px] text-ink-400 dark:text-ink-500 flex justify-between">
        <span>{t('telemetry.variableCount', '{{count}} variables', { count: variables.length })}</span>
        <span>
          {data.lastUpdate
            ? `${t('telemetry.updated', 'updated')} ${new Date(data.lastUpdate).toLocaleTimeString()}`
            : t('telemetry.noData', 'no data yet')}
        </span>
      </div>
    </Card>
  );
};

export default SensorWidgetCard;
