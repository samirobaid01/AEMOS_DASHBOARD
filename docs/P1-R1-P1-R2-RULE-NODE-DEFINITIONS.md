# P1-R1, P1-R2: RuleNodeDefinition and ConfigField

**Scope:** P1-R1 (RuleNodeDefinition abstraction), P1-R2 (ConfigField discriminated union).  
**Goal:** Schema-driven rule node types so UI can render and validate config dynamically; adding new node types does not require UI logic changes.

---

## 1. P1-R2: ConfigField typing

### 1.1 Purpose

A discriminated union describing one field in a node’s config. Used in `RuleNodeDefinition.configSchema` so the UI can render the right control (number, select, sensor key, text, duration, operator, boolean) and validate values.

### 1.2 Definition (`src/types/ruleEngine.d.ts`)

| Variant | Shape | Use |
|--------|--------|-----|
| `number` | `type: 'number'; key: string; label?: string; min?: number; max?: number` | Numeric input with optional min/max. |
| `select` | `type: 'select'; key: string; label?: string; options: SelectOption[]` | Dropdown; options from `types/ui` SelectOption. |
| `sensorKey` | `type: 'sensorKey'; key: string; label?: string` | Key that refers to a sensor/device (e.g. UUID, key). |
| `deviceKey` | `type: 'deviceKey'; key: string; label?: string` | Key that refers to a device. |
| `text` | `type: 'text'; key: string; label?: string; placeholder?: string` | Free-text input. |
| `duration` | `type: 'duration'; key: string; label?: string` | Duration (e.g. s\|m\|h\|d). |
| `operator` | `type: 'operator'; key: string; label?: string; options: SelectOption[]` | Operator dropdown (e.g. ==, !=, contains). |
| `boolean` | `type: 'boolean'; key: string; label?: string` | Boolean toggle/select. |

`SelectOption` is imported from `types/ui` (`value: string | number`, `label: string`).

### 1.3 Location

- **Types:** `src/types/ruleEngine.d.ts` (exported), re-exported from `src/types/ruleEngine.ts`.

---

## 2. P1-R1: RuleNodeDefinition abstraction

### 2.1 Purpose

Describes a node type (filter or action) and the schema of its config. The UI can render nodes from this definition; validation can be driven by `configSchema`; new node types are added by extending the schema, not by changing UI branches.

### 2.2 Definition (`src/types/ruleEngine.d.ts`)

```ts
interface RuleNodeDefinition {
  type: 'filter' | 'action';
  label: string;
  icon?: string;
  configSchema: ConfigField[];
}
```

- **type:** Node kind (`'filter' | 'action'`).
- **label:** Display name (e.g. "Filter", "Action").
- **icon:** Optional icon name or identifier.
- **configSchema:** Array of `ConfigField` describing each config field.

### 2.3 Registry (`src/constants/ruleNodeDefinitions.ts`)

- **FILTER_NODE_DEFINITION:** Filter node with schema for sourceType, UUID, key, operator, value, duration.
- **ACTION_NODE_DEFINITION:** Action node with schema for deviceUuid, stateName, value.
- **RULE_NODE_DEFINITIONS:** `Record<'filter' | 'action', RuleNodeDefinition>`.
- **getRuleNodeDefinition(type):** Returns the definition for a given node type.

Existing NodeDialog/ActionDialog do not yet render from these definitions; they can be refactored to use `getRuleNodeDefinition(type)` and iterate over `configSchema` to build the form and validation.

### 2.4 Location

- **Types:** `src/types/ruleEngine.d.ts`, `src/types/ruleEngine.ts`.
- **Constants:** `src/constants/ruleNodeDefinitions.ts`.

---

## 3. Summary

| ID | Item | Location | Status |
|----|------|----------|--------|
| P1-R1 | RuleNodeDefinition (type, label, icon?, configSchema) | types/ruleEngine.d.ts, constants/ruleNodeDefinitions.ts | Done |
| P1-R2 | ConfigField discriminated union | types/ruleEngine.d.ts | Done |

Next steps (optional): refactor NodeDialog and ActionDialog to render from `RuleNodeDefinition.configSchema` and use ConfigField for validation and FormField wiring.
