import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  Thermometer,
  Droplets,
  Battery,
  Wifi,
  FileText,
  Zap,
} from 'lucide-react';
import { useTelemetrySocket } from '../../hooks/useTelemetrySocket';
import Button from '../common/Button/Button';
import type { SensorDetailsProps } from './types';

const SensorDetails: React.FC<SensorDetailsProps> = ({
  sensor,
  isLoading: _isLoading,
  error: _error,
  onEdit,
  onDelete,
  onBack,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { telemetryValues, connected } = useTelemetrySocket(sensor?.TelemetryData);

  if (!sensor) {
    return null;
  }

  const formatTelemetryValue = (value: string | number | boolean | null | undefined, datatype: string) => {
    if (value === undefined || value === null) return '-';
    switch (datatype.toLowerCase()) {
      case 'float':
        return typeof value === 'number' ? value.toFixed(2) : value;
      case 'integer':
        return typeof value === 'number' ? Math.round(value) : value;
      case 'boolean':
        return value ? t('true') : t('false');
      default:
        return String(value);
    }
  };

  const getTelemetryUnit = (variableName: string) => {
    const v = variableName.toLowerCase();
    if (v.includes('temperature')) return '°C';
    if (v.includes('moisture') || v.includes('humidity')) return '%';
    if (v.includes('pressure')) return 'hPa';
    if (v.includes('battery')) return '%';
    if (v.includes('signal') || v.includes('strength')) return 'dBm';
    if (v.includes('light')) return 'lux';
    if (v.includes('voltage')) return 'V';
    if (v.includes('current')) return 'A';
    if (v.includes('power')) return 'W';
    if (v.includes('ph')) return 'pH';
    return '';
  };

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="self-start"
        >
          {t('common.back')}
        </Button>

        <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
              <Thermometer className="w-6 h-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 truncate">
                {sensor.name}
              </h1>
              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                  {sensor.type}
                </span>
                <span
                  className={`inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium ${
                    sensor.status
                      ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
                      : 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${sensor.status ? 'bg-success dark:bg-success-dark' : 'bg-danger dark:bg-danger-dark'}`} />
                  {sensor.status ? t('active') : t('inactive')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button type="button" variant="primary" onClick={onEdit} leftIcon={<Pencil className="w-4 h-4" />}>
              {t('edit')}
            </Button>
            <Button type="button" variant="danger" onClick={onDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
              {t('delete')}
            </Button>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">
                {t('sensors.sensorInformation')}
              </h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t('sensors.name')}</p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">{sensor.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t('sensors.area')}</p>
                <p className="text-base m-0">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-leaf-50 dark:bg-leaf-900/40 text-leaf-700 dark:text-leaf-300">
                    {sensor.area?.name ?? (sensor.areaId != null ? String(sensor.areaId) : '-')}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">
                {t('sensors.additionalDetails')}
              </h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t('description')}</p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0 leading-relaxed">{sensor.description || t('sensors.noDescription')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t('sensors.createdAt')}</p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
                  {sensor.createdAt ? new Date(sensor.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </div>

          {sensor.metadata && Object.keys(sensor.metadata).length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">{t('metadata')}</h2>
              <div className="border border-border dark:border-border-dark rounded-lg overflow-hidden">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-surfaceHover dark:bg-surfaceHover-dark border-b border-border dark:border-border-dark">
                      <th className="py-3 px-4 text-left font-medium text-textSecondary dark:text-textSecondary-dark">{t('property')}</th>
                      <th className="py-3 px-4 text-left font-medium text-textSecondary dark:text-textSecondary-dark">{t('value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sensor.metadata).map(([key, value]) => (
                      <tr key={key} className="border-b border-border dark:border-border-dark last:border-0">
                        <td className="py-3 px-4 font-medium text-textPrimary dark:text-textPrimary-dark">{key}</td>
                        <td className="py-3 px-4 text-textSecondary dark:text-textSecondary-dark">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {sensor.TelemetryData && sensor.TelemetryData.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0 flex items-center">
                  {t('sensors.telemetryData')}
                  {connected && (
                    <span className="inline-flex items-center ml-3 text-xs font-medium text-successText dark:text-successText-dark">
                      <span className="w-2 h-2 rounded-full bg-success dark:bg-success-dark mr-1.5 animate-pulse" />
                      {t('live')}
                    </span>
                  )}
                </h2>
                {import.meta.env.DEV && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/debug/socket-tester')}
                    leftIcon={<Zap className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    {t('debug_socket')}
                  </Button>
                )}
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {sensor.TelemetryData.map((variable) => {
                  const telemetryData = telemetryValues[variable.id];
                  const isNew = telemetryData?.isNew;
                  const typeBgClass = getVariableTypeBgClass(variable.datatype);
                  const typeTextClass = getVariableTypeTextClass(variable.datatype);
                  return (
                    <div
                      key={variable.id}
                      className={`rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm p-5 flex flex-col gap-3 transition-all duration-300 ${isNew ? 'ring-2 ring-leaf-400 dark:ring-leaf-500 scale-[1.02]' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-textPrimary dark:text-textPrimary-dark">
                          {variable.variableName.replace(/_/g, ' ')}
                        </span>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${typeBgClass} ${typeTextClass}`}>
                          {variable.datatype}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0 w-11 h-11 rounded-lg bg-ink-100 dark:bg-ink-800 text-textSecondary dark:text-textSecondary-dark grid place-items-center">
                          {getTelemetryIconForType(variable.variableName)}
                          {isNew && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success dark:bg-success-dark ring-2 ring-white dark:ring-card-dark animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-2xl font-semibold flex items-baseline gap-1 tabular-nums transition-colors ${isNew ? 'text-leaf-600 dark:text-leaf-400' : 'text-textPrimary dark:text-textPrimary-dark'}`}>
                            {telemetryData ? (
                              formatTelemetryValue(telemetryData.value, variable.datatype)
                            ) : (
                              <span className="text-base italic text-textSecondary dark:text-textSecondary-dark">{t('sensors.waitingForData')}</span>
                            )}
                            {telemetryData && (
                              <span className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark">{getTelemetryUnit(variable.variableName)}</span>
                            )}
                          </div>
                          {telemetryData?.timestamp && (
                            <div className="text-xs text-textSecondary dark:text-textSecondary-dark mt-1 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden />
                              {t('last_update')}: {new Date(telemetryData.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getVariableTypeBgClass = (type: string) => {
  switch (type.toLowerCase()) {
    case 'float': return 'bg-infoBg dark:bg-infoBg-dark';
    case 'integer': return 'bg-warningBg dark:bg-warningBg-dark';
    case 'boolean': return 'bg-successBg dark:bg-successBg-dark';
    case 'string': return 'bg-infoBg dark:bg-infoBg-dark';
    default: return 'bg-surfaceHover dark:bg-surfaceHover-dark';
  }
};

const getVariableTypeTextClass = (type: string) => {
  switch (type.toLowerCase()) {
    case 'float': return 'text-infoText dark:text-infoText-dark';
    case 'integer': return 'text-warningText dark:text-warningText-dark';
    case 'boolean': return 'text-successText dark:text-successText-dark';
    case 'string': return 'text-infoText dark:text-infoText-dark';
    default: return 'text-textSecondary dark:text-textSecondary-dark';
  }
};

const getTelemetryIconForType = (variableName: string) => {
  const v = variableName.toLowerCase();
  const cls = 'w-5 h-5';
  if (v.includes('moisture') || v.includes('humidity')) return <Droplets className={cls} aria-hidden />;
  if (v.includes('temperature')) return <Thermometer className={cls} aria-hidden />;
  if (v.includes('battery')) return <Battery className={cls} aria-hidden />;
  if (v.includes('signal') || v.includes('strength')) return <Wifi className={cls} aria-hidden />;
  return <FileText className={cls} aria-hidden />;
};

export default SensorDetails;
