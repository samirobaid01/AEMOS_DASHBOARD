import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { useTranslation } from 'react-i18next';
import { fetchOrganizations, selectOrganizations } from '../../../state/slices/organizations.slice';
import { selectSelectedOrganizationId, setSelectedOrganization } from '../../../state/slices/auth.slice';
import Button from '../Button/Button';

const OrganizationSelector: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganizations);
  const selectedOrganizationId = useAppSelector(selectSelectedOrganizationId);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if ((!selectedOrganizationId || !organizations.find(org => org.id === selectedOrganizationId)) && organizations.length > 0) {
      dispatch(setSelectedOrganization(organizations[0].id));
    }
  }, [dispatch, selectedOrganizationId, organizations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOrganization = organizations.find(org => org.id === selectedOrganizationId);

  if (organizations.length === 0) return null;

  const showDropdownControls = organizations.length > 1;

  const handleSelectOrganization = (organizationId: number) => {
    dispatch(setSelectedOrganization(organizationId));
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" data-dropdown="org-selector">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center py-2 px-3 text-sm font-medium rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark"
      >
        <span className="mr-2">🏢</span>
        <span>
          {selectedOrganization ? selectedOrganization.name : t('organizations.select_organization')}
        </span>
        {showDropdownControls && (
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        )}
      </Button>

      {showDropdownControls && (
        <div
          className={`absolute right-0 mt-2 w-[250px] max-h-[300px] overflow-y-auto rounded border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-lg z-50 ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="px-4 py-2 text-xs font-semibold text-textMuted dark:text-textMuted-dark bg-surfaceHover dark:bg-surfaceHover-dark border-b border-border dark:border-border-dark">
            {t('organizations.your_organizations')}
          </div>
          {organizations.map((org) => (
            <div
              key={org.id}
              className={`px-4 py-2.5 cursor-pointer text-sm ${
                org.id === selectedOrganizationId
                  ? 'bg-primary dark:bg-primary-dark text-white'
                  : 'text-textPrimary dark:text-textPrimary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark'
              }`}
              onClick={() => handleSelectOrganization(org.id)}
            >
              {org.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationSelector;
