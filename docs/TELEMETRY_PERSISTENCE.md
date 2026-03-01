# Telemetry Dashboard Persistence

## Overview

The Live Telemetry dashboard persists the list of **monitored entities** (sensors and devices added to the dashboard) in the browser so that when the user navigates away and returns, their selection is restored. This improves usability by avoiding the need to re-add entities every time the user visits the page.

## Feature Flag

Persistence is **gated by a feature flag**. When the flag is **enabled**, persistence is on for **all users** (load on mount, save on add/remove). When the flag is **disabled**, persistence is off for **all users** (no read/write of localStorage for this feature).

- **Config**: `ENABLE_TELEMETRY_PERSISTENCE` in `src/config/index.ts`
- **Source**: Environment variable `VITE_ENABLE_TELEMETRY_PERSISTENCE`
  - Set to `true` to enable (e.g. in `.env`: `VITE_ENABLE_TELEMETRY_PERSISTENCE=true`)
  - Omitted or any other value: feature is **disabled**
- **Default**: Disabled (flag is `false` when the env var is not set)
- **Scope**: Single switch per build/deploy; no per-user or per-session override.

## Storage

- **API**: `window.localStorage`
- **Key**: `aemos-telemetry-monitored-entities`
- **Format**: JSON object with version, timestamp, and entities array

### Payload Shape

```json
{
  "version": 1,
  "savedAt": "2026-01-28T12:00:00.000Z",
  "entities": [
    {
      "id": "sensor-17",
      "type": "sensor",
      "entityId": 17,
      "name": "TempHumidity-AG11",
      "areaName": "Greenhouse A",
      "organizationName": "Org A",
      "telemetryVariables": [{ "id": 1, "variableName": "temperature", "datatype": "float", "sensorId": 17 }]
    },
    {
      "id": "device-134",
      "type": "device",
      "entityId": 134,
      "uuid": "8d64b273-c184-487f-a2fe-dd02a0bc6e9b",
      "name": "Water Pump",
      "areaName": "Greenhouse A",
      "organizationName": "Org A",
      "states": [{ "id": 1, "stateName": "pump_state", "dataType": "boolean", ... }]
    }
  ]
}
```

## Max Age and Reset on Reopen

- **Max age**: 1 hour (3,600,000 ms).
- **Expiry rule**: If the stored data is older than 1 hour from `savedAt`, it is treated as expired and discarded on load (storage is cleared and an empty list is used).
- **Reset on reopen**: When the user reopens the Telemetry page and the stored data is **still valid** (within 1 hour), loading that data **refreshes** the stored timestamp to the current time. Thus, each time the user visits the page within the window, the 1-hour countdown restarts.

So:
- Data is valid for 1 hour from the **last save or last load** (whichever is more recent).
- If the user does not reopen the page within 1 hour after the last save/load, the next load will see expired data and start with an empty list.

## When Data Is Saved

- **After adding** an entity to the dashboard (sensor or device).
- **After removing** an entity from the dashboard.

Each save updates `savedAt` to the current time.

## When Data Is Loaded

- **On mount** of the Telemetry dashboard container, **after** the initial data fetch (organizations, areas, sensors, devices) has completed.
- Load runs once when the user opens the Telemetry page; restored entities are set in state and re-registered with the telemetry socket (so live data resumes).

## Implementation Details

### Utility: `src/utils/telemetryStorage.ts`

- **`saveTelemetryEntities(entities: MonitoredEntity[])`**  
  Writes the current entities to localStorage with `savedAt` set to now. Handles missing or full localStorage gracefully.

- **`loadTelemetryEntities(): MonitoredEntity[]`**  
  Reads from localStorage, validates version and shape, checks max age. If expired or invalid, clears storage and returns `[]`. If valid, refreshes the stored timestamp (reset on reopen) and returns the entities array.

- **`clearTelemetryEntities()`**  
  Removes the storage key. Used internally on expiry/invalid data; can also be used for an explicit “clear saved dashboard” action if needed later.

- **Constants**: `TELEMETRY_STORAGE_KEY`, `TELEMETRY_STORAGE_MAX_AGE_MS` are exported for tests or docs.

### Container: `src/containers/Telemetry/TelemetryDashboard.tsx`

- All persistence behavior is conditional on `ENABLE_TELEMETRY_PERSISTENCE`.
- When the flag is **true**:
  - After initial data (orgs, areas, sensors, devices) is loaded, an effect runs that:
    1. Calls `loadTelemetryEntities()`.
    2. If any entities are returned, sets them in `monitoredEntities` state and calls `addEntity(entity)` for each so the socket resumes subscriptions.
  - In `handleAddEntity`, after updating state with the new entity, calls `saveTelemetryEntities(newList)` so the new list is persisted.
  - In `handleRemoveEntity`, after removing the entity from state, calls `saveTelemetryEntities(next)` so the updated list is persisted.
- When the flag is **false**: No load on mount, no save on add or remove; dashboard works as before with no persistence.

### What Is Not Persisted

- Filter selections (organization, area, sensor, device dropdowns) are **not** persisted; they reset when leaving the page.
- Live telemetry values and connection state are **not** persisted; they are recomputed when the socket reconnects and entities are re-added.

## Edge Cases

- **localStorage disabled or unavailable**: Save is skipped; load returns `[]`. Dashboard works with no persistence.
- **Corrupt or invalid JSON**: Treated as invalid; storage is cleared and load returns `[]`.
- **Schema/version change**: If `version` does not match `STORAGE_VERSION`, storage is cleared and load returns `[]`.
- **Entity removed on backend**: Restored entities are re-added to the socket; if the backend no longer has that entity, the UI may show “disconnected” or no data until the user removes the row. Future work could validate entities against the current sensor/device list and drop missing ones on load.

## User Experience Summary

**When the feature flag is enabled:**

| Action | Result |
|--------|--------|
| User adds sensors/devices to dashboard | List is saved to localStorage with current timestamp. |
| User removes an entity | Updated list is saved to localStorage. |
| User leaves the Telemetry page | No change to stored data. |
| User returns within 1 hour | Stored list is loaded, timestamp refreshed; dashboard shows same entities and live data resumes. |
| User returns after more than 1 hour | Stored data is expired; storage cleared; dashboard starts with an empty list. |

**When the feature flag is disabled:** No data is read from or written to localStorage; the dashboard always starts with an empty monitored list when the user opens the page.
