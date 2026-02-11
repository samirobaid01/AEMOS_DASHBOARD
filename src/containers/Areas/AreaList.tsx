import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import { fetchAreas, selectAreas, selectAreasLoading, selectAreasError, selectSelectedArea, fetchAreasByOrganizationId } from '../../state/slices/areas.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { AreaList } from '../../components/areas';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';

const AreaListContainer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const areasData = useAppSelector(selectAreas);
  const isLoading = useAppSelector(selectAreasLoading);
  const organization = useAppSelector(selectSelectedOrganizationId);
  const error = useAppSelector(selectAreasError);
  const selectedArea = useAppSelector(selectSelectedArea);
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Handle window resize
  useEffect(() => {

    console.log('selectedArea', selectedArea);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Ensure areas is always an array with defensive check
  const areas = Array.isArray(areasData) ? areasData : [];
  
  useEffect(() => {
    if(organization) {
      console.log('organization for which areas are fetched', organization);
      //dispatch(fetchAreas({ organizationId: parseInt(organization.toString(), 10) }));
      const resp = dispatch(fetchAreasByOrganizationId(parseInt(organization.toString(), 10)));
      console.log('resp after fetching areas by organization', resp);
    } else {
      dispatch(fetchAreas());
    }
  }, [dispatch,organization]);
  
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
      areas={selectedArea ? [selectedArea] : areas}
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