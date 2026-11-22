import React from 'react';
import { useTranslation } from 'react-i18next';
import FormField from '../common/FormField';
import type { RuleFilterProps } from './types';

const inputClasses =
  'w-full px-3 py-2 text-sm text-textPrimary dark:text-textPrimary-dark bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark shadow-sm outline-none focus:ring-2 focus:ring-primary';

const RuleFilter: React.FC<RuleFilterProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm">
      <div className="flex flex-col flex-1">
        <FormField label={t('common.search')} id="ruleSearch">
          <input
            id="ruleSearch"
            type="text"
            placeholder={t('ruleEngine.searchRule')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={inputClasses}
          />
        </FormField>
      </div>
    </div>
  );
};

export default RuleFilter;
