import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button/Button';
import type { OrganizationItemProps } from './types';

const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const OrganizationItem: React.FC<OrganizationItemProps> = React.memo(({ organization, windowWidth }) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  const statusStyles =
    organization.status === 'active'
      ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
      : organization.status === 'inactive'
        ? 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
        : 'bg-border dark:bg-border-dark text-textSecondary dark:text-textSecondary-dark';

  const dotStyles =
    organization.status === 'active'
      ? 'bg-success dark:bg-success-dark'
      : organization.status === 'inactive'
        ? 'bg-danger dark:bg-danger-dark'
        : 'bg-textMuted dark:bg-textMuted-dark';

  return (
    <div className="block p-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm dark:shadow-md mb-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex flex-col sm:flex-row justify-between gap-4 ${isMobile ? '' : 'flex-row'}`}>
        <div className={`flex flex-col sm:flex-row gap-4 flex-1 ${isMobile ? 'items-center' : 'items-start'}`}>
          <div
            className={`rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark flex items-center justify-center flex-shrink-0 overflow-hidden ${
              isMobile ? 'w-12 h-12' : 'w-14 h-14'
            }`}
          >
            {organization.image ? (
              <img src={organization.image} alt={organization.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-semibold text-textMuted dark:text-textMuted-dark">
                {organization.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className={`flex-1 min-w-0 ${isMobile ? 'text-center' : 'text-left'}`}>
            <h3 className="text-lg font-semibold text-info dark:text-info-dark truncate m-0 mb-1">
              {organization.name}
            </h3>
            {organization.detail && (
              <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mb-2 line-clamp-2 leading-snug">
                {organization.detail}
              </p>
            )}
            <div
              className={`flex gap-1 text-xs text-textMuted dark:text-textMuted-dark ${
                isMobile ? 'flex-col items-center' : 'flex-row items-start'
              }`}
            >
              {organization.email && (
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{organization.email}</span>
                </div>
              )}
              {organization.contactNumber && (
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{organization.contactNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`flex flex-col gap-4 ${isMobile ? 'items-center' : 'items-end'} justify-center`}>
          <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${statusStyles}`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${dotStyles}`} />
            {t(organization.status)}
          </span>
          <div className="flex gap-3">
            <Link to={`/organizations/${organization.id}/edit`}>
              <Button variant="outline" size="sm" leftIcon={<EditIcon />}>
                {t('edit')}
              </Button>
            </Link>
            <Link to={`/organizations/${organization.id}`}>
              <Button variant="primary" size="sm" leftIcon={<ViewIcon />}>
                {t('view')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrganizationItem;
