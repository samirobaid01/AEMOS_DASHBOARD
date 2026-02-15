import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/store';
import {
  fetchAreaById,
  selectSelectedArea,
  selectAreasLoading,
  selectAreasError,
  deleteArea
} from '../../state/slices/areas.slice';
import { fetchSensorsByAreaId } from '../../state/slices/sensors.slice';
import { fetchOrganizationById } from '../../state/slices/organizations.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import AreaDetails from '../../components/areas/AreaDetails';

const AreaDetailsContainer = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const area = useAppSelector(selectSelectedArea);
  const isLoading = useAppSelector(selectAreasLoading);
  const error = useAppSelector(selectAreasError);
  const [, setIsDeleting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (id) {
      const areaId = parseInt(id, 10);
      dispatch(fetchAreaById(areaId));
      dispatch(fetchSensorsByAreaId(areaId));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (area?.organizationId) {
      dispatch(fetchOrganizationById(area.organizationId));
    }
  }, [dispatch, area?.organizationId]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(deleteArea(parseInt(id, 10)));
      if (deleteArea.fulfilled.match(resultAction)) {
        if (area?.organizationId) {
          navigate(`/organizations/${area.organizationId}`);
        } else {
          navigate('/areas');
        }
      }
    } catch (error) {
      console.error('Error deleting area:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/areas/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/areas');
  };

  if (isLoading && !area) {
    return <LoadingScreen />;
  }

  return (
    <AreaDetails
      area={area}
      isLoading={isLoading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
      windowWidth={windowWidth}
    />
  );
};

export default AreaDetailsContainer; 