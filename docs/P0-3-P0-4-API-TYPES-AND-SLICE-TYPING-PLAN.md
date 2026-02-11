# P0-3 & P0-4 Development Plan: API Types and Slice Typing

**Goal (P0-3):** Introduce `src/types/api.d.ts` as the single place for API-related types (reject payload, error shape, and DTOs that differ from domain models). Add a barrel `src/types/api.ts`.

**Goal (P0-4):** Remove `any` from all listed slices: type `rejectWithValue` payload, use `PayloadAction<T>` for fulfilled handlers where missing, and replace `error: any` with `error: unknown` and safe message extraction.

---

## 1. Current state summary

### 1.1 API / slice patterns today

- **No `api.d.ts`:** API error shape and thunk reject payload are untyped; slices pass a string to `rejectWithValue(error.response?.data?.message || '...')`.
- **Catch blocks:** Every thunk uses `catch (error: any)` and reads `error.response?.data?.message`.
- **Rejected handlers:** Slices use `state.error = action.payload as string`.
- **Fulfilled handlers:** Most slices already use `PayloadAction<T>` in reducers; some `addCase(Thunk.fulfilled, (state, action))` omit the action type (still safe but not explicit).
- **deviceDetails.slice:** Defines `metadata?: Record<string, any>`, `capabilities?: Record<string, any>` in `DeviceDetails` (in-slice type); these should be narrowed (e.g. `Record<string, unknown>`) to remove `any`.

### 1.2 Slices in scope (P0-4)

| Slice | Thunks with `rejectWithValue` | `error: any` | Fulfilled typed? | Other `any` |
|-------|-------------------------------|--------------|-----------------|-------------|
| devices | 6 | 6 | No explicit PayloadAction in addCase | — |
| deviceStates | 4 | 4 | No | — |
| deviceDetails | 0 (no reject) | 0 | Yes | metadata/capabilities `Record<string, any>` |
| deviceStateInstances | 1 | 0 (untyped catch) | — | — |
| organizations | 5 | 5 | No | — |
| areas | 5 | 5 | No | — |
| sensors | 10 | 10 | No | — |
| auth | 4 | 4 | Yes (reducers) | — |
| ruleEngine | 14 | 14 | Yes (PayloadAction in addCase) | — |

---

## 2. Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Reject payload type | `ApiRejectPayload` in api.d.ts: `{ message: string }` | Single shape for all thunks; aligns with future P0-8 ApiError; allows optional `code`/`details` later. |
| Pass string vs object | Pass object: `rejectWithValue({ message: ... })` | Typed payload; rejected handler uses `action.payload.message`. |
| Catch parameter | `error: unknown` + helper `getErrorMessage(error): string` | Removes `any`; centralizes axios/Error handling. |
| Helper location | `src/utils/getErrorMessage.ts` (or in api types as typed helper) | Reusable; one place to handle `AxiosError` and `Error`. |
| deviceDetails metadata/capabilities | `Record<string, unknown>` in slice (or move type to device.d.ts) | Removes `any` without over-specifying API shape. |
| Fulfilled PayloadAction | Add explicit `PayloadAction<T>` to every `.addCase(thunk.fulfilled, ...)` where T is return type | Consistency and clarity; matches plan. |

---

## 3. Examples: before vs after

These examples show how thunks and error handling worked **before** (old) and **after** (new) the P0-3 / P0-4 implementation. All examples use `areas.slice.ts` patterns; the same changes apply across devices, organizations, sensors, auth, ruleEngine, etc.

### 3.1 Thunk definition

**Old:** No generics; return and reject types are inferred (or untyped). Reject payload is a string.

```ts
export const fetchAreasByOrganizationId = createAsyncThunk(
  'areas/fetchByOrganizationId',
  async (organizationId: number, { rejectWithValue }) => {
    try {
      return await areasService.getAreasByOrganizationId(organizationId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch areas by organization');
    }
  }
);
```

**New:** Explicit generics: return type, arg type, and `{ rejectValue: ApiRejectPayload }`. Reject payload is a typed object `{ message: string }`. Catch uses `error: unknown` and `getErrorMessage`.

```ts
export const fetchAreasByOrganizationId = createAsyncThunk<
  Awaited<ReturnType<typeof areasService.getAreasByOrganizationId>>,
  number,
  { rejectValue: ApiRejectPayload }
>(
  'areas/fetchByOrganizationId',
  async (organizationId, { rejectWithValue }) => {
    try {
      return await areasService.getAreasByOrganizationId(organizationId);
    } catch (error: unknown) {
      return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch areas by organization') });
    }
  }
);
```

### 3.2 Catch block

**Old:** `error: any`; reject with a string; no shared helper.

```ts
} catch (error: any) {
  return rejectWithValue(error.response?.data?.message || 'Failed to fetch areas by organization');
}
```

**New:** `error: unknown`; reject with `{ message: string }`; message extracted via `getErrorMessage(error, fallback)`.

```ts
} catch (error: unknown) {
  return rejectWithValue({ message: getErrorMessage(error, 'Failed to fetch areas by organization') });
}
```

### 3.3 Rejected handler

**Old:** `action.payload` treated as string (unsafe cast).

```ts
builder.addCase(fetchAreasByOrganizationId.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});
```

**New:** `action.payload` is `ApiRejectPayload | undefined`; use `action.payload?.message ?? null`.

```ts
builder.addCase(fetchAreasByOrganizationId.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message ?? null;
});
```

### 3.4 Fulfilled handler

**Old:** Action type omitted; payload type inferred.

```ts
builder.addCase(fetchAreasByOrganizationId.fulfilled, (state, action) => {
  state.loading = false;
  state.areas = action.payload;
});
```

**New:** Explicit `PayloadAction<T>` for clarity and consistency.

```ts
builder.addCase(fetchAreasByOrganizationId.fulfilled, (state, action: PayloadAction<Area[]>) => {
  state.loading = false;
  state.areas = action.payload;
});
```

### 3.5 deviceDetails: removing `any`

**Old:** `metadata` and `capabilities` use `Record<string, any>`.

```ts
export interface DeviceDetails {
  // ...
  metadata?: Record<string, any>;
  capabilities?: Record<string, any>;
  // ...
}
```

**New:** Use `Record<string, unknown>` to remove `any` while keeping flexible shape.

```ts
export interface DeviceDetails {
  // ...
  metadata?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;
  // ...
}
```

---

## 4. P0-3 Step-by-step implementation

### Phase A: API types and barrel

| Step | Action | Files |
|------|--------|--------|
| A.1 | Create `src/types/api.d.ts`. Define: (1) `ApiRejectPayload` = `{ message: string }`, (2) `ApiError` = `{ message: string; code?: string; details?: unknown }` (for future P0-8), (3) optional `ApiDataWrapper<T>` = `{ data: T }` if useful for response DTOs. Export all. | New: `src/types/api.d.ts` |
| A.2 | Create `src/types/api.ts` re-exporting from `./api.d`. | New: `src/types/api.ts` |

### Phase B: Error message helper

| Step | Action | Files |
|------|--------|--------|
| B.1 | Create `src/utils/getErrorMessage.ts`. Implement `getErrorMessage(error: unknown, fallback: string): string` that: if `error` is object with `response?.data?.message` (string), return it; else if `error instanceof Error` return `error.message`; else return fallback. | New: `src/utils/getErrorMessage.ts` |

---

## 5. P0-4 Step-by-step implementation

### Phase C: Slice typing (per slice)

For **each** of: devices, deviceStates, deviceDetails, deviceStateInstances, organizations, areas, sensors, auth, ruleEngine:

| Step | Action | Details |
|------|--------|--------|
| C.1 | Import `ApiRejectPayload` from `../../types/api` (or correct path). | — |
| C.2 | For every `createAsyncThunk`: add third generic `{ rejectValue: ApiRejectPayload }`. | e.g. `createAsyncThunk<ReturnType, ArgType, { rejectValue: ApiRejectPayload }>(...)` |
| C.3 | In every thunk catch: replace `error: any` with `error: unknown`; use `return rejectWithValue({ message: getErrorMessage(error, '...') });`. | Import getErrorMessage from utils. |
| C.4 | In every rejected handler: set `state.error = action.payload?.message ?? null` (or keep string and use `action.payload ? action.payload.message : null`). | Handles undefined payload (e.g. thrown outside rejectWithValue). |
| C.5 | For every fulfilled handler: add explicit type `(state, action: PayloadAction<ReturnType>)` where ReturnType is the thunk return type. | Already done in ruleEngine; add to others. |
| C.6 | deviceDetails.slice only: change `metadata?: Record<string, any>` and `capabilities?: Record<string, any>` to `Record<string, unknown>`. | Removes `any` from slice. |

### Phase D: deviceStateInstances slice

| Step | Action | Details |
|------|--------|--------|
| D.1 | Add `{ rejectValue: ApiRejectPayload }` to the thunk; in catch use `rejectWithValue({ message: getErrorMessage(error, '...') })`; in rejected handler use `action.payload?.message`. | Currently passes string; align with other slices. |

---

## 6. Acceptance criteria

### P0-3

- [ ] **AC1** `src/types/api.d.ts` exists and exports at least `ApiRejectPayload` and `ApiError` (and optionally `ApiDataWrapper`).
- [ ] **AC2** `src/types/api.ts` exists and re-exports from `./api.d`.
- [ ] **AC3** `getErrorMessage(error: unknown, fallback: string): string` exists and is used (or available for use) from slices.

### P0-4

- [ ] **AC4** No slice in the list uses `error: any` in catch blocks; all use `error: unknown` and `getErrorMessage`.
- [ ] **AC5** Every async thunk that uses `rejectWithValue` declares `rejectValue: ApiRejectPayload` and passes `{ message: ... }`.
- [ ] **AC6** Every rejected handler that sets `state.error` uses `action.payload?.message` (or equivalent) and no longer uses `action.payload as string`.
- [ ] **AC7** Every fulfilled handler has explicit `PayloadAction<T>` where T is the thunk’s return type (or is already correctly typed).
- [ ] **AC8** deviceDetails.slice has no `any`: metadata/capabilities use `Record<string, unknown>` (or a more specific type).
- [ ] **AC9** No linter/TypeScript errors; existing tests (if any) still pass.

---

## 7. Risk and rollback

- **Risk:** Some components may read `state.error` and assume it’s always a string; with `ApiRejectPayload` we still set `state.error = action.payload?.message` (string), so type remains `string | null`. No breaking change.
- **Rollback:** Revert api.d.ts, api.ts, getErrorMessage, and slice edits; restore `error: any` and string `rejectWithValue` if needed.

---

## 8. Out of scope (optional follow-up)

- P0-8: Full `ApiSuccess<T>`, `ApiError`, `ApiResponse<T>` and service return types (api.d.ts already adds minimal ApiError for consistency).
- Typing service return values (e.g. `response.data`) in this task; that is P0-5.
