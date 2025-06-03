import React from "react";
import { useTranslation } from "react-i18next";
import type { RuleChain } from "../../types/ruleEngine";
import RuleItem from "./RuleItem";
import RuleFilter from "./RuleFilter";
import EmptyState from "./EmptyState";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColors } from "../../hooks/useThemeColors";

interface RuleListProps {
  rules: RuleChain[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddRule: () => void;
  windowWidth?: number;
}

const RuleList: React.FC<RuleListProps> = ({
  rules,
  isLoading,
  error,
  searchTerm,
  onSearchChange,
  onAddRule,
  windowWidth = window.innerWidth,
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    flexDirection: isMobile ? ("column" as const) : ("row" as const),
    marginBottom: "1.5rem",
    gap: isMobile ? "1rem" : "0",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : "#111827",
    margin: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: darkMode ? "#4d7efa" : "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
  };

  const errorStyle = {
    backgroundColor: darkMode ? colors.dangerBackground : "#fee2e2",
    padding: "1rem",
    borderRadius: "0.375rem",
    color: darkMode ? colors.dangerText : "#b91c1c",
    marginBottom: "1.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  };

  if (error) {
    return (
      <div
        style={{
          padding: isMobile ? "1rem" : "1.5rem 2rem",
          backgroundColor: darkMode ? colors.background : "transparent",
        }}
      >
        <div style={headerStyle}>
          <h1 style={titleStyle}>{t("ruleEngine.title")}</h1>
          <button
            onClick={onAddRule}
            style={buttonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#5d8efa"
                : "#2563eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#4d7efa"
                : "#3b82f6";
            }}
          >
            {t("ruleEngine.add")}
          </button>
        </div>
        <div style={errorStyle}>
          <svg
            style={{
              width: "1.25rem",
              height: "1.25rem",
              marginRight: "0.5rem",
            }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? "1rem" : "1.5rem 2rem",
        backgroundColor: darkMode ? colors.background : "transparent",
      }}
    >
      <div style={headerStyle}>
        <h1 style={titleStyle}>{t("ruleEngine.title")}</h1>
        <button
          onClick={onAddRule}
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = darkMode
              ? "#5d8efa"
              : "#2563eb";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = darkMode
              ? "#4d7efa"
              : "#3b82f6";
          }}
        >
          <svg
            style={{ width: "1rem", height: "1rem", marginRight: "0.375rem" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {t("ruleEngine.add")}
        </button>
      </div>

      <RuleFilter
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        windowWidth={windowWidth}
      />

      {rules.length === 0 ? (
        <EmptyState
          message={t("ruleEngine.noRules")}
          description={t("ruleEngine.noRuleFound")}
          actionLabel={t("ruleEngine.add")}
          onAction={onAddRule}
        />
      ) : (
        <div>
          {rules.map((rule) => (
            <RuleItem key={rule.id} rule={rule} windowWidth={windowWidth} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RuleList;
