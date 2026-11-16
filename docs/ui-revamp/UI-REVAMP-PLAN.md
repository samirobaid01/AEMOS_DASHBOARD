# AEMOS Dashboard — UI Revamp Plan

**Status:** Draft for review · **Date:** 2026-11-14 · **Scope:** Frontend UI/UX overhaul
**Owner:** _(you)_ · **Audience:** this is a local planning doc — not published anywhere

---

## 1. Intent & goals

Bring the AEMOS agriculture-IoT dashboard up to the standard of state-of-the-art
IoT platforms (think Grafana, Datadog, SmartThings, Particle Console, AWS IoT
SiteWise consoles). The revamp targets four outcomes, in priority order:

1. **Usability** — fewer clicks to insight, predictable patterns, strong feedback, real-time state that's legible at a glance.
2. **Professional look** — a cohesive, owned design system; no generic/stock feel; consistent spacing, type, color, motion.
3. **Mobile-first & responsive** — designed for a phone in a field first, scaling up to wall-mounted control-room displays.
4. **Scalability** — a component/token architecture that lets the team add screens fast without visual drift.

**Non-goals:** backend/API changes (beyond consuming what exists), new product features, rebrand of the company identity, i18n expansion beyond the current en/es.

**Anti-goals (would make this a failure even if "done"):** swapping one inconsistent styling approach for another; a pixel-polished desktop that breaks on a phone; a design system nobody adopts because it's painful to use; a big-bang rewrite that strands the app half-migrated for months.

---

## 2. Current-state assessment (grounded in the codebase)

**Stack:** React 19, Vite 6, TypeScript, Redux Toolkit, react-router 7, i18next (en/es), react-toastify, Tailwind 3.4 (`darkMode: 'class'`).

**What's good (build on it):**
- Tailwind is the de-facto system — **75 of 77** component files use utility classes.
- A custom domain palette exists in `tailwind.config.js` (`leaf`, `soil`, `wheat`, `sky`) plus a **semantic token layer** already in use (`bg-background`, `bg-card`, `bg-surface`, `text-textPrimary`, `border-border`, `bg-primary`, `text-warning`, `surfaceHover`…).
- Class-based dark mode is wired via `src/context/ThemeContext.tsx`.
- Clean feature-sliced structure: 8 areas (Dashboard, Telemetry, Organizations, Areas, Sensors, Devices, RuleEngine, Auth), each a List/Create/Edit/Details set.
- Real-time plumbing already works (`useMultiTelemetry`, per-entity socket rooms).

**What undermines "state-of-the-art" today:**

| # | Problem | Evidence | Impact |
|---|---------|----------|--------|
| C1 | **Design-system components bypass Tailwind.** `common/Button` is built from inline `React.CSSProperties` with **hardcoded hex** (`#3b82f6`, `#4d7efa`) via `useTheme()`/`useThemeColors()` runtime hooks — and the blue doesn't even match the agri palette. | `src/components/common/Button/Button.tsx` | Two competing styling systems; the "design system" is the least consistent part. Theme drift, no hover/focus states via CSS, poor a11y. |
| C2 | **JS-driven responsiveness.** `window.innerWidth` + resize listeners decide layout (`isMobile = width < 768`). | `MainLayout.tsx`, `containers/Telemetry/TelemetryDashboard.tsx` | Re-renders on resize, hydration/SSR-fragile, fights Tailwind's CSS breakpoints. Not truly mobile-first. |
| C3 | **Emoji as product iconography.** Nav uses 🌱📊🚜🌾🌡️📡⚡⚙️. | `MainLayout.tsx` `navigation[]` | Reads as unfinished; inconsistent rendering across OSs; not accessible. |
| C4 | **Dependency bloat / mixed signals.** `@mui/material`, `@emotion/*`, `@heroicons/react`, `@mui/icons-material` installed; MUI/heroicons used in ≤1 file, mui-icons in 0. | `package.json` vs grep | Bundle weight, onboarding confusion, "which pattern do I copy?" |
| C5 | **No formal primitives.** Dropdowns/dialogs/menus/tabs are hand-rolled; 9 files use inline `style={{}}`. | grep across `src` | Inconsistent behavior, focus traps, keyboard nav, and ARIA are hit-or-miss. |
| C6 | **CRUD screens are forms-first, not insight-first.** List/Create/Edit/Details repeated 8× with little data-density or real-time emphasis. | `containers/*` | Functional but generic; doesn't feel like an IoT monitoring product. |
| C7 | **Debug routes in the app shell.** `SocketTester`, `DeviceStateTest`, `/debug/*`. | `routes/routes.tsx`, `routes/index.tsx` | Dev cruft shipping to users. |

---

## 3. Approaches considered

Three ways to reach the goal; **chosen approach in bold.**

**A. ✅ Custom Tailwind design system, shadcn-style (CHOSEN).**
Own a small set of components composed from **Radix UI primitives** (accessible behavior for menus, dialogs, tabs, tooltips, popovers) styled with Tailwind + **class-variance-authority (CVA)** variants, driven by a formal **CSS-variable token layer**. Drop MUI/emotion.
- *Why it wins:* 75/77 files already use Tailwind, so this is the lowest-friction path to consistency; maximum control over a distinctive (non-generic) look; near-zero runtime; accessibility handled by Radix; scales cleanly.
- *Cost:* we build and maintain the components ourselves (mitigated — shadcn gives copy-in starting points).

**B. Adopt a full component library (MUI properly, or Mantine/Chakra).**
- *Rejected:* pivots away from the Tailwind investment, adds runtime weight, and themed libraries are hard to make look distinctive — risks the generic feel we're trying to escape. MUI is already present but essentially unused, so "properly adopting" it is a net-new migration anyway.

**C. Incremental polish of existing custom components.**
- *Rejected:* leaves C1/C2/C5 in place. Caps how far usability/professionalism can go; won't credibly compete with SOTA.

**Visual direction (chosen):** **Modern neutral base + agri accent.** Neutral gray surfaces, strong typographic hierarchy, generous spacing, and a single confident brand accent derived from the existing `leaf` green. Keeps domain identity while reading crisp and professional. The `soil`/`wheat` hues are demoted from UI chrome to **data-visualization / categorical** roles (sensor types, series colors), where multi-hue earthy palettes actually shine.

---

## 4. The design system (foundation)

### 4.1 Token architecture
Move from Tailwind color names used ad hoc → a **two-tier token system**:

- **Tier 1 — primitives:** the raw scales (`leaf.50…900`, neutral gray scale, `soil`/`wheat`/`sky` for data).
- **Tier 2 — semantic tokens as CSS variables**, themed for light/dark in one place:
  `--bg`, `--bg-subtle`, `--surface`, `--surface-raised`, `--border`, `--text`, `--text-muted`, `--primary`, `--primary-fg`, `--success`, `--warning`, `--danger`, `--info`, `--ring`, plus data-viz `--chart-1…8`.
  Tailwind consumes these via `theme.extend.colors` using `rgb(var(--token) / <alpha-value>)`, so dark mode = swap variables, not classes everywhere.

This formalizes the semantic layer MainLayout already gestures at (`bg-card`, `text-textPrimary`) and kills the hardcoded hex in Button (C1).

### 4.2 Core primitives (Radix + CVA)
Build/replace, in this order of leverage:
`Button`, `Input`/`Textarea`/`Field` (label+error+hint), `Select`, `Checkbox`/`Switch`/`Radio`, `Dialog`/`Drawer`/`Sheet`, `DropdownMenu`, `Tabs`, `Tooltip`, `Toast` (wrap existing react-toastify or move to Radix), `Badge`/`Tag`/`StatusDot`, `Card`, `Table`/`DataTable`, `Skeleton`, `EmptyState`, `Pagination`, `Breadcrumb`, `Avatar`.

### 4.3 Foundations
- **Type scale:** one modern sans (e.g. Inter/Geist) with a defined scale (xs→3xl) and line-heights; replace ad hoc text sizing.
- **Spacing & radius:** standardize on Tailwind's 4px scale; define radius tokens (`sm/md/lg/xl`) — pick one family (rounded-lg default) for a coherent feel.
- **Elevation:** a 3-step shadow system (flat / raised / overlay) as tokens.
- **Icons:** adopt **lucide-react** (consistent, tree-shakeable line icons); remove emoji nav (C3) and heroicons/mui-icons (C4).
- **Motion:** add `framer-motion` *or* Tailwind transitions with a tokenized duration/easing scale; reserve motion for state changes (value updates, route transitions, drawer open) — never gratuitous.

### 4.4 Documentation
A living `/components` route (dev-only) or Storybook-lite page showing every primitive, its variants, and states — so the team copies the right pattern (fixes C5/C6 drift).

---

## 5. Information architecture & navigation

- **Collapsible rail sidebar** (icon-only ↔ expanded) on desktop; **bottom tab bar + sheet** on mobile for the primary 4–5 destinations (Dashboard, Telemetry, Devices, Sensors, more-menu).
- **Global top bar:** org switcher (exists — `OrganizationSelector`), global search/command palette (⌘K) for sensors/devices/areas, notifications, user menu, dark-mode toggle, language.
- **Breadcrumbs** on all List→Details→Edit flows.
- Replace emoji nav with lucide icons + labels; active-state via route match (keep current `isActive`).
- Remove `/debug/*` and test components from the production router behind an env guard (C7).

---

## 6. Mobile-first & responsiveness strategy

- **Delete JS breakpoint logic (C2).** Replace `window.innerWidth`/`isMobile` with Tailwind responsive utilities and **CSS container queries** for component-level responsiveness (cards, tables). Keep a single `useMediaQuery` hook only where behavior (not layout) must branch.
- **Design order: 360px → up.** Every screen starts as a single-column, thumb-reachable layout; progressively enhance to multi-column at `md`/`lg`/`xl`/`2xl`.
- **Tables → responsive patterns:** on phones, data tables become stacked cards or horizontally-scrollable with a frozen key column.
- **Touch targets** ≥ 44px; primary actions reachable in the bottom third on mobile.
- **Control-room mode (2xl+):** denser grids, bigger live tiles for wall displays.

---

## 7. Key screens (redesign intent)

### 7.1 Real-time Telemetry Dashboard (hero screen)
The flagship — this is where "IoT product" is won or lost.
- **Live tiles / sensor cards** with current value, unit, trend sparkline, connection dot, and last-updated relative time; subtle flash on update (the `isNew` flag already exists in `telemetryData`).
- **Status semantics:** online/offline/stale/alarm as tokenized `StatusDot`/`Badge`, consistent everywhere.
- **Density toggle** (comfortable/compact) and layout toggle (grid/table).
- **Charts:** introduce a charting lib (Recharts or visx) for time-series; map series to the `--chart-*` tokens (soil/wheat/sky find their home here).
- **Empty/skeleton/error states** for every async region (snapshot loading, socket disconnected banner).
- Hook the existing snapshot work (`useDashboardSnapshot` + Option A sockets) into these tiles so they're populated on load, not `-`.

### 7.2 Device / Sensor Details
- Overview header (identity, status, area/org, quick actions) + tabbed content (Live, History, States/Variables, Settings, Rules).
- Real-time state controls for devices (toggles/selects reflecting `device-state-change`).

### 7.3 List screens (×8)
- Shared `DataTable` with sort, filter, column visibility, pagination, bulk actions, and row-level status.
- Consistent page header (title, breadcrumb, primary action, search/filter bar).

### 7.4 Create/Edit forms
- Shared `Field`/`Form` primitives with inline validation, section grouping, sticky save bar, and unsaved-changes guard.

### 7.5 Auth
- Clean split-screen (brand panel + form), proper focus/error handling — cheap, high-visibility win for "professional look."

---

## 8. Accessibility (WCAG 2.1 AA target)
- Radix gives keyboard nav, focus management, and ARIA for overlays/menus.
- Enforce **contrast** when picking the neutral+accent tokens (validate light & dark).
- Visible focus rings via `--ring`; no color-only status (pair dot + label/icon).
- Respect `prefers-reduced-motion`. Add an a11y lint pass (`eslint-plugin-jsx-a11y`).

---

## 9. Performance & scalability
- **Bundle:** remove MUI/emotion/heroicons/mui-icons (C4); measure with `rollup-plugin-visualizer`. Expect a meaningful drop.
- Keep route-level code-splitting (already via `lazy`); add component-level where heavy (charts).
- Virtualize long tables/lists (`@tanstack/react-virtual`).
- Token-driven theming = O(1) dark-mode cost (swap variables, no re-render storms).
- **Scalability guardrails:** every new screen is assembled from documented primitives; a lint rule / PR checklist discourages inline styles and raw hex. The `/components` gallery is the single source of truth.

---

## 10. Phased roadmap

Sequenced so value ships continuously and the app is never half-broken. Each phase is independently shippable.

**Phase 0 — Foundations (enabling, low user-visible change)**
- Token layer (CSS vars + Tailwind wiring), type scale, spacing/radius/elevation, lucide icons, fonts.
- Remove MUI/emotion/heroicons; add Radix, CVA, (charting lib), `clsx`/`tailwind-merge` (already present).
- Stand up the `/components` gallery.
- *Exit:* tokens live; dark mode via variables; zero hardcoded hex in new code.

**Phase 1 — Core primitives + app shell**
- Rebuild `Button`, `Field`/`Input`/`Select`, `Dialog`/`Drawer`, `DropdownMenu`, `Tabs`, `Badge`/`StatusDot`, `Card`, `Toast`.
- New responsive shell: rail sidebar + mobile tab bar + top bar + command palette; kill JS breakpoints; remove debug routes.
- *Exit:* every screen inherits the new shell and primitives; `Button` C1 and C2/C3/C7 resolved.

**Phase 2 — Hero: Telemetry dashboard + device/sensor details**
- Live tiles, charts, status system, density/layout toggles, skeleton/empty/error states.
- Wire snapshot + sockets into tiles.
- *Exit:* the monitoring experience is demonstrably SOTA-competitive.

**Phase 3 — Breadth: list/detail/form rollout across the other 6 areas**
- Shared `DataTable` + `Form` patterns applied to Organizations, Areas, Sensors, Devices, RuleEngine, Auth.
- *Exit:* visual and interaction consistency across all 8 areas.

**Phase 4 — Polish & hardening**
- Motion pass, a11y audit (AA), bundle/perf pass, virtualization, control-room (2xl) density, cross-device QA.
- *Exit:* measured against success metrics (§12).

---

## 11. Risks & mitigations
- **Half-migrated drift** → phases are shippable; old and new components coexist behind the shared shell; migrate screen-by-screen.
- **Scope creep into features** → plan explicitly excludes new product features; changes are presentational/interaction only.
- **Token churn breaking many files** → introduce semantic tokens as *additive* aliases first; migrate call sites incrementally; codemod where possible.
- **Charting/lib choice lock-in** → wrap charts behind a thin internal component so the lib can be swapped.

---

## 12. Success metrics
- **Consistency:** 0 inline-style/raw-hex in components (lint-enforced); 100% of screens on the shared shell.
- **Performance:** JS bundle reduced after dependency cleanup; Lighthouse Performance & Best-Practices ≥ 90 on mobile; no layout shift from JS resize.
- **Accessibility:** WCAG 2.1 AA on key flows; keyboard-navigable overlays; contrast validated in both themes.
- **Usability:** key task (find a sensor's live value from cold load) in fewer steps; real values visible on load, not `-`.
- **Adoption:** new screens built only from documented primitives.

---

## 13. Open decisions for you
1. **Charting library:** Recharts (fast, simple) vs visx (flexible, more work) vs ECharts (powerful, heavier). _Recommend Recharts to start._
2. **Motion:** framer-motion (richer, +bundle) vs Tailwind transitions only (lean). _Recommend Tailwind-first, framer only where it earns it._
3. **Font:** Inter / Geist / other brand preference?
4. **Phase 0+1 as the first milestone to greenlight**, or do you want a clickable prototype of the hero Telemetry screen first to validate the look before the foundation work?

---

_Next step after approval: turn the greenlit phases into a concrete implementation plan (task breakdown, file-level changes, migration order)._
