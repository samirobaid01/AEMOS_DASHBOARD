import React from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Plus, AlertCircle } from 'lucide-react';
import AreaItem from './AreaItem';
import AreaFilter from './AreaFilter';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button/Button';
import type { AreaListProps } from './types';

const AreaList: React.FC<AreaListProps> = ({
  areas,
  error,
  searchTerm,
  setSearchTerm,
  organizationFilter,
  setOrganizationFilter,
  organizations,
  onAddArea,
  windowWidth
}) => {
  const { t } = useTranslation();

  const PageHeader = (
    <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Map className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 flex items-center gap-2">
            {t('areas.title')}
            {areas.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 tabular-nums">
                {areas.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mt-0.5">
            {t('areas.subtitle', { defaultValue: 'Organize your fields and zones' })}
          </p>
        </div>
      </div>
      <Button type="button" variant="primary" onClick={onAddArea} leftIcon={<Plus className="w-4 h-4" />}>
        {t('areas.add')}
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
      <AreaFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        organizationFilter={organizationFilter}
        setOrganizationFilter={setOrganizationFilter}
        organizations={organizations}
        windowWidth={windowWidth}
      />
      {areas.length === 0 ? (
        <EmptyState
          title={t('areas.no_areas_found')}
          description={t('areas.no_areas_found_description')}
          actionLabel={t('areas.add')}
          onAction={onAddArea}
        />
      ) : (
        <div>
          {areas.map((area) => (
            <AreaItem key={area.id} area={area} windowWidth={windowWidth} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaList;
