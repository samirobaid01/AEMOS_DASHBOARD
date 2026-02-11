# P0-2 Development Plan: Add Shared UI Types

**Goal:** Introduce a single source of truth for shared UI types (`FormErrors`, `SelectOption`, modal base props, form base props) in `src/types/ui.d.ts`, with a barrel `src/types/ui.ts`, and adopt these types in the codebase so forms, modals, and selects use consistent definitions and reduce duplication.

---

## 1. Current state summary

### 1.1 Form errors

- **Pattern:** `Record<string, string>` is used in 15+ places for form validation errors.
- **Locations:** OrganizationCreate/Edit (component + container), DeviceCreate/Edit, DeviceIdentityForm, AreaCreate/Edit, Signup.
- **Issue:** No named type; repeated inline and in prop interfaces.

### 1.2 Select options

- **Current:** `SelectOption` is defined only in `src/components/common/Select/Select.tsx`:
  ```ts
  export interface SelectOption { value: string | number; label: string; }
  ```
- **Issue:** UI types live inside a component; other features cannot reference a canonical “select option” shape without importing from the Select component.

### 1.3 Modal / dialog props

- **Current:** `Modal.tsx` defines `ModalProps` (isOpen, onClose, title, children, footer?). Other dialogs (CapabilitiesSummaryModal, ActionDialog, NodeDialog, DeviceStateModal, DeviceStatesModal, ConfirmModal) define local interfaces with overlapping shapes (e.g. `onClose: () => void`, sometimes `isOpen`, `title`).
- **Issue:** No shared base type for “modal-like” props; duplication and drift.

### 1.4 Form props

- **Current:** Create/Edit forms repeat similar prop sets: `formErrors`, `isLoading`, `error`, `onSubmit`, `onChange`, `onCancel`. Types are declared inline per component.
- **Issue:** No shared base shape; adding or changing a common field (e.g. `disabled`) requires many edits.

---

## 2. Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| File name | `src/types/ui.d.ts` | Matches CODEBASE_IMPROVEMENT_PLAN wording; “ui” is clearer than “common” for cross-cutting UI contracts. |
| Barrel | `src/types/ui.ts` | Re-exports from `ui.d.ts` only; consistent with P0-1 (types/*.ts only re-export). |
| Import convention | `from '@/types/ui'` or `from '../../types/ui'` (no `.d`) | Same as other domains; resolution via barrel. |
| SelectOption location | Define in `ui.d.ts`; Select imports from `types/ui` | Single source of truth; Select remains a consumer. |
| Modal base | Add `ModalBaseProps` in ui.d.ts; `Modal.tsx` can extend or use it | Enables reuse without forcing every dialog to use the exact same props (e.g. optional title). |
| Form base | Add optional base interfaces (e.g. `FormErrors`, `FormPropsBase`) | Components can extend or pick as needed; minimal breaking change. |

---

## 3. Step-by-step implementation

### Phase A: Add UI types and barrel

| Step | Action | Files |
|------|--------|--------|
| A.1 | Create `src/types/ui.d.ts`. Define: (1) `FormErrors` = `Record<string, string>`, (2) `SelectOption` = `{ value: string \| number; label: string }`, (3) `ModalBaseProps` = `{ isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; footer?: React.ReactNode }`, (4) `FormPropsBase` = `{ formErrors: FormErrors; isLoading: boolean; error: string \| null; onSubmit: (e: React.FormEvent) => void; onCancel: () => void }`. Export all. | New: `src/types/ui.d.ts` |
| A.2 | Create `src/types/ui.ts` that re-exports everything from `./ui.d`. | New: `src/types/ui.ts` |

### Phase B: Adopt in common components

| Step | Action | Files |
|------|--------|--------|
| B.1 | In `src/components/common/Select/Select.tsx`: remove local `SelectOption` definition; import `SelectOption` from `@/types/ui` (or relative `../../../types/ui`). Keep `SelectProps` extending SelectHTMLAttributes and using `options: SelectOption[]`. | `src/components/common/Select/Select.tsx` |
| B.2 | In `src/components/common/Modal/Modal.tsx`: import `ModalBaseProps` from types/ui; change `ModalProps` to extend `ModalBaseProps` (or alias `ModalProps = ModalBaseProps` if identical). | `src/components/common/Modal/Modal.tsx` |

### Phase C: Adopt in feature components (sample adoption)

| Step | Action | Files |
|------|--------|--------|
| C.1 | Replace `Record<string, string>` with `FormErrors` in organization forms: `OrganizationCreate.tsx`, `OrganizationEdit.tsx` (component props only). Import `FormErrors` from `@/types/ui` or `../../types/ui`. | `src/components/organizations/OrganizationCreate.tsx`, `OrganizationEdit.tsx` |
| C.2 | Replace `Record<string, string>` with `FormErrors` in device forms: `DeviceCreate.tsx`, `DeviceEdit.tsx`, `DeviceIdentityForm.tsx`. | `src/components/devices/DeviceCreate.tsx`, `DeviceEdit.tsx`, `DeviceIdentityForm.tsx` |
| C.3 | Replace `Record<string, string>` with `FormErrors` in area forms: `AreaCreate.tsx`, `AreaEdit.tsx`. | `src/components/areas/AreaCreate.tsx`, `AreaEdit.tsx` |
| C.4 | Replace `Record<string, string>` with `FormErrors` in containers that declare it: Organizations (Create/Edit), Devices (Create/Edit), Areas (Create/Edit), Auth Signup. | Corresponding container files |

### Phase D: Documentation and consistency

| Step | Action | Files |
|------|--------|--------|
| D.1 | Update `src/types/README.md` to mention `ui.d.ts` / `ui.ts` and when to use `FormErrors`, `SelectOption`, `ModalBaseProps`, `FormPropsBase`. | `src/types/README.md` |

---

## 4. Acceptance criteria

- [ ] **AC1** `src/types/ui.d.ts` exists and exports: `FormErrors`, `SelectOption`, `ModalBaseProps`, `FormPropsBase`.
- [ ] **AC2** `src/types/ui.ts` exists and re-exports all of the above from `./ui.d`.
- [ ] **AC3** `SelectOption` is no longer defined in `Select.tsx`; it is imported from `types/ui`.
- [ ] **AC4** `Modal.tsx` uses a type from `types/ui` (extends or aliases `ModalBaseProps`).
- [ ] **AC5** At least the following use `FormErrors` from `types/ui`: OrganizationCreate, OrganizationEdit, DeviceCreate, DeviceEdit, DeviceIdentityForm, AreaCreate, AreaEdit (components), and their containers + Signup where applicable.
- [ ] **AC6** No new duplicate definitions of `FormErrors` or `SelectOption` in components; existing inline `Record<string, string>` for errors is replaced by `FormErrors` in the listed files.
- [ ] **AC7** `src/types/README.md` documents the shared UI types and usage.
- [ ] **AC8** No linter/TypeScript errors; existing tests (if any) still pass.

---

## 5. Out of scope (optional follow-ups)

- Migrating every modal/dialog to extend `ModalBaseProps` (Phase B/C only ensures Modal.tsx and type availability).
- Introducing `FormPropsBase` into every create/edit form in this task (optional: one form can extend it as a demo; rest can adopt in a later pass).
- Adding new UI types (e.g. `TableColumn`, `FilterProps`) in this plan; they can be added to `ui.d.ts` later.

---

## 6. Risk and rollback

- **Risk:** Some imports use path aliases (`@/types/ui`) and others use relative paths; ensure both work.
- **Rollback:** Revert new files and component changes; restore local `SelectOption` in Select.tsx and inline `Record<string, string>` in forms if needed.
