import axios from 'axios';
import apiClient from './api/apiClient';
import type { MonitoredEntity, TelemetryValue } from '../components/telemetry/types';

/**
 * Client for the realtime-dashboard REST snapshot APIs (P3.5).
 *
 * These endpoints return the *current* value of every telemetry variable / device
 * state from the server's latest-value cache, so a freshly loaded table shows real
 * values immediately instead of waiting for the next socket event. All routes are
 * gated behind the backend `realtime-dashboard` feature flag; when it is disabled
 * the endpoints return 404, which we treat as "no snapshot available".
 */

export interface DashboardSensorRow {
  sensorId: number;
  sensorName: string;
  variableName: string;
  value: number | string | null;
  timestamp: string | null;
}

export interface DashboardDeviceRow {
  deviceId: number;
  deviceUuid: string;
  stateName: string;
  value: number | string | null;
  timestamp: string | null;
}

interface DashboardPage<T> {
  rows: T[];
  cursor: number | null;
  hasMore: boolean;
  total: number;
}

interface SensorsResponse {
  status: string;
  data: { sensors: DashboardSensorRow[] };
  cursor: number | null;
  hasMore: boolean;
  total: number;
}

interface DevicesResponse {
  status: string;
  data: { devices: DashboardDeviceRow[] };
  cursor: number | null;
  hasMore: boolean;
  total: number;
}

const PAGE_LIMIT = 500; // contract max

/** True when the error is a 404, i.e. the feature flag is disabled server-side. */
const isFeatureDisabled = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404;

const getSensorsPage = async (
  organizationId: number,
  cursor: number,
): Promise<DashboardPage<DashboardSensorRow>> => {
  const response = await apiClient.get<SensorsResponse>('dashboard/sensors', {
    params: { organizationId, cursor, limit: PAGE_LIMIT },
  });
  return {
    rows: response.data.data.sensors,
    cursor: response.data.cursor,
    hasMore: response.data.hasMore,
    total: response.data.total,
  };
};

const getDevicesPage = async (
  organizationId: number,
  cursor: number,
): Promise<DashboardPage<DashboardDeviceRow>> => {
  const response = await apiClient.get<DevicesResponse>('dashboard/devices', {
    params: { organizationId, cursor, limit: PAGE_LIMIT },
  });
  return {
    rows: response.data.data.devices,
    cursor: response.data.cursor,
    hasMore: response.data.hasMore,
    total: response.data.total,
  };
};

/** Follows the cursor until the server reports no more pages. */
const fetchAllPages = async <T>(
  fetchPage: (cursor: number) => Promise<DashboardPage<T>>,
): Promise<T[]> => {
  const all: T[] = [];
  let cursor = 0;
  // Guard against a server that never advances the cursor.
  for (let guard = 0; guard < 1000; guard += 1) {
    const page = await fetchPage(cursor);
    all.push(...page.rows);
    if (!page.hasMore || page.cursor == null || page.cursor === cursor) {
      break;
    }
    cursor = page.cursor;
  }
  return all;
};

export interface DashboardSnapshot {
  sensors: DashboardSensorRow[];
  devices: DashboardDeviceRow[];
  /** False when the feature flag is disabled (404) or the request failed. */
  available: boolean;
}

/**
 * Fetches the full current-value snapshot for an organization. Never throws:
 * a disabled feature flag or a transient error resolves to an empty, unavailable
 * snapshot so callers simply fall back to placeholder values + live socket updates.
 */
export const fetchDashboardSnapshot = async (
  organizationId: number,
): Promise<DashboardSnapshot> => {
  try {
    const [sensors, devices] = await Promise.all([
      fetchAllPages((cursor) => getSensorsPage(organizationId, cursor)),
      fetchAllPages((cursor) => getDevicesPage(organizationId, cursor)),
    ]);
    return { sensors, devices, available: true };
  } catch (error) {
    if (isFeatureDisabled(error)) {
      return { sensors: [], devices: [], available: false };
    }
    console.warn('[dashboard] snapshot fetch failed, falling back to live-only:', error);
    return { sensors: [], devices: [], available: false };
  }
};

/**
 * Maps a snapshot into seed values for a single monitored entity, keyed the same
 * way the socket hook keys them: by telemetry-variable id (sensors) or state id
 * (devices). Rows with a null value (cache miss) are skipped so they keep their
 * placeholder. Pure function — no I/O.
 */
export const buildSeedValues = (
  entity: MonitoredEntity,
  snapshot: DashboardSnapshot,
): Record<string, Pick<TelemetryValue, 'value' | 'timestamp'>> => {
  const seed: Record<string, Pick<TelemetryValue, 'value' | 'timestamp'>> = {};

  if (entity.type === 'sensor' && entity.telemetryVariables) {
    for (const variable of entity.telemetryVariables) {
      const row = snapshot.sensors.find(
        (r) => r.sensorId === variable.sensorId && r.variableName === variable.variableName,
      );
      if (row && row.value !== null) {
        seed[variable.id.toString()] = {
          value: row.value,
          timestamp: row.timestamp ?? new Date().toISOString(),
        };
      }
    }
  } else if (entity.type === 'device' && entity.states) {
    for (const state of entity.states) {
      const row = snapshot.devices.find(
        (r) => r.deviceUuid === entity.uuid && r.stateName === state.stateName,
      );
      if (row && row.value !== null) {
        seed[state.id.toString()] = {
          value: row.value,
          timestamp: row.timestamp ?? new Date().toISOString(),
        };
      }
    }
  }

  return seed;
};

export default { fetchDashboardSnapshot, buildSeedValues };
