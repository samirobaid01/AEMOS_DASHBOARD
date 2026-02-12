# P1-12, P1-13, P1-14, P1-15: AsyncState, Normalized State, Selectors, cn()

**Scope:** P1-12 (AsyncState<T> helper), P1-13 (normalized state for devices), P1-14 (memoized selectors per feature), P1-15 (cn() utility).  
**Goal:** Add shared types and utilities for async/list state, normalize devices slice for O(1) lookups, add memoized selectors, and standardize class merging in components.

---

## 1. P1-12: AsyncState<T> helper

### 1.1 Purpose

A shared type for async data: `status` plus optional `data` and `error`. Use in slices (e.g. `devices: AsyncState<Device[]>` or `AsyncState<NormalizedState<Device>>`) and in UI to drive loading, empty, error, and retry behavior.

### 1.2 Types (in `src/types/ui.d.ts`)

| Type | Description |
|------|-------------|
| `AsyncStatus` | `'idle' \| 'loading' \| 'success' \| 'error'` |
| `AsyncState<T>` | `{ status: AsyncStatus; data?: T; error?: string }` |

### 1.3 Location and export

- **Path:** `src/types/ui.d.ts` (definition), `src/types/ui.ts` (re-export).
- **Usage:** Import from `types/ui` when defining slice state or component props.

### 1.4 Example

```ts
import type { AsyncState } from '../types/ui';

interface MySliceState {
  items: AsyncState<Item[]>;
}
```

---

## 2. P1-13: Normalized state for devices

### 2.1 Purpose

Store devices as `{ byId: Record<string, Device>; allIds: string[] }` so lookups are O(1), list order is explicit, and telemetry/rule engine can update a single device without replacing the whole list.

### 2.2 Types (in `src/types/device.d.ts`)

| Type | Description |
|------|-------------|
| `NormalizedState<T>` | `{ byId: Record<string, T>; allIds: string[] }` |
| `DeviceState` (slice) | `byId: Record<string, Device>`, `allIds: string[]`, `selectedDevice`, `loading`, `error` (no `devices` array) |

Device `id` is numeric; keys in `byId` and entries in `allIds` use `String(id)`.

### 2.3 Slice changes (`src/state/slices/devices.slice.ts`)

- **Initial state:** `byId: {}`, `allIds: []`, plus existing `selectedDevice`, `loading`, `error`.
- **Thunks:** All fulfilled handlers update `byId` and `allIds` (replace list, add one, update one, remove one). `fetchDeviceById.fulfilled` also upserts into `byId` and appends to `allIds` if new.
- **Backward compatibility:** `selectDevices(state)` still returns `Device[]` by deriving from `state.devices.allIds` and `state.devices.byId`.

### 2.4 Location

- **Types:** `src/types/device.d.ts`, re-exported from `src/types/device.ts`.
- **Slice:** `src/state/slices/devices.slice.ts`.

---

## 3. P1-14: Memoized selectors per feature (devices)

### 3.1 Purpose

Centralize derived device data in `createSelector` so list and by-id lookups are memoized and dashboards/telemetry avoid unnecessary re-renders.

### 3.2 Selectors (`src/state/selectors/devices.selectors.ts`)

| Selector | Description |
|----------|-------------|
| `selectAllDevices` | Memoized `Device[]` from normalized state. |
| `selectDeviceById(state, id)` | Memoized single device; `id` can be number or string; returns `Device \| null`. |
| `selectDevicesByArea(state, areaId)` | Memoized devices filtered by `areaId`. |
| `selectDevicesByOrganization(state, organizationId)` | Memoized devices filtered by `organizationId`. |

### 3.3 Location and export

- **Path:** `src/state/selectors/devices.selectors.ts`, `src/state/selectors/index.ts`.
- **Usage:** Import from `state/selectors` or from `state/slices/devices.slice` (slice exports `selectDevices` that returns the same array as `selectAllDevices` for backward compatibility).

### 3.4 Example

```ts
import { selectDeviceById, selectDevicesByArea } from '../../state/selectors';

const device = useAppSelector((state) => selectDeviceById(state, id));
const devicesInArea = useAppSelector((state) => selectDevicesByArea(state, areaId));
```

---

## 4. P1-15: cn() utility

### 4.1 Purpose

Merge class names (including conditional and Tailwind classes) without conflicts. Rule: reusable components accept `className` and use `cn()` to merge with their base classes.

### 4.2 Definition

```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}
```

### 4.3 Dependencies

- **clsx:** Added to `package.json` (^2.1.1).
- **tailwind-merge:** Already present.

### 4.4 Location and usage

- **Path:** `src/utils/cn.ts`.
- **Usage:** `import { cn } from '../../utils/cn';` then e.g. `className={cn('base-classes', condition && 'extra', className)}`.

---

## 5. Summary

| ID | Item | Location | Status |
|----|------|----------|--------|
| P1-12 | AsyncState&lt;T&gt;, AsyncStatus | types/ui.d.ts, ui.ts | Done |
| P1-13 | Normalized devices state (byId, allIds) | types/device.d.ts, devices.slice.ts | Done |
| P1-14 | Memoized device selectors | state/selectors/devices.selectors.ts, index.ts | Done |
| P1-15 | cn() utility + clsx | src/utils/cn.ts, package.json | Done |

Sensors and rule nodes can be normalized later using the same `NormalizedState<T>` pattern; other features can add their own `selectors.ts` with `createSelector` following the devices example.
