# P1-10: Modal usage

## When to use `common/Modal` vs MUI Dialog

- **Use `common/Modal`** for all in-app dialogs: forms, confirmations, details, wizards. It is the standard overlay dialog with title, body, optional footer, overlay click and Escape to close, and supports `className` and `size` (sm/md/lg/xl).
- **Use MUI Dialog** only when you need a specific MUI behavior or component that is tied to the MUI design system and not covered by `common/Modal`. Prefer migrating such cases to `common/Modal` where possible.

## common/Modal contract

- **Overlay click**: Clicking the backdrop calls `onClose`.
- **Escape**: Pressing Escape calls `onClose`.
- **Title**: Required `title` prop; rendered in the header with an optional close button.
- **Footer**: Optional `footer` (ReactNode) for actions (e.g. Cancel / Save).
- **Layout**: Header (title + close), body (`children`), optional footer. All use semantic tokens and dark mode.
- **Sizing**: `size`: `'sm' | 'md' | 'lg' | 'xl'` (default `'md'`). Use `size="xl"` for wide forms (e.g. Create Node, Add Action).
- **Styling**: Optional `className` is merged onto the inner content container.

## Migrated components

- **DeviceStatesModal**: Uses `common/Modal` with `title`, `footer`, `onClose`; content and form styles use Tailwind/semantic classes.
- **CapabilitiesSummaryModal**: Uses `common/Modal` with `title`, `footer`, `onClose`; JSON preview and actions in body/footer.

## Usage example

```tsx
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="My dialog"
  size="lg"
  footer={
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={onSave}>Save</Button>
    </>
  }
>
  ...content...
</Modal>
```
