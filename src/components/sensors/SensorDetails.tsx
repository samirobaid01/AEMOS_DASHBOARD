import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  windowWidth,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = windowWidth < 768;
  const { telemetryValues, connected } = useTelemetrySocket(sensor?.TelemetryData);

  if (!sensor) {
    return null;
  }

  // Helper function to format telemetry values based on their type
  const formatTelemetryValue = (value: string | number | boolean | null | undefined, datatype: string) => {
    if (value === undefined || value === null) return "-";
    
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

  // Helper function to get unit for telemetry variables
  const getTelemetryUnit = (variableName: string) => {
    const variableNameLower = variableName.toLowerCase();
    
    if (variableNameLower.includes('temperature')) return '°C';
    if (variableNameLower.includes('moisture') || variableNameLower.includes('humidity')) return '%';
    if (variableNameLower.includes('pressure')) return 'hPa';
    if (variableNameLower.includes('battery')) return '%';
    if (variableNameLower.includes('signal') || variableNameLower.includes('strength')) return 'dBm';
    if (variableNameLower.includes('light')) return 'lux';
    if (variableNameLower.includes('voltage')) return 'V';
    if (variableNameLower.includes('current')) return 'A';
    if (variableNameLower.includes('power')) return 'W';
    if (variableNameLower.includes('ph')) return 'pH';
    
    return '';
  };

  return (
    <div className={`p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark ${isMobile ? 'p-4' : ''}`}>
      <div className={`flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6`}>
        <div className="flex items-center">
          <Button type="button" variant="secondary" onClick={onBack} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back')}
          </Button>
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">{sensor.name}</h1>
        </div>
        <div className={`flex gap-2 ${isMobile ? 'flex-wrap w-full' : 'flex-nowrap'}`}>
          <Button type="button" variant="primary" onClick={onEdit}>
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t("edit")}
          </Button>
          <Button type="button" variant="danger" onClick={onDelete}>
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t("delete")}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm dark:shadow-md overflow-hidden">
        <div className="p-6">
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div>
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">
                {t("sensors.sensorInformation")}
              </h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t("sensors.name")}</p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">{sensor.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t("sensors.type")}</p>
                <p className="text-base m-0">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-infoBg dark:bg-infoBg-dark text-infoText dark:text-infoText-dark">
                    {sensor.type}
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t("status")}</p>
                <p className="text-base m-0">
                  <span
                    className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${
                      sensor.status
                        ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
                        : 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${sensor.status ? 'bg-success dark:bg-success-dark' : 'bg-danger dark:bg-danger-dark'}`} />
                    {sensor.status ? t("active") : t("inactive")}
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t("sensors.area")}</p>
                <p className="text-base m-0">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark">
                    {sensor.area?.name ?? (sensor.areaId != null ? String(sensor.areaId) : "-")}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">
                {t("sensors.additionalDetails")}
              </h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t("description")}</p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0 leading-relaxed">{sensor.description || t("sensors.noDescription")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">{t("sensors.createdAt")}</p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
                  {sensor.createdAt ? new Date(sensor.createdAt).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          </div>

          {sensor.metadata && Object.keys(sensor.metadata).length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">{t("metadata")}</h2>
              <div className="border border-border dark:border-border-dark rounded overflow-hidden">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-surfaceHover dark:bg-surfaceHover-dark border-b border-border dark:border-border-dark">
                      <th className="py-3 px-4 text-left font-medium text-textSecondary dark:text-textSecondary-dark">{t("property")}</th>
                      <th className="py-3 px-4 text-left font-medium text-textSecondary dark:text-textSecondary-dark">{t("value")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sensor.metadata).map(([key, value]) => (
                      <tr key={key} className="border-b border-border dark:border-border-dark last:border-0">
                        <td className="py-3 px-4 font-medium text-textPrimary dark:text-textPrimary-dark">{key}</td>
                        <td className="py-3 px-4 text-textSecondary dark:text-textSecondary-dark">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
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
                <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
                  {t('sensors.telemetryData')}
                  {connected && (
                    <span className="inline-flex items-center ml-3 text-xs font-medium text-successText dark:text-successText-dark">
                      <span className="w-2 h-2 rounded-full bg-success dark:bg-success-dark mr-1.5 animate-pulse" />
                      {t('live')}
                    </span>
                  )}
                </h2>
                <Button type="button" variant="outline" size="sm" onClick={() => navigate('/debug/socket-tester')} className="flex items-center py-2 px-3 text-xs bg-infoBg dark:bg-infoBg-dark text-infoText dark:text-infoText-dark border-0">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('debug_socket')}
                </Button>
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {sensor.TelemetryData.map((variable) => {
                  const telemetryData = telemetryValues[variable.id];
                  const isNew = telemetryData?.isNew;
                  const typeBgClass = getVariableTypeBgClass(variable.datatype);
                  const typeTextClass = getVariableTypeTextClass(variable.datatype);
                  return (
                    <div
                      key={variable.id}
                      className={`rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm dark:shadow-md p-5 flex flex-col gap-3 transition-all duration-300 ${isNew ? 'ring-2 ring-info dark:ring-info-dark scale-[1.02]' : ''}`}
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
                        <div className="relative h-10 w-10 flex-shrink-0">
                          {getTelemetryIconForType(variable.variableName)}
                          {isNew && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success dark:bg-success-dark ring-2 ring-white animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`text-2xl font-semibold flex items-baseline gap-1 transition-colors ${isNew ? 'text-info dark:text-info-dark' : 'text-textPrimary dark:text-textPrimary-dark'}`}>
                            {telemetryData
                              ? formatTelemetryValue(telemetryData.value, variable.datatype)
                              : <span className="text-base italic text-textSecondary dark:text-textSecondary-dark">{t('sensors.waitingForData')}</span>}
                            {telemetryData && <span className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark">{getTelemetryUnit(variable.variableName)}</span>}
                          </div>
                          {telemetryData?.timestamp && (
                            <div className="text-xs text-textSecondary dark:text-textSecondary-dark mt-1 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
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

const iconClass = 'w-10 h-10 text-textSecondary dark:text-textSecondary-dark';

const getTelemetryIconForType = (variableName: string) => {
  const v = variableName.toLowerCase();
  if (v.includes('moisture') || v.includes('humidity')) {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-4.3-3.497-8.5-7.5-8.5S4.5 7.7 4.5 12c0 6 7.5 10 7.5 10s7.5-4 7.5-10z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14a4 4 0 108 0 4 4 0 00-8 0" />
      </svg>
    );
  }
  if (v.includes('temperature')) {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v11m0 0a3 3 0 106 0M9 14a3 3 0 116 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v8.5M12 18.5V21" />
      </svg>
    );
  }
  if (v.includes('battery')) {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 6H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2zm-2 0V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10v4" />
      </svg>
    );
  }
  if (v.includes('signal') || v.includes('strength')) {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.143 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    );
  }
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
};

export default SensorDetails;
