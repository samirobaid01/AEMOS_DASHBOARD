import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TelemetryHistory } from '../../hooks/useTelemetryHistory';
import type { MonitoredEntity } from './types';

export interface TelemetryTimeChartProps {
  entities: MonitoredEntity[];
  history: TelemetryHistory;
}

const PALETTE = ['#0ea5e9', '#059669', '#bc6817', '#8c6544', '#0284c7', '#d6891e'];
const MAX_SERIES = 6;

interface SeriesDef {
  key: string;
  color: string;
  points: { t: number; value: number }[];
}

/** Multi-series live line chart built from the rolling history buffer. */
const TelemetryTimeChart: React.FC<TelemetryTimeChartProps> = ({ entities, history }) => {
  const { t } = useTranslation();

  const { series, rows } = useMemo(() => {
    const defs: SeriesDef[] = [];

    for (const entity of entities) {
      const vars =
        entity.type === 'sensor'
          ? (entity.telemetryVariables ?? []).map((v) => ({ id: v.id, name: v.variableName }))
          : (entity.states ?? []).map((s) => ({ id: s.id, name: s.stateName }));

      for (const v of vars) {
        const points = history[`${entity.id}:${v.id}`];
        if (points && points.length >= 2) {
          defs.push({ key: `${entity.name} · ${v.name}`, color: PALETTE[defs.length % PALETTE.length], points });
          if (defs.length >= MAX_SERIES) break;
        }
      }
      if (defs.length >= MAX_SERIES) break;
    }

    const rowMap = new Map<number, Record<string, number>>();
    for (const def of defs) {
      for (const p of def.points) {
        const row = rowMap.get(p.t) ?? { t: p.t };
        row[def.key] = p.value;
        rowMap.set(p.t, row);
      }
    }
    const merged = Array.from(rowMap.values()).sort((a, b) => a.t - b.t);
    return { series: defs, rows: merged };
  }, [entities, history]);

  if (series.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-ink-400 dark:text-ink-500">
        {t('telemetry.chartEmpty', 'Collecting data… trends appear as readings arrive.')}
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            domain={['dataMin', 'dataMax']}
            scale="time"
            tickFormatter={(v: number) => new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            stroke="#e2e8f0"
          />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#e2e8f0" width={40} />
          <Tooltip
            labelFormatter={(v) => new Date(Number(v)).toLocaleTimeString()}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              // Function dataKey: recharts treats a string key as a lodash path, so a
              // name containing "." or "[" would silently resolve to undefined.
              dataKey={(row: Record<string, number>) => row[s.key]}
              name={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryTimeChart;
