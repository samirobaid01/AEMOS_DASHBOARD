import type { MonitoredEntity } from '../components/telemetry/types';

const STORAGE_KEY = 'aemos-telemetry-monitored-entities';
const STORAGE_VERSION = 1;
const MAX_AGE_MS = 60 * 60 * 1000;

export interface TelemetryStoragePayload {
  version: number;
  savedAt: string;
  entities: MonitoredEntity[];
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function parsePayload(raw: string | null): TelemetryStoragePayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      'savedAt' in parsed &&
      'entities' in parsed &&
      Array.isArray((parsed as TelemetryStoragePayload).entities)
    ) {
      return parsed as TelemetryStoragePayload;
    }
    return null;
  } catch {
    return null;
  }
}

function isExpired(savedAt: string): boolean {
  try {
    const saved = new Date(savedAt).getTime();
    const now = Date.now();
    return Number.isNaN(saved) || now - saved > MAX_AGE_MS;
  } catch {
    return true;
  }
}

export function saveTelemetryEntities(entities: MonitoredEntity[]): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    const payload: TelemetryStoragePayload = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      entities
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    if (e instanceof Error && e.name !== 'QuotaExceededError') {
      console.warn('[telemetryStorage] Save failed:', e.message);
    }
  }
}

export function loadTelemetryEntities(): MonitoredEntity[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const payload = parsePayload(raw);
    if (!payload) return [];

    if (payload.version !== STORAGE_VERSION) {
      storage.removeItem(STORAGE_KEY);
      return [];
    }

    if (isExpired(payload.savedAt)) {
      storage.removeItem(STORAGE_KEY);
      return [];
    }

    const entities = payload.entities.filter(
      (e): e is MonitoredEntity =>
        e &&
        typeof e === 'object' &&
        typeof e.id === 'string' &&
        (e.type === 'sensor' || e.type === 'device') &&
        typeof e.entityId === 'number' &&
        typeof e.name === 'string'
    );

    const refreshed: TelemetryStoragePayload = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      entities
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(refreshed));

    return entities;
  } catch (e) {
    if (e instanceof Error) {
      console.warn('[telemetryStorage] Load failed:', e.message);
    }
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return [];
  }
}

export function clearTelemetryEntities(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export const TELEMETRY_STORAGE_MAX_AGE_MS = MAX_AGE_MS;
export const TELEMETRY_STORAGE_KEY = STORAGE_KEY;
