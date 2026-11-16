import type { MonitoredEntity, EntityTelemetryData } from '../components/telemetry/types';

/**
 * Pure telemetry value/variable helpers shared by the table and the widget cards.
 * Ported from the logic that previously lived inline in TelemetryRow.
 */

export interface ExtractedVariable {
  id: string;
  name: string;
  value: string | number | boolean;
  isNew: boolean;
}

/**
 * Format a telemetry value for display, applying unit heuristics by variable name.
 * Missing/placeholder values render as an em dash. Booleans use the supplied labels
 * so this stays i18n-agnostic.
 */
export const formatTelemetryValue = (
  value: string | number | boolean | null | undefined,
  variableName?: string,
  yesLabel = 'Yes',
  noLabel = 'No',
): string => {
  if (value === '-' || value === null || value === undefined) return '—';

  if (typeof value === 'boolean') {
    return value ? yesLabel : noLabel;
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

/**
 * Collect the display variables for an entity, pairing each sensor telemetry
 * variable / device state with its current value from the telemetry data.
 */
export const extractEntityVariables = (
  entity: MonitoredEntity,
  data: EntityTelemetryData,
): ExtractedVariable[] => {
  const variables: ExtractedVariable[] = [];

  if (entity.type === 'sensor' && entity.telemetryVariables) {
    entity.telemetryVariables.forEach((variable) => {
      const dataValue = data.values[variable.id];
      if (dataValue) {
        variables.push({
          id: variable.id.toString(),
          name: variable.variableName,
          value: dataValue.value,
          isNew: dataValue.isNew,
        });
      }
    });
  } else if (entity.type === 'device' && entity.states) {
    entity.states.forEach((state) => {
      const dataValue = data.values[state.id];
      if (dataValue) {
        variables.push({
          id: state.id.toString(),
          name: state.stateName,
          value: dataValue.value,
          isNew: dataValue.isNew,
        });
      }
    });
  }

  return variables;
};

/**
 * Coerce a telemetry value to a finite number, or null when it isn't numeric
 * (device states like "on"/"auto", placeholders, booleans). Used by sparklines
 * and gauges, which are numeric-only.
 */
export const toNumeric = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    if (value.trim() === '' || value === '-') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};
