import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Device } from "../../types/device";
import type { Sensor } from "../../types/sensor";

interface KeyOption {
  key: string;
  values: string[] | null;
  range?: [number, number];
}

export interface ConditionData {
  sourceType: string;
  UUID: string;
  key: string;
  operator: string;
  value: string | number;
}

export interface GroupData {
  type: string;
  expressions: Array<ConditionData | GroupData>;
}

interface ExpressionBuilderProps {
  organizationId?: number;
  jwtToken?: string;
  onSave?: (data: { expressions: Array<ConditionData | GroupData> }) => void;
}

interface ValueElement extends HTMLElement {
  value: string;
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
  };
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: Sensor | null;
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}

const NodeDialog: React.FC<NodeDialogProps> = ({
  open,
  onClose,
  onSave,
  onUpdate,
  ruleChainId,
  mode = 'add',
  initialExpression,
  sensors = [],
  devices = [],
  sensorDetails,
  onFetchSensorDetails,
}) => {
  const [output, setOutput] = useState<string>("");
  const [nodeName, setNodeName] = useState<string>(initialExpression?.name || "");
  const builderRef = useRef<HTMLDivElement>(null);
  const sensorsRef = useRef<Sensor[]>([]);
  const devicesRef = useRef<Device[]>([]);
  const isInitializedRef = useRef<boolean>(false);
  const { t } = useTranslation();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialExpression?.name) {
        setNodeName(initialExpression.name);
      } else {
        setNodeName('');
      }
    }
  }, [open, mode, initialExpression]);

  const resetState = () => {
    setOutput("");
    setNodeName("");
    if (builderRef.current) {
      builderRef.current.innerHTML = "";
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Update refs when props change
  useEffect(() => {
    console.log('NodeDialog props updated:', { sensors, devices });
    if (builderRef.current) {
      const sourceTypeSelect = builderRef.current.querySelector('select:first-child') as HTMLSelectElement;
      if (sourceTypeSelect?.value) {
        updateUUIDsAndKeys(sourceTypeSelect.value);
      }
    }
  }, [sensors, devices]);

  const updateSensorKeys = async (uuid: string) => {
    const sensor = sensorsRef.current.find((s) => s.uuid === uuid);
    if (!sensor) return;

    await onFetchSensorDetails(sensor.id);
    
    if (!builderRef.current) return;
    
    const keySelect = builderRef.current.querySelector('select:nth-child(3)') as HTMLSelectElement;
    if (!keySelect) return;

    keySelect.innerHTML = '';
    if (sensorDetails?.TelemetryData) {
      sensorDetails.TelemetryData.forEach((k: any) => {
        const opt = document.createElement("option");
        opt.value = k.variableName;
        opt.textContent = k.variableName;
        keySelect.appendChild(opt);
      });
    }

    generateJSON(false);
  };

  const fetchSensorsAndDevices = async () => {
    try {
      console.log("Using sensors and devices from props");
      sensorsRef.current = sensors;
      devicesRef.current = devices;
      return { sensors, devices };
    } catch (error) {
      console.error("Error setting up data:", error);
      return { sensors: [], devices: [] };
    }
  };

  const getDeviceKeys = (device: Device): KeyOption[] => {
    const caps = device.capabilities || {};
    const keys: KeyOption[] = [];

    Object.entries(caps).forEach(([key, value]) => {
      if (key.includes("Range") && Array.isArray(value) && value.length === 2) {
        keys.push({
          key: key.replace("Range", ""),
          values: null,
          range: value as [number, number],
        });
      } else if (Array.isArray(value)) {
        keys.push({
          key: key.replace(/([A-Z])/g, "_$1").toLowerCase(),
          values: value,
        });
      } else if (typeof value === "boolean") {
        keys.push({
          key: key.replace(/([A-Z])/g, "_$1").toLowerCase(),
          values: null,
        });
      }
    });

    return keys;
  };

  const updateDeviceKeys = (uuid: string) => {
    const device = devicesRef.current.find((d) => d.uuid === uuid);
    if (!device || !builderRef.current) return;

    const keys = getDeviceKeys(device);
    const keySelect = builderRef.current.querySelector('select:nth-child(3)') as HTMLSelectElement;
    if (!keySelect) return;

    keySelect.innerHTML = "";
    keys.forEach((k) => {
      const opt = document.createElement("option");
      opt.value = k.key;
      opt.textContent = k.key;
      keySelect.appendChild(opt);
    });

    generateJSON(false);
  };

  const updateUUIDsAndKeys = async (sourceTypeValue: string) => {
    console.log("Updating UUIDs and Keys for source type:", sourceTypeValue, { sensors, devices });
    
    if (!builderRef.current) return;
    const uuidSelect = builderRef.current.querySelector('select:nth-child(2)') as HTMLSelectElement;
    const keySelect = builderRef.current.querySelector('select:nth-child(3)') as HTMLSelectElement;
    
    if (!uuidSelect || !keySelect) return;

    uuidSelect.innerHTML = "";
    keySelect.innerHTML = "";

    if (sourceTypeValue === "sensor") {
      if (sensors.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No sensors available";
        opt.disabled = true;
        uuidSelect.appendChild(opt);
        return;
      }

      sensors.forEach((sensor) => {
        const opt = document.createElement("option");
        opt.value = sensor.uuid;
        opt.textContent = sensor.name;
        uuidSelect.appendChild(opt);
      });

      if (uuidSelect.firstChild) {
        await updateSensorKeys(uuidSelect.value);
      }
    } else {
      if (devices.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No devices available";
        opt.disabled = true;
        uuidSelect.appendChild(opt);
        return;
      }

      devices.forEach((device) => {
        const opt = document.createElement("option");
        opt.value = device.uuid;
        opt.textContent = device.name;
        uuidSelect.appendChild(opt);
      });

      if (uuidSelect.firstChild) {
        updateDeviceKeys(uuidSelect.value);
      }
    }

    generateJSON(false);
  };

  const createConditionNode = async (
    parent: HTMLDivElement,
    isInitializing = false,
    initialData?: {
      sourceType: string;
      UUID: string;
      key: string;
      operator: string;
      value: string | number;
    }
  ) => {
    const div = document.createElement("div");
    div.className = "condition";

    const sourceType = document.createElement("select");
    ["sensor", "device"].forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type;
      opt.textContent = type;
      sourceType.appendChild(opt);
    });

    const uuidSelect = document.createElement("select");
    const key = document.createElement("select");
    const operator = document.createElement("select");
    ["==", "!=", ">", "<", ">=", "<="].forEach((op) => {
      const opt = document.createElement("option");
      opt.value = op;
      opt.textContent = op;
      operator.appendChild(opt);
    });

    const value = document.createElement("input");
    value.type = "text";
    value.placeholder = "value";
    value.className = "value-input";

    // Set up getData before adding event listeners
    (div as any).getData = () => {
      const currentValue = value.value;
      return {
        sourceType: sourceType.value,
        UUID: uuidSelect.value,
        key: key.value,
        operator: operator.value,
        value: currentValue && currentValue.length > 0
          ? isNaN(currentValue as any)
            ? currentValue
            : Number(currentValue)
          : null
      };
    };

    // Add event listeners with proper update chain
    sourceType.addEventListener("change", async () => {
      console.log("Source type changed:", sourceType.value);
      if (sourceType.value === "sensor") {
        // Clear existing options
        uuidSelect.innerHTML = "";
        key.innerHTML = "";
        
        console.log("Populating sensors:", sensors);
        if (sensors.length === 0) {
          // Add a placeholder option if no sensors
          const opt = document.createElement("option");
          opt.value = "";
          opt.textContent = "Loading sensors...";
          opt.disabled = true;
          uuidSelect.appendChild(opt);
          return;
        }

        // Populate sensor options
        sensors.forEach((sensor) => {
          const opt = document.createElement("option");
          opt.value = sensor.uuid;
          opt.textContent = sensor.name;
          uuidSelect.appendChild(opt);
        });

        // If there are sensors, fetch keys for the first one
        if (sensors.length > 0) {
          uuidSelect.value = sensors[0].uuid;
          await updateSensorKeys(sensors[0].uuid);
        }
      } else {
        // Clear existing options
        uuidSelect.innerHTML = "";
        key.innerHTML = "";
        
        console.log("Populating devices:", devices);
        if (devices.length === 0) {
          // Add a placeholder option if no devices
          const opt = document.createElement("option");
          opt.value = "";
          opt.textContent = "Loading devices...";
          opt.disabled = true;
          uuidSelect.appendChild(opt);
          return;
        }

        // Populate device options
        devices.forEach((device) => {
          const opt = document.createElement("option");
          opt.value = device.uuid;
          opt.textContent = device.name;
          uuidSelect.appendChild(opt);
        });

        // If there are devices, update keys for the first one
        if (devices.length > 0) {
          uuidSelect.value = devices[0].uuid;
          updateDeviceKeys(devices[0].uuid);
        }
      }
      generateJSON(false);
    });

    uuidSelect.addEventListener("change", async () => {
      console.log("UUID changed:", uuidSelect.value);
      if (sourceType.value === "sensor") {
        await updateSensorKeys(uuidSelect.value);
      } else {
        updateDeviceKeys(uuidSelect.value);
      }
      generateJSON(false);
    });

    key.addEventListener("change", () => {
      console.log("Key changed:", key.value);
      generateJSON(false);
    });

    operator.addEventListener("change", () => {
      console.log("Operator changed:", operator.value);
      generateJSON(false);
    });

    value.addEventListener("input", () => {
      console.log("Value changed:", value.value);
      generateJSON(false);
    });

    div.appendChild(sourceType);
    div.appendChild(uuidSelect);
    div.appendChild(key);
    div.appendChild(operator);
    div.appendChild(value);

    parent.appendChild(div);

    // Set initial values if provided
    if (initialData) {
      console.log("Setting initial values:", initialData);
      sourceType.value = initialData.sourceType;
      await updateUUIDsAndKeys(initialData.sourceType);
      uuidSelect.value = initialData.UUID;
      if (initialData.sourceType === 'sensor') {
        await updateSensorKeys(initialData.UUID);
      } else {
        updateDeviceKeys(initialData.UUID);
      }
      key.value = initialData.key;
      operator.value = initialData.operator;
      value.value = initialData.value.toString();
      
      // Force an update after setting all values
      setTimeout(() => {
        generateJSON(false);
      }, 0);
    } else {
      // Initialize with default source type
      await updateUUIDsAndKeys(sourceType.value);
    }

    return div;
  };

  const createGroupNode = async (type = "AND", parent?: HTMLDivElement) => {
    const div = document.createElement("div");
    div.className = "group";

    const topBar = document.createElement("div");
    const logicType = document.createElement("select");
    ["AND", "OR"].forEach((op) => {
      const opt = document.createElement("option");
      opt.value = op;
      opt.textContent = op;
      logicType.appendChild(opt);
    });
    logicType.value = type;

    const removeGroup = document.createElement("button");
    removeGroup.textContent = "[-]";
    removeGroup.className = "remove-btn";
    removeGroup.type = "button";
    removeGroup.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      div.remove();
      generateJSON(false);
    };

    topBar.appendChild(logicType);
    topBar.appendChild(removeGroup);

    const container = document.createElement("div");
    const controls = document.createElement("div");
    controls.className = "controls";

    const addCondition = document.createElement("button");
    addCondition.textContent = "Add Condition";
    addCondition.type = "button";
    addCondition.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await createConditionNode(container);
      generateJSON(false);
    };

    const addGroup = document.createElement("button");
    addGroup.textContent = "Add Group";
    addGroup.type = "button";
    addGroup.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await createGroupNode("AND", container);
      generateJSON(false);
    };

    controls.appendChild(addCondition);
    controls.appendChild(addGroup);

    div.appendChild(topBar);
    div.appendChild(container);
    div.appendChild(controls);

    (div as any).getData = () => {
      const expressions = Array.from(container.children)
        .map((child) => {
          const data = (child as any).getData();
          return data;
        })
        .filter((data) => data !== null && data !== undefined);

      return {
        type: logicType.value,
        expressions: expressions,
      };
    };

    logicType.addEventListener("change", () => generateJSON(false));

    if (parent) {
      parent.appendChild(div);
    }
    return div;
  };

  const generateJSON = (shouldSave = false) => {
    if (!builderRef.current) return;
    try {
      // Find the condition element
      const conditionElement = builderRef.current.querySelector('.condition');
      if (!conditionElement) {
        console.error("No condition element found");
        return;
      }

      const conditionData = (conditionElement as any).getData();
      console.log("Raw condition data:", conditionData);

      // Create the proper structure
      const data = {
        type: "AND",
        expressions: [conditionData]
      };

      const outputData = JSON.stringify(data, null, 2);
      console.log("Generating JSON:", outputData);
      
      // Force a state update
      setOutput(outputData + " "); // Add a space to force React to see it as a new value

      // Only trigger save if explicitly requested
      if (shouldSave && onSave) {
        onSave({
          ...data,
          name: nodeName.trim(),
          id: initialExpression?.id
        });
      }
    } catch (error) {
      console.error("Error generating JSON:", error);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!nodeName.trim()) {
      console.error("Node name is required");
      return;
    }

    try {
      // Get the condition data from the current node
      const conditionElement = builderRef.current?.querySelector('.condition');
      if (!conditionElement) {
        console.error("No condition element found");
        return;
      }

      const conditionData = (conditionElement as any).getData();
      console.log("Raw condition data:", conditionData);

      // Create the proper structure with expressions array
      const data = {
        expressions: [{
          type: "AND",
          expressions: [conditionData]
        }],
        name: nodeName.trim(),
        id: initialExpression?.id
      };

      console.log("Saving data with expressions:", data);

      if (mode === 'edit' && initialExpression?.id && onUpdate) {
        onUpdate(initialExpression.id, {
          name: nodeName.trim(),
          config: JSON.stringify(data.expressions[0])
        });
      } else if (onSave) {
        // For new nodes, we need to create it first to get an ID
        const saveData = {
          ruleChainId,
          type: "filter",
          name: nodeName.trim(),
          config: JSON.stringify(data.expressions[0]),
          nextNodeId: null,
        };
        console.log("Creating new node with data:", saveData);
        onSave(saveData);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving node:", error);
    }
  };

  useEffect(() => {
    if (open && !isInitializedRef.current) {
      const init = async () => {
        try {
          console.log("Initializing dialog with mode:", mode, "and initial expression:", initialExpression);
          await fetchSensorsAndDevices();
          
          if (builderRef.current) {
            builderRef.current.innerHTML = "";
            const root = await createGroupNode("AND");
            if (root && builderRef.current) {
              builderRef.current.appendChild(root);
              const container = root.querySelector('.group > div') as HTMLDivElement;
              if (container) {
                if (mode === 'edit' && initialExpression) {
                  console.log("Creating node in edit mode with data:", initialExpression);
                  await createConditionNode(container, true, {
                    sourceType: initialExpression.sourceType || 'sensor',
                    UUID: initialExpression.UUID || '',
                    key: initialExpression.key || '',
                    operator: initialExpression.operator || '==',
                    value: initialExpression.value || ''
                  });
                } else {
                  console.log("Creating empty condition node in add mode");
                  await createConditionNode(container, true);
                }
              }
              isInitializedRef.current = true;
            }
          }
        } catch (error) {
          console.error("Error initializing:", error);
        }
      };
      init();
    }
    return () => {
      if (!open) {
        isInitializedRef.current = false;
      }
    };
  }, [open, mode, initialExpression]);

  const createActionNode = async (
    parent: HTMLDivElement,
    isInitializing = false,
    initialData?: {
      command: {
        deviceUuid: string;
        stateName: string;
        value: string;
        initiatedBy: 'device';
      };
    }
  ) => {
    const div = document.createElement("div");
    div.className = "condition action";

    // Create device select
    const deviceSelect = document.createElement("select");
    deviceSelect.className = "device-select";
    
    // Wait for devices to be available
    if (devices.length === 0) {
      console.log("Waiting for devices to load...");
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("Populating devices:", devices.length);
    
    // Populate devices
    devices.forEach((device) => {
      const opt = document.createElement("option");
      opt.value = device.uuid;
      opt.textContent = device.name;
      deviceSelect.appendChild(opt);
    });

    // Create state name input
    const stateNameInput = document.createElement("input");
    stateNameInput.type = "text";
    stateNameInput.placeholder = "State Name";
    stateNameInput.className = "state-input";

    // Create value input
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Value";
    valueInput.className = "value-input";

    // Set initial values if in edit mode
    if (initialData?.command) {
      console.log("Setting initial values for action node:", initialData.command);
      deviceSelect.value = initialData.command.deviceUuid;
      stateNameInput.value = initialData.command.stateName;
      valueInput.value = initialData.command.value;
    }

    const remove = document.createElement("button");
    remove.textContent = "[-]";
    remove.className = "remove-btn";
    remove.type = "button";
    remove.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      div.remove();
      if (!isInitializing) {
        generateJSON(false);
      }
    };

    // Add event listeners
    const handleChange = () => {
      if (!isInitializing) {
        generateJSON(false);
      }
    };

    deviceSelect.addEventListener("change", handleChange);
    stateNameInput.addEventListener("input", handleChange);
    valueInput.addEventListener("input", handleChange);

    // Set up getData
    (div as any).getData = () => {
      const data = {
        type: "action",
        config: {
          type: "DEVICE_COMMAND",
          command: {
            deviceUuid: deviceSelect.value,
            stateName: stateNameInput.value,
            value: valueInput.value,
            initiatedBy: "device"
          }
        }
      };
      console.log("Action node getData:", data);
      return data;
    };

    // Append elements
    div.appendChild(deviceSelect);
    div.appendChild(stateNameInput);
    div.appendChild(valueInput);
    div.appendChild(remove);

    parent.appendChild(div);

    // Trigger initial data collection
    if (!isInitializing) {
      generateJSON(false);
    }

    return div;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disablePortal={false}
      keepMounted={false}
      aria-labelledby="expression-builder-dialog-title"
    >
      <DialogTitle id="expression-builder-dialog-title">
        Expression Builder
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <TextField
            fullWidth
            label="Node Name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
            error={!nodeName.trim()}
            helperText={!nodeName.trim() ? "Node name is required" : ""}
            sx={{ mb: 2 }}
          />

          <div
            id="builder"
            ref={builderRef}
            style={{
              minHeight: "200px",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <div
            className="output"
            style={{
              whiteSpace: "pre",
              background: "#f9f9f9",
              padding: "1em",
              border: "1px solid #ccc",
              borderRadius: "4px",
              maxHeight: "200px",
              overflowY: "auto",
              fontFamily: "monospace",
            }}
          >
            {output || "Expression will appear here as you build it..."}
          </div>

          <style>{`
            .group {
              border-left: 2px solid #ccc;
              padding: 15px;
              margin: 15px 0;
              background: #f5f5f5;
              border-radius: 4px;
            }
            .condition {
              display: flex;
              align-items: center;
              gap: 10px;
              margin: 10px 0;
              flex-wrap: wrap;
            }
            .controls {
              margin-top: 15px;
              display: flex;
              gap: 10px;
            }
            select, input {
              padding: 8px;
              border: 1px solid #ccc;
              border-radius: 4px;
              min-width: 120px;
            }
            button {
              padding: 8px 16px;
              border-radius: 4px;
              border: 1px solid #ccc;
              background: white;
              cursor: pointer;
              transition: all 0.2s;
            }
            button:hover {
              background: #f0f0f0;
            }
            .remove-btn {
              color: #d32f2f;
              padding: 4px 8px;
              border: none;
              background: none;
            }
            .remove-btn:hover {
              background: rgba(211, 47, 47, 0.1);
            }
          `}</style>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" type="button">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          type="button"
          disabled={!nodeName.trim()}
        >
          {mode === 'edit' ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDialog;
