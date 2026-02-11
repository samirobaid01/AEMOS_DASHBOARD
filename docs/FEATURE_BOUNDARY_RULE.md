# Feature boundary rule

**Rule:** A feature may import from: `common/`, `types/`, and its own feature folder. It may **not** import from another feature.

## Purpose

- Prevents cross-feature coupling (e.g. Device → Sensor → RuleEngine).
- Keeps features independently testable and deployable.
- Makes dependencies explicit and easier to refactor.

## Allowed imports

| From | May import |
|------|------------|
| Any feature (e.g. `containers/Devices/`, `components/devices/`) | `common/`, `types/`, and the same feature (e.g. `components/devices/`, `containers/Devices/`) |
| `common/` | `types/` only (no feature code) |
| `types/` | No app code (only other types or constants as needed) |

## Examples

- **OK:** `containers/Devices/DeviceList.tsx` imports from `state/store`, `state/slices/devices.slice`, `components/devices/DeviceItem`, `components/common/Button`, `types/device`.
- **Not OK:** `containers/Devices/DeviceList.tsx` imports from `containers/Sensors/SensorList` or `components/sensors/SensorItem`.
- **OK:** Shared state (e.g. `auth`, `organizations`) lives in `state/slices/` and is used by multiple features via selectors; features do not import each other’s containers or feature-specific components.

## Shared code

- **State:** Redux slices and store live under `state/`; any feature may use them via `useAppDispatch` / `useAppSelector` and public selectors.
- **Services:** API services under `services/` are shared; features call them from containers or thunks, not from other features’ UI.
- **Routes:** Route definitions may render feature containers; they do not bypass the rule (each container belongs to one feature).

This rule is part of the P0 foundation (see CODEBASE_IMPROVEMENT_PLAN.md).
