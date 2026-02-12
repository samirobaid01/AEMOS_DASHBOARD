import React from "react";
import { useTranslation } from "react-i18next";
import type { RuleChain } from "../../types/ruleEngine";
import RuleItem from "./RuleItem";
import RuleFilter from "./RuleFilter";
import EmptyState from "./EmptyState";
import Button from "../common/Button/Button";

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
  rules = [],
  error,
  searchTerm,
  onSearchChange,
  onAddRule,
  windowWidth = window.innerWidth,
}) => {
  const safeRules = rules ?? [];
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  if (error) {
    return (
      <div className={`bg-background dark:bg-background-dark ${isMobile ? "p-4" : "p-6 px-8"}`}>
        <div className={`flex ${isMobile ? "flex-col items-stretch" : "flex-row justify-between items-center"} gap-4 mb-6`}>
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0 font-sans">
            {t("ruleEngine.title")}
          </h1>
          <Button type="button" onClick={onAddRule}>
            {t("ruleEngine.add")}
          </Button>
        </div>
        <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-4 rounded-md mb-6 text-sm font-medium flex items-center">
          <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
    <div className={`bg-background dark:bg-background-dark ${isMobile ? "p-4" : "p-6 px-8"}`}>
      <div className={`flex ${isMobile ? "flex-col items-stretch" : "flex-row justify-between items-center"} gap-4 mb-6`}>
        <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0 font-sans">
          {t("ruleEngine.title")}
        </h1>
        <Button type="button" onClick={onAddRule}>
          <svg className="w-4 h-4 mr-1.5 inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {t("ruleEngine.add")}
        </Button>
      </div>

      <RuleFilter
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        windowWidth={windowWidth}
      />

      {safeRules.length === 0 ? (
        <EmptyState
          message={t("ruleEngine.noRules")}
          description={t("ruleEngine.noRuleFound")}
          actionLabel={t("ruleEngine.add")}
          onAction={onAddRule}
        />
      ) : (
        <div>
          {safeRules.map((rule) => (
            <RuleItem key={rule.id} rule={rule} windowWidth={windowWidth} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RuleList;
