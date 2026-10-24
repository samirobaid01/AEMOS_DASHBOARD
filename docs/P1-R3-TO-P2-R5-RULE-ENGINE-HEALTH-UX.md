# P1-R3 → P2-R5: Rule Engine — Code Health & UX

**Scope:** P1-R3–P1-R8 (code health, no behavior changes), P2-R1–P2-R5 (UX improvements, additive).  
**Goal:** Reduce maintenance burden inside the rule engine module and add a friendlier creation/editing experience alongside the existing NodeDialog / ActionDialog — zero breaking changes.

Prerequisites: P1-R1, P1-R2 done.

---

## Phase 1 — Code Health (P1-R3 → P1-R8)

No visible behavior changes. Each item is independent; they can be done in any order or in one PR.

---

### P1-R3 · Delete unused ExpressionBuilder class

**File:** `src/components/ruleEngine/ExpressionBuilder.ts`

**Problem:**  
The file defines an `ExpressionBuilder` class and its own `Condition` / `ConditionGroup` types — a completely different data model from what `NodeDialog.tsx` actually uses (`expressions[]` arrays, `ConditionData` / `GroupData`). It is never imported anywhere in the project. It actively misleads any developer reading the codebase about how conditions are structured.

**Fix:**  
1. Confirm zero references: `grep -r "ExpressionBuilder" src/`  
2. Delete the file.

**Risk:** Low — no imports to update.

---

### P1-R4 · Remove dead dialog instances from RuleEdit container

**File:** `src/containers/RuleEngine/RuleEdit.tsx` · lines 211–232

**Problem:**  
Two dialog components — `<NodeDialog open={false}>` and `<ActionDialog open={false}>` — are rendered in the container with hardcoded `open={false}` and empty callbacks. They are never triggered. The live dialogs are already managed inside `RuleForm`. These ghost instances mount/unmount with every render and add noise to the component tree.

**Fix:**  
Delete the two JSX blocks. No functional change — `RuleForm` owns the dialogs correctly.

**Risk:** Low — no functional path goes through these instances.

---

### P1-R5 · Reconcile the duplicate RuleEngineState type

**Files:** `src/types/ruleEngine.d.ts` · `src/state/slices/ruleEngine.slice.ts`

**Problem:**  
There are two separate `RuleEngineState` definitions. The exported one in `ruleEngine.d.ts` is missing `sensors`, `devices`, `deviceStates`, `lastFetchedDeviceId`, and `sensorDetails`. The slice re-declares a local version with those fields and uses it instead. The shared type is stale and misleads any developer who reads it.

**Fix:**  
1. Extend the shared `RuleEngineState` in `ruleEngine.d.ts` with the missing five fields.  
2. Remove the local re-declaration in the slice.  
3. Import the shared type: `import type { RuleEngineState } from '@/types/ruleEngine'`.

**Risk:** Low — the runtime state shape does not change.

---

### P1-R6 · Centralize node config serialization

**Files:** `src/components/ruleEngine/RuleForm.tsx` · `NodeDialog.tsx` · `ActionDialog.tsx`  
**New file:** `src/utils/ruleNodeConfig.ts`

**Problem:**  
Node `config` is stored as a JSON string on the wire. It is parsed in `RuleForm.getInitialExpression`, serialized again to pass to dialogs, parsed again in `NodeDialog.loadExpressionData`, then serialized again on save — three separate round-trips across three files with no shared utility. A format change requires updating multiple callsites; stack traces point to the wrong file.

**Fix:**  
Create `src/utils/ruleNodeConfig.ts` with two typed helpers:

```ts
export function parseNodeConfig<T = unknown>(raw: string): T { ... }
export function serializeNodeConfig(config: unknown): string { ... }
```

Replace every inline `JSON.parse` / `JSON.stringify` on `config` in `RuleForm`, `NodeDialog`, and `ActionDialog` with these two calls. One file to audit when the schema changes.

**Risk:** Medium — touches three files. Behavior is identical; test with an existing rule before merging.

---

### P1-R7 · Remove console.log debug statements

**Files:** `src/state/slices/ruleEngine.slice.ts` (lines 363, 368, 372, 381, 386, 391) · `src/containers/RuleEngine/RuleEdit.tsx` (lines 57, 73–87) · `src/components/ruleEngine/RuleForm.tsx` · `src/containers/RuleEngine/RuleCreate.tsx`

**Problem:**  
Development `console.log` calls are scattered across four files — in Redux thunk fulfilled/rejected handlers and in component render paths. They log internal state, rule configs, and API responses to the browser console in production.

**Fix:**  
1. Full list: `grep -n "console.log" src/components/ruleEngine/ src/containers/RuleEngine/ src/state/slices/ruleEngine.slice.ts`  
2. Delete each one.  
3. Consider adding an ESLint `no-console` rule to prevent recurrence.

**Risk:** Low — logging only.

---

### P1-R8 · Break the sensor/device prop-drilling chain

**Files:** `src/containers/RuleEngine/RuleCreate.tsx` · `RuleEdit.tsx` · `src/components/ruleEngine/RuleForm.tsx` · `NodeDialog.tsx` · `ActionDialog.tsx`

**Problem:**  
Ten props — `sensors`, `devices`, `deviceStates`, `lastFetchedDeviceId`, `sensorDetails`, `onFetchSensorDetails`, `onFetchDeviceStates`, and related — are threaded through three component layers purely to reach the dialogs. Every intermediate component receives them only to pass them down. Adding or renaming a prop requires changes in all five files.

**Fix:**  
Move the `useSelector` calls for sensors, devices, `deviceStates`, `sensorDetails`, and `lastFetchedDeviceId` directly into `NodeDialog` and `ActionDialog`. They already depend on Redux for dispatch. The containers keep the `useDispatch` calls that trigger fetch thunks on mount, but stop threading the results as props. This removes 6–8 props from every intermediate interface.

Note: `onFetchSensorDetails` and `onFetchDeviceStates` callback props can be replaced by `useAppDispatch` calls inside the dialogs.

**Risk:** Medium — interface changes across five files. No logic change; verify dialogs still trigger fetches on first open.

---

## Phase 2 — UX Improvements (P2-R1 → P2-R5)

All additive. New components share the same Redux store and existing dialogs. No routes or containers are removed.

---

### P2-R1 · Add a step indicator to rule creation

**Files:** new `src/components/ruleEngine/RuleCreationStepper.tsx` · `src/components/ruleEngine/RuleCreate.tsx`

**Problem:**  
The two-step creation flow — save chain metadata first, then add nodes — is invisible to the user. The node section appears after clicking Save with no explanation. New users submit the form and stare at a blank area, unsure what happened or what to do next. There is no progress bar, step label, or explanatory text.

**Fix:**  
Create a `RuleCreationStepper` component with four named steps:

| Step | Label | Active when |
|------|-------|-------------|
| 1 | Name & Description | `ruleChainId` is null |
| 2 | Add Conditions | `ruleChainId` set, no filter nodes yet |
| 3 | Add Actions | filter nodes added, no action nodes yet |
| 4 | Review & Finish | action nodes added |

Render it at the top of `RuleCreate`. It reads `ruleChainId` and the current node list as props — no logic changes to containers. The `Finish` button already exists; the stepper just makes the flow visible.

**Risk:** Low — new component only, no logic changes.

---

### P2-R2 · Replace raw JSON display with readable condition cards

**Files:** new `src/components/ruleEngine/NodeSummary.tsx` · `src/components/ruleEngine/RuleForm.tsx` · `src/components/ruleEngine/RuleDetails.tsx`

**Problem:**  
In `RuleForm` and `RuleDetails`, each node's configuration is rendered as a raw `<pre>JSON.stringify(config, null, 2)</pre>` block. A filter node with three nested conditions becomes 40 lines of JSON. Nobody reads this in practice.

**Fix:**  
Create a `NodeSummary` component that:
1. Calls `parseNodeConfig` (P1-R6) to get the typed config.  
2. For filter nodes: renders each condition as a row of labeled chips — source type, key, operator, value — with AND/OR connectors for grouped conditions.  
3. For action nodes: renders `Device · <deviceUuid> → <stateName> = <value>` as a single line.  
4. Keeps the raw `<pre>` block available under a collapsed "Show raw config" toggle (for debugging).

Replace the `<pre>` blocks in `RuleForm` and `RuleDetails` with `<NodeSummary node={node} />`.

**Risk:** Low — display-only component, no changes to save/load logic.

---

### P2-R3 · Bring next-node wiring into the Edit page

**Files:** `src/components/ruleEngine/RuleForm.tsx` · `src/containers/RuleEngine/RuleEdit.tsx`

**Problem:**  
Editing a rule's conditions and wiring node execution order are split across two pages (Edit and Details), requiring separate navigations. The `nextNodeId` select exists only on the Details page.

**Fix:**  
Add the `nextNodeId` select to each node row in `RuleForm` when used in edit mode. Pass an `isEditMode` prop (already distinguishable from `ruleChainId` being set) to `RuleForm`. The `onUpdateNode` callback in `RuleEdit` already dispatches `updateRuleNode` — just include `nextNodeId` in the patch payload alongside config/name changes.

The Details page keeps its own select unchanged.

**Risk:** Medium — adds a new field to the node update flow. Verify that `nextNodeId: null` does not accidentally overwrite existing wiring when saving a node edit.

---

### P2-R4 · Disable unimplemented action types in ActionDialog

**File:** `src/components/ruleEngine/ActionDialog.tsx` · lines 260–265

**Problem:**  
The action type dropdown offers three options: Device Command, Notification, and Email. Only Device Command renders any form fields. Selecting Notification or Email shows a completely blank dialog body — no form, no error, no explanation. Users assume the dialog is broken.

**Fix:**  
Mark Notification and Email options as `disabled` and append a "(coming soon)" label. One line change per option. When those types are implemented, remove the flag and add the form fields.

**Risk:** Low — one-line change per option; no logic affected.

---

### P2-R5 · Fix silent UUID auto-reset in ConditionBuilder

**File:** `src/components/ruleEngine/NodeDialog.tsx` · lines 351–361

**Problem:**  
When there is exactly one sensor or device in the list, a `useEffect` inside `ConditionBuilder` automatically overwrites the stored UUID with the only available option. If a user edits an existing condition that targeted a since-deleted sensor, the UUID is silently replaced with whatever is currently available — the condition changes without any indication.

**Fix:**  
Remove the auto-override. Instead, when the currently stored UUID does not appear in the available options list:
1. Keep the stored UUID in state (do not overwrite it).  
2. Show a warning next to the sensor/device select: `"Previously selected sensor no longer available — please re-select."`  
3. Disable the Save button until the user explicitly picks a valid option.

**Risk:** Medium — changes behavior of condition editing. Test with a sensor UUID that does not exist in the current list.

---

## Summary

| ID | Item | Phase | Risk | Status |
|----|------|-------|------|--------|
| P1-R3 | Delete ExpressionBuilder dead code | Code health | Low | Done |
| P1-R4 | Remove dead dialogs in RuleEdit container | Code health | Low | Done |
| P1-R5 | Reconcile duplicate RuleEngineState type | Code health | Low | Done |
| P1-R6 | Centralize node config serialization | Code health | Medium | Done |
| P1-R7 | Remove console.log debug statements | Code health | Low | Done |
| P1-R8 | Break sensor/device prop-drilling | Code health | Medium | Done |
| P2-R1 | Rule creation step indicator | UX | Low | Done |
| P2-R2 | NodeSummary — readable condition display | UX | Low | Done |
| P2-R3 | Next-node wiring on Edit page | UX | Medium | Done |
| P2-R4 | Disable unimplemented action types | UX | Low | Done |
| P2-R5 | Fix silent UUID auto-reset | UX | Medium | Done |

**Suggested PR grouping:**

| PR | Tasks |
|----|-------|
| PR-RE1 | P1-R3, P1-R4, P1-R5, P1-R7 — zero-risk cleanup, one pass |
| PR-RE2 | P1-R6 — config serialization utility |
| PR-RE3 | P1-R8 — prop-drilling removal |
| PR-RE4 | P2-R1, P2-R2, P2-R4 — additive display improvements |
| PR-RE5 | P2-R3, P2-R5 — edit-flow changes |
