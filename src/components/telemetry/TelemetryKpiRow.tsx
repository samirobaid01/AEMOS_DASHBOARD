import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Wifi, AlertTriangle, Activity } from 'lucide-react';
import { KpiTile } from '../ui';
import type { MonitoredEntity, TelemetryData } from './types';

export interface TelemetryKpiRowProps {
  entities: MonitoredEntity[];
  telemetryData: TelemetryData;
}

const RECENT_WINDOW_MS = 60_000;

/** Four summary KPI tiles across the top of the dashboard. */
const TelemetryKpiRow: React.FC<TelemetryKpiRowProps> = ({ entities, telemetryData }) => {
  const { t } = useTranslation();

  const total = entities.length;
  const online = entities.filter((e) => telemetryData[e.id]?.connected).length;
  const now = Date.now();
  const recentlyUpdated = entities.filter((e) => {
    const last = telemetryData[e.id]?.lastUpdate;
    return last ? now - new Date(last).getTime() < RECENT_WINDOW_MS : false;
  }).length;

  const onlinePct = total > 0 ? Math.round((online / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiTile
        label={t('telemetry.kpiMonitored', 'Monitored')}
        value={total}
        hint={t('telemetry.kpiEntities', 'entities')}
        icon={<LayoutGrid className="w-4 h-4" />}
      />
      <KpiTile
        label={t('telemetry.kpiOnline', 'Online')}
        value={online}
        hint={t('telemetry.kpiOnlinePct', '{{pct}}% connected', { pct: onlinePct })}
        accent={online === total && total > 0 ? 'success' : 'neutral'}
        icon={<Wifi className="w-4 h-4" />}
      />
      <KpiTile
        label={t('telemetry.kpiAlarms', 'Active alarms')}
        value={0}
        hint={t('telemetry.kpiNominal', 'all nominal')}
        icon={<AlertTriangle className="w-4 h-4" />}
      />
      <KpiTile
        label={t('telemetry.kpiActive', 'Updated (last min)')}
        value={recentlyUpdated}
        hint={t('telemetry.kpiLive', 'live now')}
        accent={recentlyUpdated > 0 ? 'success' : 'neutral'}
        icon={<Activity className="w-4 h-4" />}
      />
    </div>
  );
};

export default TelemetryKpiRow;
