# Plan: P2-6 through P2-10 (no exploitation of old code)

This document plans fixes for **P2-6**, **P2-7**, **P2-8**, **P2-9**, and **P2-10** from `CODEBASE_IMPROVEMENT_PLAN.md` (lines 91–95). The guiding rule: **do not exploit old code** — improvements are driven by the target state (shared components, types, conventions) rather than by copying or cementing existing patterns.

---

## P2-6 – Consolidate form/button classes

**Target:** No legacy `.form-input`, `.form-label`, `.btn*` in the app; all form/button styling via Tailwind and shared components.

**Current state:** Grep shows no usages of `form-input`, `form-label`, or `btn*` in `src`; `index.css` does not define these. Styling is already through `Button`, `Input`, `FormField`, and Tailwind.

**Planned fixes (no new legacy):**

1. **Lock the current state**
   - Leave `index.css` as-is (no `.form-*` or `.btn*`).
   - Do not add new global form/button utility classes; any new form/button UI must use `common/` components + Tailwind.

2. **Document the rule**
   - In `docs/CODEBASE_IMPROVEMENT_PLAN.md` or a short “Styling conventions” section: “Form and button styling: use `Button`, `Input`, `FormField` from `common/` and Tailwind only. Do not introduce `.form-input`, `.form-label`, or `.btn*` in CSS or className.”

3. **Optional guard**
   - If desired, add an ESLint rule or a short checklist in the PR template to flag any new use of `form-input`, `form-label`, or `btn-` in class names so they are not reintroduced.

**Out of scope:** No refactor of existing components that already use `Button`/`Input`/`FormField`; only prevent backsliding and document the convention.

---

## P2-7 – Optional: List / ListRow

**Target:** A shared list primitive in `common/` only if the same layout pattern appears in 2+ features and we define it by contract, not by copying old list markup.

**Current state:** Device, Area, Organization, and Sensor lists each use a list container + row component (e.g. `DeviceList` + `DeviceItem`). Layout is similar (card-like rows, link, optional detail/subtitle) but not identical.

**Planned approach (do not exploit old code):**

1. **Decide by contract, not by copying**
   - Define the desired API first, e.g. `List<T>` with `items`, `renderItem: (item: T) => ReactNode`, `keyFn: (item: T) => string | number`, and optional `emptyNode`.
   - Optionally `ListRow` with props: `title`, `subtitle?`, `to?`, `statusIndicator?`, `className?`, all styled with Tailwind.
   - Do **not** copy-paste from `DeviceList`/`OrganizationList`; implement against this contract and then migrate one list (e.g. devices) to use it.

2. **Only add if justified**
   - If after P2-4 (Tailwind migration) two or more list UIs converge to the same structure, add `List`/`ListRow` in `common/` and migrate those lists.
   - If lists remain intentionally different (e.g. devices need extra actions, rules need different layout), skip P2-7 and keep feature-specific list components.

3. **Location and styling**
   - New components live under `src/components/common/List/` (or similar); use Tailwind and `cn()` only; no new global CSS classes.

**Exit condition:** Either (a) `List`/`ListRow` added and used in at least two features, or (b) documented decision not to add them with a one-line reason.

---

## P2-8 – Optional: shared ListProps&lt;T&gt; / FormWrapperProps

**Target:** Shared types in `types/ui.d.ts` for list and form wrappers only if the same prop shapes appear in 2+ features.

**Current state:** `types/ui.d.ts` already has `FormPropsBase` (formErrors, isLoading, error, onSubmit, onCancel). No shared `ListProps<T>` or `FormWrapperProps` yet.

**Planned approach (type-first, no legacy lock-in):**

1. **FormWrapperProps**
   - If 2+ form wrappers (e.g. create/edit screens) share the same prop shape (title, children, onSubmit, onCancel, loading?, error?), add something like:
     - `FormWrapperProps = { title?: string; children: ReactNode; onSubmit: () => void; onCancel: () => void; loading?: boolean; error?: string | null }`
   - Use it in new or refactored screens; do not force existing components to use it until they are touched for other reasons.

2. **ListProps&lt;T&gt;**
   - Add only if we introduce a shared `List` component (P2-7) or if two+ feature list containers share the same props (e.g. `items: T[]`, `renderItem`, `keyFn`, `emptyMessage`). Define the type to match the desired API, then use it in the shared component and in migrating features.
   - Do not derive the type by copying from a single existing list; define the minimal contract that fits current and future use.

3. **Location**
   - All in `src/types/ui.d.ts` (or a dedicated `layout.d.ts` if the file grows), re-exported via `src/types/index.ts` if appropriate.

**Exit condition:** Either (a) `FormWrapperProps` and/or `ListProps<T>` added and used in at least two places, or (b) documented decision to skip with a one-line reason.

---

## P2-9 – Performance guardrails

**Target:** Conventions for list rendering: `React.memo` for list row components, `key={id}` from backend where possible, avoid inline arrow functions in large list renders.

**Current state:** List row components already use `React.memo` (DeviceItem, OrganizationItem, AreaItem, SensorItem, RuleItem). Many lists use `key={entity.id}`. Some places still use `key={index}` or inline handlers.

**Planned fixes (improve, do not lock in bad patterns):**

1. **Keys**
   - **Prefer backend id:** Keep or migrate to `key={item.id}` (or equivalent stable id from API) for list items. No new `key={index}` for list rows.
   - **Audit and fix `key={index}` in list-like renders:**
     - `NodeDialog.tsx` (e.g. ~597): if the list is order-dependent and has no id, consider generating a stable id (e.g. from content or parent id + index) or document why index is acceptable.
     - `DeviceStateTest.tsx` (~177), `RuleForm.tsx` (~445), `SensorForm.tsx` (~210), `DeviceStatesModal.tsx` (~197), `DynamicKeyValueInput` (~146), `SocketTester` (~528): same rule — prefer stable id; if the list is truly static/short and order-only, document or replace with a stable key where feasible (e.g. item id or composite key).

2. **Inline handlers in list maps**
   - Avoid passing new arrow functions in `.map()` for large lists (e.g. `onClick={() => doSomething(item.id)}`). Prefer:
     - A single handler that reads from event/data attributes, or
     - Callbacks passed as props to the row component (already the case for memoized items), or
     - Stable callbacks created with `useCallback` and an identifier argument.
   - Add this as a short “Performance” bullet in the conventions section of the improvement plan or in a `docs/CONVENTIONS.md`.

3. **Document conventions**
   - In `CODEBASE_IMPROVEMENT_PLAN.md` or `docs/CONVENTIONS.md`: “List performance: use `React.memo` for row components; use `key={id}` from backend; avoid inline arrow functions in list `.map()`; prefer stable callbacks or event-based handlers.”

**Out of scope:** No large refactor of rule-engine or form internals solely for keys; fix when touching those files. Do not add `key={index}` in new list code.

---

## P2-10 – Feature-level README

**Target:** Each feature folder has a short README: state shape, entry points, main components. Improves onboarding and discoverability.

**Principle:** Content should be derived from the **current** code (state slices, routes, container/component structure), not copied from outdated docs or “old” descriptions.

**Feature folders in scope:**

| Feature        | Container path              | Likely state slice(s)     | README path (suggested)                    |
|----------------|-----------------------------|----------------------------|--------------------------------------------|
| Dashboard      | `containers/Dashboard/`     | multiple (org, area, device, sensor) | `containers/Dashboard/README.md`  |
| Devices        | `containers/Devices/`      | `devices`, `deviceDetails`, etc.    | `containers/Devices/README.md`     |
| Organizations | `containers/Organizations/`| `organizations`           | `containers/Organizations/README.md`      |
| Areas          | `containers/Areas/`        | `areas`                   | `containers/Areas/README.md`               |
| Sensors        | `containers/Sensors/`      | `sensors`                 | `containers/Sensors/README.md`             |
| Rule engine    | `containers/RuleEngine/`   | `ruleEngine`              | `containers/RuleEngine/README.md`         |
| Auth           | `containers/Auth/`         | `auth`                    | `containers/Auth/README.md`                |

**Planned README structure (per feature):**

1. **State shape** – Which slice(s) and main fields (e.g. `devices: Device[]`, `selectedDevice`, loading/error). Copy from actual slice state types or initial state, not from old docs.
2. **Entry points** – Route path(s) and the container component that mounts (e.g. `/devices` → `DeviceList.tsx`).
3. **Main components** – One-line role of the container(s) and the main feature components (e.g. `DeviceList`, `DeviceItem`, `DeviceDetails`). List file names and responsibilities; do not copy deprecated or removed components.

**Process:**

- For each feature, open the slice file and route config, list containers and main components, then write the README from that.
- Do not create READMEs that describe removed or renamed modules; keep them in sync with the codebase.
- Optionally add a single “Feature READMEs” section in the main README or improvement plan that links to these.

**Exit condition:** All seven feature folders above have a README that reflects current state shape, entry points, and main components.

---

## Summary table

| ID    | Focus                                      | Do not exploit old code |
|-------|--------------------------------------------|---------------------------|
| P2-6  | Lock form/button styling to common + Tailwind | No new `.form-*`/`.btn*`; document rule only. |
| P2-7  | Optional List/ListRow                      | Define by contract; add only if 2+ features share pattern; do not copy existing list markup. |
| P2-8  | Optional ListProps/FormWrapperProps        | Add types that match desired API; use in 2+ places or skip; do not mirror a single legacy component. |
| P2-9  | Performance guardrails                     | Prefer `key={id}`; fix `key={index}` where feasible; document conventions; no new inline handlers in large lists. |
| P2-10 | Feature READMEs                            | Derive from current slices, routes, and components; do not copy old or obsolete docs. |

---

## Suggested order of execution

1. **P2-10** – Feature READMEs (no code change; improves clarity for all following work).
2. **P2-9** – Document performance conventions; then fix `key={index}` and inline handlers when touching those files (or in a small, focused pass).
3. **P2-6** – Document the form/button rule (and optional lint/checklist).
4. **P2-8** – Add `FormWrapperProps` (and optionally `ListProps<T>`) if a quick audit shows 2+ usages; otherwise document “skipped”.
5. **P2-7** – After P2-4 (Tailwind migration) and list UI convergence, either introduce `List`/`ListRow` from the defined contract or document “skipped”.

This order avoids depending on old code and keeps each step aligned with the target state described in the improvement plan.
