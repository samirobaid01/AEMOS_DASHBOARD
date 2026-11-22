# Dense Telemetry Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Live Telemetry screen as a dense, full-width, ThingsBoard-style widget dashboard (KPI tiles, live chart, gauges, sensor cards) in the real app, establishing the design-system foundation (tokens + primitives) that every later screen will reuse.

**Architecture:** A vertical slice. Add a minimal token/primitive foundation (neutral `ink` scale, Inter font, `cn()` util, Recharts, lucide-react), extract the reusable pure logic out of `TelemetryRow`, add a client-side rolling history buffer so sparklines/charts populate live, build reusable UI primitives + telemetry widgets, then recompose the presentational `TelemetryDashboard` from them. The container's orchestration and socket hooks are preserved; only presentation and a history buffer are added.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind 3.4 (`darkMode: 'class'`), Redux Toolkit, react-i18next, `clsx` + `tailwind-merge` (already deps), **new:** `recharts`, `lucide-react`.

**Spec:** `docs/ui-revamp/UI-REVAMP-PLAN.md` (design/direction) + `docs/ui-revamp/prototypes/telemetry-dense.html` (the approved visual target). The implementation matches the mockup's layout and density in light theme.

## Global Constraints

- **No test runner exists in this repo** (no vitest/jest; `package.json` scripts are dev/build/lint/preview). This slice is overwhelmingly presentational, so verification is: `npm run build` (runs `tsc -b` then vite build) for types, `npm run lint` (eslint) for lint, and the dev server + visual comparison to the mockup for appearance/behavior. Do **not** add a test framework in this plan. Pure functions are specified with exact input→output in their step and verified by typecheck + in-app observation. (A follow-up may add vitest for the pure utils.)
- **Pre-existing baseline errors to ignore** (present on `main` before this work, not introduced here): `tsc` errors in `src/containers/RuleEngine/RuleEdit.tsx` and `src/state/slices/ruleEngine.slice.ts`; eslint `no-explicit-any` in `src/containers/Telemetry/TelemetryDashboard.tsx` (2) and `src/hooks/useMultiTelemetry.ts` (1). A task is "clean" if it adds **no new** errors beyond these.
- **Styling:** Tailwind utility classes only for new components — no inline `style={{}}`, no hardcoded hex. Use tokens (`ink-*`, `leaf-*`, `sky-*`, `wheat-*`, and existing semantic aliases like `bg-card`, `text-textPrimary`). New primitives must be dark-mode-ready via tokens even though only light is validated now.
- **Responsiveness:** new layout uses Tailwind responsive utilities (`sm: md: lg: xl:`), **not** `windowWidth`/`window.innerWidth` branching. The container still passes `windowWidth`; new components ignore it.
- **Icons:** lucide-react, not emoji, not heroicons/mui-icons.
- **Preserve the container contract:** `containers/Telemetry/TelemetryDashboard.tsx` → `components/telemetry/TelemetryDashboard.tsx` props (`TelemetryDashboardProps` in `components/telemetry/types.ts`) stay source-compatible except for the additive `history` prop in Task 6.
- **Commit** after each task.

## Review Focus

- **Empty state:** zero monitored entities → the screen shows a friendly empty state in the cards region, not a blank/broken grid. (Task 6)
- **Missing/placeholder values:** a variable whose value is `'-'`/null (cache miss or pre-first-event) renders as `—` in its tile and as a flat/empty sparkline, never `NaN` or a thrown error. (Tasks 2, 4, 5)
- **Non-numeric values:** device states like `"on"`/`"auto"` render as text in a tile with no sparkline/gauge (gauges/sparklines are numeric-only). (Tasks 4, 5)
- **History before data arrives:** a newly added entity has no history yet → sparkline/chart render empty gracefully and fill as socket events arrive. (Task 3, 5)
- **Disconnected socket:** `telemetryData[entity].connected === false` → status shows offline consistently (dot + label), KPI "Online" count reflects it. (Tasks 4, 5)

---

## Task 1: Design foundation — deps, tokens, font, `cn()`

**Files:**
- Modify: `package.json` (add `recharts`, `lucide-react`)
- Modify: `tailwind.config.js` (add `ink` neutral scale + `fontFamily.sans`)
- Modify: `src/index.css` (import Inter)
- Create: `src/lib/cn.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` from `src/lib/cn.ts`; Tailwind classes `ink-50..900`; `font-sans` = Inter.

- [ ] **Step 1:** Install deps: `npm install recharts lucide-react`. Verify they appear in `package.json` dependencies.
- [ ] **Step 2:** Add to `tailwind.config.js` `theme.extend.colors` an `ink` scale (slate-based neutrals): `50:#f8fafc,100:#f1f5f9,200:#e2e8f0,300:#cbd5e1,400:#94a3b8,500:#64748b,600:#475569,700:#334155,800:#1e293b,900:#0f172a`. Add `theme.extend.fontFamily.sans = ['Inter','system-ui','sans-serif']`. Keep all existing tokens.
- [ ] **Step 3:** In `src/index.css`, add an `@import` (or `<link>` equivalent) for Inter weights 400–700 at the top (before Tailwind directives if using `@import url(...)`).
- [ ] **Step 4:** Create `src/lib/cn.ts` exporting `cn` that merges `clsx` + `tailwind-merge`:
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```
- [ ] **Step 5:** Verify: `npm run build` succeeds (no new errors beyond baseline); temporarily use `cn('text-ink-700','font-sans')` in a scratch spot or trust typecheck. Run `npm run lint` — no new errors.
- [ ] **Step 6:** Commit: `feat(ui): add design tokens, Inter font, recharts/lucide, cn util`

---

## Task 2: Extract pure telemetry formatting utilities

Pulls the value-formatting and variable-extraction logic out of `TelemetryRow` so the new widgets reuse identical behavior.

**Files:**
- Create: `src/utils/telemetryFormat.ts`
- Modify: `src/components/telemetry/TelemetryRow.tsx` (use the extracted fns — keep old table working during migration)

**Interfaces:**
- Produces:
  - `formatTelemetryValue(value: string | number | boolean | null | undefined, variableName?: string): string` — ports `formatValue` from `TelemetryRow` (temperature→`x.x°C`, moisture/humidity→`x.x%`, pressure→`x hPa`, battery→`x%`, other number→`toFixed(2)`, boolean→`Yes/No` via caller-supplied labels; `'-'`/null/undefined → `'—'`).
  - `extractEntityVariables(entity: MonitoredEntity, data: EntityTelemetryData): Array<{ id: string; name: string; value: string|number|boolean; isNew: boolean }>` — ports `getVariablesList`.
  - `toNumeric(value: unknown): number | null` — parses a value to a finite number or null (for gauges/sparklines).

- [ ] **Step 1:** Create `src/utils/telemetryFormat.ts` with the three functions. `formatTelemetryValue` keeps the exact unit heuristics currently in `TelemetryRow.formatValue`; boolean uses params `yesLabel='Yes', noLabel='No'` (defaults) so it stays i18n-agnostic. `toNumeric('74.40')===74.4`, `toNumeric('on')===null`, `toNumeric('-')===null`, `toNumeric(5)===5`.
- [ ] **Step 2:** Refactor `TelemetryRow.tsx` to import `formatTelemetryValue` (passing `t('common.yes')`/`t('common.no')`) and `extractEntityVariables`, deleting its local `formatValue`/`getVariablesList`. Behavior unchanged.
- [ ] **Step 3:** Verify: `npm run build` + `npm run lint` clean (no new errors). Dev server: existing table still formats values identically.
- [ ] **Step 4:** Commit: `refactor(telemetry): extract value-format + variable-extract utils`

---

## Task 3: Live history buffer hook

Accumulates a rolling window of recent points per variable so sparklines and the chart have history (the socket only delivers the latest value).

**Files:**
- Create: `src/hooks/useTelemetryHistory.ts`

**Interfaces:**
- Consumes: `TelemetryData` (from `components/telemetry/types`).
- Produces:
  - `type HistoryPoint = { t: number; value: number }`
  - `type TelemetryHistory = Record<string, HistoryPoint[]>` keyed by `"${entityId}:${variableKey}"`.
  - `useTelemetryHistory(telemetryData: TelemetryData, cap?: number): TelemetryHistory` — on each change, for every entity/value whose `timestamp` is newer than the last stored point for that key and whose value is numeric (`toNumeric`), appends `{t, value}`, trimming to `cap` (default 60). Non-numeric values are ignored. Stable keys persist across renders (store in a ref + state).

- [ ] **Step 1:** Create the hook. Use a `useRef<TelemetryHistory>` as the running buffer and a `useState` mirror to trigger re-render; a `useEffect` on `telemetryData` diffs by timestamp and appends. Key format: `` `${entityId}:${variableKey}` `` where `variableKey` is the `values` map key (variable id / state id).
- [ ] **Step 2:** Edge behavior to implement explicitly: unknown/`'-'`/non-numeric value → skip (no point); duplicate timestamp → skip; buffer exceeds `cap` → drop oldest.
- [ ] **Step 3:** Verify: `npm run build` clean. Dev server: add a sensor, confirm (via a temporary `console.log` of buffer lengths) arrays grow as `new-datastream` events arrive, capped at 60. Remove the log.
- [ ] **Step 4:** Commit: `feat(telemetry): add client-side rolling history buffer hook`

---

## Task 4: UI primitives (Card, KpiTile, StatusDot, Badge, Sparkline, Gauge)

Reusable, token-styled building blocks. These are the first members of the design system.

**Files:**
- Create: `src/components/ui/Card.tsx`, `KpiTile.tsx`, `StatusDot.tsx`, `Badge.tsx`, `Sparkline.tsx`, `Gauge.tsx`
- Create: `src/components/ui/index.ts` (barrel)

**Interfaces:**
- Produces:
  - `Card`: `{ className?, children }` → white, `rounded-xl border border-ink-200`, dark-mode token variants; hover elevation. Optional `<Card.Header>`/`<Card.Body>`/`<Card.Footer>` or simple padded container — implementer's call, keep minimal.
  - `KpiTile`: `{ label: string; value: React.ReactNode; hint?: React.ReactNode; accent?: 'neutral'|'success'|'warning'|'danger'; icon?: React.ReactNode }`.
  - `StatusDot`: `{ status: 'online'|'offline'|'stale'; label?: string; pulse?: boolean }` — colored dot (+ optional label) using tokens (`leaf` online, `ink-400` offline, `wheat` stale).
  - `Badge`: `{ variant?: 'neutral'|'info'|'success'|'warning'|'danger'; children }`.
  - `Sparkline`: `{ data: number[]; color?: string; className?: string }` — tiny Recharts line (no axes/grid/tooltip), renders empty gracefully for `[]`.
  - `Gauge`: `{ value: number|null; min?: number; max: number; unit?: string; color?: string; label?: string }` — Recharts radial gauge with centered value; `null` → shows `—`.

- [ ] **Step 1:** Build `Card`, `StatusDot`, `Badge` (pure Tailwind + `cn`, variant maps as objects).
- [ ] **Step 2:** Build `KpiTile` composing Card + label/value/hint; accent controls value color token.
- [ ] **Step 3:** Build `Sparkline` and `Gauge` with Recharts (`LineChart`/`Line`; `RadialBarChart`/`RadialBar`). Fixed heights, `ResponsiveContainer`. Handle empty/`null` inputs per Review Focus.
- [ ] **Step 4:** Barrel-export from `src/components/ui/index.ts`.
- [ ] **Step 5:** Verify: `npm run build` + `npm run lint` clean. Temporarily drop each primitive onto the telemetry page (or a scratch route) to eyeball rendering; then remove the scratch usage.
- [ ] **Step 6:** Commit: `feat(ui): add Card, KpiTile, StatusDot, Badge, Sparkline, Gauge primitives`

---

## Task 5: Telemetry widgets (toolbar, KPI row, sensor card, chart)

Telemetry-specific compositions of the primitives + data logic, matching the mockup.

**Files:**
- Create: `src/components/telemetry/TelemetryToolbar.tsx` (compact inline filter+add bar; dense refactor of `TelemetryFilters`' content — reuse its existing select options/handlers)
- Create: `src/components/telemetry/TelemetryKpiRow.tsx`
- Create: `src/components/telemetry/SensorWidgetCard.tsx`
- Create: `src/components/telemetry/TelemetryTimeChart.tsx`

**Interfaces:**
- Consumes: `cn`, `ui/*` primitives, `telemetryFormat.ts`, `TelemetryHistory` (Task 3), `MonitoredEntity`/`EntityTelemetryData`/`TelemetryDashboardProps` fields.
- Produces:
  - `TelemetryToolbar`: same filter props as `TelemetryFilters` (org/area/sensor/device selected ids + `onXChange` + `onAddEntity` + `canAdd` + `isLoading`), rendered as a single dense row (labels, selects, Add button) inside a `Card`.
  - `TelemetryKpiRow`: `{ entities: MonitoredEntity[]; telemetryData: TelemetryData }` → derives counts: total entities, online (`connected` true), active alarms (0 for now — placeholder tile), data-points/min (derivable from history later; show count of entities with a recent update). Renders 4 `KpiTile`s.
  - `SensorWidgetCard`: `{ entity: MonitoredEntity; data: EntityTelemetryData; history: TelemetryHistory; onRemove: (id: string) => void }` → Card with header (icon via lucide, name, area, `StatusDot`), a grid of per-variable mini-tiles (value via `formatTelemetryValue` + `Sparkline` from `history["${entity.id}:${key}"]`; non-numeric → text, no sparkline), footer (variable count + last-update time). A remove (×) control.
  - `TelemetryTimeChart`: `{ entities: MonitoredEntity[]; history: TelemetryHistory }` → multi-series Recharts line over the union of numeric series (cap series count, legend at bottom), empty state when no history.
- [ ] **Step 1:** `TelemetryKpiRow` — derivation functions pure and inline; renders 4 tiles.
- [ ] **Step 2:** `SensorWidgetCard` — compose header/body/footer; numeric vs non-numeric branch per Review Focus; keep the `isNew` flash (reuse the existing 2s flash semantics via a tile highlight when `data.values[key].isNew`).
- [ ] **Step 3:** `TelemetryTimeChart` — map series to data-viz colors (`sky/leaf/wheat/soil` hues); handle empty history.
- [ ] **Step 4:** `TelemetryToolbar` — port `TelemetryFilters`' selects/handlers into one dense `Card` row; preserve existing option-building logic.
- [ ] **Step 5:** Verify: `npm run build` + `npm run lint` clean. Eyeball each widget with a monitored entity on the dev server.
- [ ] **Step 6:** Commit: `feat(telemetry): add toolbar, KPI row, sensor card, time chart widgets`

---

## Task 6: Recompose the dense dashboard + wire history

Replace the sparse table layout with the widget grid, and feed history from the container.

**Files:**
- Modify: `src/components/telemetry/TelemetryDashboard.tsx` (recompose body)
- Modify: `src/components/telemetry/types.ts` (add `history: TelemetryHistory` to `TelemetryDashboardProps`)
- Modify: `src/containers/Telemetry/TelemetryDashboard.tsx` (call `useTelemetryHistory`, pass `history`)

**Interfaces:**
- Consumes: Tasks 3–5 outputs.
- Produces: the finished screen.

- [ ] **Step 1:** Add `history: TelemetryHistory` to `TelemetryDashboardProps`.
- [ ] **Step 2:** In the container, call `const history = useTelemetryHistory(telemetryData)` and pass it to `<TelemetryDashboardComponent history={history} … />`.
- [ ] **Step 3:** Recompose `components/telemetry/TelemetryDashboard.tsx`: keep `Page`; render `TelemetryToolbar` → `TelemetryKpiRow` → a grid with `TelemetryTimeChart` (2/3) + gauges panel (1/3, using `Gauge` for key numeric readings) → responsive grid of `SensorWidgetCard` → events strip (static placeholder is acceptable for this slice; label it). Full-width container, Tailwind responsive breakpoints only.
- [ ] **Step 4:** Empty state: when `monitoredEntities.length === 0`, render an `EmptyState`-style message in the cards region (per Review Focus) instead of an empty grid.
- [ ] **Step 5:** Remove the now-unused `TelemetryTable`/`TelemetryRow`/`TelemetryFilters` imports from this screen if fully replaced (leave the files in place for now; deletion is a later cleanup to avoid breaking other importers — verify none remain via grep).
- [ ] **Step 6:** Verify: `npm run build` + `npm run lint` clean (no new errors). Dev server at `/telemetry`: add the three sensors from the mockup, confirm the layout fills the width, KPI tiles/cards/gauges show real current values, sparklines/chart fill as events arrive, empty state shows with zero entities, disconnected state is reflected. Compare side-by-side to `telemetry-dense.html`.
- [ ] **Step 7:** Commit: `feat(telemetry): recompose Live Telemetry as dense widget dashboard`

---

## Notes / explicitly out of scope (follow-ups)

- **Two live bugs** visible in the screenshot, tracked separately (not this slice): missing `common.organization/area/sensor/device` i18n keys (raw keys render in filters), and "Unknown Organization → Unknown Area" resolution. Quick wins; do in a dedicated fix.
- **Global `Button` migration** off inline-styles/hardcoded-hex to tokens — deferred to the design-system rollout phase (this slice introduces primitives alongside it, doesn't replace it).
- **Dark theme variant** of the dashboard — primitives are token-ready; validating/polishing dark is a later pass.
- **Rollout to the other 7 feature areas** and **DataTable/Form shared patterns** — subsequent phases per `UI-REVAMP-PLAN.md`.
- **Real history/alarms APIs** — the chart/sparklines use a client-side buffer; a backend history endpoint and a real events feed replace the placeholders later.
