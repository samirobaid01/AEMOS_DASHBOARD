# P0-5 Development Plan: Type Services – API Response Types

**Goal:** In each API-calling service, type `response.data` (and thus the return value) so that every function has an explicit return type and no untyped `response.data` or `any`. Use a consistent pattern for API response shapes; where applicable, use or align with `ApiResponse<T>` / backend response types from P0-8.

---

## 1. Current state summary

### 1.1 Services in scope (API-calling only)

| Service | Functions | Current typing | Issues |
|---------|-----------|----------------|--------|
| **areas.service.ts** | getAreas, getAreaById, getAreasByOrganizationId, createArea, updateArea, deleteArea | No return types; `response.data.data.areas` etc. | `response.data` untyped; `getAreaById` uses `Record<string, any>` for params |
| **organizations.service.ts** | getOrganizations, getOrganizationById, createOrganization, updateOrganization, deleteOrganization | No return types | `response.data` untyped |
| **devices.service.ts** | getDevices, getDeviceById, createDevice, updateDevice, deleteDevice, getDevicesByOrganizationId | No return types; manual mapping in getDeviceById | `response.data` untyped; createDevice/updateDevice/deleteDevice return `response.data` (unknown shape) |
| **deviceStates.service.ts** | getDeviceStates, createDeviceState, updateDeviceState, deactivateDeviceState | No return types | `response.data.data.map((state: any) => ...)` — `any` in callback; `response.data` untyped |
| **deviceDetails.service.ts** | getDeviceDetails, updateDeviceState | No return types | `response.data.data`, `response.data` untyped |
| **deviceStateInstances.service.ts** | createDeviceStateInstance | Returns `{ success, message, data }` | `response.data` untyped; return type implied |
| **sensors.service.ts** | getSensors, getSensorById, getSensorsByOrganizationId, getSensorsByAreaId, createSensor, updateSensor, deleteSensor | No return types | `response.data` untyped |
| **telemetry.service.ts** | createTelemetry, updateTelemetry | No return types | `response.data.data` untyped |
| **auth.service.ts** | login, signup, logout, getCurrentUser, forgotPassword, resetPassword, verifyEmail, refreshToken | Some have `Promise<LoginResponse>` etc. | `response.data.data` / `response.data` untyped; refreshToken has no return type |
| **ruleEngineService.ts** | getRules, getRuleDetails, createRule, updateRule, deleteRule, createRuleNode, updateRuleNode, deleteRuleNode, fetchSensors, fetchSensorDetails, fetchDevices, fetchDeviceStates | No return types | `response.data.data`, `response.data` untyped; many branches |

### 1.2 Common API response shapes (observed)

- **List endpoints:** `response.data.data.areas` / `.organizations` / `.devices` / `.sensors` / `.rules` — backend returns `{ data: { areas: T[] } }` (or equivalent key).
- **Single resource:** `response.data.data.area` / `.organization` / `.device` / `.sensor` — backend returns `{ data: { area: T } }` (or equivalent).
- **Auth:** `response.data.data` with `token`, `refreshToken`, `user`, `permissions`.
- **Delete / void:** `response.data` or `response.data.status` — sometimes `{ status: 'success' }` or raw body.
- **deviceStates:** `response.data.data` is an array; each item has `allowedValues` as JSON string (parsed in service to `string[]`).

### 1.3 P0-8 relationship

P0-8 defines a standard API contract: `ApiSuccess<T>`, `ApiError`, `ApiResponse<T> = ApiSuccess<T> | ApiError`. The plan says: *"use ApiResponse<T> from P0-8 where applicable."*

- **Option A (P0-8 done first):** Backend is assumed to return `ApiResponse<T>` (e.g. `{ success: true; data: T }`). Services type `response.data` as `ApiResponse<T>` and return `data` (or throw on error). Then P0-5 only adds explicit return types and uses that shape.
- **Option B (P0-5 first):** We do not assume backend conforms to ApiResponse yet. We type `response.data` with **concrete response DTOs** per endpoint (e.g. `{ data: { areas: Area[] } }`). We add `ApiSuccess<T>` / `ApiDataWrapper<T>` (or similar) in `api.d.ts` only if we want a shared wrapper type; otherwise use inline types or a small set of generics (e.g. `ListResponse<T>`, `ItemResponse<T>`).

This plan chooses **Option B** so P0-5 can be implemented without blocking on P0-8: type each service with explicit return types and typed response shapes (using existing domain types and small response helpers). When P0-8 is implemented, services can be refactored to use `ApiResponse<T>` if the backend adopts that contract.

---

## 2. Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Return types | Every exported service function has an explicit return type (e.g. `Promise<Area[]>`, `Promise<Area \| null>`). | Clear contract for callers (e.g. slices); enables type-safe usage. |
| Typing response.data | Use axios generic: `apiClient.get<ResponseShape>(url)`. Define a small set of response shapes (e.g. `ApiListResponse<T>`, `ApiItemResponse<T>`) in `api.d.ts` for common patterns `{ data: { areas: T[] } }` / `{ data: { area: T } }`. | Keeps typing in one place; avoids repeating inline types in every service. |
| ApiResponse from P0-8 | Do not require P0-8 to be done. Add minimal response DTOs in api.d.ts (e.g. `ApiListResponse<T>`, `ApiItemResponse<T>`) for current backend shape. When P0-8 lands, we can introduce `ApiResponse<T>` and align. | Unblocks P0-5; consistent with "use ApiResponse<T> from P0-8 where applicable" (use when available). |
| Remove `any` | Replace `Record<string, any>` with `Record<string, unknown>` or a proper params type; replace `(state: any)` with a typed raw-API state (e.g. device state with `allowedValues: string`). | Meets P0 exit criteria: no `any` in services. |
| Delete / void responses | Type as `Promise<void>` or `Promise<{ status?: string }>` (or minimal shape) where backend returns a small object. | Explicit and safe. |

---

## 3. API response types to add (api.d.ts)

Minimal set for current backend patterns (no P0-8 dependency):

- **ApiListResponse\<T\>** — for list endpoints: `{ data: { areas: T[] } }` or `{ data: { devices: T[] } }`. Key varies by endpoint; we can use a generic `{ data: { [key: string]: T[] } }` or one type per key (e.g. `AreasListResponse`, `DevicesListResponse`).
- **ApiItemResponse\<T\>** — for single resource: `{ data: { area: T } }` or `{ data: { device: T } }`. Same idea: generic or per-resource.
- **ApiDataPayload\<T\>** — for auth-style `{ data: T }` (e.g. `response.data.data` where `response.data` is `{ data: LoginResponse }`).

To avoid key-name duplication, a practical approach is:

- **ApiDataWrapper\<T\>** — already exists: `{ data: T }`. Use it so that `response.data` is `ApiDataWrapper<{ areas: Area[] }>` for GET /areas, and `response.data.data.areas` is typed.
- Optionally add **ApiListPayload\<T\>** = `{ areas?: Area[]; devices?: Device[]; ... }` or keep inline: `{ data: { areas: Area[] } }` so that `apiClient.get<ApiDataWrapper<{ areas: Area[] }>>(...)` and then `response.data.data.areas` is typed.

Concrete proposal:

- In **api.d.ts**: Add (or reuse) types so that:
  - List: `apiClient.get<ApiDataWrapper<{ areas: Area[] }>>(...)` → `response.data.data.areas` is `Area[]`.
  - Item: `apiClient.get<ApiDataWrapper<{ area: Area }>>(...)` → `response.data.data.area` is `Area`.
  - Auth: `apiClient.post<ApiDataWrapper<LoginResponse>>(...)` → `response.data.data` is `LoginResponse`.
- No need to introduce a new "ApiResponse" union until P0-8; just type the success payload.

---

## 4. Step-by-step implementation

### Phase A: Extend api.d.ts (minimal response helpers)

| Step | Action | Files |
|------|--------|--------|
| A.1 | In `api.d.ts`, ensure we have a way to type nested `data` (e.g. `ApiDataWrapper<T>` already: `{ data: T }`). Add a short comment that list/item responses use `ApiDataWrapper<{ areas: Area[] }>` etc. Optionally add `ApiDeleteResponse` = `{ status?: string }` for delete endpoints. | `src/types/api.d.ts` |

### Phase B: Type each service (alphabetical)

| Step | Service | Actions |
|------|---------|--------|
| B.1 | **areas.service.ts** | Add return types: `Promise<Area[]>`, `Promise<Area>`, `Promise<unknown>` (or minimal type for delete). Type `apiClient.get<ApiDataWrapper<{ areas: Area[] }>>(...)` and equivalent for getAreaById, create, update. Replace `Record<string, any>` with `Record<string, unknown>` or a proper params type. |
| B.2 | **organizations.service.ts** | Same pattern: return types for all functions; type `response.data` with `ApiDataWrapper<{ organizations: Organization[] }>` etc. |
| B.3 | **devices.service.ts** | Return types (`Promise<Device[]>`, `Promise<Device>`, etc.); type get/list responses; type createDevice/updateDevice/deleteDevice response.data so return value is typed (e.g. Device or void). |
| B.4 | **deviceStates.service.ts** | Define a raw API state type (e.g. `DeviceStateRecordApi`) with `allowedValues: string`; use in `response.data.data` typing; replace `(state: any)` with that type. Return types for all functions. |
| B.5 | **deviceDetails.service.ts** | Type `response.data` with domain types (or deviceDetails-specific DTOs); add return types. |
| B.6 | **deviceStateInstances.service.ts** | Type `response.data`; explicit return type for createDeviceStateInstance. |
| B.7 | **sensors.service.ts** | Same as areas: list/item response types; return types for all functions. |
| B.8 | **telemetry.service.ts** | Type response.data; add return types. |
| B.9 | **auth.service.ts** | All functions already have or get explicit return types; type `response.data` (e.g. `ApiDataWrapper<LoginResponse>` for login/signup, `ApiDataWrapper<User>` for getCurrentUser). Add return type for refreshToken. |
| B.10 | **ruleEngineService.ts** | Type each endpoint’s response.data (rules, rule, sensors, devices, deviceStates, etc.) and add return types for every function. |

### Phase C: Remove `any` and stray console.logs (optional)

| Step | Action | Details |
|------|--------|--------|
| C.1 | Replace every `any` in services with a proper type or `unknown`. | e.g. deviceStates `(state: any)` → raw API type; params `Record<string, any>` → `Record<string, unknown>` or typed params. |
| C.2 | Remove or gate debug console.logs in services. | e.g. ruleEngineService, sensors.service, deviceDetails.service. |

---

## 5. Acceptance criteria

- [ ] **AC1** Every API-calling service function has an explicit return type (e.g. `Promise<Area[]>`, `Promise<Area>`, `Promise<void>`).
- [ ] **AC2** Every use of `response.data` (or `response.data.data`) is typed via axios generic or a typed variable (e.g. `apiClient.get<Shape>(...)` or `const data: Shape = response.data`).
- [ ] **AC3** No `any` remains in services (no `(state: any)`, no `Record<string, any>` for params; use domain or api types).
- [ ] **AC4** api.d.ts includes any new response helper types used (e.g. ApiDataWrapper reused; optional ApiDeleteResponse or similar).
- [ ] **AC5** `npx tsc --noEmit` passes; no new linter errors in modified services.

---

## 6. Examples: before vs after

### 6.1 Areas service – getAreas

**Old:** No return type; `response.data` untyped.

```ts
export const getAreas = async (params?: AreaFilterParams) => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get('/areas', { params: enhancedParams });
  return response.data.data.areas;
};
```

**New:** Explicit return type; `response.data` typed via generic.

```ts
export const getAreas = async (params?: AreaFilterParams): Promise<Area[]> => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get<ApiDataWrapper<{ areas: Area[] }>>('/areas', { params: enhancedParams });
  return response.data.data.areas;
};
```

### 6.2 Areas service – getAreaById (params)

**Old:** Params typed as `Record<string, any>`.

```ts
export const getAreaById = async (id: number, params?: Record<string, any>) => {
  // ...
};
```

**New:** Params typed as `Record<string, unknown>` or a specific params interface.

```ts
export const getAreaById = async (id: number, params?: Record<string, unknown>): Promise<Area> => {
  const enhancedParams = withOrganizationId(params);
  const response = await apiClient.get<ApiDataWrapper<{ area: Area }>>(`/areas/${id}`, { params: enhancedParams });
  return response.data.data.area;
};
```

### 6.3 DeviceStates service – getDeviceStates (map callback)

**Old:** `(state: any)` in map.

```ts
const states = response.data.data.map((state: any) => ({
  ...state,
  allowedValues: JSON.parse(state.allowedValues)
}));
```

**New:** Raw API type (e.g. `DeviceStateRecordApi`) with `allowedValues: string`; callback typed.

```ts
interface DeviceStateRecordApi extends Omit<DeviceStateRecord, 'allowedValues'> {
  allowedValues: string;
}
const response = await apiClient.get<ApiDataWrapper<DeviceStateRecordApi[]>>(...);
const states = response.data.data.map((state: DeviceStateRecordApi) => ({
  ...state,
  allowedValues: JSON.parse(state.allowedValues) as string[]
}));
```

---

## 7. Risk and rollback

- **Risk:** Backend may return slightly different keys (e.g. `data.area` vs `data.areas` for a single item). Typing will catch mismatches at compile time; adjust types to match real API.
- **Rollback:** Revert service and api.d.ts changes; restore untyped `response.data` if needed.

---

## 8. Out of scope (optional follow-up)

- P0-8 full adoption: services return `Promise<ApiResponse<T>>` and/or throw typed `ApiError`; thunks then rely on that contract.
- Centralizing all API response DTOs in api.d.ts (we add minimal helpers; per-endpoint shapes can stay in services or be moved later).
- Changing backend API shape; this plan types the current shape only.

Acceptance criteria (high level)
AC1: Every API service function has an explicit return type.
AC2: Every response.data usage is typed (via generic or typed variable).
AC3: No any in services.
AC4: api.d.ts has any new response types used.
AC5: tsc and linter pass.

**Implementation status:** Done. All services (areas, organizations, devices, deviceStates, deviceDetails, deviceStateInstances, sensors, telemetry, auth, ruleEngineService) have explicit return types, typed `apiClient` calls with `ApiDataWrapper`/`ApiDeleteResponse`, and no `any`. `api.d.ts` includes `ApiDeleteResponse`; `ApiDataWrapper<T>` is used throughout. `npx tsc --noEmit` passes.

Examples in the doc
getAreas: before (untyped) vs after (return type + apiClient.get<ApiDataWrapper<{ areas: Area[] }>>).
getAreaById: params Record<string, any> → Record<string, unknown> (or specific type) and typed response.
deviceStates map: (state: any) → raw API type (e.g. DeviceStateRecordApi with allowedValues: string) and typed callback.
