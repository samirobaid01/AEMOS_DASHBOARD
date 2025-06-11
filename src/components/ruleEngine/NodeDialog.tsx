import React, { useState, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Device } from "../../types/device";
import type { Sensor } from "../../types/sensor";

interface ConditionData {
  sourceType: 'sensor' | 'device';
  UUID: string;
  key: string;
  operator: string;
  value: string | number;
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
  value?: string | number;
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
  sensorDetails: Sensor | null;
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}

const OPERATORS = ["==", "!=", ">", "<", ">=", "<="];

const ConditionBuilder: React.FC<{
  condition: ConditionData;
  onChange: (newCondition: ConditionData) => void;
  onDelete?: () => void;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: Sensor | null;
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}> = ({ condition, onChange, onDelete, sensors, devices, sensorDetails, onFetchSensorDetails }) => {
  const { t } = useTranslation();
  const [isLoadingSensorDetails, setIsLoadingSensorDetails] = useState(false);

  // Load sensor details when UUID changes
  useEffect(() => {
    const loadSensorDetails = async () => {
      if (condition.sourceType === 'sensor' && condition.UUID) {
        const sensor = sensors.find(s => s.uuid === condition.UUID);
        if (sensor && (!sensorDetails || sensorDetails.id !== sensor.id)) {
          setIsLoadingSensorDetails(true);
          try {
            await onFetchSensorDetails(sensor.id);
          } finally {
            setIsLoadingSensorDetails(false);
          }
        }
      }
    };
    loadSensorDetails();
  }, [condition.UUID, condition.sourceType, sensors, onFetchSensorDetails, sensorDetails]);

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
      if (isLoadingSensorDetails || !sensorDetails) {
        return [];
      }
      return sensorDetails.TelemetryData?.map(td => ({
        value: td.variableName,
        label: td.variableName
      })) || [];
    } else {
      const device = devices.find(d => d.uuid === condition.UUID);
      if (!device?.capabilities) {
        return [];
      }
      return Object.entries(device.capabilities).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        return {
          value: formattedKey,
          label: formattedKey
        };
      });
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
          {(condition.sourceType === 'sensor' ? sensors : devices).map((item) => (
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
          disabled={isLoadingSensorDetails || availableKeys.length === 0}
        >
          {availableKeys.map((key) => (
            <MenuItem key={key.value} value={key.value}>
              {key.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={condition.operator}
          onChange={(e) => onChange({ ...condition, operator: e.target.value })}
          label="Operator"
        >
          {OPERATORS.map((op) => (
            <MenuItem key={op} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Value"
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
        sx={{ minWidth: 120 }}
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
  sensorDetails: Sensor | null;
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
          if (expr.sourceType && expr.UUID && expr.key && expr.operator && 'value' in expr) {
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

      // Get unique sensor UUIDs
      const sensorUUIDs = new Set<string>();
      rootGroup.expressions.forEach(expr => {
        if ('sourceType' in expr && expr.sourceType === 'sensor' && expr.UUID) {
          sensorUUIDs.add(expr.UUID);
        }
      });

      // Load details for each unique sensor
      for (const UUID of sensorUUIDs) {
        const sensor = sensors.find(s => s.uuid === UUID);
        if (sensor && !sensorDetails?.id) {
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

    // Set the root group with all expressions
    const newRootGroup = {
      type: config.type as 'AND' | 'OR',
      expressions: config.expressions.map(expr => ({
        sourceType: expr.sourceType as 'sensor' | 'device',
        UUID: expr.UUID || '',
        key: expr.key || '',
        operator: expr.operator || '==',
        value: expr.value || ''
      }))
    };

    console.log('Setting new root group:', newRootGroup);
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

    if (mode === 'edit' && initialExpression?.id && onUpdate) {
      onUpdate(initialExpression.id, {
        name: nodeName.trim(),
        config: JSON.stringify(rootGroup),
        type: "filter"  // Preserve the node type
      });
    } else if (onSave) {
      onSave({
        ruleChainId,
        type: "filter",
        name: nodeName.trim(),
        config: JSON.stringify(rootGroup),
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
              {JSON.stringify(rootGroup, null, 2)}
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
