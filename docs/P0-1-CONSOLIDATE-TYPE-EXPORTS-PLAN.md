# P0-1 Development Plan: Consolidate Type Exports per Domain

**Goal:** Use `src/types/*.d.ts` as the single source of truth for domain types; ensure `src/types/*.ts` only re-exports from the corresponding `.d.ts` (and optionally from `constants/`). No duplicate or conflicting type definitions.

---

## 1. Current state summary

### 1.1 Files in `src/types/`

| File | Role today | Issue |
|------|------------|--------|
| `device.d.ts` | Full definitions (imports from `constants/device`, `state/slices/deviceDetails.slice`) | Source of truth ✓ |
| `device.ts` | Re-exports from `./device.d` | Already correct ✓ |
| `sensor.d.ts` | Full definitions | Source of truth ✓ |
| `sensor.ts` | Re-exports from `./sensor.d` **and** defines `ALLOWED_SENSOR_STATUSES` | `.ts` defines runtime value; should re-export only |
| `ruleEngine.d.ts` | Full definitions (RuleNode, RuleChain, payloads, RuleEngineState) | Source of truth ✓ |
| `ruleEngine.ts` | **Duplicate definitions** + re-exports of Sensor, Device, DeviceState from other domains | **Conflicting** with `.d.ts`; must become re-export only |
| `area.d.ts` | Full definitions | Source of truth ✓; no `.ts` barrel |
| `organization.d.ts` | Full definitions | Source of truth ✓; no `.ts` barrel |
| `auth.d.ts` | Full definitions | Source of truth ✓; no `.ts` barrel |

### 1.2 Import patterns in codebase

- **With extension:** `from '../../types/device.d'`, `from '../../types/organization.d'`, etc. (resolves to `.d.ts`).
- **Without extension:** `from '../../types/device'`, `from '../../types/sensor'`, etc. (resolves to `.ts` when present, else `.d.ts`).
- **Inconsistency:** Same domain is imported both ways (e.g. device from `device` and from `device.d`), which works but is confusing.

### 1.3 Conflicts to resolve

- **ruleEngine:** `ruleEngine.d.ts` and `ruleEngine.ts` define different shapes:
  - **RuleNode:** `.d.ts` has `ruleChainId`; `.ts` omits it. `.d.ts` has `type: 'filter' \| 'action'`; `.ts` has `type: string`.
  - **RuleChain:** `.d.ts` has `organizationId`; `.ts` does not.
  - **RuleChainUpdatePayload:** `.d.ts` is `extends Partial<RuleChainCreatePayload> & { organizationId: number }`; `.ts` has `name?`, `description?`, `nodes?` (and no `organizationId`).
  - **RuleEngineState:** `.d.ts` has rules, selectedRule, loading, error, filters; `.ts` adds sensors, devices, deviceStates, sensorDetails.
  - **Canonical:** Use `ruleEngine.d.ts` (matches API and slice usage for RuleChain/payloads). The slice defines its own local `RuleEngineState` with extra fields—that stays in the slice; the shared type in `.d.ts` remains the minimal domain state.

---

## 2. Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Source of truth | Always `src/types/<domain>.d.ts` | Single place to edit; `.ts` is only a barrel for consumers. |
| Domains without a `.ts` file | Add `area.ts`, `organization.ts`, `auth.ts` that only re-export from the matching `.d.ts` | One convention: every domain has a barrel so consumers always use `from '@/types/area'` (no `.d` in imports). |
| Runtime constants (e.g. sensor statuses) | Move to `src/constants/sensor.ts`; `types/sensor.ts` re-exports them | Keeps "types/*.ts only re-exports"; constants live in constants/. |
| ruleEngine.ts | Replace entire file with re-exports from `./ruleEngine.d.ts` only; remove Sensor/Device re-exports | One source of truth; consumers that need RuleChain + Sensor import from `types/ruleEngine` and `types/sensor` (or device). |
| Import convention after P0-1 | Prefer `from '@/types/<domain>'` (no `.d`) everywhere | So resolution always goes through the `.ts` barrel to the `.d.ts` file. |

---

## 3. Step-by-step implementation

### Phase A: Add missing barrels and fix sensor constant

| Step | Action | Files to touch |
|------|--------|----------------|
| A.1 | Create `src/constants/sensor.ts`. Define `ALLOWED_SENSOR_STATUSES` as a `as const` array and export `type SensorStatus = (typeof ALLOWED_SENSOR_STATUSES)[number]`. Do **not** import from `types/` here (avoids circular dependency). | New: `src/constants/sensor.ts` |
| A.2 | In `sensor.d.ts`: import and re-export `SensorStatus` from `../constants/sensor` (so the single source of the union is the constant file), or keep `SensorStatus` defined in sensor.d.ts and have constants/sensor.ts define only the array—then types/sensor.ts can re-export both from .d and from constants. To avoid cycles: **preferred** is constants/sensor.ts with the `as const` array + exported type; sensor.d.ts does `import type { SensorStatus } from '../constants/sensor'; export type { SensorStatus };` and uses it in the rest of the file. | `src/constants/sensor.ts`, `src/types/sensor.d.ts` |
| A.3 | Change `src/types/sensor.ts` to only re-export: (1) all types from `./sensor.d`, (2) `ALLOWED_SENSOR_STATUSES` from `../constants/sensor`. Remove the inline array and local SensorStatus import. | `src/types/sensor.ts` |
| A.4 | Add `src/types/area.ts`: re-export everything from `./area.d`. | New: `src/types/area.ts` |
| A.5 | Add `src/types/organization.ts`: re-export everything from `./organization.d`. | New: `src/types/organization.ts` |
| A.6 | Add `src/types/auth.ts`: re-export everything from `./auth.d`. | New: `src/types/auth.ts` |

**Constants/sensor.ts shape:** Export `const ALLOWED_SENSOR_STATUSES = ['active', 'inactive', ...] as const` and `export type SensorStatus = (typeof ALLOWED_SENSOR_STATUSES)[number]`. No import from `types/`. Then `sensor.d.ts` does `import type { SensorStatus } from '../constants/sensor'; export type { SensorStatus };` and uses `SensorStatus` in the rest of the file. This keeps one source of truth (the constant list) and avoids any circular dependency.

**Verification after Phase A:** `npm run build` (or `tsc`) passes. No duplicate type definitions in any `.ts` under types.

---

### Phase B: Make ruleEngine.ts re-export only

| Step | Action | Files to touch |
|------|--------|----------------|
| B.1 | Replace the entire content of `src/types/ruleEngine.ts` with a single re-export from `./ruleEngine.d`. Export every type that ruleEngine.d.ts exports (RuleNode, RuleChain, RuleChainCreatePayload, RuleChainUpdatePayload, RuleEngineState). Do **not** re-export Sensor, Device, or DeviceState from ruleEngine.ts. | `src/types/ruleEngine.ts` |
| B.2 | Confirm no file imports Sensor/Device/DeviceState from `types/ruleEngine`. (Current codebase imports those from `types/device` and `types/sensor`; ruleEngine.ts today re-exports them—after B.1 those imports remain from device/sensor.) | Grep / build |

**Exact content for `ruleEngine.ts` after B.1:**

```ts
export type {
  RuleNode,
  RuleChain,
  RuleChainCreatePayload,
  RuleChainUpdatePayload,
  RuleEngineState,
} from './ruleEngine.d';
```

**Verification after Phase B:** Build passes. All rule-engine usages (RuleEdit, RuleCreate, RuleForm, RuleDetails, RuleList, RuleItem, ruleEngineService, ruleEngine.slice) still resolve RuleChain, RuleChainUpdatePayload, etc. from `types/ruleEngine`; slice continues to define its own extended RuleEngineState locally.

---

### Phase C: Normalize imports to use the barrel (no `.d`)

All consumers should import from `@/types/<domain>` (or `../../types/<domain>`) so that the `.ts` barrel is used and the `.d.ts` is the single source of truth behind it.

| Step | Action | Files to touch (list) |
|------|--------|------------------------|
| C.1 | Replace `from '.../types/device.d'` with `from '.../types/device'`. | DeviceEdit.tsx (containers/Devices), DeviceIdentityForm.tsx, DeviceEdit.tsx (components/devices), DeviceCreate.tsx (components + containers), CapabilitiesSummaryModal.tsx, deviceStates.slice.ts |
| C.2 | Replace `from '.../types/organization.d'` with `from '.../types/organization'`. | DeviceIdentityForm.tsx, DeviceEdit.tsx (components), DeviceCreate.tsx (components) |
| C.3 | Replace `from '.../types/area.d'` with `from '.../types/area'`. | DeviceIdentityForm.tsx, DeviceEdit.tsx (components), DeviceCreate.tsx (components) |
| C.4 | Replace `from '.../types/sensor.d'` with `from '.../types/sensor'`. | SensorEdit.tsx (containers), SensorCreate.tsx (containers), SensorForm.tsx (components) |

**Verification after Phase C:** Grep for `types/.*\.d'` and `types/.*\.d"` under `src` returns no matches (except possibly inside comments or docs). Build and tests pass.

---

### Phase D: Final checks and documentation

| Step | Action | Details |
|------|--------|--------|
| D.1 | Ensure no duplicate exports | Search for `export interface` or `export type` in `src/types/*.ts`; only `export type { ... } from '...'` or `export { ... } from '...'` allowed. |
| D.2 | Ensure .d.ts has no re-exports from other .d.ts in types | Today device.d.ts imports from constants/ and from state/slices—that’s acceptable (types can depend on constants and slice types). ruleEngine.d.ts should not re-export device/sensor types; consumers import those from their own domains. |
| D.3 | Document the rule | In `docs/CODEBASE_IMPROVEMENT_PLAN.md` or in `src/types/README.md`: "Types per domain live in `src/types/<domain>.d.ts`. The file `src/types/<domain>.ts` exists only to re-export from the .d.ts (and, when needed, from constants). Do not add new type definitions in .ts files." |
| D.4 | Optional: add a lint or script | Optional: add a small script or ESLint rule that fails if any `src/types/*.ts` file contains `export interface` or `export type X =` (direct definitions) instead of only re-exports. |

---

## 4. File-by-file checklist

- [x] **src/constants/sensor.ts** – New file; export `ALLOWED_SENSOR_STATUSES` (as const) and `type SensorStatus` derived from it.
- [x] **src/types/sensor.d.ts** – Import and re-export `SensorStatus` from `../constants/sensor`; use it in interfaces (replace local SensorStatus definition).
- [x] **src/types/sensor.ts** – Re-export types from `./sensor.d` and `ALLOWED_SENSOR_STATUSES` from `../constants/sensor`; remove inline constant definition.
- [x] **src/types/area.ts** – New; re-export all from `./area.d`.
- [x] **src/types/organization.ts** – New; re-export all from `./organization.d`.
- [x] **src/types/auth.ts** – New; re-export all from `./auth.d`.
- [x] **src/types/ruleEngine.ts** – Replace with re-exports from `./ruleEngine.d` only (no Sensor/Device/DeviceState, no local interface/type definitions).
- [x] **src/types/device.ts** – Already re-export only; no change except possibly standardizing re-export path to `./device.d` if needed for consistency.
- [x] **Imports** – Replace all `.../types/<domain>.d` with `.../types/<domain>` in the files listed in Phase C.

---

## 5. Verification commands

```bash
# Build
npm run build

# Type-check only (if available)
npx tsc --noEmit

# No direct .d imports left (expect 0 matches)
rg "from ['\"].*types/[a-zA-Z]+\.d['\"]" src --type ts --type tsx

# No type definitions in types/*.ts (only re-exports)
rg "export (interface|type [A-Z][a-zA-Z]* =)" src/types --glob "*.ts"
# Expected: 0 matches in .ts files (only .d.ts should have these)
```

---

## 6. Exit criteria (P0-1 done)

- [x] Every domain has a single source of truth in `src/types/<domain>.d.ts`.
- [x] Every `src/types/*.ts` file only re-exports (from the matching `.d.ts` and, for sensor, from `constants/sensor`); no `export interface` or `export type X =` in `.ts`.
- [x] No duplicate or conflicting definitions (ruleEngine types only in ruleEngine.d.ts; ruleEngine.ts is a barrel).
- [x] All imports use the barrel: `from '.../types/<domain>'` with no `.d` in the path.
- [x] No new regressions from P0-1 (existing build errors in the repo are unrelated to type consolidation).

---

## 7. Suggested order of work

1. Phase A (sensor constant + new barrels for area, organization, auth).
2. Phase B (ruleEngine.ts → re-export only).
3. Phase C (normalize imports).
4. Phase D (checks + short doc/README).

Single PR is fine; if you prefer smaller PRs, do A+B in one, C in a second, D in a third.
