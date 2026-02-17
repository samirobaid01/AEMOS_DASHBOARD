import React from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../common/Page/Page';
import TelemetryFilters from './TelemetryFilters';
import TelemetryTable from './TelemetryTable';
import type { TelemetryDashboardProps } from './types';

const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  monitoredEntities,
  telemetryData,
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
  onAddEntity,
  onRemoveEntity,
  windowWidth,
  isLoading = false
}) => {
  const { t } = useTranslation();

  const canAddEntity = (selectedSensorId !== null || selectedDeviceId !== null) && 
    !monitoredEntities.some(e => 
      (e.type === 'sensor' && e.entityId === selectedSensorId) ||
      (e.type === 'device' && e.entityId === selectedDeviceId)
    );

  return (
    <Page
      title={t('telemetry.pageTitle')}
      description={t('telemetry.pageDescription')}
      className="bg-background dark:bg-background-dark min-h-[calc(100vh-60px)] text-textPrimary dark:text-textPrimary-dark"
    >
      <div className="space-y-6">
        <TelemetryFilters
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
          onAddEntity={onAddEntity}
          canAdd={canAddEntity}
          isLoading={isLoading}
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
              {t('telemetry.monitoredEntities')}
            </h2>
            {monitoredEntities.length > 0 && (
              <div className="text-sm text-textSecondary dark:text-textSecondary-dark">
                {t('telemetry.entityCount', { count: monitoredEntities.length })}
              </div>
            )}
          </div>

          <TelemetryTable
            monitoredEntities={monitoredEntities}
            telemetryData={telemetryData}
            onRemoveEntity={onRemoveEntity}
            windowWidth={windowWidth}
          />
        </div>
      </div>
    </Page>
  );
};

export default TelemetryDashboard;
