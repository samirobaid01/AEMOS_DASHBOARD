import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { Card } from '../ui';
import { cn } from '../../utils/cn';
import type { TelemetryFiltersProps } from './types';

const selectClass =
  'w-full h-9 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 ' +
  'px-2.5 text-sm text-ink-800 dark:text-ink-100 disabled:opacity-50 disabled:cursor-not-allowed ' +
  'focus:outline-none focus:ring-2 focus:ring-leaf-500/40 focus:border-leaf-500';

const labelClass = 'block text-[11px] font-medium text-ink-500 dark:text-ink-400 mb-1';

/** Compact, single-row filter + add bar (dense replacement for TelemetryFilters). */
const TelemetryToolbar: React.FC<TelemetryFiltersProps> = ({
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
  onClearFilters,
  onAddEntity,
  canAdd,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const filteredAreas = selectedOrgId ? areas.filter((a) => a.organizationId === selectedOrgId) : areas;
  const filteredSensors = selectedAreaId
    ? sensors.filter((s) => s.areaId === selectedAreaId)
    : sensors.filter((s) => s.status === 'active');
  const filteredDevices = selectedAreaId ? devices.filter((d) => d.areaId === selectedAreaId) : devices;

  const hasSelection = Boolean(selectedOrgId || selectedAreaId || selectedSensorId || selectedDeviceId);

  return (
    <Card interactive={false} className="p-3">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[150px]">
          <label className={labelClass} htmlFor="tb-org">{t('common.organization', 'Organization')}</label>
          <select
            id="tb-org"
            className={selectClass}
            value={selectedOrgId ?? ''}
            disabled={isLoading}
            onChange={(e) => {
              const v = e.target.value;
              onOrgChange(v ? Number(v) : null);
              onAreaChange(null);
              onSensorChange(null);
              onDeviceChange(null);
            }}
          >
            <option value="">{t('telemetry.selectOrganization', 'Select organization…')}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className={labelClass} htmlFor="tb-area">{t('common.area', 'Area')}</label>
          <select
            id="tb-area"
            className={selectClass}
            value={selectedAreaId ?? ''}
            disabled={!selectedOrgId || isLoading}
            onChange={(e) => {
              const v = e.target.value;
              onAreaChange(v ? Number(v) : null);
              onSensorChange(null);
              onDeviceChange(null);
            }}
          >
            <option value="">{t('telemetry.selectArea', 'Select area…')}</option>
            {filteredAreas.map((area) => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className={labelClass} htmlFor="tb-sensor">{t('common.sensor', 'Sensor')}</label>
          <select
            id="tb-sensor"
            className={selectClass}
            value={selectedSensorId ?? ''}
            disabled={isLoading}
            onChange={(e) => {
              const v = e.target.value;
              onSensorChange(v ? Number(v) : null);
              if (v) onDeviceChange(null);
            }}
          >
            <option value="">{t('telemetry.selectSensor', 'Select sensor…')}</option>
            {filteredSensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>{sensor.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className={labelClass} htmlFor="tb-device">{t('common.device', 'Device')}</label>
          <select
            id="tb-device"
            className={selectClass}
            value={selectedDeviceId ?? ''}
            disabled={isLoading}
            onChange={(e) => {
              const v = e.target.value;
              onDeviceChange(v ? Number(v) : null);
              if (v) onSensorChange(null);
            }}
          >
            <option value="">{t('telemetry.selectDevice', 'Select device…')}</option>
            {filteredDevices.map((device) => (
              <option key={device.id} value={device.id}>{device.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {hasSelection && (
            <button
              type="button"
              onClick={onClearFilters}
              disabled={isLoading}
              className={cn(
                'h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-1.5',
                'text-ink-600 dark:text-ink-300 bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600',
                'disabled:opacity-50',
              )}
            >
              <X className="w-4 h-4" /> {t('telemetry.clearSelection', 'Clear')}
            </button>
          )}
          <button
            type="button"
            onClick={onAddEntity}
            disabled={!canAdd || isLoading}
            className={cn(
              'h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 text-white',
              'bg-leaf-600 hover:bg-leaf-700 disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <Plus className="w-4 h-4" /> {t('telemetry.addToDashboard', 'Add')}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default TelemetryToolbar;
