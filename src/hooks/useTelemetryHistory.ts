import { useEffect, useRef, useState } from 'react';
import type { TelemetryData } from '../components/telemetry/types';
import { toNumeric } from '../utils/telemetryFormat';

export interface HistoryPoint {
  /** Epoch milliseconds of the reading. */
  t: number;
  value: number;
}

/** Rolling history per variable, keyed `${entityId}:${variableKey}`. */
export type TelemetryHistory = Record<string, HistoryPoint[]>;

const DEFAULT_CAP = 60;

/** Parse an ISO string or a numeric epoch (string or number-like); null if neither. */
const parseTimestamp = (ts?: string | null): number | null => {
  if (!ts) return null;
  const iso = Date.parse(ts);
  if (Number.isFinite(iso)) return iso;
  const epoch = Number(ts);
  return Number.isFinite(epoch) ? epoch : null;
};

/**
 * Accumulates a rolling window of recent numeric readings per variable from the
 * live telemetry data (the socket only ever carries the latest value). Sparklines
 * and the time chart read from this.
 *
 * - Non-numeric values (device states, placeholders) are ignored.
 * - The isNew-flag re-emit (same timestamp + same value) is de-duplicated.
 * - Distinct values sharing one timestamp are kept (no under-sampling).
 * - Unparseable timestamps only record on value change, so a stable reading can't
 *   flood a series on every render.
 * - Series for entities no longer in the data are pruned (no leak / stale resurrection).
 */
export const useTelemetryHistory = (
  telemetryData: TelemetryData,
  cap: number = DEFAULT_CAP,
): TelemetryHistory => {
  const bufferRef = useRef<TelemetryHistory>({});
  const [history, setHistory] = useState<TelemetryHistory>({});

  useEffect(() => {
    const buffer = bufferRef.current;
    let changed = false;

    // Prune series whose entity was removed from the dashboard.
    const liveEntityIds = new Set(Object.keys(telemetryData));
    for (const histKey of Object.keys(buffer)) {
      const entityId = histKey.slice(0, histKey.indexOf(':'));
      if (!liveEntityIds.has(entityId)) {
        delete buffer[histKey];
        changed = true;
      }
    }

    for (const [entityId, entity] of Object.entries(telemetryData)) {
      for (const [key, cell] of Object.entries(entity.values)) {
        const numeric = toNumeric(cell.value);
        if (numeric === null) continue;

        const histKey = `${entityId}:${key}`;
        const series = buffer[histKey];
        const last = series && series.length > 0 ? series[series.length - 1] : undefined;

        const parsed = parseTimestamp(cell.timestamp);
        let t: number;
        if (parsed !== null) {
          if (last && parsed < last.t) continue; // stale / out-of-order
          if (last && parsed === last.t && numeric === last.value) continue; // isNew re-emit
          t = parsed;
        } else {
          if (last && numeric === last.value) continue; // unreliable time: record only on change
          t = last ? last.t + 1 : Date.now();
        }

        const next = series ? series.concat({ t, value: numeric }) : [{ t, value: numeric }];
        if (next.length > cap) next.splice(0, next.length - cap);
        buffer[histKey] = next;
        changed = true;
      }
    }

    if (changed) {
      setHistory({ ...buffer });
    }
  }, [telemetryData, cap]);

  return history;
};

export default useTelemetryHistory;
