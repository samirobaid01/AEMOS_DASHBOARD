import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColors } from "../../hooks/useThemeColors";
import Modal from "../common/Modal/Modal";
import { 
  nodeFormResolver,
  defaultNodeFormValues,
  formatNodeData,
  type NodeFormData,
  type FilterConfig,
  type ActionConfig,
} from "../../containers/RuleEngine/RuleEdit";

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
  const { darkMode } = useTheme();
  const colors = useThemeColors();
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

  const formGroupStyle = {
    marginBottom: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textPrimary : '#111827',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: darkMode ? colors.surfaceBackground : 'white',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    borderRadius: '0.375rem',
    color: darkMode ? colors.textPrimary : '#111827',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='${encodeURIComponent(darkMode ? '#9CA3AF' : '#6B7280')}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  };

  const errorStyle = {
    color: darkMode ? colors.dangerText : '#dc2626',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  };

  const modalFooter = (
    <>
      <button
        onClick={onClose}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? colors.surfaceBackground : 'white',
          color: darkMode ? colors.textSecondary : '#4b5563',
          border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? colors.background : '#f3f4f6';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? colors.surfaceBackground : 'white';
        }}
      >
        {t('common.cancel')}
      </button>
      <button
        type="submit"
        form="nodeForm"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#5d8efa' : '#2563eb';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#4d7efa' : '#3b82f6';
        }}
      >
        {t('common.save')}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={t("ruleEngine.ruleNode.title")}
      footer={modalFooter}
    >
      <form id="nodeForm" onSubmit={handleSubmit(handleFormSubmit)}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>{t("ruleEngine.ruleNode.nodeType")}</label>
          <select
            {...register("type")}
            style={selectStyle}
            onChange={(e) => {
              register("type").onChange(e);
              setNodeType(e.target.value as "filter" | "action");
            }}
          >
            <option value="filter">Filter</option>
            <option value="action">Action</option>
          </select>
          {errors.type && (
            <p style={errorStyle}>{errors.type.message}</p>
          )}
        </div>

        {type === "filter" ? (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>{t("ruleEngine.ruleNode.sourceType")}</label>
              <select
                {...register("config.sourceType")}
                style={selectStyle}
              >
                <option value="sensor">Sensor</option>
              </select>
              {getConfigError("sourceType") && (
                <p style={errorStyle}>{getConfigError("sourceType")}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Sensor UUID</label>
              <input
                {...register("config.UUID")}
                style={inputStyle}
                type="text"
              />
              {getConfigError("UUID") && (
                <p style={errorStyle}>{getConfigError("UUID")}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Sensor Key</label>
              <input
                {...register("config.key")}
                style={inputStyle}
                type="text"
              />
              {getConfigError("key") && (
                <p style={errorStyle}>{getConfigError("key")}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Operator</label>
              <select
                {...register("config.operator")}
                style={selectStyle}
              >
                <option value=">">Greater than</option>
                <option value="<">Less than</option>
                <option value="=">Equals</option>
                <option value=">=">Greater than or equal</option>
              </select>
              {getConfigError("operator") && (
                <p style={errorStyle}>{getConfigError("operator")}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Value</label>
              <input
                {...register("config.value")}
                style={inputStyle}
                type="number"
              />
              {getConfigError("value") && (
                <p style={errorStyle}>{getConfigError("value")}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Device UUID</label>
              <input
                {...register("config.deviceUuid")}
                style={inputStyle}
                type="text"
              />
              {getConfigError("deviceUuid") && (
                <p style={errorStyle}>{getConfigError("deviceUuid")}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>State Name</label>
              <input
                {...register("config.stateName")}
                style={inputStyle}
                type="text"
              />
              {getConfigError("stateName") && (
                <p style={errorStyle}>{getConfigError("stateName")}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>State Value</label>
              <input
                {...register("config.stateValue")}
                style={inputStyle}
                type="text"
              />
              {getConfigError("stateValue") && (
                <p style={errorStyle}>{getConfigError("stateValue")}</p>
              )}
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default NodeDialog;
