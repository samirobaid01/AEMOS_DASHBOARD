import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import { 
  fetchOrganizations, 
  selectOrganizations, 
  selectOrganizationsLoading,
  selectOrganizationsError
} from '../../state/slices/organizations.slice';
import { OrganizationList as OrganizationListComponent } from '../../components/organizations';
import type { OrganizationFilterParams } from '../../types/organization';

const OrganizationList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const organizations = useAppSelector(selectOrganizations);
  const isLoading = useAppSelector(selectOrganizationsLoading);
  const error = useAppSelector(selectOrganizationsError);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrganizationFilterParams['status']>(undefined);
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