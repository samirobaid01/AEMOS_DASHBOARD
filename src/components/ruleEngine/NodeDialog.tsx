import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { 
  nodeFormResolver,
  defaultNodeFormValues,
  formatNodeData,
  type NodeFormData,
  type FilterConfig,
  type ActionConfig,
} from "../../containers/RuleEngine/RuleEdit";
import { useTranslation } from "react-i18next";

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    type: "filter" | "action";
    config: any;
  };
}

const NodeDialog: React.FC<NodeDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const [type, setNodeType] = useState<"filter" | "action">(
    initialData?.type || "filter"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NodeFormData>({
    resolver: nodeFormResolver,
    defaultValues: initialData || defaultNodeFormValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        ...(initialData.type === "filter"
          ? {
              config: {
                sourceType: initialData.config.sourceType,
                UUID: initialData.config.UUID,
                key: initialData.config.key,
                operator: initialData.config.operator,
                value: initialData.config.value,
              },
            }
          : {
              config: {
                deviceUuid: initialData.config.command?.deviceUuid,
                stateName: initialData.config.command?.stateName,
                stateValue: initialData.config.command?.value,
              },
            }),
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: NodeFormData) => {
    onSave(formatNodeData(data));
  };

  const getConfigError = (field: string) => {
    return errors.config && (errors.config as any)[field]?.message;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <DialogTitle>{t("ruleEngine.ruleNode.title")}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              {...register("type")}
              select
              fullWidth
              label={t("ruleEngine.ruleNode.nodeType")}
              onChange={(e) => {
                register("type").onChange(e);
                setNodeType(e.target.value as "filter" | "action");
              }}
              error={!!errors.type}
              helperText={errors.type?.message}
            >
              <MenuItem value="filter">Filter</MenuItem>
              <MenuItem value="action">Action</MenuItem>
            </TextField>

            {type === "filter" ? (
              <>
                <TextField
                  {...register("config.sourceType")}
                  select
                  fullWidth
                  label={t("ruleEngine.ruleNode.sourceType")}
                  error={!!getConfigError("sourceType")}
                  helperText={getConfigError("sourceType")}
                >
                  <MenuItem value="sensor">Sensor</MenuItem>
                </TextField>
                <TextField
                  {...register("config.UUID")}
                  fullWidth
                  label="Sensor UUID"
                  error={!!getConfigError("UUID")}
                  helperText={getConfigError("UUID")}
                />
                <TextField
                  {...register("config.key")}
                  fullWidth
                  label="Sensor Key"
                  error={!!getConfigError("key")}
                  helperText={getConfigError("key")}
                />
                <TextField
                  {...register("config.operator")}
                  select
                  fullWidth
                  label="Operator"
                  error={!!getConfigError("operator")}
                  helperText={getConfigError("operator")}
                >
                  <MenuItem value=">">Greater than</MenuItem>
                  <MenuItem value="<">Less than</MenuItem>
                  <MenuItem value="=">Equals</MenuItem>
                  <MenuItem value=">=">Greater than or equal</MenuItem>
                </TextField>
                <TextField
                  {...register("config.value")}
                  fullWidth
                  type="number"
                  label="Value"
                  error={!!getConfigError("value")}
                  helperText={getConfigError("value")}
                />
              </>
            ) : (
              <>
                <TextField
                  {...register("config.deviceUuid")}
                  fullWidth
                  label="Device UUID"
                  error={!!getConfigError("deviceUuid")}
                  helperText={getConfigError("deviceUuid")}
                />
                <TextField
                  {...register("config.stateName")}
                  fullWidth
                  label="State Name"
                  error={!!getConfigError("stateName")}
                  helperText={getConfigError("stateName")}
                />
                <TextField
                  {...register("config.stateValue")}
                  fullWidth
                  label="State Value"
                  error={!!getConfigError("stateValue")}
                  helperText={getConfigError("stateValue")}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="submit" variant="contained" color="primary">
            {t("common.save")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NodeDialog;
