import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchOrganizations, selectOrganizations } from '../../../state/slices/organizations.slice';
import { selectSelectedOrganizationId, setSelectedOrganization } from '../../../state/slices/auth.slice';
import type { AppDispatch } from '../../../state/store';
import { useTheme } from '../../../context/ThemeContext';

const OrganizationSelector: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const organizations = useSelector(selectOrganizations);
  const selectedOrganizationId = useSelector(selectSelectedOrganizationId);
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useTheme();

  // This useEffect must always run and not be in a conditional
  useEffect(() => {
    console.log('OrganizationSelector: Fetching organizations...');
    dispatch(fetchOrganizations());
  }, [dispatch]);

  // This useEffect must always run and not be in a conditional
  useEffect(() => {
    console.log('OrganizationSelector: Organizations changed:', organizations);
    console.log('OrganizationSelector: Selected organization ID:', selectedOrganizationId);
    
    // If no organization is selected yet and we have organizations available, select the first one
    if ((!selectedOrganizationId || !organizations.find(org => org.id === selectedOrganizationId)) && organizations.length > 0) {
      console.log('OrganizationSelector: Auto-selecting first organization:', organizations[0].id);
      dispatch(setSelectedOrganization(organizations[0].id));
    }
  }, [dispatch, selectedOrganizationId, organizations]);
  
  // This useEffect must always run and not be in a conditional
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find the currently selected organization
  const selectedOrganization = organizations.find(org => org.id === selectedOrganizationId);

  // If no organizations exist yet, don't render
  if (organizations.length === 0) {
    console.log('OrganizationSelector: Not rendering - no organizations available');
    return null;
  }

  // Dropdown styles
  const dropdownContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const dropdownButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: darkMode ? '#374151' : 'white',
    color: darkMode ? '#d1d5db' : '#374151',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  };

  const dropdownMenuStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    marginTop: '0.5rem',
    width: '250px',
    maxHeight: '300px',
    overflowY: 'auto',
    backgroundColor: darkMode ? '#1f2937' : 'white',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 50,
    display: isOpen ? 'block' : 'none',
  };

  const dropdownItemStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#16a34a' : 'transparent',
    color: isSelected ? 'white' : darkMode ? '#d1d5db' : '#374151',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  });

  const dropdownHeaderStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: '1rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    backgroundColor: darkMode ? '#111827' : '#f9fafb',
    borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
  };

  // Determine if we should show dropdown menu and arrow
  const showDropdownControls = organizations.length > 1;

  const handleSelectOrganization = (organizationId: number) => {
    console.log('OrganizationSelector: Selecting organization:', organizationId);
    dispatch(setSelectedOrganization(organizationId));
    setIsOpen(false);
  };

  return (
    <div style={dropdownContainerStyle} data-dropdown="org-selector">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={dropdownButtonStyle}
      >
        <span style={{ marginRight: '8px' }}>🏢</span>
        <span>
          {selectedOrganization ? selectedOrganization.name : t('organizations.select_organization')}
        </span>
        {/* Only show dropdown arrow if there are multiple organizations */}
        {showDropdownControls && (
          <svg
            style={{ width: '16px', height: '16px', marginLeft: '8px' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        )}
      </button>

      {/* Only show dropdown menu if there are multiple organizations */}
      {showDropdownControls && (
        <div style={dropdownMenuStyle}>
          <div style={dropdownHeaderStyle}>
            {t('organizations.your_organizations')}
          </div>
          {organizations.map((org) => (
            <div
              key={org.id}
              style={dropdownItemStyle(org.id === selectedOrganizationId)}
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