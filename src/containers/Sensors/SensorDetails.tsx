import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import {
  fetchSensorById,
  selectSelectedSensor,
  selectSensorsLoading,
  selectSensorsError,
  deleteSensor
} from '../../state/slices/sensors.slice';
import { fetchAreaById } from '../../state/slices/areas.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import SensorDetailsComponent from '../../components/sensors/SensorDetails';

// Import modal component or use your own
interface ConfirmModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  windowWidth: number;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
  windowWidth
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        maxWidth: '32rem',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              flexShrink: 0
            }}>
              <svg style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                color: '#111827', 
                marginBottom: '0.5rem' 
              }}>
                {title}
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                marginBottom: '1rem'
              }}>
                {message}
              </p>
            </div>
          </div>
        </div>
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          padding: '1rem', 
          backgroundColor: '#f9fafb', 
          display: 'flex', 
          justifyContent: 'flex-end',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '0.5rem'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              color: '#4b5563',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              order: isMobile ? 2 : 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              order: isMobile ? 1 : 2
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
            }}
          >
            {isLoading ? t('deleting') : t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

const SensorDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const sensor = useSelector(selectSelectedSensor);
  const isLoading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch sensor by ID and its associated area
  useEffect(() => {
    if (id) {
      const sensorId = parseInt(id, 10);
      dispatch(fetchSensorById(sensorId));
    }
  }, [dispatch, id]);

  // Fetch area details when sensor loads
  useEffect(() => {
    if (sensor?.areaId) {
      dispatch(fetchAreaById(sensor.areaId));
    }
  }, [dispatch, sensor?.areaId]);

  // Handle navigation to edit page
  const handleEdit = () => {
    if (id) {
      navigate(`/sensors/${id}/edit`);
    }
  };

  // Handle navigating back to sensors list
  const handleBack = () => {
    navigate('/sensors');
  };

  // Handle deletion
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(deleteSensor(parseInt(id, 10)));
      if (deleteSensor.fulfilled.match(resultAction)) {
        navigate('/sensors');
      }
    } catch (error) {
      console.error('Error deleting sensor:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (isLoading && !sensor) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SensorDetailsComponent
        sensor={sensor}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={() => setDeleteModalOpen(true)}
        onBack={handleBack}
        windowWidth={windowWidth}
      />

      <ConfirmModal
        title={t('delete_sensor')}
        message={t('delete_sensor_confirm', { name: sensor?.name || '' })}
        isOpen={deleteModalOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        windowWidth={windowWidth}
      />
    </>
  );
};

export default SensorDetails; 