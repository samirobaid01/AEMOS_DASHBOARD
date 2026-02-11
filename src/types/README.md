# Types

Types per domain live in `src/types/<domain>.d.ts`. The file `src/types/<domain>.ts` exists only to re-export from the `.d.ts` (and, when needed, from `constants/`). Do not add new type definitions in `.ts` files.

Import from the barrel: `from '@/types/<domain>'` or `from '../../types/<domain>'` (no `.d` in the path).

## Shared UI types (`ui.d.ts` / `ui.ts`)

Cross-cutting UI contracts live in `src/types/ui.d.ts` and are re-exported from `src/types/ui.ts`. Use these instead of duplicating definitions in components.

| Type | Use when |
|------|----------|
| **FormErrors** | Typing validation error maps: `Record<string, string>`. Use for `formErrors` state and props in forms (create/edit, signup, etc.). |
| **SelectOption** | Options for dropdowns: `{ value: string \| number; label: string }`. Use in `Select` and any component that builds option lists. |
| **ModalBaseProps** | Base shape for modal/dialog components: `isOpen`, `onClose`, optional `title`, `children`, optional `footer`. Extend for specific modals (e.g. add required `title`). |
| **FormPropsBase** | Common form container props: `formErrors`, `isLoading`, `error`, `onSubmit`, `onCancel`. Extend or pick from this for create/edit form components. |
