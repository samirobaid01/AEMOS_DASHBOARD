import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface Sensor {
  id: number;
  uuid: string;
  name: string;
}

interface Device {
  uuid: string;
  name: string;
  capabilities: Record<string, any>;
}

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
  organizationId?: number;
  jwtToken?: string;
  ruleChainId?: number;
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialExpression?: {
    id?: number;
    name?: string;
    type: 'filter' | 'action';
    sourceType?: string;
    UUID?: string;
    key?: string;
    operator?: string;
    value?: string | number;
    command?: {
      deviceUuid: string;
      stateName: string;
      value: string;
      initiatedBy: 'device';
    };
  };
  mode: 'add' | 'edit';
}

const NodeDialog: React.FC<NodeDialogProps> = ({
  organizationId = 1,
  jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjcxLCJlbWFpbCI6InNhbWlyYWRtaW5AeW9wbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6WyJhcmVhLmNyZWF0ZSIsImFyZWEuZGVsZXRlIiwiYXJlYS51cGRhdGUiLCJhcmVhLnZpZXciLCJjb21tYW5kLmNhbmNlbCIsImNvbW1hbmQucmV0cnkiLCJjb21tYW5kLnNlbmQiLCJjb21tYW5kLnZpZXciLCJjb21tYW5kVHlwZS5jcmVhdGUiLCJjb21tYW5kVHlwZS5kZWxldGUiLCJjb21tYW5kVHlwZS51cGRhdGUiLCJjb21tYW5kVHlwZS52aWV3IiwiZGV2aWNlLmFuYWx5dGljcy52aWV3IiwiZGV2aWNlLmNvbnRyb2wiLCJkZXZpY2UuY3JlYXRlIiwiZGV2aWNlLmRlbGV0ZSIsImRldmljZS5oZWFydGJlYXQudmlldyIsImRldmljZS5tZXRhZGF0YS51cGRhdGUiLCJkZXZpY2Uuc3RhdHVzLnVwZGF0ZSIsImRldmljZS51cGRhdGUiLCJkZXZpY2UudmlldyIsIm1haW50ZW5hbmNlLmRlbGV0ZSIsIm1haW50ZW5hbmNlLmxvZyIsIm1haW50ZW5hbmNlLnNjaGVkdWxlIiwibWFpbnRlbmFuY2UudXBkYXRlIiwibWFpbnRlbmFuY2UudmlldyIsIm9yZ2FuaXphdGlvbi5jcmVhdGUiLCJvcmdhbml6YXRpb24uZGVsZXRlIiwib3JnYW5pemF0aW9uLnVwZGF0ZSIsIm9yZ2FuaXphdGlvbi52aWV3IiwicGVybWlzc2lvbi5tYW5hZ2UiLCJyZXBvcnQuZ2VuZXJhdGUiLCJyZXBvcnQudmlldyIsInJvbGUuYXNzaWduIiwicm9sZS52aWV3IiwicnVsZS5jcmVhdGUiLCJydWxlLmRlbGV0ZSIsInJ1bGUudXBkYXRlIiwicnVsZS52aWV3Iiwic2Vuc29yLmNyZWF0ZSIsInNlbnNvci5kZWxldGUiLCJzZW5zb3IudXBkYXRlIiwic2Vuc29yLnZpZXciLCJzZXR0aW5ncy51cGRhdGUiLCJzZXR0aW5ncy52aWV3Iiwic3RhdGUuY3JlYXRlIiwic3RhdGUudmlldyIsInN0YXRlVHJhbnNpdGlvbi5tYW5hZ2UiLCJzdGF0ZVRyYW5zaXRpb24udmlldyIsInN0YXRlVHlwZS5tYW5hZ2UiLCJzdGF0ZVR5cGUudmlldyIsInVzZXIuY3JlYXRlIiwidXNlci5kZWxldGUiLCJ1c2VyLnVwZGF0ZSIsInVzZXIudmlldyJdLCJyb2xlcyI6WyJBZG1pbiJdLCJpYXQiOjE3NDk2MjU3MTMsImV4cCI6MTc0OTcxMjExM30.j7lOAaRgAP_7CZhurI8hyXHEylynRIGxNVJiZgQlHls",
  ruleChainId,
  open,
  onClose,
  onSave,
  initialExpression,
  mode = 'add'
}) => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [output, setOutput] = useState<string>("");
  const [nodeName, setNodeName] = useState<string>(initialExpression?.name || "");
  const builderRef = useRef<HTMLDivElement>(null);
  const sensorsRef = useRef<Sensor[]>([]);
  const devicesRef = useRef<Device[]>([]);
  const isInitializedRef = useRef<boolean>(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      // In edit mode, initialize with the name from initialExpression
      console.log("Initial expression:", initialExpression);
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

  const saveExpression = async () => {
    try {
      if (!nodeName.trim()) {
        console.error("Node name is required");
        return;
      }

      console.log("Current output:", output);
      const data = JSON.parse(output);

      // Prepare the API request payload
      const payload = {
        ruleChainId,
        type: "filter",
        name: nodeName.trim(),
        config: JSON.stringify(data.expressions[0]),
        nextNodeId: null,
      };

      console.log("Sending payload to API:", payload);

      const response = await fetch(
        `http://localhost:3000/api/v1/rule-chains/nodes?organizationId=${organizationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", errorData);
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Call onSave with the data including the name and new ID
      if (onSave) {
        onSave({
          ...data,
          name: nodeName.trim(),
          id: result.data.id // Include the new ID from the response
        });
      }

      // Close the dialog
      handleClose();
    } catch (error) {
      console.error("Error saving node:", error);
    }
  };

  const updateExpression = async () => {
    try {
      if (!nodeName.trim()) {
        console.error("Node name is required");
        return;
      }

      console.log("Current output:", output);
      const data = JSON.parse(output);

      // Prepare the API request payload
      const payload = {
        name: nodeName.trim(),
        config: JSON.stringify(data.expressions[0])
      };

      console.log("Sending payload to API:", payload);

      const response = await fetch(
        `http://localhost:3000/api/v1/rule-chains/nodes/${initialExpression?.id}?organizationId=${organizationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", errorData);
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Call onSave with the data including the name
      if (onSave) {
        onSave({
          ...data,
          name: nodeName.trim(),
          id: initialExpression?.id
        });
      }

      // Close the dialog
      handleClose();
    } catch (error) {
      console.error("Error saving node:", error);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    resetState();
    onClose();
  };

  const fetchSensorsAndDevices = async () => {
    try {
      console.log("Fetching sensors and devices...");
      const [sensorsRes, devicesRes] = await Promise.all([
        fetch(
          `http://localhost:3000/api/v1/sensors?organizationId=${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json()),
        fetch(
          `http://localhost:3000/api/v1/devices?organizationId=${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json()),
      ]);

      const fetchedSensors = sensorsRes.data?.sensors || [];
      const fetchedDevices = devicesRes.data?.devices || [];

      console.log("Fetched data:", {
        sensors: fetchedSensors,
        devices: fetchedDevices,
      });

      // Update both state and refs
      sensorsRef.current = fetchedSensors;
      devicesRef.current = fetchedDevices;
      setSensors(fetchedSensors);
      setDevices(fetchedDevices);

      return { sensors: fetchedSensors, devices: fetchedDevices };
    } catch (error) {
      console.error("Error fetching data:", error);
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

    const updateSensorKeys = async (uuid: string) => {
      console.log("Updating sensor keys for UUID:", uuid);
      const sensor = sensorsRef.current.find((s) => s.uuid === uuid);
      if (!sensor) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/sensors/${sensor.id}?organizationId=${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const json = await res.json();
        const keys = json?.data?.sensor?.TelemetryData || [];

        key.innerHTML = "";
        keys.forEach((k: any) => {
          const opt = document.createElement("option");
          opt.value = k.variableName;
          opt.textContent = k.variableName;
          key.appendChild(opt);
        });

        generateJSON(false);
      } catch (error) {
        console.error("Error fetching sensor keys:", error);
      }
    };

    const updateDeviceKeys = (uuid: string) => {
      console.log("Updating device keys for UUID:", uuid);
      const device = devicesRef.current.find((d) => d.uuid === uuid);
      if (!device) return;

      const keys = getDeviceKeys(device);
      console.log("Device keys:", keys);

      key.innerHTML = "";
      keys.forEach((k) => {
        const opt = document.createElement("option");
        opt.value = k.key;
        opt.textContent = k.key;
        key.appendChild(opt);
      });

      generateJSON(false);
    };

    const updateUUIDsAndKeys = async () => {
      const currentSensors = sensorsRef.current;
      const currentDevices = devicesRef.current;

      console.log("Updating UUIDs and Keys", {
        sourceType: sourceType.value,
        sensorsAvailable: currentSensors.length > 0,
        sensorsCount: currentSensors.length,
        currentSensors,
      });

      uuidSelect.innerHTML = "";
      key.innerHTML = "";

      if (sourceType.value === "sensor") {
        if (currentSensors.length === 0) {
          console.log("No sensors available");
          const opt = document.createElement("option");
          opt.value = "";
          opt.textContent = "No sensors available";
          uuidSelect.appendChild(opt);
        } else {
          currentSensors.forEach((sensor) => {
            const opt = document.createElement("option");
            opt.value = sensor.uuid;
            opt.textContent = sensor.name;
            uuidSelect.appendChild(opt);
          });

          if (uuidSelect.firstChild) {
            await updateSensorKeys(uuidSelect.value);
          }
        }
      } else {
        if (currentDevices.length === 0) {
          console.log("No devices available");
          const opt = document.createElement("option");
          opt.value = "";
          opt.textContent = "No devices available";
          uuidSelect.appendChild(opt);
        } else {
          currentDevices.forEach((device) => {
            const opt = document.createElement("option");
            opt.value = device.uuid;
            opt.textContent = device.name;
            uuidSelect.appendChild(opt);
          });

          if (uuidSelect.firstChild) {
            updateDeviceKeys(uuidSelect.value);
          }
        }
      }

      generateJSON(false);
    };

    // Set up getData before adding event listeners
    (div as any).getData = () => {
      const currentValue = value.value;
      console.log("Getting data from condition node:", {
        value: currentValue,
        sourceType: sourceType.value,
        UUID: uuidSelect.value,
        key: key.value,
        operator: operator.value
      });

      // Return the condition data directly
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
      await updateUUIDsAndKeys();
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

    // Initialize the dropdowns after appending to parent
    await updateUUIDsAndKeys();

    // Set initial values if provided
    if (initialData) {
      console.log("Setting initial values:", initialData);
      sourceType.value = initialData.sourceType;
      await updateUUIDsAndKeys();
      uuidSelect.value = initialData.UUID;
      await updateSensorKeys(initialData.UUID);
      key.value = initialData.key;
      operator.value = initialData.operator;
      value.value = initialData.value.toString();
      
      // Force an update after setting all values
      setTimeout(() => {
        generateJSON(false);
      }, 0);
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
    generateJSON(true); // Pass true to indicate this should trigger a save
    handleClose();
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
          onClick={mode === 'edit' ? updateExpression : saveExpression}
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
