# P0-6, P0-7, P0-8, P0-9, P0-10 Plan and Implementation

**Scope:** P0-6 (enable Tailwind in build), P0-7 (map theme tokens to Tailwind), P0-8 (standard API response + error contract), P0-9 (typed AppThunk & useAppDispatch/useAppSelector), P0-10 (feature boundary rule).  
**Goal:** Tailwind enabled with semantic tokens; standard API/error types; typed Redux hooks used everywhere; feature boundary documented.

---

## 1. Current state

| Item | Current state |
|------|----------------|
| **Tailwind** | Installed (tailwindcss 3.4.x); `tailwind.config.js` exists with `content`, `darkMode: 'class'`, and brand palettes (leaf, soil, wheat, sky). No Tailwind directives in CSS. |
| **CSS entry** | `src/index.css` is imported from `src/main.tsx`. It contains custom classes (dashboard, form, buttons, utilities, leaf/soil/wheat/sky, dark overrides) but no `@tailwind` directives. |
| **Theme** | `src/styles/theme.ts` defines `lightTheme` and `darkTheme` with semantic tokens (background, surface, card, primary, danger, success, border, etc.) and state colors (success/danger/warning/info + Background/Text). Components use `useThemeColors()` and inline styles. |
| **Dark mode** | `ThemeContext` already toggles `document.documentElement.classList.add/remove('dark')` when `darkMode` changes. No change needed there. |

---

## 2. P0-6: Enable Tailwind in build

### 2.1 What to do

- In **`src/index.css`**, add at the **very top** (before any other rules or imports that might depend on order):

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- **Keep** all existing content below the directives:
  - `@import './styles/walkthrough.css';`
  - Base styles (`*`, `body`)
  - Dashboard layout, form elements, buttons, utility classes
  - Leaf/soil/wheat/sky and dark overrides

- **Do not remove** existing custom classes in this task; they remain for backward compatibility until migration (P1-9, P2-4).

### 2.2 Verify Tailwind config content paths

- In **`tailwind.config.js`**, `content` must include all files that use Tailwind classes so the build can purge unused styles.
- Current value:

  ```js
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  ```

- **Verification:** Confirm no Tailwind usage lives under paths outside `src/` and `index.html`. If everything is under `src/` plus `index.html`, this is sufficient. No change required unless you add HTML outside `src/`.

### 2.3 Build check

- Run `npm run build` and confirm:
  - No PostCSS/Tailwind errors.
  - Output CSS includes Tailwind base (e.g. preflight) and utilities.
  - Existing layout and colors still apply (no visual regressions from this step alone).

---

## 3. P0-7: Map theme tokens to Tailwind

### 3.1 What to do

- In **`tailwind.config.js`**, under `theme.extend.colors`, **add** semantic and state/feedback tokens that mirror `theme.ts`, while **keeping** existing `leaf`, `soil`, `wheat`, `sky` palettes and **keeping** `darkMode: 'class'`.

### 3.2 Token mapping (mirroring `theme.ts`)

Use a single semantic name with a `DEFAULT` (light) and `dark` key so that classes can be:

- Light: `bg-background`, `text-textPrimary`, etc.
- Dark: `dark:bg-background-dark`, `dark:text-textPrimary-dark`, etc.

This matches the app’s `ThemeProvider` adding/removing the `dark` class on the root.

| theme.ts (light / dark) | Tailwind token | Use in classes |
|-------------------------|----------------|----------------|
| background | `background: { DEFAULT, dark }` | `bg-background` / `dark:bg-background-dark` |
| surfaceBackground | `surface: { DEFAULT, dark }` | `bg-surface` / `dark:bg-surface-dark` |
| cardBackground, cardBorder | `card: { DEFAULT, border, borderDark }` or card as object | `bg-card` / `border-card-border` and dark variants |
| primary | `primary: { DEFAULT, dark }` (can reuse leaf-600 for green) | `bg-primary` / `text-primary` |
| border / divider | `border: { DEFAULT, dark }` | `border-border` / `dark:border-border-dark` |
| textPrimary, textSecondary, textMuted | `textPrimary`, `textSecondary`, `textMuted` (each DEFAULT + dark) | `text-textPrimary` / `dark:text-textPrimary-dark` |
| success, successBackground, successText | `success`, `successBg`, `successText` (DEFAULT + dark) | Buttons, badges, alerts |
| danger, dangerBackground, dangerText | `danger`, `dangerBg`, `dangerText` (DEFAULT + dark) | Errors, delete, validation |
| warning, warningBackground, warningText | `warning`, `warningBg`, `warningText` (DEFAULT + dark) | Device state indicators, rule validation, alerts |
| info, infoBackground, infoText | `info`, `infoBg`, `infoText` (DEFAULT + dark) | Optional; for info alerts |

**State/feedback (P0-7 requirement):**

- `surfaceHover`: hover state for list rows, cards (e.g. sidebarItemHover / surface hover).
- `dangerBg`, `warningBg`: already above; explicitly document as for device state indicators, rule validation, alerts.
- Optional: `successBg` if not covered by `successBg`.

### 3.3 Suggested `theme.extend.colors` shape

Keep existing palettes and add (values from `theme.ts`):

```js
theme: {
  extend: {
    colors: {
      // existing leaf, soil, wheat, sky ...
      background: { DEFAULT: '#f0f9f0', dark: '#111827' },
      surface: { DEFAULT: '#ffffff', dark: '#1f2937' },
      card: { DEFAULT: '#ffffff', dark: '#1f2937' },
      cardBorder: { DEFAULT: '#e5e7eb', dark: '#374151' },
      primary: { DEFAULT: '#16a34a', dark: '#16a34a' },
      border: { DEFAULT: '#e5e7eb', dark: '#374151' },
      textPrimary: { DEFAULT: '#1f2937', dark: '#f9fafb' },
      textSecondary: { DEFAULT: '#4b5563', dark: '#d1d5db' },
      textMuted: { DEFAULT: '#6b7280', dark: '#9ca3af' },
      surfaceHover: { DEFAULT: '#f0f9f0', dark: '#374151' },
      success: { DEFAULT: '#16a34a', dark: '#10b981' },
      successBg: { DEFAULT: '#c6f6d5', dark: '#064e3b' },
      successText: { DEFAULT: '#22543d', dark: '#d1fae5' },
      danger: { DEFAULT: '#ef4444', dark: '#ef4444' },
      dangerBg: { DEFAULT: '#fed7d7', dark: '#7f1d1d' },
      dangerText: { DEFAULT: '#822727', dark: '#fee2e2' },
      warning: { DEFAULT: '#eab308', dark: '#f59e0b' },
      warningBg: { DEFAULT: '#fefcbf', dark: '#78350f' },
      warningText: { DEFAULT: '#744210', dark: '#fef3c7' },
      info: { DEFAULT: '#3b82f6', dark: '#3b82f6' },
      infoBg: { DEFAULT: '#e1effe', dark: '#1e3a8a' },
      infoText: { DEFAULT: '#1e40af', dark: '#dbeafe' },
    }
  }
}
```

- Names can be adjusted (e.g. `cardBorder` vs nesting under `card`) to match team convention; the important part is that semantic and state/feedback tokens exist and mirror `theme.ts`.

### 3.4 Dark mode

- **Keep** `darkMode: 'class'` in `tailwind.config.js`.
- **No code change** in `ThemeContext`: it already adds/removes `dark` on `document.documentElement`, so Tailwind’s `dark:` variants already apply when dark mode is on.

---

## 4. Acceptance criteria

| ID | Criterion |
|----|-----------|
| P0-6 | `src/index.css` starts with `@tailwind base;` `@tailwind components;` `@tailwind utilities;` and all existing custom CSS remains below. |
| P0-6 | `tailwind.config.js` `content` includes `./index.html` and `./src/**/*.{js,ts,jsx,tsx}` (or equivalent). |
| P0-6 | `npm run build` completes; generated CSS includes Tailwind base and utilities; no visual regression from this step. |
| P0-7 | `tailwind.config.js` `theme.extend.colors` includes semantic tokens: background, surface, card, primary, border, textPrimary, textSecondary, textMuted, and state/feedback: success, successBg, successText, danger, dangerBg, dangerText, warning, warningBg, warningText, surfaceHover; optional info/infoBg/infoText. |
| P0-7 | Each token supports light (DEFAULT) and dark where needed so components can use e.g. `bg-background dark:bg-background-dark`. |
| P0-7 | `darkMode: 'class'` is unchanged; root already receives `dark` when dark mode is on (ThemeContext). |

---

## 5. Risks and rollback

- **Risks:** If Tailwind’s base layer conflicts with existing global styles (e.g. `* { margin: 0 }`), we may see small layout shifts. Mitigation: add directives at the top and keep existing rules; if needed, narrow Tailwind’s base in a follow-up.
- **Rollback:** Remove the three `@tailwind` lines from `index.css` to stop Tailwind in the build; revert `theme.extend.colors` changes to restore previous config.

---

## 6. Out of scope (for later)

- Migrating components from inline styles or `useThemeColors()` to Tailwind classes (P1-9, P2-4).
- Removing or refactoring existing custom classes in `index.css` (P2-5).
- Changing how ThemeContext or dark mode persistence works.

---

## 7. P0-8: Standard API response + error contract

### 7.1 Plan (from CODEBASE_IMPROVEMENT_PLAN)

- In `src/types/api.d.ts`: add `ApiSuccess<T>`, `ApiError` (success, message, code?, details?), `ApiResponse<T> = ApiSuccess<T> | ApiError`. Services may return `Promise<ApiResponse<T>>` or unwrap and throw typed `ApiError`; thunks use typed `rejectWithValue`. Enables consistent toasts and UI error handling.

### 7.2 Implementation status (done)

- **api.d.ts:** `ApiError` extended with `success: false`; `ApiSuccess<T>` added as `{ success: true; data: T }`; `ApiResponse<T> = ApiSuccess<T> | ApiError` added.
- **api.ts:** Re-exports `ApiSuccess` and `ApiResponse`. Existing `ApiRejectPayload`, `ApiDataWrapper`, `ApiDeleteResponse` unchanged; thunks continue to use `rejectWithValue` with `ApiRejectPayload`. Services can adopt `ApiResponse<T>` when backend aligns.

---

## 8. P0-9: Typed AppThunk & useAppDispatch/useAppSelector

### 8.1 Plan (from CODEBASE_IMPROVEMENT_PLAN)

- Export `AppThunk<ReturnType = void>`, `AppDispatch` from store; add typed `useAppDispatch` and `useAppSelector`. Use them everywhere instead of raw `useDispatch`/`useSelector`. Removes generic noise and mistakes in slices.

### 8.2 Implementation status (done)

- **store.ts:** `useAppDispatch` and `useAppSelector` (typed with `AppDispatch` and `TypedUseSelectorHook<RootState>`) added and exported; `AppDispatch` and `AppThunk` were already exported.
- **Migration:** All usages of `useDispatch`/`useSelector` replaced with `useAppDispatch`/`useAppSelector` across containers (RuleEngine, Organizations, Devices, Areas, Auth, Sensors, Dashboard, Settings), components (DeviceDetails, NodeDialog, AdminTools, RuleItem, MainLayout, OrganizationSelector), hooks (useRuleEnginePermissions, usePermissions), and routes (PrivateRoute, PublicRoute). Redundant `AppDispatch`/`RootState` imports removed where only used for the old hooks.

---

## 9. P0-10: Feature boundary rule

### 9.1 Plan (from CODEBASE_IMPROVEMENT_PLAN)

- Document: **A feature may import from: `common/`, `types/`, and its own feature folder. It may NOT import from another feature.** Prevents cross-feature coupling (Device → Sensor → RuleEngine). Document in `docs/` or root README.

### 9.2 Implementation status (done)

- **docs/FEATURE_BOUNDARY_RULE.md:** Created with the rule, allowed imports table, examples (OK vs not OK), and clarification of shared state/services/routes.
- **README.md:** New “Conventions” section with one-line summary and link to `docs/FEATURE_BOUNDARY_RULE.md`.

---

## 10. Implementation status (P0-6 and P0-7)

**Done.**

- **P0-6:** `src/index.css` now starts with `@tailwind base;` `@tailwind components;` `@tailwind utilities;`. The duplicate `@import './styles/walkthrough.css'` was removed from `index.css` (it is already imported in `src/main.tsx`) so that no `@import` appears after Tailwind directives, satisfying PostCSS. All other custom CSS in `index.css` was kept. `tailwind.config.js` `content` unchanged. `npx vite build` completes successfully; generated CSS includes Tailwind.
- **P0-7:** `tailwind.config.js` `theme.extend.colors` now includes semantic tokens (background, surface, card, cardBorder, primary, border, textPrimary, textSecondary, textMuted, surfaceHover) and state/feedback tokens (success, successBg, successText, danger, dangerBg, dangerText, warning, warningBg, warningText, info, infoBg, infoText), each with `DEFAULT` and `dark` where applicable. Existing leaf, soil, wheat, sky palettes and `darkMode: 'class'` were kept. Root already receives `dark` from ThemeContext.
