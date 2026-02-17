import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button/Button';
import SensorIcon from './SensorIcon';
import type { TelemetryRowProps } from './types';

const TelemetryRow: React.FC<TelemetryRowProps> = React.memo(({ entity, telemetryData, onRemove, isMobile }) => {
  const { t } = useTranslation();

  const formatValue = (value: string | number | boolean, variableName?: string): string => {
    if (value === '-' || value === null || value === undefined) return '-';
    
    if (typeof value === 'boolean') {
      return value ? t('common.yes') : t('common.no');
    }
    
    if (typeof value === 'number') {
      if (variableName) {
        const lowerName = variableName.toLowerCase();
        if (lowerName.includes('temperature')) return `${value.toFixed(1)}°C`;
        if (lowerName.includes('moisture') || lowerName.includes('humidity')) return `${value.toFixed(1)}%`;
        if (lowerName.includes('pressure')) return `${value.toFixed(0)} hPa`;
        if (lowerName.includes('battery')) return `${value.toFixed(0)}%`;
      }
      return value.toFixed(2);
    }
    
    return String(value);
  };

  const getVariablesList = () => {
    const variables: Array<{ id: string; name: string; value: string | number | boolean; isNew: boolean }> = [];

    if (entity.type === 'sensor' && entity.telemetryVariables) {
      entity.telemetryVariables.forEach(variable => {
        const dataValue = telemetryData.values[variable.id];
        if (dataValue) {
          variables.push({
            id: variable.id.toString(),
            name: variable.variableName,
            value: dataValue.value,
            isNew: dataValue.isNew
          });
        }
      });
    } else if (entity.type === 'device' && entity.states) {
      entity.states.forEach(state => {
        const dataValue = telemetryData.values[state.id];
        if (dataValue) {
          variables.push({
            id: state.id.toString(),
            name: state.stateName,
            value: dataValue.value,
            isNew: dataValue.isNew
          });
        }
      });
    }

    return variables;
  };

  const variables = getVariablesList();
  const typeIcon = entity.type === 'sensor' ? (
    <SensorIcon className="w-5 h-5 text-wheat-600 dark:text-wheat-400" />
  ) : (
    '📡'
  );
  const typeBadgeColor = entity.type === 'sensor' 
    ? 'bg-wheat-100 dark:bg-wheat-900 text-wheat-800 dark:text-wheat-200' 
    : 'bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200';

  if (isMobile) {
    return (
      <div className="p-4 border-b border-border dark:border-border-dark last:border-0 bg-card dark:bg-card-dark">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex">{typeIcon}</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeBadgeColor}`}>
                {t(`telemetry.${entity.type}`)}
              </span>
            </div>
            <h3 className="text-base font-semibold text-textPrimary dark:text-textPrimary-dark m-0 truncate">
              {entity.name}
            </h3>
            <p className="text-xs text-textMuted dark:text-textMuted-dark m-0 mt-1">
              {entity.organizationName} → {entity.areaName}
            </p>
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onRemove(entity.id)}
            className="ml-2 p-1 min-w-0"
            title={t('telemetry.removeEntity')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${telemetryData.connected ? 'bg-success dark:bg-success-dark' : 'bg-danger dark:bg-danger-dark'}`} />
          <span className="text-xs text-textSecondary dark:text-textSecondary-dark">
            {telemetryData.connected ? t('telemetry.connected') : t('telemetry.disconnected')}
          </span>
          {telemetryData.lastUpdate && (
            <span className="text-xs text-textMuted dark:text-textMuted-dark">
              {t('telemetry.lastUpdate')}: {new Date(telemetryData.lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {variables.map(variable => (
            <div
              key={`${entity.id}-${variable.id}`}
              className={`p-2 rounded border transition-all duration-300 ${
                variable.isNew
                  ? 'border-primary dark:border-primary-dark bg-primary/10 dark:bg-primary-dark/10'
                  : 'border-border dark:border-border-dark bg-surface dark:bg-surface-dark'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark truncate">
                  {variable.name}
                </span>
                <span className="text-sm font-semibold text-textPrimary dark:text-textPrimary-dark ml-2">
                  {formatValue(variable.value, variable.name)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex">{typeIcon}</span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeBadgeColor}`}>
            {t(`telemetry.${entity.type}`)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <div className="font-semibold text-textPrimary dark:text-textPrimary-dark">
            {entity.name}
          </div>
          <div className="text-xs text-textMuted dark:text-textMuted-dark mt-0.5">
            {entity.organizationName} → {entity.areaName}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {variables.map(variable => (
            <div
              key={`${entity.id}-${variable.id}`}
              className={`px-2 py-1 rounded text-sm transition-all duration-300 ${
                variable.isNew
                  ? 'bg-primary dark:bg-primary-dark text-white font-semibold'
                  : 'bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark'
              }`}
            >
              <span className="font-medium">{variable.name}:</span>{' '}
              <span>{formatValue(variable.value, variable.name)}</span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${telemetryData.connected ? 'bg-success dark:bg-success-dark' : 'bg-danger dark:bg-danger-dark'}`} />
          <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
            {telemetryData.connected ? t('telemetry.connected') : t('telemetry.disconnected')}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        {telemetryData.lastUpdate ? (
          <div className="text-sm text-textPrimary dark:text-textPrimary-dark">
            {new Date(telemetryData.lastUpdate).toLocaleTimeString()}
          </div>
        ) : (
          <span className="text-sm text-textMuted dark:text-textMuted-dark">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onRemove(entity.id)}
          title={t('telemetry.removeEntity')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </td>
    </tr>
  );
});

TelemetryRow.displayName = 'TelemetryRow';

export default TelemetryRow;
