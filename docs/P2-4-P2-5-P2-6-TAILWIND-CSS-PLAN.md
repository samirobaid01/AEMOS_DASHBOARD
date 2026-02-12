# P2-4 / P2-5 / P2-6 Execution Plan

Execution plan for **Tailwind migration of remaining features** (P2-4), **removal of redundant CSS** (P2-5), and **consolidation of form/button classes** (P2-6) from [CODEBASE_IMPROVEMENT_PLAN.md](./CODEBASE_IMPROVEMENT_PLAN.md).

---

## Overview

| Task   | Goal |
|--------|------|
| **P2-4** | Migrate sensors, organizations, areas, ruleEngine (and remaining modules) from inline styles to Tailwind. One feature per PR. |
| **P2-5** | After Tailwind migration, remove custom utility classes from `index.css` that are now redundant; keep only what is still referenced. |
| **P2-6** | Long term: move `.form-input`, `.form-label`, `.btn*` into Tailwind `@apply` or into shared components that use Tailwind. |

**Prerequisites:** Tailwind is enabled (P0-6), theme tokens are in `tailwind.config.js` (P0-7), and `cn()` exists (P1-15). At least one feature already migrated to Tailwind (P1-9, e.g. devices) is helpful as reference.

---

## P2-4: Tailwind Migration – Remaining Features

### Principle

- Replace **inline `style={{ ... }}`** and theme-driven object styles with **Tailwind classes** (including theme tokens: `bg-surface`, `text-textPrimary`, `dark:bg-surface-dark`, etc.).
- Use **`cn()`** for merging `className` with component defaults in shared components.
- **No behavior or layout change**; visual result should match current UI (including dark mode).
- **One feature per PR** for reviewability and easy rollback.

### Feature order (suggested)

Order balances size, dependencies, and risk. Containers for each feature should be migrated in the same PR as their feature components.

| Order | Feature        | Scope (components + containers) | Rough size |
|-------|----------------|-----------------------------------|------------|
| 1     | **Sensors**    | `components/sensors/*`, `containers/Sensors/*` | Medium (SensorForm, SensorDetails heaviest) |
| 2     | **Organizations** | `components/organizations/*`, `containers/Organizations/*` | Medium–Large (OrganizationDetails, Edit, Create) |
| 3     | **Areas**      | `components/areas/*`, `containers/Areas/*` | Medium |
| 4     | **Rule engine** | `components/ruleEngine/*`, `containers/RuleEngine/*` (if any) | Medium (RuleDetails, RuleForm, dialogs) |
| 5     | **Dashboard**  | `components/dashboard/*`, `containers/Dashboard/*` | Small–Medium |
| 6     | **Auth**       | `components/auth/*`, `containers/Auth/*` | Small–Medium |
| 7     | **Layout**     | `components/layout/*` (e.g. MainLayout) | Small |
| 8     | **Common**     | Remaining `components/common/*` that still use inline styles (Modal, DynamicKeyValueInput, DeviceStateTest, etc.) | Medium (many small files) |

### Per-feature checklist (use per PR)

- [ ] List all files in the feature (components + related containers).
- [ ] For each file: replace inline `style` objects with Tailwind classes.
  - Use semantic tokens from `tailwind.config.js`: `bg-surface`, `text-textPrimary`, `border-border`, `dark:...` where needed.
  - Use standard Tailwind for layout/spacing: `flex`, `gap-4`, `p-4`, `rounded-lg`, etc.
- [ ] Ensure `cn()` is used where a component accepts `className` and merges with defaults.
- [ ] Preserve dark mode behavior (check `dark:` variants and any `useTheme()`/`useThemeColors()` usage; prefer Tailwind tokens where possible).
- [ ] Remove unused `useThemeColors` / `useTheme` and style objects from the file if they are no longer needed.
- [ ] Manual pass: compare before/after in light and dark mode; fix any regressions.
- [ ] Run lint and build.

### Files to migrate (by feature)

- **Sensors:** SensorList, SensorForm, SensorFilter, SensorDetails, SensorItem, EmptyState; containers SensorEdit, SensorDetails.
- **Organizations:** OrganizationList, OrganizationFilter, OrganizationDetails, OrganizationItem, OrganizationEdit, OrganizationCreate, EmptyState; containers OrganizationEdit.
- **Areas:** AreaList, AreaListComponent, AreaForm, AreaFilter, AreaItem, AreaEdit, AreaDetails, AreaCreate, AreaFilter, EmptyState; containers AreaEdit.
- **Rule engine:** RuleList, RuleItem, RuleFilter, RuleDetails, RuleForm, RuleEdit, RuleCreate, NodeDialog, ActionDialog, EmptyState.
- **Dashboard:** DashboardHeader, StatCard, EntityList, AdminTools; containers Dashboard, Settings.
- **Auth:** AuthCard; containers Login, Signup, ForgotPassword, Profile.
- **Layout:** MainLayout.
- **Common:** Modal, DynamicKeyValueInput, DeviceStateTest, FormField, FormActions, Select, Input, Toggle, LoadingScreen, Walkthrough, Error, PermissionDenied, etc. (only those still using inline styles).

---

## P2-5: Remove Redundant CSS from index.css

### When to do it

**After** P2-4 is complete (all features migrated to Tailwind). Doing it earlier may break pages that still rely on custom classes.

### Steps

1. **Audit `src/index.css`**
   - List every custom class (e.g. `.dashboard-container`, `.form-input`, `.btn-primary`, `.flex`, `.rounded-lg`, etc.).
2. **Find references**
   - In the repo: `grep -r "className=[\"'].*class-name" src` (and similar for each custom class). Use actual class names (e.g. `form-input`, `btn-primary`).
   - Confirm which of these are still used in JSX/TSX.
3. **Categorize**
   - **Still referenced:** Keep (or migrate to Tailwind in P2-6 if it’s form/button).
   - **Unreferenced:** Safe to remove (redundant with Tailwind or dead code).
4. **Remove redundant blocks**
   - Delete unused custom utilities and duplicates of Tailwind (e.g. duplicate `.flex`, `.items-center` if Tailwind already provides them).
   - Keep base styles (e.g. `*`, `body`) and any class that is still referenced until P2-6.
5. **Document**
   - In this doc or in CODEBASE_IMPROVEMENT_PLAN: list what was removed and what was kept (and why).

### What to keep (until P2-6)

- Base/reset and `body` styles.
- Any custom class that is still referenced in the codebase and not yet replaced by Tailwind or a component (e.g. `.form-input`, `.form-label`, `.btn*` if still used).
- Dashboard-specific layout classes if they are still used and not yet converted to Tailwind (e.g. `.dashboard-container`, `.dashboard-grid`); otherwise migrate to Tailwind and then remove.

---

## P2-6: Consolidate Form/Button Classes

**Chosen approach: Option A** – Replace all usages of legacy form/button classes with shared components, then remove those classes from `index.css`.

### Goal

Eliminate legacy `.form-input`, `.form-label`, and `.btn*` from `index.css` by replacing every usage with shared **`Button`**, **`Input`**, and **`FormField`** from `common/`, then deleting the class definitions.

### Current state (from index.css)

- **.form-input** – width, padding, border, radius, shadow, focus styles.
- **.form-label** – block, font size/weight, color, margin.
- **.btn** – padding, radius, font weight, transition, focus.
- **.btn-primary**, **.btn-secondary**, **.btn-danger** – colors and hover.

These are **defined** in `index.css` but may **not be used** in TSX anymore (app uses shared Button and FormField). Confirm with a codebase grep before changing.

### Steps (Option A)

1. Grep for `form-input`, `form-label`, `btn`, `btn-primary`, `btn-secondary`, `btn-danger` in `src`.
2. For every usage:
   - Replace with `<Input />` or FormField-wrapped input, and `<Button variant="primary" />` (or `secondary` / `danger`) from `common/`.
3. When no file references these classes anymore, **remove** `.form-input`, `.form-label`, `.btn*` from `index.css` (completing P2-5 for these).

### Fallback (Option B)

Only if class names must be kept (e.g. legacy or external HTML): redefine them in `index.css` with Tailwind `@apply` and theme tokens, and document as legacy. New code should still use shared components.

---

## PR Sequence Summary

| PR   | Content |
|------|--------|
| P2-4.1 | Tailwind: Sensors |
| P2-4.2 | Tailwind: Organizations |
| P2-4.3 | Tailwind: Areas |
| P2-4.4 | Tailwind: Rule engine |
| P2-4.5 | Tailwind: Dashboard |
| P2-4.6 | Tailwind: Auth |
| P2-4.7 | Tailwind: Layout |
| P2-4.8 | Tailwind: Common (remaining) |
| P2-5   | Remove redundant CSS from index.css (after all P2-4 PRs) |
| P2-6   | Consolidate form/button: replace usages with components, then remove .form-* and .btn* from index.css |

---

## Completion Criteria

- **P2-4:** All listed features use Tailwind for layout and theming; no (or minimal) inline `style` in those modules; dark mode unchanged.
- **P2-5:** `index.css` no longer contains custom utility classes that duplicate Tailwind or are unreferenced; remaining custom classes are documented.
- **P2-6:** No remaining use of `.form-input`, `.form-label`, `.btn*` in the app; styling lives in Tailwind and shared components; those classes removed from `index.css`.

---

## P2-5 / P2-6 Completion Notes

**P2-5 (index.css cleanup):** Completed. `index.css` was audited; all custom utility blocks that duplicated Tailwind or were unreferenced were removed. Removed: leaf/soil/wheat/sky color classes (covered by `tailwind.config.js` theme.extend.colors), `.backdrop-blur-sm`, `.bg-white/90`, `.divide-y` and `.divide-{color}-100` (Tailwind provides these), and dark-mode overrides for those. Kept: base reset (`*`), `body` (font, background, color, line-height, min-height). `backdrop-blur-sm` and divide/color classes used in components are now provided by Tailwind utilities.

**P2-6 (form/button consolidation):** No action required. Grep of `src` for `form-input`, `form-label`, `btn-primary`, `btn-secondary`, `btn-danger` found no usages. The current `index.css` does not define `.form-*` or `.btn*` (they were either never added or already removed). Form and button styling is already via shared components (`Button`, `Input`, `FormField`, etc.) and Tailwind; no legacy class usages remain.

