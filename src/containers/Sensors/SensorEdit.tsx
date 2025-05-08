import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '../../state/store';
import {
  fetchSensorById,
  updateSensor,
  selectSelectedSensor,
  selectSensorsLoading,
  selectSensorsError
} from '../../state/slices/sensors.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import type { SensorUpdateRequest } from '../../types/sensor';
import SensorForm from '../../components/sensors/SensorForm';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';

const SensorEdit = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const sensor = useSelector(selectSelectedSensor);
  const areas = useSelector(selectAreas) || [];
  const isLoading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch sensor and areas data
  useEffect(() => {
    if (id) {
      dispatch(fetchSensorById(parseInt(id, 10)));
      dispatch(fetchAreas());
    }
  }, [dispatch, id]);
  
  // Handle form submission
  const handleSubmit = async (data: SensorUpdateRequest) => {
    if (!id) return;
    
    // Ensure required fields are set
    if (!data.name || !data.type) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const resultAction = await dispatch(
        updateSensor({
          id: parseInt(id, 10),
          sensorData: data
        })
      );
      
      if (updateSensor.fulfilled.match(resultAction)) {
        navigate(`/sensors/${id}`);
      }
    } catch (error) {
      console.error('Error updating sensor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    if (id) {
      navigate(`/sensors/${id}`);
    } else {
      navigate('/sensors');
    }
  };
  
  // Show loading screen while data is being fetched
  if (isLoading && !sensor) {
    return <LoadingScreen />;
  }
  
  // Show not found message if sensor doesn't exist
  if (!sensor && !isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        maxWidth: '48rem',
        margin: '0 auto',
        backgroundColor: '#fefce8',
        border: '1px solid #fbbf24',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#854d0e', marginBottom: '1rem' }}>
          Sensor not found
        </h3>
        <button
          onClick={() => navigate('/sensors')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Back to sensors
        </button>
      </div>
    );
  }
  
  return (
    <SensorForm
      sensor={sensor}
      areas={areas}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      windowWidth={windowWidth}
      isEditMode={true}
    />
  );
};

export default SensorEdit; 