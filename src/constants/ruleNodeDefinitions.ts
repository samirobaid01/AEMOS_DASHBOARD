import type { RuleNodeDefinition, ConfigField } from '../types/ruleEngine';
import type { SelectOption } from '../types/ui';

const operatorOptions: SelectOption[] = [
  { value: '==', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '>=', label: 'Greater Than or Equal' },
  { value: '<=', label: 'Less Than or Equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'in', label: 'In' },
  { value: 'between', label: 'Between' },
];

const sourceTypeOptions: SelectOption[] = [
  { value: 'sensor', label: 'Sensor' },
  { value: 'device', label: 'Device' },
];

const filterConfigSchema: ConfigField[] = [
  { type: 'select', key: 'sourceType', label: 'Source Type', options: sourceTypeOptions },
  { type: 'sensorKey', key: 'UUID', label: 'Sensor or Device' },
  { type: 'sensorKey', key: 'key', label: 'Key' },
  { type: 'operator', key: 'operator', label: 'Operator', options: operatorOptions },
  { type: 'text', key: 'value', label: 'Value', placeholder: 'Enter value' },
  { type: 'duration', key: 'duration', label: 'Duration' },
];

const actionConfigSchema: ConfigField[] = [
  { type: 'text', key: 'deviceUuid', label: 'Device' },
  { type: 'text', key: 'stateName', label: 'Device State' },
  { type: 'text', key: 'value', label: 'State Value', placeholder: 'Enter value' },
];

export const FILTER_NODE_DEFINITION: RuleNodeDefinition = {
  type: 'filter',
  label: 'Filter',
  icon: 'filter',
  configSchema: filterConfigSchema,
};

export const ACTION_NODE_DEFINITION: RuleNodeDefinition = {
  type: 'action',
  label: 'Action',
  icon: 'action',
  configSchema: actionConfigSchema,
};

export const RULE_NODE_DEFINITIONS: Record<'filter' | 'action', RuleNodeDefinition> = {
  filter: FILTER_NODE_DEFINITION,
  action: ACTION_NODE_DEFINITION,
};

export function getRuleNodeDefinition(type: 'filter' | 'action'): RuleNodeDefinition {
  return RULE_NODE_DEFINITIONS[type];
}
