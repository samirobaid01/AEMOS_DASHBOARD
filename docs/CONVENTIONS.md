# Conventions

Short reference for styling and list-performance rules. See also `CODEBASE_IMPROVEMENT_PLAN.md`.

---

## Styling (P2-6)

- **Form and button styling:** Use `Button`, `Input`, and `FormField` from `src/components/common/` and Tailwind only.
- **Do not introduce** `.form-input`, `.form-label`, or `.btn*` in CSS or in `className` props.
- New form/button UI must use shared components + Tailwind utilities (e.g. via `cn()`).

### PR checklist (optional)

Before merge, confirm:

- [ ] No new use of `form-input`, `form-label`, or `btn-` in class names or global CSS.

---

## List performance (P2-9)

- **Row components:** Use `React.memo` for list row components (e.g. `DeviceItem`, `OrganizationItem`).
- **Keys:** Prefer `key={id}` from the backend (or another stable id). Do not use `key={index}` for list rows when a stable id is available.
- **Handlers:** Avoid inline arrow functions in large list `.map()` calls (e.g. `onClick={() => doSomething(item.id)}`). Prefer:
  - A single handler that reads from event/data attributes, or
  - Callbacks passed as props to the row component, or
  - Stable callbacks created with `useCallback` and an identifier argument.
- **New list code:** Do not add `key={index}` for list rows; use a stable id or a documented composite key where no id exists.
