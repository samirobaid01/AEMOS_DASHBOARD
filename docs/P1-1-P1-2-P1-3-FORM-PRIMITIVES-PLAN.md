# P1-1, P1-2, P1-3 Plan: Form Primitives and One-Form Migration

**Scope:** P1-1 (FormField), P1-2 (FormActions), P1-3 (migrate one form to use them).  
**Goal:** Add reusable form building blocks in `common/` and migrate one form (AreaForm) to use FormField + FormActions + common Button so the pattern is established for future forms.

---

## 1. Current state

| Item | Current state |
|------|----------------|
| **common/Input** | Has optional `label`, `error`, `helperText`, `required`; can be used standalone. Forms often duplicate label + control + error layout with inline styles. |
| **common/Button** | Exists with variants (primary, secondary, danger, outline), sizes, loading; used in some places. |
| **Forms** | AreaForm, DeviceIdentityForm, etc. use repeated patterns: `fieldGroupStyle` + `labelStyle` + `<label>` + `<input>`/`<select>` + optional error `<p>`, and a `buttonGroupStyle` div with Cancel/Submit buttons (native `<button>` or custom styles). No shared FormField or FormActions. |
| **types/ui.d.ts** | Has `FormErrors`; no FormFieldProps or FormActionsProps yet. |

---

## 2. P1-1: FormField component

### 2.1 Purpose

A single wrapper that provides: **label** (with optional required indicator), **control slot** (children), **error message**, and optional **hint**. Ensures consistent spacing, accessibility (label linked via `id`/`htmlFor`), and one place to style field layout.

### 2.2 Props (interface)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no | Label text shown above the control. |
| `error` | `string` | no | Error message shown below the control (e.g. from `formErrors.fieldName`). |
| `required` | `boolean` | no | If true, show a required indicator (e.g. asterisk) next to the label. |
| `children` | `ReactNode` | yes | The form control (Input, Select, textarea, etc.). |
| `id` | `string` | no | Id for the control; used for `htmlFor` on the label. If omitted, FormField can generate one or leave `htmlFor` unset (parent can pass `id` to the child). |
| `hint` | `string` | no | Optional hint text below the control, above or beside the error. |
| `className` | `string` | no | Applied to the root wrapper (e.g. the outer `div`) for layout/spacing. |

### 2.3 Behavior and layout

- **Root:** One wrapper element (e.g. `div`) with `className` merged for spacing (e.g. `marginBottom`).
- **Label:** Rendered when `label` is provided; associated with control via `htmlFor={id}` when `id` is provided. Required indicator (e.g. `*`) shown when `required === true`.
- **Children:** Rendered as-is (no wrapper beyond the root).
- **Error:** Rendered below the control when `error` is non-empty; visually distinct (e.g. danger color, small text).
- **Hint:** Rendered when `hint` is provided; typically muted text below the control, error takes precedence or appears below hint.

### 2.4 Location and export

- **Path:** `src/components/common/FormField/FormField.tsx` (and optional `index.ts`).
- **Export:** Default export; optionally export props type from same file or from `types/ui.d.ts`.

### 2.5 Acceptance criteria (P1-1)

| ID | Criterion |
|----|-----------|
| AC1 | FormField exists under `common/` (e.g. `FormField/FormField.tsx`) and is exported. |
| AC2 | Props include at least: `label`, `error`, `required`, `children`, optional `id`, optional `hint`, optional `className`. |
| AC3 | When `label` is provided, a label element is rendered and is associated with the control when `id` is provided (`htmlFor`). |
| AC4 | When `required` is true, a required indicator (e.g. asterisk) is visible next to the label. |
| AC5 | When `error` is a non-empty string, it is displayed below the control in a clearly styled way. |
| AC6 | Optional `hint` is displayed when provided. |
| AC7 | Root wrapper accepts and applies `className` (e.g. for margin). |
| AC8 | No Redux, no API calls; component is presentational only. |

---

## 3. P1-2: FormActions (or ButtonGroup) component

### 3.1 Purpose

A horizontal layout for form actions (typically **Cancel** and **Submit**) with consistent spacing and optional **mobile stack** (buttons full-width and stacked on small screens).

### 3.2 Props (interface)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | yes | Usually two buttons: Cancel and Submit (from common Button). |
| `className` | `string` | no | Applied to the container. |
| `stackOnMobile` | `boolean` | no | If true, use column layout on small viewports (e.g. flexDirection column or column-reverse) and optionally full-width buttons. Default true for consistency with existing forms. |

### 3.3 Behavior and layout

- **Layout:** Flex container, horizontal (row) on desktop, with gap (e.g. `0.75rem`). Buttons typically aligned to end (`justifyContent: 'flex-end'`).
- **Mobile:** When `stackOnMobile` is true, switch to column/column-reverse and optionally make buttons full-width so they stack.
- **Content:** No built-in buttons; callers pass `children` (e.g. `<Button variant="secondary" onClick={onCancel}>Cancel</Button>` and `<Button type="submit">Submit</Button>`).

### 3.4 Location and export

- **Path:** `src/components/common/FormActions/FormActions.tsx` (and optional `index.ts`).
- **Export:** Default export.

### 3.5 Acceptance criteria (P1-2)

| ID | Criterion |
|----|-----------|
| AC1 | FormActions exists under `common/` (e.g. `FormActions/FormActions.tsx`) and is exported. |
| AC2 | Props include at least: `children`, optional `className`, optional `stackOnMobile`. |
| AC3 | Layout is horizontal (row) with consistent gap (e.g. 0.75rem) and end-aligned. |
| AC4 | When `stackOnMobile` is true (or default), on a narrow viewport (e.g. &lt; 768px) layout stacks (column or column-reverse) with buttons usable full-width. |
| AC5 | Root container accepts and applies `className`. |
| AC6 | No Redux, no API calls; component is presentational only. |

---

## 4. P1-3: Migrate one form (AreaForm)

### 4.1 Target form

**AreaForm** (`src/components/areas/AreaForm.tsx`). It has a clear structure: name, organizationId, parentAreaId (conditional), description, status (checkbox/select), and Cancel/Submit buttons. Migrating it establishes the pattern without touching the more complex DeviceIdentityForm first.

### 4.2 Migration steps

1. **Replace each field group** with `FormField`:
   - **Name:** `<FormField label={t('areas.area_name')} error={formErrors.name} required id="name">{<input id="name" ... />}</FormField>`. If AreaForm does not yet have per-field `formErrors`, add a `formErrors` prop (e.g. `FormErrors`) and wire validation to set `formErrors.name` etc., or pass `error={undefined}` for now.
   - **Organization:** Same pattern with `id="organizationId"`, label, required, and control as children.
   - **Parent area (if any):** FormField with label, no required, select as children.
   - **Description:** FormField with label, textarea as children.
   - **Status:** FormField with label, select/checkbox as children (match current behavior).
2. **Replace the button group** at the bottom with `FormActions` and common `Button`:
   - `<FormActions stackOnMobile={true}>` (or default) wrapping `<Button type="button" variant="secondary" onClick={onCancel}>...</Button>` and `<Button type="submit" disabled={isSubmitting}>...</Button>`.
3. **Remove** duplicated inline styles used only for field groups and button group (labelStyle, fieldGroupStyle, buttonGroupStyle, cancelButtonStyle, submitButtonStyle) that are now encapsulated in FormField/FormActions and Button.
4. **Keep** form-level layout (formStyle, headerStyle, bodyStyle) and any top-level error display; ensure form still submits and cancels correctly.

### 4.3 Optional: per-field errors in AreaForm

If AreaForm currently only has a single top-level `error`, we can either:
- **Option A:** Introduce `formErrors: FormErrors` in AreaForm props and set it from the parent (e.g. from validation in the container), then pass `formErrors.name`, `formErrors.organizationId`, etc. into each FormField’s `error` prop.
- **Option B:** Keep the top-level error only and pass `error={undefined}` to each FormField for now; the layout and required indicator still benefit from FormField. Per-field errors can be added in a follow-up.

Recommendation: **Option B** for minimal change; Option A if the container already has or can easily provide per-field errors.

### 4.4 Acceptance criteria (P1-3)

| ID | Criterion |
|----|-----------|
| AC1 | AreaForm uses `FormField` for at least the name, organizationId, description, and status fields (and parent area if present). Each has a label; name and organizationId have `required`; controls are passed as children. |
| AC2 | AreaForm uses `FormActions` for the Cancel and Submit actions and uses the common `Button` component for both buttons. |
| AC3 | On desktop, form actions appear in a horizontal row at the end; on a narrow viewport, they stack (e.g. column-reverse) and remain usable. |
| AC4 | Form submit and cancel behavior is unchanged (onSubmit, onCancel still fire correctly; validation and isSubmitting unchanged). |
| AC5 | No new accessibility regressions: labels are associated with controls (via FormField’s `id`/`htmlFor` where applicable). |
| AC6 | Duplicated field-group and button-group styling removed or reduced in AreaForm in favor of FormField/FormActions/Button. |

---

## 5. Dependencies and order

1. **P1-1 first:** Implement FormField and satisfy AC1–AC8.
2. **P1-2 second:** Implement FormActions and satisfy AC1–AC6.
3. **P1-3 third:** Migrate AreaForm to use FormField and FormActions + common Button; satisfy AC1–AC6.

---

## 6. Risks and rollback

- **Risks:** Slight visual difference if FormField/FormActions spacing or styling doesn’t match current pixel-perfect layout; can be tuned. AreaForm parent must still pass the same props (onSubmit, onCancel, etc.).
- **Rollback:** Revert AreaForm to previous markup and styles; remove FormField and FormActions if not used elsewhere.

---

## 7. Out of scope (for later)

- Migrating DeviceIdentityForm or other forms (do after P1-3).
- Adding `cn()` and Tailwind inside FormField/FormActions (can be done in P1-9 or P1-15).
- Changing AreaForm’s validation or parent container logic beyond wiring formErrors if we choose Option A.