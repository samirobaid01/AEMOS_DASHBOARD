import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Device } from "../../types/device";
import type { Sensor } from "../../types/sensor";
import * as deviceStatesService from '../../services/deviceStates.service';
import { useSelector } from 'react-redux';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';

interface ConditionData {
  sourceType: 'sensor' | 'device';
  UUID: string;
  key: string;
  operator: string;
  value: string | number | number[] | string[];
}

interface GroupData {
  type: 'AND' | 'OR';
  expressions: Array<ConditionData | GroupData>;
}

interface ParsedExpression {
  sourceType?: string;
  UUID?: string;
  key?: string;
  operator?: string;
  value?: string | number | number[] | string[];
  type?: string;
  expressions?: ParsedExpression[];
}

interface ConfigObject {
  type: string;
  expressions: ParsedExpression[];
}

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  onUpdate?: (nodeId: number, data: any) => void;
  ruleChainId?: number;
  mode: 'add' | 'edit';
  initialExpression?: {
    id?: number;
    name?: string;
    type: 'filter' | 'action';
    sourceType?: string;
    UUID?: string;
    key?: string;
    operator?: string;
    value?: string | number;
    config?: string;
  };
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}

const OPERATORS = [
  // Basic comparisons
  { value: "==", label: "Equals", category: "comparison", valueType: "single" },
  { value: "!=", label: "Not Equals", category: "comparison", valueType: "single" },
  { value: ">", label: "Greater Than", category: "comparison", valueType: "single" },
  { value: "<", label: "Less Than", category: "comparison", valueType: "single" },
  { value: ">=", label: "Greater Than or Equal", category: "comparison", valueType: "single" },
  { value: "<=", label: "Less Than or Equal", category: "comparison", valueType: "single" },
  
  // Null/Empty checks
  { value: "isNull", label: "Is Null", category: "null", valueType: "none" },
  { value: "isNotNull", label: "Is Not Null", category: "null", valueType: "none" },
  { value: "isEmpty", label: "Is Empty", category: "null", valueType: "none" },
  { value: "isNotEmpty", label: "Is Not Empty", category: "null", valueType: "none" },
  
  // Type checks
  { value: "isNumber", label: "Is Number", category: "type", valueType: "none" },
  { value: "isString", label: "Is String", category: "type", valueType: "none" },
  { value: "isBoolean", label: "Is Boolean", category: "type", valueType: "none" },
  { value: "isArray", label: "Is Array", category: "type", valueType: "none" },
  
  // Numeric operations
  { value: "between", label: "Between", category: "numeric", valueType: "range" },
  
  // String operations
  { value: "contains", label: "Contains", category: "string", valueType: "single" },
  { value: "notContains", label: "Not Contains", category: "string", valueType: "single" },
  { value: "startsWith", label: "Starts With", category: "string", valueType: "single" },
  { value: "endsWith", label: "Ends With", category: "string", valueType: "single" },
  { value: "matches", label: "Matches Regex", category: "string", valueType: "single" },
  
  // Array operations
  { value: "in", label: "In", category: "array", valueType: "array" },
  { value: "notIn", label: "Not In", category: "array", valueType: "array" },
  { value: "hasAll", label: "Has All", category: "array", valueType: "array" },
  { value: "hasAny", label: "Has Any", category: "array", valueType: "array" },
  { value: "hasNone", label: "Has None", category: "array", valueType: "array" },
  
  // Time operations
  { value: "olderThan", label: "Older Than (seconds)", category: "time", valueType: "single" },
  { value: "newerThan", label: "Newer Than (seconds)", category: "time", valueType: "single" },
  { value: "inLast", label: "In Last (seconds)", category: "time", valueType: "single" },
];

// Helper function to get operator configuration
const getOperatorConfig = (operatorValue: string) => {
  return OPERATORS.find(op => op.value === operatorValue) || { value: operatorValue, label: operatorValue, category: "comparison", valueType: "single" };
};

// Value Input Component for different operator types
const ValueInput: React.FC<{
  operator: string;
  value: string | number | number[] | string[];
  onChange: (value: string | number | number[] | string[]) => void;
}> = ({ operator, value, onChange }) => {
  const operatorConfig = getOperatorConfig(operator);
  const { t } = useTranslation();

  const handleSingleValueChange = (newValue: string) => {
    // Try to convert to number if it looks like a number
    const numberValue = Number(newValue);
    if (!isNaN(numberValue) && newValue.trim() !== '') {
      onChange(numberValue);
    } else {
      onChange(newValue);
    }
  };

  const handleRangeValueChange = (index: 0 | 1, newValue: string) => {
    const currentValue = Array.isArray(value) ? value as number[] : [0, 0];
    const numberValue = Number(newValue);
    const newRangeValue: number[] = [...currentValue];
    newRangeValue[index] = !isNaN(numberValue) ? numberValue : 0;
    onChange(newRangeValue);
  };

  const handleArrayValueChange = (newValue: string) => {
    // Parse comma-separated values, keeping them as strings or converting to numbers
    const arrayValue = newValue.split(',').map(item => {
      const trimmed = item.trim();
      const numberValue = Number(trimmed);
      // Only convert to number if it's a valid number and not an empty string
      return !isNaN(numberValue) && trimmed !== '' && trimmed !== '.' ? numberValue : trimmed;
    }).filter(item => item !== '');
    
    // Determine if this should be a string array or number array
    const hasNumbers = arrayValue.some(item => typeof item === 'number');
    const hasStrings = arrayValue.some(item => typeof item === 'string' && item !== '');
    
    if (hasNumbers && !hasStrings) {
      // All numbers
      onChange(arrayValue.filter((item): item is number => typeof item === 'number'));
    } else {
      // Mixed or all strings - convert all to strings
      onChange(arrayValue.map(item => String(item)));
    }
  };

  switch (operatorConfig.valueType) {
    case 'none':
      return null; // No input needed for operators like isNull, isNumber, etc.

    case 'range':
      const rangeValue = Array.isArray(value) ? value : [0, 0];
      return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 200 }}>
          <TextField
            label="Min"
            type="number"
            value={rangeValue[0] || ''}
            onChange={(e) => handleRangeValueChange(0, e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <Typography variant="body2">to</Typography>
          <TextField
            label="Max"
            type="number"
            value={rangeValue[1] || ''}
            onChange={(e) => handleRangeValueChange(1, e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>
      );

    case 'array':
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value || '');
      return (
        <TextField
          label="Values (comma-separated)"
          value={displayValue}
          onChange={(e) => handleArrayValueChange(e.target.value)}
          sx={{ minWidth: 200 }}
          placeholder="value1, value2, value3"
          helperText="Enter values separated by commas"
        />
      );

    case 'single':
    default:
      return (
        <TextField
          label="Value"
          value={Array.isArray(value) ? value.join(', ') : String(value || '')}
          onChange={(e) => handleSingleValueChange(e.target.value)}
          sx={{ minWidth: 120 }}
          placeholder={operatorConfig.category === 'string' ? 'Enter text' : 'Enter value'}
        />
      );
  }
};

// Function to optimize the structure by removing unnecessary single-expression groups
const optimizeStructure = (data: GroupData | ConditionData, isRoot: boolean = true): any => {
  console.log('Optimizing structure:', data, 'isRoot:', isRoot);
  
  // If it's a condition, return it as-is
  if ('sourceType' in data) {
    console.log('Found condition, returning as-is');
    return data;
  }
  
  // Only flatten single-expression groups at the ROOT level
  if (isRoot && data.expressions.length === 1) {
    console.log('Found single-expression group at root level, flattening');
    // Recursively optimize the single expression (but it's no longer root)
    return optimizeStructure(data.expressions[0], false);
  }
  
  // For nested groups OR multiple expressions, keep the group but optimize nested expressions
  if (data.expressions.length >= 1) {
    console.log('Found group (nested or multi-expression), preserving structure and optimizing nested expressions');
    return {
      type: data.type,
      expressions: data.expressions.map(expr => optimizeStructure(expr, false))
    };
  }
  
  // If no expressions, return null (this shouldn't happen in normal usage)
  console.log('Found empty group, returning null');
  return null;
};

const ConditionBuilder: React.FC<{
  condition: ConditionData;
  onChange: (newCondition: ConditionData) => void;
  onDelete?: () => void;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}> = ({ condition, onChange, onDelete, sensors, devices, sensorDetails, onFetchSensorDetails }) => {
  const { t } = useTranslation();
  const [isLoadingSensorDetails, setIsLoadingSensorDetails] = useState(false);
  const [isLoadingDeviceStates, setIsLoadingDeviceStates] = useState(false);
  const [deviceStates, setDeviceStates] = useState<any[]>([]);
  const lastFetchTime = useRef<number>(0);
  const organizationId = useSelector(selectSelectedOrganizationId);

  // Load sensor details when UUID changes or when sensors/devices update
  useEffect(() => {
    console.log("I am called on changing the value in first dropdown");
    const loadSensorDetails = async () => {
      if (condition.sourceType === 'sensor' && condition.UUID) {
        const sensor = sensors.find(s => s.uuid === condition.UUID);
        if (sensor && !sensorDetails[condition.UUID]) {
          const now = Date.now();
          // Only fetch if more than 300ms has passed since last fetch
          if (now - lastFetchTime.current > 300) {
            setIsLoadingSensorDetails(true);
            try {
              lastFetchTime.current = now;
              await onFetchSensorDetails(sensor.id);
            } catch (error) {
              console.error('Error fetching sensor details:', error);
            } finally {
              setIsLoadingSensorDetails(false);
            }
          }
        }
      }
    };

    loadSensorDetails();
  }, [condition.UUID, condition.sourceType, sensors, devices, sensorDetails, onFetchSensorDetails]);

  // Fetch device states when a device is selected
  useEffect(() => {
    const fetchDeviceStatesForDevice = async () => {
      if (condition.sourceType === 'device' && condition.UUID && organizationId) {
        const device = devices.find(d => d.uuid === condition.UUID);
        if (device?.id) {
          setIsLoadingDeviceStates(true);
          try {
            const states = await deviceStatesService.getDeviceStates(device.id, organizationId);
            setDeviceStates(states || []);
          } catch (error) {
            console.error('Error fetching device states:', error);
            setDeviceStates([]);
          } finally {
            setIsLoadingDeviceStates(false);
          }
        }
      } else {
        setDeviceStates([]);
      }
    };

    fetchDeviceStatesForDevice();
  }, [condition.UUID, condition.sourceType, devices, organizationId]);

  const handleSourceTypeChange = (newSourceType: 'sensor' | 'device') => {
    const newUUID = newSourceType === 'sensor' ? sensors[0]?.uuid : devices[0]?.uuid;
    onChange({
      ...condition,
      sourceType: newSourceType,
      UUID: newUUID || '',
      key: ''
    });
  };

  const handleUUIDChange = (newUUID: string) => {
    onChange({
      ...condition,
      UUID: newUUID,
      key: ''
    });
  };

  const getAvailableKeys = () => {
    if (condition.sourceType === 'sensor') {
      if (isLoadingSensorDetails || !sensorDetails[condition.UUID]) {
        return [];
      }
      return sensorDetails[condition.UUID].TelemetryData?.map(td => ({
        value: td.variableName,
        label: td.variableName
      })) || [];
    } else {
      // For devices, use the fetched device states
      if (isLoadingDeviceStates) {
        return [];
      }
      
      // Extract stateName from device states response
      return deviceStates.map(state => ({
        value: state.stateName,
        label: state.stateName
      }));
    }
  };

  const availableKeys = getAvailableKeys();
  const currentKey = condition.key;

  // Reset key if it's not in available options
  useEffect(() => {
    if (currentKey && availableKeys.length > 0 && !availableKeys.some(k => k.value === currentKey)) {
      onChange({
        ...condition,
        key: ''
      });
    }
  }, [availableKeys, currentKey]);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Source Type</InputLabel>
        <Select
          value={condition.sourceType}
          onChange={(e) => handleSourceTypeChange(e.target.value as 'sensor' | 'device')}
          label="Source Type"
        >
          <MenuItem value="sensor">Sensor</MenuItem>
          <MenuItem value="device">Device</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>{condition.sourceType === 'sensor' ? 'Sensor' : 'Device'}</InputLabel>
        <Select
          value={condition.UUID}
          onChange={(e) => handleUUIDChange(e.target.value)}
          label={condition.sourceType === 'sensor' ? 'Sensor' : 'Device'}
        >
          {((condition.sourceType === 'sensor' ? sensors : devices) || []).map((item) => (
            <MenuItem key={item.uuid} value={item.uuid}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Key</InputLabel>
        <Select
          value={condition.key}
          onChange={(e) => onChange({ ...condition, key: e.target.value })}
          label="Key"
          disabled={isLoadingSensorDetails || isLoadingDeviceStates || availableKeys.length === 0}
        >
          {availableKeys.length === 0 ? (
            <MenuItem disabled value="">
              {isLoadingSensorDetails || isLoadingDeviceStates ? 'Loading...' : 'No options available'}
            </MenuItem>
          ) : (
            availableKeys.map((key) => (
              <MenuItem key={key.value} value={key.value}>
                {key.label}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={condition.operator}
          onChange={(e) => onChange({ ...condition, operator: e.target.value })}
          label="Operator"
        >
          {/* Basic Comparisons */}
          <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Basic Comparisons
          </MenuItem>
          {OPERATORS.filter(op => op.category === 'comparison').map((op) => (
            <MenuItem key={op.value} value={op.value} sx={{ pl: 3 }}>
              {op.label}
            </MenuItem>
          ))}
          
          {/* Null/Empty Checks */}
          <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
            Null/Empty Checks
          </MenuItem>
          {OPERATORS.filter(op => op.category === 'null').map((op) => (
            <MenuItem key={op.value} value={op.value} sx={{ pl: 3 }}>
              {op.label}
            </MenuItem>
          ))}
          
          {/* Type Checks */}
          <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
            Type Checks
          </MenuItem>
          {OPERATORS.filter(op => op.category === 'type').map((op) => (
            <MenuItem key={op.value} value={op.value} sx={{ pl: 3 }}>
              {op.label}
            </MenuItem>
          ))}
          
          {/* Numeric Operations */}
          <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
            Numeric Operations
          </MenuItem>
          {OPERATORS.filter(op => op.category === 'numeric').map((op) => (
            <MenuItem key={op.value} value={op.value} sx={{ pl: 3 }}>
              {op.label}
            </MenuItem>
          ))}
          
          {/* String Operations */}
          <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
            String Operations
          </MenuItem>
          {OPERATORS.filter(op => op.category === 'string').map((op) => (
            <MenuItem key={op.value} value={op.value} sx={{ pl: 3 }}>
              {op.label}
            </MenuItem>
          ))}
          
          {/* Array Operations */}
          <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
            Array Operations
          </MenuItem>
          {OPERATORS.filter(op => op.category === 'array').map((op) => (
            <MenuItem key={op.value} value={op.value} sx={{ pl: 3 }}>
              {op.label}
            </MenuItem>
          ))}
          
          {/* Time Operations */}
          <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
            Time Operations
          </MenuItem>
          {OPERATORS.filter(op => op.category === 'time').map((op) => (
            <MenuItem key={op.value} value={op.value} sx={{ pl: 3 }}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ValueInput
        operator={condition.operator}
        value={condition.value}
        onChange={(newValue) => onChange({ ...condition, value: newValue })}
      />

      {onDelete && (
        <IconButton onClick={onDelete} color="error" sx={{ ml: 'auto' }}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

const ExpressionGroup: React.FC<{
  group: GroupData;
  onChange: (newGroup: GroupData) => void;
  onDelete?: () => void;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}> = ({ group, onChange, onDelete, sensors, devices, sensorDetails, onFetchSensorDetails }) => {
  const handleTypeChange = (newType: 'AND' | 'OR') => {
    onChange({ ...group, type: newType });
  };

  const handleExpressionChange = (index: number, newExpression: ConditionData | GroupData) => {
    const newExpressions = [...group.expressions];
    newExpressions[index] = newExpression;
    onChange({ ...group, expressions: newExpressions });
  };

  const handleDeleteExpression = (index: number) => {
    const newExpressions = group.expressions.filter((_, i) => i !== index);
    onChange({ ...group, expressions: newExpressions });
  };

  const addCondition = () => {
    onChange({
      ...group,
      expressions: [...group.expressions, {
        sourceType: 'sensor',
        UUID: sensors[0]?.uuid || '',
        key: '',
        operator: '==',
        value: ''
      }]
    });
  };

  const addGroup = () => {
    onChange({
      ...group,
      expressions: [...group.expressions, {
        type: 'AND',
        expressions: []
      }]
    });
  };

  return (
    <Box sx={{ 
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      p: 2,
      mb: 2,
      bgcolor: 'background.paper'
    }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Group Type</InputLabel>
            <Select
              value={group.type}
              onChange={(e) => handleTypeChange(e.target.value as 'AND' | 'OR')}
              label="Group Type"
            >
              <MenuItem value="AND">AND</MenuItem>
              <MenuItem value="OR">OR</MenuItem>
            </Select>
          </FormControl>
          
          {onDelete && (
            <IconButton onClick={onDelete} color="error" sx={{ ml: 'auto' }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        {group.expressions.map((expr, index) => (
          <Box key={index}>
            {index > 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ my: 1, textAlign: 'center' }}>
                {group.type}
              </Typography>
            )}
            {'sourceType' in expr ? (
              <ConditionBuilder
                condition={expr}
                onChange={(newCondition) => handleExpressionChange(index, newCondition)}
                onDelete={() => handleDeleteExpression(index)}
                sensors={sensors}
                devices={devices}
                sensorDetails={sensorDetails}
                onFetchSensorDetails={onFetchSensorDetails}
              />
            ) : (
              <ExpressionGroup
                group={expr}
                onChange={(newGroup) => handleExpressionChange(index, newGroup)}
                onDelete={() => handleDeleteExpression(index)}
                sensors={sensors}
                devices={devices}
                sensorDetails={sensorDetails}
                onFetchSensorDetails={onFetchSensorDetails}
              />
            )}
          </Box>
        ))}

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<AddIcon />}
            onClick={addCondition}
            variant="outlined"
            size="small"
          >
            Add Condition
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={addGroup}
            variant="outlined"
            size="small"
          >
            Add Group
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const parseExistingConfig = (initialExpression: NodeDialogProps['initialExpression'], defaultUUID: string = ''): GroupData => {
  // Default empty group
  const defaultGroup: GroupData = {
    type: 'AND',
    expressions: [{
      sourceType: 'sensor',
      UUID: defaultUUID,
      key: '',
      operator: '==',
      value: ''
    }]
  };

  if (!initialExpression) {
    return defaultGroup;
  }

  try {
    if (initialExpression.config) {
      const parsedConfig = JSON.parse(initialExpression.config) as ParsedExpression;
      
      // Validate the parsed config
      if (parsedConfig && 
          typeof parsedConfig === 'object' && 
          'type' in parsedConfig && 
          'expressions' in parsedConfig &&
          Array.isArray(parsedConfig.expressions)) {
        
        // Validate each expression in the group
        const validExpressions = parsedConfig.expressions.map((expr: ParsedExpression) => {
          if (expr.sourceType && expr.UUID && expr.key && expr.operator && expr.value !== undefined) {
            return {
              sourceType: expr.sourceType as 'sensor' | 'device',
              UUID: expr.UUID,
              key: expr.key,
              operator: expr.operator,
              value: expr.value
            };
          } else if (expr.type && expr.expressions) {
            // Handle nested groups recursively
            return expr as GroupData;
          }
          return null;
        }).filter((expr): expr is (ConditionData | GroupData) => expr !== null);

        if (validExpressions.length > 0) {
          return {
            type: parsedConfig.type as 'AND' | 'OR',
            expressions: validExpressions
          };
        }
      }
    }

    // If config parsing fails or no config, create a single condition from individual fields
    return {
      type: 'AND',
      expressions: [{
        sourceType: (initialExpression.sourceType as 'sensor' | 'device') || 'sensor',
        UUID: initialExpression.UUID || defaultUUID,
        key: initialExpression.key || '',
        operator: initialExpression.operator || '==',
        value: initialExpression.value || ''
      }]
    };
  } catch (error) {
    console.error('Error parsing initial expression:', error);
    return defaultGroup;
  }
};

const NodeDialog: React.FC<NodeDialogProps> = ({
  open,
  onClose,
  onSave,
  onUpdate,
  ruleChainId,
  mode = 'add',
  initialExpression,
  sensors,
  devices,
  sensorDetails,
  onFetchSensorDetails,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [nodeName, setNodeName] = useState(initialExpression?.name || '');
  const [rootGroup, setRootGroup] = useState<GroupData>(() => ({
    type: 'AND',
    expressions: [{
      sourceType: 'sensor',
      UUID: '',
      key: '',
      operator: '==',
      value: ''
    }]
  }));

  // Load initial expression data
  useEffect(() => {
    const loadExpressionData = async () => {
      if (!open || !initialExpression || !sensors.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Initial expression full data:', JSON.stringify(initialExpression, null, 2));
        
        let parsedConfig: ParsedExpression | null = null;

        // Try to parse config if it's a string
        if (typeof initialExpression.config === 'string') {
          try {
            parsedConfig = JSON.parse(initialExpression.config);
            console.log('Parsed config from string:', parsedConfig);
          } catch (e) {
            console.log('Failed to parse config string:', e);
          }
        }
        // If config is an object, try to use it directly
        else if (initialExpression.config && typeof initialExpression.config === 'object') {
          console.log('Using config object directly:', initialExpression.config);
          parsedConfig = initialExpression.config as ParsedExpression;
        }

        console.log('Parsed/direct config:', parsedConfig);

        // If we have a valid config with expressions, use it
        if (parsedConfig?.type && Array.isArray(parsedConfig.expressions)) {
          await handleParsedConfig(parsedConfig);
        } 
        // Otherwise, create a single expression from the initialExpression fields
        else {
          console.log('Creating single expression from fields:', initialExpression);
          const singleExpression = {
            type: 'AND' as const,
            expressions: [{
              sourceType: initialExpression.sourceType as 'sensor' | 'device',
              UUID: initialExpression.UUID || '',
              key: initialExpression.key || '',
              operator: initialExpression.operator || '==',
              value: initialExpression.value || ''
            }]
          };
          await handleParsedConfig(singleExpression);
        }
      } catch (error) {
        console.error('Error loading expression data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpressionData();
  }, [open, initialExpression, sensors]);

  // Load sensor details when UUID changes
  useEffect(() => {
    const loadSensorDetails = async () => {
      if (!rootGroup?.expressions?.length) return;

      // Get unique sensor UUIDs that need details loaded
      const sensorUUIDs = new Set<string>();
      
      const collectSensorUUIDs = (expressions: Array<ConditionData | GroupData>) => {
        expressions.forEach(expr => {
          if ('sourceType' in expr && expr.sourceType === 'sensor' && expr.UUID && !sensorDetails[expr.UUID]) {
            sensorUUIDs.add(expr.UUID);
          } else if ('expressions' in expr) {
            collectSensorUUIDs(expr.expressions);
          }
        });
      };
      
      collectSensorUUIDs(rootGroup.expressions);

      // Load details for each unique sensor
      for (const UUID of sensorUUIDs) {
        const sensor = sensors.find(s => s.uuid === UUID);
        if (sensor) {
          await onFetchSensorDetails(sensor.id);
        }
      }
    };

    loadSensorDetails();
  }, [rootGroup, sensors, sensorDetails, onFetchSensorDetails]);

  const handleParsedConfig = async (config: ParsedExpression) => {
    console.log('Handling config:', config);
    
    if (!Array.isArray(config.expressions)) {
      console.log('No valid expressions array found');
      return;
    }

    // Recursively convert parsed expressions to proper format
    const convertExpression = (expr: ParsedExpression): ConditionData | GroupData | null => {
      // Check if it's a condition (has sourceType, UUID, key, operator, value)
      if (expr.sourceType && expr.UUID && expr.key && expr.operator && expr.value !== undefined) {
        return {
          sourceType: expr.sourceType as 'sensor' | 'device',
          UUID: expr.UUID,
          key: expr.key,
          operator: expr.operator,
          value: expr.value
        };
      }
      // Check if it's a group (has type and expressions)
      else if (expr.type && Array.isArray(expr.expressions)) {
        const nestedExpressions = expr.expressions
          .map(convertExpression)
          .filter((e): e is (ConditionData | GroupData) => e !== null);
        
        if (nestedExpressions.length > 0) {
          return {
            type: expr.type as 'AND' | 'OR',
            expressions: nestedExpressions
          };
        }
      }
      
      return null;
    };

    // Convert all expressions
    const convertedExpressions = config.expressions
      .map(convertExpression)
      .filter((expr): expr is (ConditionData | GroupData) => expr !== null);

    // Set the root group with properly converted expressions
    const newRootGroup: GroupData = {
      type: config.type as 'AND' | 'OR',
      expressions: convertedExpressions
    };

    console.log('Setting new root group with nested structure:', newRootGroup);
    setRootGroup(newRootGroup);
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      console.log('Dialog opened with initial expression:', initialExpression);
      setNodeName(initialExpression?.name || '');
    }
  }, [open, initialExpression]);

  const handleSave = () => {
    if (!nodeName.trim()) return;

    // Optimize the structure before saving
    const optimizedConfig = optimizeStructure(rootGroup);

    if (mode === 'edit' && initialExpression?.id && onUpdate) {
      onUpdate(initialExpression.id, {
        name: nodeName.trim(),
        config: JSON.stringify(optimizedConfig),
        type: "filter"  // Preserve the node type
      });
    } else if (onSave) {
      onSave({
        ruleChainId,
        type: "filter",
        name: nodeName.trim(),
        config: JSON.stringify(optimizedConfig),
        nextNodeId: null,
      });
    }
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Typography>Loading...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'edit' ? 'Edit Node' : 'Create Node'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
          <TextField
            fullWidth
            label="Node Name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
            error={!nodeName.trim()}
            helperText={!nodeName.trim() ? "Node name is required" : ""}
          />

          <ExpressionGroup
            group={rootGroup}
            onChange={setRootGroup}
            sensors={sensors}
            devices={devices}
            sensorDetails={sensorDetails}
            onFetchSensorDetails={onFetchSensorDetails}
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview:
            </Typography>
            <pre style={{ margin: 0, overflow: 'auto' }}>
              {JSON.stringify(optimizeStructure(rootGroup), null, 2)}
            </pre>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!nodeName.trim()}
        >
          {mode === 'edit' ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDialog;
