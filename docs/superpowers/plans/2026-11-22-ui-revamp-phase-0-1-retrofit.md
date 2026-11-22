# UI Revamp — Phase 0/1 Retrofit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retrofit the design-system foundation (Phase 0) and app-shell/primitive layer (Phase 1) *underneath* the already-shipped telemetry dashboard, so the whole app runs on one CSS-variable token system with accessible primitives — without breaking the 56 files already using semantic color classes.

**Architecture:** Introduce semantic tokens as **CSS variables** that resolve to the *exact values currently hardcoded* in `tailwind.config.js`, wire Tailwind's `theme.extend.colors` to `rgb(var(--token) / <alpha-value>)`, and swap variables under `.dark` instead of per-class `dark:` variants. Because every token keeps a `-dark` alias pointing at the same variable, all existing `bg-card dark:bg-card-dark` call sites keep working unchanged (additive-alias migration, per spec §11). Then rebuild `Button` on Tailwind + CVA, retrofit the existing `ui/` and telemetry components onto the tokens, replace the JS-breakpoint shell and emoji nav, and drop the unused MUI/heroicons/emotion dependencies.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind 3.4 (`darkMode: 'class'`), `class-variance-authority` (new), `clsx` + `tailwind-merge` (present, via `src/utils/cn.ts`), `lucide-react` (present), `recharts` (present).

**Spec:** `docs/ui-revamp/UI-REVAMP-PLAN.md` (Phases 0 and 1; problems C1–C7; §4 design system; §11 risk mitigations; §12 success metrics).

## Global Constraints

- Tailwind **3.4** syntax only; `darkMode: 'class'` stays — dark mode is driven by `src/context/ThemeContext.tsx` toggling `.dark` on the root.
- **No call-site breakage:** every existing semantic class (`bg-background`, `bg-card`, `bg-surface`, `text-textPrimary`, `text-textSecondary`, `text-textMuted`, `border-border`, `bg-primary`, `bg-surfaceHover`, `success`/`danger`/`warning`/`info` families) and its `-dark` variant must keep resolving after Task 1. Tokens are **added**, not renamed.
- **No new hardcoded hex** in `src/components/**` or `src/containers/**` (spec §12); existing hex is migrated, not duplicated.
- Preserve the `Button` public prop API exactly: `variant: 'primary'|'secondary'|'danger'|'outline'`, `size: 'sm'|'md'|'lg'`, `isLoading`, `fullWidth`, `trackingId` (fires `MixpanelService`), `leftIcon`, `rightIcon`, `icon`, `children`, plus native button attrs. 50 files import it.
- Icons: **lucide-react** only. No emoji in product chrome (C3). No `@heroicons/*`, `@mui/*`, `@emotion/*` imports remain at end of plan (C4).
- Keep en/es i18n intact — all visible strings continue through `t(...)`.
- No unit-test runner exists. Verification uses `npm run build` (runs `tsc -b` then `vite build`), `npm run lint` (eslint), **grep-based guard checks**, and **visual confirmation at the `/components` gallery and `npm run dev`**.

## Review Focus

Inputs/conditions the spec implies that no task's happy path exercises — each gets a guard or a verification step in its owning task:

- **Dark-mode parity after token swap** — every screen must look identical before/after Task 1 in *both* themes; a wrong variable value silently shifts a color. (Task 1: side-by-side visual check of 3 screens in both themes.)
- **A `-dark` alias left undefined** — a missed token breaks `dark:bg-x-dark` as an unknown class (no error, just unstyled). (Task 1: grep every `dark:*-dark` class in use against defined aliases.)
- **Button consumer relying on inline-style override** — any of the 50 callers passing `style={{}}` expecting to merge with the old inline styles. (Task 4: grep callers for `style=` and confirm they still render.)
- **`prefers-reduced-motion`** — new flash/pulse/transition on tokens must be suppressed for reduced-motion users (spec §8). (Task 5/6: motion gated behind `motion-reduce:` utilities.)
- **Touch target < 44px on mobile shell** — the rebuilt nav/drawer must keep ≥44px hit areas (spec §6). (Task 8: visual check at 360px width.)

---

### Task 1: CSS-variable semantic token layer + Tailwind wiring

Introduce the two-tier token system (spec §4.1). Primitive scales (`ink/leaf/soil/wheat/sky`) stay as-is. Semantic names become CSS variables, defined once for light and swapped under `.dark`, with `-dark` aliases preserved for back-compat.

**Files:**
- Modify: `src/index.css` (add `:root` + `.dark` variable blocks; replace hardcoded `body` background/color at lines 11-19 with `var(--bg)`/`var(--text)`)
- Modify: `tailwind.config.js:74-95` (rewire the semantic color block to `rgb(var(--token) / <alpha-value>)`; keep primitive scales lines 14-73 untouched)

**Interfaces:**
- Produces: CSS variables `--bg, --bg-subtle, --surface, --surface-raised, --border, --text, --text-muted, --text-secondary, --primary, --primary-fg, --success, --warning, --danger, --info, --ring` and data-viz `--chart-1 … --chart-8`, as space-separated RGB triples (e.g. `--surface: 255 255 255;`). Tailwind tokens consumed by all later tasks: `bg-surface`, `bg-surface-raised`, `bg-card`, `bg-background`, `border-border`, `text-textPrimary`, `text-textSecondary`, `text-textMuted`, `bg-primary`, `ring-ring`, and `chart-1…8` for series colors.

- [ ] **Step 1: Write the guard test (parity grep)**

Create `scripts/check-tokens.sh` that greps all `dark:*-dark` utility classes used in `src/**` and asserts each base token has a defined entry in `tailwind.config.js`. Also assert zero occurrences of the semantic hex values (`#f0f9f0`, `#1f2937`, `#16a34a`, `#e5e7eb`, `#ef4444`, `#eab308`, `#3b82f6`) remain **in `tailwind.config.js`** outside the `rgb(var(...))` form.

- [ ] **Step 2: Run the guard to verify it currently fails**

Run: `bash scripts/check-tokens.sh`
Expected: FAIL — semantic hex still present in `tailwind.config.js`.

- [ ] **Step 3: Define the variables in `src/index.css`**

Add after `@tailwind utilities;`. Values are the *current* ones from `tailwind.config.js`, converted to space-separated RGB. Pin these exactly:

```css
:root {
  --bg: 240 249 240;          /* #f0f9f0 */
  --bg-subtle: 248 250 252;   /* ink-50 */
  --surface: 255 255 255;     /* #ffffff */
  --surface-raised: 255 255 255;
  --surface-hover: 240 249 240;
  --border: 229 231 235;      /* #e5e7eb */
  --text: 31 41 55;           /* #1f2937 */
  --text-secondary: 75 85 99; /* #4b5563 */
  --text-muted: 107 114 128;  /* #6b7280 */
  --primary: 22 163 74;       /* #16a34a */
  --primary-fg: 255 255 255;
  --success: 22 163 74;
  --warning: 234 179 8;       /* #eab308 */
  --danger: 239 68 68;        /* #ef4444 */
  --info: 59 130 246;         /* #3b82f6 */
  --ring: 16 185 129;         /* leaf-500 */
  --chart-1: 16 185 129; --chart-2: 162 123 84; --chart-3: 14 165 233;
  --chart-4: 214 137 30; --chart-5: 100 116 139; --chart-6: 139 101 68;
  --chart-7: 125 211 252; --chart-8: 237 192 96;
}
.dark {
  --bg: 17 24 39;             /* #111827 */
  --bg-subtle: 15 23 42;
  --surface: 31 41 55;        /* #1f2937 */
  --surface-raised: 31 41 55;
  --surface-hover: 55 65 81;  /* #374151 */
  --border: 55 65 81;         /* #374151 */
  --text: 249 250 251;        /* #f9fafb */
  --text-secondary: 209 213 219;
  --text-muted: 156 163 175;
  --primary: 22 163 74;
  --primary-fg: 255 255 255;
  --success: 16 185 129;
  --warning: 245 158 11;
  --danger: 239 68 68;
  --info: 59 130 246;
  --ring: 16 185 129;
}
```
Then change `body` (lines 11-19) `background-color`/`color` to `rgb(var(--bg))` / `rgb(var(--text))`.

- [ ] **Step 4: Rewire `tailwind.config.js` semantic colors**

Replace each `{ DEFAULT: '#hex', dark: '#hex' }` at lines 74-95 with `'rgb(var(--token) / <alpha-value>)'`, and **add a `-dark` alias key** pointing at the same `rgb(var(--token)/…)` so `dark:bg-card-dark` still resolves. Add a `chart` key: `{ 1: 'rgb(var(--chart-1)/<alpha-value>)', … 8: … }`. Example mapping for `card`: `card: 'rgb(var(--surface-raised) / <alpha-value>)'`, `'card-dark': 'rgb(var(--surface-raised) / <alpha-value>)'`.

- [ ] **Step 5: Run the guard + build**

Run: `bash scripts/check-tokens.sh && npm run build`
Expected: guard PASS; build PASS.

- [ ] **Step 6: Visual parity check (both themes)**

Run: `npm run dev`. Open `/dashboard`, `/telemetry`, `/sensors`. Toggle dark mode. Expected: identical appearance to pre-change (screenshot compare); no unstyled regions.

- [ ] **Step 7: Commit**

```bash
git add src/index.css tailwind.config.js scripts/check-tokens.sh
git commit -m "feat(ui): add CSS-variable semantic token layer (Phase 0)"
```

---

### Task 2: Typography, radius & elevation tokens

Complete the Phase 0 foundations (spec §4.3): standardize radius and a 3-step shadow scale as tokens. Inter font is already wired (`tailwind.config.js:10-12`, `index.css:12`) — confirm only.

**Files:**
- Modify: `tailwind.config.js` (`theme.extend.borderRadius`, `theme.extend.boxShadow`, `theme.extend.fontSize`)

**Interfaces:**
- Produces: radius tokens `rounded-sm/md/lg/xl` (lg as default family), elevation `shadow-flat/raised/overlay`, and a confirmed type scale `text-xs…text-3xl` with line-heights. Consumed by Tasks 4–8.

- [ ] **Step 1: Add `borderRadius`, `boxShadow`, and `fontSize` extensions** in `tailwind.config.js` — three shadow steps (flat/raised/overlay) and a radius family with `lg` as the coherent default. Keep values Tailwind-idiomatic.
- [ ] **Step 2: Verify build**
  Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Commit**
  ```bash
  git add tailwind.config.js
  git commit -m "feat(ui): add radius and elevation tokens"
  ```

---

### Task 3: `/components` gallery route (dev-only)

Stand up the living primitives gallery (spec §4.4) — the verification surface every later task renders into, so drift (C5/C6) is visible.

**Files:**
- Create: `src/containers/ComponentsGallery/ComponentsGallery.tsx`
- Modify: `src/routes/routes.tsx` (add `/components` route behind `import.meta.env.DEV`)

**Interfaces:**
- Consumes: any exported primitive. Imports from `src/components/ui` and `src/components/common/Button`.
- Produces: route `/components`, rendered only when `import.meta.env.DEV` is true.

- [ ] **Step 1: Create `ComponentsGallery`** rendering sections (one per primitive) showing each variant/size/state against both light and dark backgrounds. Start with what exists today (`Badge`, `Card`, `Gauge`, `KpiTile`, `Sparkline`, `StatusDot`, `Button`). Later tasks append their primitives here.
- [ ] **Step 2: Register the route guarded by `import.meta.env.DEV`** in `routes.tsx` so it never ships to production.
- [ ] **Step 3: Verify**
  Run: `npm run dev` → open `/components`. Expected: every current primitive renders in both themes. Run `npm run build` and confirm the route is tree-shaken / absent from the prod bundle (grep built output for "ComponentsGallery").
- [ ] **Step 4: Commit**
  ```bash
  git add src/containers/ComponentsGallery src/routes/routes.tsx
  git commit -m "feat(ui): add dev-only /components gallery"
  ```

---

### Task 4: Rebuild `Button` on Tailwind + CVA (fixes C1)

Replace the inline-`CSSProperties`/hardcoded-hex Button with a CVA-driven, token-styled component. Same public API; drops `useTheme`/`useThemeColors` for CSS-class styling so hover/focus/disabled states come from Tailwind and dark mode comes free from tokens.

**Files:**
- Add dependency: `class-variance-authority`
- Modify: `src/components/common/Button/Button.tsx` (full rewrite of internals; **props unchanged**)
- Modify: `src/containers/ComponentsGallery/ComponentsGallery.tsx` (ensure all 4 variants × 3 sizes × loading/disabled shown)

**Interfaces:**
- Consumes: tokens from Task 1 (`bg-primary`, `text-primary-fg`, `border-border`, `ring-ring`, `bg-danger`, `bg-surface-hover`), radius/elevation from Task 2.
- Produces: unchanged `Button` export + `ButtonProps` (signature in Global Constraints). `buttonVariants` CVA fn exported for reuse by link-styled-as-button cases.

- [ ] **Step 1: Write the guard test**
  Extend `scripts/check-tokens.sh` (or add `scripts/check-no-inline-style.sh`) to assert `src/components/common/Button/Button.tsx` contains **no** `React.CSSProperties`, no `style={` building object, and no `#` hex literal.
- [ ] **Step 2: Run guard — Expected: FAIL** (current Button has all three).
- [ ] **Step 3: Install CVA**
  Run: `npm install class-variance-authority`.
- [ ] **Step 4: Rewrite `Button` with `cva`** — variants map to token classes, sizes to spacing/height (≥44px touch target for `md`/`lg`), `isLoading` renders a spinner + `aria-busy`, focus-visible uses `ring-ring`. Compose final className with `cn()` so a caller's `className`/`style` prop still overrides. Keep `trackingId`→`MixpanelService` call and `leftIcon/rightIcon/icon` slots.
- [ ] **Step 5: Run guard + build + lint**
  Run: `bash scripts/check-no-inline-style.sh && npm run build && npm run lint` — Expected: all PASS; 50 consumers compile.
- [ ] **Step 6: Consumer spot-check**
  Run: `grep -rln "style=" $(grep -rl "common/Button" src)` and open the flagged screens at `npm run dev`; confirm no visual regression where callers passed `style`.
- [ ] **Step 7: Visual check** at `/components` — all variants/states correct in both themes, visible focus ring on keyboard tab.
- [ ] **Step 8: Commit**
  ```bash
  git add src/components/common/Button package.json package-lock.json scripts/ src/containers/ComponentsGallery
  git commit -m "feat(ui): rebuild Button on Tailwind+CVA tokens (fixes C1)"
  ```

---

### Task 5: Retrofit existing `ui/` primitives onto tokens + gallery

The six primitives built with the telemetry work (`Badge`, `Card`, `Gauge`, `KpiTile`, `Sparkline`, `StatusDot`) use raw palette classes (`bg-ink-100`, `bg-leaf-500`). Point their *surface/border/text* usage at semantic tokens so they theme consistently, keep categorical palette (`leaf/wheat/sky`) only for status/data meaning, and gate any pulse/flash behind `motion-reduce:`.

**Files:**
- Modify: `src/components/ui/Badge.tsx`, `Card.tsx`, `Gauge.tsx`, `KpiTile.tsx`, `Sparkline.tsx`, `StatusDot.tsx`
- Modify: `src/containers/ComponentsGallery/ComponentsGallery.tsx`

**Interfaces:**
- Consumes: Task 1 tokens, Task 2 radius/shadow. Exports in `src/components/ui/index.ts` unchanged.

- [ ] **Step 1:** Replace surface/border/text classes with semantic tokens (e.g. `Card` → `bg-card border-border text-textPrimary`); leave categorical status hues as-is; wrap any animation in `motion-safe:`/`motion-reduce:`.
- [ ] **Step 2:** Ensure each is shown in the gallery with all variants/states.
- [ ] **Step 3: Verify**
  Run: `npm run build` — PASS. At `/components`, confirm both themes + reduced-motion (DevTools "prefers-reduced-motion: reduce") suppresses flashes.
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/ui src/containers/ComponentsGallery
  git commit -m "refactor(ui): retrofit ui primitives onto semantic tokens"
  ```

---

### Task 6: Retrofit telemetry components onto tokens + chart tokens

Point the shipped telemetry surfaces (`SensorWidgetCard`, `TelemetryKpiRow`, `TelemetryToolbar`, `TelemetryTimeChart`, `TelemetryRow`, `TelemetryTable`) at semantic tokens, and map chart series colors to `--chart-1…8` (spec §7.1 — "soil/wheat/sky find their home here").

**Files:**
- Modify: `src/components/telemetry/*` (surface/border/text classes → tokens)
- Modify: `src/components/telemetry/TelemetryTimeChart.tsx` (series `stroke`/`fill` → `rgb(var(--chart-n))`)

**Interfaces:**
- Consumes: Task 1 tokens incl. `chart-1…8`. No prop changes — behavior identical.

- [ ] **Step 1:** Swap hardcoded/ad-hoc surface colors for tokens; set Recharts series colors from the `--chart-*` variables (read via CSS or a small `chartColors` helper in `src/utils/telemetryFormat.ts`).
- [ ] **Step 2: Verify**
  Run: `npm run build` — PASS. At `/telemetry`, confirm tiles + chart render identically, dark mode swaps chart gridlines/surfaces.
- [ ] **Step 3: Commit**
  ```bash
  git add src/components/telemetry
  git commit -m "refactor(telemetry): consume semantic + chart tokens"
  ```

---

### Task 7: Replace emoji nav with lucide icons (fixes C3)

**Files:**
- Modify: `src/components/layout/MainLayout.tsx:42-50` (and the `🌿` brand mark at the header)

**Interfaces:**
- Consumes: `lucide-react` (present). Produces: `navigation[]` entries carry a lucide icon component instead of an emoji string.

- [ ] **Step 1:** Map each destination to a lucide icon (e.g. Dashboard→`LayoutDashboard`, Telemetry→`Activity`, Organizations→`Building2`, Areas→`Map`, Sensors→`Thermometer`, Devices→`Radio`, Rules→`Zap`, Settings→`Settings`); render `<Icon className="w-5 h-5" aria-hidden />` with the `t(...)` label as the accessible name.
- [ ] **Step 2: Guard** — extend `scripts/check-tokens.sh` to assert no emoji codepoints remain in `MainLayout.tsx`.
- [ ] **Step 3: Verify** Run guard + `npm run build` — PASS. Visual check nav in both themes.
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/layout/MainLayout.tsx scripts/
  git commit -m "feat(ui): replace emoji nav with lucide icons (fixes C3)"
  ```

---

### Task 8: Responsive shell without JS breakpoints (fixes C2)

Remove `window.innerWidth`/resize-listener layout logic from `MainLayout.tsx`; drive the sidebar/drawer with Tailwind responsive utilities. Keep a single `useMediaQuery` hook **only** for behavior that must branch (e.g. closing the mobile drawer on route change), not for layout.

**Files:**
- Create: `src/hooks/useMediaQuery.ts` (returns boolean; `matchMedia`-based, SSR-safe)
- Modify: `src/components/layout/MainLayout.tsx` (drop `windowWidth`/`isMobile`/resize `useEffect` at lines 18-27; convert `isMobile ? … : …` layout branches to `md:` classes; drawer shown ≥`md`, off-canvas below)

**Interfaces:**
- Consumes: Task 4 `Button`, Task 7 icons. Produces: `useMediaQuery(query: string): boolean`.

- [ ] **Step 1: Write the guard** — assert `MainLayout.tsx` contains no `window.innerWidth` and no `resize` listener.
- [ ] **Step 2: Run guard — Expected: FAIL.**
- [ ] **Step 3:** Implement `useMediaQuery`; refactor `MainLayout` so the aside is `-translate-x-full md:translate-x-0` with a `md:static` rail and a mobile overlay toggled by state (not width). Ensure nav items and toggle are ≥44px tall.
- [ ] **Step 4: Run guard + build + lint** — all PASS.
- [ ] **Step 5: Visual check** at 360px, 768px, 1280px (DevTools responsive): single-column→rail transition is pure CSS, no re-render flash on resize, touch targets ≥44px.
- [ ] **Step 6: Commit**
  ```bash
  git add src/hooks/useMediaQuery.ts src/components/layout/MainLayout.tsx scripts/
  git commit -m "feat(ui): CSS-driven responsive shell, drop JS breakpoints (fixes C2)"
  ```

---

### Task 9: Remove debug routes from production router (fixes C7)

**Files:**
- Modify: `src/routes/routes.tsx:10-11,327-340` (remove `SocketTester`/`DeviceStateTest` lazy imports + `/debug/*` routes, or wrap in `import.meta.env.DEV`)
- Modify: `src/routes/index.tsx:1,5-8` (remove the `/debug/device-state-test` entry)

**Interfaces:** none produced.

- [ ] **Step 1: Guard** — assert no `/debug/` path and no `SocketTester`/`DeviceStateTest` import survives outside an `import.meta.env.DEV` block.
- [ ] **Step 2: Run guard — Expected: FAIL.**
- [ ] **Step 3:** Remove or DEV-guard the debug routes in both files.
- [ ] **Step 4: Run guard + build** — PASS; confirm `/debug/*` 404s in a `vite preview` prod build.
- [ ] **Step 5: Commit**
  ```bash
  git add src/routes/routes.tsx src/routes/index.tsx scripts/
  git commit -m "chore(ui): remove debug routes from production shell (fixes C7)"
  ```

---

### Task 10: Drop MUI / emotion / heroicons / mui-icons (fixes C4)

Only two files consume these: `ErrorBoundary.tsx` (MUI `Box`/`Typography`/`Button`) and `DynamicKeyValueInput.tsx` (heroicons `PlusIcon`/`MinusCircleIcon`). `@mui/icons-material` and `@emotion/*` have zero/transitive usage.

**Files:**
- Modify: `src/components/common/ErrorBoundary.tsx` (MUI → Tailwind markup + the new `Button`)
- Modify: `src/components/common/DynamicKeyValueInput/DynamicKeyValueInput.tsx:3,193,204` (heroicons → lucide `Plus`/`MinusCircle`)
- Modify: `package.json` (remove `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `@heroicons/react`)

**Interfaces:** none changed — both components keep their current props/behavior.

- [ ] **Step 1: Migrate `ErrorBoundary`** to token-styled Tailwind markup using the new `Button` for the retry action.
- [ ] **Step 2: Migrate `DynamicKeyValueInput`** icons to lucide (`<Plus className="h-4 w-4 mr-1.5" />`, `<MinusCircle className="h-6 w-6" />`).
- [ ] **Step 3: Guard** — `grep -rn "@mui\|@emotion\|@heroicons" src/` returns nothing.
- [ ] **Step 4: Uninstall + verify**
  Run: `npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled @heroicons/react && npm run build && npm run lint` — all PASS.
- [ ] **Step 5: Measure bundle** (spec §9/§12) — `npm run build` and record the dist JS size before/after in the commit body.
- [ ] **Step 6: Commit**
  ```bash
  git add src/components/common/ErrorBoundary.tsx src/components/common/DynamicKeyValueInput package.json package-lock.json
  git commit -m "chore(deps): remove MUI/emotion/heroicons; migrate 2 consumers (fixes C4)"
  ```

---

### Task 11: Enforce the consistency invariant (spec §12)

Make "0 inline-style / raw-hex in components, lint-enforced" real so Phase 0/1 can't regress as Phase 2/3 screens land.

**Files:**
- Modify: `eslint.config.js` (add `no-restricted-syntax` against hex-literal `style` objects, or wire the grep guard into `npm run lint`)
- Modify: `scripts/check-tokens.sh` → promote to a single `scripts/guard.sh` that runs all guards
- Modify: `package.json` scripts (`"guard": "bash scripts/guard.sh"`; optionally chain into `build`)

**Interfaces:** none produced; CI/local gate only.

- [ ] **Step 1:** Consolidate the per-task guards into `scripts/guard.sh` (no raw hex in `src/components/**`/`src/containers/**`, no inline `CSSProperties` in primitives, no emoji in chrome, no `@mui`/`@emotion`/`@heroicons`, no `window.innerWidth` in `MainLayout`).
- [ ] **Step 2:** Add `npm run guard`; document it in the plan's exit criteria.
- [ ] **Step 3: Verify** Run: `npm run guard && npm run build && npm run lint` — all PASS on the finished branch.
- [ ] **Step 4: Commit**
  ```bash
  git add eslint.config.js scripts/guard.sh package.json
  git commit -m "chore(ui): add consistency guard (no raw hex / inline style / dead deps)"
  ```

---

## Exit criteria (maps to spec Phase 0/1 exits)

- Tokens live as CSS variables; dark mode swaps variables, not classes (Task 1). ✅ C1 root cause removed.
- `Button` is token/CVA-based with zero hardcoded hex; 50 consumers unchanged (Task 4). ✅ **C1**
- Shell responsiveness is CSS-only; no `window.innerWidth` layout logic (Task 8). ✅ **C2**
- Nav uses lucide icons, no emoji (Task 7). ✅ **C3**
- MUI/emotion/heroicons removed; bundle measured down (Task 10). ✅ **C4**
- `/components` gallery is the single source of truth (Task 3) — begins fixing **C5/C6** drift.
- Debug routes gone from prod (Task 9). ✅ **C7**
- `npm run guard` enforces the §12 consistency metric (Task 11).

**Out of scope (later phases):** full Radix primitive set (Dialog/Select/Tabs/DropdownMenu/Tooltip), command palette (⌘K), bottom tab bar, `DataTable`/`Form` rollout across the other 6 areas (Phase 3), motion/a11y/virtualization hardening (Phase 4). Task 4's CVA pattern and Task 1's tokens are the substrate those build on.
