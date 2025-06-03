import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    type: 'filter' | 'action';
    config: any;
  };
}

const schema = yup.object().shape({
  type: yup.string().oneOf(['filter', 'action']).required(),
  // Filter fields
  sourceType: yup.string().when('type', {
    is: (val: string) => val === 'filter',
    then: () => yup.string().required('Source type is required'),
    otherwise: () => yup.string().optional(),
  }),
  UUID: yup.string().when('type', {
    is: (val: string) => val === 'filter',
    then: () => yup.string().required('UUID is required'),
    otherwise: () => yup.string().optional(),
  }),
  key: yup.string().when('type', {
    is: (val: string) => val === 'filter',
    then: () => yup.string().required('Key is required'),
    otherwise: () => yup.string().optional(),
  }),
  operator: yup.string().when('type', {
    is: (val: string) => val === 'filter',
    then: () => yup.string().oneOf(['>', '<', '=', '>=']).required('Operator is required'),
    otherwise: () => yup.string().optional(),
  }),
  value: yup.number().when('type', {
    is: (val: string) => val === 'filter',
    then: () => yup.number().required('Value is required'),
    otherwise: () => yup.number().optional(),
  }),
  // Action fields
  deviceUuid: yup.string().when('type', {
    is: (val: string) => val === 'action',
    then: () => yup.string().required('Device UUID is required'),
    otherwise: () => yup.string().optional(),
  }),
  stateName: yup.string().when('type', {
    is: (val: string) => val === 'action',
    then: () => yup.string().required('State name is required'),
    otherwise: () => yup.string().optional(),
  }),
  stateValue: yup.string().when('type', {
    is: (val: string) => val === 'action',
    then: () => yup.string().required('State value is required'),
    otherwise: () => yup.string().optional(),
  }),
});

const NodeDialog: React.FC<NodeDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [nodeType, setNodeType] = useState<'filter' | 'action'>(initialData?.type || 'filter');
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: initialData?.type || 'filter',
      ...(initialData?.config || {}),
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        ...(initialData.type === 'filter'
          ? {
              sourceType: initialData.config.sourceType,
              UUID: initialData.config.UUID,
              key: initialData.config.key,
              operator: initialData.config.operator,
              value: initialData.config.value,
            }
          : {
              deviceUuid: initialData.config.command?.deviceUuid,
              stateName: initialData.config.command?.stateName,
              stateValue: initialData.config.command?.value,
            }),
      });
    }
  }, [initialData, reset]);

  const type = watch('type');

  const handleFormSubmit = (data: any) => {
    const formattedData = {
      type: data.type,
      config:
        data.type === 'filter'
          ? {
              sourceType: data.sourceType,
              UUID: data.UUID,
              key: data.key,
              operator: data.operator,
              value: data.value,
            }
          : {
              type: 'DEVICE_COMMAND',
              command: {
                deviceUuid: data.deviceUuid,
                stateName: data.stateName,
                value: data.stateValue,
                initiatedBy: 'device',
              },
            },
    };
    onSave(formattedData);
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message && typeof error.message === 'string') return error.message;
    return '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? t('ruleEngine.ruleNode.editNode') : t('ruleEngine.ruleNode.addNode')}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label={t('ruleEngine.ruleNode.nodeType')}
                  onChange={(e) => {
                    field.onChange(e);
                    setNodeType(e.target.value as 'filter' | 'action');
                  }}
                  error={!!errors.type}
                  helperText={getErrorMessage(errors.type?.message)}
                >
                  <MenuItem value="filter">Filter</MenuItem>
                  <MenuItem value="action">Action</MenuItem>
                </TextField>
              )}
            />

            {type === 'filter' ? (
              <>
                <Controller
                  name="sourceType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label={t('ruleEngine.ruleNode.sourceType')}
                      error={!!errors.sourceType}
                      helperText={getErrorMessage(errors.sourceType?.message)}
                    >
                      <MenuItem value="sensor">Sensor</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name="UUID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Sensor UUID"
                      error={!!errors.UUID}
                      helperText={getErrorMessage(errors.UUID?.message)}
                    />
                  )}
                />
                <Controller
                  name="key"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Sensor Key"
                      error={!!errors.key}
                      helperText={getErrorMessage(errors.key?.message)}
                    />
                  )}
                />
                <Controller
                  name="operator"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Operator"
                      error={!!errors.operator}
                      helperText={getErrorMessage(errors.operator?.message)}
                    >
                      <MenuItem value=">"> Greater than</MenuItem>
                      <MenuItem value="<">Less than</MenuItem>
                      <MenuItem value="=">Equals</MenuItem>
                      <MenuItem value=">=">Greater than or equal</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name="value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Value"
                      error={!!errors.value}
                      helperText={getErrorMessage(errors.value?.message)}
                    />
                  )}
                />
              </>
            ) : (
              <>
                <Controller
                  name="deviceUuid"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Device UUID"
                      error={!!errors.deviceUuid}
                      helperText={getErrorMessage(errors.deviceUuid?.message)}
                    />
                  )}
                />
                <Controller
                  name="stateName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State Name"
                      error={!!errors.stateName}
                      helperText={getErrorMessage(errors.stateName?.message)}
                    />
                  )}
                />
                <Controller
                  name="stateValue"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State Value"
                      error={!!errors.stateValue}
                      helperText={getErrorMessage(errors.stateValue?.message)}
                    />
                  )}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('ruleEngine.ruleNode.cancel')}</Button>
          <Button type="submit" variant="contained" color="primary">
            {t('ruleEngine.ruleNode.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NodeDialog; 