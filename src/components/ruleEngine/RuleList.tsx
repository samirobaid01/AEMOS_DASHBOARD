import React from "react";
import { useTranslation } from "react-i18next";
import { Zap, Plus, AlertCircle } from "lucide-react";
import RuleItem from "./RuleItem";
import RuleFilter from "./RuleFilter";
import EmptyState from '../common/EmptyState';
import Button from "../common/Button/Button";
import type { RuleListProps } from './types';

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

  const PageHeader = (
    <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Zap className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 flex items-center gap-2">
            {t("ruleEngine.title")}
            {safeRules.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 tabular-nums">
                {safeRules.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mt-0.5">
            {t('rules.subtitle', { defaultValue: 'Automate actions from sensor conditions' })}
          </p>
        </div>
      </div>
      <Button type="button" variant="primary" onClick={onAddRule} leftIcon={<Plus className="w-4 h-4" />}>
        {t("ruleEngine.add")}
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        {PageHeader}
        <div className="flex items-center gap-2 p-4 rounded-xl bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      {PageHeader}

      <RuleFilter
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      {safeRules.length === 0 ? (
        <EmptyState
          title={t("ruleEngine.noRules")}
          description={t("ruleEngine.noRuleFound")}
          actionLabel={t("ruleEngine.add")}
          onAction={onAddRule}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {safeRules.map((rule) => (
            <RuleItem key={rule.id} rule={rule} windowWidth={windowWidth} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RuleList;
