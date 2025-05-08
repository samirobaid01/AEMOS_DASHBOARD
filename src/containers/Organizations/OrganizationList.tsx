import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { 
  fetchOrganizations, 
  selectOrganizations, 
  selectOrganizationsLoading,
  selectOrganizationsError
} from '../../state/slices/organizations.slice';
import { OrganizationList as OrganizationListComponent } from '../../components/organizations';
import type { OrganizationFilterParams } from '../../types/organization';

const OrganizationList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const organizations = useSelector(selectOrganizations);
  const isLoading = useSelector(selectOrganizationsLoading);
  const error = useSelector(selectOrganizationsError);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [filters, setFilters] = useState<OrganizationFilterParams>({});
  
  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: OrganizationFilterParams = { ...filters };
    
    if (searchTerm) {
      newFilters.search = searchTerm;
    } else {
      delete newFilters.search;
    }
    
    if (statusFilter !== undefined) {
      newFilters.status = statusFilter;
    } else {
      delete newFilters.status;
    }
    
    setFilters(newFilters);
    dispatch(fetchOrganizations(newFilters));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(undefined);
    setFilters({});
    dispatch(fetchOrganizations({}));
  };

  const handleAddOrganization = () => {
    navigate('/organizations/create');
  };
  
  return (
    <OrganizationListComponent
      organizations={organizations}
      filteredOrganizations={organizations}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      onSubmitFilter={handleSearch}
      onClearFilter={clearFilters}
      onAddOrganization={handleAddOrganization}
      isLoading={isLoading}
      error={error}
      windowWidth={windowWidth}
    />
  );
};

export default OrganizationList; 