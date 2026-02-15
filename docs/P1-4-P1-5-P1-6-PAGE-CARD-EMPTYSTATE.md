# P1-4, P1-5, P1-6: Page, Card, and Shared EmptyState

**Scope:** P1-4 (Page/PageCard layout), P1-5 (shared Card), P1-6 (single shared EmptyState in common).  
**Goal:** Add reusable layout and empty-state building blocks in `common/`, and replace all per-feature EmptyState usage with the shared component.

---

## 1. P1-4: Page (PageCard) layout

### 1.1 Purpose

A max-width container for create/edit/detail screens with optional **title** and **description**. Ensures consistent padding and horizontal centering so screens don’t each define their own `max-w-3xl mx-auto` (or similar).

### 1.2 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | yes | Page content. |
| `title` | `string` | no | Optional heading at the top of the page. |
| `description` | `string` | no | Optional short description below the title. |
| `className` | `string` | no | Applied to the root wrapper. |

### 1.3 Behavior and layout

- **Root:** `div` with `max-w-[1400px] mx-auto`, padding `py-6 px-4 sm:px-6 lg:px-8`, plus optional `className`.
- **Title/description:** When present, rendered in a block above the children with spacing; title uses semantic heading styles, description uses muted text.

### 1.4 Location and export

- **Path:** `src/components/common/Page/Page.tsx`, `src/components/common/Page/index.ts`.
- **Export:** Default export; `PageProps` exported from `index.ts`.

### 1.5 Usage example

```tsx
import Page from '../common/Page';

<Page title={t('areas.editArea')} description={t('areas.editAreaDescription')}>
  <AreaEditComponent ... />
</Page>
```

Existing screens (e.g. AreaEdit, OrganizationEdit, Profile) that use ad-hoc `max-w-3xl mx-auto` can be refactored to wrap content in `<Page>` when desired.

---

## 2. P1-5: Shared Card component

### 2.1 Purpose

A reusable card with border, radius, shadow, padding, and optional **header**. Used for list items, detail blocks, and any bordered content block. Styling is Tailwind-only (semantic tokens: border, card, surface).

### 2.2 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | yes | Card body content. |
| `header` | `ReactNode` | no | Optional header block; when provided, rendered in a top section with a bottom border. |
| `className` | `string` | no | Applied to the root card wrapper. |

### 2.3 Behavior and layout

- **Root:** `div` with `rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden`, plus optional `className`.
- **Header:** When provided, a top section with padding and bottom border; uses `bg-surface` for slight contrast.
- **Body:** Content area with `p-4 sm:p-6`.

### 2.4 Location and export

- **Path:** `src/components/common/Card/Card.tsx`, `src/components/common/Card/index.ts`.
- **Export:** Default export; `CardProps` exported from `index.ts`.

### 2.5 Usage example

```tsx
import Card from '../common/Card';

<Card header={<h2 className="text-lg font-semibold">Section title</h2>}>
  <p>Card body content.</p>
</Card>
```

Use for list items, detail sections, or any block that should look like a card. Feature-specific cards (e.g. StatCard, AuthCard) can stay as-is; use shared Card for new or refactored blocks.

---

## 3. P1-6: Single shared EmptyState

### 3.1 Purpose

One EmptyState in `common/` with props: **title**, **description**, **actionLabel**, **onAction**, optional **icon**. Replaces the five per-feature EmptyState components (devices, areas, organizations, sensors, ruleEngine) so empty lists and empty search results share the same look and behavior.

### 3.2 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | yes | Main heading (e.g. "No devices", "No areas found"). |
| `description` | `string` | yes | Short explanation or hint. |
| `actionLabel` | `string` | yes | Label for the primary action button. |
| `onAction` | `() => void` | yes | Called when the user clicks the action button. |
| `icon` | `ReactNode` | no | Optional custom icon; when omitted, a default folder-style icon is shown. |
| `className` | `string` | no | Applied to the root wrapper. |

### 3.3 Behavior and layout

- **Root:** Centered flex column, padding `py-12 px-4`, rounded border, card background, shadow. Uses semantic tokens (border, card, textPrimary, textMuted) and supports dark mode.
- **Icon:** Renders `icon` if provided, otherwise a default SVG icon.
- **Title:** Rendered as an `h3` with medium font weight.
- **Description:** Muted text, max-width constrained for readability.
- **Button:** Common `Button` with `onClick={onAction}`; no Redux or API calls.

### 3.4 Location and export

- **Path:** `src/components/common/EmptyState/EmptyState.tsx`, `src/components/common/EmptyState/index.ts`.
- **Export:** Default export; `EmptyStateProps` exported from `index.ts`.

### 3.5 Migration (per-feature replacement)

| Feature | File(s) updated | Prop mapping |
|---------|-----------------|--------------|
| Devices | `DeviceList.tsx` | `message` → `title`, `onAddDevice` → `onAction` |
| Areas | `AreaList.tsx`, `AreaListComponent.tsx` | `message` → `title`, `onAction` unchanged |
| Organizations | `OrganizationList.tsx` | `message` → `title`, `onAction` unchanged |
| Sensors | `SensorList.tsx` | `message` → `title`, `onAction` unchanged |
| Rule engine | `RuleList.tsx` | `message` → `title`, `onAction` unchanged |

Feature index files (`areas/index.ts`, `organizations/index.ts`, `sensors/index.ts`, `ruleEngine/index.ts`) re-export EmptyState from `../common/EmptyState` so existing imports like `Areas.EmptyState` or `Sensors.EmptyState` continue to work. The root `components/index.ts` no longer exports renamed EmptyStates (SensorsEmptyState, OrganizationsEmptyState); use `common/EmptyState` or the feature barrel’s `EmptyState`.

### 3.6 Removed files

- `src/components/devices/EmptyState.tsx`
- `src/components/areas/EmptyState.tsx`
- `src/components/organizations/EmptyState.tsx`
- `src/components/sensors/EmptyState.tsx`
- `src/components/ruleEngine/EmptyState.tsx`

### 3.7 Usage example

```tsx
import EmptyState from '../common/EmptyState';

{items.length === 0 ? (
  <EmptyState
    title={t('areas.no_areas_found')}
    description={t('areas.no_areas_found_description')}
    actionLabel={t('areas.add')}
    onAction={onAddArea}
  />
) : (
  ...
)}
```

---

## 4. Summary

| ID | Component | Path | Status |
|----|-----------|------|--------|
| P1-4 | Page | `common/Page/` | Implemented |
| P1-5 | Card | `common/Card/` | Implemented |
| P1-6 | EmptyState | `common/EmptyState/` | Implemented; all per-feature EmptyStates removed and usages switched |

These components are presentational only (no Redux, no API calls), accept optional `className`, and use Tailwind with semantic theme tokens for dark mode.
