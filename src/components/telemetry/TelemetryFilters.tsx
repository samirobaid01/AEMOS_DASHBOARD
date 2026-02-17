import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import FormField from '../common/FormField';
import Button from '../common/Button/Button';
import Card from '../common/Card/Card';
import SensorIcon from './SensorIcon';
import type { TelemetryFiltersProps } from './types';

const TelemetryFilters: React.FC<TelemetryFiltersProps> = ({
  selectedOrgId,
  selectedAreaId,
  selectedSensorId,
  selectedDeviceId,
  organizations,
  areas,
  sensors,
  devices,
  onOrgChange,
  onAreaChange,
  onSensorChange,
  onDeviceChange,
  onAddEntity,
  canAdd,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const selectStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827',
    outline: 'none',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    paddingRight: '2.5rem'
  };

  const filteredAreas = selectedOrgId
    ? areas.filter(area => area.organizationId === selectedOrgId)
    : areas;

  const filteredSensors = selectedAreaId
    ? sensors.filter(sensor => sensor.areaId === selectedAreaId)
    : sensors;

  const filteredDevices = selectedAreaId
    ? devices.filter(device => device.areaId === selectedAreaId)
    : devices;

  const selectedEntityType = selectedSensorId ? 'sensor' : selectedDeviceId ? 'device' : null;
  
  const selectedEntity = selectedSensorId 
    ? sensors.find(s => s.id === selectedSensorId)
    : selectedDeviceId 
    ? devices.find(d => d.id === selectedDeviceId)
    : null;

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">
            {t('telemetry.filterTitle')}
          </h2>
          <p className="text-sm text-textSecondary dark:text-textSecondary-dark mb-4 m-0">
            {t('telemetry.filterDescription')}
          </p>
        </div>

        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
          <FormField label={t('common.organization')} id="org-filter">
            <select
              id="org-filter"
              value={selectedOrgId ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onOrgChange(value ? Number(value) : null);
                onAreaChange(null);
                onSensorChange(null);
                onDeviceChange(null);
              }}
              style={selectStyle}
              disabled={isLoading}
            >
              <option value="">{t('telemetry.selectOrganization')}</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label={t('common.area')} id="area-filter">
            <select
              id="area-filter"
              value={selectedAreaId ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onAreaChange(value ? Number(value) : null);
                onSensorChange(null);
                onDeviceChange(null);
              }}
              style={selectStyle}
              disabled={!selectedOrgId || isLoading}
            >
              <option value="">{t('telemetry.selectArea')}</option>
              {filteredAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label={t('common.sensor')} id="sensor-filter">
            <select
              id="sensor-filter"
              value={selectedSensorId ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onSensorChange(value ? Number(value) : null);
                if (value) {
                  onDeviceChange(null);
                  const sensor = sensors.find(s => s.id === Number(value));
                  console.log('[TelemetryFilters] Selected sensor:', sensor);
                  console.log('[TelemetryFilters] Has TelemetryData?', sensor?.TelemetryData);
                }
              }}
              style={selectStyle}
              disabled={isLoading}
            >
              <option value="">{t('telemetry.selectSensor')}</option>
              {filteredSensors.map(sensor => {
                const area = areas.find(a => a.id === sensor.areaId);
                const org = area ? organizations.find(o => o.id === area.organizationId) : null;
                const displayName = area && org ? `${sensor.name} (${org.name} → ${area.name})` : sensor.name;
                return (
                  <option key={sensor.id} value={sensor.id}>
                    🌡️ {displayName}
                  </option>
                );
              })}
            </select>
          </FormField>

          <FormField label={t('common.device')} id="device-filter">
            <select
              id="device-filter"
              value={selectedDeviceId ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onDeviceChange(value ? Number(value) : null);
                if (value) {
                  onSensorChange(null);
                  const device = devices.find(d => d.id === Number(value));
                  console.log('[TelemetryFilters] Selected device:', device);
                  console.log('[TelemetryFilters] Has states?', device?.states);
                }
              }}
              style={selectStyle}
              disabled={isLoading}
            >
              <option value="">{t('telemetry.selectDevice')}</option>
              {filteredDevices.map(device => {
                const area = areas.find(a => a.id === device.areaId);
                const org = area ? organizations.find(o => o.id === area.organizationId) : null;
                const displayName = area && org ? `${device.name} (${org.name} → ${area.name})` : device.name;
                return (
                  <option key={device.id} value={device.id}>
                    📡 {displayName}
                  </option>
                );
              })}
            </select>
          </FormField>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border-dark">
          {selectedEntityType && selectedEntity ? (
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-wheat-600 dark:text-wheat-400">
                  {selectedEntityType === 'sensor' ? (
                    <SensorIcon className="w-12 h-12" />
                  ) : (
                    <span className="text-5xl">📡</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${
                      selectedEntityType === 'sensor' 
                        ? 'bg-wheat-100 dark:bg-wheat-900 text-wheat-800 dark:text-wheat-200'
                        : 'bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200'
                    }`}>
                      {t(`telemetry.${selectedEntityType}`)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-textPrimary dark:text-textPrimary-dark m-0 truncate">
                    {selectedEntity.name}
                  </h3>
                  {selectedEntity.description && (
                    <p className="text-sm text-textSecondary dark:text-textSecondary-dark m-0 mt-1">
                      {selectedEntity.description}
                    </p>
                  )}
                </div>
              </div>
              
              {selectedEntityType === 'sensor' && 'TelemetryData' in selectedEntity && selectedEntity.TelemetryData && selectedEntity.TelemetryData.length > 0 && (
                <div className="ml-14 pl-3 border-l-2 border-wheat-300 dark:border-wheat-700">
                  <div className="text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase mb-2">
                    {t('telemetry.telemetryVariables')}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntity.TelemetryData.map((variable: any) => (
                      <span
                        key={variable.id}
                        className="px-2 py-1 text-xs rounded bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark border border-border dark:border-border-dark"
                      >
                        {variable.variableName} <span className="text-textMuted dark:text-textMuted-dark">({variable.datatype})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedEntityType === 'device' && 'states' in selectedEntity && selectedEntity.states && selectedEntity.states.length > 0 && (
                <div className="ml-14 pl-3 border-l-2 border-sky-300 dark:border-sky-700">
                  <div className="text-xs font-semibold text-textSecondary dark:text-textSecondary-dark uppercase mb-2">
                    {t('telemetry.deviceStates')}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntity.states.map((state: any) => (
                      <span
                        key={state.id}
                        className="px-2 py-1 text-xs rounded bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark border border-border dark:border-border-dark"
                      >
                        {state.stateName} <span className="text-textMuted dark:text-textMuted-dark">({state.dataType})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-textMuted dark:text-textMuted-dark flex-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{t('telemetry.selectEntityPrompt')}</span>
            </div>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={onAddEntity}
            disabled={!canAdd || isLoading}
          >
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('telemetry.addToDashboard')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TelemetryFilters;
