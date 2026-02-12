# Codebase Improvement Plan – P0 / P1 / P2 Tasks

Gradual plan to improve **interfaces/types**, **Tailwind CSS**, **reusable UI components**, **API/Redux contracts**, and **rule-engine abstractions**. Tasks are ordered by priority; execution can follow the PR grouping at the end.

*This plan was refined using reviewer feedback: API/error contracts, Redux typing, feature boundaries, AsyncState, normalization, rule-engine abstractions, performance guardrails, and a concrete PR strategy.*

---

## Gaps & risks (addressed by this plan)

| Gap / risk | How the plan addresses it |
|------------|----------------------------|
| **Runtime error handling & API consistency** | P0-8: standard `ApiResponse<T>` + `ApiError` contract; services return typed responses; thunks use typed `rejectWithValue`. |
| **Redux typing & dispatch noise** | P0-9: `AppThunk`, `AppDispatch`, `useAppDispatch` / `useAppSelector`; consistent typing across slices. |
| **Feature coupling (Device → Sensor → RuleEngine)** | P0-10: feature boundary rule — a feature may only import from `common/`, `types/`, and its own feature folder. |
| **State vs UI responsibility** | P1-11: controlled vs smart component rule — `common/` stateless; feature components UI + callbacks; containers own Redux, routing, data fetching. |
| **Repeated loading/error/data pattern** | P1-12: `AsyncState<T>` helper (`idle` \| `loading` \| `success` \| `error`) in types; use in slices and UI. |
| **Inefficient list updates (IoT, telemetry)** | P1-13: normalize state for devices/sensors/rule nodes (`byId`, `allIds`); avoid O(n) lookups and unnecessary re-renders. |
| **Selector performance (dashboards, live data)** | P1-14: memoized selectors per feature (`createSelector`); critical for telemetry and rule execution views. |
| **Rule engine rigidity** | Rule-engine section: `RuleNodeDefinition` + `ConfigField`; schema-driven UI and validation; new node types without touching UI logic. |
| **Performance in lists** | P2-9: guardrails — `React.memo` for list rows, `key={id}` from backend, avoid inline arrow functions in large lists. |
| **Onboarding & discoverability** | P2-10: short feature-level README (state shape, entry points, main components). |

---

## P0 – Foundation (do first)

Critical for consistency and for enabling P1/P2 work.

| ID | Task | Details |
|----|------|---------|
| P0-1 | Consolidate type exports per domain | Use `src/types/*.d.ts` as source of truth; ensure `*.ts` only re-exports (e.g. `device.ts` → re-export from `device.d.ts`). No duplicate or conflicting exports. |
| P0-2 | Add shared UI types | Create `src/types/ui.d.ts` (or `common.d.ts`) with `FormErrors`, `SelectOption`, shared modal/form prop shapes. |
| P0-3 | Add API types | Create `src/types/api.d.ts` for API request/response DTOs where they differ from domain models. |
| P0-4 | Type slices: remove `any` in thunks | In each slice: type `rejectWithValue` payload and `PayloadAction<T>` for fulfilled. Slices: devices, deviceStates, organizations, areas, sensors, auth, ruleEngine. |
| P0-5 | Type services: API response types | In each service: type `response.data` (use `ApiResponse<T>` from P0-8 where applicable). |
| P0-6 | Enable Tailwind in build | In `src/index.css` add at top: `@tailwind base;` `@tailwind components;` `@tailwind utilities;`. Keep existing custom classes below. Verify `tailwind.config.js` content paths. |
| P0-7 | Map theme tokens to Tailwind | In `tailwind.config.js` `theme.extend.colors`: add semantic tokens mirroring `styles/theme.ts` (background, surface, card, primary, danger, success, border). **Also add state/feedback tokens:** e.g. `surfaceHover`, `dangerBg`, `warningBg` for device state indicators, rule validation, alerts. Keep `darkMode: 'class'` and ensure root gets `dark` when dark mode is on. |
| P0-8 | Standard API response + error contract | In `src/types/api.d.ts` add: `ApiSuccess<T>`, `ApiError` (success, message, code?, details?), `ApiResponse<T> = ApiSuccess<T> \| ApiError`. Services return `Promise<ApiResponse<T>>` (or unwrap and throw typed `ApiError`); thunks use typed `rejectWithValue`. Enables consistent toasts and UI error handling. |
| P0-9 | Typed AppThunk & useAppDispatch/useAppSelector | Export `AppThunk<ReturnType = void>`, `AppDispatch` from store; add typed `useAppDispatch` and `useAppSelector`. Use them everywhere instead of raw `useDispatch`/`useSelector`. Removes generic noise and mistakes in slices. |
| P0-10 | Feature boundary rule | Document (e.g. in `docs/` or root README): **A feature may import from: `common/`, `types/`, and its own feature folder. It may NOT import from another feature.** Prevents cross-feature coupling (Device → Sensor → RuleEngine). |

**P0 exit criteria:** Single source of truth for domain types; standard API/error contract; typed Redux (AppThunk, useAppDispatch/useAppSelector); feature boundary rule in place; no `any` in slices/services; Tailwind enabled with semantic + state tokens; dark mode works with Tailwind.

---

## P1 – Important (high impact)

Reusable UI, typing, state shape, and rule-engine abstractions.

| ID | Task | Details |
|----|------|---------|
| P1-1 | Add `FormField` component | In `common/`: label + control slot + error message + optional hint; props: `label`, `error`, `required`, `children`, optional `id`. Support `className`. |
| P1-2 | Add `FormActions` (or `ButtonGroup`) | In `common/`: horizontal layout for Cancel / Submit; consistent spacing; optional mobile stack. Use in forms. |
| P1-3 | Migrate one form to FormField + common Input/Button | Pick one (e.g. DeviceIdentityForm or AreaForm). Replace inline label+input+error with FormField and common Button. |
| P1-4 | Add `Page` (or `PageCard`) layout | Max-width container, optional title + description, consistent padding. Use in create/edit/detail screens. |
| P1-5 | Add shared `Card` component | Border, radius, shadow, padding, optional header. Use for list items and detail blocks. Prefer Tailwind inside. |
| P1-6 | Single shared `EmptyState` in common | Props: `title`, `description`, `actionLabel`, `onAction`, optional `icon`. Replace per-feature EmptyState usage (devices, areas, organizations, sensors, ruleEngine) with this. |
| P1-7 | Move component props to feature types | For devices, organizations, areas: add `components/<feature>/types.ts` (or `.d.ts`) with props interfaces; components import from there. Then sensors, ruleEngine. |
| P1-8 | Reduce `any` in components | Replace `data: any` and similar in callbacks (e.g. rule engine node config) with proper interfaces. |
| P1-9 | Tailwind: migrate one feature module | Pick one (e.g. devices or areas). Replace inline styles with Tailwind classes in that feature only; no behavior change. |
| P1-10 | Standardize modal usage | Document when to use `common/Modal` vs MUI Dialog. Ensure `common/Modal` has overlay click, Escape, title, footer, `className`. Use it in DeviceStatesModal, CapabilitiesSummaryModal, etc. |
| P1-11 | Controlled vs smart component rule | Document: **common/** = stateless, no API calls, no Redux. **features/*/components** = UI + callbacks only. **features/*/containers** = Redux, routing, data fetching. Prevents “smart” common components and API calls hidden in UI. |
| P1-12 | Add `AsyncState<T>` helper | In `types/ui.d.ts` (or `api.d.ts`): `interface AsyncState<T> { status: 'idle' \| 'loading' \| 'success' \| 'error'; data?: T; error?: string; }`. Use in slices (e.g. `devices: AsyncState<Device[]>`). Simplifies UI conditionals, EmptyState, retry logic. |
| P1-13 | Normalize state for devices / rule nodes | For devices, sensors, and rule nodes: store as `{ byId: Record<string, Entity>; allIds: string[] }`. Enables O(1) lookups, incremental updates (telemetry, device states), and stable references for rule engine. Introduce in one slice first (e.g. devices), then expand. |
| P1-14 | Memoized selectors per feature | Add `selectors.ts` (or equivalent) per feature; use `createSelector` for derived data (e.g. `selectDevicesByArea`, `selectDeviceById`). Critical for dashboards with live telemetry and rule evaluation. |
| P1-15 | Add `cn()` utility | In `src/utils/cn.ts` (or `common/utils/cn.ts`): `cn(...inputs) => twMerge(clsx(inputs))`. Rule: every reusable component accepts `className` and uses `cn()` to merge. (Requires `clsx` if not already present.) |

**Rule-engine–specific (P1)**

| ID | Task | Details |
|----|------|---------|
| P1-R1 | `RuleNodeDefinition` abstraction | Define `RuleNodeDefinition`: `type`, `label`, `icon?`, `configSchema: ConfigField[]`. UI renders nodes dynamically; validation is schema-driven; adding new node types does not touch UI logic. |
| P1-R2 | `ConfigField` typing | Define `ConfigField` as discriminated union (e.g. `{ type: 'number'; key: string; min?: number; max?: number }` \| `{ type: 'select'; key: string; options: SelectOption[] }` \| `{ type: 'sensorKey'; key: string }`). Ties to FormField and gives end-to-end typing for rule config. |

**P1 exit criteria:** FormField/FormActions in use; Page/Card + shared EmptyState; feature props in types; one feature on Tailwind; modals consistent; component/smart rule documented; AsyncState in use; normalized state and memoized selectors in at least one feature; cn() in use; rule engine has RuleNodeDefinition + ConfigField.

**Docs:** P1-4–P1-6: `docs/P1-4-P1-5-P1-6-PAGE-CARD-EMPTYSTATE.md`. P1-12–P1-15: `docs/P1-12-P1-13-P1-14-P1-15-ASYNC-STATE-SELECTORS-CN.md`.

---

## P2 – Nice-to-have (polish and scale)

| ID | Task | Details |
|----|------|---------|
| P2-1 | Add `src/types/index.ts` barrel | Re-export public types so consumers can `import type { X } from '@/types'` (or relative). Keeps imports stable. |
| P2-2 | Audit and document common components | List Button, Input, Modal, Select, Loading, Toggle; document when to use each; ensure each has clear props interface and `className` support. |
| P2-3 | Deprecate or fix unused/duplicate common components | Remove or consolidate duplicates; fix components that are never used. |
| P2-4 | Tailwind: migrate remaining features | Migrate sensors, organizations, areas, ruleEngine (and rest) from inline styles to Tailwind. One feature per PR. |
| P2-5 | Remove redundant CSS from index.css | After Tailwind migration, remove custom utility classes that are now redundant; keep only what’s still referenced. |
| P2-6 | Consolidate form/button classes | Long term: move `.form-input`, `.form-label`, `.btn*` into Tailwind @apply or into shared components that use Tailwind. |
| P2-7 | Optional: add `List` / `ListRow` | If list layout is consistent across device/area/org lists, add a shared list primitive in common. |
| P2-8 | Optional: shared `ListProps<T>` / `FormWrapperProps` | In `types/ui.d.ts`, add recurring prop shapes for list and form wrappers if they appear in 2+ features. |
| P2-9 | Performance guardrails | Conventions: use `React.memo` for list row components; always `key={id}` from backend; avoid inline arrow functions in large list renders. Important for live IoT dashboards and rule execution views. |
| P2-10 | Feature-level README | Each feature folder gets a short README: state shape, entry points, main components. Improves onboarding and discoverability. |

**P2 exit criteria:** Types barrel; common components documented; redundant CSS removed; all features on Tailwind; performance conventions and feature READMEs in place; optional list/types as needed.

---

## Task summary by priority

| Priority | Count | Focus |
|----------|--------|--------|
| **P0** | 10 tasks | Types, API/error contract, AppThunk/useApp*, feature boundary, Tailwind + semantic/state tokens |
| **P1** | 15 + 2 rule-engine | FormField, FormActions, Page, Card, EmptyState, props, Tailwind one feature, modals, component rule, AsyncState, normalization, selectors, cn(), RuleNodeDefinition, ConfigField |
| **P2** | 10 tasks | Barrel, audit common, Tailwind rest, CSS cleanup, list/types, performance guardrails, feature READMEs |

---

## Conventions

- **Interfaces:** Prefer `interface` for objects; `type` for unions/aliases. Export from `types/` or feature `types.ts`.
- **Props:** Name `ComponentNameProps`; in same file for tiny components, in `types.ts` when shared.
- **Styling:** New code uses Tailwind; migrate existing in dedicated PRs. Use `cn()` to merge `className` with component defaults.
- **Components:** Prefer `common/` by default; add new primitives only when pattern appears in 2+ places. **common/** = no Redux, no API (P1-11).
- **Features:** Do not import from another feature; only from `common/`, `types/`, and own feature (P0-10).
- **i18n:** New UI strings use i18n from day one. **A11y:** FormField and modals keep labels, focus, Escape, ARIA where needed.

---

## Refined execution strategy (PR grouping)

| PR | Scope | Tasks |
|----|--------|--------|
| **PR-1** | Types + slices + services | P0-1 → P0-5 (consolidate types, UI/api types, type slices, type services) |
| **PR-2** | Tailwind + API contract + Redux typing | P0-6 → P0-7 → P0-8 (Tailwind enable + theme tokens + ApiResponse/ApiError) |
| **PR-3** | Redux & boundaries | P0-9 → P0-10 (AppThunk, useAppDispatch/useAppSelector, feature boundary rule) |
| **PR-4** | Form primitives + one form | P1-1 → P1-3 (FormField, FormActions, migrate one form) |
| **PR-5** | Layout + EmptyState | P1-4 → P1-6 (Page, Card, shared EmptyState) |
| **PR-6** | State & selectors | P1-12 → P1-13 → P1-14 (AsyncState, normalize one slice, memoized selectors) + P1-15 (cn()) |
| **PR-7** | Tailwind one feature | P1-9 (e.g. devices) |
| **PR-8** | Rule engine abstractions | P1-R1 → P1-R2 (RuleNodeDefinition, ConfigField) |
| **PR-9** | Props, modals, component rule | P1-7 → P1-8 → P1-10 → P1-11 |
| **PR-10+** | P2 | P2-1 through P2-10 as needed |

You can merge PR-2 and PR-3 if preferred (e.g. one “foundation” PR after PR-1). Adjust order if AsyncState or normalization is needed earlier for a specific feature.

---

## Suggested order (by task ID)

1. P0-1 → P0-2 → P0-3 → P0-4 → P0-5 (types foundation)
2. P0-6 → P0-7 → P0-8 (Tailwind + API contract)
3. P0-9 → P0-10 (Redux typing + feature boundary)
4. P1-1 → P1-2 → P1-3 (form primitives + one form)
5. P1-4 → P1-5 → P1-6 (Page, Card, EmptyState)
6. P1-12 → P1-13 → P1-14 → P1-15 (AsyncState, normalization, selectors, cn())
7. P1-9 (Tailwind one feature)
8. P1-R1 → P1-R2 (rule engine) TO DO
9. P1-7 → P1-8 → P1-10 → P1-11 (props, modals, component rule) To DO
10. P2-* in any order

Update this doc as tasks are completed or scope changes.
