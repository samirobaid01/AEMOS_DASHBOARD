import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card/Card';
import TelemetryRow from './TelemetryRow';
import type { TelemetryTableProps } from './types';

const TelemetryTable: React.FC<TelemetryTableProps> = ({
  monitoredEntities,
  telemetryData,
  onRemoveEntity,
  windowWidth
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  if (monitoredEntities.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-textMuted dark:text-textMuted-dark mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-2">
            {t('telemetry.noEntitiesMonitored')}
          </h3>
          <p className="text-sm text-textSecondary dark:text-textSecondary-dark max-w-md mx-auto">
            {t('telemetry.noEntitiesDescription')}
          </p>
        </div>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <Card contentClassName="p-0">
        <div className="divide-y divide-border dark:divide-border-dark">
          {monitoredEntities.map(entity => {
            const data = telemetryData[entity.id];
            if (!data) return null;
            
            return (
              <TelemetryRow
                key={entity.id}
                entity={entity}
                telemetryData={data}
                onRemove={onRemoveEntity}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card contentClassName="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase tracking-wider">
                {t('telemetry.type')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase tracking-wider">
                {t('telemetry.name')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase tracking-wider">
                {t('telemetry.values')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase tracking-wider">
                {t('telemetry.status')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase tracking-wider">
                {t('telemetry.lastUpdate')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-border-dark">
            {monitoredEntities.map(entity => {
              const data = telemetryData[entity.id];
              if (!data) return null;
              
              return (
                <TelemetryRow
                  key={entity.id}
                  entity={entity}
                  telemetryData={data}
                  onRemove={onRemoveEntity}
                  isMobile={isMobile}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TelemetryTable;
