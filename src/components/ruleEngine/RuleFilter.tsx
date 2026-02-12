import React from 'react';
import { useTranslation } from 'react-i18next';
import FormField from '../common/FormField';

interface RuleFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  windowWidth?: number;
}

const inputClasses =
  'w-full px-3 py-2 text-sm text-textPrimary dark:text-textPrimary-dark bg-surface dark:bg-surface-dark rounded border border-border dark:border-border-dark outline-none focus:ring-2 focus:ring-primary shadow-sm';

const RuleFilter: React.FC<RuleFilterProps> = ({
  searchTerm,
  onSearchChange,
  windowWidth = window.innerWidth
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  return (
    <div
      className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 mb-6 p-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm`}
    >
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
