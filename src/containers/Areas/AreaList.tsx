import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../state/store';
import { fetchAreas, selectAreas, selectAreasLoading, selectAreasError } from '../../state/slices/areas.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { AreaList } from '../../components/areas';

const AreaListContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const areasData = useSelector(selectAreas);
  const isLoading = useSelector(selectAreasLoading);
  const error = useSelector(selectAreasError);
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Ensure areas is always an array with defensive check
  const areas = Array.isArray(areasData) ? areasData : [];
  
  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);
  
  // Apply defensive check before filtering
  const filteredAreas = areas.filter(area => {
    const matchesSearch = 
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (area.description && area.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesOrganization = organizationFilter === '' || 
      (area.organization && area.organization.name === organizationFilter);
    
    return matchesSearch && matchesOrganization;
  });
  
  // Get unique organization names for filter
  const organizations = Array.from(new Set(
    areas
      .filter(area => area.organization && area.organization.name)
      .map(area => area.organization!.name)
  ));
  
  if (isLoading && areas.length === 0) {
    return <LoadingScreen />;
  }
  
  const handleAddArea = () => {
    navigate('/areas/create');
  };
  
  return (
    <AreaList
      areas={areas}
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      organizationFilter={organizationFilter}
      setOrganizationFilter={setOrganizationFilter}
      organizations={organizations}
      onAddArea={handleAddArea}
      windowWidth={windowWidth}
    />
  );
};

export default AreaListContainer; 