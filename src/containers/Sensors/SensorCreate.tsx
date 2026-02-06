import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AppDispatch } from '../../state/store';
import { createSensor, selectSensorsLoading, selectSensorsError } from '../../state/slices/sensors.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import type { SensorCreateRequest, SensorUpdateRequest } from '../../types/sensor.d';
import SensorForm from '../../components/sensors/SensorForm';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { selectSelectedOrganization } from '../../state/slices/organizations.slice';
import { toastService } from '../../services/toastService';

const SensorCreate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const areaId = searchParams.get('areaId');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const organization = useSelector(selectSelectedOrganization);
  const isLoading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);
  const areas = useSelector(selectAreas) || [];
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch areas
  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);
  
  // Handle form submission
  const handleSubmit = async (data: SensorCreateRequest | SensorUpdateRequest) => {
    // Create a properly typed SensorCreateRequest
    // if (!organization?.id) {
    //   toastService.error('Organization ID is required to create a sensor.');
    //   throw new Error('Organization ID is required to create a sensor.');
    // }
    const formData: SensorCreateRequest = {
      //organizationId: parseInt(organization.id.toString(), 10),
      name: data.name || '',
      areaId: data.areaId || (areaId ? parseInt(areaId, 10) : 0),
    //  type: data.type || '',
      status: data.status !== undefined ? data.status : 'active',
      description: data.description,
      metadata: data.metadata
    };
    
    // Ensure the required fields are set
    if (!formData.name || !formData.areaId) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(createSensor(formData));
      if (createSensor.fulfilled.match(resultAction)) {
        if (areaId) {
          navigate(`/areas/${areaId}`);
        } else {
          navigate('/sensors');
        }
      }
    } catch (error) {
      console.error('Error creating sensor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (areaId) {
      navigate(`/areas/${areaId}`);
    } else {
      navigate('/sensors');
    }
  };
  
  // Show loading screen if areas are still loading
  if (isLoading && !Array.isArray(areas)) {
    return <LoadingScreen />;
  }
  
  return (
    <SensorForm
      areas={areas}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      windowWidth={windowWidth}
    />
  );
};

export default SensorCreate; 