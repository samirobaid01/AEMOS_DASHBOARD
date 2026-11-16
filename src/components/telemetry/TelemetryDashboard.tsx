import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radio } from 'lucide-react';
import Page from '../common/Page/Page';
import { Card, Gauge, Badge } from '../ui';
import TelemetryToolbar from './TelemetryToolbar';
import TelemetryKpiRow from './TelemetryKpiRow';
import TelemetryTimeChart from './TelemetryTimeChart';
import SensorWidgetCard from './SensorWidgetCard';
import { extractEntityVariables, toNumeric } from '../../utils/telemetryFormat';
import type { TelemetryDashboardProps } from './types';

interface GaugeReading {
  key: string;
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

const GAUGE_COLORS = ['#0ea5e9', '#059669', '#bc6817', '#8c6544'];

/** Heuristic gauge scale by variable name (real min/max metadata is a follow-up). */
const gaugeScale = (name: string, value: number): { max: number; unit: string } => {
  const n = name.toLowerCase();
  if (/moist|humid|batter|satur|oxygen|signal/.test(n)) return { max: 100, unit: n.includes('signal') ? '' : '%' };
  if (n.includes('temp')) return { max: 50, unit: '°C' };
  if (n.includes('ph')) return { max: 14, unit: '' };
  return { max: Math.max(Math.ceil(value * 1.5), 10), unit: '' };
};

const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  monitoredEntities,
  telemetryData,
  history,
  organizations,
  areas,
  sensors,
  devices,
  selectedOrgId,
  selectedAreaId,
  selectedSensorId,
  selectedDeviceId,
  onOrgChange,
  onAreaChange,
  onSensorChange,
  onDeviceChange,
  onClearFilters,
  onAddEntity,
  onRemoveEntity,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const canAddEntity =
    (selectedSensorId !== null || selectedDeviceId !== null) &&
    !monitoredEntities.some(
      (e) =>
        (e.type === 'sensor' && e.entityId === selectedSensorId) ||
        (e.type === 'device' && e.entityId === selectedDeviceId),
    );

  // Up to four numeric current readings become gauges.
  const gauges: GaugeReading[] = [];
  for (const entity of monitoredEntities) {
    const data = telemetryData[entity.id];
    if (!data) continue;
    for (const v of extractEntityVariables(entity, data)) {
      const numeric = toNumeric(v.value);
      if (numeric === null) continue;
      const { max, unit } = gaugeScale(v.name, numeric);
      gauges.push({
        key: `${entity.id}-${v.id}`,
        label: v.name,
        value: numeric,
        max,
        unit,
        color: GAUGE_COLORS[gauges.length % GAUGE_COLORS.length],
      });
      if (gauges.length >= 4) break;
    }
    if (gauges.length >= 4) break;
  }

  return (
    <Page
      title={t('telemetry.pageTitle')}
      description={t('telemetry.pageDescription')}
      className="max-w-none bg-background dark:bg-background-dark min-h-[calc(100vh-60px)] text-textPrimary dark:text-textPrimary-dark"
    >
      <div className="space-y-4">
        <TelemetryToolbar
          selectedOrgId={selectedOrgId}
          selectedAreaId={selectedAreaId}
          selectedSensorId={selectedSensorId}
          selectedDeviceId={selectedDeviceId}
          organizations={organizations}
          areas={areas}
          sensors={sensors}
          devices={devices}
          onOrgChange={onOrgChange}
          onAreaChange={onAreaChange}
          onSensorChange={onSensorChange}
          onDeviceChange={onDeviceChange}
          onClearFilters={onClearFilters}
          onAddEntity={onAddEntity}
          canAdd={canAddEntity}
          isLoading={isLoading}
        />

        {monitoredEntities.length === 0 ? (
          <Card interactive={false} className="p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-300 grid place-items-center mb-3">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-ink-800 dark:text-ink-100">
              {t('telemetry.emptyTitle', 'No entities monitored yet')}
            </h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              {t('telemetry.emptyHint', 'Pick a sensor or device above and add it to start live monitoring.')}
            </p>
          </Card>
        ) : (
          <>
            <TelemetryKpiRow entities={monitoredEntities} telemetryData={telemetryData} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card interactive={false} className="xl:col-span-2 p-4">
                <h3 className="font-semibold text-ink-800 dark:text-ink-100 mb-2">
                  {t('telemetry.trendsTitle', 'Live telemetry')}
                </h3>
                <TelemetryTimeChart entities={monitoredEntities} history={history} />
              </Card>

              <Card interactive={false} className="p-4">
                <h3 className="font-semibold text-ink-800 dark:text-ink-100 mb-3">
                  {t('telemetry.keyReadings', 'Key readings')}
                </h3>
                {gauges.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-sm text-ink-400 dark:text-ink-500">
                    {t('telemetry.noNumericReadings', 'No numeric readings yet.')}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {gauges.map((g) => (
                      <Gauge key={g.key} value={g.value} max={g.max} unit={g.unit} color={g.color} label={g.label} />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {monitoredEntities.map((entity) => {
                const data = telemetryData[entity.id];
                if (!data) return null;
                return (
                  <SensorWidgetCard
                    key={entity.id}
                    entity={entity}
                    data={data}
                    history={history}
                    onRemove={onRemoveEntity}
                  />
                );
              })}
            </div>

            <Card interactive={false} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-ink-800 dark:text-ink-100">
                  {t('telemetry.recentEvents', 'Recent events')}
                </h3>
                <Badge variant="neutral">{t('telemetry.sample', 'sample')}</Badge>
              </div>
              <p className="text-sm text-ink-400 dark:text-ink-500">
                {t('telemetry.eventsPlaceholder', 'An events / alarms feed will appear here once the backend exposes it.')}
              </p>
            </Card>
          </>
        )}
      </div>
    </Page>
  );
};

export default TelemetryDashboard;
